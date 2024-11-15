import { ChangeEvent, useEffect, useState } from "react";
import icon from "./assets/logo_48.png";
import { getSettings } from "./helper.ts";
import { settingsDefaults } from "./background/background.ts";

const settingsStorageLabel = "settings";

const settingsRender = [
  {
    id: "progressBar",
    label: chrome.i18n.getMessage("settingsProgressBar"),
    // "Show progress bar on 'More Videos' section thumbnails",
    type: "checkbox",
  },
  {
    id: "pausePlayClick",
    label: chrome.i18n.getMessage("settingsPausePlayClick"),
    // "Play/Pause by clicking inside video",
    type: "checkbox",
  },
  {
    id: "chatStatus",
    label: chrome.i18n.getMessage("settingsChatStatus"),
    // "Save chat sidebar status",
    type: "checkbox",
  },
] as const;

export type SettingsValuesT = Record<
  (typeof settingsRender)[number]["id"],
  boolean
>;

let storeSettingsTimeout: number;

const Settings = function () {
  const [options, setOptions] = useState<SettingsValuesT>(settingsDefaults);

  // Comment this block of chrome.storage calls so localhost works during development

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

  // End

  const onCheck = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;

    setOptions((prev) => {
      return { ...prev, [target.id]: target.checked };
    });
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
            {settingsRender.map((value) => {
              return (
                <label
                  className={
                    "flex gap-3 px-10 py-2 transition-colors hover:cursor-pointer hover:bg-black/30"
                  }
                  htmlFor={value.id}
                  key={value.id}
                >
                  <input
                    type={value.type}
                    checked={options[value.id]}
                    aria-label={value.label}
                    id={value.id}
                    onChange={onCheck}
                  />
                  {value.label}
                </label>
              );
            })}
          </form>
        </div>
        <footer className={"text-xs"}>
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
