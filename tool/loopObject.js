export const loopObject = (obj, callback) =>
  Object.entries(obj).reduce(
    (dict, [key, value]) => ({
      ...dict,
      [key]: callback(value),
    }),
    {}
  );
