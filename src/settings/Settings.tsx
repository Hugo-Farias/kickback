import "./Settings.scss";
import { useState } from "react";

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

const defaultState: defaultStateT = {
  resume: {
    id: "resume",
    label: "Resume VODs",
    type: "checkbox",
    value: true,
  },
  progressBar: {
    id: "progressBar",
    label: "Show progress bar on thumbnail previews",
    type: "checkbox",
    value: true,
  },
};

let initState;

chrome.storage.local
  .get(["settings"])
  .then((v: { settings: defaultStateT }) => {
    const set = v.settings;
    if (!set) return (initState = defaultState);
    initState = v.settings;
  });

const Settings = function () {
  const [options, setOptions] = useState<defaultStateT>(initState);
  const [save, setSave] = useState<boolean>(false);

  const handleAction = function (id, val) {
    setOptions((prev) => ({ ...prev, [id]: { ...prev[id], value: val } }));
  };

  const handleSave = function () {
    chrome.storage.local.set({ settings: options }).then();

    setSave(true);

    setTimeout(() => {
      setSave(false);
    }, 1500);
  };

  const handleRestore = function () {
    if (!confirm("Restore Defaults?")) return;
    setOptions(defaultState);
    handleSave();
  };

  const JSX = Object.entries(options).map((v) => {
    const obj = v[1];

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
