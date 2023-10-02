import "./Settings.scss";
import { useState } from "react";

type optionsT = {
  id: string;
  label: string;
  type: "checkbox" | "number";
  value: boolean | number;
  children?: optionsT;
};

type initStateT = {
  [identifier: any]: optionsT;
};

const defaultState: initStateT = {
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
  skip: {
    id: "skip",
    label: "Skip forwards or back with arrow keys",
    type: "checkbox",
    value: true,
    children: {
      id: "skipAmount",
      label: "Skip amount in seconds",
      type: "number",
      value: 5,
    },
  },
};

const initState = defaultState;

const Settings = function () {
  const [options, setOptions] = useState<initStateT>(initState);
  const [save, setSave] = useState<boolean>(false);

  const handleAction = function (id, val) {
    setOptions((prev) => ({ ...prev, [id]: { ...prev[id], value: val } }));
  };

  const handleSave = function () {
    Object.entries(options).map((v) => {
      console.log(v[1].id, v[1].value);
    });

    chrome.storage.sync.set({ settings: options });

    chrome.storage.sync.get(["settings"]).then((v) => {
      console.log(v);
    });

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
