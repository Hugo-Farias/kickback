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
    </div>
  );
}

export default App;
