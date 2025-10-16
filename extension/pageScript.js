// pageScript.js
// Runs in page context. Monkeypatch fetch to capture outgoing messages and incoming responses
(function() {
  // Helper to post to content script
  function forward(payload) {
    window.postMessage({ type: 'CHATGPT_LOG', payload }, '*');
  }

  // Try to detect GraphQL/REST calls used by ChatGPT. We monkeypatch fetch.
  const originalFetch = window.fetch;
  window.fetch = async function(input, init) {
    try {
      // Capture request details
      const url = (typeof input === 'string') ? input : input.url;
      const method = (init && init.method) || 'GET';
      let body = init && init.body;

      // If GraphQL JSON, try parse
      let parsedBody = null;
      if (body) {
        try {
          parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
        } catch (e) {
          parsedBody = null;
        }
      }

      // Heuristic: For chat messages, ChatGPT sends to endpoints containing "/backend-api/conversation" or "/api/conversation"
      const isChatEndpoint = /conversation|chat|responses/i.test(url);

      if (isChatEndpoint) {
        // Attempt to extract user message text from parsedBody
        let userMessage = null;
        if (parsedBody) {
          // Many ChatGPT payloads include messages in "messages" array or in "input"
          if (Array.isArray(parsedBody.messages)) {
            const last = parsedBody.messages[parsedBody.messages.length - 1];
            if (last && last.content) {
              // content may be an object with "parts"
              if (Array.isArray(last.content.parts)) {
                userMessage = last.content.parts.join('\n');
              } else if (typeof last.content === 'string') {
                userMessage = last.content;
              }
            }
          } else if (parsedBody.input && typeof parsedBody.input === 'string') {
            userMessage = parsedBody.input;
          } else if (parsedBody.prompt) {
            userMessage = parsedBody.prompt;
          }
        }

        if (userMessage) {
          forward({ direction: 'outgoing', url, method, userMessage, raw: parsedBody });
        } else {
          forward({ direction: 'outgoing', url, method, raw: parsedBody });
        }
      }

      const response = await originalFetch.apply(this, arguments);

      // Clone the response to read body
      try {
        const clone = response.clone();
        const contentType = clone.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const json = await clone.json();

          // Heuristic: responses may contain an "message" or "content" with assistant text
          let assistantText = null;
          if (json.message && json.message.content) {
            if (Array.isArray(json.message.content.parts)) assistantText = json.message.content.parts.join('\n');
            else assistantText = json.message.content;
          } else if (json.choices && json.choices.length) {
            // for some APIs, choices[0].delta or text
            const c = json.choices[0];
            if (c.delta && c.delta.content) assistantText = c.delta.content;
            else if (c.text) assistantText = c.text;
          }

          if (assistantText) {
            forward({ direction: 'incoming', url, assistantText, raw: json });
          } else {
            forward({ direction: 'incoming', url, raw: json });
          }
        } else {
          // Not JSON
        }
      } catch (e) {
        // ignore body parse errors
      }

      return response;
    } catch (err) {
      return originalFetch.apply(this, arguments);
    }
  };

  // Also attempt to hook WebSocket send if Chat uses WS (optional)
  try {
    const OrigWebSocket = window.WebSocket;
    function WrappedWebSocket(url, protocols) {
      const ws = protocols ? new OrigWebSocket(url, protocols) : new OrigWebSocket(url);

      const origSend = ws.send;
      ws.send = function(data) {
        try {
          let parsed = null;
          try { parsed = JSON.parse(data); } catch (e) { parsed = null; }
          if (parsed) {
            forward({ direction: 'ws-outgoing', url, data: parsed });
          } else {
            forward({ direction: 'ws-outgoing', url, data: data });
          }
        } catch (e) {}
        return origSend.apply(this, arguments);
      };

      ws.addEventListener('message', function(ev) {
        try {
          let payload = ev.data;
          try { payload = JSON.parse(ev.data); } catch (e) {}
          forward({ direction: 'ws-incoming', url, data: payload });
        } catch (e) {}
      });

      return ws;
    }
    WrappedWebSocket.prototype = OrigWebSocket.prototype;
    window.WebSocket = WrappedWebSocket;
  } catch (e) {
    // ignore
  }

  // Listen for wallet connection requests from content script
  window.addEventListener('message', async (event) => {
    if (event.source !== window) return;
    
    if (event.data && event.data.type === 'EXT_CONNECT_WALLET') {
      console.log('pageScript: received wallet connection request');
      
      // Wait for ethAdapter to be available
      let retries = 0;
      const maxRetries = 50; // 5 seconds max
      
      while (!window.ethAdapter && retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 100));
        retries++;
      }
      
      if (!window.ethAdapter) {
        console.error('pageScript: ethAdapter not available');
        window.postMessage({ 
          type: 'WALLET_ERROR', 
          payload: { error: 'ethAdapter not loaded' } 
        }, '*');
        return;
      }
      
      try {
        // Connect to MetaMask
        const result = await window.ethAdapter.connect();
        
        if (result.success) {
          console.log('pageScript: wallet connected successfully');
          window.postMessage({ 
            type: 'WALLET_CONNECTED', 
            payload: {
              address: result.address,
              chainId: result.chainId,
              networkName: window.ethAdapter.getNetworkName(result.chainId)
            } 
          }, '*');
        } else {
          console.error('pageScript: wallet connection failed:', result.error);
          window.postMessage({ 
            type: 'WALLET_ERROR', 
            payload: { error: result.error } 
          }, '*');
        }
      } catch (error) {
        console.error('pageScript: wallet connection exception:', error);
        window.postMessage({ 
          type: 'WALLET_ERROR', 
          payload: { error: error.message } 
        }, '*');
      }
    }
  });

  console.log('pageScript: wallet connection listener initialized');

})();
