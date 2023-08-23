import "./Option.scss";
import React, { ReactNode, useState } from "react";

type prop = {
  id: string;
  defaultVal: boolean | string;
  label: string;
  type: "checkbox" | "number";
  action: (v: string) => void;
};

const Option = function (props: prop) {
  const { id, defaultVal, label, type, action } = props;
  const [check, setCheck] = useState<boolean | string>(defaultVal);
  const [inputVal, setInputVal] = useState<string>("");
  let inputBox: ReactNode;

  const handleClick = function () {
    setCheck((prev) => !prev);
    action(id);
  };

  if (type === "checkbox") {
    inputBox = <input type={type} checked={check!} onChange={handleClick} />;
  }

  return (
    <div className="option" onClick={handleClick}>
      {inputBox}
      <span>{label}</span>
    </div>
  );
};

export default Option;
