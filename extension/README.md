# EthMem Extension - Professional StructureChatGPT Message Logger (Dummy Route)



## Project Structure
This minimal Chrome/Edge extension injects a page script into chat.openai.com, hooks network calls (fetch and WebSocket), and forwards detected user messages and assistant responses to the extension content script. The content script logs payloads to the console (the "dummy route").



```Install & test:

extension/

├── manifest.json                 # Extension configuration1. Open chrome://extensions (or edge://extensions) and enable "Developer mode".

├── README.md                     # This file2. Click "Load unpacked" and select the `extension` folder inside this repository.

│3. Open https://chat.openai.com and open DevTools (Console). Send a message.

├── src/                         # Source code4. You should see console.log entries prefixed with "CHATGPT_LOG:" showing outgoing and incoming payloads.

│   ├── background/              # Service worker

│   │   └── background.js        # Message handler & coordinatorNotes & limitations:

│   │- This uses heuristics to detect chat endpoints and message shapes. It may need tweaking when ChatGPT changes its API.

│   ├── content/                 # Content scripts- This example only logs to console; replace the forwarding in `contentScript.js` to POST to a real endpoint if needed.

│   │   └── contentScript.js     # UI injection & message forwarding- Be mindful of privacy and terms of service when capturing user messages.

│   │
│   ├── page/                    # Page context scripts
│   │   ├── pageScript.js        # API interception (monkeypatch)
│   │   └── ethAdapter.js        # Wallet connection
│   │
│   ├── popup/                   # Extension popup
│   │   ├── popup.html          # Popup UI
│   │   └── popup.js            # Popup logic
│   │
│   ├── ui/                      # UI components
│   │   ├── memoryViewer.js     # Memory viewer modal
│   │   ├── modelManagement.html
│   │   ├── modelManagement.js
│   │   └── transformersLoader.html
│   │
│   └── lib/                     # Libraries & utilities
│       ├── memoryExtractor.js   # Extract structured memories
│       ├── memoryStorage.js     # IndexedDB operations
│       ├── transformers.min.js
│       └── transformersLoaderScript.js
│
├── assets/                      # Static files
│   └── logo.png
│
└── docs/                        # Documentation
    ├── ASI_Feature_Plan.md
    ├── IMPLEMENTATION_SUMMARY.md
    ├── CSP_and_Manifest_Errors_Explained.md
    └── CODE_DUPLICATION_ANALYSIS.md
```

---

## How It Works

### 1. Message Interception (Better Method)
```
ChatGPT API Call
    ↓
pageScript.js (monkeypatch fetch)
    ↓
Extract user message from request
    ↓
window.postMessage → contentScript.js
    ↓
chrome.runtime.sendMessage → background.js
```

### 2. Memory Extraction
```
background.js receives message
    ↓
memoryExtractor.js processes text
    ↓
Pattern matching extracts: category + entity + confidence
    ↓
If confidence > 0.7 → save to IndexedDB
```

### 3. Memory Viewing
```
User clicks "ethmem" button
    ↓
memoryViewer.js opens modal
    ↓
Fetches from background.js
    ↓
Displays memories with colors & timestamps
```

---

## Quick Start

1. **Load Extension**
   ```bash
   1. Go to chrome://extensions/
   2. Enable "Developer mode"
   3. Click "Load unpacked"
   4. Select /extension folder
   ```

2. **Test on ChatGPT**
   ```bash
   1. Navigate to https://chatgpt.com
   2. Look for "ethmem" button in header
   3. Send message: "I live in Mumbai"
   4. Click button to view extracted memory
   ```

3. **Debug**
   ```bash
   F12 → Console → Filter "[EthMem]"
   ```

---

## Memory Schema

```javascript
{
  id: "mem-timestamp-random",
  timestamp: 1697712000000,
  source: "I live in delhi",
  category: "location",
  entity: "delhi",
  context: {
    conversationId: "chatgpt-...",
    platform: "chatgpt"
  },
  metadata: {
    confidence: 0.85,
    modelUsed: "laflan-mini",
    extractionVersion: "1.0"
  },
  status: "local" // "synced" | "on-chain"
}
```