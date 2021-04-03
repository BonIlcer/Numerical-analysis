export const parseMatrix = (text) => {
  const regex = /[+-]?([0-9]*[.])?[0-9]+/g
  const list = text.match(regex)
  const [lengthA, lengthAB] = list.splice(0, 2)
  const matrixA = []
  const matrixB = []
  while (list.length) {
    matrixA.push(list.splice(0, lengthA))
    matrixB.push(list.splice(0, lengthAB - lengthA))
  }
  return [lengthA, matrixA, matrixB]
}
