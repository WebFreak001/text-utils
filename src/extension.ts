import * as vscode from "vscode";
import {
  base64Encode,
  base64Decode,
  xmlEntityEncode,
  xmlEntityDecode,
  mimeHeaderDecode,
} from "./conversion";

export function activate(context: vscode.ExtensionContext) {
  async function applyTransform(
    editor: vscode.TextEditor,
    transform: (value: string, warnings?: string[]) => string,
  ) {
    const selections = editor.selections;

    const warnings: string[] = [];
    editor
      .edit((editBuilder) => {
        for (const selection of selections) {
          const text = editor.document.getText(selection);
          if (!text) {
            continue;
          }

          try {
            const transformed = transform(text, warnings);
            editBuilder.replace(selection, transformed);
          } catch (err) {
            console.error(err);
            warnings.push(
              err instanceof Error ? err.message : "Error in conversion code",
            );
          }
        }
      })
      .then(() => {
        if (warnings.length > 0) {
          let deduped = Array.from(new Set(warnings));
          if (deduped.length === 1) {
            vscode.window.showWarningMessage(
              "Unable to convert: " + deduped[0],
            );
          } else {
            vscode.window.showWarningMessage(
              "Unable to convert:\n" + deduped.map((v) => "- " + v).join("\n"),
            );
          }
        }
      });
  }

  const register = (command: string, transform: (value: string) => string) => {
    context.subscriptions.push(
      vscode.commands.registerTextEditorCommand(command, (editor) =>
        applyTransform(editor, transform),
      ),
    );
  };

  // --- encoding & decoding functions ---

  register("text-utils.base64-encode", base64Encode);
  register("text-utils.base64-decode", base64Decode);

  register("text-utils.json-string-encode", (text) => JSON.stringify(text));
  register("text-utils.json-string-decode", (text) => {
    let res = JSON.parse(text);
    if (typeof res === "string") {
      return res;
    } else {
      throw new Error("Not a JSON string (mising quotes?)");
    }
  });

  register("text-utils.url-component-encode", encodeURIComponent);
  register("text-utils.url-component-decode", decodeURIComponent);
  register("text-utils.xml-entity-encode", xmlEntityEncode);
  register("text-utils.xml-entity-decode", xmlEntityDecode);
  register("text-utils.mime-header-decode", mimeHeaderDecode);

  // --- generation / insert functions ---

  vscode.commands.registerTextEditorCommand(
    "text-utils.insert-uuid-v4",
    (editor) =>
      editor.edit((editBuilder) => {
        const uppercase =
          vscode.workspace
            .getConfiguration("text-utils", editor.document.uri)
            .get("uppercaseUuids") ?? false;
        for (const selection of editor.selections) {
          editBuilder.replace(
            selection,
            uppercase
              ? crypto.randomUUID().toUpperCase()
              : crypto.randomUUID().toLowerCase(),
          );
        }
      }),
  );
}

export function deactivate() {}
