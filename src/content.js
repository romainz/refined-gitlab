
async function main() {
  const getOriginalRootNodeMR = document.querySelector(".mr-list")
  const getAllMrEntry = document.querySelectorAll(".merge-request");
  const sortedMR = Array.from(getAllMrEntry)
    .map((mrEntry) => {
      const titleNode = mrEntry.getElementsByClassName("merge-request-title-text")[0]
      const text = titleNode.getElementsByTagName("a")[0].text
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
  for (let mrEntry of getAllMrEntry) {
    mrEntry.remove();
  }
  for (const node in sortedMR) {
    getOriginalRootNodeMR.appendChild(sortedMR[node]);
  }
}

main();
