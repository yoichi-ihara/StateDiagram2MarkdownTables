// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// const { match } = require('assert');
const vscode = require('vscode');

const START_STATE_POS = 1;
const END_STATE_POS = 3;
const EVENT_POS = 4;
const STATE_POINT_MARK = '[*]';
const STATE_ALIAS_POS = 1;
const ALIAS_AS_POS = 2;

// UML テキストの parse
function parseStateDiaglam(umlText) {
  // state1 -> state2 形式の遷移定義のパース（色や形の指定は対応）
  let matches = umlText.split(/\r\n|\n/).map(line => line.match(/([^ ]+) +-+\w*(\[.+\])*-*> +([^ ]+) +: +([^ ]+)/)).filter(match => match);
  // state による alias 指定のパース
  let states = umlText.split(/\r\n|\n/).map(line => line.match(/state +"([^"]+)" +as +([^ ]+)/)).filter(match => match);

  if (matches.length === 0) {
    // 遷移定義なかったら何もしない
    return null;
  }

  // 要らない部分（色や形の指定）を削除（以前のパースの位置を守りたいため）
  // matches.forEach(match => match.splice(2,1));

  // alias 定義を適用（定義に従ってパースした結果の全部を置き換え）
  const aliases = {};
  states.forEach(alias => {
    aliases[alias[ALIAS_AS_POS]] = alias[STATE_ALIAS_POS];
  });

  matches.forEach(match => {
    if (match[START_STATE_POS] in aliases) {
      match[START_STATE_POS] = aliases[match[START_STATE_POS]];
    }
    if (match[END_STATE_POS] in aliases) {
      match[END_STATE_POS] = aliases[match[END_STATE_POS]];
    }
  });


  // ソート順を決める（状態とイベントそれぞれに）
  let orderMapState = {};
  let orderCountState = 0;
  let orderMapEvents = {};
  let orderCountEvents = 0;

  matches.forEach(match => {
    if (match[START_STATE_POS] === STATE_POINT_MARK) {
      // 開始の [*] は先頭
      orderMapState[match[END_STATE_POS]] = -1;
      orderMapEvents[match[EVENT_POS]] = -1;
    }
    else if (match[END_STATE_POS] === STATE_POINT_MARK) {
      // 終了の [*] は末尾
      orderMapState[match[START_STATE_POS]] = Number.MAX_VALUE;
      orderMapEvents[match[EVENT_POS]] = Number.MAX_VALUE;
    }
    // 後は最初に出てきた順番
    if (orderMapState[match[START_STATE_POS]] == null) {
      orderMapState[match[START_STATE_POS]] = orderCountState++;
    }
    if (orderMapState[match[END_STATE_POS]] == null) {
      orderMapState[match[END_STATE_POS]] = orderCountState++;
    }
    if (orderMapEvents[match[EVENT_POS]] == null) {
      orderMapEvents[match[EVENT_POS]] = orderCountEvents++;
    }
  });

  // パースした結果を↑に従ってソート
  matches.sort((a, b) => {
    let a2 = a[START_STATE_POS]
    let b2 = b[START_STATE_POS];
    let isFirst = true;

    if (a2 === b2) {
      isFirst = false;
      a2 = a[END_STATE_POS];
      b2 = b[END_STATE_POS]
    }

    if (a2 !== b2) {
      // 開始か終了かに応じて [*] の前後判定
      if (a2 === STATE_POINT_MARK) {
        return isFirst ? -1 : 1;
      }
      else if (b2 === STATE_POINT_MARK) {
        return isFirst ? 1 : -1;
      }
    }

    if (!isFirst) {
      // 開始が一致している場合はイベントでソート判定
      return orderMapEvents[a[EVENT_POS]] > orderMapEvents[b[EVENT_POS]] ? 1 : -1;
    }

    // 開始が一致してない場合に開始状態でソート判定
    if (orderMapState[a2] > orderMapState[b2]) {
      return 1;
    }
    else {
      return -1;
    }
  });

  // 開始のステートを全部ピックアップ（ソート済みなのでその順番に従う）
  const startStates = Array.from(new Set(matches.map(match => match[START_STATE_POS])));

  // イベントを全部ピックアップ＋ソート
  const events = Array.from(new Set(matches.map(match => match[EVENT_POS]))).sort((a, b) => {
    if (orderMapEvents[a] > orderMapEvents[b]) {
      return 1;
    }
    else if (orderMapEvents[a] < orderMapEvents[b]) {
      return -1;
    }
    else {
      return 0;
    }
  });


  // デバッグ出力
  console.log(matches);
  console.log(aliases)
  console.log(startStates);
  console.log(orderMapState);
  console.log(events);
  console.log(orderMapEvents);

  return {
    // パースした結果を返す
    matches: matches,
    startStates: startStates,
    events: events
  };
}


// 状態遷移表を作成する
function changeToStateTransitionTable(diaglamInfo) {

  if (!diaglamInfo) {
    return null;
  }

  const { matches, startStates, events } = diaglamInfo;


  // N/A で埋まった表を作って、適切な位置に状態を適用
  let statesTable = new Array(startStates.length);

  for (let i = 0; i < statesTable.length; i++) {
    // 縦方向に状態、横方向にイベント分の N/A を埋める
    statesTable[i] = new Array(events.length + 1).fill("N/A");
    // 横位置の先頭位置は状態のラベル
    statesTable[i][0] = startStates[i];
  }
  matches.forEach(match => {
    // 縦方向で状態、横方向でイベントに対応する位置に遷移状態を埋める
    const posY = startStates.indexOf(match[START_STATE_POS]);
    const posX = events.indexOf(match[EVENT_POS]) + 1;
    statesTable[posY][posX] = match[END_STATE_POS];
  });
  console.log(statesTable);

  // 表テキストの作成
  let statesTableText = `| |${events.join('|')}|\n`;
  statesTableText += `|${' :----: |'.repeat(events.length + 1)}\n`;
  statesTableText += `${statesTable.map(line => `|${line.join('|')}|`).join('\n')}`;

  return statesTableText;
}

// N-スイッチカバレッジ表テキストの作成
// 再帰呼び出しで N スイッチを作れるようになっている
function makeNSwitchCoverage(diaglamInfo, depth, coverageTable) {
  const { matches } = diaglamInfo;

  let table = [];
  if (!coverageTable) {
    // １階層目は 0 スイッチ分を素直に作る
    matches.forEach(match => {
      table.push([match[START_STATE_POS], match[EVENT_POS], match[END_STATE_POS]]);
    });
  }
  else {
    // 2階層目は +1 スイッチ分作る（0スイッチ分を掛け算する）
    coverageTable.forEach(line => {
      const last = line[line.length - 1];
      if (last === STATE_POINT_MARK) {
        return;
      }
      matches.filter(match => match[START_STATE_POS] === last).forEach(match => {
        table.push([...line, match[EVENT_POS], match[END_STATE_POS]]);
      });
    });
  }

  console.log(table);

  if (depth === 0) {
    // 最下層まで来たら戻す
    return table;
  }

  // ＋１分を再帰呼び出しで作る
  return makeNSwitchCoverage(diaglamInfo, depth - 1, table);
}

function changeToNSwitchCoverage(diaglamInfo, depth) {

  if (!diaglamInfo) {
    return null;
  }

  // depth 分のスイッチカバレッジを作る
  const coverageTable = makeNSwitchCoverage(diaglamInfo, depth, null);

  if (!coverageTable || coverageTable.length === 0) {
    return null;
  }
  // 作ったテーブルデータを元に Markdown の表テキストを生成して返す
  const length = coverageTable[0].length;
  let tableText = `|state${'|event|state'.repeat((length - 1) / 2)}|\n`;
  tableText += `|${' :----: |'.repeat(length)}\n`;

  return tableText + coverageTable.map(line => `|${line.join('|')}|`).join('\n') + '\n';
}

function changeTextToMarkdown (plantUmlText) {
  if (!plantUmlText) {
    return;
  }


  // 状態遷移図の PlantUML 記述をパース
  const diaglamInfo = parseStateDiaglam(plantUmlText);

  if (!diaglamInfo) {
    // パースできないら何もしない
    return;
  }

  // 状態遷移表を作成する
  const stateTransitionTable = changeToStateTransitionTable(diaglamInfo);

  // N スイッチカバレッジを作成する（深さは設定に従う。デフォルト１）
  let switchCoverages = [];
  // 設定情報を取得
  const config = vscode.workspace.getConfiguration('statediagram2markdowntables');
  const maxDepth = config.get('nSwitchCoveragesDepth', 1);
  for (let i = 0; i <= maxDepth; i++) {
    const result = changeToNSwitchCoverage(diaglamInfo, i);
    if (result) {
      switchCoverages.push(result);
    }
  }

  // テキストを整形して返す
  let i = 0;
  return `## Transition Table

${stateTransitionTable}

${switchCoverages.map(item => `## ${i++} Switch Coverage\n\n${item}`).join('\n')}`;
}

async function main() {
  // エディタ取得
  let editor = vscode.window.activeTextEditor;
  // 選択範囲取得
  let curSelection = editor.selection;

  if (curSelection.isEmpty) {
    // 選択してないなら何もしない
    return;
  }

  const outputText = changeTextToMarkdown(editor.document.getText(curSelection));

  if (outputText) {
    // テキストがあるならクリップボードへ送る
    await vscode.env.clipboard.writeText(outputText);
    // 通知メッセージを表示
    vscode.window.showInformationMessage('Send texts of tables to clipboard !');
  }

}

module.exports.changeTextToMarkdown = changeTextToMarkdown;
module.exports.main = main;
