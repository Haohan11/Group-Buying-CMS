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

import { useModals } from "@/tool/hooks";
import useLocalStorage from "../tool/useLocalStorage";

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
    const result = await signIn("XiangYu-Backend", {
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
    <Row className="g-0">
      <Col className="d-none d-lg-block">
        <div className="position-relative vh-100 overflow-hidden">
          <Image
            alt="login cover image"
            src={"/image/curtain.jpg"}
            sizes="50vw"
            placeholder="blur"
            blurDataURL={"/image/curtain.jpg"}
            fill
            className="object-fit-cover"
          />
          <div className="position-absolute w-100 bottom-0 text-white p-5">
            <Container className="p-xl-12 p-6">
              <h1 className=" text-white" style={{ fontSize: "100px" }}>
                Welcome Back
              </h1>
              <p>
                Vitae enim labore vitae, beatae quos vitae quos sequi
                reiciendis, in quas, hic labore eos asperiores, a, cum numquam.
                Quaerat nemo asperiores aut rerum repellat enim esse qui quae,
                asperiores, et dok.
              </p>
              <p
                className="fw-bold letter-spacing-5"
                style={{ fontSize: "80px", lineHeight: "85px" }}
              >
                <span className="ms--1" style={{ color: "#ff4d00" }}>
                  ．
                </span>
                ．．．
              </p>
            </Container>
          </div>
        </div>
      </Col>
      <Col>
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
              <Logo className={"mb-3"} width={150} />
              <h1 className="fw-bold fs-2 my-5 text-darkblue">管理登入</h1>
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
            <p style={{ color: "grey" }}>
              Copyright © 2024 XiangYu Drapery. All rights reserved
            </p>
          </div>
          <div className="position-fixed py-2 px-3 bottom-0 end-0 fs-6-xs" style={{color: "grey"}}>
            <VersionCode />
          </div>
        </div>
      </Col>
    </Row>
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
