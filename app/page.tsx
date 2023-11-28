"use client"

// 加上 "use client" 该组件在 server side 和 client side 都会被执行
// 否则该组件背视为一个 Server Component 只在 server side 执行
// 两种模式都能实现 Suspense 流式渲染
import { Suspense } from 'react'


function getData(): Promise<{name: string}> {
  return new Promise((resolve, reject) => {
    global.setTimeout(() => {
      resolve({
        name: '333333'
      })
    }, 2000)
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
  console.log('component render')
  fetch.send()
  const data = fetch.read()
  return (
    <div>{data?.name}</div>
  )
}
