import {
  AxiosInterface,
  AxiosRequestConfig,
  AxiosPromise,
  Method,
  Interceptors,
  AxiosResponse,
  ResolveFn,
  RejectFn,
  Interceptor
} from '../types'
import dispatchRequest, { transformURL } from './dispatchRequest'
import { isString } from '../helpers/utils'
import InterceptorManager from './InterceptorManager'
import mergeConfig from './mergeConfig'

// 链式调用 接口
interface PromiseChain {
  resolve: ResolveFn | ((config: AxiosRequestConfig) => AxiosPromise)
  reject?: RejectFn
}

// Axios类实现AxiosInstance接口
export default class Axios implements AxiosInterface {
  defaults: AxiosRequestConfig
  interceptors: Interceptors
  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig
    this.interceptors = {
      // InterceptorManager类的实例
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
  }
  request(url: string, config?: AxiosRequestConfig): AxiosPromise
  request(config: AxiosRequestConfig): AxiosPromise
  request(url?: any, config?: any): AxiosPromise {
    if (isString(url)) {
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }
    config = mergeConfig(this.defaults, config)
    config.method = config.method.toLowerCase()

    // 将发起请求这个操作先塞进链表中
    const chain: PromiseChain[] = [
      {
        resolve: dispatchRequest,
        reject: undefined
      }
    ]

    // 遍历request将拦截器从头部插入链表，以保证后插入的先执行
    this.interceptors.request.forEach((interceptor: Interceptor<AxiosRequestConfig>) => {
      chain.unshift(interceptor)
    })

    // 遍历response将拦截器从尾部插入链表，以保证先插入的先执行
    this.interceptors.response.forEach((interceptor: Interceptor<AxiosResponse>) => {
      chain.push(interceptor)
    })

    // 等价于 new Promise(resolve => resolve(config))，且状态已经是resolved，会立即执行then方法
    let promise = Promise.resolve(config)

    while (chain.length) {
      // 从头部依次弹出执行
      const { resolve, reject } = chain.shift()!
      promise = promise.then(resolve, reject)
    }
    return promise
  }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('get', url, config)
  }

  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('head', url, config)
  }

  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }

  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('options', url, config)
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('post', url, data, config)
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('put', url, data, config)
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('patch', url, data, config)
  }

  getUri(config?: AxiosRequestConfig): string {
    config = mergeConfig(this.defaults, config)
    return transformURL(config)
  }

  _requestMethodWithoutData(
    method: Method,
    url: string,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method,
        url
      })
    )
  }

  _requestMethodWithData(
    method: Method,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
        data
      })
    )
  }
}
