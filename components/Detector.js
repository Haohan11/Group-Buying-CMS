import React, { useEffect, Fragment } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

import { checkExpires } from "@/tool/hooks";
import ModalWrapper from "@/components/modalWrapper";
import PopUp from "@/components/popUp";
import { useModals } from "@/tool/hooks";

const Detector = ({ children }) => {
  const session = useSession();
  const { route } = useRouter();

  const { handleShowModal, handleCloseModal, isModalOpen } = useModals();

  useEffect(() => {
    console.log(session);
    let timeId;
    if (
      session.status === "authenticated" &&
      !checkExpires(session?.data?._exp)
    ) {
      //登入完 開始倒數過期時間
      const limitTime = session?.data?._exp * 1000 - Date.now();
      timeId = setTimeout(() => {
        handleShowModal("popup");
      }, limitTime);
    } else {
      //隨時檢測是否過期
      const checkTime = session?.data?._exp * 1000 - Date.now();
      if ((session.status === "unauthenticated" && route !== "/login") || checkTime < 0) {
        handleShowModal("popup");
      }
      clearTimeout(timeId);
    }
    return () => {
      clearTimeout(timeId);
    };
  }, [session.status]);

  return (
    <Fragment>
      {children}

      <ModalWrapper
        key="popup"
        show={isModalOpen("popup")}
        size="lg"
        onHide={() => signOut({ callbackUrl: "/login" })}
      >
        <PopUp
          imageSrc={"/icon/circle-error.svg"}
          title={"登入已逾時，請重新登入"}
          confirmOnClick={() => signOut({ callbackUrl: "/login" })}
        />
      </ModalWrapper>
    </Fragment>
  );
};

export default Detector;
