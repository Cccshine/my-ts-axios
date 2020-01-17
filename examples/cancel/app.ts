import axios, { Canceler } from '../../src/index'

const CancelToken = axios.CancelToken
const source = CancelToken.source()  // {token:xxx, cancel:xxx}

axios.get('/cancel/get', {
  cancelToken: source.token// CancelToken实例
}).catch(function (e) {
  if (axios.isCancel(e)) {// 判断e是否为 取消理由Cancel类的实例
    console.log('Request canceled', e.message)
  }
})

setTimeout(() => {
  source.cancel('Operation canceled by the user.')

  axios.post('/cancel/post', { a: 1 }, { cancelToken: source.token }).catch(function (e) {
    if (axios.isCancel(e)) {
      console.log(e.message)
    }
  })
}, 100)

let cancel: Canceler

axios.get('/cancel/get', {
  cancelToken: new CancelToken(c => {
    cancel = c
  })
}).catch(function (e) {
  if (axios.isCancel(e)) {
    console.log('Request canceled')
  }
})
setTimeout(() => {
  cancel()
}, 200)
