import "./settings.scss";

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
  const optionsJSX = dummyOptions.map((v, i) => {
    return (
      <li key={i}>
        <span>{v.label}</span>
        <input type={v.type} />
      </li>
    );
  });

  return (
    <div className="settings">
      <h1>Settings</h1>
      <div className="options">
        <ul>{optionsJSX}</ul>
      </div>
    </div>
  );
};

export default Settings;
