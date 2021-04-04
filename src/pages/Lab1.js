import { useState } from 'react'
import { Box, Button, Link } from '@material-ui/core'
import { determinant, inverseMatrix, multiplyMatrices, Matrix, InvM } from '../utils/matrix'
import { parseMatrix } from '../utils/parseMatrix'

const initA = [
  [1.2, -3.5, 0],
  [0.4, 2.1, -0.1],
  [0, 1.1, 1],
]
const initB = [[-10], [0.5], [1.5]]
const notCalculated = 'not calculated'

const Lab1 = () => {
  const [a, setA] = useState(initA)
  const [b, setB] = useState(initB)
  const [invA, setInvA] = useState(null)
  const [det, setDet] = useState(notCalculated)
  const [precision, setPrecision] = useState(18)

  const reset = () => {
    setA(initA)
    setB(initB)
    setDet(notCalculated)
    setInvA(null)
  }

  const calculate = () => {
    setDet(determinant(a))
    det === 0
      ? alert('Определитель равен 0 => Матрица вырождена => Для вырожденных матриц обратных матриц не существует.')
      : setInvA(inverseMatrix(a, det))
  }

  const upload = async (e) => {
    setInvA(null)
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target.result
      const [len, matrixA, matrixB] = parseMatrix(text)
      setA(matrixA)
      setB(matrixB)
    }
    reader.readAsText(e.target.files[0])
  }

  return (
    <main className='main'>
      <h2>Lab1</h2>
      <p>Найти обратную матрицу (методом присоединения единичной матрицы) и вывести матрицу невязки</p>
      <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
        {'refs: Калиткин - Численные методы, '}
        <Link href='https://www.webmath.ru/poleznoe/formules_6_13.php'>
          https://www.webmath.ru/poleznoe/formules_6_13.php
        </Link>
      </p>
      <Button style={{ marginRight: '24px' }} onClick={() => calculate()}>
        Calculate
      </Button>

      <Button variant='contained' component='label' style={{ marginRight: '24px' }}>
        Upload
        <input accept='.txt' type='file' hidden onChange={(e) => upload(e)} />
      </Button>

      <Button color='primary' onClick={() => reset()}>
        Reset
      </Button>
      <p>
        Determinant: <span style={{ fontWeight: 500 }}>{det}</span>
      </p>
      <p>
        Precision:{' '}
        <span style={{ fontWeight: 500 }}>
          10
          <sup>{-precision}</sup>
        </span>
      </p>
      <Box display='flex'>
        {/* A */}
        <Matrix matrix={a} label='A' style={{ minWidth: '240px', maxWidth: '50%' }} />

        {/* B */}
        <Matrix matrix={b} label='B' style={{ minWidth: '80px', maxWidth: '30%' }} />
      </Box>

      {invA && (
        <>
          {/* invA */}
          <Matrix matrix={invA} label={InvM('A')} style={{ minWidth: '240px', maxWidth: '50%' }} />

          {/* A * invA */}
          <Matrix
            matrix={multiplyMatrices(invA, a)}
            label={InvM('A * A')}
            precision={precision}
            style={{ minWidth: '240px', maxWidth: '50%' }}
          />
        </>
      )}
    </main>
  )
}

export default Lab1
