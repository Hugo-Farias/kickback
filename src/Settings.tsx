import { ChangeEvent, useEffect, useState } from "react";
import { getSettings } from "./helper.ts";

// type OptionsT = {
//   id: string;
//   label: string;
//   type: "checkbox" | "number";
//   checked: boolean;
// };

const settingsStorageLabel = "settings";

const settingsRender = [
  {
    id: "progressBar",
    label: "Show progress bar on 'More Videos' section thumbnails",
    type: "checkbox",
    checked: true,
  },
  {
    id: "pausePlayClick",
    label: "Play/Pause by clicking inside video",
    type: "checkbox",
    checked: false,
  },
] as const;

type SettingsValuesT = Record<(typeof settingsRender)[number]["id"], boolean>;

const initialValues: SettingsValuesT = settingsRender.reduce(
  (prev, curr) => ({ ...prev, [curr.id]: curr.checked }),
  {},
) as SettingsValuesT;

let storeSettingsTimeout: number;

const Settings = function () {
  const [options, setOptions] = useState<SettingsValuesT>(initialValues);

  // Comment chrome.storage calls for localhost to work during development
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
    const target = e.target as HTMLInputElement;

    setOptions((prev) => {
      return { ...prev, [target.id]: target.checked };
    });
  };

  return (
    <div
      className={
        "flex h-dvh w-full flex-col items-center gap-6 bg-[#141517] p-10 font-inter text-[#fdfdfd]"
      }
    >
      <h1 className={"text-3xl font-bold tracking-wide"}>Kickback Settings</h1>
      <div
        className={
          "flex w-full flex-col justify-center rounded-md bg-white/10 py-10"
        }
      >
        <form className={"mx-auto space-y-2 text-xl"}>
          {settingsRender.map((value) => {
            return (
              <label
                className={
                  "flex items-center gap-6 rounded-md px-8 py-2 transition-colors hover:cursor-pointer hover:bg-black/30"
                }
                htmlFor={value.id}
                key={value.id}
              >
                <input
                  className={"size-5"}
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
