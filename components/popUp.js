import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import Image from "next/image";

const PopUp = ({
  imageSrc,
  imageColor,
  title,
  titleClass,
  describe = "",
  describeClass,
  denyOnClick,
  confirmOnClick,
}) => {
  return (
    <>
      <div className="mb-5 flex-center flex-column">
        {imageSrc && (
          <Image
            src={imageSrc}
            width="70"
            height="70"
            className={`mb-4`}
            alt="icon"
          />
        )}
        <p className={`mb-4 fs-1 fw-bolder ${titleClass}`}>{title}</p>
        <h6 className={`mb-4 ${describeClass}`}>{describe}</h6>
      </div>
      <Row className="flex-center gap-4 flex-wrap">
        {denyOnClick && (
          <Col xs={4}>
            <button
              className="btn btn-danger fs-5 w-100 text-white"
              onClick={denyOnClick}
            >
              返回
            </button>
          </Col>
        )}
        <Col xs={4}>
          <Button
            className="btn btn-primary fs-5 w-100"
            onClick={confirmOnClick}
          >
            確認
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default PopUp;
