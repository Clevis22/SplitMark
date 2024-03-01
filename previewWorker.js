// Importing the necessary scripts
importScripts('dependencies/showdown.js');

// Extension to handle checklists in Markdown
showdown.extension('showdownChecklist', function() {
  return [{
      type: 'lang',
      filter: function(text) {
          return text
              .replace(/-\s\[\s\]\s(.+)/g, '<li class="checklist-item"><input type="checkbox" disabled> $1</li>')
              .replace(/-\s\[\x\]\s(.+)/ig, '<li class="checklist-item"><input type="checkbox" checked disabled> $1</li>');
      }
  }];
});

// Instantiating the converter with extensions
var converter = new showdown.Converter({
  tables: true,
  strikethrough: true,
  emoji: true,
  extensions: ['showdownChecklist']
});

// Dynamically calculate debounce time based on document length
function getDebounceTime(length) {
    if (length <= 10000) return 2; // Base case for documents up to 10,000 characters
    if (length <= 20000) return 500; // Increase debounce time as document grows
    if (length <= 30000) return 700; // Further increase for longer documents
    if (length <= 40000) return 900;

    if (length <= 50000) return 2000;
  
    if (length <= 50000) return 2000;
    return 5000; // Max debounce time for very large documents
}

// Modified debounce function
function debounce(func) {
    let timeout;
    return function(data) {
        const debounceTime = getDebounceTime(data.length); // Get dynamic debounce time based on length

        const executeFunction = () => {
            clearTimeout(timeout);
            func.apply(this, [data]);
        };

        clearTimeout(timeout);
        timeout = setTimeout(executeFunction, debounceTime);
    };
}

// ProcessMessage function wrapped with the modified debounce function
const processMessage = debounce((data) => {
    var html = converter.makeHtml(data);
    self.postMessage(html);
});

// Listener for messages from the main thread
self.addEventListener('message', function(event) {
    processMessage(event.data);
});
