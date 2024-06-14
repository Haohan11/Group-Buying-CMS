import { useState } from "react";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { Row, Col } from "react-bootstrap";

import { transImageUrl } from "../../tool/transImageUrl";
import currentTable from "@/data-list/globalVariable/currentTable";

import { getSession } from "next-auth/react";

import { getDataByTable } from "@/data-list/core/request";
import ModalWrapper from "@/components/modalWrapper";
import PopUp from "@/components/popUp";
import { useModals, usePermission } from "@/tool/hooks";

function isJson(str) {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}

const EnvModal = dynamic(
  async () => {
    const { EnvModal } = await import("../../components/envModal");
    return EnvModal;
  },
  { ssr: false }
);

const EnvironmentPage = ({ list }) => {
  currentTable.set("environment");
  const { handleShowModal, handleCloseModal, isModalOpen } = useModals();

  const emptyList = list.length === 0;

  const router = useRouter();
  const permission = usePermission();
  const { mode } = router.query;
  const currentMode = ["create", "edit"].includes(mode) ? mode : "none";

  const goCreateMode = () => {
    setEditEnvId(undefined);
    router.push("?mode=create");
  };
  const goEditMode = (id) => {
    setEditEnvId(id);
    router.push("?mode=edit");
  };

  const [editEnvId, setEditEnvId] = useState();
  const editEnvData = list.find((item) => item.id === editEnvId);

  return (
    <>
      <Row className="m-0 h-100">
        <Col sm={3} className="h-100">
          <div className="h-100 d-flex flex-column position-relative">
            <h1 className="my-5 fs-1 text-center text-primary">場景列表</h1>
            <div className="separator border-3"></div>
            <div className="mt-5 mh-750px overflow-y-scroll px-2">
              {!emptyList ? (
                list.map((item) => (
                  <div
                    key={item.id}
                    className="mb-5 cursor-pointer"
                    onClick={() => goEditMode(item.id)}
                  >
                    <div
                      className="position-relative w-100 rounded-2 border border-1 overflow-hidden"
                      style={{ aspectRatio: "16 / 9" }}
                    >
                      <Image
                        fill
                        sizes="200px"
                        alt="env image"
                        className="object-fit-cover"
                        src={item.env_image}
                      />
                    </div>
                    <div className="fs-3 fw-bold text-primary text-center py-2">
                      {item.name}
                    </div>
                    <div className="separator border-3"></div>
                  </div>
                ))
              ) : (
                <div className="text-center fs-4">目前沒有資料</div>
              )}
            </div>
            {permission?.environment?.modify && (
              <div
                className="position-absolute w-100 p-3 fs-3 fw-bold left-0 bottom-0 text-center bg-primary text-white cursor-pointer"
                onClick={
                  editEnvId !== undefined
                    ? () => handleShowModal("reset")
                    : goCreateMode
                }
              >
                <span className="px-2 fs-1 border border-white border-2 me-2">
                  +
                </span>
                新增場景
              </div>
            )}
          </div>
        </Col>
        <Col>
          <EnvModal
            key={`${currentMode}_${editEnvId}`}
            {...{
              currentMode,
              ...(currentMode === "edit" ? { oriValue: editEnvData } : {}),
            }}
          />
        </Col>
      </Row>
      {/*是否重製*/}
      <ModalWrapper
        key="reset"
        show={isModalOpen("reset")}
        size="lg"
        onHide={() => {
          handleCloseModal("reset");
        }}
      >
        <PopUp
          imageSrc={"/icon/warning.svg"}
          title={"編輯尚未完成，是否要重製?"}
          denyOnClick={() => {
            handleCloseModal("reset");
          }}
          confirmOnClick={() => {
            goCreateMode();
            handleCloseModal("reset");
            setEditEnvId(undefined);
          }}
        />
      </ModalWrapper>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  const accessToken = session?.user?.accessToken;

  try {
    const res = await getDataByTable(accessToken, "environment");
    const { data } = res;

    const list = data.map((item) => ({
      ...item,
      env_image: transImageUrl(item.env_image),
      cropline: isJson(item.cropline) ? JSON.parse(item.cropline) : [],
      perspect: isJson(item.perspect) ? JSON.parse(item.perspect) : [],
    }));

    return { props: { list } };
  } catch (error) {
    console.log(error);
    return { props: { list: [] } };
  }
};

export default EnvironmentPage;
