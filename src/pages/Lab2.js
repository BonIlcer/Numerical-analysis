import { useState } from 'react'
import { Box, Button, Divider, Link } from '@material-ui/core'
import { determinant, inverseMatrix, multiplyMatrices, Matrix, InvM, yacobi, subMatrices } from '../utils/matrix'
import { parseMatrix } from '../utils/parseMatrix'

const initA = [
  [1.2, -3.5, 0],
  [0.4, 2.1, -0.1],
  [0, 1.1, 1],
]
const initB = [[-10], [0.5], [1.5]]
const notCalculated = 'not calculated'

const Lab2 = () => {
  const [a, setA] = useState(initA)
  const [b, setB] = useState(initB)
  const [invA, setInvA] = useState(null)
  const [det, setDet] = useState(notCalculated)
  const [precision, setPrecision] = useState(16)
  const [matrixSolution, setMatrixSolution] = useState(null)
  const [yacobiSolution, setYacobiSolution] = useState(null)
  const [matrixTime, setMatrixTime] = useState(null)
  const [yacobiTime, setYacobiTime] = useState(null)

  const reset = () => {
    setA(initA)
    setB(initB)
    setInvA(null)
    setDet(notCalculated)
    setPrecision(16)
    setMatrixSolution(null)
    setYacobiSolution(null)
    setMatrixTime(null)
    setYacobiTime(null)
  }

  const calculate = () => {
    const startMatrixSolution = Date.now()
    setDet(determinant(a))
    det === 0
      ? alert('Определитель равен 0 => Матрица вырождена => Для вырожденных матриц обратных матриц не существует.')
      : setInvA(inverseMatrix(a, det))
    setMatrixSolution(multiplyMatrices(inverseMatrix(a, det), b))
    const endMatrixSolution = Date.now()
    setMatrixTime(endMatrixSolution - startMatrixSolution)

    const startYacobiSolution = Date.now()
    setYacobiSolution(yacobi(a, b, precision))
    const endYacobiSolution = Date.now()
    setYacobiTime(endYacobiSolution - startYacobiSolution)
  }

  const upload = async (e) => {
    setYacobiSolution(null)
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
      <h2>Lab2</h2>
      <p>
        Решение СЛАУ итерационными методами (метод Якоби), вывести вектор невязки, время решения задачи для прямого
        (метод обратной матрицы) и итерационного метода (метод Якоби).
      </p>
      <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
        {'refs: Самарский - Численные методы'}
        {/* <Link href='https://www.webmath.ru/poleznoe/formules_6_13.php'>
          https://www.webmath.ru/poleznoe/formules_6_13.php
        </Link> */}
      </p>
      <Divider style={{ margin: '16px 0' }} />
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

      {yacobiSolution && (
        <>
          <Box display='flex'>
            <Matrix
              matrix={matrixSolution}
              label='x (прямой метод)'
              precision={precision}
              style={{ minWidth: '80px', maxWidth: '30%' }}
            />
            <Matrix
              matrix={yacobiSolution}
              label='x (итерационный метод)'
              precision={precision}
              style={{ minWidth: '80px', maxWidth: '30%' }}
            />
            <Matrix
              matrix={subMatrices(multiplyMatrices(invA, b), yacobi(a, b, precision))}
              label='Разница прямого и итер. методов'
              precision={precision}
              style={{ minWidth: '80px', maxWidth: '30%' }}
            />
          </Box>
          <Box>
            <p>
              {`Время вычисления прямым методом: `}
              <b>{matrixTime + ' мс'}</b>
            </p>
            <p>
              {`Время вычисления итер. методом: `}
              <b>{yacobiTime + ' мс'}</b>
            </p>
          </Box>
        </>
      )}
    </main>
  )
}

export default Lab2
