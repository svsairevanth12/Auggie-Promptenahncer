import * as vscode from 'vscode';
import { PromptEnhancer, DEFAULT_SYSTEM_PROMPT } from './promptEnhancer';
import { StatusBarManager } from './statusBar';
import { InputPanel } from './inputPanel';

export interface PromptTemplate {
    id: string;
    name: string;
    prompt: string;
}

let enhancer: PromptEnhancer | null = null;
let statusBar: StatusBarManager | null = null;
let isInitialized = false;
let globalContext: vscode.ExtensionContext;

const STORAGE_KEY = 'promptEnhancer.templates';
const ACTIVE_KEY = 'promptEnhancer.activeTemplate';

const outputChannel = vscode.window.createOutputChannel('Prompt Enhancer');

function log(message: string) {
    outputChannel.appendLine(`[${new Date().toISOString()}] ${message}`);
}

function getDefaultTemplates(): PromptTemplate[] {
    return [{
        id: 'default',
        name: 'Default Enhancer',
        prompt: DEFAULT_SYSTEM_PROMPT
    }];
}

export function getTemplates(): PromptTemplate[] {
    const stored = globalContext.globalState.get<PromptTemplate[]>(STORAGE_KEY);
    return stored && stored.length > 0 ? stored : getDefaultTemplates();
}

export function saveTemplates(templates: PromptTemplate[]) {
    globalContext.globalState.update(STORAGE_KEY, templates);
}

export function getActiveTemplateId(): string {
    return globalContext.globalState.get<string>(ACTIVE_KEY) || 'default';
}

export function setActiveTemplateId(id: string) {
    globalContext.globalState.update(ACTIVE_KEY, id);
    const templates = getTemplates();
    const active = templates.find(t => t.id === id);
    if (active && enhancer) {
        enhancer.setSystemPrompt(active.prompt);
        log(`Switched to template: ${active.name}`);
    }
}

export async function activate(context: vscode.ExtensionContext) {
    log('Extension activating...');
    globalContext = context;

    statusBar = new StatusBarManager();
    statusBar.show();
    statusBar.setReady();

    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || process.cwd();
    log(`Workspace root: ${workspaceRoot}`);

    enhancer = new PromptEnhancer(workspaceRoot);

    const activeId = getActiveTemplateId();
    const templates = getTemplates();
    const active = templates.find(t => t.id === activeId) || templates[0];
    enhancer.setSystemPrompt(active.prompt);

    const enhanceCommand = vscode.commands.registerCommand('promptEnhancer.enhance', async () => {
        log('Enhance command triggered');
        InputPanel.createOrShow(context.extensionUri, handleEnhance);
    });

    async function handleEnhance(inputText: string): Promise<string> {
        log(`Enhancing: "${inputText.substring(0, 50)}..."`);
        statusBar?.setEnhancing();

        try {
            if (!isInitialized) {
                log('Indexing codebase (first use)...');
                await enhancer!.initialize();
                isInitialized = true;
                log('Indexing complete');
            }

            const result = await enhancer!.enhancePrompt(inputText);
            log(`Enhanced (${result.enhanced.length} chars)`);

            await vscode.env.clipboard.writeText(result.enhanced);
            return result.enhanced;

        } catch (error) {
            log(`Enhancement failed: ${error}`);
            throw error;
        } finally {
            statusBar?.setReady();
        }
    }

    context.subscriptions.push(enhanceCommand, statusBar, outputChannel);
    log('Extension activated (lazy init - will index on first use)');
}

export async function deactivate() {
    log('Extension deactivating...');
    InputPanel.dispose();
    if (enhancer) {
        await enhancer.dispose();
    }
}

