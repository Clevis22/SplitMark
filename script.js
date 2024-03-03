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

//Definve converter
converter = new showdown.Converter({
  tables: true,
  strikethrough: true,
  emoji: true,
  extensions: ['showdownChecklist'] // Add our new extension here
});

var editor = document.getElementById('editor');
var preview = document.getElementById('preview');
var previewWorker = new Worker('previewWorker.js');
const debouncedUpdatePreview = debounceTwo(updatePreview, 500);

// Update the updatePreview function to account for the padding
function updatePreview() {
  var contentLength = editor.value.length;
  var debounceTime;
  if(contentLength > 50000) {
    debounceTime = 15000; // 7 seconds for content over 50000 characters
  }
  else if(contentLength > 40000){
      debounceTime = 11000;
  }
  else if(contentLength > 35000){
      debounceTime = 10000;
  }
  else if(contentLength > 30000){
    debounceTime = 9000;
  } 
  else if(contentLength > 25000) {
      debounceTime = 7000; // 5 seconds for content between 20001 and 50000 characters
    } 
  else if(contentLength > 20000) {
    debounceTime = 3000; // 5 seconds for content between 20001 and 50000 characters
  } else {
    debounceTime = 0; // 1 second for content up to 20000 characters
  }
    // Split content for large documents
    const CHUNK_SIZE = 10000; // Size may need adjustment based on performance observations
    const text = editor.value;
    const textChunks = createTextChunks(text, CHUNK_SIZE);
    // Send chunks to worker
    previewWorker.postMessage(textChunks);
    //autosave();
  const paddingHeight = 30;
  let clientHeight = editor.clientHeight; // Read once and store
  let scrollHeight = editor.scrollHeight; // Reduce accessing this property
  let currentScrollPos = editor.scrollTop; // Less frequent property accesses
  let maxScrollPos = scrollHeight - clientHeight - paddingHeight;
  if (currentScrollPos >= maxScrollPos) {
    editor.scrollTop = scrollHeight - clientHeight;
  }
}


function createTextChunks(text, chunkSize) {
  const chunks = [];
  let currentChunkStart = 0;

  while (currentChunkStart < text.length) {
    let currentChunkEnd = Math.min(currentChunkStart + chunkSize, text.length);
    let chunk = text.substring(currentChunkStart, currentChunkEnd);

    // 1. Prioritize checking for complete Markdown elements first:
    const markdownElementsToCheck = [
      ['`', '`'], // Code blocks
      ['**', '**'], // Bold
      ['__', '__'], // More bold
      ['*', '*'], // Italic
      ['_', '_'], // More italic
      ['[', ']'], // Links
      ['(', ')'], // Inline code or images
      ['>', ''], // Blockquotes
    ];

    for (const [startMarker, endMarker] of markdownElementsToCheck) {
      // Find potential start and end positions of the element within the chunk
      const elementStart = chunk.lastIndexOf(startMarker);
      const elementEnd = chunk.indexOf(endMarker, elementStart + startMarker.length);

      if (elementStart !== -1 && elementEnd !== -1 && elementEnd > elementStart) {
        // Element is complete within the chunk, ensure it stays together
        currentChunkEnd = Math.max(currentChunkEnd, elementEnd + endMarker.length);
        chunk = text.substring(currentChunkStart, currentChunkEnd);
      } else if (
        elementStart !== -1 && // Element starts within the chunk
        elementEnd === -1 && // But doesn't end within the chunk
        currentChunkEnd < text.length // There's more text to check
      ) {
        // Look ahead to find the ending marker
        const nextElementEnd = text.indexOf(endMarker, currentChunkEnd);
        if (nextElementEnd !== -1) {
          currentChunkEnd = nextElementEnd + endMarker.length; // Extend chunk to include the entire element
          chunk = text.substring(currentChunkStart, currentChunkEnd);
        }
      }
    }

    // 2. Now check for paragraphs and blockquotes:
    if (chunk.endsWith('\n')) {
      // End chunk at a newline to preserve paragraphs
      chunk = chunk.slice(0, -1);
    } else if (chunk.endsWith('> ')) {
      // End chunk after a blockquote marker to keep it intact
      const nextBlockquoteEnd = text.substring(currentChunkEnd).search(/(?:\n|$)/);
      if (nextBlockquoteEnd !== -1) {
        currentChunkEnd += nextBlockquoteEnd;
        chunk = text.substring(currentChunkStart, currentChunkEnd);
      }
    }

    chunks.push(chunk);
    currentChunkStart = currentChunkEnd;
  }

  return chunks;
}


// Call the updated updatePreview function in the existing input event listener
/*
editor.addEventListener('input', function() {
  updatePreview();
  debouncedAutosave();
});
*/

let queued = false;

editor.addEventListener('input', () => {
  if (!queued) {
    queued = true;
    requestIdleCallback(() => {
      debouncedUpdatePreview();
      debouncedAutosave(); // Debounce to reduce the frequency of execution.
      
      queued = false;
    }, {timeout: 500}); // The timeout option ensures it runs even under heavy load.
  }
}); 


// get the message from the worker
previewWorker.addEventListener('message', function(event) {
  var scrollTop = preview.scrollTop;
  var cleanHTML = DOMPurify.sanitize(event.data); // Sanitize received HTML
  preview.innerHTML = cleanHTML;
  //preview.innerHTML = event.data;
  // Ensure scrolling happens after rendering
  requestAnimationFrame(function() {
    preview.scrollTop = scrollTop;
    /*
    preview.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block);
    });
    // After the highlighting, sync the scroll again
    */
    syncScrollEditor();
  });
});


// Debounce function to limit the frequency of autosave invocations
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function debounceTwo(func, wait) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, arguments);
    }, wait);
  };
}


// Function to automatically save the content to localStorage
function autosave() {
  try {
      localStorage.setItem('editorContent', editor.value);
  } catch (error) {
      console.error('Failed to save to local storage:', error);
  }
}
// Debounce the autosave function with a delay of 1000 milliseconds (1 second)
var debouncedAutosave = debounce(autosave, 3000);

// Function to load content from localStorage or readme.md
function loadContent() {
  try {
      var savedContent = localStorage.getItem('editorContent');
      if (savedContent) {
          editor.value = savedContent;
          preview.innerHTML = converter.makeHtml(savedContent);
      } else {
          // Attempt to load content from readme.md
          fetch('https://raw.githubusercontent.com/Clevis22/SplitMark/main/README.md')
              .then(response => response.text())
              .then(text => {
                  editor.value = text;
                  preview.innerHTML = converter.makeHtml(text);
              })
              .catch(error => {
                  console.error('Failed to load readme.md:', error);
              });
      }
  } catch (error) {
      console.error('Failed to load from local storage:', error);
  }
}

// Call loadContent on page reload
document.addEventListener('DOMContentLoaded', loadContent);


Split(['#editor', '#preview'], {
  sizes: [50, 50],
});

// Function to save to save as markdown
function exportAsMarkdown() {
  var text = editor.value;
  var filename = "document.md";
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
document.getElementById('exportMarkdownButton').addEventListener('click', exportAsMarkdown);


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
// Wire up the button
document.getElementById('loadButton').addEventListener('click', loadFromDisk);

// Function to export as HTML
function exportAsHtml() {
  var htmlContent = preview.innerHTML;
  var filename = "document.html";
  var blob = new Blob([htmlContent], {
      type: "text/html;charset=utf-8"
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

// PDF export function
function exportAsPdf() {
  // Define PDF-specific styles
  const pdfStyles = `
  <style>
    /* Existing PDF-specific styles */
    body {
      color: #000000; /* Darker text color for PDFs */
      font-size: 12pt;
    }
    /* Prevent text cutoff by avoiding page breaks inside these elements */
    h1, h2, h3, h4, h5, h6, p, li, input, figure, table, thead, tr, tbody, pre {
      page-break-inside: avoid;
    }
    /* Ensure next element starts on a new page if close to page end */
    h1, h2, h3 {
      page-break-after: auto;
    }
    /* Other styles as needed for better rendering */
  </style>
`;

  // Get the HTML content with the added styles
  const htmlContent = pdfStyles + preview.innerHTML;

  // Set PDF filename
  const filename = "document.pdf";

  // Call html2pdf function and pass the styled HTML content
  html2pdf().from(htmlContent).set({
      margin: [20, 10, 20, 10], // top, right, bottom, left
      filename: filename,
      html2canvas: {
          scale: 2
      },
      jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait'
      }
  }).save();
}

// Get the dropdown button and the dropdown content elements
var dropbtn = document.querySelector('.dropbtn');
var dropdownContent = document.querySelector('.dropdown-content');

// Add event listener to handle dropdown
dropbtn.addEventListener('click', function(event) {
  // Prevent the event from closing instantly
  event.stopPropagation();

  // Toggle the display of the dropdown content
  dropdownContent.style.display = (dropdownContent.style.display === 'block' ? 'none' : 'block');
});

// Close the dropdown if clicked outside
window.addEventListener('click', function(event) {
  if (!event.target.matches('.dropbtn')) {
      if (dropdownContent.style.display === 'block') {
          dropdownContent.style.display = 'none';
      }
  }
});


// event listner for the dropdown
document.getElementById('exportPDFButton').addEventListener('click', exportAsPdf);
document.getElementById('exportHTMLButton').addEventListener('click', exportAsHtml);

//function to toggle theme
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

  // Target the specific image element for theme-based source switching
  const githubLogoImage = document.querySelector('.githubLogo');

  if (githubLogoImage) {
      githubLogoImage.src = isLightMode ? 'icons/github-mark.png' : 'icons/github-mark-white.png';
  }
}

// Apply the correct mode from localStorage when the document loads
document.addEventListener('DOMContentLoaded', function() {
  const isLightMode = localStorage.getItem('theme') === 'light';
  document.body.classList.toggle('light-mode', isLightMode);
  updateThemeElements(isLightMode);
});

// function to show word count and reading time
function showWordCountAndReadingTime() {
  const text = editor.value;
  const wordCount = text.match(/\b\w+\b/g)?.length || 0;
  const characterCount = text.replace(/^\s+|\s+$/g, '').length;
  const readingTime = Math.ceil(wordCount / 228);
  // Create the word count display div if it doesn't exist
  if (!document.getElementById('wordCountDisplay')) {
      const wordCountDisplay = document.createElement('div');
      wordCountDisplay.id = 'wordCountDisplay';
      document.body.appendChild(wordCountDisplay);
  }
  // Set the content of the word count display
  const wordCountDisplay = document.getElementById('wordCountDisplay');
  wordCountDisplay.innerHTML = `Word Count: ${wordCount}<br>Character Count: ${characterCount}<br>Time to Read: ${readingTime} minute(s)`;
  // Show the word count display
  wordCountDisplay.style.display = 'block';
  // Hide the word count display when other keys are pressed
  function hideWordCountDisplay() {
      wordCountDisplay.style.display = 'none';
  }
  // Add event listener to hide the display on keyup
  window.addEventListener('keyup', hideWordCountDisplay, {
      once: true
  });
}

let isSyncingEditorScroll = false;
let isSyncingPreviewScroll = false;

// Function to sync editor scroll
function syncScrollEditor() {
  if (!isSyncingEditorScroll) {
    isSyncingPreviewScroll = true;
    // Calculate the editor scroll percentage
    const contentHeight = editor.scrollHeight;
    const visibleHeight = editor.clientHeight;

    // Determine if content needs to scroll
    const needsToScroll = contentHeight > visibleHeight;
    // If there isn't enough content to scroll, treat scroll percentage as 100%
    // Otherwise, calculate it traditionally
    const scrollPercentage = needsToScroll 
        ? editor.scrollTop / (contentHeight - visibleHeight) 
        : 1;
    // Apply the scroll percentage to the preview pane
    const previewScrollPosition = scrollPercentage * (preview.scrollHeight - preview.clientHeight);
    preview.scrollTop = previewScrollPosition;
    isSyncingPreviewScroll = false;
  }
}


// Event listeners for syncing scroll
editor.addEventListener('scroll', syncScrollEditor);


console.log(
  `%c ________________________________________
|  Welcome to SplitMark!                 |
|  Check out the project on GitHub       |
|  https://github.com/Clevis22/SplitMark |
|________________________________________|
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
  ^----^----^------^-------^--^--`,
  "font-family: monospace;"
);

