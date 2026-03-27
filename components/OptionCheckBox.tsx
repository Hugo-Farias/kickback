import { effect, useSignal } from "@preact/signals";
import type { ComponentChildren, TargetedEvent } from "preact";
import type { SettingsT } from "@/types";

type PropsT = {
  id: keyof SettingsT;
  checked: boolean;
  onChange: (e: TargetedEvent<HTMLInputElement>) => void;
  children?: ComponentChildren;
};

const OptionEl = (props: PropsT) => {
  const { id, checked, onChange, children } = props;
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const childState = useSignal<boolean>(checked);

  effect(() => {
    if (checked) {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      childState.value = true;
    } else {
      hideTimeoutRef.current = setTimeout(() => {
        childState.value = false;
      }, 130);
    }

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  });

  return (
    <div>
      <label
        className={
          "flex cursor-pointer items-center whitespace-nowrap transition-colors hover:text-stone-100"
        }
        htmlFor={id}
      >
        <input
          className={"mr-3 cursor-pointer"}
          type={"checkbox"}
          aria-label={`Toggle "${i18n.t(`settings.${id}`)}"`}
          checked={checked}
          id={id}
          onChange={onChange}
        />
        {i18n.t(`settings.${id}`)}
      </label>
      <div
        className={`grid transition-[grid-template-rows,opacity] ${checked ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-10"}`}
      >
        {children && childState.value && (
          <div className="overflow-hidden p-px">{children}</div>
        )}
      </div>
    </div>
  );
};

export default OptionEl;
