import React from "react";

function Switch({ name, id, text: labelText, onChange, checked, title }, ref) {
  return (
    <div className="form-check form-switch pl-0">
      <label className="form-check-label inline-block text-gray-800" htmlFor={id} title={title}>
        {labelText}
        <input
          name={name}
          className="form-check-input appearance-none w-9 ml-2 rounded-full float-right h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm"
          type="checkbox"
          role="switch"
          id={id}
          onChange={onChange}
          checked={checked}
          ref={ref}
        />
      </label>
    </div>
  );
}

export default React.forwardRef(Switch);
