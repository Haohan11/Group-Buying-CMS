import React from "react";
import { Row, Col as BSCol, Container } from "react-bootstrap";
import addClassName from "@/tool/addClassName";

import VersionCode from "./VersionCode";

const Col = addClassName(BSCol, "p-0");

const LoginPageLayout = ({ content }) => {

  return (
    <>
    <Row className="g-0">
      <Col>
        <div className="vh-100 px-4 px-lg-6 flex-column">
          <div className="flex-center text-textgrey" style={{ height: "10vh" }}>
          </div>
          <div className="overflow-y-auto scroll" style={{ height: "80vh" }}>
            {content}
          </div>
          <div className="flex-center" style={{ height: "10vh" }}>
            <p className="" style={{color: "grey"}}>Copyright © 2024 XiangYu Drapery. All rights reserved.</p>
          </div>
        </div>
      </Col>
    </Row>
    <VersionCode />
    </>
  );
};

export default LoginPageLayout;