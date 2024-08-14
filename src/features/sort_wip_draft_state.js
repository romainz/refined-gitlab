import { h } from "dom-chef";
import select from "select-dom";

function sortWipDraftState() {
  const getOriginalRootNodeMR = select(".mr-list");
  const getAllMrEntry = select.all(".merge-request", getOriginalRootNodeMR);
  const sortedMR = getAllMrEntry
    // sort without reviewer
//    .map((mrEntry) => {
//      const text = select(".gl-display-flex issuable-reviewers", mrEntry);
//      return { text, mrEntry };
//    }
//    .map((elem) => elem.mrEntry);
    // sort wip/draft
    .map((mrEntry) => {
      const text = select(".merge-request-title-text a", mrEntry).text;
      return { text, mrEntry };
    })
    .sort((a, b) => {
      const isDraftA = a.text.indexOf("Draft");
      const isDraftA2 = a.text.indexOf("draft");
      const isWipA = a.text.indexOf("WIP");
      const isWipA2 = a.text.indexOf("Wip");
      const isDraftB = b.text.indexOf("Draft");
      const isDraftB2 = b.text.indexOf("draft");
      const isWipB = b.text.indexOf("WIP");
      const isWipB2 = b.text.indexOf("Wip");

      return (isDraftA + isDraftA2 + isWipA + isWipA2) - (isDraftB + isDraftB2 + isWipB + isWipB2);
    })
    .map((elem) => elem.mrEntry);
  for (const node in getAllMrEntry) {
    getAllMrEntry[node].remove();
  }
  for (const node in sortedMR) {
    getOriginalRootNodeMR.appendChild(sortedMR[node]);
  }
}

export default sortWipDraftState;
