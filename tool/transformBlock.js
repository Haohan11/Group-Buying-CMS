import numeric from "numeric";

const getTransform = function (from, to) {
  const A = [];
  for (let i = 0, k = 0; k < 4; i = ++k) {
    A.push([
      from[i].x,
      from[i].y,
      1,
      0,
      0,
      0,
      -from[i].x * to[i].x,
      -from[i].y * to[i].x,
    ]);
    A.push([
      0,
      0,
      0,
      from[i].x,
      from[i].y,
      1,
      -from[i].x * to[i].y,
      -from[i].y * to[i].y,
    ]);
  }
  const b = [];
  for (let i = 0, l = 0; l < 4; i = ++l) {
    b.push(to[i].x);
    b.push(to[i].y);
  }
  const h = numeric.solve(A, b);
  const H = [
    [h[0], h[1], 0, h[2]],
    [h[3], h[4], 0, h[5]],
    [0, 0, 1, 0],
    [h[6], h[7], 0, 1],
  ];
  for (let i = 0, m = 0; m < 4; i = ++m) {
    const lhs = numeric.dot(H, [from[i].x, from[i].y, 0, 1]);
    const k_i = lhs[3];
    const rhs = numeric.dot(k_i, [to[i].x, to[i].y, 0, 1]);
    console.assert(
      numeric.norm2(numeric.sub(lhs, rhs)) < 1e-9,
      "Not equal:",
      lhs,
      rhs
    );
  }
  return H;
};

export const getMatirx3dText = function (originalPos, targetPos) {
  const from = (function () {
    const results = [];
    for (let k = 0, len = originalPos.length; k < len; k++) {
      const p = originalPos[k];
      results.push({
        x: p[0] - originalPos[0][0],
        y: p[1] - originalPos[0][1],
      });
    }
    return results;
  })();
  const to = (function () {
    const results = [];
    for (let k = 0, len = targetPos.length; k < len; k++) {
      const p = targetPos[k];
      results.push({
        x: p[0] - originalPos[0][0],
        y: p[1] - originalPos[0][1],
      });
    }
    return results;
  })();
  const H = getTransform(from, to);

  return (
    "matrix3d(" +
    (function () {
      const results = [];
      for (let i = 0, k = 0; k < 4; i = ++k) {
        results.push(
          (function () {
            const results1 = [];
            for (let j = 0, l = 0; l < 4; j = ++l) {
              results1.push(H[j][i].toFixed(20));
            }
            return results1;
          })()
        );
      }
      return results;
    })().join(",") +
    ")"
  );
};