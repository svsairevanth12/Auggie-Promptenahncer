"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const promptEnhancer_1 = require("./promptEnhancer");
const statusBar_1 = require("./statusBar");
let enhancer = null;
let statusBar = null;
async function activate(context) {
    console.log('Prompt Enhancer extension is activating...');
    statusBar = new statusBar_1.StatusBarManager();
    statusBar.show();
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || process.cwd();
    enhancer = new promptEnhancer_1.PromptEnhancer(workspaceRoot);
    try {
        await enhancer.initialize();
        statusBar.setReady();
        vscode.window.showInformationMessage('Prompt Enhancer ready!');
    }
    catch (error) {
        vscode.window.showErrorMessage(`Failed to initialize Prompt Enhancer: ${error}`);
        return;
    }
    const enhanceCommand = vscode.commands.registerCommand('promptEnhancer.enhanceSelection', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor');
            return;
        }
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        if (!selectedText.trim()) {
            vscode.window.showWarningMessage('Please select text to enhance');
            return;
        }
        if (!enhancer || !statusBar) {
            return;
        }
        statusBar.setEnhancing();
        try {
            const result = await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Enhancing Prompt',
                cancellable: false
            }, async () => enhancer.enhancePrompt(selectedText));
            await editor.edit(editBuilder => {
                editBuilder.replace(selection, result.enhanced);
            });
            vscode.window.showInformationMessage('Prompt enhanced!');
        }
        catch (error) {
            vscode.window.showErrorMessage(`Enhancement failed: ${error}`);
        }
        finally {
            statusBar.setReady();
        }
    });
    context.subscriptions.push(enhanceCommand, statusBar);
}
async function deactivate() {
    if (enhancer) {
        await enhancer.dispose();
    }
    if (statusBar) {
        statusBar.dispose();
    }
}
//# sourceMappingURL=extension.js.map