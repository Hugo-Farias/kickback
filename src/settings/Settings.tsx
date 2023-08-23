import "./Settings.scss";
import { MouseEvent, useState } from "react";

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

type initStateT = {
  resume: boolean;
  progressBar: boolean;
  skip: boolean;
  skipAmount: number;
};

const initState: initStateT = {
  resume: true,
  progressBar: true,
  skip: true,
  skipAmount: 5,
};

const Settings = function () {
  const [options, setOptions] = useState<initStateT>(initState);

  const handleAction = function (id, val) {
    setOptions((prev) => ({ ...prev, [id]: val }));
  };
  console.log(options);

  return (
    <div className="settings">
      <h1>Settings</h1>
      <div className="options">
        <div
          className="option"
          onClick={() => handleAction("progressBar", !options.progressBar)}
        >
          <input
            type="checkbox"
            checked={options.progressBar}
            onChange={() => {}}
          />
          <span>Show progress bar on thumbnail previews</span>
        </div>
      </div>
      <div className="buttons">
        <button>Save</button>
        <button>Restore Defaults</button>
      </div>
    </div>
  );
};

export default Settings;
