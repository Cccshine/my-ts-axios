import axios, { AxiosResponse, AxiosError } from '../src/index'
import { getAjaxRequest } from './helper'
const rqq = require('request')
describe('requests', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })
  afterEach(() => {
    jasmine.Ajax.uninstall()
  })
  test('should treat single string arg as url', () => {
    axios('/foo')
    // 一定要记得 return 整个promise,
    // 否则在 promise 还没有 fullfilled / rejected  之前，也就是 then /catch 还没执行之前断言就会完成，导致达不到测试目的
    // 经过测试发现 如果去掉return，then里面的代码并不会去执行，所以没法测试到
    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('GET')
      // console.log(request.method);
    })
  })

  // 通过传递done参数，Jest会等done回调函数执行结束后，结束测试，所以这种情况可以不用return promise
  test('should treat method value as lowercase string', done => {
    axios({
      url: '/foo',
      method: 'POST'
    }).then(response => {
      expect(response.config.method).toBe('post')
      done()
    })
    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200
      })
    })
  })

  test('should reject on network errors', done => {
    const resolveSpy = jest.fn((res: AxiosResponse) => {
      return res
    })
    const rejectSpy = jest.fn((e: AxiosError) => {
      return e
    })
    // 先卸载以模拟网络问题
    jasmine.Ajax.uninstall()
    axios('/foo')
      .then(resolveSpy)
      .catch(rejectSpy)
      .then((result: AxiosResponse | AxiosError) => {
        expect(resolveSpy).not.toHaveBeenCalled()
        expect(rejectSpy).toHaveBeenCalled()
        expect(result instanceof Error).toBeTruthy()
        expect((result as AxiosError).message).toBe('Network Error')
        expect(result.request).toEqual(expect.any(XMLHttpRequest))
        // 因为afterEach会 uninstall 所以在这里先install
        jasmine.Ajax.install()
        done()
      })
  })

  test('should reject when request timeout', done => {
    let err: AxiosError
    axios('/foo', {
      timeout: 2000,
      method: 'post'
    }).catch(error => {
      // console.log('lulullul')
      // console.log(error)
      err = error
    })

    getAjaxRequest().then(request => {
      // @ts-ignore
      // 由于 request.responseTimeout 方法内部依赖了 jasmine.clock 方法会导致运行失败，
      // 这里我直接用了 request.eventBus.trigger('timeout') 方法触发了 timeout 事件。因为这个方法不在接口定义中，所以需要加 // @ts-ignore
      request.eventBus.trigger('timeout')
      // 使用timeout在下次事件循环的开始进行断言，否则会先进行断言，再执行上面的catch，导致测试失败
      setTimeout(() => {
        // console.log('hahahha')
        expect(err instanceof Error).toBeTruthy()
        expect(err.message).toBe('Timeout of 2000 ms exceeded')
        done()
      }, 100)
    })
  })

  test('should reject when validateStatus returns false', done => {
    const resolveSpy = jest.fn((res: AxiosResponse) => {
      return res
    })

    const rejectSpy = jest.fn((e: AxiosError) => {
      return e
    })
    axios('/foo', {
      validateStatus(status) {
        return status !== 500
      }
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then((result: AxiosResponse | AxiosError) => {
        expect(resolveSpy).not.toHaveBeenCalled()
        expect(rejectSpy).toHaveBeenCalled()
        expect(result instanceof Error).toBeTruthy()
        expect((result as AxiosError).message).toBe('Request failed with status code 500')
        expect((result as AxiosError).response!.status).toBe(500)
        done()
      })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 500
      })
    })
  })

  test('should resolve when validateStatus returns true', done => {
    const resolveSpy = jest.fn((res: AxiosResponse) => {
      return res
    })

    const rejectSpy = jest.fn((e: AxiosError) => {
      return e
    })

    axios('/foo', {
      validateStatus(status) {
        return status === 200
      }
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then((result: AxiosResponse | AxiosError) => {
        expect(resolveSpy).toHaveBeenCalled()
        expect(rejectSpy).not.toHaveBeenCalled()
        expect(result.config.url).toBe('/foo')
        expect((result as AxiosResponse).status).toBe(200)
        done()
      })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200
      })
    })
  })

  test('should return JSON when resolved', done => {
    let response: AxiosResponse
    axios('/api/account/signup', {
      auth: {
        username: '',
        password: ''
      },
      method: 'post',
      headers: {
        Accept: 'application/json'
      }
    }).then(res => {
      response = res
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"a": 1}'
      })
      setTimeout(() => {
        expect(response.data).toEqual({ a: 1 })
        done()
      }, 0)
    })
  })

  test('should return JSON when rejecting', done => {
    let response: AxiosResponse

    axios('/api/account/signup', {
      auth: {
        username: '',
        password: ''
      },
      method: 'post',
      headers: {
        Accept: 'application/json'
      }
    }).catch(error => {
      response = error.response
      expect(typeof response.data).toBe('object')
      expect(response.data.error).toBe('BAD USERNAME')
      expect(response.data.code).toBe(1)
      done()
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 400,
        statusText: 'Bad Request',
        responseText: '{"error": "BAD USERNAME", "code": 1}'
      })

      // setTimeout(() => {
      //   expect(typeof response.data).toBe('object')
      //   expect(response.data.error).toBe('BAD USERNAME')
      //   expect(response.data.code).toBe(1)
      //   done()
      // }, 0)
    })
  })

  test('should supply correct response', done => {
    let response: AxiosResponse

    axios.post('/foo').then(res => {
      response = res
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"foo": "bar"}',
        responseHeaders: {
          'Content-Type': 'application/json'
        }
      })

      setTimeout(() => {
        expect(response.data.foo).toBe('bar')
        expect(response.status).toBe(200)
        expect(response.statusText).toBe('OK')
        expect(response.headers['content-type']).toBe('application/json')
        done()
      }, 100)
    })
  })

  test('should allow overriding Content-Type header case-insensitive', () => {
    let response: AxiosResponse

    axios
      .post(
        '/foo',
        { prop: 'value' },
        {
          headers: {
            'content-type': 'application/json'
          }
        }
      )
      .then(res => {
        response = res
      })

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders['Content-Type']).toBe('application/json')
    })
  })

  test('should support array buffer response', done => {
    let response: AxiosResponse

    function str2ab(str: string) {
      const buff = new ArrayBuffer(str.length * 2)
      const view = new Uint16Array(buff)
      for (let i = 0; i < str.length; i++) {
        view[i] = str.charCodeAt(i)
      }
      return buff
    }

    axios('/foo', {
      responseType: 'arraybuffer'
    }).then(data => {
      response = data
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        // @ts-ignore
        response: str2ab('Hello world')
      })

      setTimeout(() => {
        expect(response.data.byteLength).toBe(22)
        done()
      }, 100)
    })
  })

  // 不要传done参数，传了的话就得调用，否则就会超时
  // test('my test', async () => {
  //   await rqq('http://localhost:8088/base/get?foo=cc', function (
  //     error: any,
  //     response: any,
  //     body: any
  //   ) {
  //     expect(body).toEqual(expect.any(String))
  //   })
  // })
})
