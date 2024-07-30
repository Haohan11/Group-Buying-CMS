import { Button } from "./input";
import { hoistFormik } from "../globalVariable";

const SaleSeparate = ({ target, ...props }) => {
  if(!hoistFormik.get()) return <></>;

  const isSeparate = hoistFormik.get().status?.separate;
  const hasStock = !!hoistFormik.get().values?.[target]?.[0]?.stockList?.length;

  return (
    <Button
      {...props}
      text={`${isSeparate ? "取消" : ""}拆單`}
      disabled={!hasStock}
      onClick={() => {
        const formik = hoistFormik.get();
        if (!formik) return;

        const prevStatus = formik.status?.separate;
        formik.setStatus({ separate: !prevStatus });
      }}
    />
  );
};

export default SaleSeparate;
