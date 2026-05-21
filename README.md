# Emoji Searcher - Browser Extension

A lightweight, fast, and unobtrusive browser extension that allows you to search and insert emojis in almost any text input field across the web using a simple `:keyword` trigger.

## Features

- **Universal Input Support**: Works in standard `<input>`, `<textarea>`, and complex `contenteditable` fields (like YouTube search, WhatsApp Web, Slack, etc.).
- **Smart Trigger**: Type `:` followed by at least one character (e.g., `:cat`, `:улыбка`) to bring up the suggestion panel.
- **Bilingual Search**: Searches through emoji metadata and tags in both **English** and **Russian**.
- **Modern UI**: Features a sleek, dark-themed horizontal scrolling panel.
- **Keyboard Navigation**: 
  - `Left` / `Right` arrows to navigate.
  - `Up` / `Down` arrows to jump by 5 items.
  - `Enter` or `Tab` to insert.
  - `Escape` to close the panel.
- **Privacy First**: All data is stored locally within the extension. It requires no external API calls or tracking.

## Installation

### Google Chrome / Edge / Yandex / Brave (Chromium-based)

1. Download or clone this repository to your computer.
2. Open your browser and navigate to the extensions management page:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
3. Enable **"Developer mode"** (usually a toggle in the top right corner).
4. Click on the **"Load unpacked"** (Загрузить распакованное расширение) button.
5. Select the `emoji-extension` folder containing the `manifest.json` file.
6. The extension is now installed and active!

### Mozilla Firefox

*Note: Firefox has stricter rules for unpacked extensions. By default, they are installed temporarily and will be removed upon browser restart.*

**Temporary Installation (for testing):**
1. Open Firefox and navigate to `about:debugging`.
2. Click on **"This Firefox"** (Этот Firefox) in the left sidebar.
3. Click **"Load Temporary Add-on..."** (Загрузить временное дополнение...).
4. Select the `manifest.json` file inside the `emoji-extension` folder.

**Permanent Installation:**
To install permanently, you need to either use Firefox Developer Edition/Nightly (and disable signature checks in `about:config`) or submit the extension to Mozilla Add-ons for a free, unlisted signature.

## How to Use

1. Click into any text field on any website.
2. Type a colon `:` immediately followed by a search word (e.g., `:fire`, `:огонь`, `:smile`).
3. A horizontal panel will appear below your cursor with matching emojis.
4. Use your mouse to click an emoji, or use the arrow keys to select and press `Enter`.
5. The `:keyword` text will be automatically replaced with the selected emoji.

## File Structure

- `manifest.json`: Extension configuration and permissions.
- `content.js`: The main logic for detecting input, searching data, and manipulating the DOM.
- `style.css`: Styles for the dark-themed, horizontal emoji panel.
- `emoji_data.json`: The local database containing emoji symbols, names, and bilingual tags.
