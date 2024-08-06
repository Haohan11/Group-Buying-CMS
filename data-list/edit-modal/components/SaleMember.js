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
        isDisabled: hoistFormik.get().values?._separate,
        // onChange: (item) => {
        //   setPopupSet({
        //     message: "test",
        //     icon: "/icon/warning.svg",
        //     denyOnClick: () => handleCloseModal("popup"),
        //     confirmOnClick: () => {
        //       const memberData = hoistPreLoadData
        //         .get()
        //         [props.name].find((member) => `${member.id}` === item.value);

        //       const data = {
        //         ...hoistFormik.get().values,
        //         [props.name]: item.value,
        //         member_code: memberData.code,
        //         payment: memberData.payment,
        //         person_list: [
        //           {
        //             id: "_",
        //             main_reciever: true,
        //           },
        //         ],
        //       };

        //       hoistFormik.get().setValues(data);
        //       handleCloseModal("popup");
        //     },
        //   });
        //   handleShowModal("popup");
        // },
      })}
      <ModalWrapper key="popup" show={isModalOpen("popup")} size="lg">
        <PopUp
          imageSrc={popupSet.icon}
          title={popupSet.message}
          denyOnClick={popupSet.denyOnClick}
          confirmOnClick={popupSet.confirmOnClick}
        />
      </ModalWrapper>
    </>
  );
};
export default SaleMember;
