// Set up an empty array for blocked sites in local storage (or use actual blocking logic)
let blockedSites = JSON.parse(localStorage.getItem('blockedSites')) || [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "toggleBlock") {
    const site = request.site;

    // Toggle blocking the site
    if (blockedSites.includes(site)) {
      blockedSites = blockedSites.filter(blockedSite => blockedSite !== site);
      localStorage.setItem('blockedSites', JSON.stringify(blockedSites));
      sendResponse({ success: true });
    } else {
      blockedSites.push(site);
      localStorage.setItem('blockedSites', JSON.stringify(blockedSites));
      sendResponse({ success: true });
    }
  } else {
    sendResponse({ success: false });
  }
  return true; // Keep the message channel open for asynchronous response
});
