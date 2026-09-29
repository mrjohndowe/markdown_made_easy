const vscode = require("vscode");

const templates = [
  {
    label: "Blank document",
    description: "A clean Markdown page, ready for anything.",
    body: "# Untitled document\n\nStart writing here.\n"
  },
  {
    label: "Project README",
    description: "Explain your project, its setup, and its features.",
    body: "# Project name\n\nA short, clear description of what this project does.\n\n## Getting started\n\n1. Install the project\n2. Follow the setup steps\n3. Start using it\n\n## Features\n\n- Feature one\n- Feature two\n- Feature three\n\n## License\n\nAdd your license information here.\n"
  },
  {
    label: "Meeting notes",
    description: "Capture decisions, tasks, and the next conversation.",
    body: "# Meeting notes\n\n**Date:** \n**Attendees:** \n\n## Discussion\n\n- \n\n## Decisions\n\n- \n\n## Next steps\n\n- [ ] Task — owner\n"
  },
  {
    label: "Release notes",
    description: "Share a clear update for a new version.",
    body: "# Version 1.0.0\n\n## Added\n\n- \n\n## Changed\n\n- \n\n## Fixed\n\n- \n"
  }
];

function customTemplates(context) {
  return context.globalState.get("customTemplates", []);
}

async function pickTemplate(context) {
  return vscode.window.showQuickPick([...templates, ...customTemplates(context)], {
    title: "Markdown Made Easy",
    placeHolder: "Choose a template to begin"
  });
}

async function newFileFromTemplate(context) {
  const template = await pickTemplate(context);
  if (!template) return;

  const document = await vscode.workspace.openTextDocument({
    content: template.body,
    language: "markdown"
  });
  const editor = await vscode.window.showTextDocument(document);
  editor.selection = new vscode.Selection(new vscode.Position(0, 2), new vscode.Position(0, 18));
}

async function insertTemplate(context) {
  const template = await pickTemplate(context);
  if (!template) return;

  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    await newFileFromTemplate(context);
    return;
  }
  await editor.edit((editBuilder) => editBuilder.insert(editor.selection.active, template.body));
}

async function createTemplate(context) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage("Open a Markdown file before creating a template.");
    return;
  }

  const body = editor.document.getText();
  if (!body.trim()) {
    vscode.window.showInformationMessage("Add some Markdown before saving it as a template.");
    return;
  }

  const label = await vscode.window.showInputBox({
    title: "Create Markdown Template",
    prompt: "Name this template",
    placeHolder: "For example: Weekly project update",
    validateInput: (value) => value.trim() ? undefined : "A template name is required."
  });
  if (!label) return;

  const savedTemplates = customTemplates(context).filter((template) => template.label !== label.trim());
  savedTemplates.push({
    label: label.trim(),
    description: "Your saved template.",
    detail: "Personal template",
    body
  });
  await context.globalState.update("customTemplates", savedTemplates);
  vscode.window.showInformationMessage(`Saved “${label.trim()}” as a Markdown template.`);
}

function variableRangeAtCursor(editor) {
  const selection = editor.selection;
  const selectedText = editor.document.getText(selection);
  if (/^{{[A-Za-z][A-Za-z0-9_ -]*}}$/.test(selectedText)) return selection;

  const line = editor.document.lineAt(selection.active.line).text;
  const pattern = /{{[A-Za-z][A-Za-z0-9_ -]*}}/g;
  let match;
  while ((match = pattern.exec(line)) !== null) {
    const start = match.index;
    const end = start + match[0].length;
    if (selection.active.character >= start && selection.active.character <= end) {
      return new vscode.Range(selection.active.line, start, selection.active.line, end);
    }
  }
  return undefined;
}

function suggestionsForVariable(variableName) {
  const today = new Date();
  const date = today.toISOString().slice(0, 10);
  const readableDate = today.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  const workspaceName = vscode.workspace.workspaceFolders?.[0]?.name ?? "My Project";
  const suggestions = {
    DATE: [date, readableDate],
    VERSION: ["1.0.0", "0.1.0"],
    PROJECT_NAME: [workspaceName, "My Project"],
    PROJECT: [workspaceName, "My Project"],
    AUTHOR: ["Project team", "Your name"],
    SUMMARY: ["A concise summary of this document.", "Describe the purpose and outcome here."],
    TITLE: ["A clear, descriptive title", "Document title"],
    COMMIT_TITLE: ["feat: describe the change", "fix: describe the correction"],
    COMMIT_NUMBER: ["001", "1"],
    STATUS: ["Complete", "In progress", "Planned"]
  };
  return suggestions[variableName] ?? [`Value for ${variableName.replace(/_/g, " ").toLowerCase()}`, "Not applicable"];
}

async function fillVariable(uri, suppliedRange) {
  const document = uri ? await vscode.workspace.openTextDocument(uri) : vscode.window.activeTextEditor?.document;
  if (!document) return;
  const editor = await vscode.window.showTextDocument(document);
  const range = suppliedRange ? new vscode.Range(suppliedRange.start, suppliedRange.end) : variableRangeAtCursor(editor);
  if (!range) return;

  const variable = editor.document.getText(range);
  const variableName = variable.slice(2, -2);
  const customValue = "Enter a custom value…";
  const choice = await vscode.window.showQuickPick([...suggestionsForVariable(variableName), customValue], {
    title: `Fill ${variable}`,
    placeHolder: "Choose a suggestion or enter your own value"
  });
  if (!choice) return;
  const value = choice === customValue ? await vscode.window.showInputBox({
    title: `Fill ${variable}`,
    prompt: `What should replace ${variable}?`
  }) : choice;
  if (value === undefined) return;
  await editor.edit((editBuilder) => editBuilder.replace(range, value));
}

class TemplateVariableCodeLensProvider {
  provideCodeLenses(document) {
    const lenses = [];
    const pattern = /{{[A-Za-z][A-Za-z0-9_ -]*}}/g;
    for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber += 1) {
      const line = document.lineAt(lineNumber).text;
      let match;
      while ((match = pattern.exec(line)) !== null) {
        const range = new vscode.Range(lineNumber, match.index, lineNumber, match.index + match[0].length);
        const variableName = match[0].slice(2, -2);
        lenses.push(new vscode.CodeLens(range, {
          title: `$(symbol-variable) Fill ${variableName}`,
          command: "markdownMadeEasy.fillVariable",
          arguments: [document.uri, range]
        }));
      }
    }
    return lenses;
  }
}

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("markdownMadeEasy.newFromTemplate", () => newFileFromTemplate(context)),
    vscode.commands.registerCommand("markdownMadeEasy.insertTemplate", () => insertTemplate(context)),
    vscode.commands.registerCommand("markdownMadeEasy.createTemplate", () => createTemplate(context)),
    vscode.commands.registerCommand("markdownMadeEasy.fillVariable", fillVariable),
    vscode.languages.registerCodeLensProvider({ language: "markdown" }, new TemplateVariableCodeLensProvider())
  );
}

function deactivate() {}

module.exports = { activate, deactivate, templates };
