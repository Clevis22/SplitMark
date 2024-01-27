var converter = new showdown.Converter();
var editor = document.getElementById('editor');
var preview = document.getElementById('preview');

// Function to change font size
function changeFontSize(fontSize) {
    preview.style.fontSize = fontSize;
}

editor.addEventListener('input', function () {
    preview.innerHTML = converter.makeHtml(editor.value);
});

Split(['#editor', '#preview'], {
    sizes: [50, 50]
});

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