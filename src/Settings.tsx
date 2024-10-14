import { OptionsT } from "./typeDef";
import { ChangeEvent, useState } from "react";

const settingsInfo: OptionsT[] = [
  {
    id: "resume",
    label: "Resume VODs",
    type: "checkbox",
    checked: true,
  },
  {
    id: "progressBar",
    label: "Show progress bar on 'More Videos' section thumbnails",
    type: "checkbox",
    checked: true,
  },
  {
    id: "pausePlayClick",
    label: "Pause/Play by clicking on video frame",
    type: "checkbox",
    checked: false,
  },
];

const initialSettings = settingsInfo.reduce((prev, curr) => {
  return { ...prev, [curr.id]: curr.checked };
}, {});

// console.log(initialSettings);

const Settings = function () {
  const [settings, setSettings] = useState<{ [key: string]: boolean }>(
    initialSettings,
  );

  const onCheck = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;

    console.log(target.id, target.checked);

    setSettings({ ...settings, [target.id]: target.checked });
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
          {settingsInfo.map((value) => {
            return (
              <label
                className={
                  "flex items-center gap-6 rounded-md px-8 py-2 transition-colors hover:bg-black/30"
                }
                htmlFor={value.id}
                key={value.id}
              >
                <input
                  className={"size-5"}
                  type={"checkbox"}
                  checked={settings[value.id]}
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
