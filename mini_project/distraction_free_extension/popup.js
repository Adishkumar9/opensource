const urlInput = document.getElementById("urlInput");
const addButton = document.getElementById("addButton");
const blockedList = document.getElementById("blockedList");
const feedback = document.getElementById("feedback");

// Update the blocked list UI
function updateBlockedList() {
  chrome.storage.sync.get("blockedUrls", (data) => {
    const blockedUrls = data.blockedUrls || [];
    blockedList.innerHTML = "";
    blockedUrls.forEach((url) => {
      const listItem = document.createElement("li");
      listItem.textContent = url;

      const removeButton = document.createElement("button");
      removeButton.textContent = "Unblock";
      removeButton.addEventListener("click", () => {
        removeBlockedUrl(url);
      });

      listItem.appendChild(removeButton);
      blockedList.appendChild(listItem);
    });
  });
}

// Add a new URL to the blocklist
addButton.addEventListener("click", () => {
  const url = urlInput.value.trim();
  if (!url) {
    feedback.textContent = "Please enter a valid URL.";
    feedback.style.color = "red";
    return;
  }

  chrome.storage.sync.get("blockedUrls", (data) => {
    const blockedUrls = data.blockedUrls || [];
    if (!blockedUrls.includes(url)) {
      blockedUrls.push(url);
      chrome.storage.sync.set({ blockedUrls }, () => {
        addBlockingRule(url);
        feedback.textContent = `${url} has been blocked.`;
        feedback.style.color = "green";
        urlInput.value = "";
        updateBlockedList();
      });
    } else {
      feedback.textContent = `${url} is already blocked.`;
      feedback.style.color = "orange";
    }
  });
});

// Add a blocking rule to Declarative Net Request
function addBlockingRule(url) {
  const ruleId = url.hashCode(); // Generate a unique ID for each rule
  const rule = {
    id: ruleId,
    priority: 1,
    action: { type: "block" },
    condition: { urlFilter: `*://${url}/*` }
  };
  chrome.declarativeNetRequest.updateDynamicRules(
    { addRules: [rule] },
    () => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      }
    }
  );
}

// Remove a URL from the blocklist
function removeBlockedUrl(url) {
  chrome.storage.sync.get("blockedUrls", (data) => {
    let blockedUrls = data.blockedUrls || [];
    blockedUrls = blockedUrls.filter((u) => u !== url);
    chrome.storage.sync.set({ blockedUrls }, () => {
      removeBlockingRule(url);
      updateBlockedList();
    });
  });
}

// Remove a blocking rule from Declarative Net Request
function removeBlockingRule(url) {
  const ruleId = url.hashCode();
  chrome.declarativeNetRequest.updateDynamicRules(
    { removeRuleIds: [ruleId] },
    () => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      }
    }
  );
}

// Generate a unique hash code for a string
String.prototype.hashCode = function () {
  let hash = 0;
  for (let i = 0; i < this.length; i++) {
    hash = (hash << 5) - hash + this.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// Load the blocked URLs on popup open
updateBlockedList();
