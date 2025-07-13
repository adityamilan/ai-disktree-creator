# AI DiskTree Creator (AI Scaffold Builder) README
    Speed up your workflow by instantly creating full folder and file structures in VS Code from AI-generated or manually written directory trees. Just paste your tree into a text file and let this extension convert it into real folders and files in seconds.

## Prerequisites

    Make sure your VS Code workspace is open at the folder where you want the tree structure to be created.

    Install the 'AI DiskTree Creator (AI Scaffold Builder)' extension from the VS Code Marketplace.

## How to Use

    Open Base Folder:
    Open the folder in VS Code where you want the directory structure to be created.

    Create a Text File:
    Inside the base folder, create a plain .txt file (e.g., structure.txt or anything).

    Paste Directory Structure:
    Paste your tree structure inside the file. For example:

    my-project/
    ├── index.html
    ├── style/
    │   └── main.css
    └── scripts/
        ├── app.js
        └── utils.js

    Run the Extension:

        Open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P).

        Search for and run 'AI DiskTree Creator (AI Scaffold Builder)': Generate from Tree File.

    Done!
    The extension will parse the tree and create corresponding folders and blank files.

## Supported Syntax

    Indentation using pipes and dashes (├──, └──, etc.).

    Nesting via spacing or indentation (based on consistent tree formatting).

    Optional support for tree roots ending with / to indicate folders.

## Notes

    Existing files/folders with the same name will not be overwritten.

    Only plain-text structures are supported (no JSON or YAML for now).

    Make sure your tree format is clean and consistent.
