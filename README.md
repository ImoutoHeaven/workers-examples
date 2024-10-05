**For Cloudflare Workers**

ipfs.js - IPFS Command Generator.

ed2k.js - ED2K URL Encoder and name extractor.

magnet.js - magnet URL name Decoder and extractor.




# IPFS Command Generator (Cloudflare Workers) - ipfs.js

This project provides an IPFS command generator hosted on Cloudflare Workers. It offers several modes for generating IPFS-related commands, such as adding files to IPFS, extracting CIDs, and generating remote pin retry commands.

## Features
- **IPFS Command added提取器**: Extracts commands for handling files and folders added to IPFS.
- **CIDv1 提取器**: Extracts CIDs in version 1 from provided input.
- **IPFS Remote Pin 重试器**: Generates commands to retry IPFS remote pinning.
- **IPFS Add 生成器**: Creates commands for adding files to IPFS.
- **IPFS Added生成器 (URL模式)**: Generates IPFS added commands using URLs.

## Installation

To use this tool, you need to deploy the provided `ipfs.js` script to a Cloudflare Worker. 

1. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Create a new Cloudflare Worker.
3. Copy and paste the code from `ipfs.js` into the worker's script section.
4. Save and deploy the worker.

## Usage

The tool supports multiple modes that can be switched via a dropdown on the webpage. Below are the details for each mode:

### 1. IPFS Command added提取器
This mode extracts commands for files and folders added to IPFS.

**Input Example:**
```
added QmExampleCID1 foldername/filename1
added QmExampleCID2 foldername/filename2
added QmFolderCID foldername
```

**Output Example:**
- mkdir commands
- cp commands
- ls command
- File and Folder CID lists
- Gateway URLs
- Pin commands and status check commands

### 2. CIDv1 提取器
This mode extracts version 1 CIDs from the input.

**Input Example:**
```
added bafyExampleCID foldername/filename
```

**Output Example:**
- Extracted CIDs

### 3. IPFS Remote Pin 重试器
Generates IPFS remote pin retry commands based on added inputs and CID lists.

**Input Example:**
```
added QmExampleCID1 foldername/filename1
added QmExampleCID2 foldername/filename2
QmExampleCID1
QmExampleCID2
```

**Output Example:**
- Pin retry commands
- Status query commands

### 4. IPFS Add 生成器
Generates IPFS add commands based on file and folder structure inputs.

**Input Example:**
```
foldername/
filename1 QmExampleCID1
filename2 QmExampleCID2
```

**Output Example:**
- `ipfs add` commands

### 5. IPFS Added生成器 (URL模式)
Generates IPFS add commands from provided URLs.

**Input Example:**
```
https://gateway.ipfs.io/ipfs/QmExampleCID1?filename=filename1
https://gateway.ipfs.io/ipfs/QmFolderCID
foldername
```

**Output Example:**
- Added commands for files and folders

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
