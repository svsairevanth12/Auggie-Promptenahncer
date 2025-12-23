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
exports.PromptEnhancer = void 0;
class PromptEnhancer {
    context = null;
    workspaceRoot;
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
    }
    async initialize() {
        const { FileSystemContext } = await Promise.resolve().then(() => __importStar(require('@augmentcode/auggie-sdk')));
        this.context = await FileSystemContext.create({
            directory: this.workspaceRoot,
            debug: false
        });
    }
    async enhancePrompt(prompt) {
        if (!this.context) {
            await this.initialize();
        }
        const enhancementPrompt = 'Here is an instruction that I\'d like to give you, but it needs to be improved. ' +
            'Rewrite and enhance this instruction to make it clearer, more specific, ' +
            'less ambiguous, and correct any mistakes. ' +
            'If there is code in triple backticks (```) consider whether it is a code sample and should remain unchanged. ' +
            'Reply with the following format:\n\n' +
            '### BEGIN RESPONSE ###\n' +
            'Here is an enhanced version of the original instruction that is more specific and clear:\n' +
            '<enhanced-prompt>enhanced prompt goes here</enhanced-prompt>\n\n' +
            '### END RESPONSE ###\n\n' +
            'Here is my original instruction:\n\n' +
            prompt;
        const response = await this.context.searchAndAsk(prompt, enhancementPrompt);
        const enhanced = this.parseEnhancedPrompt(response);
        if (!enhanced) {
            throw new Error('Failed to parse enhanced prompt from response');
        }
        return { original: prompt, enhanced };
    }
    parseEnhancedPrompt(response) {
        const match = response.match(/<enhanced-prompt>([\s\S]*?)<\/enhanced-prompt>/);
        if (match?.[1]) {
            return match[1].trim();
        }
        return response.replace(/^(Enhanced|Improved|Rewritten):\s*/i, '').trim() || null;
    }
    async dispose() {
        if (this.context) {
            await this.context.close();
            this.context = null;
        }
    }
}
exports.PromptEnhancer = PromptEnhancer;
//# sourceMappingURL=promptEnhancer.js.map