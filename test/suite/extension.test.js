const assert = require('assert');
const fs = require("fs");
const path = require('path');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require('vscode');
const myExtension = require('../../src/main');

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('Simple test', async () => {
    assert.ok(await testCopyResultIsEqualToFile('test-1line.md', 'result-1line.md', true), 'test-1line.md');
    assert.ok(await testCopyResultIsEqualToFile('test-simple1.md', 'result-simple1.md', true), 'test-simple1.md');
    assert.ok(await testCopyResultIsEqualToFile('test-simple2.md', 'result-simple2.md', true), 'test-simple2.md');
    assert.ok(await testCopyResultIsEqualToFile('test-simple3.md', 'result-simple3.md', true), 'test-simple3.md');
  });
  test('Complex test', async () => {
    assert.ok(await testCopyResultIsEqualToFile('test-complex1.md', 'result-complex1.md', true), 'test-complex1.md');
    assert.ok(await testCopyResultIsEqualToFile('test-complex2.md', 'result-complex2.md', true), 'test-complex2.md');
    assert.ok(await testCopyResultIsEqualToFile('test-complex3.md', 'result-complex3.md', true), 'test-complex3.md');
    assert.ok(await testCopyResultIsEqualToFile('test-complex4.md', 'result-complex4.md', true), 'test-complex4.md');
  });
  test('NoResult test', async () => {
    assert.ok(await testCopyResultIsEqualToFile('test-noResult1.md', null, true), 'test-noResult1.md');
    assert.ok(await testCopyResultIsEqualToFile('test-noResult2.md', null, true), 'test-noResult2.md');
    assert.ok(await testCopyResultIsEqualToFile('test-noResult3.md', null, true), 'test-noResult3.md');
    assert.ok(await testCopyResultIsEqualToFile('test-1line.md', null, false), 'test-1line.md');
  });
  test('Crlf test', async () => {
    assert.ok(await testCopyResultIsEqualToFile('test-simple-crlf.md', 'result-simple1.md', true), 'test-simple-crlf.md');
  });
  test('Depth test', async () => {
    assert.ok(await testCopyResultIsEqualToFile('test-depth0.md', 'result-depth0.md', true, 0), 'test-depth0.md');
    assert.ok(await testCopyResultIsEqualToFile('test-depth2.md', 'result-depth2.md', true, 2), 'test-depth2.md');
  });
  test('Format test', async () => {
    assert.ok(await testCopyResultIsEqualToFile('test-format1.md', 'result-format1.md', true, 0), 'test-depth0.md');
  });

});

async function testCopyResultIsEqualToFile(testFile, resultFile, isSelectionAll, detpth=1){

  // N スイッチカバレッジの深さの設定
  const config = vscode.workspace.getConfiguration('stateDiagram2MarkdownTables');
  await config.update('nSwitchCoveragesDepth', detpth, true);

  // テスト用ディレクトリの定義
  const testDataDir = path.resolve(__dirname, './data/');
  const resultDataDir = path.resolve(__dirname, './result/');

  // 想定結果データの取得
  const resultData = resultFile == null ? '' : fs.readFileSync(testDataDir + '/' + resultFile, 'utf-8');

  // テスト用データを VSCode で開く
  const document = await vscode.workspace.openTextDocument(testDataDir + '/' + testFile);
  const editor = await vscode.window.showTextDocument(document);

  if (isSelectionAll) {
    // 全体選択
    editor.selection = new vscode.Selection(new vscode.Position(0,0), document.lineAt(document.lineCount-1).range.end);
  }
  else {
    // 選択しない
    editor.selection = new vscode.Selection(new vscode.Position(0,0), new vscode.Position(0,0));
  }

  // テスト結果判定用にクリップボードの初期化
  await vscode.env.clipboard.writeText('');

  // 拡張呼び出し
  await myExtension.main();

  // 結果＝クリップボードの読みだし
  const copyResult = await vscode.env.clipboard.readText();

  // テスト用に開いたドキュメント＝タブを閉じる
  await vscode.window.tabGroups.close(vscode.window.tabGroups.activeTabGroup.activeTab);

  // console.log(`result=[${resultData}], copy=[${copyResult}]`);

  // テスト結果の書き込み
  if (!fs.existsSync(resultDataDir)) {
    fs.mkdirSync(resultDataDir);
  }
  fs.writeFileSync(`${resultDataDir}/${testFile}`, copyResult,);

  // Nスイッチカバレッジの深さを初期値に戻す
  await config.update('nSwitchCoveragesDepth', 1, true);

  // テスト結果を判定して返す
  return resultData === copyResult;
}

