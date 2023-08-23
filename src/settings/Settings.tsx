import "./Settings.scss";
import { useState } from "react";
import Option from "./Option";

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

  const handleAction = function (v) {
    setOptions((prev) => ({ ...prev, [v]: !options[v] }));
    console.log(options[v]);
  };

  return (
    <div className="settings">
      <h1>Settings</h1>
      <div className="options">
        <Option
          id="progressBar"
          defaultVal={options.progressBar}
          type="checkbox"
          label="Show progress bar on thumbnail previews"
          action={handleAction}
        />
      </div>
      <div className="buttons">
        <button>Save</button>
        <button>Restore Defaults</button>
      </div>
    </div>
  );
};

export default Settings;
