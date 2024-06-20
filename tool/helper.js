import { forwardRef } from "react";

export const addClassName = (Component, className) => {
  const styledComponent = forwardRef(function styledComponent(props, ref) {
    const newClassName = props.className
      ? `${className} ${props.className}`
      : className;
    return <Component ref={ref} {...props} className={newClassName} />;
  });

  return styledComponent;
};

export const getFileUrl = (event) => {
  const [file] = event.target.files;
  return file && URL.createObjectURL(file);
};

export const checkExpires = (time) =>
  time ? time * 1000 < Date.now() : console.log("Invalid exp.");

export const transImageUrl = (path) =>
  `${process.env.NEXT_PUBLIC_BACKENDURL}/${path.replace(/\\/g, "/")}`;

export const onlyInputNumbers = (event) => {
  if (
    /^\d$/.test(event.key) ||
    event.key === "Backspace" ||
    event.key === "Delete" ||
    event.key === "Escape" ||
    event.key === "Tab" ||
    event.key === "ArrowLeft" ||
    event.key === "ArrowRight" ||
    event.key === "Home" ||
    event.key === "End" ||
    (event.ctrlKey && ["a", "x", "c", "v"].includes(event.key))
  )
    return;
  event.preventDefault();
};

export const loopObject = (obj, callback) =>
  Object.entries(obj).reduce(
    (dict, [key, value]) => ({
      ...dict,
      [key]: callback(value),
    }),
    {}
  );

export const checkArray = (arr) => Array.isArray(arr) && arr.length > 0;

export const toArray = (target) => (Array.isArray(target) ? target : [target]);
