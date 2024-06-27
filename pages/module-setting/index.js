import { Container, Row, Col } from "react-bootstrap";
import { getSession } from "next-auth/react";
// import { getAllTables } from "@/data-list/core/request";
import Select from "react-select";

const ModuleSettingPage = ({ list }) => {
  return (
    <Container className="flex-center flex-column flex-grow-1 p-10">
      <div className="w-100 shadow rounded-3 p-10" style={{ minHeight: "50vh" }}>
        <div className="d-flex justify-content-between">
          <span className="fs-1 fw-bold">模組設定</span>
          <button className="btn btn-primary">新增模組</button>
        </div>
      </div>
      {/* <Row className="w-100 border">
        <Col>
        </Col>
      </Row>
      <Row className="w-100 border">
        <Col>
          <Select
            classNamePrefix="react-select"
            className={"react-select-styled react-select-solid"}
            options={list.map((item) => ({ value: item, label: item }))}
          ></Select>
        </Col>
      </Row> */}
    </Container>
  );
};

// export const getServerSideProps = async (context) => {
//   const session = await getSession(context);
//   const accessToken = session?.user?.accessToken;

//   try {
//     const list = await getAllTables(accessToken);

//     return { props: { list } };
//   } catch (error) {
//     console.log(error);
//     return { props: { list: [] } };
//   }
// };

export default ModuleSettingPage;
