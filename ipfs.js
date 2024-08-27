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
        </select>

        <!-- Extractor Mode -->
        <div id="extractorMode" class="container">
            <input type="text" id="gatewayDomain" placeholder="Crust Network IPFS Gateway Domain" value="gateway.crustgateway.online">
            <input type="text" id="serviceNickname" placeholder="Service Nickname" value="crust">
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

        <!-- Mode3: IPFS Remote Pin 重试器 -->
        <div id="pinRetryMode" class="container" style="display:none;">
            <input type="text" id="serviceNicknameRetry" placeholder="Service Nickname" value="crust">
            <textarea id="inputBoxAddedRetry" placeholder="Enter your added input here..."></textarea>
            <textarea id="inputBoxCidRetry" placeholder="Enter your CID list here (one per line)..."></textarea>
            <div class="output-container">
                <textarea id="outputBoxFilePinRetry" placeholder="ipfs remote pin add commands for files will be shown here..." readonly onclick="this.select()"></textarea>
                <textarea id="outputBoxFolderPinRetry" placeholder="ipfs remote pin add commands for folders will be shown here..." readonly onclick="this.select()"></textarea>
            </div>
            <div class="output-container">
                <!-- 新增的输出框 -->
                <textarea id="outputBoxFileStatusQuery" placeholder="File CID status query commands will be shown here..." readonly onclick="this.select()"></textarea>
                <textarea id="outputBoxFolderStatusQuery" placeholder="Folder CID status query commands will be shown here..." readonly onclick="this.select()"></textarea>
            </div>
            <div class="buttons">
                <button onclick="generatePinRetry()">Generate</button>
                <button onclick="clearOutputPinRetry()">Clear</button>
                <button onclick="copyOutputPinRetry()">Copy All</button>
            </div>
        </div>

        <script>
            function switchMode() {
                const mode = document.getElementById('modeSelector').value;
                document.getElementById('extractorMode').style.display = mode === 'extractor' ? 'block' : 'none';
                document.getElementById('cidv1Mode').style.display = mode === 'cidv1' ? 'block' : 'none';
                document.getElementById('pinRetryMode').style.display = mode === 'pinRetry' ? 'block' : 'none';
            }

            function cleanInput(inputText) {
                return inputText.replace(/\\u001b\\[[0-9;]*[a-zA-Z]/g, '').split('\\n').map(line => {
                    const addedIndex = line.indexOf('added');
                    return addedIndex !== -1 ? line.substring(addedIndex) : '';
                }).filter(line => line.trim() !== '').join('\\n');
            }

            function generateCommands() {
                const inputText = document.getElementById('inputBox').value.trim();
                const gatewayDomain = document.getElementById('gatewayDomain').value.trim();
                const serviceNickname = document.getElementById('serviceNickname').value.trim();
                const cleanedInput = cleanInput(inputText);
                const lines = cleanedInput.split('\\n');

                const outputBox1 = document.getElementById('outputBox1');
                const outputBox2 = document.getElementById('outputBox2');
                const outputBox3 = document.getElementById('outputBox3');
                const outputBox4 = document.getElementById('outputBox4');
                const outputBox5 = document.getElementById('outputBox5');
                const outputBox6 = document.getElementById('outputBox6');
                const outputBox7 = document.getElementById('outputBox7');
                const outputBox8 = document.getElementById('outputBox8');
                const outputBox9 = document.getElementById('outputBox9');
                const outputBox10 = document.getElementById('outputBox10');
                const outputBox11 = document.getElementById('outputBox11');
                const outputBox12 = document.getElementById('outputBox12');
                const outputBox13 = document.getElementById('outputBox13');

                let folderName = '';
                let mkdirCommands = [];
                let cpCommands = [];
                let lsCommand = '';
                let fileCIDs = [];
                let folderCIDs = [];
                let gatewayURLs = [];
                let folderGatewayURLs = [];
                let fileBase32Commands = [];
                let folderBase32Commands = [];
                let filePinCommands = [];
                let folderPinCommand = '';
                let filePinStatusCommands = [];
                let folderPinStatusCommands = [];

                lines.forEach((line) => {
                    const match = line.match(/^added\\s+([^\\s]+)\\s+([^\\/]+)\\/(.+)$/);
                    if (match) {
                        const cid = match[1];
                        folderName = match[2];
                        const fileName = match[3];

                        if (!mkdirCommands.includes(\`ipfs files mkdir "/\${folderName}"\`)) {
                            mkdirCommands.push(\`ipfs files mkdir "/\${folderName}"\`);
                            lsCommand = \`ipfs files ls -l "/\${folderName}"\`;
                        }

                        cpCommands.push(\`ipfs files cp "/ipfs/\${cid}" "/\${folderName}/\${fileName}"\`);
                        fileCIDs.push(cid);

                        const encodedFileName = encodeURIComponent(fileName);
                        gatewayURLs.push(\`https://\${gatewayDomain}/ipfs/\${cid}?filename=\${encodedFileName}\`);
                        filePinCommands.push(\`ipfs pin remote add --service=\${serviceNickname} --background \${cid} --name "\${fileName}"\`);
                        filePinStatusCommands.push(\`ipfs pin remote ls --service=\${serviceNickname} --cid=\${cid} --status=pinned,pinning,failed,queued\`);

                        if (cid.startsWith('Qm')) {
                            fileBase32Commands.push(\`ipfs cid base32 \${cid}\`);
                        }
                    } else {
                        const folderMatch = line.match(/^added\\s+([^\\s]+)\\s+([^\\/]+)$/);
                        if (folderMatch) {
                            const folderCid = folderMatch[1];
                            folderCIDs.push(folderCid);
                            folderGatewayURLs.push(\`https://\${gatewayDomain}/ipfs/\${folderCid}\`);
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
                const outputBoxes = [
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
                let allOutput = '';
                outputBoxes.forEach(box => {
                    if (box.value) {
                        allOutput += box.value + '\\n';
                    }
                });
                navigator.clipboard.writeText(allOutput.trim());
            }

            function extractCids() {
                const inputText = document.getElementById('inputBoxCidv1').value.trim();
                const lines = inputText.split('\\n');
                let extractedCids = [];

                lines.forEach(line => {
                    const cidMatch = line.match(/bafy[a-z0-9]+|bafk[a-z0-9]+/);
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
                const outputBoxCidv1 = document.getElementById('outputBoxCidv1');
                outputBoxCidv1.select();
                document.execCommand('copy');
            }

            function generatePinRetry() {
                const inputAddedText = document.getElementById('inputBoxAddedRetry').value.trim();
                const inputCidText = document.getElementById('inputBoxCidRetry').value.trim();
                const serviceNickname = document.getElementById('serviceNicknameRetry').value.trim();
                const addedLines = inputAddedText.split('\\n');
                const cidLines = inputCidText.split('\\n');

                let addedCids = new Set();
                let cidSet = new Set();
                let fileCidNameMap = {};
                let folderCidNameMap = {};

                addedLines.forEach(line => {
                    const match = line.match(/^added\\s+([^\\s]+)\\s+(.+)$/);
                    if (match) {
                        const cid = match[1];
                        const name = match[2];
                        addedCids.add(cid);
                        if (name.includes('/')) {
                            const parts = name.split('/');
                            const folderName = parts[0];
                            const fileName = parts.slice(1).join('/');
                            fileCidNameMap[cid] = fileName;
                        } else {
                            folderCidNameMap[cid] = name;
                        }
                    }
                });

                cidLines.forEach(line => {
                    const trimmedCid = line.trim();
                    if (trimmedCid) {
                        cidSet.add(trimmedCid);
                    }
                });

                let filePinCommands = [];
                let folderPinCommands = [];
                let fileStatusQueries = [];
                let folderStatusQueries = [];

                addedCids.forEach(cid => {
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
                document.getElementById('outputBoxFileStatusQuery').value = ''; // 新增
                document.getElementById('outputBoxFolderStatusQuery').value = ''; // 新增
            } 

            function copyOutputPinRetry() {
                const outputBoxes = [
                    document.getElementById('outputBoxFilePinRetry'),
                    document.getElementById('outputBoxFolderPinRetry'),
                    document.getElementById('outputBoxFileStatusQuery'), // 新增
                    document.getElementById('outputBoxFolderStatusQuery')  // 新增
                ];
                let allOutput = '';
                outputBoxes.forEach(box => {
                    if (box.value) { 
                        allOutput += box.value + '\\n';
                    }
                });
                navigator.clipboard.writeText(allOutput.trim());
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
