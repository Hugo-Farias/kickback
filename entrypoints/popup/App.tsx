import { signal } from "@preact/signals";
import type { TargetedEvent } from "preact";
import OptionCheckBox from "@/components/OptionCheckBox";
import { debounce, getSettings } from "@/helper";
import type { SettingsT } from "@/types";

type InputT = "text" | "checkbox" | "radio" | "number" | "password" | "email";

export const initialSettings: SettingsT = {
  showProgressBar: true,
  autoCloseChat: false,
};

function isSettingKey(id: string): id is keyof SettingsT {
  return id in initialSettings;
}

const settings = signal(initialSettings);

getSettings().then((storedSettings) => {
  if (storedSettings) {
    settings.value = { ...settings.value, ...storedSettings };
  }
});

function App() {
  const inputCallback = (e: TargetedEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const type = target.type as InputT;
    const { id } = target;
    let output: boolean | string;

    if (!isSettingKey(id)) return;

    if (type === "checkbox") {
      output = target.checked;
    } else {
      output = target.value;
    }

    const newSettings = { ...settings.value, [id]: output };

    settings.value = newSettings;

    // TODO: Chrome is not a global variable in this context, need to find a way to access it
    debounce(() => {
      console.log("Saving settings", newSettings);
      chrome.storage.local.set(newSettings);
    }, 200);
  };

  return (
    <div className="mx-5 my-2 space-y-2 text-nowrap text-stone-200">
      <OptionCheckBox
        onChange={inputCallback}
        checked={settings.value.showProgressBar}
        id="showProgressBar"
      />
      <OptionCheckBox
        onChange={inputCallback}
        checked={settings.value.autoCloseChat}
        id="autoCloseChat"
      />
    </div>
  );
}

export default App;
