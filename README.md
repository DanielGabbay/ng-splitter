# Angular Component Splitter

A lightweight VS Code extension that helps you navigate between Angular component files (`.ts`, `.html`, `.scss`) by placing them in adjacent editor groups. Streamline your Angular development workflow and easily switch between component files with convenient navigation buttons.

## Features

- **Smart Editor Navigation**  
  When you click the navigation buttons, the extension will intelligently open the related component file in an adjacent editor group.
- **Dynamic Editor Splitting**  
  If your editor is not split, the extension will automatically create a split and open the file there.
- **Adaptive Placement**  
  Works with various editor layouts - if you have multiple editor groups, the extension will find the most appropriate adjacent group.
- **Convenient Navigation Buttons**  
  Easy-to-use buttons in the editor title bar for quick navigation between component files.
- **Zero Configuration**  
  Works out of the box—no additional settings required.

## Installation

1. Download the latest `.vsix` from the [Releases](https://github.com/your-repo/angular-component-splitter/releases) page.
2. In VS Code, open the **Extensions** view (`Ctrl+Shift+X` or `Cmd+Shift+X` on macOS).
3. Click the **…** menu in the top-right corner and choose **Install from VSIX…**.
4. Select the downloaded `.vsix` file and reload VS Code if prompted.

## Usage

1. Open any Angular component file in your workspace:
   - `my-component.component.ts`
   - `my-component.component.html`
   - `my-component.component.scss`
2. Use the navigation buttons in the editor title bar to open related component files:
   - When viewing a `.ts` file, you'll see buttons for HTML and SCSS
   - When viewing a `.html` file, you'll see buttons for TS and SCSS
   - When viewing a `.scss` file, you'll see buttons for TS and HTML

3. The extension will open the related file in an adjacent editor group:
   - If the editor is not split, it will create a split and open the file there
   - If there are already multiple splits, it will find the most appropriate adjacent group

## How It Works

The extension uses these smart placement rules:
- If your editor is not split, it creates a new split and opens the file there
- If you have two editor groups, it opens the file in the non-active group
- If you have more than two editor groups or a grid layout, it tries to find the most appropriate adjacent group

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


