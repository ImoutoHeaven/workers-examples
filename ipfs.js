addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>IPFS Command Generator</title>
        <style>
            body {
                display: flex;
                flex-direction: column;
                align-items: center;
                font-family: Arial, sans-serif;
                margin: 20px;
            }
            .container {
                display: flex;
                flex-direction: column;
                width: 100%;
                max-width: 800px;
            }
            .output-container {
                display: flex;
                width: 100%;
                max-width: 800px;
                justify-content: space-between;
            }
            textarea {
                width: 100%;
                height: 150px;
                margin: 10px 0;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                cursor: pointer;
            }
            input[type="text"] {
                width: 100%;
                margin: 10px 0;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
            }
            .buttons {
                margin-top: 20px;
            }
            button {
                margin: 0 10px;
                padding: 10px 20px;
                font-size: 16px;
                cursor: pointer;
            }
            .readme {
                margin-top: 40px;
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 5px;
                width: 100%;
                max-width: 800px;
                background-color: #f9f9f9;
            }
            .readme h2 {
                margin-top: 0;
            }
        </style>
    </head>
    <body>
        <h1>IPFS Command Generator</h1>
        <select id="modeSelector" onchange="switchMode()">
            <option value="extractor">IPFS Command added提取器</option>
            <option value="cidv1">IPFS Command cid-v1 提取器</option>
            <option value="pinRetry">IPFS Remote Pin 重试器</option>
            <option value="ipfsAddGenerator">IPFS Add 生成器</option>
            <option value="ipfsAddedUrlGenerator">IPFS Added生成器 (URL模式)</option>
        </select>

        <!-- Extractor Mode -->
        <div id="extractorMode" class="container">
            <input type="text" id="gatewayDomain" placeholder="Crust Network IPFS Gateway Domain" value="gateway.crustgateway.com">
            <input type="text" id="serviceNickname" placeholder="Service Nickname" value="crust">
            <div>
                <label>
                    <input type="checkbox" id="useHttps" checked>
                    Use HTTPS for Gateway URLs
                </label>
            </div>
            <textarea id="inputBox" placeholder="Enter your input here..."></textarea>
            <div class="output-container">
                <textarea id="outputBox1" placeholder="mkdir commands will be shown here..." readonly onclick="this.select()"></textarea>
                <textarea id="outputBox2" placeholder="cp commands will be shown here..." readonly onclick="this.select()"></textarea>
            </div>
            <div class="output-container">
                <textarea id="outputBox3" placeholder="ls command will be shown here..." readonly onclick="this.select()"></textarea>
                <textarea id="outputBox4" placeholder="File CID list will be shown here..." readonly onclick="this.select()"></textarea>
                <textarea id="outputBox5" placeholder="Folder CID list will be shown here..." readonly onclick="this.select()"></textarea>
            </div>
            <textarea id="outputBox6" placeholder="Gateway URLs will be shown here..." readonly onclick="this.select()"></textarea>
            <textarea id="outputBox7" placeholder="Folder Gateway URLs will be shown here..." readonly onclick="this.select()"></textarea>
            <textarea id="outputBox8" placeholder="File CID Base32 conversion commands will be shown here..." readonly onclick="this.select()"></textarea>
            <textarea id="outputBox9" placeholder="Folder CID Base32 conversion commands will be shown here..." readonly onclick="this.select()"></textarea>
            <div class="output-container">
                <textarea id="outputBox10" placeholder="File CID pin commands will be shown here..." readonly onclick="this.select()"></textarea>
                <textarea id="outputBox11" placeholder="Folder CID pin command will be shown here..." readonly onclick="this.select()"></textarea>
            </div>
            <textarea id="outputBox12" placeholder="File CID pin status check commands will be shown here..." readonly onclick="this.select()"></textarea>
            <textarea id="outputBox13" placeholder="Folder CID pin status check commands will be shown here..." readonly onclick="this.select()"></textarea>
            <div class="buttons">
                <button onclick="generateCommands()">Generate</button>
                <button onclick="clearOutput()">Clear</button>
                <button onclick="copyOutput()">Copy All</button>
            </div>
            <div class="readme">
                <h2>README</h2>
                <p><mark>Version: 2024-08-12</mark></p>
                <p>The terminal command should be:</p>
                <pre><code>ipfs add -r -n --cid-version=1 &lt;folder path&gt;</code></pre>
                <p>If you have enough disk space, for better experience, you can actually add the folder to the IPFS network:</p>
                <pre><code>ipfs add -r --cid-version=1 &lt;folder path&gt;</code></pre>
                <p>This tool accepts input in the following format:</p>
                <pre><code>added &lt;cid1&gt; &lt;folder name&gt;/&lt;file name1&gt;
added &lt;cid2&gt; &lt;folder name&gt;/&lt;file name2&gt;
...
added &lt;folder cid&gt; &lt;folder name&gt;</code></pre>
            </div>
        </div>

        <!-- CIDv1 Mode -->
        <div id="cidv1Mode" class="container" style="display:none;">
            <textarea id="inputBoxCidv1" placeholder="Enter your input here..."></textarea>
            <textarea id="outputBoxCidv1" placeholder="Extracted CIDs will be shown here..." readonly onclick="this.select()"></textarea>
            <div class="buttons">
                <button onclick="extractCids()">开始提取</button>
                <button onclick="clearOutputCidv1()">清空</button>
                <button onclick="copyOutputCidv1()">复制全部</button>
            </div>
        </div>

        <!-- Mode 3: IPFS Remote Pin 重试器 -->
        <div id="pinRetryMode" class="container" style="display:none;">
            <input type="text" id="serviceNicknameRetry" placeholder="Service Nickname" value="crust">
            <textarea id="inputBoxAddedRetry" placeholder="Enter your added input here..."></textarea>
            <textarea id="inputBoxCidRetry" placeholder="Enter your CID list here (one per line)..."></textarea>
            <div class="output-container">
                <textarea id="outputBoxFilePinRetry" placeholder="ipfs remote pin add commands for files will be shown here..." readonly onclick="this.select()"></textarea>
                <textarea id="outputBoxFolderPinRetry" placeholder="ipfs remote pin add commands for folders will be shown here..." readonly onclick="this.select()"></textarea>
            </div>
            <div class="output-container">
                <textarea id="outputBoxFileStatusQuery" placeholder="File CID status query commands will be shown here..." readonly onclick="this.select()"></textarea>
                <textarea id="outputBoxFolderStatusQuery" placeholder="Folder CID status query commands will be shown here..." readonly onclick="this.select()"></textarea>
            </div>
            <div class="buttons">
                <button onclick="generatePinRetry()">Generate</button>
                <button onclick="clearOutputPinRetry()">Clear</button>
                <button onclick="copyOutputPinRetry()">Copy All</button>
            </div>
        </div>

        <!-- IPFS Add Generator Mode -->
        <div id="ipfsAddGeneratorMode" class="container" style="display:none;">
            <textarea id="folderInputBox" placeholder="输入ipfs files ls -l '/'获得的值..."></textarea>
            <textarea id="filesInputBox" placeholder="输入ipfs files ls -l '/&lt;folder name&gt;'的返回..."></textarea>
            <textarea id="outputAddCommands" placeholder="Generated IPFS Add Commands will be shown here..." readonly onclick="this.select()"></textarea>
            <div class="buttons">
                <button onclick="generateAddCommands()">Generate</button>
                <button onclick="clearOutputAddCommands()">Clear</button>
                <button onclick="copyOutputAddCommands()">Copy All</button>
            </div>
        </div>

        <!-- Mode 5: IPFS Added Generator (URL Mode) -->
        <div id="ipfsAddedUrlGeneratorMode" class="container" style="display:none;">
            <textarea id="urlInputBox1" placeholder="输入IPFS文件URL列表..."></textarea>
            <textarea id="urlInputBox2" placeholder="输入IPFS文件夹CID URL..."></textarea>
            <input type="text" id="folderNameInput" placeholder="输入文件夹名称...">
            <textarea id="outputUrlAddCommands" placeholder="Generated IPFS Added Commands will be shown here..." readonly onclick="this.select()"></textarea>
            <div class="buttons">
                <button onclick="generateUrlAddCommands()">Generate</button>
                <button onclick="clearOutputUrlAddCommands()">Clear</button>
                <button onclick="copyOutputUrlAddCommands()">Copy All</button>
            </div>
        </div>

        <script>
            function switchMode() {
                var mode = document.getElementById('modeSelector').value;
                document.getElementById('extractorMode').style.display = mode === 'extractor' ? 'block' : 'none';
                document.getElementById('cidv1Mode').style.display = mode === 'cidv1' ? 'block' : 'none';
                document.getElementById('pinRetryMode').style.display = mode === 'pinRetry' ? 'block' : 'none';
                document.getElementById('ipfsAddGeneratorMode').style.display = mode === 'ipfsAddGenerator' ? 'block' : 'none';
                document.getElementById('ipfsAddedUrlGeneratorMode').style.display = mode === 'ipfsAddedUrlGenerator' ? 'block' : 'none';
            }

            function cleanInput(inputText) {
                return inputText.replace(/\\u001b\\[[0-9;]*[a-zA-Z]/g, '').split('\\n').map(function(line) {
                    var addedIndex = line.indexOf('added');
                    return addedIndex !== -1 ? line.substring(addedIndex) : '';
                }).filter(function(line) { return line.trim() !== ''; }).join('\\n');
            }

            function generateCommands() {
                var inputText = document.getElementById('inputBox').value.trim();
                var gatewayDomain = document.getElementById('gatewayDomain').value.trim();
                var serviceNickname = document.getElementById('serviceNickname').value.trim();
                var useHttps = document.getElementById('useHttps').checked ? 'https' : 'http'; // Determine whether to use HTTP or HTTPS
                var cleanedInput = cleanInput(inputText);
                var lines = cleanedInput.split('\\n');

                var outputBox1 = document.getElementById('outputBox1');
                var outputBox2 = document.getElementById('outputBox2');
                var outputBox3 = document.getElementById('outputBox3');
                var outputBox4 = document.getElementById('outputBox4');
                var outputBox5 = document.getElementById('outputBox5');
                var outputBox6 = document.getElementById('outputBox6');
                var outputBox7 = document.getElementById('outputBox7');
                var outputBox8 = document.getElementById('outputBox8');
                var outputBox9 = document.getElementById('outputBox9');
                var outputBox10 = document.getElementById('outputBox10');
                var outputBox11 = document.getElementById('outputBox11');
                var outputBox12 = document.getElementById('outputBox12');
                var outputBox13 = document.getElementById('outputBox13');

                var folderName = '';
                var mkdirCommands = [];
                var cpCommands = [];
                var lsCommand = '';
                var fileCIDs = [];
                var folderCIDs = [];
                var gatewayURLs = [];
                var folderGatewayURLs = [];
                var fileBase32Commands = [];
                var folderBase32Commands = [];
                var filePinCommands = [];
                var folderPinCommand = '';
                var filePinStatusCommands = [];
                var folderPinStatusCommands = [];

                lines.forEach(function(line) {
                    var match = line.match(/^added\\s+([^\\s]+)\\s+([^\\/]+)\\/(.+)$/);
                    if (match) {
                        var cid = match[1];
                        folderName = match[2];
                        var fileName = match[3];

                        if (mkdirCommands.indexOf(\`ipfs files mkdir "/\${folderName}"\`) === -1) {
                            mkdirCommands.push(\`ipfs files mkdir "/\${folderName}"\`);
                            lsCommand = \`ipfs files ls -l "/\${folderName}"\`;
                        }

                        cpCommands.push(\`ipfs files cp "/ipfs/\${cid}" "/\${folderName}/\${fileName}"\`);
                        fileCIDs.push(cid);

                        var encodedFileName = encodeURIComponent(fileName);
                        gatewayURLs.push(\`\${useHttps}://\${gatewayDomain}/ipfs/\${cid}?filename=\${encodedFileName}\`); // Use specified HTTP or HTTPS
                        filePinCommands.push(\`ipfs pin remote add --service=\${serviceNickname} --background \${cid} --name "\${fileName}"\`);
                        filePinStatusCommands.push(\`ipfs pin remote ls --service=\${serviceNickname} --cid=\${cid} --status=pinned,pinning,failed,queued\`);

                        if (cid.startsWith('Qm')) {
                            fileBase32Commands.push(\`ipfs cid base32 \${cid}\`);
                        }
                    } else {
                        var folderMatch = line.match(/^added\\s+([^\\s]+)\\s+([^\\/]+)$/);
                        if (folderMatch) {
                            var folderCid = folderMatch[1];
                            folderCIDs.push(folderCid);
                            folderGatewayURLs.push(\`\${useHttps}://\${gatewayDomain}/ipfs/\${folderCid}\`); // Use specified HTTP or HTTPS
                            folderPinCommand = \`ipfs pin remote add --service=\${serviceNickname} --background \${folderCid} --name "\${folderName}"\`;
                            folderPinStatusCommands.push(\`ipfs pin remote ls --service=\${serviceNickname} --cid=\${folderCid} --status=pinned,pinning,failed,queued\`);

                            if (folderCid.startsWith('Qm')) {
                                folderBase32Commands.push(\`ipfs cid base32 \${folderCid}\`);
                            }
                        }
                    }
                });

                outputBox1.value = mkdirCommands.join('\\n');
                outputBox2.value = cpCommands.join('\\n');
                outputBox3.value = lsCommand;
                outputBox4.value = fileCIDs.join('\\n');
                outputBox5.value = folderCIDs.join('\\n');
                outputBox6.value = gatewayURLs.join('\\n');
                outputBox7.value = folderGatewayURLs.join('\\n');
                
                if (fileBase32Commands.length > 0) {
                    outputBox8.value = fileBase32Commands.join('\\n');
                } else {
                    outputBox8.value = '';
                }

                if (folderBase32Commands.length > 0) {
                    outputBox9.value = folderBase32Commands.join('\\n');
                } else {
                    outputBox9.value = '';
                }

                outputBox10.value = filePinCommands.join('\\n');
                outputBox11.value = folderPinCommand;
                outputBox12.value = filePinStatusCommands.join('\\n');
                outputBox13.value = folderPinStatusCommands.join('\\n');
            }

            function clearOutput() {
                document.getElementById('outputBox1').value = '';
                document.getElementById('outputBox2').value = '';
                document.getElementById('outputBox3').value = '';
                document.getElementById('outputBox4').value = '';
                document.getElementById('outputBox5').value = '';
                document.getElementById('outputBox6').value = '';
                document.getElementById('outputBox7').value = '';
                document.getElementById('outputBox8').value = '';
                document.getElementById('outputBox9').value = '';
                document.getElementById('outputBox10').value = '';
                document.getElementById('outputBox11').value = '';
                document.getElementById('outputBox12').value = '';
                document.getElementById('outputBox13').value = '';
            }

            function copyOutput() {
                var outputBoxes = [
                    document.getElementById('outputBox1'),
                    document.getElementById('outputBox2'),
                    document.getElementById('outputBox3'),
                    document.getElementById('outputBox4'),
                    document.getElementById('outputBox5'),
                    document.getElementById('outputBox6'),
                    document.getElementById('outputBox7'),
                    document.getElementById('outputBox8'),
                    document.getElementById('outputBox9'),
                    document.getElementById('outputBox10'),
                    document.getElementById('outputBox11'),
                    document.getElementById('outputBox12'),
                    document.getElementById('outputBox13')
                ];
                var allOutput = '';
                outputBoxes.forEach(function(box) {
                    if (box.value) {
                        allOutput += box.value + '\\n';
                    }
                });
                navigator.clipboard.writeText(allOutput.trim());
            }

            function extractCids() {
                var inputText = document.getElementById('inputBoxCidv1').value.trim();
                var lines = inputText.split('\\n');
                var extractedCids = [];

                lines.forEach(function(line) {
                    var cidMatch = line.match(/bafy[a-z0-9]+|bafk[a-z0-9]+/);
                    if (cidMatch) {
                        extractedCids.push(cidMatch[0]);
                    }
                });

                document.getElementById('outputBoxCidv1').value = extractedCids.join('\\n');
            }

            function clearOutputCidv1() {
                document.getElementById('outputBoxCidv1').value = '';
            }

            function copyOutputCidv1() {
                var outputBoxCidv1 = document.getElementById('outputBoxCidv1');
                outputBoxCidv1.select();
                document.execCommand('copy');
            }

            function generatePinRetry() {
                var inputAddedText = document.getElementById('inputBoxAddedRetry').value.trim();
                var inputCidText = document.getElementById('inputBoxCidRetry').value.trim();
                var serviceNickname = document.getElementById('serviceNicknameRetry').value.trim();
                var addedLines = inputAddedText.split('\\n');
                var cidLines = inputCidText.split('\\n');

                var addedCids = new Set();
                var cidSet = new Set();
                var fileCidNameMap = {};
                var folderCidNameMap = {};

                addedLines.forEach(function(line) {
                    var match = line.match(/^added\\s+([^\\s]+)\\s+(.+)$/);
                    if (match) {
                        var cid = match[1];
                        var name = match[2];
                        addedCids.add(cid);
                        if (name.includes('/')) {
                            var parts = name.split('/');
                            var folderName = parts[0];
                            var fileName = parts.slice(1).join('/');
                            fileCidNameMap[cid] = fileName;
                        } else {
                            folderCidNameMap[cid] = name;
                        }
                    }
                });

                cidLines.forEach(function(line) {
                    var trimmedCid = line.trim();
                    if (trimmedCid) {
                        cidSet.add(trimmedCid);
                    }
                });

                var filePinCommands = [];
                var folderPinCommands = [];
                var fileStatusQueries = [];
                var folderStatusQueries = [];

                addedCids.forEach(function(cid) {
                    if (cidSet.has(cid)) {
                        if (fileCidNameMap[cid]) {
                            filePinCommands.push(\`ipfs pin remote add --service=\${serviceNickname} --background \${cid} --name "\${fileCidNameMap[cid]}"\`);
                            fileStatusQueries.push(\`ipfs pin remote ls --service=\${serviceNickname} --cid=\${cid} --status=pinned,pinning,failed,queued\`);
                        } else if (folderCidNameMap[cid]) {
                            folderPinCommands.push(\`ipfs pin remote add --service=\${serviceNickname} --background \${cid} --name "\${folderCidNameMap[cid]}"\`);
                            folderStatusQueries.push(\`ipfs pin remote ls --service=\${serviceNickname} --cid=\${cid} --status=pinned,pinning,failed,queued\`);
                        }
                    }
                });

                document.getElementById('outputBoxFilePinRetry').value = filePinCommands.join('\\n');
                document.getElementById('outputBoxFolderPinRetry').value = folderPinCommands.join('\\n');
                document.getElementById('outputBoxFileStatusQuery').value = fileStatusQueries.join('\\n');
                document.getElementById('outputBoxFolderStatusQuery').value = folderStatusQueries.join('\\n');
            }

            function clearOutputPinRetry() {
                document.getElementById('outputBoxFilePinRetry').value = '';
                document.getElementById('outputBoxFolderPinRetry').value = '';
                document.getElementById('outputBoxFileStatusQuery').value = '';
                document.getElementById('outputBoxFolderStatusQuery').value = '';
            } 

            function copyOutputPinRetry() {
                var outputBoxes = [
                    document.getElementById('outputBoxFilePinRetry'),
                    document.getElementById('outputBoxFolderPinRetry'),
                    document.getElementById('outputBoxFileStatusQuery'),
                    document.getElementById('outputBoxFolderStatusQuery')
                ];
                var allOutput = '';
                outputBoxes.forEach(function(box) {
                    if (box.value) { 
                        allOutput += box.value + '\\n';
                    }
                });
                navigator.clipboard.writeText(allOutput.trim());
            }

            function generateAddCommands() {
                var folderInput = document.getElementById('folderInputBox').value.trim();
                var filesInput = document.getElementById('filesInputBox').value.trim();
                
                var folderLines = folderInput.split('\\n').filter(function(line) { return line.trim() !== ''; });
                var fileLines = filesInput.split('\\n').filter(function(line) { return line.trim() !== ''; });

                if (folderLines.length === 0 || fileLines.length === 0) {
                    alert('Please provide both folder and file inputs.');
                    return;
                }

                var folderParts = folderLines[0].split(/[\\t ]+/);
                var folderName = folderParts.slice(0, -2).join(' ').trim();
                var folderCid = folderParts[folderParts.length - 2].trim();

                // Remove trailing slash from folder name if it exists
                if (folderName.endsWith('/')) {
                    folderName = folderName.slice(0, -1);
                }

                var output = '';

                fileLines.forEach(function(line) {
                    var fileParts = line.split(/[\\t ]+/);
                    var fileName = fileParts.slice(0, -2).join(' ').trim();
                    var fileCid = fileParts[fileParts.length - 2].trim();
                    output += \`added \${fileCid} \${folderName}/\${fileName}\\n\`;
                });

                output += \`added \${folderCid} \${folderName}\`;

                document.getElementById('outputAddCommands').value = output;
            }

            function clearOutputAddCommands() {
                document.getElementById('folderInputBox').value = '';
                document.getElementById('filesInputBox').value = '';
                document.getElementById('outputAddCommands').value = '';
            }

            function copyOutputAddCommands() {
                var outputAddCommands = document.getElementById('outputAddCommands');
                outputAddCommands.select();
                document.execCommand('copy');
            }

            function generateUrlAddCommands() {
                var fileUrlsInput = document.getElementById('urlInputBox1').value.trim();
                var folderUrlInput = document.getElementById('urlInputBox2').value.trim();
                var folderName = document.getElementById('folderNameInput').value.trim();

                if (!fileUrlsInput || !folderUrlInput || !folderName) {
                    alert('Please fill in all input fields.');
                    return;
                }

                var fileUrls = fileUrlsInput.split('\\n').map(function(url) { return url.trim(); }).filter(function(url) { return url; });
                var folderUrlMatch = folderUrlInput.match(/\\/ipfs\\/([^/?#]+)/);
                var folderCid = folderUrlMatch ? folderUrlMatch[1] : '';

                if (!folderCid) {
                    alert('Invalid folder CID URL.');
                    return;
                }

                var output = '';

                fileUrls.forEach(function(url) {
                    var fileMatch = url.match(/\\/ipfs\\/([^/?#]+)\\?filename=([^&#]+)/); 
                    if (fileMatch) {
                        var fileCid = fileMatch[1];
                        var fileName = decodeURIComponent(fileMatch[2]);
                        output += \`added \${fileCid} \${folderName}/\${fileName}\\n\`;
                    }
                });

                output += \`added \${folderCid} \${folderName}\`;
                document.getElementById('outputUrlAddCommands').value = output;
            }

            function clearOutputUrlAddCommands() {
                document.getElementById('urlInputBox1').value = '';
                document.getElementById('urlInputBox2').value = '';
                document.getElementById('folderNameInput').value = '';
                document.getElementById('outputUrlAddCommands').value = '';
            }

            function copyOutputUrlAddCommands() {
                var outputUrlAddCommands = document.getElementById('outputUrlAddCommands');
                outputUrlAddCommands.select();
                document.execCommand('copy');
            }
        </script>  
    </body>
    </html>
    `;

    return new Response(html, {
        headers: {
            'content-type': 'text/html;charset=UTF-8',
        },
    });
}
