"use client"


function fetch(): Promise<{name: string}> {
  return new Promise((resolve, reject) => {
    global.setTimeout(() => {
      resolve({
        name: 'ceshiceshi'
      })
    }, 2000)
  })
}

async function getData() {
  const res = await fetch()
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
 
  return res
}
 
export default async function Page() {
  console.log('111111')
  const data = await getData()
  return <div>{data.name}</div>
  // return <div>123</div>
}