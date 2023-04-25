// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// const { match } = require('assert');
const vscode = require('vscode');

const START_STATE_POS = 1;
const END_STATE_POS = 2;
const EVENT_POS = 4;
const STATE_POINT_MARK = '[*]';
const STATE_ALIAS_POS = 1;
const ALIAS_AS_POS = 2;

// UML テキストの parse
function parseStateDiaglam(umlText) {
  // state1 -> state2 形式の遷移定義のパース（色や形の指定は対応）
  let matches = umlText.split(/\r\n|\n/).map(line => line.match(/([^ ]+) +-+[^ ]*-*> +([^ ]+)( +: +| +:|: +)(.*[^ ])/)).filter(match => match);
  // state による alias 指定のパース
  let states = umlText.split(/\r\n|\n/).map(line => line.match(/state +"([^"]+)" +as +([^ ]+)/)).filter(match => match);

  if (matches.length === 0) {
    // 遷移定義なかったら何もしない
    return null;
  }

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
      // 開始の [*] の要素は先頭に寄せる
      orderMapState[match[END_STATE_POS]] = -1;
      orderMapEvents[match[EVENT_POS]] = -1;
      orderMapState[STATE_POINT_MARK] = -2;
    }
    else if (match[END_STATE_POS] === STATE_POINT_MARK) {
      // 終了の [*] の要素は末尾に寄せる
      orderMapState[match[START_STATE_POS]] = match.length;
      orderMapEvents[match[EVENT_POS]] = match.length;
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
    let orderA, orderB;
    for (const pos of [START_STATE_POS, EVENT_POS, END_STATE_POS]) {
      if (pos === EVENT_POS) {
        orderA = orderMapEvents[a[pos]];
        orderB = orderMapEvents[b[pos]];
      }
      else {
        orderA = orderMapState[a[pos]];
        orderB = orderMapState[b[pos]];
      }
  
      if (orderA !== orderB) {
        // 違っているところが出たら実際の比較を行う（最後まで来たらそれで比較する）
        break;
      }
    }

    // 順番判定
    return orderA - orderB;
  });


  // 開始のステートを全部ピックアップ（ソート済みなのでその順番に従う）
  const startStates = Array.from(new Set(matches.map(match => match[START_STATE_POS])));

  // イベントを全部ピックアップ＋ソート
  const events = Array.from(new Set(matches.map(match => match[EVENT_POS]))).sort((a, b) => {
    return orderMapEvents[a] - orderMapEvents[b];
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
function convertToStateTransitionTable(diaglamInfo) {

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

  if (depth <= 0) {
    // 最下層まで来たら戻す
    return table;
  }

  // ＋１分を再帰呼び出しで作る
  return makeNSwitchCoverage(diaglamInfo, depth - 1, table);
}

function convertToNSwitchCoverage(diaglamInfo, depth) {

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

function convertTextToMarkdown (plantUmlText) {
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
  const stateTransitionTable = convertToStateTransitionTable(diaglamInfo);

  // N スイッチカバレッジを作成する（深さは設定に従う。デフォルト１）
  let switchCoverages = [];
  // 設定情報を取得
  const config = vscode.workspace.getConfiguration('stateDiagram2MarkdownTables');
  const maxDepth = config.get('nSwitchCoveragesDepth', 1);
  for (let i = 0; i <= maxDepth; i++) {
    const result = convertToNSwitchCoverage(diaglamInfo, i);
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

  const outputText = convertTextToMarkdown(editor.document.getText(curSelection));

  if (outputText) {
    // テキストがあるならクリップボードへ送る
    await vscode.env.clipboard.writeText(outputText);
    // 通知メッセージを表示
    vscode.window.showInformationMessage('Send texts of tables to clipboard !');
  }

}

module.exports.convertTextToMarkdown = convertTextToMarkdown;
module.exports.main = main;
