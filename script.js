var converter = new showdown.Converter({ tables: true });
var editor = document.getElementById('editor');
var preview = document.getElementById('preview');

// Function to automatically save the content to localStorage
function autosave() {
    try {
        localStorage.setItem('editorContent', editor.value);
    } catch (error) {
        console.error('Failed to save to local storage:', error);
    }
}
// Add event listener to save content to localStorage on input
editor.addEventListener('input', function () {
    preview.innerHTML = converter.makeHtml(editor.value);
    autosave(); // Call the autosave function on each input event
});

// Function to load content from localStorage
function loadContent() {
    try {
        var savedContent = localStorage.getItem('editorContent');
        if (savedContent) {
            editor.value = savedContent;
            preview.innerHTML = converter.makeHtml(savedContent);
        }
    } catch (error) {
        console.error('Failed to load from local storage:', error);
    }
}

// Call loadContent on page reload
document.addEventListener('DOMContentLoaded', loadContent);

// Function to change font size
function changeFontSize(fontSize) {
    editor.style.fontSize = fontSize;
    preview.style.fontSize = fontSize;
}

editor.addEventListener('input', function () {
    preview.innerHTML = converter.makeHtml(editor.value);
});

Split(['#editor', '#preview'], {
    sizes: [50, 50]
});

// Function to save to disk
function saveToDisk() {
  var text = editor.value;
  var filename = "markdown.md";
  var blob = new Blob([text], {type: "text/markdown;charset=utf-8"});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Function to load from disk
function loadFromDisk() {
  var input = document.getElementById('fileInput');
  input.click();
  input.addEventListener('change', function(e) {
      var file = e.target.files[0];
      if (file) {
          var reader = new FileReader();
          reader.onload = function(e) {
              editor.value = e.target.result;
              // Update the preview pane
              preview.innerHTML = converter.makeHtml(editor.value);
          };
          reader.readAsText(file, "UTF-8");
      }
  }, {once: true});
}
// Wire up the buttons
document.getElementById('saveButton').addEventListener('click', saveToDisk);
document.getElementById('loadButton').addEventListener('click', loadFromDisk);

// Function to lock editor and output scroll
editor.addEventListener('scroll', function () {
    var editorScrollHeight = editor.scrollHeight - editor.clientHeight;
    var previewScrollHeight = preview.scrollHeight - preview.clientHeight;
    var scrollPercentage = editor.scrollTop / editorScrollHeight;
    preview.scrollTop = previewScrollHeight * scrollPercentage;
});
