import { useState } from 'react'
import { Button, Divider, Link } from '@material-ui/core'

const func = (x) => 4 * x ** 3 + 2 * x ** 2 + 4 * x - 2

const wegstein = (range, eps) => {
  let [x0, x1] = range
  let y0 = func(x0)
  let y1 = func(x1)
  let iterator = 0
  let z = null
  while (1) {
    iterator++
    z = x1 - (y1 * (x1 - x0)) / (y1 - y0)
    const de = Math.abs(x1 - z)
    if (iterator > 100) {
      console.log('Точность не достигнута')
      alert('Точность не достигнута')
      break
    } else {
      if (de <= eps) {
        break
      } else {
        x0 = x1
        x1 = z
        y0 = y1
        y1 = func(z)
      }
    }
  }
  return z
}

const Lab1 = () => {
  const [range, setRange] = useState([0, 1])
  const [solution, setSolution] = useState(null)
  const [precision, setPrecision] = useState(16)

  const calculate = () => {
    setSolution(wegstein(range, 10 ** -precision))
  }

  return (
    <main className='main'>
      <h2>Lab3</h2>
      <p>Вычисление корней нелинейных уравнений (методом Вегстейна)</p>
      <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
        {'refs: '}
        <Link href='https://studfile.net/preview/5514229/page:3/'>https://studfile.net/preview/5514229/page:3/</Link>
      </p>
      <Divider style={{ margin: '16px 0' }} />
      <Button style={{ marginRight: '24px' }} onClick={() => calculate()}>
        Calculate
      </Button>

      <p>
        Function:{' '}
        <span style={{ fontWeight: 500 }}>
          4x <sup>3</sup> + 2x <sup>2</sup> + 4x - 2 = 0
        </span>
      </p>
      <p>
        Range: <span style={{ fontWeight: 500 }}>{`[ ${range[0]}; ${range[1]} ]`}</span>
      </p>
      <p>
        Precision:{' '}
        <span style={{ fontWeight: 500 }}>
          10
          <sup>{-precision}</sup>
        </span>
      </p>
      {solution && (
        <p>
          Solution: <span style={{ fontWeight: 500 }}>{solution}</span>
        </p>
      )}
    </main>
  )
}

export default Lab1
