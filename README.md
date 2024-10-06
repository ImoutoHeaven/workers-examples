**For Cloudflare Workers**

ipfs.js - IPFS Command Generator.

ed2k.js - ED2K URL Encoder and name extractor.

magnet.js - magnet URL name Decoder and extractor.





# IPFS Command Generator

This project provides a tool based on Cloudflare Workers to generate and handle various IPFS commands. It includes several modes, each designed to fulfill specific tasks such as extracting IPFS CIDs, retrying pin operations, generating IPFS add commands, and more.

## Features
- **IPFS Command Extractor**: Extracts commands for handling files and folders added to IPFS.
- **CID-v1 Extractor**: Extracts CIDv1 hashes from input.
- **Remote Pin Retry**: Generates commands to retry pinning operations remotely.
- **IPFS Add Generator**: Generates `ipfs add` commands based on IPFS file listings.
- **IPFS Added URL Generator**: Generates commands from IPFS URLs.
- **File Table Generator**: Creates a file table listing CIDs and filenames.

## Installation
Clone the repository and deploy using Cloudflare Workers.

```bash
git clone <repository-url>
```

Ensure you have the required dependencies for Cloudflare Workers in place.

## Usage

### 1. IPFS Command Extractor Mode

**Example Input:**
```
added QmTzQ1z4BbYxA7wQVsn2jfUwQR8HGqWwhLQmxM7FcTLMEf folder1/file1.txt
added QmWmyoCVmY7koSbG1wbyL7Q9czqjYxPyDAf24T2GceMY35 folder1/file2.txt
added QmWmyoCVmY7koSbG1wbyL7Q9czqjYxPyDAf24T2GceMY36 folder1
```

**Example Output:**
```
ipfs files mkdir "/folder1"
ipfs files cp "/ipfs/QmTzQ1z4BbYxA7wQVsn2jfUwQR8HGqWwhLQmxM7FcTLMEf" "/folder1/file1.txt"
ipfs files cp "/ipfs/QmWmyoCVmY7koSbG1wbyL7Q9czqjYxPyDAf24T2GceMY35" "/folder1/file2.txt"
added QmWmyoCVmY7koSbG1wbyL7Q9czqjYxPyDAf24T2GceMY36 folder1
```

### 2. CID-v1 Extractor Mode

**Example Input:**
```
bafybeibwzifcbowbjczcnpbl5pbrshrfjslwz2w7nrabth64zzrfsykgba
```

**Example Output:**
```
bafybeibwzifcbowbjczcnpbl5pbrshrfjslwz2w7nrabth64zzrfsykgba
```

### 3. IPFS Remote Pin Retry

**Example Input:**
- Added entries: 
```
added QmTzQ1z4BbYxA7wQVsn2jfUwQR8HGqWwhLQmxM7FcTLMEf folder1/file1.txt
```
- CID list: 
```
QmTzQ1z4BbYxA7wQVsn2jfUwQR8HGqWwhLQmxM7FcTLMEf
```

**Example Output:**
```
ipfs pin remote add --service=crust --background QmTzQ1z4BbYxA7wQVsn2jfUwQR8HGqWwhLQmxM7FcTLMEf --name "file1.txt"
```

### 4. IPFS Add Generator

**Input:**
- Folder listing: `ipfs files ls -l "/"`.
- Files listing: `ipfs files ls -l "/folder-name"`.

**Example Output:**
```
added QmTzQ1z4BbYxA7wQVsn2jfUwQR8HGqWwhLQmxM7FcTLMEf folder1/file1.txt
added QmWmyoCVmY7koSbG1wbyL7Q9czqjYxPyDAf24T2GceMY36 folder1
```

### 5. IPFS Added URL Generator

This mode generates `ipfs added` commands based on provided IPFS file URLs and folder CID URL.

**Input:**
- File URLs (one per line):
```
https://gateway.crust.network/ipfs/QmTzQ1z4BbYxA7wQVsn2jfUwQR8HGqWwhLQmxM7FcTLMEf?filename=file1.txt
https://gateway.crust.network/ipfs/QmWmyoCVmY7koSbG1wbyL7Q9czqjYxPyDAf24T2GceMY35?filename=file2.txt
```
- Folder CID URL:
```
https://gateway.crust.network/ipfs/QmWmyoCVmY7koSbG1wbyL7Q9czqjYxPyDAf24T2GceMY36
```
- Folder name: `folder1`

**Example Output:**
```
added QmTzQ1z4BbYxA7wQVsn2jfUwQR8HGqWwhLQmxM7FcTLMEf folder1/file1.txt
added QmWmyoCVmY7koSbG1wbyL7Q9czqjYxPyDAf24T2GceMY35 folder1/file2.txt
added QmWmyoCVmY7koSbG1wbyL7Q9czqjYxPyDAf24T2GceMY36 folder1
```

### 6. File Table Generator

This mode generates a file table with filenames, their corresponding CIDs, and sizes (currently set to `0`).

**Input:**
```
added QmTzQ1z4BbYxA7wQVsn2jfUwQR8HGqWwhLQmxM7FcTLMEf folder1/file1.txt
added QmWmyoCVmY7koSbG1wbyL7Q9czqjYxPyDAf24T2GceMY35 folder1/file2.txt
added QmWmyoCVmY7koSbG1wbyL7Q9czqjYxPyDAf24T2GceMY36 folder1
```

**Example Output:**
```
file1.txt	QmTzQ1z4BbYxA7wQVsn2jfUwQR8HGqWwhLQmxM7FcTLMEf	0
file2.txt	QmWmyoCVmY7koSbG1wbyL7Q9czqjYxPyDAf24T2GceMY35	0
folder1	QmWmyoCVmY7koSbG1wbyL7Q9czqjYxPyDAf24T2GceMY36	0
```

## License
No License. Use At Your Own Risk.

