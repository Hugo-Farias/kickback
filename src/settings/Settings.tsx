import "./Settings.scss";
import { useState } from "react";
import { settingsStorageLabel } from "../config";
import { defaultSettingsState, validateStoredSettings } from "./settingsHelper";

type optionsT = {
  id: string;
  label: string;
  type: "checkbox" | "number";
  value: boolean;
  children?: optionsT;
};

export type defaultStateT = {
  resume: optionsT;
  progressBar: optionsT;
};

const settingsOrder: Array<keyof defaultStateT> = ["resume", "progressBar"];

let initState;

chrome.storage.local
  .get([settingsStorageLabel])
  .then((v: { settings: defaultStateT }) => {
    const set = v.settings;

    if (!set) {
      chrome.storage.local
        .get([settingsStorageLabel])
        .then((v: { settings: defaultStateT }) => {
          const set = v.settings;
          console.log(set);
        });
      return;
    }

    if (
      Object.entries(set).length !== Object.entries(defaultSettingsState).length
    ) {
      const setArr = Object.keys(set);
      const defaultArr = Object.keys(defaultSettingsState);
      setArr.forEach((v) => {
        if (defaultArr.includes(v)) return;
        delete set[v];
        console.log(set);
      });
    }
    initState = v.settings;
  });

const Settings = function () {
  const [options, setOptions] = useState<defaultStateT>(initState);
  const [save, setSave] = useState<boolean>(false);

  const handleAction = function (id, val) {
    setOptions((prev) => ({ ...prev, [id]: { ...prev[id], value: val } }));
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
    setOptions(defaultSettingsState);
    chrome.storage.local.remove(settingsStorageLabel).then();
    validateStoredSettings();
  };

  const JSX = settingsOrder.map((v) => {
    const obj = options[v];

    return (
      <div
        key={obj.id}
        className="option"
        onClick={() => handleAction(obj.id, !obj.value)}
      >
        <input type={obj.type} checked={obj.value!} onChange={() => {}} />
        <span>{obj.label}</span>
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
