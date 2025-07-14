import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('ai-disk-tree-creator.generate', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active text editor.');
            return;
        }

        const text = editor.document.getText();
        if (!text) {
            vscode.window.showErrorMessage('No text in the active editor.');
            return;
        }

        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder open.');
            return;
        }

        try {
            const log = await parseAndGenerate(text, workspaceFolder.uri.fsPath); // Collect log
            // Insert log at the end of the document
            var panel = vscode.window.createWebviewPanel(
                'textbox',
                'AI DiskTree Creation Log',
                vscode.ViewColumn.One,
                {enableScripts: true}
            );
            panel.webview.html = getWebViewContent(log);

            // editor.edit(editBuilder => {
            //     editBuilder.insert(editor.document.positionAt(text.length), '\n\n--- Generation Log ---\n' + log);
            // });
            vscode.window.showInformationMessage('Tree structure generated successfully!');
        } catch (error: any) {
            vscode.window.showErrorMessage(`Error generating tree: ${error.message}`);
        }
    });

    context.subscriptions.push(disposable);
}

function getWebViewContent(log: string) {
    return `<!DOCTYPE html>
    <html lang="en">
        <head>
            <title></title>
            <style>
                pre {color: green;}
            </style>
            <script>
                const vcode = acquireVsCodeApi();
                document.addEventListener('DOMContentLoaded', function() {
                    const notice = document.getElementById('notice');
                    notice.style.color = 'yellow';
                })
                
            </script>
        </head>
        <body>
            <h2>AI DiskTree Creation (AI Scaffold Builder) Log</h2>
            <p id="notice">Below is the directory structure creation log</p>
            <pre>${log}</pre>
        </body>
    </html>`;
}

export function deactivate() { }

async function parseAndGenerate(treeText: string, basePath: string): Promise<string> {
    const lines = treeText.split('\n');
    let currentDepth = 0;
    let currentPath = basePath;
    let log = ''; // Commentary log buffer
    const folderStack: string[] = [basePath];


    //Read Next Line Function
    function readNextLine(line: string): { name: string; depth: number, commentary: string } {
        let commentary = ''; // Commentary for this line

        let cleanedLine = line.trimEnd();
        const commentIndex = cleanedLine.indexOf('#');
        if (commentIndex > -1) {
            //commentary += `Found comment. Removing from index ${commentIndex}. `;
            cleanedLine = cleanedLine.substring(0, commentIndex).trimEnd(); // Trim after comment removal
        }

        cleanedLine = cleanedLine.replace(/[\u{1F4C1}-\u{1F4C4}]\s?/gu, '');
        cleanedLine = cleanedLine.replace(/[│├─└|]/g, ' ');
        //commentary += `Replaced graphical characters. `;
        cleanedLine = cleanedLine.trimEnd();

        const leadingSpaces = cleanedLine.length - cleanedLine.trimStart().length;
        const depth = leadingSpaces / 4;
        //commentary += `Line depth as ${depth}. `;
        cleanedLine = cleanedLine.trimStart();
        //commentary += `Trimmed leading spaces. Name is now ${cleanedLine}.`;

        return { name: cleanedLine, depth: depth, commentary: commentary };
    }


    // Main Program Loop
    for (const line of lines) {
        const { name, depth, commentary } = readNextLine(line);
        //log += `Line: ${line.trimEnd()}\n\t${commentary}\n`;

        // Skip if name is empty
        if (!name) {
            //log += '\tSkipping line (empty name).\n\n';
            continue;
        }

        // Display the current values of folderStack
        // folderStack.forEach((stackEntry, index) => {
        //     log += `\tfolderStack[${index}] = ${stackEntry}\n`;
        // });

        if (name.startsWith('/') || name.endsWith('/')) {
            // Folder Creation
            currentDepth = depth + 1;
            folderStack[currentDepth] = path.join(folderStack[currentDepth - 1], name);
            const fullPath = folderStack[currentDepth];
            log += `\tCreating folder: ${fullPath}\n`;

            if (!fs.existsSync(fullPath)) {
                await fs.promises.mkdir(fullPath, { recursive: true });
            }
        }
        else {
            // File Creation
            currentDepth = depth;
            currentPath = folderStack[depth];
            const fullPath = path.join(currentPath, name);
            log += `\tCreating file:   ${fullPath}\n`;
            if (!fs.existsSync(fullPath)) {
                await fs.promises.writeFile(fullPath, '', { flag: 'w' });
            }
        }

        //log += `\n`;
    }

    return log; // Return the accumulated log
}