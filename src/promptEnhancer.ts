import type { FileSystemContext } from '@augmentcode/auggie-sdk';

export interface EnhanceResult {
    original: string;
    enhanced: string;
}

export const DEFAULT_SYSTEM_PROMPT =
    'Here is an instruction that I\'d like to give you, but it needs to be improved. ' +
    'Rewrite and enhance this instruction to make it clearer, more specific, ' +
    'less ambiguous, and correct any mistakes. ' +
    'If there is code in triple backticks (```) consider whether it is a code sample and should remain unchanged. ' +
    'Reply with the following format:\n\n' +
    '### BEGIN RESPONSE ###\n' +
    '<enhanced-prompt>enhanced prompt goes here</enhanced-prompt>\n' +
    '### END RESPONSE ###\n\n' +
    'Here is my original instruction:\n\n';

export class PromptEnhancer {
    private context: FileSystemContext | null = null;
    private workspaceRoot: string;
    private systemPrompt: string = DEFAULT_SYSTEM_PROMPT;

    constructor(workspaceRoot: string) {
        this.workspaceRoot = workspaceRoot;
    }

    setSystemPrompt(prompt: string) {
        this.systemPrompt = prompt;
    }

    async initialize(): Promise<void> {
        const { FileSystemContext } = await import('@augmentcode/auggie-sdk');
        this.context = await FileSystemContext.create({
            directory: this.workspaceRoot,
            debug: false
        });
    }

    async enhancePrompt(prompt: string): Promise<EnhanceResult> {
        if (!this.context) {
            await this.initialize();
        }

        const fullPrompt = this.systemPrompt + prompt;
        const response = await this.context!.searchAndAsk(prompt, fullPrompt);
        const enhanced = this.parseEnhancedPrompt(response);

        if (!enhanced) {
            throw new Error('Failed to parse enhanced prompt from response');
        }

        return { original: prompt, enhanced };
    }

    private parseEnhancedPrompt(response: string): string | null {
        const match = response.match(/<enhanced-prompt>([\s\S]*?)<\/enhanced-prompt>/);
        if (match?.[1]) {
            return match[1].trim();
        }
        return response.replace(/^(Enhanced|Improved|Rewritten):\s*/i, '').trim() || null;
    }

    async dispose(): Promise<void> {
        if (this.context) {
            await this.context.close();
            this.context = null;
        }
    }
}

