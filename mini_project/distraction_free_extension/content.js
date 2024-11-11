chrome.storage.sync.get("blockedSites", (data) => {
    const blockedSites = data.blockedSites || [];
    const currentSite = window.location.hostname;
  
    if (blockedSites.includes(currentSite)) {
      document.body.innerHTML = "<h1>Blocked! Stay focused.</h1>";
      document.body.style.textAlign = "center";
      document.body.style.paddingTop = "20%";
      document.body.style.fontSize = "2em";
      document.body.style.color = "red";
    }
  });
  