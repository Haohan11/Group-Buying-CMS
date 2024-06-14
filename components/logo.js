import Image from "next/image";
import React from "react";
import addClassName from "@/tool/addClassName";

const Logo = ({ width, height, ...props }) => {
  return (
    <div
      style={{
        width: width ? `${width}px` : "150px",
        height: height ? `${height}px` : "auto",
        aspectRatio: "3.114",
      }}
      {...props}
    >
      <Image alt="logo" className="object-fit-contain" style={{left: "-6%"}} fill src="/logo.png" />
    </div>
  );
};

export default addClassName(Logo, "position-relative");
