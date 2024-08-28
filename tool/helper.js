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

export const checkPhone = (phone) => /^(?!09)\d{8,10}$|^09\d{8}$/.test(phone);

export const checkExpires = (time) =>
  time ? time * 1000 < Date.now() : console.log("Invalid exp.");

export const transImageUrl = (path) =>
  path && path?.replace
    ? `${process.env.NEXT_PUBLIC_BACKENDURL}${path.replace(/\\/g, "/")}`
    : "";

export const replaceBackendUrl = (path, replacement) =>
  path && path?.replace
    ? path.replaceAll(process.env.NEXT_PUBLIC_BACKENDURL, replacement)
    : "";

export const onlyInputNumbers = (event) => {
  if (
    /^\d$/.test(event.key) ||
    [
      "Backspace",
      "Delete",
      "Escape",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
    ].includes(event.key) ||
    ((event.ctrlKey || event.metaKey) &&
      ["a", "x", "c", "v"].includes(event.key))
  )
    return;

  event.preventDefault();
};

export const checkArray = (arr) => Array.isArray(arr) && arr.length > 0;

export const toArray = (target) => (Array.isArray(target) ? target : [target]);

export const getCurrentTime = () => {
  const date = new Date();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hour = `${date.getHours()}`.padStart(2, "0");
  const minute = `${date.getMinutes()}`.padStart(2, "0");
  const second = `${date.getSeconds()}`.padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}:${second}`;
};
