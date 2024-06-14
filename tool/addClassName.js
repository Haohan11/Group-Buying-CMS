import { forwardRef } from "react";

const addClassName = (Component, className) => {
  const styledComponent = forwardRef(function styledComponent(props, ref) {
    const newClassName = props.className ? `${className} ${props.className}` : className
    return (
      <Component ref={ref} {...props} className={newClassName} />
    );
  });

  return styledComponent;
};

export default addClassName;
