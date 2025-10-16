# Claude Integration

## Overview
ETHmem extension now supports both **ChatGPT** and **Claude** platforms!

## Supported Platforms

| Platform | URL | Status |
|----------|-----|--------|
| ChatGPT | https://chat.openai.com/* | ✅ Supported |
| Claude | https://claude.ai/* | ✅ Supported |

## How It Works

### Platform Detection
The extension automatically detects which platform you're on:
```javascript
const isChatGPT = window.location.hostname.includes('openai.com');
const isClaude = window.location.hostname.includes('claude.ai');
```

### Header Injection

#### ChatGPT
- **Target**: `#page-header` element
- **Position**: First child (left side of header)
- **Appearance**: Dark pill button with logo and "ethmem" text

#### Claude
- **Target**: `header[data-testid="page-header"]`
- **Position**: Before the actions container (near the Share button)
- **Appearance**: Same dark pill button with logo and "ethmem" text
- **Styling**: Additional 8px right margin for proper spacing

### Header Structure

#### ChatGPT Header
```
┌─────────────────────────────────────────────┐
│ [ETHmem] [Chat Title] ... [Settings] [User]│
└─────────────────────────────────────────────┘
```

#### Claude Header
```
┌─────────────────────────────────────────────┐
│ [Title ▼] ... [ETHmem] [Share] │
└─────────────────────────────────────────────┘
```

## Features on Both Platforms

✅ **Auto-injection** - Button appears automatically when page loads
✅ **Persistent** - Survives navigation and page updates
✅ **MutationObserver** - Re-injects if removed
✅ **Wallet Connection** - Works on both platforms
✅ **Message Interception** - Captures conversations on both

## Testing

### ChatGPT
1. Navigate to https://chat.openai.com
2. Button should appear on the left side of header
3. Test navigation between conversations
4. Verify button persists

### Claude
1. Navigate to https://claude.ai
2. Button should appear near the Share button
3. Start a new conversation
4. Verify button persists across navigation

## Technical Implementation

### Manifest Changes
```json
{
  "host_permissions": [
    "https://chat.openai.com/*",
    "https://claude.ai/*"
  ],
  "content_scripts": [{
    "matches": [
      "https://chat.openai.com/*",
      "https://claude.ai/*"
    ],
    "js": ["contentScript.js"],
    "run_at": "document_start"
  }]
}
```

### Content Script Updates

#### Platform Detection
```javascript
const isChatGPT = window.location.hostname.includes('openai.com');
const isClaude = window.location.hostname.includes('claude.ai');
```

#### Header Detection
```javascript
if (isChatGPT) {
  pageHeader = document.getElementById('page-header');
} else if (isClaude) {
  pageHeader = document.querySelector('header[data-testid="page-header"]');
}
```

#### Insertion Logic
```javascript
if (isChatGPT) {
  // Insert at beginning
  pageHeader.insertBefore(wrapper, pageHeader.firstChild);
} else if (isClaude) {
  // Insert before actions container
  const actionsContainer = pageHeader.querySelector('[data-testid="chat-actions"]');
  actionsContainer.parentElement.insertBefore(wrapper, actionsContainer.parentElement.lastChild);
}
```

## Claude-Specific Considerations

### Header Structure
Claude's header uses:
- `data-testid="page-header"` for the header element
- `data-testid="chat-actions"` for the actions container
- Multiple nested divs with flex layouts

### Styling Adjustments
- Added 8px right margin for spacing
- Uses same button styling as ChatGPT
- Integrates seamlessly with Claude's design system

### DOM Observation
MutationObserver watches for:
- Header removal/recreation
- Button removal
- Navigation changes
- Dynamic content updates

## Future Enhancements

Potential future additions:
- [ ] Support for Gemini (Google Bard)
- [ ] Support for Perplexity AI
- [ ] Support for Microsoft Copilot
- [ ] Platform-specific styling variations
- [ ] Platform-specific features

## Troubleshooting

### Button Not Appearing on Claude
1. Check console for errors: `ext: page header not found`
2. Verify you're on claude.ai domain
3. Check if Claude updated their header structure
4. Reload the extension
5. Hard refresh the page (Cmd+Shift+R)

### Button Position Issues
If the button appears in the wrong place:
1. Claude may have updated their DOM structure
2. Check `data-testid="page-header"` still exists
3. Verify `data-testid="chat-actions"` container exists
4. Update insertion logic if needed

## Debugging

Enable debug logging:
```javascript
console.log('ext: platform detection -', { isChatGPT, isClaude });
console.log('ext: logo button inserted into', isChatGPT ? 'ChatGPT' : 'Claude', 'header');
```

Check extension console:
1. Right-click extension icon
2. Select "Inspect popup"
3. Check Console tab for logs

## Files Modified

- ✏️ `manifest.json` - Added Claude permissions and content scripts
- ✏️ `contentScript.js` - Platform detection and dual-platform support
- ✏️ Extension description updated

## Version History

### v0.1.0
- ✅ ChatGPT support
- ✅ Claude support
- ✅ Auto-injection for both platforms
- ✅ Wallet connection on both platforms
- ✅ MutationObserver for persistence
