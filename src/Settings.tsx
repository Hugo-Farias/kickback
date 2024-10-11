import { OptionsT } from "./typeDef";

const settingsValues: OptionsT[] = [
  {
    id: "resume",
    label: "Resume VODs",
    type: "checkbox",
    value: true,
  },
  {
    id: "progressBar",
    label: "Show progress bar on 'Recent broadcasts' thumbnail previews",
    type: "checkbox",
    value: true,
  },
  {
    id: "sidebarState",
    label: "Auto-close recommended sidebar",
    type: "checkbox",
    value: false,
  },
  {
    id: "chatState",
    label: "Auto-close chat",
    type: "checkbox",
    value: false,
  },
  {
    id: "pausePlayClick",
    label: "Pause/Play by clicking on video frame",
    type: "checkbox",
    value: false,
  },
];

const Settings = function () {
  console.log(settingsValues);

  return (
    <div
      className={
        "font-inter flex h-dvh w-full flex-col items-center gap-6 bg-[#141517] p-10 text-[#fdfdfd]"
      }
    >
      <h1 className={"text-3xl font-bold tracking-wide"}>Kickback Settings</h1>
      <div
        className={
          "flex w-full flex-col justify-center rounded-md bg-white/10 py-10"
        }
      >
        <div className={"mx-auto space-y-3 text-xl"}>
          {settingsValues.map((value, index) => {
            return (
              <div className={"flex gap-6"}>
                <input type={"checkbox"} aria-label={value.label} />
                <label key={index}>{value.label}</label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Settings;
