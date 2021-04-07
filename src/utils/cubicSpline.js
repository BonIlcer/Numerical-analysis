// JavaScript Document
// Author Michael Sartakov (msartakov@gmail.com)
// 2012:09:22

// function cubicspline(массив X, массив Y, массив X-интерп)
// cubicspline return - массив Y-интерп

export const cubicSpline = (bG, bH, aM) => {
  var H = bG.length
  var bo = aM.length
  var L = H
  var O = new Array(H)
  var T = new Array(H)
  var G = new Array(H)
  var ap = new Array(bo)
  var bm = new Array(bo)
  var t = new Array(2)
  t[0] = new Array(H)
  t[1] = new Array(H)
  var next = new Array(2)
  var F = 1,
    K,
    C = 0,
    V,
    ab
  var J = 0
  var l, v, bP
  var ac, bF, R, aJ, aS, bk, bb, h, aR, bM
  for (var i = 0; i < bo; i++) {
    ap[J] = aM[J]
    J++
  }
  V = 0
  for (var i = 0; i < L; i++) {
    v = parseFloat(bG[V])
    bP = parseFloat(bH[V])
    V++
    if (!isNaN(v) && !isNaN(bP)) {
      O[i] = v
      T[i] = bP
    }
  }
  K = 1
  for (var i = 0; i < L - 1; i++) {
    t[0][K] = O[K] - O[i]
    t[1][K] = (T[K] - T[i]) / t[0][K]
    K++
  }
  if (L == 2) {
    t[1][0] = t[0][0] = 1.0
    G[0] = 2.0 * t[1][1]
  } else {
    v = l = t[0][1]
    t[1][0] = t[0][2]
    t[0][0] = v + t[0][2]
    l *= l * t[1][2]
    G[0] = ((v + 2.0 * t[0][0]) * t[1][1] * t[0][2] + l) / t[0][0]
  }
  ab = L - 1
  for (var i = 1; i < ab; i++) {
    v = -(t[0][i + 1] / t[1][i - 1])
    G[i] = v * G[i - 1] + 3.0 * (t[0][i] * t[1][i + 1] + t[0][i + 1] * t[1][i])
    t[1][i] = v * t[0][i - 1] + 2.0 * (t[0][i] + t[0][i + 1])
  }
  if (L == 2) {
    G[1] = t[1][1]
  } else {
    if (L == 3) {
      G[2] = 2.0 * t[1][2]
      t[1][2] = 1.0
      v = -(1.0 / t[1][1])
    } else {
      v = t[0][L - 2] + t[0][L - 1]
      l = t[0][L - 1] * t[0][L - 1] * (T[L - 2] - T[L - 3])
      l /= t[0][L - 2]
      G[L - 1] = ((t[0][L - 1] + 2.0 * v) * t[1][L - 1] * t[0][L - 2] + l) / v
      v = -(v / t[1][L - 2])
      t[1][L - 1] = t[0][L - 2]
    }
    t[1][L - 1] = v * t[0][L - 2] + t[1][L - 1]
    G[L - 1] = (v * G[L - 2] + G[L - 1]) / t[1][L - 1]
  }
  for (var i = L - 2; i >= 0; i--) {
    G[i] = (G[i] - t[0][i] * G[i + 1]) / t[1][i]
  }
  while (C < J) {
    for (V = C; V < J; V++) {
      if (ap[V] >= O[F]) break
    }
    if (V < J) {
      if (F == L - 1) V = J
    }
    ab = V - C
    if (ab > 0) {
      aR = h = O[F] - O[F - 1]
      next[1] = next[0] = 0
      bM = 0.0
      aS = (T[F] - T[F - 1]) / h
      bk = (G[F - 1] - aS) / h
      bb = (G[F] - aS) / h
      ac = -(bk + bk + bb)
      bF = ac + ac
      R = (bk + bb) / h
      aJ = R + R + R
      for (var k = 0; k < ab; k++) {
        l = ap[C + k] - O[F - 1]
        bm[C + k] = T[F - 1] + l * (G[F - 1] + l * (ac + l * R))
        if (l < bM) next[0] = next[0] + 1
        if (l > aR) next[1] = next[1] + 1
      }
      if (next[0] > 0 && F != 1) {
        for (k = C; k < V; k++) {
          if (ap[k] < O[F - 1]) break
        }
        V = k
        for (k = 0; k < F; k++) {
          if (ap[V] < O[k]) break
        }
        F = k - 1 > 0 ? k - 1 : 0
      }
      C = V
    }
    F++
    if (F >= L) break
  }
  return bm
}
