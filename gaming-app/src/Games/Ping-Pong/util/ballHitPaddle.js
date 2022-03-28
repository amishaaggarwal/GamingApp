export const ballHit = (p, cx, cy, rad, rx, ry, rw, rh) => {
  let testX = cx;
  let testY = cy;

  if (cx < rx) testX = rx; // test left edge
  else if (cx > rx + rw) testX = rx + rw; // right edge
  if (cy < ry) testY = ry; // top edge
  else if (cy > ry + rh) testY = ry + rh; // bottom edge

  let d = p.dist(cx, cy, testX, testY);

  if (d <= rad) {
    return true;
  }
  return false;
};