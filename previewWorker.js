importScripts('dependencies/showdown.js');

self.addEventListener('message', function(event) {
  // Instantiate a converter
  var converter = new showdown.Converter({
    tables: true,
    strikethrough: true,
    emoji: true
  });

  // Convert Markdown to HTML
  var html = converter.makeHtml(event.data);

  // Post the resulting HTML back to the main thread
  self.postMessage(html);
});
