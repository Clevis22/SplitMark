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

// Main event listener for keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
            case 'b':
                event.preventDefault();
                toggleBold();
                break;
            case 'i':
                event.preventDefault();
                toggleItalics();
                break;
                // You can add more cases for additional shortcuts
        }

        // Update preview and autosave after applying the formatting
        preview.innerHTML = converter.makeHtml(editor.value);
        autosave();
    }
});