<p align="center">
  <img src="https://raw.githubusercontent.com/svsairevanth12/Auggie-Promptenahncer/main/icon.png" width="128" alt="Prompt Enhancer Logo">
</p>

<h1 align="center">Auggie Prompt Enhancer</h1>

<p align="center">
  <b>Transform vague AI prompts into clear, specific instructions</b><br>
  Powered by Augment SDK with codebase context awareness
</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=AugieeCredit.auggie-promptenhancer">
    <img src="https://img.shields.io/visual-studio-marketplace/v/AugieeCredit.auggie-promptenhancer?style=flat-square" alt="Version">
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=AugieeCredit.auggie-promptenhancer">
    <img src="https://img.shields.io/visual-studio-marketplace/i/AugieeCredit.auggie-promptenhancer?style=flat-square" alt="Installs">
  </a>
</p>

---

## Features

- ✨ **Smart Enhancement** - Transforms vague prompts into detailed instructions
- 🧠 **Codebase Aware** - Uses your project context for better results
- 📝 **Custom Templates** - Create and save your own system prompts
- 📋 **Auto Copy** - Enhanced prompt copied to clipboard instantly

---

## Installation

### 1. Install Extension

**From VS Code Marketplace:**
Search "Prompt Enhancer" in Extensions (`Ctrl+Shift+X`)

**Or from VSIX:**
```powershell
code --install-extension prompt-enhancer-0.1.0.vsix
```

### 2. Install Augment CLI

```powershell
npm install -g @augmentcode/auggie@prerelease
```

### 3. Login

```powershell
auggie login
```

### 4. Reload VS Code

`Ctrl+Shift+P` → "Reload Window"

---

## Usage

1. Click **✨ Enhance** in status bar (bottom-right)
2. Type your prompt
3. Click **Enhance Prompt**
4. Paste with `Ctrl+V`

---

## Custom Templates

Create your own system prompts for different use cases:

| Button | Action |
|--------|--------|
| ⚙️ | Edit current template |
| + | Create new template |
| Dropdown | Switch between templates |

Templates are saved locally and persist across sessions.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CLI not found | `npm install -g @augmentcode/auggie@prerelease` |
| Auth error | `auggie login` |
| Not working | Reload VS Code |

---

## License

MIT

