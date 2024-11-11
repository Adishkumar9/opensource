document.getElementById("blockButton").addEventListener("click", () => {
    const siteInput = document.getElementById("siteInput").value.trim();
    const statusDiv = document.getElementById("status");
  
    // Clear the status message before each click
    statusDiv.innerText = "";
    statusDiv.classList.remove("show");
  
    // Regular expression to validate the URL format
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/;
  
    if (siteInput) {
      // Check if the input matches the URL pattern
      if (urlPattern.test(siteInput)) {
        try {
          // Prepend "http://" if the protocol is missing to ensure compatibility with `new URL`
          const site = new URL(siteInput.includes("://") ? siteInput : `http://${siteInput}`).hostname;
  
          // Send the message to the background script with the hostname
          chrome.runtime.sendMessage({ type: "toggleBlock", site }, (response) => {
            if (chrome.runtime.lastError) {
              console.error("Error:", chrome.runtime.lastError); // Log any communication errors
              statusDiv.innerText = "Error communicating with background script.";
            } else if (response && response.success) {
              statusDiv.innerText = `${site} has been toggled.`;
            } else {
              statusDiv.innerText = `Failed to toggle ${site}.`;
            }
            statusDiv.classList.add("show");
            setTimeout(() => {
              statusDiv.classList.remove("show");
              statusDiv.innerText = "";
            }, 2000);
          });
        } catch (error) {
          // Display an error message if URL creation fails unexpectedly
          console.error("URL Error:", error); // Log the error for debugging
          statusDiv.innerText = "An error occurred. Please try again.";
          statusDiv.classList.add("show");
          setTimeout(() => {
            statusDiv.classList.remove("show");
            statusDiv.innerText = "";
          }, 2000);
        }
      } else {
        // Display an error if the URL format is invalid
        statusDiv.innerText = "Invalid URL format. Please enter a valid URL.";
        statusDiv.classList.add("show");
        setTimeout(() => {
          statusDiv.classList.remove("show");
          statusDiv.innerText = "";
        }, 2000);
      }
    } else {
      // Display an error if the input is empty
      statusDiv.innerText = "Please enter a website.";
      statusDiv.classList.add("show");
      setTimeout(() => {
        statusDiv.classList.remove("show");
        statusDiv.innerText = "";
      }, 2000);
    }
  });
  