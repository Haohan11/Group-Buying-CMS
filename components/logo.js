import Image from "next/image";
import React from "react";
import addClassName from "@/tool/addClassName";

const Logo = ({ width, height, ...props }) => {
  return (
    <div
      style={{ width: width ? `${width}px` : "150px", height: height ? `${height}px` : width ? `${width}px` : "150px" }}
      {...props}
    >
      <Image
        alt="logo"
        className="object-fit-contain"
        fill
        src="/logo.svg"
      />
    </div>
  );
};

export default addClassName(Logo, "position-relative");
