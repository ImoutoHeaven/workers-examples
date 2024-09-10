addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Magnet Link Extractor</title>
    <style>
      body { font-family: Arial, sans-serif; display: flex; flex-direction: column; align-items: center; padding: 20px; margin: 0; }
      textarea { width: 100%; max-width: 600px; height: 150px; margin: 10px 0; }
      .output { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 600px; }
      button { margin: 5px; padding: 10px 20px; }
      #errorOutput { color: red; margin-top: 10px; }
      @media (min-width: 600px) {
        .container { display: flex; width: 100%; max-width: 1200px; }
        textarea { height: 200px; }
      }
    </style>
  </head>
  <body>
    <h1>Magnet Link Extractor</h1>
    <div class="container">
      <textarea id="input" placeholder="Paste your magnet links here..."></textarea>
      <div class="output">
        <textarea id="magnetOutput" placeholder="Magnet URIs will appear here..." readonly></textarea>
        <textarea id="fileNameOutput" placeholder="Decoded file names will appear here..." readonly></textarea>
      </div>
    </div>
    <div>
      <button id="convertButton">Start Conversion</button>
      <button id="clearButton">Clear Output</button>
      <button id="copyButton">Copy All</button>
    </div>
    <div id="errorOutput"></div>
    <script>
      document.getElementById('convertButton').addEventListener('click', function() {
        const input = document.getElementById('input').value.trim().split('\\n');
        const magnetOutput = [];
        const fileNameOutput = [];
        const errorOutput = document.getElementById('errorOutput');
        errorOutput.textContent = '';
        
        input.forEach((line, index) => {
          const btihMatch = line.match(/xt=urn:btih:([a-fA-F0-9]+)/);
          if (!btihMatch) {
            errorOutput.textContent += \`Line \${index + 1}: Invalid magnet link (missing btih)\\n\`;
            return;
          }

          let magnetUri = \`magnet:?xt=urn:btih:\${btihMatch[1]}\`;
          
          const btmhMatch = line.match(/xt=urn:btmh:([^&]+)/);
          if (btmhMatch) {
            magnetUri += \`&xt=urn:btmh:\${btmhMatch[1]}\`;
          }
          
          const dnMatch = line.match(/&dn=([^&]+)/);
          if (dnMatch) {
            magnetUri += \`&dn=\${dnMatch[1]}\`;
            try {
              fileNameOutput.push(decodeURIComponent(dnMatch[1]));
            } catch (e) {
              fileNameOutput.push('Error decoding filename');
            }
          } else {
            fileNameOutput.push('N/A');
          }
          
          magnetOutput.push(magnetUri);
        });
        
        document.getElementById('magnetOutput').value = magnetOutput.join('\\n');
        document.getElementById('fileNameOutput').value = fileNameOutput.join('\\n');
      });

      document.getElementById('clearButton').addEventListener('click', function() {
        document.getElementById('input').value = '';
        document.getElementById('magnetOutput').value = '';
        document.getElementById('fileNameOutput').value = '';
        document.getElementById('errorOutput').textContent = '';
      }); 

      document.getElementById('copyButton').addEventListener('click', function() {
        const magnetOutput = document.getElementById('magnetOutput');
        const fileNameOutput = document.getElementById('fileNameOutput');
        const combinedOutput = magnetOutput.value + '\\n' + fileNameOutput.value;
        navigator.clipboard.writeText(combinedOutput).then(function() {
          alert('All output copied to clipboard');
        }, function(err) {
          console.error('Could not copy text: ', err);
        });
      });

      document.getElementById('magnetOutput').addEventListener('click', function() {
        this.select();
      });

      document.getElementById('fileNameOutput').addEventListener('click', function() {
        this.select();
      });
    </script>
  </body>
  </html>`;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' },
  });
}
