import React, { memo, forwardRef } from "react";
import classNames from "classnames";
import { inputStyle, negButtonStyle } from "Components/MLML/MLComponents/componentStyle";

function Radio({ options, optionText, group, selected, disabledTarget, handleChange, handleDelete, afterRefresh, className }, ref) {
  return (
    <div ref={ref} className={classNames(className)}>
      {options &&
        options.map((option, index) => {
          return (
            <div key={option + "/" + index} className="flex flex-row justify-between space-x-2">
              <label className="flex flex-row items-center gap-2">
                <input type="radio" name={group} value={option} onChange={handleChange} disabled={option === disabledTarget ? true : false} />
                {optionText ? optionText[index] : option}
              </label>
              <button type="button" onClick={handleDelete} value={option} className={classNames(option === disabledTarget ? "hidden" : "", negButtonStyle)}>
                삭제
              </button>
            </div>
          );
        })}
    </div>
  );
}

export default forwardRef(Radio);
