// src/extension.ts
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  log("🔥 activated");
  // רישום שלושת הפקודות לפתיחת קבצים מקבילים
  context.subscriptions.push(
    vscode.commands.registerCommand("angularComponentSplitter.openTs", () =>
      openSibling("ts")
    ),
    vscode.commands.registerCommand("angularComponentSplitter.openHtml", () =>
      openSibling("html")
    ),
    vscode.commands.registerCommand("angularComponentSplitter.openScss", () =>
      openSibling("scss")
    )
  );
  log("🔥 registered commands");
}

export function deactivate() {
  // No-op
  log("🔥 deactivated");
}

async function openSibling(ext: "ts" | "html" | "scss") {
  log("🔥 opening sibling", ext);
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  // זיהוי בסיס הקובץ לפני ההרחבה
  const match = editor.document.fileName.match(
    /(.*)\.component\.(ts|html|scss)$/
  );
  if (!match) {
    return;
  }
  const base = match[1];
  const uri = vscode.Uri.file(`${base}.component.${ext}`);

  try {
    // בדיקת כמות החלונות המפוצלים
    const activeGroup = vscode.window.activeTextEditor?.viewColumn;
    const groupCount = getVisibleEditorGroupCount();

    let targetColumn: vscode.ViewColumn;

    if (groupCount <= 1) {
      // אם אין פיצול מסך, פצל ל-2 ופתח בחלון השני
      targetColumn = vscode.ViewColumn.Beside;
    } else if (activeGroup) {
      // מצא את החלון הצמוד והתאם למיקום
      if (groupCount === 2) {
        // במקרה של 2 חלונות - פשוט פתח בחלון השני
        targetColumn = activeGroup === vscode.ViewColumn.One ? 
          vscode.ViewColumn.Two : 
          vscode.ViewColumn.One;
      } else {
        // במקרה של מעל 2 חלונות, מצא את הקרוב ביותר
        targetColumn = findAdjacentGroup(activeGroup);
      }
    } else {
      // אם לא ניתן לזהות את החלון הפעיל, פתח בחלון חדש
      targetColumn = vscode.ViewColumn.Beside;
    }

    // פותח את הקובץ בחלון המתאים
    await vscode.window.showTextDocument(uri, {
      viewColumn: targetColumn,
      preview: false,
    });
  } catch (e) {
    vscode.window.showErrorMessage(`לא ניתן לפתוח ${base}.component.${ext}`);
  }
}

/**
 * מוצא את הקבוצה הצמודה לקבוצה הפעילה
 */
function findAdjacentGroup(activeGroup: vscode.ViewColumn): vscode.ViewColumn {
  // נשתמש בהיוריסטיקה פשוטה למציאת הקבוצה הצמודה
  if (activeGroup === vscode.ViewColumn.One) {
    return vscode.ViewColumn.Two;
  } else if (activeGroup === vscode.ViewColumn.Two) {
    return vscode.ViewColumn.One;
  } else {
    // במקרה של גריד או תצורה מורכבת - נבחר את החלון הראשון או השני
    return activeGroup % 2 === 0 ?
      vscode.ViewColumn.One :
      vscode.ViewColumn.Two;
  }
}

/**
 * מחזיר את מספר קבוצות העריכה הנראות
 */
function getVisibleEditorGroupCount(): number {
  let count = 0;
  for (let i = 1; i <= 9; i++) {
    if (vscode.window.visibleTextEditors.some(
      e => e.viewColumn === i as vscode.ViewColumn
    )) {
      count++;
    }
  }
  return count || 1; // מחזיר לפחות 1 אם לא נמצאו קבוצות
}

function log(...message: any[]) {
  console.log(`[Angular Component Splitter]`, ...message);
}
