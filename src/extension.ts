// src/extension.ts
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  log("🔥 activated");
  // רישום פקודות לפתיחת קבצים מקבילים
  context.subscriptions.push(
    vscode.commands.registerCommand("angularComponentSplitter.openTs", () =>
      openSibling("ts")
    ),
    vscode.commands.registerCommand("angularComponentSplitter.openHtml", () =>
      openSibling("html")
    ),
    vscode.commands.registerCommand("angularComponentSplitter.openScss", () =>
      openSibling("scss")
    ),
    vscode.commands.registerCommand("angularComponentSplitter.openOther", openOther),
    vscode.commands.registerCommand("angularComponentSplitter.toggleView", toggleComponentView)
  );
  log("🔥 registered commands");
}

export function deactivate() {
  // No-op
  log("🔥 deactivated");
}

const EXT_TO_OTHER_EXT = {
  ts: ["html", "scss"],
  html: ["ts", "scss"],
  scss: ["ts", "html"],
} as const;

function getOtherExt(ext: "ts" | "html" | "scss") {
  return EXT_TO_OTHER_EXT[ext];
}

/**
 * בודק אם קובץ כבר פתוח ומחזיר את העמודה בה הוא פתוח
 * @returns undefined אם הקובץ לא פתוח, אחרת מחזיר את העמודה
 */
function isFileAlreadyOpen(filePath: string): vscode.ViewColumn | undefined {
  for (const editor of vscode.window.visibleTextEditors) {
    if (editor.document.fileName === filePath) {
      return editor.viewColumn;
    }
  }
  return undefined;
}

/**
 * בודק האם הקובץ שייך לקומפוננטה של אנגולר
 */
function getComponentInfo(filePath: string): { base: string, ext: "ts" | "html" | "scss" } | undefined {
  const match = filePath.match(/(.*)\.component\.(ts|html|scss)$/);
  if (!match) {
    return undefined;
  }
  return {
    base: match[1],
    ext: match[2] as "ts" | "html" | "scss"
  };
}

/**
 * פותח קובץ בחלון חכם - אם הקובץ כבר פתוח, פשוט עובר אליו
 */
async function openFileInSmartView(filePath: string, preferredColumn?: vscode.ViewColumn): Promise<boolean> {
  try {
    // בדוק אם הקובץ כבר פתוח
    const existingColumn = isFileAlreadyOpen(filePath);
    
    if (existingColumn) {
      // הקובץ כבר פתוח, פשוט עבור אליו
      log(`🔥 file already open in column ${existingColumn}, focusing it`);
      const doc = await vscode.workspace.openTextDocument(filePath);
      await vscode.window.showTextDocument(doc, existingColumn);
      return true;
    }
    
    // הקובץ לא פתוח, פתח אותו בעמודה המועדפת
    const targetColumn = preferredColumn || vscode.ViewColumn.Active;
    const uri = vscode.Uri.file(filePath);
    await vscode.window.showTextDocument(uri, {
      viewColumn: targetColumn,
      preview: false,
    });
    return true;
  } catch (e) {
    log(`🔥 error opening file: ${e}`);
    return false;
  }
}

/**
 * מחליף בין תצוגת קובץ יחיד לתצוגת כל הקבצים
 */
async function toggleComponentView() {
  log("🔥 toggling component view");
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const componentInfo = getComponentInfo(editor.document.fileName);
  if (!componentInfo) {
    return;
  }

  const { base, ext } = componentInfo;
  const componentFiles = [
    `${base}.component.ts`,
    `${base}.component.html`,
    `${base}.component.scss`,
  ];
  
  // בדוק כמה מקבצי הקומפוננטה פתוחים
  let openComponentFilesCount = 0;
  for (const filePath of componentFiles) {
    if (isFileAlreadyOpen(filePath)) {
      openComponentFilesCount++;
    }
  }
  
  if (openComponentFilesCount <= 1) {
    // רק קובץ אחד פתוח, פתח את כולם
    log("🔥 only one component file open, opening all");
    await openOther();
  } else {
    // יותר מקובץ אחד פתוח, סגור את כולם חוץ מהאקטיבי
    log("🔥 multiple component files open, closing others");
    
    // סגור את כל הקבצים האחרים של הקומפוננטה
    for (const filePath of componentFiles) {
      if (filePath !== editor.document.fileName) {
        // סגור את כל החלונות עם הקובץ הזה
        const docs = vscode.workspace.textDocuments.filter(
          (doc) => doc.fileName === filePath
        );
        
        for (const doc of docs) {
          // נסה למצוא עורך שמציג את המסמך הזה
          for (const visibleEditor of vscode.window.visibleTextEditors) {
            if (visibleEditor.document.fileName === doc.fileName) {
              // סגור את החלון הזה
              await vscode.commands.executeCommand(
                "workbench.action.closeActiveEditor",
                visibleEditor.viewColumn
              );
              break;
            }
          }
        }
      }
    }
    
    // התמקד בקובץ האקטיבי
    await vscode.window.showTextDocument(editor.document, editor.viewColumn);
  }
}

async function openOther() {
  log("🔥 opening other files");
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const componentInfo = getComponentInfo(editor.document.fileName);
  if (!componentInfo) {
    return;
  }
  
  const { base, ext } = componentInfo;
  const otherExts = getOtherExt(ext);
  
  try {
    // בדיקת כמות החלונות המפוצלים
    const activeGroup = vscode.window.activeTextEditor?.viewColumn;
    const groupCount = getVisibleEditorGroupCount();

    // בדוק איזה קבצים כבר פתוחים
    const firstFilePath = `${base}.component.${otherExts[0]}`;
    const secondFilePath = `${base}.component.${otherExts[1]}`;
    
    const firstFileColumn = isFileAlreadyOpen(firstFilePath);
    const secondFileColumn = isFileAlreadyOpen(secondFilePath);
    
    // מקרה 1: שני הקבצים כבר פתוחים
    if (firstFileColumn && secondFileColumn) {
      // פשוט התמקד בקובץ הראשון
      const doc1 = await vscode.workspace.openTextDocument(firstFilePath);
      await vscode.window.showTextDocument(doc1, firstFileColumn);
      return;
    }
    
    // מקרה 2: רק הקובץ הראשון פתוח
    if (firstFileColumn && !secondFileColumn) {
      // קודם התמקד בקובץ הראשון
      const doc1 = await vscode.workspace.openTextDocument(firstFilePath);
      await vscode.window.showTextDocument(doc1, firstFileColumn);
      
      // אחר כך פתח את השני בחלון מפוצל
      await vscode.commands.executeCommand('workbench.action.splitEditorDown');
      await new Promise(resolve => setTimeout(resolve, 100));
      await openFileInSmartView(secondFilePath);
      return;
    }
    
    // מקרה 3: רק הקובץ השני פתוח
    if (!firstFileColumn && secondFileColumn) {
      // קודם התמקד בקובץ השני
      const doc2 = await vscode.workspace.openTextDocument(secondFilePath);
      await vscode.window.showTextDocument(doc2, secondFileColumn);
      
      // אחר כך פתח את הראשון בחלון מפוצל
      await vscode.commands.executeCommand('workbench.action.splitEditorUp');
      await new Promise(resolve => setTimeout(resolve, 100));
      await openFileInSmartView(firstFilePath);
      return;
    }
    
    // מקרה 4: שני הקבצים אינם פתוחים
    let targetColumn: vscode.ViewColumn;
    
    if (groupCount <= 1) {
      // אם אין פיצול מסך, פצל ל-2 ופתח בחלון השני
      targetColumn = vscode.ViewColumn.Beside;
    } else if (activeGroup) {
      // מצא את החלון הצמוד
      if (groupCount === 2) {
        targetColumn = activeGroup === vscode.ViewColumn.One
          ? vscode.ViewColumn.Two
          : vscode.ViewColumn.One;
      } else {
        targetColumn = findAdjacentGroup(activeGroup);
      }
    } else {
      targetColumn = vscode.ViewColumn.Beside;
    }
    
    // פתח את הקובץ הראשון
    await openFileInSmartView(firstFilePath, targetColumn);
    
    // המתנה קצרה
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // פתח את הקובץ השני בחלון מפוצל
    await vscode.commands.executeCommand('workbench.action.splitEditorDown');
    await new Promise(resolve => setTimeout(resolve, 100));
    await openFileInSmartView(secondFilePath);
    
  } catch (e) {
    vscode.window.showErrorMessage(`לא ניתן לפתוח את הקבצים המקבילים: ${e}`);
  }
}

async function openSibling(ext: "ts" | "html" | "scss") {
  log("🔥 opening sibling", ext);
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const componentInfo = getComponentInfo(editor.document.fileName);
  if (!componentInfo) {
    return;
  }
  
  const base = componentInfo.base;
  const targetFilePath = `${base}.component.${ext}`;
  
  try {
    // בדוק האם הקובץ כבר פתוח
    const existingColumn = isFileAlreadyOpen(targetFilePath);
    
    if (existingColumn) {
      // הקובץ כבר פתוח, פשוט עבור אליו
      const doc = await vscode.workspace.openTextDocument(targetFilePath);
      await vscode.window.showTextDocument(doc, existingColumn);
      return;
    }
    
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
        targetColumn =
          activeGroup === vscode.ViewColumn.One
            ? vscode.ViewColumn.Two
            : vscode.ViewColumn.One;
      } else {
        // במקרה של מעל 2 חלונות, מצא את הקרוב ביותר
        targetColumn = findAdjacentGroup(activeGroup);
      }
    } else {
      // אם לא ניתן לזהות את החלון הפעיל, פתח בחלון חדש
      targetColumn = vscode.ViewColumn.Beside;
    }

    // פותח את הקובץ בחלון המתאים
    await openFileInSmartView(targetFilePath, targetColumn);
  } catch (e) {
    vscode.window.showErrorMessage(`לא ניתן לפתוח ${base}.component.${ext}: ${e}`);
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
    return activeGroup % 2 === 0
      ? vscode.ViewColumn.One
      : vscode.ViewColumn.Two;
  }
}

/**
 * מחזיר את מספר קבוצות העריכה הנראות
 */
function getVisibleEditorGroupCount(): number {
  let count = 0;
  for (let i = 1; i <= 9; i++) {
    if (
      vscode.window.visibleTextEditors.some(
        (e) => e.viewColumn === (i as vscode.ViewColumn)
      )
    ) {
      count++;
    }
  }
  return count || 1; // מחזיר לפחות 1 אם לא נמצאו קבוצות
}

function log(...message: any[]) {
  console.log(`[Angular Component Splitter]`, ...message);
}
