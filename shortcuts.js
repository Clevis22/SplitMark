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

// Function to add <br>
function newLine(){
  let editor = document.getElementById('editor');
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  editor.value = editor.value.substring(0, start) + '<br>' + editor.value.substring(end);
  // Move the cursor after the <br> tag
  editor.selectionStart = editor.selectionEnd = start + 4;
  // Update preview and autosave after inserting <br>
  updatePreview();
  autosave();
}

// Main event listener for keyboard shortcuts
document.addEventListener('keydown', function(event) {
    var editor = document.getElementById('editor');
    // Handling tab key for inserting tabs in the editor
    if (event.key === 'Tab') {
        event.preventDefault(); // Prevent the tab key's default behavior
        var start = editor.selectionStart;
        var end = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + '\t' + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 1; // Move cursor
    }
    // Handling shortcuts with Ctrl or Cmd key
    if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
            case 'b':
                event.preventDefault(); // Prevent default event (usually open bookmarks in browser)
                toggleBold(); // Call function to toggle bold
                break;
            case 'i':
                event.preventDefault(); // Prevent default event (usually open browser settings)
                toggleItalics(); // Call function to toggle italics
                break;
            case 's':
                event.preventDefault(); // Prevent default event (usually save the webpage)
                toggleStrikethrough(); // Call function to toggle strikethrough
                break;
            case 'e':
                event.preventDefault(); // Prevent default event
                toggleEmoji(); // Call function to toggle emoji
                break;
            case '=': // Handling Ctrl + '=' for increasing font size
                event.preventDefault();
                changeFontSize(2); // Increase font size
                break;
            case '-': // Handling Ctrl + '-' for decreasing font size
                event.preventDefault();
                changeFontSize(-2); // Decrease font size
                break;
            case 'enter': // Ctrl+Enter for toggling view mode
                event.preventDefault();
                toggleViewMode();
                break;
            case 'l': // Ctrl+L for a new line (custom feature not typically found in editors)
                event.preventDefault();
                newLine();
                break;
        }
    } else {
        // Handling non-Ctrl shortcuts such as '[' or '(', for surrounding text or cursor with brackets or parentheses
        switch (event.key) {
            case '[':
                event.preventDefault(); // Prevent default event
                insertSquareBrackets(); // Call function to insert square brackets
                break;
            case '(':
                event.preventDefault(); // Prevent default event
                insertParentheses(); // Call function to insert parentheses
                break;
        }
    }
    // Update preview and autosave after applying shortcut actions
    updatePreview();
    autosave();
    // Handling of quick word count and reading time display with Ctrl+Shift+C
    if (event.ctrlKey && event.shiftKey && event.code === 'KeyC') {
        showWordCountAndReadingTime();
        event.preventDefault(); // To prevent default action of Ctrl+Shift+C if any
    }
});