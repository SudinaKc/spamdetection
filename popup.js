document.getElementById('classifySpamButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "classifyEmails" }, (response) => {
      console.log('Response from content script:', response.status);
    });
  });
});


