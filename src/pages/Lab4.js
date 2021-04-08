import { useState } from 'react'
import { Box, Divider, Link, OutlinedInput } from '@material-ui/core'
import { DataGrid } from '@material-ui/data-grid'
import { Line } from 'react-chartjs-2'
import { useEffect } from 'react'
import { cubicSpline } from '../utils/cubicSpline'
import { spline } from '../utils/worker'

const func = (x) => Math.sin(x)

const lagrange = (x, y, t) => {
  let z = 0
  for (let j = 0; j < y.length; j++) {
    let p1 = 1,
      p2 = 1
    for (let i = 0; i < x.length; i++) {
      ;[p1, p2] = i === j ? [p1 * 1, p2 * 1] : [p1 * (t - x[i]), p2 * (x[j] - x[i])]
    }
    z = z + (y[j] * p1) / p2
  }
  return z
}

const splitRange = (start, end, parts) => {
  const result = []
  const delta = (end - start) / parts
  while (start < end) {
    result.push(start)
    start += delta
  }
  start - end > end - result[result.length - 1] && result.pop()
  result.push(end)

  return [result, delta]
}
const extendRangePoints = (rangeList, step, percentage) => {
  const newStart = rangeList[0] * ((percentage / 2 + 100) / 100)
  const extendRangeList = [...rangeList]
  while (newStart < extendRangeList[0]) {
    extendRangeList.unshift(extendRangeList[0] - step)
    extendRangeList.push(extendRangeList[extendRangeList.length - 1] + step)
  }
  return extendRangeList
}
const getControlPoints = (pointsList, pointsCount) => {
  let list = pointsList.slice(1, -1)
  const result = [pointsList[0]]
  let len = 2
  let index = Math.floor(list.length / (pointsCount - len)) - 1
  while (result.length < pointsCount - 2) {
    result.push(list[index])
    list = list.slice(index + 1)
    len++
  }
  result.push(list[index])
  result.push(pointsList[pointsList.length - 1])
  return result
}

// x2 control points
const getSplineControlPoints = (pointsList, pointsCount) => {
  let list = pointsList.slice(1, -1)
  const result = [pointsList[0]]
  let len = 2
  let index = Math.floor(list.length / (pointsCount - len)) - 1
  while (result.length < pointsCount * 2 - 4) {
    result.push(list[Math.floor(index / 2)])
    result.push(list[index])
    console.log(result)
    list = list.slice(index + 1)
    len++
  }
  !!list && result.push(list[Math.floor((list.length - 1) / 2)])
  console.log(list, index)
  result.push(pointsList[pointsList.length - 1])
  console.log(result)
  return result
}

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
}

const controlPointsColumns = [
  { field: 'id', headerName: 'ID', type: 'number' },
  { field: 'x', headerName: 'X', type: 'number' },
  { field: 'y', headerName: 'Y', type: 'number' },
]

const pointsColumns = [
  { field: 'id', headerName: 'ID', type: 'number' },
  { field: 'x', headerName: 'X', type: 'number' },
  { field: 'y', headerName: 'Y orig', type: 'number', width: 120 },
  { field: 'yLag', headerName: 'Y lag', type: 'number', width: 120 },
  { field: 'ySpline', headerName: 'Y spline', type: 'number', width: 120 },
]

const Lab1 = () => {
  const [range, setRange] = useState([-6.3, 6.3])
  const [partsCount, setPartsCount] = useState(50)
  const [pointsCount, setPointsCount] = useState(6)
  const [scale, setScale] = useState(8)

  const [xPoints, step] = splitRange(range[0], range[1], partsCount)
  const extendedXPoints = extendRangePoints(xPoints, step, scale)
  const extendedYPoints = extendedXPoints.map((x) => func(x))

  const lagrangeXControlPoints = getControlPoints(xPoints, pointsCount)
  const lagrangeYControlPoints = lagrangeXControlPoints.map((v) => func(v))
  const lagrangeYPoints = extendedXPoints.map((x) => lagrange(lagrangeXControlPoints, lagrangeYControlPoints, x))

  const splineXControlPoints = getSplineControlPoints(xPoints, pointsCount)
  const splineYControlPoints = splineXControlPoints.map((v) => func(v))
  // const splineYPoints = cubicSpline(splineXControlPoints, splineYControlPoints, extendedXPoints)
  // const splineYPoints = cubicSpline(lagrangeXControlPoints, lagrangeYControlPoints, extendedXPoints)
  const splineYPoints = extendedXPoints.map((x) => spline(x, extendedXPoints, extendedYPoints))

  const controlPointsRows = lagrangeXControlPoints.map((el, i) => {
    return { id: i + 1, x: el, y: lagrangeYControlPoints[i] }
  })

  const pointsRow = extendedXPoints.map((el, i) => {
    return { id: i + 1, x: el, y: extendedYPoints[i], yLag: lagrangeYPoints[i], ySpline: splineYPoints[i] }
  })

  const data = {
    labels: extendedXPoints,
    datasets: [
      {
        label: 'sin(x)',
        data: extendedYPoints,
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Lagrange polynom',
        data: lagrangeYPoints,
        fill: false,
        backgroundColor: 'rgb(99, 255, 132)',
        borderColor: 'rgba(99, 255, 132, 0.2)',
      },
      {
        label: 'Cubic spline',
        data: splineYPoints,
        fill: false,
        backgroundColor: 'rgb(255, 255, 132)',
        borderColor: 'rgba(255, 255, 132, 0.2)',
      },
    ],
  }

  const rangeHandler = (e, isStart) => {
    isStart ? setRange([Number(e.target.value), range[1]]) : setRange([range[0], Number(e.target.value)])
  }

  useEffect(() => {
    console.log(xPoints)
    // console.log(getControlPoints(xPoints, partsCount, pointsCount))
    console.log(lagrangeXControlPoints)
    // console.log(lagrangeYPoints)
    console.log(splineXControlPoints)
    console.log(splineYPoints)
  })

  return (
    <main className='main'>
      <>
        <h2>Lab4</h2>
        <p>Реализовать программу реализующую построение и графическое изображение аппроксимирующей функции.</p>
        <p>
          - разбить отрезок на n частей (с шагом h);
          <br />- реализовать построение полинома Лагранжа;
          <br />- реализовать построение сплайна (например, кубического).
        </p>
        <p>
          Вывести на экран (разными цветами) тестовую функцию, сплайн-функцию и полином Лагранжа на заданном отрезке с
          достаточно малым шагом (достаточным для гладкости, ломаной линии не должно быть видно).
        </p>
        <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
          {'refs: Самарский - Численные методы, '}
          <Link href='https://en.wikipedia.org/wiki/Lagrange_polynomial'>
            https://en.wikipedia.org/wiki/Lagrange_polynomial
          </Link>{' '}
          <Link href='http://itnovella.com/post/2020/1/13/lagranz-interpolation-python-61/'>
            http://itnovella.com/post/2020/1/13/lagranz-interpolation-python-61/
          </Link>
        </p>
      </>
      <Divider />
      <>
        <p>
          Function: <span style={{ fontWeight: 500 }}>sin(x)</span>
        </p>
        <p>
          Parts count:{' '}
          <OutlinedInput
            type='number'
            margin='dense'
            style={{ width: '80px' }}
            inputProps={{ style: { textAlign: 'center' } }}
            value={partsCount}
            onChange={(e) => setPartsCount(e.target.value)}
          />
          &nbsp;&nbsp;&nbsp;&nbsp;{'Step: ' + step}
        </p>
        <p>
          Points count:{' '}
          <OutlinedInput
            type='number'
            margin='dense'
            style={{ width: '80px' }}
            inputProps={{ style: { textAlign: 'center' } }}
            value={pointsCount}
            onChange={(e) => setPointsCount(e.target.value)}
          />
        </p>
        <p>
          Range:{' '}
          <OutlinedInput
            type='number'
            margin='dense'
            style={{ width: '80px' }}
            inputProps={{ style: { textAlign: 'center' } }}
            value={range[0]}
            onChange={(e) => rangeHandler(e, true)}
          />{' '}
          <OutlinedInput
            type='number'
            margin='dense'
            style={{ width: '80px' }}
            inputProps={{ style: { textAlign: 'center' } }}
            value={range[1]}
            onChange={(e) => rangeHandler(e, false)}
          />
        </p>
      </>
      <Divider />
      <p>
        Plot scale:{' '}
        <OutlinedInput
          type='number'
          margin='dense'
          style={{ width: '80px' }}
          inputProps={{ style: { textAlign: 'center' } }}
          value={scale}
          onChange={(e) => setScale(e.target.value)}
        />
      </p>
      <Box>Plot:</Box>
      <Line data={data} options={options} />

      <div style={{ height: 400, width: '100%' }}>
        <p>Control points:</p>
        <DataGrid rows={controlPointsRows} columns={controlPointsColumns} />
      </div>

      <div style={{ height: 400, width: '100%', marginTop: '80px' }}>
        <p>Points:</p>
        <DataGrid rows={pointsRow} columns={pointsColumns} />
      </div>
    </main>
  )
}

export default Lab1
