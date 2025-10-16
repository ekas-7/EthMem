document.getElementById('injectLogo').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;
  try {
    const resp = await fetch(chrome.runtime.getURL('logo.png'));
    const blob = await resp.blob();
    const reader = new FileReader();
    const dataUrl = await new Promise((res, rej) => {
      reader.onloadend = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(blob);
    });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (logoDataUrl) => {
        try {
          const selectors = ['[placeholder="Ask anything"]','[data-placeholder="Ask anything"]','#prompt-textarea','textarea[name="prompt-textarea"]','div[contenteditable="true"][id*="prompt"]','div.ProseMirror','[class*="bg-token-bg-primary"]'];
          let composer = null;
          for (const s of selectors) {
            try { const el = document.querySelector(s); if (el) { composer = el.closest('[class*="bg-token-bg-primary"]') || el.closest('div') || el; break; } } catch (e) {}
          }
          if (!composer) { console.log('popup-scripter: composer not found'); return; }
          const btns = Array.from(composer.querySelectorAll('button'));
          let group = null;
          if (btns.length) {
            const parentCount = new Map();
            for (const b of btns) { const p = b.parentElement || b; parentCount.set(p, (parentCount.get(p) || 0) + 1); }
            let best = null, bestCount = 0;
            for (const [p, c] of parentCount.entries()) { if (c > bestCount) { best = p; bestCount = c; } }
            group = best || btns[btns.length - 1].parentElement || btns[btns.length - 1];
          } else {
            group = composer.querySelector('button[aria-label="Dictate button"]')?.parentElement || composer.querySelector('[data-testid="composer-speech-button-container"]') || composer;
          }
          if (!group) { console.log('popup-scripter: group not found'); return; }
          if (group.previousElementSibling && group.previousElementSibling.classList && group.previousElementSibling.classList.contains('ext-logo-inserted')) { console.log('popup-scripter: logo already present'); return; }
          const img = document.createElement('img'); img.src = logoDataUrl; img.alt = 'logo'; img.className = 'ext-logo-inserted'; img.style.width = '28px'; img.style.height = '28px'; img.style.objectFit = 'cover'; img.style.borderRadius = '50%'; img.style.marginRight = '6px'; img.style.display = 'inline-block';
          group.parentElement.insertBefore(img, group);
          console.log('popup-scripter: logo inserted');
        } catch (e) { console.error('popup-scripter error', e); }
      },
      args: [dataUrl]
    });
  } catch (e) {
    console.error('popup: failed to fetch logo', e);
  }
});

document.getElementById('injectEkas').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      try {
        const nodes = document.querySelectorAll('[class*="text-base"][class*="mx-auto"]');
        console.log('popup-scripter: ekas targets', nodes.length);
        for (const target of nodes) {
          if (target.querySelector('.ext-ekas')) { console.log('popup-scripter: ekas already present in', target); continue; }
          const span = document.createElement('span'); span.className = 'ext-ekas'; span.textContent = 'ekas'; span.style.marginLeft = '6px'; span.style.fontWeight = '600'; span.style.color = '#0ea5a4'; target.appendChild(span); console.log('popup-scripter: ekas inserted into', target);
        }
      } catch (e) { console.error('popup-scripter ekas error', e); }
    }
  });
});
