import "./OptionCheck.scss";
import React, { ReactNode, useState } from "react";

type defaultValT = boolean | string;

type prop = {
  id: string;
  defaultVal: defaultValT;
  label: string;
  type: "checkbox" | "number";
  action: (v: string, value: defaultValT) => void;
};

const OptionCheck = function (props: prop) {
  const { id, defaultVal, label, type, action } = props;
  const [check, setCheck] = useState<boolean | string>(defaultVal);
  // const [inputVal, setInputVal] = useState<string>("");
  let inputBox: ReactNode;

  const handleClick = function () {
    setCheck((prev) => !prev);
    action(id, check);
  };

  if (type === "checkbox") {
    inputBox = <input type={type} checked={check!} onChange={() => {}} />;
  }

  return (
    <div className="option-check" onClick={handleClick}>
      {inputBox}
      <span>{label}</span>
    </div>
  );
};

export default OptionCheck;
