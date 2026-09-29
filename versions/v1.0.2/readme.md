# Markdown Made Easy for VS Code

Markdown Made Easy is a VS Code extension that creates polished Markdown documents from simple, ready-to-edit templates.

## Use it

While editing a Markdown file, right-click directly in the editor and choose one of these commands:

- **Markdown Made Easy: Insert Template in Current File** — choose a template and insert it at the cursor position.
- **Markdown Made Easy: Create Template from Current File** — save the complete open document as a reusable personal template.
- **Markdown Made Easy: Fill Template Variable** — replace the `{{VARIABLE}}` under your cursor with the value you enter.

Personal templates are stored privately in VS Code's extension storage on this device. If you use the same name again, the saved template is updated with the current file's content.

## Template variables

Personal templates can use placeholders such as `{{PROJECT_NAME}}`, `{{DATE}}`, or `{{SUMMARY}}`. After inserting a template, put the cursor on a placeholder—or select it—then right-click and choose **Markdown Made Easy: Fill Template Variable**. Enter the replacement value and only that placeholder is changed.

The **New File from Template** command is also available in the Command Palette with `Ctrl+Shift+P` when you want to begin a separate document.

## Included templates

- **Blank document** — a simple title and writing area.
- **Project README** — overview, setup, features, and license sections.
- **Meeting notes** — attendees, discussion, decisions, and task checklist.
- **Release notes** — Added, Changed, and Fixed sections.

Each template is ordinary Markdown: change, remove, or extend any part after inserting it.

## Run it locally in VS Code

1. Open `G:\.gitClones\MossaicExtensionforOperaGX` in VS Code.
2. Press `F5` to open the **Extension Development Host**.
3. In that new VS Code window, press `Ctrl+Shift+P`.
4. Run **Markdown Made Easy: New File from Template**.
5. Choose a template and confirm it opens in a new Markdown editor.

## Project structure

- `package.json` — VS Code extension manifest and commands.
- `src/extension.js` — template picker and editor commands.
- `docs/development/MarkDownTemplates/` — existing development-document templates retained from the original project.

The extension has no network access, telemetry, account requirement, or external dependencies.
