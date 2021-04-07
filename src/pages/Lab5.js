import { useEffect, useState } from 'react'
import { Button, Divider, Link, OutlinedInput } from '@material-ui/core'
import { Line } from 'react-chartjs-2'

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

const func = (x, c) => (c - x) ** 2 / (4 * x ** 2)

const derivative = (x, y) => (Math.sqrt(y) - 2 * y) / x

const eulersMethod = (f, x0, y0, end, step) => {
  let x = x0,
    y = y0
  const result = []
  // Both sides of the OR let you do Euler's Method backwards
  while (x <= end) {
    result.push([x, y])
    y += step * f(x, y)
    x += step
  }
  return result
}

// Finds value of y for a given x using step size h
// and initial value y0 at x0.
const rungeKutta = (f, x0, y0, end, step) => {
  // Count number of iterations using step size or
  // step height h
  // n = (int)((x - x0)/h)

  // Iterate for number of iterations
  let y = y0,
    x = x0
  const result = []
  while (x <= end) {
    // "Apply Runge Kutta Formulas to find next value of y"
    const k1 = step * f(x0, y)
    const k2 = step * f(x0 + 0.5 * step, y + 0.5 * k1)
    const k3 = step * f(x0 + 0.5 * step, y + 0.5 * k2)
    const k4 = step * f(x0 + step, y + k3)

    // # Update next value of y
    y += (1 / 6.0) * (k1 + 2 * k2 + 2 * k3 + k4)

    result.push([x, y])

    // # Update next value of x
    x += step
  }
  return result
}

const Lab1 = () => {
  const [rangeEnd, setRangeEnd] = useState(5)
  const [point, setPoint] = useState([1, 1])
  const step = 0.1

  const rangeHandler = (e) => setRangeEnd(Number(e.target.value))

  const pointHandler = (e, isStart) => {
    isStart ? setPoint([Number(e.target.value), point[1]]) : setPoint([point[0], Number(e.target.value)])
  }

  const eulersXPoints = eulersMethod(derivative, point[0], point[1], rangeEnd, step).map((el) => el[0])
  const eulersYPoints = eulersMethod(derivative, point[0], point[1], rangeEnd, step).map((el) => el[1])
  const generalYPoints = eulersXPoints.map((el) => func(el, -1))
  const generalYPoints2 = eulersXPoints.map((el) => func(el, 3))
  const rungeKuttaYPoints = rungeKutta(derivative, point[0], point[1], rangeEnd, step).map((el) => el[1])
  const data = {
    labels: eulersXPoints,
    datasets: [
      {
        label: 'General solution, C=-1',
        data: generalYPoints,
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
      // {
      //   label: 'General solution, C=3',
      //   data: generalYPoints2,
      //   fill: false,
      //   backgroundColor: 'rgb(255, 99, 132)',
      //   borderColor: 'rgba(255, 99, 132, 0.2)',
      // },
      {
        label: 'Euler',
        data: eulersYPoints,
        fill: false,
        backgroundColor: 'rgb(99, 255, 132)',
        borderColor: 'rgba(99, 255, 132, 0.2)',
      },
      {
        label: 'Runge-Kutta',
        data: rungeKuttaYPoints,
        fill: false,
        backgroundColor: 'rgb(255, 255, 132)',
        borderColor: 'rgba(255, 255, 132, 0.2)',
      },
    ],
  }
  useEffect(() => {
    console.log(eulersMethod(derivative, point[0], point[1], rangeEnd, step))
  })

  return (
    <main className='main'>
      <h2>Lab5</h2>
      <p>Решение обыкновенных дифференциальных уравнений (методом Эйлера, методом Рунге-Кутта 4-го порядка)</p>
      <p>
        - найти решение ОДУ (решить аналитически, найти функцию-решение)
        <br /> - составить задачу Коши (выбрать отрезок и проверить единственность решения в выбранной точке)
        <br />- реализовать программу, осуществляющую решение ОДУ, согласно заданию
      </p>
      <Divider />
      <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
        {'refs: Вержбицкий - Численные методы, Самарский - Численные методы'}
        {/* <Link href='https://studfile.net/preview/5514229/page:3/'>https://studfile.net/preview/5514229/page:3/</Link> */}
      </p>
      <p>
        Ordinary differential equation (ODE):{' '}
        <span style={{ fontWeight: 500 }}>
          y = (xy<sup>'</sup> + 2y) <sup>2</sup>
        </span>
      </p>
      <p>
        General solution:{' '}
        <span style={{ fontWeight: 500 }}>
          y = (c - x)<sup>2</sup> / 4x<sup>2</sup>
        </span>
      </p>
      <p>
        Point ( x<sub>0</sub> ;&nbsp;&nbsp;y<sub>0</sub> ):{' '}
        <OutlinedInput
          type='number'
          margin='dense'
          style={{ width: '80px' }}
          inputProps={{ style: { textAlign: 'center' } }}
          value={point[0]}
          onChange={(e) => pointHandler(e, true)}
        />{' '}
        <OutlinedInput
          type='number'
          margin='dense'
          style={{ width: '80px' }}
          inputProps={{ style: { textAlign: 'center' } }}
          value={point[1]}
          onChange={(e) => pointHandler(e, false)}
        />
      </p>
      <p>
        Range:{' '}
        <OutlinedInput
          type='number'
          margin='dense'
          style={{ width: '80px' }}
          inputProps={{ style: { textAlign: 'center' } }}
          value={point[0]}
          // onChange={(e) => rangeHandler(e, true)}
        />{' '}
        <OutlinedInput
          type='number'
          margin='dense'
          style={{ width: '80px' }}
          inputProps={{ style: { textAlign: 'center' } }}
          value={rangeEnd}
          onChange={(e) => rangeHandler(e)}
        />
      </p>
      <Divider />
      <Line data={data} options={options} />
    </main>
  )
}

export default Lab1
