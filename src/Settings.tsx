import { ChangeEvent, useState, useEffect } from "react";
import icon from "./assets/logo_48.png";
import Option from "./components/settings/Option.tsx";
import { getSettings } from "./helper.ts";
import { SettingsValuesT } from "./background.ts";
import { settingsDefaults } from "./background.ts";

const settingsStorageLabel = "settings";
let storeSettingsTimeout: number;

// TODO remove block before compile and import settingsDefaults from background
// const settingsDefaults = {
//   progressBar: true,
//   playingBorder: false,
//   pausePlayClick: false,
//   chatStatus: false,
// };

// Block end

// TODO finish revamped ui for settings page
const Settings = function () {
  const [options, setOptions] = useState<SettingsValuesT>(settingsDefaults);

  // Comment block chrome api calls so localhost works during development

  console.log(options);

  useEffect(() => {
    getSettings().then((value) => {
      if (value) setOptions(value);
    });
  }, []);

  useEffect(() => {
    clearTimeout(storeSettingsTimeout);

    storeSettingsTimeout = setTimeout(() => {
      chrome.storage.local.set({ [settingsStorageLabel]: options }).then();
    }, 200);
  }, [options]);

  // Block end

  const onCheck = (e: ChangeEvent<HTMLInputElement>) => {
    setOptions({ ...options, [e.target.id]: e.target.checked });
  };

  return (
    <div className={"bg-[#141517] py-10"}>
      <div
        className={
          "mx-auto h-dvh max-w-screen-sm items-center space-y-6 font-inter text-gray-100"
        }
      >
        <div className={"flex items-center gap-5"}>
          <img src={icon} alt={"Kick.com Video/VODs Resumer icon"} />
          <h1 className={"text-xl font-bold tracking-wide"}>
            Kick.com Video/VODS Resumer
          </h1>
        </div>
        <div
          className={"mx-auto w-full justify-center rounded bg-white/10 py-5"}
        >
          <form className={"mx-auto text-lg contain-content"}>
            <Option
              id={"progressBar"}
              onChange={onCheck}
              checked={options.progressBar}
            />
            <Option
              id={"pausePlayClick"}
              onChange={onCheck}
              checked={options.pausePlayClick}
            />
            <Option
              id={"chatStatus"}
              onChange={onCheck}
              checked={options.chatStatus}
            />
          </form>
        </div>
        {/*<footer className={"text-xs"}>*/}
        {/*  {chrome.i18n.getMessage("translationMsg")}{" "}*/}
        {/*  <a*/}
        {/*    className={"text-blue-500 underline hover:text-blue-200"}*/}
        {/*    target={"_blank"}*/}
        {/*    href={chrome.i18n.getMessage("translatorLink")}*/}
        {/*  >*/}
        {/*    {chrome.i18n.getMessage("translator")}*/}
        {/*  </a>*/}
        {/*</footer>*/}
      </div>
    </div>
  );
};

export default Settings;
