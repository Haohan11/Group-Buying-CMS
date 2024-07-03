import clsx from "clsx";

const AvaliableCell = ({ status, validText, inValidText, className }) => (
  <div
    className={clsx(
      `badge ${status ? "badge-light-success" : "badge-light-danger"}`,
      className
    )}
  >
    {status ? validText : inValidText}
  </div>
);

export { AvaliableCell };
