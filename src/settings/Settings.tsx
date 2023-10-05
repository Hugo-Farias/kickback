import "./Settings.scss";
import { useEffect, useState } from "react";
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

const Settings = function () {
  const [options, setOptions] = useState<defaultStateT>(null);
  const [save, setSave] = useState<boolean>(false);

  useEffect(() => {
    chrome.storage.local
      .get([settingsStorageLabel])
      .then((v: { settings: defaultStateT }) => {
        setOptions(v.settings);
      });
  }, []);

  if (!options) return null;

  const handleAction = function (id: string, val: boolean) {
    setOptions((prev: defaultStateT) => ({
      ...prev,
      [id]: { ...prev[id], value: val },
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
    chrome.storage.local.remove(settingsStorageLabel).then(() => {
      validateStoredSettings();
    });
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
