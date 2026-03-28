import { signal } from "@preact/signals";
import type { TargetedEvent } from "preact";
import OptionCheckBox from "@/components/OptionCheckBox";
import type { SettingsT } from "@/types";

const initialSettings: SettingsT = {
  showProgressBar: true,
  autoCloseChat: false,
};

function isSettingKey(id: string): id is keyof SettingsT {
  return id in initialSettings;
}
const settings = signal(initialSettings);

function App() {
  const booleanCallback = (e: TargetedEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const id = target.id;

    if (!isSettingKey(id)) return;

    settings.value = {
      ...settings.value,
      [id]: target.checked,
    };
  };

  return (
    <div className="mx-5 my-2 space-y-2 text-nowrap text-stone-200">
      <OptionCheckBox
        onChange={booleanCallback}
        checked={settings.value.showProgressBar}
        id="showProgressBar"
      >
        <div className={"text-4xl"}> TEST</div>
      </OptionCheckBox>
      <OptionCheckBox
        onChange={booleanCallback}
        checked={settings.value.autoCloseChat}
        id="autoCloseChat"
      >
        <div className={"text-4xl"}> TEST</div>
      </OptionCheckBox>
    </div>
  );
}

export default App;
