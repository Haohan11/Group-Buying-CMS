import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";

import ModalWrapper from "@/components/modalWrapper";
import PopUp from "@/components/popUp";

import { useModals } from "@/tool/hooks";
import { useDebounce } from "@/_metronic/helpers";

import { regularReadData } from "@/data-list/core/request";
import { getInput } from "./input";
import { hoistFormik, hoistPreLoadData } from "../globalVariable";

const Select = getInput("select");

const getMemberUrl = (keyword) =>
  `member-management?enable=&size=5${keyword ? `&keyword=${keyword}` : ""}`;

const optionAdaptor = (list, option = { labelKey: "name", valueKey: "id" }) =>
  list.map((item) => ({
    ...item,
    label: item[option.labelKey],
    value: `${item[option.valueKey]}`,
  }));

const memberCache = new Map();

const SaleMember = (props) => {
  const { data, status } = useSession();
  const token = data?.user?.accessToken;

  const { handleShowModal, handleCloseModal, isModalOpen } = useModals();
  const [popupSet, setPopupSet] = useState({ message: "", icon: "" });

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 200);

  const [memberOption, setMemberOption] = useState([]);

  useEffect(() => {
    if (!token) return;
    const url = getMemberUrl(debouncedKeyword);

    (async () => {
      if (memberCache.has(url))
        return setMemberOption(memberCache.get(url));

      const res = await regularReadData(token, url);
      if (!res || !Array.isArray(res.data))
        return console.warn("Fail to fetch member data.");

      const options = optionAdaptor(res.data);

      setMemberOption(options);
      memberCache.set(url, options);

      !hoistFormik.get().values[props.name] &&
        hoistFormik.get().setValues({
          ...hoistFormik.get().values,
          member_name: options[0].name,
          [props.name]: options[0].value,
          member_code: options[0].code,
          payment: options[0].payment,
        });
    })();
  }, [token, debouncedKeyword]);

  useEffect(() => memberCache.clear.bind(memberCache), []);

  return (
    <>
      <Select
        {...props}
        options={memberOption}
        value={
          hoistFormik.get().values[props.name]
            ? {
                label: hoistFormik.get().values.member_name,
                value: hoistFormik.get().values[props.name],
              }
            : null
        }
        isDisabled={hoistFormik.get().values?._separate}
        onInputChange={setKeyword}
        onChange={(item) => {
          if (item.id === hoistFormik.get().values[props.name]) return;
          setPopupSet({
            message: "變更會員將清空收件人資料",
            icon: "/icon/warning.svg",
            denyText: "取消",
            denyOnClick: () => {
              handleCloseModal("popup");
            },
            confirmOnClick: () => {
              const data = {
                ...hoistFormik.get().values,
                member_name: item.name,
                [props.name]: item.value,
                member_code: item.code,
                payment: item.payment,
                person_list: [
                  {
                    id: "_",
                    main_reciever: true,
                  },
                ],
              };

              hoistFormik.get().setValues(data);
              handleCloseModal("popup");
            },
          });
          handleShowModal("popup");
        }}
      />
      <ModalWrapper key="popup" show={isModalOpen("popup")} size="lg">
        <PopUp
          imageSrc={popupSet.icon}
          title={popupSet.message}
          denyOnClick={popupSet.denyOnClick}
          confirmOnClick={popupSet.confirmOnClick}
          denyText={popupSet.denyText}
        />
      </ModalWrapper>
    </>
  );
};
export default SaleMember;
