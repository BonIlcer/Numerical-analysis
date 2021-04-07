import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core'

export const InvM = (matrixLabel) => {
  return (
    <>
      <>{matrixLabel}</>
      <sup>-1</sup>
    </>
  )
}

export const Matrix = ({ matrix, label, style, precision = 6, ...others }) => (
  <Table style={style}>
    <TableHead>
      <TableRow>
        <TableCell align='center' colSpan={matrix.length} style={{ border: 'none' }}>
          {label}
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {matrix.map((row, i) => (
        <TableRow key={i}>
          {row.map((el) => (
            <TableCell align='center' style={{ border: 'none' }}>
              {typeof el === 'number' ? +el.toFixed(precision) : el}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

export const identityMatrix = (matrixLen) =>
  Array(matrixLen)
    .fill()
    .map((el, i) =>
      Array(matrixLen)
        .fill()
        .map((el, j) => (i === j ? 1 : 0))
    )

export const multiplyMatrices = (a, b) => {
  var aNumRows = a.length,
    aNumCols = a[0].length,
    bNumRows = b.length,
    bNumCols = b[0].length,
    m = new Array(aNumRows) // initialize array of rows
  for (var r = 0; r < aNumRows; ++r) {
    m[r] = new Array(bNumCols) // initialize the current row
    for (var c = 0; c < bNumCols; ++c) {
      m[r][c] = 0 // initialize the current cell
      for (var i = 0; i < aNumCols; ++i) {
        m[r][c] += a[r][i] * b[i][c]
      }
    }
  }
  return m
}

export const determinant = (m) => {
  if (m.length === 1) {
    return m[0][0]
  }

  return m[0].reduce(function (acc, x, col) {
    return acc + (col & 1 ? -1 : 1) * x * determinant(minor(m, { i: 0, j: col }))
  }, 0)
}

const minor = (m, idxs) => {
  const removeElement = (index, m) => m.slice(0, index).concat(m.slice(index + 1))

  return removeElement(idxs.i, m.map(removeElement.bind(null, idxs.j)))
}

export const inverseMatrix = (m) => {
  const im = identityMatrix(m.length)
  const extendedMatrix = m.map((row, i) => row.concat(im[i]))

  let tmp = extendedMatrix.map((row, i) => row.map((el) => el))
  console.log(extendedMatrix)
  for (let i = 0; i < tmp.length; i++) {
    for (let k = 0; k < tmp.length; k++) {
      const row = []
      if (i !== k) {
        for (let j = 0; j < tmp[i].length; j++) {
          row.push(tmp[k][j] - (tmp[k][i] * tmp[i][j]) / tmp[i][i])
        }
      } else
        for (let j = 0; j < tmp[i].length; j++) {
          row.push(tmp[i][j] / tmp[i][i])
        }
      tmp[k] = row
      console.log(i, k, tmp[k])
    }
  }
  console.log(tmp)
  return tmp.map((row) => row.slice(m.length))
}

export const addMatrices = (a, b) => a.map((row, i) => row.map((el, j) => el + b[i][j]))
export const subMatrices = (a, b) => a.map((row, i) => row.map((el, j) => el - b[i][j]))

export const yacobi = (a, b, precision = 10, x0 = Array.from({ length: a.length }, () => 0)) => {
  const d = a.map((row, i) => row.map((el, j) => (i === j ? el : 0)))
  const lu = a.map((row, i) => row.map((el, j) => (i !== j ? el : 0)))
  console.log(d)
  console.log(lu)
  console.log(addMatrices(d, lu))
  console.log(x0)
  const xi = [x0]

  let iterator = 0
  let norm
  do {
    let tempX = []
    for (let i = 0; i < a.length; i++) {
      tempX.push(b[i][0])
      for (let j = 0; j < a.length; j++) {
        if (i !== j) {
          tempX[i] -= a[i][j] * xi[iterator][j]
        }
      }
      tempX[i] /= a[i][i]
    }

    norm = Math.max(...xi[iterator].map((el, i) => Math.abs(el - tempX[i])))
    //console.log(iterator, norm, Math.pow(10, -precision), norm > Math.pow(10, -precision))
    xi.push(tempX)
    iterator++
  } while (norm > Math.pow(10, -precision) && iterator < 10000)
  console.log(iterator, xi)
  return xi[xi.length - 1].map((el) => [el])
}
