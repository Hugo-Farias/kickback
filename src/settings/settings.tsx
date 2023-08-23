import "./settings.scss";
import { useState } from "react";

const dummyOptions: {
  label: string;
  type: "checkbox" | "number";
  value: boolean | number;
}[] = [
  {
    label: "Show progress bar on thumbnail previews",
    type: "checkbox",
    value: true,
  },
  {
    label: "Skip forwards or back with arrow keys",
    type: "checkbox",
    value: true,
  },
  { label: "Skip amount in seconds", type: "number", value: 5 },
];

const Settings = function () {
  const [options, setOptions] = useState(dummyOptions);

  const optionsJSX = dummyOptions.map((v, i) => {
    return (
      <li key={i}>
        <input min="1" type={v.type} />
        <div className="label">
          <span>{v.label}</span>
        </div>
      </li>
    );
  });

  return (
    <div className="settings">
      <h1>Settings</h1>
      <div className="options">
        <ul>{optionsJSX}</ul>
      </div>
      <div className="buttons">
        <button>Save</button>
        <button>Restore Defaults</button>
      </div>
    </div>
  );
};

export default Settings;
