import * as vscode from 'vscode';

export class StatusBarManager {
    private statusBarItem: vscode.StatusBarItem;

    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
        this.statusBarItem.command = 'promptEnhancer.enhance';
        this.statusBarItem.text = '$(loading~spin) Loading...';
        this.statusBarItem.tooltip = 'Initializing Prompt Enhancer...';
    }

    show(): void {
        this.statusBarItem.show();
    }

    setReady(): void {
        this.statusBarItem.text = '$(sparkle) Enhance';
        this.statusBarItem.tooltip = 'Click to enhance a prompt';
    }

    setEnhancing(): void {
        this.statusBarItem.text = '$(sync~spin) Enhancing...';
        this.statusBarItem.tooltip = 'Enhancing your prompt...';
    }

    dispose(): void {
        this.statusBarItem.dispose();
    }
}

