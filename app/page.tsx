import { Suspense } from 'react'


function getData(): Promise<{name: string}> {
  return new Promise((resolve, reject) => {
    global.setTimeout(() => {
      resolve({
        name: 'ceshiceshi'
      })
    }, 10000)
  })
}

function createFetch<T>(func: () => Promise<T>) {
  let status = 'pending'
  let isSend = false
  let response: T
  let promise: unknown
  return {
    send: () => {
      if (!isSend) {
        promise = func().then(
          (res) => {
            status = 'inject'
            response = res
          },
          (err) => {
            status = 'error',
            response = err
          }
        )
        isSend = true
      }
    },
    read: (): T => {
      switch (status) {
        case 'pending':
          throw promise
        default:
          return response
      }
    },
    getStatus: () => {

    }
  }
}

const fetch = createFetch(getData)

export default function Home() {
  return (
    <div>
      <div>hello</div>
      <Suspense fallback={<div>load</div>}>
        <TestComponent />
      </Suspense>
    </div>
  )
}

const TestComponent = () => {
  fetch.send()
  const data = fetch.read()
  return (
    <div>{data?.name}</div>
  )
}
