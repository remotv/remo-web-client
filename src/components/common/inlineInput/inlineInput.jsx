import React from "react";
import "./inlineInput.scss";

const InlineInput = React.forwardRef((props, ref) => {
  const { name, label, error, type, passError, labelStyle, ...rest } = props;
  const style = labelStyle || "inlineInput__label";
  return (
    <React.Fragment>
      <label className={style} htmlFor={name}>
        {label}
      </label>
      <input
        {...rest}
        ref={ref}
        type={type}
        name={name}
        className="inlineInput__control"
      />
      {error && passError ? passError(error) : <React.Fragment />}
    </React.Fragment>
  );
});

export default InlineInput;
