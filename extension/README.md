ChatGPT Message Logger (Dummy Route)

This minimal Chrome/Edge extension injects a page script into chat.openai.com, hooks network calls (fetch and WebSocket), and forwards detected user messages and assistant responses to the extension content script. The content script logs payloads to the console (the "dummy route").

Install & test:

1. Open chrome://extensions (or edge://extensions) and enable "Developer mode".
2. Click "Load unpacked" and select the `extension` folder inside this repository.
3. Open https://chat.openai.com and open DevTools (Console). Send a message.
4. You should see console.log entries prefixed with "CHATGPT_LOG:" showing outgoing and incoming payloads.

Notes & limitations:
- This uses heuristics to detect chat endpoints and message shapes. It may need tweaking when ChatGPT changes its API.
- This example only logs to console; replace the forwarding in `contentScript.js` to POST to a real endpoint if needed.
- Be mindful of privacy and terms of service when capturing user messages.
