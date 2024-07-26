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
  path && path?.replace
    ? `${process.env.NEXT_PUBLIC_BACKENDURL}${path.replace(/\\/g, "/")}`
    : "";

export const onlyInputNumbers = (event) => {
  if (["ArrowUp", "ArrowDown"].includes(event.key)) {
    event.preventDefault();

    ({
      ArrowUp: () => event.target.value++,
      ArrowDown: () => event.target.value = Math.max(--event.target.value, 0),
    })[event.key]();

    return;
  }

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
    (event.ctrlKey && ["a", "x", "c", "v"].includes(event.key))
  )
    return;
  event.preventDefault();
};

export const checkArray = (arr) => Array.isArray(arr) && arr.length > 0;

export const toArray = (target) => (Array.isArray(target) ? target : [target]);

export const getAddPadding = (() => {
  const checkType = (target) => {
    const type = typeof target;
    if (type === "string") return true;
    throw Error(`addPadding only accept string input but get "${type}" type.`);
  };

  return (symbol) => {
    checkType(symbol);

    return (str, digits) => {
      checkType(str);
      while (str.length < digits) str = symbol + str;
      return str;
    };
  };
})();

export const addZeroPadding = getAddPadding("0");

export const getCurrentTime = () => {
  const date = new Date();
  const month = addZeroPadding(`${date.getMonth() + 1}`, 2);
  const day = addZeroPadding(`${date.getDate()}`, 2);
  const hour = addZeroPadding(`${date.getHours()}`, 2);
  const minute = addZeroPadding(`${date.getMinutes()}`, 2);
  const second = addZeroPadding(`${date.getSeconds()}`, 2);

  return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}:${second}`;
};
