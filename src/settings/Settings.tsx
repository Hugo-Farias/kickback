import "./Settings.scss";
import { useEffect, useState } from "react";
import { settingsStorageLabel } from "../config";
import { validateStoredSettings } from "./settingsHelper";

type optionsT = {
  id: keyof defaultStateT;
  label: string;
  type: "checkbox" | "number";
  value: boolean;
  children?: optionsT;
};

export type defaultStateT = {
  resume: boolean;
  progressBar: boolean;
  sidebarState: boolean;
  chatState: boolean;
  pausePlayClick: boolean;
  // test: boolean;
};

export const defaultSettingsValues: defaultStateT = {
  resume: true,
  progressBar: true,
  sidebarState: false,
  chatState: false,
  pausePlayClick: false,
  // test: false,
};

const settingsRender: optionsT[] = [
  {
    id: "resume",
    label: "Resume VODs",
    type: "checkbox",
    value: defaultSettingsValues.resume,
  },
  {
    id: "progressBar",
    label: "Show progress bar on 'Recent broadcasts' thumbnail previews",
    type: "checkbox",
    value: defaultSettingsValues.progressBar,
  },
  {
    id: "sidebarState",
    label: "Auto-close recommended sidebar",
    type: "checkbox",
    value: defaultSettingsValues.sidebarState,
  },
  {
    id: "chatState",
    label: "Auto-close chat",
    type: "checkbox",
    value: defaultSettingsValues.chatState,
  },
  {
    id: "pausePlayClick",
    label: "Pause/Play by clicking on video frame",
    type: "checkbox",
    value: defaultSettingsValues.pausePlayClick,
  },
  // {
  //   id: "test",
  //   label: "test label",
  //   type: "checkbox",
  //   value: defaultSettingsValues.test,
  // },
];

const Settings = function () {
  const [options, setOptions] = useState<defaultStateT>(defaultSettingsValues);
  const [save, setSave] = useState<boolean>(false);

  useEffect(() => {
    validateStoredSettings();
    chrome.storage.local
      .get([settingsStorageLabel])
      .then((v: { [key: string]: defaultStateT }) => {
        if (!v[settingsStorageLabel]) return setOptions(defaultSettingsValues);
        setOptions(v[settingsStorageLabel]);
      });
  }, []);

  if (!options) return null;

  const handleClick = function (id: string, val: boolean) {
    setOptions((prev: defaultStateT) => ({ ...prev, [id]: val }));
  };

  const handleSave = function () {
    chrome.storage.local.set({ [settingsStorageLabel]: options }).then();

    setSave(true);

    setTimeout(() => {
      setSave(false);
    }, 1500);
  };

  const handleRestore = function () {
    if (!confirm("Restore Defaults?")) return;
    chrome.storage.local.remove(settingsStorageLabel).then(() => {});
    setOptions(defaultSettingsValues);
  };

  const JSX = settingsRender.map((v: optionsT) => {
    const value = v.id ? options[v.id] : v.value;

    return (
      <div
        key={v.id}
        className="option"
        onClick={() => handleClick(v.id, !value)}
      >
        <input type={v.type} checked={value} onChange={() => {}} />
        <span>{v.label}</span>
      </div>
    );
  });

  return (
    <div className="settings">
      <h1>Settings</h1>
      <div className="options">{JSX}</div>
      <div className="buttons">
        <button className={save ? "saved" : ""} onClick={handleSave}>
          {!save ? "Save" : "Saved!"}
        </button>
        <button onClick={handleRestore}>Restore Defaults</button>
      </div>
    </div>
  );
};

export default Settings;
