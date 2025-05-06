# Angular Component Splitter

A lightweight VS Code extension that helps you navigate between Angular component files (`.ts`, `.html`, `.scss`) by placing them in adjacent editor groups. Streamline your Angular development workflow and easily switch between component files with convenient navigation buttons and keyboard shortcuts.

## Features

- **Smart Editor Navigation**  
  When you click the navigation buttons, the extension will intelligently open the related component file in an adjacent editor group.
- **Dynamic Editor Splitting**  
  If your editor is not split, the extension will automatically create a split and open the file there.
- **Adaptive Placement**  
  Works with various editor layouts - if you have multiple editor groups, the extension will find the most appropriate adjacent group.
- **Toggle View Mode**  
  Quickly toggle between single file view and multi-file view with a single button or keyboard shortcut.
- **Smart File Opening**  
  The extension detects already open files and focuses on them instead of opening duplicates.
- **Open All Related Files**  
  With a single click, open both related files in adjacent splits for a complete component overview.
- **Convenient Navigation Buttons**  
  Easy-to-use buttons in the editor title bar for quick navigation between component files.
- **Keyboard Shortcuts**  
  Efficient keyboard shortcuts for all operations.
- **Zero Configuration**  
  Works out of the box—no additional settings required.

## Installation

1. Download the latest `.vsix` from the [Releases](https://github.com/your-repo/angular-component-splitter/releases) page.
2. In VS Code, open the **Extensions** view (`Ctrl+Shift+X` or `Cmd+Shift+X` on macOS).
3. Click the **…** menu in the top-right corner and choose **Install from VSIX…**.
4. Select the downloaded `.vsix` file and reload VS Code if prompted.

## Usage

### Navigation Buttons

When viewing an Angular component file, you'll see navigation buttons in the editor title bar:

- **TS/HTML/SCSS Buttons**: Open the corresponding component file in an adjacent editor group
- **Open Other Files**: Opens both related component files in split views
- **Toggle View**: Switch between single-file and multi-file views

### Keyboard Shortcuts

- `Ctrl+Shift+T` / `Cmd+Shift+T` (macOS): Open the TypeScript file
- `Ctrl+Shift+H` / `Cmd+Shift+H` (macOS): Open the HTML file
- `Ctrl+Shift+S` / `Cmd+Shift+S` (macOS): Open the SCSS file
- `Ctrl+Shift+O` / `Cmd+Shift+O` (macOS): Open both other component files
- `Ctrl+Shift+A` / `Cmd+Shift+A` (macOS): Toggle between single and multi-file views

## How It Works

### Smart Navigation

The extension uses these smart placement rules:
- If your editor is not split, it creates a new split and opens the file there
- If you have two editor groups, it opens the file in the non-active group
- If you have more than two editor groups, it tries to find the most appropriate adjacent group
- If the file is already open in any editor, it focuses on that editor instead of opening a duplicate

### Toggle View Mode

The Toggle View feature provides a convenient way to switch between viewing modes:
- When in single-file view, it will open all related component files in split views
- When in multi-file view, it will close all related component files except the current one

### Open Other Files

When you use the "Open Other Files" command:
1. The extension checks which component files are already open
2. If both files are already open, it will focus on one of them
3. If only one file is open, it will focus on it and open the other in a split
4. If neither file is open, it will open both files in appropriate splits

## Development

1. Clone this repository
   ```bash
   git clone https://github.com/your-repo/angular-component-splitter.git
   cd angular-component-splitter
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Open the project in VS Code
   ```bash
   code .
   ```
4. Press F5 to start debugging

## Terminal Integration

You can also trigger extension commands from the terminal:

```bash
code --execute "angularComponentSplitter.openTs"
code --execute "angularComponentSplitter.openHtml"
code --execute "angularComponentSplitter.openScss"
code --execute "angularComponentSplitter.openOther"
code --execute "angularComponentSplitter.toggleView"
```

This allows integration with external tools, scripts, and automation software.


