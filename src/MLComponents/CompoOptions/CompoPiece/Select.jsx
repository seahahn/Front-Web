import React from "react";
import classNames from "classnames";
import { inputStyle } from "MLComponents/componentStyle";

function Select({ options, optionText, id, text: labelText, onChange, defaultValue, className, multiple = false }, ref) {
  return (
    <div className={classNames(className)}>
      <label className="self-center">{labelText}</label>
      <select id={id} ref={ref} className={inputStyle} onChange={onChange} defaultValue={defaultValue} multiple={multiple}>
        {options.map((option, index) => {
          return (
            <option
              key={option + index}
              value={option === "처음" || option === "끝" ? "" : option}
              // selected={defaultValue && defaultValue === option ? true : false}
            >
              {optionText ? optionText[index] : option}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default React.forwardRef(Select);
