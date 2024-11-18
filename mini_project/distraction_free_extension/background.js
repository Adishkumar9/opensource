chrome.storage.sync.get(["blockedUrls"], (data) => {
  const blockedUrls = data.blockedUrls || [];
  updateBlockingRules(blockedUrls);
});

// Listen for storage changes to update blocking rules
chrome.storage.onChanged.addListener((changes) => {
  if (changes.blockedUrls) {
    const newBlockedUrls = changes.blockedUrls.newValue || [];
    updateBlockingRules(newBlockedUrls);
  }
});

function updateBlockingRules(blockedUrls) {
  const urls = blockedUrls.map((url) => `*://${url}/*`);
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1],
    addRules: [
      {
        id: 1,
        priority: 1,
        action: { type: "block" },
        condition: { urlFilter: "", domains: urls },
      },
    ],
  });
}
