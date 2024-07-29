import { Button } from "./input";
import { hoistFormik } from "../globalVariable";

const SaleSeparate = (props) => {
  return (
    <Button
      {...props}
      text="拆單"
      onClick={() => {
        hoistFormik.get().setStatus({ separate: true });
      }}
    />
  );
};

export default SaleSeparate;
