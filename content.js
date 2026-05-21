let emojiData = null;
let activePanel = null;
let activeElement = null;
let currentQuery = "";
let selectedIndex = 0;
let filteredEmojis = [];

console.log("Emoji Searcher: Enhanced script loaded");

// Load data
const dataUrl = (typeof chrome !== 'undefined' ? chrome : browser).runtime.getURL('emoji_data.json');
fetch(dataUrl)
    .then(response => response.json())
    .then(data => {
        emojiData = data;
    })
    .catch(err => console.error("Emoji Searcher Load Error:", err));

function createPanel() {
    if (activePanel) return;
    activePanel = document.createElement('div');
    activePanel.className = 'emoji-search-panel';
    document.body.appendChild(activePanel);
}

function removePanel() {
    if (activePanel) {
        activePanel.remove();
        activePanel = null;
    }
}

function updatePanel(query) {
    if (!emojiData) return;
    
    const lowerQuery = query.toLowerCase();
    filteredEmojis = [];
    
    for (const [emoji, details] of Object.entries(emojiData)) {
        const matchesName = details.name.toLowerCase().includes(lowerQuery);
        const matchesRu = details.tags.ru.some(tag => tag.toLowerCase().includes(lowerQuery));
        const matchesEn = details.tags.en.some(tag => tag.toLowerCase().includes(lowerQuery));
        
        if (matchesName || matchesRu || matchesEn) {
            filteredEmojis.push({ emoji, name: details.name });
        }
        if (filteredEmojis.length >= 30) break; // More options
    }

    if (filteredEmojis.length === 0) {
        removePanel();
        return;
    }

    createPanel();
    renderResults();
    positionPanel();
}

function renderResults() {
    activePanel.innerHTML = '';
    selectedIndex = Math.min(selectedIndex, filteredEmojis.length - 1);
    if (selectedIndex < 0) selectedIndex = 0;

    filteredEmojis.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'emoji-search-item' + (index === selectedIndex ? ' selected' : '');
        div.innerHTML = `<span class="emoji">${item.emoji}</span><span class="name">${item.name}</span>`;
        div.onmousedown = (e) => {
            e.preventDefault();
            insertEmoji(item.emoji);
        };
        activePanel.appendChild(div);
        
        if (index === selectedIndex) {
            div.scrollIntoView({ block: 'nearest' });
        }
    });
}

function positionPanel() {
    if (!activeElement || !activePanel) return;
    
    const rect = activeElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    let top = rect.bottom + scrollTop + 5;
    let left = rect.left + scrollLeft;

    // Boundary checks
    if (left + 280 > window.innerWidth) {
        left = window.innerWidth - 300;
    }
    if (top + 250 > window.innerHeight + scrollTop) {
        top = rect.top + scrollTop - activePanel.offsetHeight - 5;
    }

    activePanel.style.top = top + 'px';
    activePanel.style.left = Math.max(0, left) + 'px';
}

function insertEmoji(emoji) {
    if (!activeElement) return;

    const isInput = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA';
    
    if (isInput) {
        const text = activeElement.value;
        const start = activeElement.selectionStart;
        const before = text.substring(0, start - currentQuery.length - 1);
        const after = text.substring(start);
        activeElement.value = before + emoji + after;
        activeElement.selectionStart = activeElement.selectionEnd = before.length + emoji.length;
    } else {
        // More robust contenteditable insertion
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            
            // Delete the trigger :query
            const textNode = range.startContainer;
            if (textNode.nodeType === Node.TEXT_NODE) {
                const content = textNode.textContent;
                const offset = range.startOffset;
                const searchStr = ":" + currentQuery;
                const beforeIdx = content.lastIndexOf(searchStr, offset);
                if (beforeIdx !== -1) {
                    textNode.textContent = content.substring(0, beforeIdx) + emoji + content.substring(offset);
                    // Move caret after emoji
                    const newRange = document.createRange();
                    newRange.setStart(textNode, beforeIdx + emoji.length);
                    newRange.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                }
            }
        }
    }
    
    activeElement.dispatchEvent(new Event('input', { bubbles: true }));
    activeElement.dispatchEvent(new Event('change', { bubbles: true }));
    removePanel();
    activeElement.focus();
}

function getCaretPosition(element) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        return preCaretRange.toString().length;
    }
    return 0;
}

// Global listener for all inputs, including dynamically added ones
document.addEventListener('input', (e) => {
    const el = e.target;
    // Expanded check for various input types
    const isSearchable = el.tagName === 'INPUT' || 
                         el.tagName === 'TEXTAREA' || 
                         el.isContentEditable || 
                         el.getAttribute('role') === 'textbox' ||
                         el.getAttribute('role') === 'combobox';

    if (!isSearchable) return;

    activeElement = el;
    const isInput = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA';
    const value = isInput ? el.value : el.innerText;
    const selectionStart = isInput ? el.selectionStart : getCaretPosition(el);
    
    const textBeforeCaret = value.substring(0, selectionStart);
    const match = textBeforeCaret.match(/:([^\s:]{1,})$/);

    if (match) {
        currentQuery = match[1];
        updatePanel(currentQuery);
    } else {
        removePanel();
    }
}, true);

document.addEventListener('keydown', (e) => {
    if (!activePanel) return;

    if (e.key === 'ArrowDown') {
        selectedIndex = (selectedIndex + 1) % filteredEmojis.length;
        renderResults();
        e.preventDefault();
        e.stopPropagation();
    } else if (e.key === 'ArrowUp') {
        selectedIndex = (selectedIndex - 1 + filteredEmojis.length) % filteredEmojis.length;
        renderResults();
        e.preventDefault();
        e.stopPropagation();
    } else if (e.key === 'Enter' || e.key === 'Tab') {
        if (filteredEmojis[selectedIndex]) {
            insertEmoji(filteredEmojis[selectedIndex].emoji);
            e.preventDefault();
            e.stopPropagation();
        }
    } else if (e.key === 'Escape') {
        removePanel();
        e.preventDefault();
        e.stopPropagation();
    }
}, true);

document.addEventListener('mousedown', (e) => {
    if (activePanel && !activePanel.contains(e.target)) {
        removePanel();
    }
});

// Handle window resize/scroll to reposition panel
window.addEventListener('scroll', () => { if (activePanel) positionPanel(); }, true);
window.addEventListener('resize', () => { if (activePanel) positionPanel(); }, true);
