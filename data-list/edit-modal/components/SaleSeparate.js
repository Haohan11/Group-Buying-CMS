import { Button } from "./input";
import { hoistFormik } from "../globalVariable";
import { checkArray } from "@/tool/helper";

const toggleSeparate = (formik) => {
  const prevStatus = formik.status?.separate;
  formik.setStatus({ ...formik.status, separate: !prevStatus });
};

const mergePerson = (formik, target) => {
  const personList = formik?.values?.[target];
  if (!checkArray(personList)) return;

  const mode = "filter";

  const modeDict = {
    merge: [
      personList.reduce((result, person) => ({
        ...result,
        ...(person.main_reciever && person),
        stockList: result.stockList.map((stock, index) => ({
          ...stock,
          ...(person.main_reciever && { price: stock.price }),
          qty:
            (Number(stock.qty) || 0) +
            (Number(person.stockList?.[index]?.qty) || 0),
        })),
      })),
    ],
    filter: [
      personList.find((person) => person.main_reciever) || personList[0],
    ],
  };

  formik.setFieldValue(target, modeDict[mode]);
};

const SaleSeparate = ({ target, ...props }) => {
  if (!hoistFormik.get() || !target)
    return <>{console.warn("`SaleSeparate`: Missing formik or target.")}</>;

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

        toggleSeparate(formik);
        isSeparate && mergePerson(formik, target);
      }}
    />
  );
};

export default SaleSeparate;
