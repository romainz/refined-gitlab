//import addDomainPermissionToggle from 'webext-domain-permission-toggle';

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log("background executed")
  if (tab.url?.startsWith("chrome://")) {
    console.log("tab url start with chrome://")
    return undefined;
  }
  // only tab of opened MR
  if ((!tab.url?.includes("?") || tab.url?.includes("state=opened")) && tab.active && changeInfo.status === 'complete') {
    chrome.scripting.executeScript({
      target: {tabId: tabId},
      files: ['./content.js']
    })
    .then(() => console.log("Scripts Loaded for Refined Gitlab"));
  }
})

// For custom domain permissions
//addDomainPermissionToggle();
