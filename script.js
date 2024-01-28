var converter = new showdown.Converter({
  tables: true
});
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
editor.addEventListener('input', function() {
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

// Extension to handle checklists in Markdown
showdown.extension('showdownChecklist', function() {
  return [{
      type: 'lang',
      filter: function(text) {
          return text
              // Replace "- [ ]" with an unchecked checkbox
              .replace(/-\s\[\s\]\s(.+)/g, '<li class="checklist-item"><input type="checkbox" disabled> $1</li>')
              // Replace "- [x]" or "- [X]" with a checked checkbox
              .replace(/-\s\[\x\]\s(.+)/ig, '<li class="checklist-item"><input type="checkbox" checked disabled> $1</li>');
      }
  }];
});
// Adding the extension to the converter
var converter = new showdown.Converter({
  tables: true,
  extensions: ['showdownChecklist'] // Add our new extension here
});

// Function to change font size
function changeFontSize(fontSize) {
  editor.style.fontSize = fontSize;
  preview.style.fontSize = fontSize;
}

editor.addEventListener('input', function() {
  preview.innerHTML = converter.makeHtml(editor.value);
});

Split(['#editor', '#preview'], {
  sizes: [50, 50]
});

// Function to save to disk
function saveToDisk() {
  var text = editor.value;
  var filename = "markdown.md";
  var blob = new Blob([text], {
      type: "text/markdown;charset=utf-8"
  });
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
  }, {
      once: true
  });
}
// Wire up the buttons
document.getElementById('saveButton').addEventListener('click', saveToDisk);
document.getElementById('loadButton').addEventListener('click', loadFromDisk);

// Function to lock editor and output scroll
editor.addEventListener('scroll', function() {
  var editorScrollHeight = editor.scrollHeight - editor.clientHeight;
  var previewScrollHeight = preview.scrollHeight - preview.clientHeight;
  var scrollPercentage = editor.scrollTop / editorScrollHeight;
  preview.scrollTop = previewScrollHeight * scrollPercentage;
});


// function to export as a pdf
async function exportAsPdf() {
  const previewElement = document.getElementById('preview');
  const {
      jsPDF
  } = window.jspdf;
  // A4 dimensions: [210mm, 297mm]
  const pdf = new jsPDF({
      unit: 'mm',
      format: 'a4'
  });
  pdf.html(previewElement, {
      callback: function(pdf) {
          pdf.save('document.pdf');
      },
      margin: [0, 0, 0, 0], // Top, left, bottom, right margin
      html2canvas: {
          scale: .5, // Find a suitable scale that fits the A4 size
          backgroundColor: "#1E1E1E" // Preserve the default dark mode background color
      },
      //x: 10,
      //y: 10,
      windowWidth: previewElement.scrollWidth
  });
}

// Add event listener for the PDF export button
document.getElementById('exportPdfButton').addEventListener('click', exportAsPdf);

// Updated function to toggle light/dark mode for the entire page
function toggleLightMode() {
  const bodyClassList = document.body.classList;
  const isLightMode = bodyClassList.toggle('light-mode');

  // Save the current mode to localStorage
  localStorage.setItem('theme', isLightMode ? 'light' : 'dark');

  // Update styling of elements that depend on the theme
  updateThemeElements(isLightMode);
}

function updateThemeElements(isLightMode) {
  const toggleElements = document.querySelectorAll('.toggle-mode, .menu, .editor-preview, .preview, .markdown-body');
  toggleElements.forEach(element => {
    if (isLightMode) {
      element.classList.add('light-mode');
    } else {
      element.classList.remove('light-mode');
    }
  });
}

// Apply the correct mode from localStorage when the document loads
document.addEventListener('DOMContentLoaded', function() {
  const isLightMode = localStorage.getItem('theme') === 'light';
  document.body.classList.toggle('light-mode', isLightMode);
  updateThemeElements(isLightMode);
});

