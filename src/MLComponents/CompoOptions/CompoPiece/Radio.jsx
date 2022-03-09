import React, { memo, forwardRef } from "react";
import classNames from "classnames";
import { inputStyle } from "MLComponents/componentStyle";

function Radio({ options, optionText, group, currentProj, handleChange, className }, ref) {
  console.log(options);
  return (
    <div ref={ref} className={classNames(className)}>
      {options &&
        options.map((option, index) => {
          return (
            <label key={option + index}>
              <input type="radio" name={group} value={option} onChange={handleChange} disabled={option === currentProj && true} />
              {optionText ? optionText[index] : option}
            </label>
          );
        })}
    </div>
  );
}

export default memo(forwardRef(Radio));
