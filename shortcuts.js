// Define functions for keyboard shortcuts

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

//Autoclosing []
function insertSquareBrackets() {
    var start = editor.selectionStart;
    var end = editor.selectionEnd;

    editor.value = editor.value.substring(0, start) + '[]' + editor.value.substring(end);
    editor.selectionStart = editor.selectionEnd = start + 1;
}

//Autoclosing ()
function insertParentheses() {
    var start = editor.selectionStart;
    var end = editor.selectionEnd;

    editor.value = editor.value.substring(0, start) + '()' + editor.value.substring(end);
    editor.selectionStart = editor.selectionEnd = start + 1;
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