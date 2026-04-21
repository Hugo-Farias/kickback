import Settings from "./Settings";

// TODO: Add stored video times available in the content script to the pop-up
function App() {
  return (
    <div className={"mx-4 my-2 text-nowrap text-sm text-stone-200"}>
      {/* <div className={"text-right"}> */}
      {/*   <button type="button"> */}
      {/*     <img */}
      {/*       className={"size-6"} */}
      {/*       src={settingsIcon} */}
      {/*       aria-label={"Settings"} */}
      {/*     /> */}
      {/*   </button> */}
      {/* </div> */}
      <Settings />
      <div className={"mt-3 ml-auto text-right"}>
        <a
          className={"text-blue-300 hover:underline"}
          href={
            "https://chromewebstore.google.com/detail/cclmmfbfmjjeafmilojlhmdekmagonmb/support"
          }
          target={"_blank"}
          aria-label={i18n.t("reportBug")}
          rel="noopener"
        >
          {i18n.t("reportBug")}
        </a>
      </div>
    </div>
  );
}

export default App;
