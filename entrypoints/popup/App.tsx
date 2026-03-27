import { signal } from "@preact/signals";
import type { TargetedEvent } from "preact";
import OptionCheckBox from "@/components/OptionCheckBox";
import type { SettingsT } from "@/types";

const initialSettings: SettingsT = {
  showProgressBar: true,
};

const settings = signal(initialSettings);
const counter = signal(0);

function App() {
  console.log("click");

  document.querySelector("input")?.click(); // TEST: Test line

  const onChange = (e: TargetedEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;

    settings.value.showProgressBar = !target.checked;
    console.log(settings.value.showProgressBar);
  };

  return (
    <div className="mx-5 my-2 text-nowrap text-white">
      <OptionCheckBox
        onChange={onChange}
        checked={settings.value.showProgressBar}
        id="showProgressBar"
      />

      <button
        type="button"
        onClick={() => counter.value++}
        className="rounded bg-blue-500 px-3 py-1 text-white"
      >
        Add
      </button>
      <div className="size-10 text-3xl">{counter}</div>
    </div>
  );
}

export default App;
