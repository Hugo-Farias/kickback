import { signal } from "@preact/signals";
import type { TargetedEvent } from "preact";
import { debounce, getSettings } from "@/helper";
import type { SettingsT } from "@/types";

type InputT = "text" | "checkbox" | "radio" | "number" | "password" | "email";

export const initialSettings: SettingsT = {
  showProgressBar: true,
  showNowPlayingTag: true,
  autoCloseChat: false,
  autoCloseSidebar: false,
};

getSettings().then((storedSettings) => {
  if (storedSettings) {
    settings.value = { ...settings.value, ...storedSettings };
  }
});

function isSettingKey(id: string): id is keyof SettingsT {
  return id in initialSettings;
}

const settings = signal(initialSettings);

const Settings = () => {
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

    debounce(() => {
      chrome.storage.local.set(newSettings);
    }, 200);
  };

  return (
    <div className="space-y-2">
      <OptionCheckBox
        onChange={inputCallback}
        checked={settings.value.showProgressBar}
        id="showProgressBar"
      />
      <OptionCheckBox
        onChange={inputCallback}
        checked={settings.value.showNowPlayingTag}
        id="showNowPlayingTag"
      />
      <OptionCheckBox
        onChange={inputCallback}
        checked={settings.value.autoCloseChat}
        id="autoCloseChat"
      />
      <OptionCheckBox
        onChange={inputCallback}
        checked={settings.value.autoCloseSidebar}
        id="autoCloseSidebar"
      />
    </div>
  );
};

export default Settings;
