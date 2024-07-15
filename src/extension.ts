import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.createCssAndImport",
    () => {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const document = editor.document;
        const targetFilePath = document.fileName;
        const targetDir = path.dirname(targetFilePath);
        const cssFilePath = path.join(targetDir, "index.module.css");

        fs.writeFile(cssFilePath, "", (err) => {
          if (err) {
            vscode.window.showErrorMessage(
              "CSS 파일 생성 실패: " + err.message
            );
            return;
          }

          const importStatement = "import styles from './index.module.css';\n";
          const fileContent = document.getText();
          const updatedContent = importStatement + fileContent;

          fs.writeFile(targetFilePath, updatedContent, "utf8", (err) => {
            if (err) {
              vscode.window.showErrorMessage(
                "타겟 파일 쓰기 실패: " + err.message
              );
              return;
            }

            vscode.window.showInformationMessage(
              "CSS 파일 생성 및 import 구문 추가 완료."
            );
          });
        });
      } else {
        vscode.window.showErrorMessage("활성화된 에디터가 없습니다.");
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
