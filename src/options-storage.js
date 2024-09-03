import OptionsSync from "webext-options-sync";

export default new OptionsSync({
  defaults: {
    addFavoriteSearches: true,
    copyMRIssueNumber: true,
    customMRSort: true,
    dimDraftMR: true,
    displayBundleSizes: true,
    displayThumbAuthors: true,
    openInDemoButton: true,
    prettierOnMdFields: true,
    replaceMrUrl: true,
    sideMRAuthor: true,
    upgradeMRStats: true,

    personalToken: "",
  },
});
