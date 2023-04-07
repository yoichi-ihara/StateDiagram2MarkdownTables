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
    assert.ok(await testCopyResultIsEqualToFile('test-1line.md', 'result-1line.md', true));
    assert.ok(await testCopyResultIsEqualToFile('test-simple.md', 'result-simple.md', true));
  });
  test('Complex test', async () => {
    assert.ok(await testCopyResultIsEqualToFile('test-complex1.md', 'result-complex1.md', true));
    assert.ok(await testCopyResultIsEqualToFile('test-complex2.md', 'result-complex2.md', true));
    assert.ok(await testCopyResultIsEqualToFile('test-complex3.md', 'result-complex3.md', true));
    assert.ok(await testCopyResultIsEqualToFile('test-complex4.md', 'result-complex4.md', true));
  });
  test('NoResult test', async () => {
    assert.ok(await testCopyResultIsEqualToFile('test-noResult1.md', null, true));
    assert.ok(await testCopyResultIsEqualToFile('test-noResult2.md', null, true));
    assert.ok(await testCopyResultIsEqualToFile('test-noResult3.md', null, true));
    assert.ok(await testCopyResultIsEqualToFile('test-1line.md', null, false));
  });
  test('Crlf test', async () => {
    assert.ok(await testCopyResultIsEqualToFile('test-simple-crlf.md', 'result-simple.md', true));
  });
});

async function testCopyResultIsEqualToFile(testFile, resultFile, isSelectionAll){
  const testDataDir = path.resolve(__dirname, './data/');

  const resultData = resultFile == null ? '' : fs.readFileSync(testDataDir + '/' + resultFile, 'utf-8');


  const document = await vscode.workspace.openTextDocument(testDataDir + '/' + testFile);
  const editor = await vscode.window.showTextDocument(document);

  if (isSelectionAll) {
    editor.selection = new vscode.Selection(new vscode.Position(0,0), document.lineAt(document.lineCount-1).range.end);
  }
  else {
    editor.selection = new vscode.Selection(new vscode.Position(0,0), new vscode.Position(0,0));
  }

  await vscode.env.clipboard.writeText('');

  await myExtension.main();

  const copyResult = await vscode.env.clipboard.readText();

  await vscode.window.tabGroups.close(vscode.window.tabGroups.activeTabGroup.activeTab);

  console.log(`result=[${resultData}], copy=[${copyResult}]`);

  return resultData === copyResult;
}

