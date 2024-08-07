import { useState } from "react";

import ModalWrapper from "@/components/modalWrapper";
import PopUp from "@/components/popUp";

import { useModals } from "@/tool/hooks";

import { getInput } from "./input";
import { hoistFormik, hoistPreLoadData } from "../globalVariable";

const SaleMember = (props) => {
  const { handleShowModal, handleCloseModal, isModalOpen } = useModals();
  const [popupSet, setPopupSet] = useState({ message: "", icon: "" });

  return (
    <>
      {getInput("select")({
        ...props,
        value: (() => {
          if (!hoistPreLoadData.get()?.[props.name]) return null;
          const member = hoistPreLoadData.get()[props.name]?.[0];
          const memberId = hoistFormik.get().values?.[props.name];
          return hoistPreLoadData
            .get()
            [props.name].find(
              (option) => option.value === (memberId ? memberId : member?.id)
            );
        })(),
        isDisabled: hoistFormik.get().values?._separate,
        onChange: (item) => {
          if (item.id === hoistFormik.get().values[props.name]) return;
          setPopupSet({
            message: "變更會員將清空收件人資料",
            icon: "/icon/warning.svg",
            denyText: "取消",
            denyOnClick: () => {
              hoistFormik.get().setValues(hoistFormik.get().values);
              handleCloseModal("popup");
            },
            confirmOnClick: () => {
              const memberData = hoistPreLoadData
                .get()
                [props.name].find((member) => `${member.id}` === item.value);

              const data = {
                ...hoistFormik.get().values,
                [props.name]: item.value,
                member_code: memberData.code,
                payment: memberData.payment,
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
        },
      })}
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
