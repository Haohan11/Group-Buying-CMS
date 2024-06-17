import Image from "next/image";
import React from "react";
import { addClassName } from "@/tool/helper";

const Logo = ({ width, height, ...props }) => {
  return (
    <div
      {...props}
      style={{
        width: width ? `${width}px` : "150px",
        height: height ? `${height}px` : "auto",
        aspectRatio: "3.114",
        ...props.style,
      }}
    >
      <Image
        alt="logo"
        priority
        className="object-fit-contain"
        style={{ left: "-5%" }}
        fill
        sizes="50vw"
        src="/logo.png"
      />
    </div>
  );
};

export default addClassName(Logo, "position-relative");
