
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

function getCurrentUser() {
  return document.getElementsByClassName("js-current-user")[0].getElementsByClassName("dropdown-light-content")[0].text.replace(" ", "").replace("@", "")
}


function browseMR() {
  const getAllMrEntry = document.querySelectorAll(".merge-request");
  var approved = 0
  var inReview = 0
  var unassigned = 0
  for (let mr of getAllMrEntry) {
    // color background MR
    if (isDraft(mr)) {
      // transparent
      mr.style.opacity = "0.5";
    } else if (isApproved(mr)) {
      // green
      mr.style.backgroundColor = 'rgba(195, 230, 205, 0.3)';
      approved = approved + 1
    } else if (isReviewing(mr)) {
      // orange
      mr.style.backgroundColor = 'rgba(253, 172, 83, 0.2)';
      inReview = inReview + 1
    } else {
      // grey
      mr.style.backgroundColor = 'rgba(232, 232, 232, 0.5)';
      unassigned = unassigned + 1
    }

    // add P0 label
    addP0Label(mr);

    // add reviewer label
    if (isReviewing(mr)) {
      createReviewerLabel(mr);
    }
  }

  addFilters(getAllMrEntry.length, unassigned, inReview, approved);
}

// Handle labels
function getLabelsGroup(mr) {
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
    labelsGroup = labelsGroup[0];
  }
  return labelsGroup;
}

function createLabel(group, text, backgroundColor) {
  const span1 = document.createElement("span");
  span1.setAttribute('class', 'gl-label gl-label-sm');
  const span2 = document.createElement("span");
  span2.setAttribute('class', 'gl-label-text gl-label-text-light');
  span2.setAttribute('style', 'background-color: ' + backgroundColor);
  span2.textContent = text;
  span1.appendChild(span2);
  group.appendChild(span1);
}

function createClickableLabel(group, text, backgroundColor, urlParams, margin) {
  const labelHtml = "<span class=\"gl-label gl-label-sm\" style=\"margin:" + margin + "px\"><a class=\"gl-link gl-label-link\" href=\"/dce-front/android/mycanal/-/merge_requests?" + urlParams +"\"><span class=\"gl-label-text gl-label-text-light\" data-container=\"body\" data-html=\"true\" style=\"background-color:"+ backgroundColor + "\">" + text + "</span></a></span>"
  group.insertAdjacentHTML("beforeend", labelHtml)
}

function createReviewerLabel(mr) {
  var labelsGroup = getLabelsGroup(mr);
  // get reviewer name
  const reviewers = mr.getElementsByClassName("issuable-reviewers")[0].getElementsByClassName("author-link");
  for (let reviewer of reviewers) {
    // add the reviewer label
    const reviewerName = reviewer.getAttribute("href").replace("/", "");
    const urlParams = "reviewer_username=" + reviewerName;
    createClickableLabel(labelsGroup, reviewerName, "#009966", urlParams, 0);
  }
}

function addP0Label(mr) {
  const branches = mr.getElementsByClassName("ref-name")
  if (branches.length > 0) {
    branchName = branches[0].text.replace(" ", "").replace("-", "").replace("\n", "")
    if (branchName.startsWith("hotfix") || branchName.startsWith("release")) {
      var labelsGroup = getLabelsGroup(mr);
      createLabel(labelsGroup, "P0", "#FF0000");
    }
  }
}

function addFilters(all, unassigned, inReview, approved) {
  const filtersGroup = document.getElementsByClassName("issues-filters")[0]
  const margin = "5"

  // All
  createClickableLabel(filtersGroup, "All (" + all + ")", "#A9A9A9", "", margin);
  createClickableLabel(filtersGroup, "Unassigned (" + unassigned + ")", "rgba(208, 208, 208, 1)", "reviewer_id=None&draft=no", margin);
  createClickableLabel(filtersGroup, "In review (" + inReview + ")", "rgba(253, 172, 83, 1)", "reviewer_id=Any&draft=no&approved_by_usernames[]=None", margin);
  createClickableLabel(filtersGroup, "Approved (" + approved + ")", "#A0DAA9", "approved_by_usernames[]=Any", margin);
}

async function main() {
  sortMR();
  browseMR();
}

main();
