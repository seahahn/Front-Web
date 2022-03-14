import React, { memo, forwardRef } from "react";
import classNames from "classnames";
import { inputStyle } from "MLML/MLComponents/componentStyle";

function Select({ options, optionText, name, value, id, text: labelText, onChange, defaultValue, className, multiple = false, disabled = false }, ref) {
  return (
    <div className={classNames(className)}>
      <label>
        {labelText}
        <select
          id={id}
          ref={ref}
          name={name}
          value={value}
          className={inputStyle}
          onChange={onChange}
          defaultValue={defaultValue}
          multiple={multiple}
          disabled={disabled}>
          {options.map((option, index) => {
            return (
              <option
                key={option + "/" + index}
                value={option === "처음" || option === "끝" ? "" : option}
                // selected={defaultValue && defaultValue === option ? true : false}
              >
                {optionText ? optionText[index] : option}
              </option>
            );
          })}
        </select>
      </label>
    </div>
  );
}

export default memo(forwardRef(Select));
