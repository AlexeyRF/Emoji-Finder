import sys
import os
import json
import threading
import keyboard
import pyautogui
import pyperclip
from PyQt5.QtWidgets import QApplication, QWidget, QVBoxLayout, QLineEdit, QListWidget, QListWidgetItem, QFrame
from PyQt5.QtCore import Qt, pyqtSignal, QObject, QTimer, QEvent
from PyQt5.QtGui import QFont

class EmojiSearcher:
    def __init__(self, data_file="emoji_data.json"):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.data_file = os.path.join(base_dir, data_file)
        self.data = self._load_data()

    def _load_data(self):
        if not os.path.exists(self.data_file):
            print(f"Warning: {self.data_file} not found. Search will return no results.")
            return {}
        with open(self.data_file, "r", encoding="utf-8") as f:
            return json.load(f)

    def search(self, query_text):
        if not query_text:
            return []
            
        query_words = query_text.lower().split()
        matches = []
        
        for emoji_char, info in self.data.items():
            all_tags = []
            tags_dict = info.get("tags", {})
            for lang_tags in tags_dict.values():
                if isinstance(lang_tags, list):
                    all_tags.extend([t.lower() for t in lang_tags])
            
            all_tags.append(info.get("name", "").lower())
            
            all_words_match = True
            for qw in query_words:
                word_found = False
                for tag in all_tags:
                    if qw in tag:
                        word_found = True
                        break
                if not word_found:
                    all_words_match = False
                    break
            
            if all_words_match:
                matches.append(emoji_char)
                
        return matches


class HotkeySignaler(QObject):
    show_signal = pyqtSignal()

class EmojiSearchWidget(QWidget):
    def __init__(self):
        super().__init__()
        self.searcher = EmojiSearcher()
        self.setWindowFlags(Qt.FramelessWindowHint | Qt.WindowStaysOnTopHint | Qt.Tool)
        self.setAttribute(Qt.WA_TranslucentBackground)
        
        # Styles mirroring the emoji-extension CSS
        self.setStyleSheet("""
            QWidget#MainFrame {
                background: #242424;
                border: 1px solid #444;
                border-radius: 12px;
            }
            QLineEdit {
                background: #3c3f41;
                color: white;
                border: 1px solid #555;
                border-radius: 6px;
                padding: 6px;
                font-family: "Segoe UI";
                font-size: 14px;
                margin-bottom: 4px;
            }
            QListWidget {
                background: transparent;
                border: none;
                outline: none;
            }
            QListWidget::item {
                padding: 4px;
                border-radius: 8px;
                color: white;
            }
            QListWidget::item:selected {
                background-color: #555;
                border: 2px solid #666;
            }
            QListWidget::item:hover {
                background-color: #444;
            }
            QScrollBar:horizontal {
                height: 0px; /* Hide scrollbar completely */
            }
        """)

        # Main Layout
        self.main_frame = QFrame(self)
        self.main_frame.setObjectName("MainFrame")
        layout = QVBoxLayout(self.main_frame)
        layout.setContentsMargins(10, 10, 10, 10)
        layout.setSpacing(4)
        
        main_layout = QVBoxLayout(self)
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.addWidget(self.main_frame)
        
        self.search_input = QLineEdit()
        self.search_input.setPlaceholderText("Поиск...")
        self.search_input.textChanged.connect(self.on_search)
        layout.addWidget(self.search_input)
        
        self.list_widget = QListWidget()
        # Make it a horizontal row like the extension
        self.list_widget.setFlow(QListWidget.LeftToRight)
        self.list_widget.setWrapping(False)
        self.list_widget.setFixedHeight(60) # Fixed height for single row
        self.list_widget.setTextElideMode(Qt.ElideNone) # Prevent "..." from appearing
        
        # Font that supports color emojis
        font = QFont("Segoe UI Emoji", 20)
        self.list_widget.setFont(font)
        
        self.list_widget.itemActivated.connect(self.on_item_activated)
        self.list_widget.itemClicked.connect(self.on_item_activated)
        layout.addWidget(self.list_widget)

        # Bind events
        self.installEventFilter(self)
        self.search_input.installEventFilter(self)
        self.list_widget.installEventFilter(self)
        
    def show_at_cursor(self):
        x, y = pyautogui.position()
        
        width, height = 350, 120
        self.resize(width, height)
        
        screen = QApplication.primaryScreen().geometry()
        if x + width > screen.width(): x = screen.width() - width
        if y + height > screen.height(): y = screen.height() - height
        
        self.move(x, y)
        self.search_input.clear()
        self.list_widget.clear()
        self.show()
        self.activateWindow()
        self.search_input.setFocus()
        
    def on_search(self, text):
        if len(text) >= 2:
            results = self.searcher.search(text)[:50]
            self.list_widget.clear()
            for char in results:
                item = QListWidgetItem(char)
                item.setTextAlignment(Qt.AlignCenter)
                self.list_widget.addItem(item)
            if self.list_widget.count() > 0:
                self.list_widget.setCurrentRow(0)
        else:
            self.list_widget.clear()

    def on_item_activated(self, item):
        self.paste_emoji(item.text())
        
    def paste_emoji(self, text):
        self.hide()
        pyperclip.copy(text)
        # Small delay to ensure target window regains focus before pasting
        QTimer.singleShot(100, lambda: keyboard.send('ctrl+v'))

    def eventFilter(self, obj, event):
        if event.type() == QEvent.WindowDeactivate:
            # Hide when losing focus (clicking outside)
            self.hide()
            return True
            
        if event.type() == QEvent.KeyPress:
            if event.key() == Qt.Key_Escape:
                self.hide()
                return True
            elif event.key() == Qt.Key_Return:
                item = self.list_widget.currentItem()
                if item:
                    self.paste_emoji(item.text())
                return True
            elif event.key() == Qt.Key_Right and obj == self.search_input:
                self.list_widget.setFocus()
                return True
            elif event.key() == Qt.Key_Down and obj == self.search_input:
                self.list_widget.setFocus()
                return True
                
        return super().eventFilter(obj, event)

class App:
    def __init__(self):
        self.qapp = QApplication(sys.argv)
        self.qapp.setQuitOnLastWindowClosed(False)
        self.widget = EmojiSearchWidget()
        self.signaler = HotkeySignaler()
        self.signaler.show_signal.connect(self.widget.show_at_cursor)
        
        self.setup_hotkeys()
        
    def setup_hotkeys(self):
        try:
            keyboard.add_hotkey('ctrl+alt+;', self.on_hotkey, suppress=True)
            keyboard.add_hotkey('ctrl+alt+ж', self.on_hotkey, suppress=True)
        except Exception as e:
            print(e)
            
    def on_hotkey(self):
        self.signaler.show_signal.emit()
        
    def run(self):
        sys.exit(self.qapp.exec_())

if __name__ == "__main__":
    app = App()
    app.run()
