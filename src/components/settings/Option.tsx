import { ChangeEvent, HTMLInputTypeAttribute } from "react";
import { SettingsValuesT } from "../../background.ts";
import msgJson from "../../../_locales/en/messages.json";

type PropsT = {
  id: keyof SettingsValuesT;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: HTMLInputTypeAttribute;
};

const Option = function (props: PropsT) {
  const { id, type, checked, onChange } = props;

  const label = chrome.i18n ? chrome.i18n.getMessage(id) : msgJson[id]?.message;

  return (
    <label
      className={
        "flex gap-3 px-10 py-2 transition-colors hover:cursor-pointer hover:bg-black/30"
      }
      htmlFor={id}
    >
      <input
        className={"text-black"}
        type={type || "checkbox"}
        checked={checked}
        aria-label={label}
        id={id}
        onChange={onChange}
      />
      {label}
    </label>
  );
};

export default Option;
