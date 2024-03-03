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
    if (length <= 10000) return 0; // Base case for documents up to 10,000 characters
    if (length <= 20000) return 1000; // Initial increase for documents up to 20,000 characters
    // More aggressive scaling starts from here
    if (length <= 22000) return 2000; // Quick jump in debounce time
    if (length <= 24000) return 3000; // Further increasing
    if (length <= 26000) return 4000; // Keeping the aggressive scaling
    if (length <= 28000) return 5000; // Nearly doubling the initial time for just 10,000 more characters
    if (length <= 30000) return 6000; // Maximum for this specific range
    // Continue with previously established pattern but starting from a higher base
    if (length <= 35000) return 7000;
    if (length <= 40000) return 8000;
    if (length <= 45000) return 9000;
    if (length <= 50000) return 10000;
    // Corrected to remove the redundant condition and provide a proper fallback
    return 12000; // Max debounce time for very large documents, making it even more aggressive for the largest documents
}


// Modified debounce function
function debounce(func) {
    let timeout;
    return function(data) {
        const debounceTime = getDebounceTime(data.length); // Get dynamic debounce time based on length
        // Function to execute the passed function
        const executeFunction = () => {
            func.apply(this, [data]);
        };
        clearTimeout(timeout); // Cancel previous timeout if new data arrives
        timeout = setTimeout(executeFunction, debounceTime);
    };
}

// ProcessMessage function wrapped with the modified debounce function
const processMessage = debounce((data) => {
    // Combining text chunks and converting to HTML
  let chunks = [];
  data.forEach(chunk => {
      chunks.push(converter.makeHtml(chunk));
  });
  let combinedHtml = chunks.join('');

    self.postMessage(combinedHtml);
});

// Listener for messages from the main thread
self.addEventListener('message', function(event) {
    // Pass the received data to the debounced function
    processMessage(event.data);
});
