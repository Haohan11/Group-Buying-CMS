const transImageUrl = (path) =>
  `${process.env.NEXT_PUBLIC_BACKENDURL}/${path.replace(/\\/g, "/")}`;
export { transImageUrl };
