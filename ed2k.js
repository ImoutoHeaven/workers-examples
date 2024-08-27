addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ED2K URL Encoder</title>
      <style>
          body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              font-family: Arial, sans-serif;
          }
          .container {
              display: flex;
              width: 80%;
          }
          .input-area, .output-area {
              flex: 1;
              margin: 10px;
              display: flex;
              flex-direction: column;
          }
          textarea {
              width: 100%;
              height: 300px;
              padding: 10px;
              font-family: monospace;
              font-size: 14px;
          }
          .button-container {
              margin-top: 20px;
          }
          button {
              margin: 0 10px;
              padding: 10px 20px;
              font-size: 16px;
          }
          textarea:focus {
              outline: 2px solid #007BFF;
          }
      </style>
  </head>
  <body>
  
  <div class="container">
      <div class="input-area">
          <h3>Input</h3>
          <textarea id="input-text" placeholder="Enter ED2K links here..."></textarea>
      </div>
      <div class="output-area">
          <h3>Output 1</h3>
          <textarea id="output-text-1" readonly onclick="this.select()"></textarea>
          <h3>Output 2</h3>
          <textarea id="output-text-2" readonly onclick="this.select()"></textarea>
      </div>
  </div>
  
  <div class="button-container">
      <button onclick="convert()">Start Conversion</button>
      <button onclick="clearOutputs()">Clear Outputs</button>
      <button onclick="copyOutput()">Copy Output 1</button>
  </div>
  
  <script>
      function urlEncodeFilename(filename) {
          return encodeURIComponent(filename);
      }
  
      function convert() {
          const inputText = document.getElementById('input-text').value;
          const lines = inputText.split('\\n');
          let output1 = '';
          let output2 = '';
  
          lines.forEach(line => {
              const parts = line.split('|');
              if (parts.length >= 5) {
                  const originalFilename = parts[2];
                  const fileSize = parts[3];
                  const ed2kHash = parts[4];
                  const encodedFilename = urlEncodeFilename(originalFilename);
                  
                  output1 += \`ed2k://|file|\${encodedFilename}|\${fileSize}|\${ed2kHash}|/\n\`;
                  output2 += \`\${originalFilename}\n\`;
              }
          });
  
          document.getElementById('output-text-1').value = output1.trim();
          document.getElementById('output-text-2').value = output2.trim();
      }
  
      function clearOutputs() {
          document.getElementById('output-text-1').value = '';
          document.getElementById('output-text-2').value = '';
      }
  
      function copyOutput() {
          const outputText1 = document.getElementById('output-text-1');
          outputText1.select();
          document.execCommand('copy');
          alert('Output 1 copied to clipboard');
      }
  </script>
  
  </body>
  </html>
  `

  return new Response(html, {
    headers: { 'content-type': 'text/html;charset=UTF-8' },
  })
}
