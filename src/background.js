//import addDomainPermissionToggle from 'webext-domain-permission-toggle';

chrome.tabs.onUpdated.addListener((tab, { status }) => {
  if (status === 'complete') {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ['./content.js']
    })
    .then(() => console.log("Scripts Loaded for Refined Gitlab"));
  }
});

// For custom domain permissions
//addDomainPermissionToggle();
