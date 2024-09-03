import optionsStorage from "./options-storage";

import "./options.css";

const boxes = document.querySelectorAll(
  ".feature .checkbox input[type=checkbox]"
);
const allChecked = document.getElementById("allChecked");
const checkAllButton = document.getElementById("checkAll");
const refreshButton = document.getElementById("refresh");

/**
 * Function for the checkAll button.
 * It enables all features by checking all checkboxes of the Popup and saving the preferences.
 */
const checkAll = async () => {
  // Update the checkboxes visually
  allChecked.checked = !allChecked.checked;
  boxes.forEach((checkbox) => {
    checkbox.checked = allChecked.checked;
  });
  checkAllButton.innerText = allChecked.checked ? "Uncheck all" : "Check all";

  // Update the options in the storage too
  const options = await optionsStorage.getAll();
  optionsStorage.setAll(
    Object.fromEntries(
      Object.entries(options).map(([option, value]) => [
        option,
        option !== "personalToken" ? allChecked.checked : value,
      ])
    )
  );
};

/**
 * Function for the refresh button.
 * It reloads the activeTab (and not the pop-up window.)
 */
const reloadCurrentTab = async () => {
  // eslint-disable-next-line no-undef
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
    // eslint-disable-next-line no-undef
    chrome.tabs.reload(tabs[0].id)
  );
  refreshButton.style.opacity = 0;
};

const makeRefreshButtonVisible = () => {
  refreshButton.style.opacity = 1;
};

// Add their function to the action buttons
checkAllButton.addEventListener("click", checkAll);
refreshButton.addEventListener("click", reloadCurrentTab);

// Set visible the refresh button as soon as one change has been made
checkAllButton.addEventListener("click", makeRefreshButtonVisible);
boxes.forEach((checkbox) => {
  checkbox.addEventListener("click", makeRefreshButtonVisible);
});

optionsStorage.syncForm(document.getElementById("options-form"));
