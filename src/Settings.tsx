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

  return <h1 className={"text-blue-500"}>Settings page</h1>;
};

export default Settings;
