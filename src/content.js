
function isDraft(mr) {
  const titleNode = mr.getElementsByClassName("merge-request-title-text")[0]
  const text = titleNode.getElementsByTagName("a")[0].text.toLowerCase()
  return text.includes("draft") || text.includes("wip");
}

function isApproved(mr) {
  if (! mr.querySelectorAll("[data-testid='mr-appovals']").length) {
    return false;
  } else {
    return true;
  }
}

function isReviewing(mr) {
  if (! mr.getElementsByClassName("issuable-reviewers").length) {
    return false;
  } else {
    return true;
  }
}

function sortMR() {
  const getOriginalRootNodeMR = document.querySelector(".mr-list")
  const getAllMrEntry = document.querySelectorAll(".merge-request");
  const sortedMR = Array.from(getAllMrEntry)
    .map((mrEntry) => {
      const isDraftMr = isDraft(mrEntry)
      const isApprovedMr = isApproved(mrEntry)
      const isReviewingMr = isReviewing(mrEntry)
      return { isDraftMr, isApprovedMr, isReviewingMr, mrEntry };
    })
    // sort notApproved/approved
    .sort((mrA, mrB) => {
      var approvedA = 0;
      if (mrA.isApprovedMr) {
        approvedA = 1;
      }
      var approvedB = 0;
      if (mrB.isApprovedMr) {
        approvedB = 1;
      }
      return approvedA - approvedB;
    })
    // sort by without/with reviewer
    .sort((mrA, mrB) => {
      var isReviewingA = 0;
      if (mrA.isReviewingMr) {
        isReviewingA = 1;
      }
      var isReviewingB = 0;
      if (mrB.isReviewingMr) {
        isReviewingB = 1;
      }
      return isReviewingA - isReviewingB;
    })
    // sort by WIP/Draft
    .sort((mrA, mrB) => {
      var isDraftA = 0;
      if (mrA.isDraftMr) {
        isDraftA = 1;
      }
      var isDraftB = 0;
      if (mrB.isDraftMr) {
        isDraftB = 1;
      }
      return isDraftA - isDraftB;
    })
    .map((mr) => mr.mrEntry);
  // Remove all previous MR displayed
  for (let mrEntry of getAllMrEntry) {
    mrEntry.remove();
  }
  // Display sorted MR
  for (const node in sortedMR) {
    getOriginalRootNodeMR.appendChild(sortedMR[node]);
  }
}


function colorMR() {
  const getAllMrEntry = document.querySelectorAll(".merge-request");
  for (let mr of getAllMrEntry) {
    if (isDraft(mr)) {
      // transparent
      mr.style.opacity = "0.5";
    } else if (isApproved(mr)) {
      // green
      mr.style.backgroundColor = 'rgba(195, 230, 205, 0.3)';
    } else if (isReviewing(mr)) {
      // orange
      mr.style.backgroundColor = 'rgba(253, 172, 83, 0.2)';
    } else {
      // grey
      mr.style.backgroundColor = 'rgba(232, 232, 232, 0.5)';
    }
    if (isReviewing(mr)) {
      // add reviewer label
      createReviewerLabel(mr);
    }
  }
}

// Handle labels
function createReviewerLabel(mr) {
  var labelsGroup = mr.querySelectorAll("[aria-label='Labels']");
  if (! labelsGroup.length) {
    // create the labels group
    mr.querySelectorAll("[aria-label='Labels']");
    labelsGroup = document.createElement("div");
    labelsGroup.setAttribute('aria-label', 'Labels');
    labelsGroup.setAttribute('class', 'gl-mt-1 gl-display-flex gl-flex-wrap gl-gap-2');
    labelsGroup.setAttribute('role', 'group');
    // add the labels group
    const issuableInfo = mr.getElementsByClassName("issuable-info")[0];
    issuableInfo.appendChild(labelsGroup);
  } else {
    labelsGroup = labelsGroup[0]
  }
  // add the reviewer label
  const span1 = document.createElement("span");
  span1.setAttribute('class', 'gl-label gl-label-sm');
  const span2 = document.createElement("span");
  span2.setAttribute('class', 'gl-label-text gl-label-text-light');
  span2.setAttribute('style', 'background-color: #009966');
  // get reviewer name
  const reviewers = mr.getElementsByClassName("issuable-reviewers")[0].getElementsByClassName("author-link")[0]
  const reviewerName = reviewers.getAttribute("href");
  span2.textContent = reviewerName.replace("/", "");
  span1.appendChild(span2);
  labelsGroup.appendChild(span1);
}

// <span class="gl-label gl-label-sm">
// <span class="gl-label-text gl-label-text-light" style="background-color: #ff0000">DONT-MERGE</span></span>


async function main() {
  sortMR();
  colorMR();
}

main();
