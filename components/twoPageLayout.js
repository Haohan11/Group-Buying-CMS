import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Row, Col as BSCol, Container } from "react-bootstrap";
import addClassName from "@/tool/addClassName";
import ReturnButton from "./returnButton";
import copyrightText from "@/data/copyrightText";

const Col = addClassName(BSCol, "p-0");

const TwoPageLayout = ({ data, content, goBack }) => {
  const headContent = () => {
    const destination = data.returnTo;
    if (!destination) return;

    if (destination === "login")
      return (
        <ReturnButton
          className="me-auto"
          text={data.returnText}
          action={goBack}
        />
      );

    if (destination === "homepage")
      return (
        <ReturnButton className="me-auto" href={"/"} text={data.returnText} />
      );
  };

  return (
    <Row className="g-0">
      <Col className="d-none d-lg-block">
        <div className="position-relative vh-100 overflow-hidden">
          <Image
            alt="login cover image"
            src={data?.cover_image}
            sizes="50vw"
            placeholder="blur"
            blurDataURL={data?.cover_image}
            fill
            className="object-fit-cover"
          />
          <div className="position-absolute w-100 bottom-0 text-white p-5">
            <Container className="p-xl-12 p-6">
              <h1 className="fw-bold" style={{ fontSize: "100px" }}>
                {data?.cover_title}
              </h1>
              <p>
                Vitae enim labore vitae, beatae quos vitae quos sequi
                reiciendis, in quas, hic labore eos asperiores, a, cum numquam.
                Quaerat nemo asperiores aut rerum repellat enim esse qui quae,
                asperiores, et dok.
              </p>
              <p
                className="fw-bold letter-spacing-5"
                style={{ fontSize: "80px", lineHeight: "50px" }}
              >
                <span className="text-orange ms--1">.</span> . . .
              </p>
            </Container>
          </div>
        </div>
      </Col>
      <Col>
        <div className="vh-100 px-4 px-lg-6 flex-column">
          <div className="flex-center text-textgrey" style={{ height: "10vh" }}>
            {headContent()}
          </div>
          <div className="overflow-y-auto scroll" style={{ height: "80vh" }}>
            {content}
          </div>
          <div className="flex-center" style={{ height: "10vh" }}>
            <p className="text-textgrey">{copyrightText}</p>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default TwoPageLayout;
