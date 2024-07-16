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

        // Extract classNames from the document in the order they appear
        const classNames = extractClassNames(document);

        // Update CSS file
        updateCSSFile(cssFilePath, classNames, targetFilePath);
      } else {
        vscode.window.showErrorMessage("활성화된 에디터가 없습니다.");
      }
    }
  );

  context.subscriptions.push(disposable);
}

function extractClassNames(document: vscode.TextDocument): string[] {
  const classNames: string[] = [];
  const fileContent = document.getText();

  // Regular expression to find styles.xxx occurrences
  const classNameRegex = /styles\.([a-zA-Z0-9_-]+)/g;
  let match;
  while ((match = classNameRegex.exec(fileContent)) !== null) {
    if (!classNames.includes(match[1])) {
      classNames.push(match[1]);
    }
  }

  return classNames;
}

function updateCSSFile(
  cssFilePath: string,
  classNames: string[],
  targetFilePath: string
) {
  // Check if CSS file already exists
  fs.stat(cssFilePath, (err, stats) => {
    if (err && err.code === "ENOENT") {
      // CSS file does not exist, create it
      fs.writeFile(cssFilePath, generateCSSContent(classNames), (err) => {
        if (err) {
          vscode.window.showErrorMessage("CSS 파일 생성 실패: " + err.message);
          return;
        }
        addImportStatement(targetFilePath);
      });
    } else if (err) {
      vscode.window.showErrorMessage("CSS 파일 확인 실패: " + err.message);
    } else {
      // CSS file already exists, update it
      updateExistingCSSFile(cssFilePath, classNames, targetFilePath);
    }
  });
}

function generateCSSContent(classNames: string[]): string {
  return classNames
    .map(
      (className, index) =>
        `.${className} {}\n${index < classNames.length - 1 ? "\n" : ""}`
    )
    .join("");
}

function updateExistingCSSFile(
  cssFilePath: string,
  classNames: string[],
  targetFilePath: string
) {
  fs.readFile(cssFilePath, "utf8", (err, data) => {
    if (err) {
      vscode.window.showErrorMessage("CSS 파일 읽기 실패: " + err.message);
      return;
    }

    let cssContent = data.toString();
    let existingClassNames: string[] = [];

    // Extract existing classNames from CSS file
    const existingClassNameRegex = /\.([a-zA-Z0-9_-]+)\s*\{/g;
    let match;
    while ((match = existingClassNameRegex.exec(cssContent)) !== null) {
      existingClassNames.push(match[1]);
    }

    // Add new classNames in the order they appear in HTML
    classNames.forEach((className) => {
      if (!existingClassNames.includes(className)) {
        cssContent += `${
          existingClassNames.length > 0 ? "\n" : ""
        }.${className} {}\n\n`; // Add new class with newlines if not exists
      }
    });

    fs.writeFile(cssFilePath, cssContent, "utf8", (err) => {
      if (err) {
        vscode.window.showErrorMessage("CSS 파일 쓰기 실패: " + err.message);
        return;
      }
      addImportStatement(targetFilePath);
    });
  });
}

function addImportStatement(targetFilePath: string) {
  const importStatement = "import styles from './index.module.css';\n";

  fs.readFile(targetFilePath, "utf8", (err, data) => {
    if (err) {
      vscode.window.showErrorMessage("타겟 파일 읽기 실패: " + err.message);
      return;
    }

    const fileContent = data.toString();

    // Check if import statement already exists
    const importRegex = /^import\s+styles\s+from\s+'.\/index\.module\.css';/m;
    if (!importRegex.test(fileContent)) {
      const updatedContent = importStatement + fileContent;

      fs.writeFile(targetFilePath, updatedContent, "utf8", (err) => {
        if (err) {
          vscode.window.showErrorMessage("타겟 파일 쓰기 실패: " + err.message);
          return;
        }

        vscode.window.showInformationMessage(
          "CSS 파일 생성 및 import 구문 추가 완료."
        );
      });
    } else {
      vscode.window.showInformationMessage("이미 import 구문이 존재합니다.");
    }
  });
}

export function deactivate() {}
