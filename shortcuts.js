// funcion for capturing tab key
document.getElementById('editor').addEventListener('keydown', function(event) {
  if (event.key === 'Tab') {
    // Prevent the default tab behavior (i.e., moving focus to the next focusable element)
    event.preventDefault();

    // Insert a tab at the current cursor location
    const start = this.selectionStart;
    const end = this.selectionEnd;
    this.value = this.value.substring(0, start) + '\t' + this.value.substring(end);

    // Move the cursor to the right after the inserted tab character
    this.selectionStart = this.selectionEnd = start + 1;
  }
});


// function for bold shorcut
function toggleBold() {
    var start = editor.selectionStart;
    var end = editor.selectionEnd;
    var selectedText = editor.value.substring(start, end);

    if (start === end) {
        editor.value = editor.value.substring(0, start) + '****' + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 2;
    } else {
        editor.value = editor.value.substring(0, start) + '**' + selectedText + '**' + editor.value.substring(end);
        editor.selectionStart = start + 2;
        editor.selectionEnd = end + 2;
    }
}

// function for italics shortcut
function toggleItalics() {
    var start = editor.selectionStart;
    var end = editor.selectionEnd;
    var selectedText = editor.value.substring(start, end);

    if (start === end) {
        editor.value = editor.value.substring(0, start) + '**' + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 1;
    } else {
        editor.value = editor.value.substring(0, start) + '*' + selectedText + '*' + editor.value.substring(end);
        editor.selectionStart = start + 1;
        editor.selectionEnd = end + 1;
    }
}

// function for strikethough shortcut
function toggleStrikethrough() {
    var start = editor.selectionStart;
    var end = editor.selectionEnd;
    var selectedText = editor.value.substring(start, end);
    if (start === end) {
        // No selection, place strikethrough syntax at cursor
        editor.value = editor.value.substring(0, start) + '~~~~' + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 2;
    } else {
        // Wrap selected text with strikethrough syntax
        editor.value = editor.value.substring(0, start) + '~~' + selectedText + '~~' + editor.value.substring(end);
        editor.selectionStart = start + 2;
        editor.selectionEnd = end + 2;
    }
}

// function for emoji shortcut
function toggleEmoji() {
    var start = editor.selectionStart;
    var end = editor.selectionEnd;
    var selectedText = editor.value.substring(start, end);

    if (start === end) {
        editor.value = editor.value.substring(0, start) + '::' + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 1;
    } else {
        editor.value = editor.value.substring(0, start) + ':' + selectedText + ':' + editor.value.substring(end);
        editor.selectionStart = start + 1;
        editor.selectionEnd = end + 1;
    }
}

// function for auto-closing []
function insertSquareBrackets() {
    var start = editor.selectionStart;
    var end = editor.selectionEnd;
    var selectedText = editor.value.substring(start, end);
    // Check if there's a selection
    if (start !== end) {
        // Wrap the selection
        editor.value = editor.value.substring(0, start) + '[' + selectedText + ']' + editor.value.substring(end);
        editor.selectionStart = start + 1;
        editor.selectionEnd = end + 1;
    } else {
        // If there's no selection, insert brackets at the cursor
        editor.value = editor.value.substring(0, start) + '[]' + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 1;
    }
}

//function for auto-closing ()
function insertParentheses() {
    var start = editor.selectionStart;
    var end = editor.selectionEnd;
    var selectedText = editor.value.substring(start, end);
    // Check if there's a selection
    if (start !== end) {
        // Wrap the selection
        editor.value = editor.value.substring(0, start) + '(' + selectedText + ')' + editor.value.substring(end);
        editor.selectionStart = start + 1;
        editor.selectionEnd = end + 1;
    } else {
        // If there's no selection, insert parentheses at the cursor
        editor.value = editor.value.substring(0, start) + '()' + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 1;
    }
}

// Font size manipulation using Ctrl + '+' and Ctrl + '-'
function changeFontSize(sizeChange) {
    var currentFontSize = parseInt(window.getComputedStyle(editor).fontSize);
    var newFontSize = currentFontSize + sizeChange;
    editor.style.fontSize = `${newFontSize}px`;
    preview.style.fontSize = `${newFontSize}px`;
}


// Main event listener for keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if ((event.ctrlKey || event.metaKey) && !event.altKey) {
        switch (event.key.toLowerCase()) {
            case 'b':
                event.preventDefault();
                toggleBold();
                break;
            case 'i':
                event.preventDefault();
                toggleItalics();
                break;
            case 's':
                event.preventDefault();
                toggleStrikethrough();
                break;
            case 'e':
                event.preventDefault();
                toggleEmoji();
                break;
            case '=': // Ctrl + '=' is the actual result when pressing Ctrl + '+'
            if (event.key === '=' || event.key === '+') {
                event.preventDefault();
                changeFontSize(2);
            }
                break;
           case '-':
                event.preventDefault();
                changeFontSize(-2);
                break;
            }
        }
    else if (!event.ctrlKey && !event.metaKey && !event.altKey) {
        switch (event.key) {
            case '[':
                event.preventDefault();
                insertSquareBrackets();
                break;
            case '(':
                event.preventDefault();
                insertParentheses();
                break;
        }
    }
    // Update preview and autosave after applying the formatting
    preview.innerHTML = converter.makeHtml(editor.value);
    autosave();
});