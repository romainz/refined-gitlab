

function sortMR() {
  const getOriginalRootNodeMR = document.querySelector(".mr-list")
  const getAllMrEntry = document.querySelectorAll(".merge-request");
  const sortedMR = Array.from(getAllMrEntry)
    .map((mrEntry) => {
      const titleNode = mrEntry.getElementsByClassName("merge-request-title-text")[0]
      const text = titleNode.getElementsByTagName("a")[0].text
      return { text, mrEntry };
    })
    // sort notApproved/approved
    .sort((mrA, mrB) => {
      var approvedA = 1
      if (! mrA.mrEntry.querySelectorAll("[data-testid='mr-appovals']").length) {
        approvedA = 0;
      }
      var approvedB = 1
      if (! mrB.mrEntry.querySelectorAll("[data-testid='mr-appovals']").length) {
        approvedB = 0;
      }
      return approvedA - approvedB;
    })
    // sort by without/with reviewer notApproved/approved
    .sort((mrA, mrB) => {
      var reviewerA = 1;
      if (! mrA.mrEntry.getElementsByClassName("issuable-reviewers").length) {
        reviewerA = 0;
      }
      var reviewerB = 1;
      if (! mrB.mrEntry.getElementsByClassName("issuable-reviewers").length) {
        reviewerB = 0;
      }
      return reviewerA - reviewerB;
    })
    // sort by WIP/Draft
    .sort((mrA, mrB) => {
      const isDraftA = mrA.text.indexOf("Draft");
      const isDraftA2 = mrA.text.indexOf("draft");
      const isWipA = mrA.text.indexOf("WIP");
      const isWipA2 = mrA.text.indexOf("Wip");
      const isDraftB = mrB.text.indexOf("Draft");
      const isDraftB2 = mrB.text.indexOf("draft");
      const isWipB = mrB.text.indexOf("WIP");
      const isWipB2 = mrB.text.indexOf("Wip");

      return (isDraftA + isDraftA2 + isWipA + isWipA2) - (isDraftB + isDraftB2 + isWipB + isWipB2);
    })
    .map((elem) => elem.mrEntry);
  // Remove all previous MR displayed
  for (let mrEntry of getAllMrEntry) {
    mrEntry.remove();
  }
  // Display sorted MR
  for (const node in sortedMR) {
    getOriginalRootNodeMR.appendChild(sortedMR[node]);
  }
}

async function main() {
  sortMR();
}

main();
