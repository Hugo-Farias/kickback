import type { SettingsT } from "@/types";

type Props = {
  id: keyof SettingsT;
};

const OptionCheckBox = ({ id }: Props) => {
  return (
    <label
      htmlFor={id}
      id={id}
      className={
        "flex cursor-pointer items-center gap-2 text-white hover:text-stone-300"
      }
    >
      <input type="checkbox" id={id} />
      <span>{i18n.t(`settings.${id}`)}</span>
    </label>
  );
};

export default OptionCheckBox;
