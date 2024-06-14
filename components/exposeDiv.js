import { forwardRef } from "react";

const Div = forwardRef(function Div(props, ref) {
  return <div ref={ref} {...props}></div>;
});

export default Div;
