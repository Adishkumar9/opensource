chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ blockedSites: [] });
  });
  
  // Listen for messages to block or unblock sites
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "toggleBlock") {
      chrome.storage.sync.get("blockedSites", (data) => {
        let blockedSites = data.blockedSites || [];
        const siteIndex = blockedSites.indexOf(message.site);
        if (siteIndex === -1) {
          blockedSites.push(message.site);
        } else {
          blockedSites.splice(siteIndex, 1);
        }
        chrome.storage.sync.set({ blockedSites }, () => sendResponse({ success: true }));
      });
      return true;
    }
  });
  