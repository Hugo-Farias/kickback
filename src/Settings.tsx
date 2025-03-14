import { ChangeEvent, useState, useEffect } from "react";
import icon from "./assets/logo_48.png";
import Option from "./components/settings/Option.tsx";
import { SettingsValuesT } from "./background.ts";
import { settingsDefaults } from "./background.ts";
import { getSettings } from "./helper.ts";

// const settingsDefaults = {
//   progressBar: true,
//   playingBorder: false,
//   pausePlayClick: false,
//   chatStatus: false,
// };

const settingsStorageLabel = "settings";
let storeSettingsTimeout: number;

const Settings = function () {
  const [options, setOptions] = useState<SettingsValuesT>(settingsDefaults);

  // Comment block chrome api calls so localhost works during development
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

  const onCheck = (e: ChangeEvent<HTMLInputElement>) => {
    setOptions({ ...options, [e.target.id]: e.target.checked });
  };

  return (
    <div className={"bg-[#141517] py-10"}>
      <div
        className={
          "mx-auto h-dvh max-w-screen-sm items-center space-y-6 font-inter text-stone-300"
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
          <form className={"mx-auto contain-content"}>
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
            <Option
              id={"over18Notice"}
              onChange={onCheck}
              checked={options.over18Notice}
            />
          </form>
        </div>
        <footer className={"text-xl"}>
          {chrome.i18n.getMessage("translationMsg")}{" "}
          <a
            className={"text-blue-500 underline hover:text-blue-200"}
            target={"_blank"}
            href={chrome.i18n.getMessage("translatorLink")}
          >
            {chrome.i18n.getMessage("translator")}
          </a>
        </footer>
      </div>
    </div>
  );
};

export default Settings;
