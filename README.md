# Emoji Searcher - Поиск эмодзи

Удобный и быстрый инструмент для поиска и вставки эмодзи. Проект включает в себя как **браузерное расширение**, так и **системное приложение для Windows**, позволяющее вставлять эмодзи в любой программе.

## Возможности

- **Системное приложение (Windows)**: Работает поверх всех окон, активируется горячей клавишей и позволяет вставить эмодзи в любой мессенджер или программу.
- **Браузерное расширение**: Поддерживает ввод `:ключевое_слово` в стандартных полях `<input>`, `<textarea>` и сложных полях `contenteditable` (например, поиск YouTube, WhatsApp Web, Slack).
- **Двуязычный поиск**: Поиск по тегам и названиям на **английском** и **русском** языках.
- **Современный интерфейс**: Стильная тёмная тема с горизонтальной прокруткой и цветными эмодзи.
- **Локальная работа**: Все данные хранятся локально, без запросов к внешним API.

---

## Системное приложение (Windows)

Вы можете использовать это приложение как глобальную утилиту для Windows, чтобы быстро вставлять эмодзи вообще в любой программе (блокнот, Telegram, Word и т.д.).

### Установка и запуск

1. Убедитесь, что у вас установлен Python.
2. Установите необходимые библиотеки (выполните команду в терминале):
   ```bash
   pip install PyQt5 keyboard pyautogui pyperclip
   ```

### Как использовать

1. Нажмите комбинацию клавиш `Ctrl + Alt + ;` (или `Ctrl + Alt + ж` в русской раскладке) в любом приложении.
2. Возле курсора мыши появится всплывающее окно поиска.
3. Начните вводить текст (например, "кот" или "смех").
4. С помощью стрелочек на клавиатуре (или мышкой) выберите эмодзи.
5. Нажмите `Enter` — окно исчезнет, а выбранный эмодзи автоматически вставится в ваш текст!

---

## Браузерное расширение

### Установка (Chrome / Edge / Yandex / Brave)

1. Откройте страницу управления расширениями в браузере:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
2. Включите **"Режим разработчика"** (обычно переключатель в правом верхнем углу).
3. Нажмите кнопку **"Загрузить распакованное расширение"** (Load unpacked).
4. Выберите папку `emoji-extension` из этого проекта.
5. Готово!

### Установка в Mozilla Firefox

*Примечание: Firefox по умолчанию удаляет такие расширения после перезапуска браузера (если они не опубликованы официально).*

1. Откройте страницу `about:debugging`.
2. Перейдите в раздел **"Этот Firefox"**.
3. Нажмите **"Загрузить временное дополнение..."**.
4. Выберите файл `manifest.json` в папке `emoji-extension`.

### Как использовать

1. Кликните в любое текстовое поле на сайте.
2. Введите двоеточие `:` и сразу же слово для поиска (например, `:огонь`, `:smile`).
3. Под курсором появится панель с подходящими эмодзи.
4. Выберите нужный эмодзи мышью или стрелочками и нажмите `Enter`.
5. Текст `:ключевое_слово` будет заменен на эмодзи.

---

## Структура файлов

- `global_app.pyw` — Основной скрипт глобального системного приложения на PyQt5.
- `run_bg.vbs` — Скрипт для скрытого (фонового) запуска системного приложения `global_app.pyw`.
- `emoji_search.py` — Логика движка поиска эмодзи по базе.
- Папка `emoji-extension/` — Исходный код браузерного расширения (JS/CSS/HTML).
- `emoji_tags_refined.json` — Локальная база данных всех эмодзи и их тегов на разных языках.

---
---

# Emoji Searcher - System App & Browser Extension
*(English Version)*

A lightweight, fast, and unobtrusive tool that allows you to search and insert emojis anywhere. This project includes both a **Browser Extension** and a **Windows System App**.

## Features

- **Windows System App**: Works globally across all apps. Triggered by a hotkey, it pops up right next to your cursor.
- **Browser Extension**: Works in standard `<input>`, `<textarea>`, and complex `contenteditable` fields using a simple `:keyword` trigger.
- **Bilingual Search**: Searches through emoji metadata and tags in both **English** and **Russian**.
- **Modern UI**: Features a sleek, dark-themed horizontal scrolling panel.
- **Privacy First**: All data is stored locally. No external API calls or tracking.

---

## Windows System App

Use this app as a global utility to quickly insert emojis into any application (Notepad, Telegram, Word, etc.).

### Installation

1. Ensure you have Python installed.
2. Install the required libraries via terminal:
   ```bash
   pip install PyQt5 keyboard pyautogui pyperclip
   ```

### How to Use

1. Press `Ctrl + Alt + ;` in any application.
2. A search popup will appear near your mouse cursor.
3. Type a keyword (e.g. "cat" or "smile").
4. Use arrow keys or your mouse to select an emoji.
5. Press `Enter` to insert the emoji directly into your text field!

---

## Browser Extension

### Installation (Chrome / Edge / Yandex / Brave)

1. Open the extensions management page:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
2. Enable **"Developer mode"**.
3. Click on **"Load unpacked"**.
4. Select the `emoji-extension` folder.

### Installation (Mozilla Firefox)

*Note: Firefox temporary installs are removed upon restart unless signed.*

1. Navigate to `about:debugging`.
2. Click on **"This Firefox"**.
3. Click **"Load Temporary Add-on..."**.
4. Select the `manifest.json` file inside the `emoji-extension` folder.

### How to Use

1. Click into any text field on a website.
2. Type a colon `:` followed by a keyword (e.g., `:fire`, `:smile`).
3. A horizontal panel will appear below your cursor.
4. Select an emoji with the mouse or arrow keys and press `Enter`.
5. The text will be replaced with the emoji.

---

## File Structure

- `global_app.pyw`: The main PyQt5 script for the global system app.
- `run_bg.vbs`: VBScript to run the system app silently in the background.
- `emoji_search.py`: Core logic for searching the emoji database.
- `emoji-extension/`: Source code for the browser extension (JS/CSS/HTML).
- `emoji_tags_refined.json`: Local database containing all emojis and multilingual tags.