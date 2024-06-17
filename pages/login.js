import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  Row,
  Col,
  Container,
  Form,
  FormGroup,
  FormCheck,
  Button,
} from "react-bootstrap";
import { signIn, useSession, getSession } from "next-auth/react";
import ModalWrapper from "@/components/modalWrapper";
import PopUp from "@/components/popUp";
import Logo from "@/components/logo";

import VersionCode from "@/components/VersionCode";

import { useModals, useLocalStorage } from "@/tool/hooks";

const LoginLayout = () => {
  const router = useRouter();
  const session = useSession();
  const { handleShowModal, handleCloseModal, isModalOpen } = useModals();

  const [rememberMe, setRememberMe, clearRememberMe] =
    useLocalStorage("rememberMe");

  const login = async () => {
    const form = document.getElementById("loginForm");
    const formData = new FormData(form);

    const data = Object.fromEntries(formData);
    data.rememberMe ? setRememberMe(data.account) : clearRememberMe();
    console.log("login data: ");
    console.log(data);
    const result = await signIn("YouCanBuy-Backend", {
      ...data,
      redirect: false,
    });
    console.log("result :", result);
    if (result?.error === "NoPermission")
      return handleShowModal("NoPermission");

    if (result?.ok) return handleShowModal("success");

    form.reset();
    handleShowModal("wrong");
  };

  useEffect(() => {
    if (!session || !session.data?.user?.permission)
      return () => {
        localStorage.removeItem("permission");
      };

    localStorage.setItem(
      "permission",
      JSON.stringify(session.data.user.permission)
    );
  }, [session]);

  return (
    <div className="vh-100 px-4 px-lg-6 flex-column">
      <div
        className="flex-center text-textgrey"
        style={{ height: "8vh" }}
      ></div>
      <div className="overflow-y-auto scroll" style={{ height: "84vh" }}>
        <Form
          className="h-100 flex-center flex-column text-textgrey pb-10"
          id="loginForm"
        >
          <Logo className={"mb-5"} width={250} />
          <h1 className="fw-bold fs-2 my-6 text-darkblue">管理登入</h1>
          <div style={{ width: "clamp(275px, 60% ,350px)" }}>
            <FormGroup className="mb-3">
              <label className="form-label">帳號</label>
              <input
                type="text"
                className="form-control"
                defaultValue={rememberMe}
                placeholder=""
                name="account"
              />
            </FormGroup>
            <FormGroup className="mb-10">
              <label className="form-label">密碼</label>
              <input
                type="password"
                className="form-control"
                placeholder=""
                name="password"
              />
            </FormGroup>
            <FormCheck
              id="rememberMe"
              name="rememberMe"
              label="記住我"
              defaultValue={!!rememberMe}
              className="text-black mb-10"
            ></FormCheck>
            <Button
              variant="primary"
              type="button"
              className="w-100"
              onClick={login}
            >
              登入
            </Button>
          </div>
          {/*帳密錯誤*/}
          <ModalWrapper
            key="wrong"
            show={isModalOpen("wrong")}
            size="lg"
            onHide={() => {
              handleCloseModal("wrong");
            }}
          >
            <PopUp
              imageSrc={"/icon/circle-error.svg"}
              title={"帳號或密碼錯誤"}
              confirmOnClick={() => {
                handleCloseModal("wrong");
              }}
            />
          </ModalWrapper>
          <ModalWrapper
            key="NoPermission"
            show={isModalOpen("NoPermission")}
            size="lg"
            onHide={() => {
              handleCloseModal("NoPermission");
            }}
          >
            <PopUp
              imageSrc={"/icon/circle-error.svg"}
              title={"權限不足"}
              confirmOnClick={() => {
                handleCloseModal("NoPermission");
              }}
            />
          </ModalWrapper>

          {/*登入成功*/}
          <ModalWrapper
            key="success"
            show={isModalOpen("success")}
            size="lg"
            onHide={() => {
              router.push("/");
            }}
          >
            <PopUp
              imageSrc={"/icon/check-circle.svg"}
              title={"登入成功"}
              confirmOnClick={() => {
                router.push("/");
              }}
            />
          </ModalWrapper>
        </Form>
      </div>
      <div className="flex-center" style={{ height: "8vh" }}>
        <p style={{ color: "grey", letterSpacing: "1px" }}>
          Copyright © 2024 YouCanBuy. All rights reserved
        </p>
      </div>
      <div
        className="position-fixed py-2 px-3 bottom-0 end-0 fs-6-xs"
        style={{ color: "grey" }}
      >
        <VersionCode />
      </div>
    </div>
  );
};

LoginLayout.getLayout = (page) => page;

export default LoginLayout;

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  console.log("login session: " + session);
  if (session) {
    return {
      redirect: { destination: "/" },
    };
  }

  return {
    props: {},
  };
};
