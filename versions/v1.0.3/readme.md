# Markdown Made Easy for VS Code

Markdown Made Easy makes Markdown templates easy to reuse inside VS Code.

## Create and insert templates

While editing a Markdown file, right-click in the editor and choose:

- **Markdown Made Easy: Insert Template in Current File** — choose a template and insert it at the cursor.
- **Markdown Made Easy: Create Template from Current File** — save the complete current document as a reusable personal template.

Personal templates are stored privately in VS Code on this device. Saving another template with the same name updates it.

## Fill template variables without right-clicking

Write placeholders in any template using the form `{{VARIABLE_NAME}}`, such as:

```markdown
# {{PROJECT_NAME}}

**Date:** {{DATE}}

## Summary

{{SUMMARY}}
```

The extension detects every variable automatically and places a clickable **Fill VARIABLE** control above it. Click that control to choose a suggested value or select **Enter a custom value…**. Only the matching placeholder is replaced.

Suggestions are tailored to common variable names:

- `{{DATE}}` — current numeric or written date
- `{{PROJECT_NAME}}` — name of the open VS Code workspace
- `{{VERSION}}` — common starting version numbers
- `{{SUMMARY}}`, `{{TITLE}}`, and `{{COMMIT_TITLE}}` — useful writing starters
- Every other variable — a sensible default plus a custom-value option

## Start a new Markdown file

Use `Ctrl+Shift+P` and run **Markdown Made Easy: New File from Template** when you want a fresh Markdown document.

## Install locally

1. Open the Extensions view with `Ctrl+Shift+X`.
2. Select the `…` menu.
3. Select **Install from VSIX…**.
4. Choose the packaged `.vsix` file from this project.

The extension has no network access, telemetry, account requirement, or external dependencies.
