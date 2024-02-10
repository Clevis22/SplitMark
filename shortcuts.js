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

// State variable to track the toggle state
var viewModeToggleState = 0;
// Function to toggle gutter visibility
function toggleGutterVisibility(show) {
    const gutters = document.getElementsByClassName("gutter");
    for (let gutter of gutters) {
        gutter.style.display = show ? 'block' : 'none';
    }
}
// function to toggle view mode
function toggleViewMode() {
    const editorElement = document.getElementById('editor');
    const previewElement = document.getElementById('preview');
    const editorPreviewContainer = document.querySelector('.editor-preview');
    // Cycle through the viewModeToggleState
    viewModeToggleState = (viewModeToggleState + 1) % 3;
    switch (viewModeToggleState) {
        case 0: // Split view
            editorElement.style.display = 'block';
            previewElement.style.display = 'block';
            toggleGutterVisibility(true); // Show gutter
            editorElement.style.width = '50%';
            previewElement.style.width = '50%';
            break;
        case 1: // Full screen editor
            editorElement.style.display = 'block';
            previewElement.style.display = 'none';
            toggleGutterVisibility(false); // Hide gutter
            editorElement.style.width = '100%';
            break;
        case 2: // Full screen preview
            editorElement.style.display = 'none';
            previewElement.style.display = 'block';
            toggleGutterVisibility(false); // Hide gutter
            previewElement.style.width = '100%';
            break;
    }

    updatePreview();
    window.dispatchEvent(new Event('resize'));
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
            case 'f':
                event.preventDefault();
                toggleViewMode();
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
    } else if (!event.ctrlKey && !event.metaKey && !event.altKey) {
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
    updatePreview();
    autosave();
});

window.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.shiftKey && event.code === 'KeyC') {
        showWordCountAndReadingTime();
        event.preventDefault(); // Prevents any default action associated with the Control+Shift+C shortcut
    }
});