import { getInput } from "./input";

import { hoistFormik, hoistPreLoadData } from "../globalVariable";

const SaleMember = (props) =>
  getInput("select")({
    ...props,
    onChange: (item) => {
      hoistFormik.get().setFieldValue(props.name, item.value);
      const memberData = hoistPreLoadData
        .get()
        [props.name].find((member) => `${member.id}` === item.value);

      const data = {
        ...hoistFormik.get().values,
        [props.name]: item.value,
        member_code: memberData.code,
        payment: memberData.payment,
      };

      hoistFormik.get().setValues(data);
    },
  });

export default SaleMember;
