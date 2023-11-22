import "./Settings.scss";
import { useEffect, useState } from "react";
import { settingsStorageLabel } from "../config";
// Validate if deleted one of the settings options
import { validateStoredSettings } from "./settingsHelper";
validateStoredSettings();

type optionsT = {
  id: string;
  label: string;
  type: "checkbox" | "number";
  value: boolean;
  children?: optionsT;
};

export type defaultStateT = {
  resume: boolean;
  progressBar: boolean;
  uiState: boolean;
};

export const defaultSettingsValues: defaultStateT = {
  resume: true,
  progressBar: true,
  uiState: true,
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
    label: "Show progress bar on thumbnail previews",
    type: "checkbox",
    value: defaultSettingsValues.progressBar,
  },
  {
    id: "uiState",
    label: "Save the state of chat and recommended sidebars",
    type: "checkbox",
    value: defaultSettingsValues.uiState,
  },
];

const Settings = function () {
  const [options, setOptions] = useState<defaultStateT | null>(null);
  const [save, setSave] = useState<boolean>(false);

  console.log("settings");

  useEffect(() => {
    chrome.storage.local
      .get([settingsStorageLabel])
      .then((v: { settings: defaultStateT }) => {
        if (!v.settings) return setOptions(defaultSettingsValues);
        setOptions(v.settings);
      });
  }, []);

  if (!options) return null;

  const handleClick = function (id: string, val: boolean) {
    setOptions((prev: defaultStateT) => ({
      ...prev,
      [id]: val,
    }));
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
  };

  const JSX = settingsRender.map((v: optionsT) => {
    console.log(options);

    const value = options[v.id] && v.value;

    return (
      <div
        key={v.id}
        className="option"
        onClick={() => handleClick(v.id, value)}
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
