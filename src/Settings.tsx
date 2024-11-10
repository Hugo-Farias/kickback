import { ChangeEvent, useEffect, useState } from "react";
import { getSettings } from "./helper.ts";

const settingsStorageLabel = "settings";

const settingsRender = [
  {
    id: "progressBar",
    label: chrome.i18n.getMessage("settingsProgressBar"),
    type: "checkbox",
    checked: true,
  },
  {
    id: "pausePlayClick",
    label: chrome.i18n.getMessage("settingsPausePlayClick"),
    type: "checkbox",
    checked: false,
  },
] as const;

export type SettingsValuesT = Record<
  (typeof settingsRender)[number]["id"],
  boolean
>;

const initialValues: SettingsValuesT = settingsRender.reduce(
  (prev, curr) => ({ ...prev, [curr.id]: curr.checked }),
  {},
) as SettingsValuesT;

let storeSettingsTimeout: number;

const Settings = function () {
  const [options, setOptions] = useState<SettingsValuesT>(initialValues);

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
    <div
      className={
        "mx-auto h-dvh items-center space-y-6 bg-[#141517] p-10 font-inter text-gray-100"
      }
    >
      <h1 className={"mx-auto text-center text-3xl font-bold tracking-wide"}>
        {chrome.i18n.getMessage("title")}
      </h1>
      <div
        className={
          "mx-auto w-full max-w-screen-sm justify-center bg-white/10 py-10"
        }
      >
        <form className={"mx-auto text-lg contain-content"}>
          {settingsRender.map((value) => {
            return (
              <label
                className={
                  "flex items-center gap-3 px-10 py-2 transition-colors hover:cursor-pointer hover:bg-black/30"
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
    </div>
  );
};

export default Settings;
