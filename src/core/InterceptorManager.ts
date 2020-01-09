import { InterceptorManagerInterface, Interceptor, ResolveFn, RejectFn } from '../types'
import { isNull } from '../helpers/utils'

export default class InterceptorManager<T> implements InterceptorManagerInterface {
  private interceptors: (Interceptor<T> | null)[]

  constructor() {
    this.interceptors = []
  }

  use(resolve: ResolveFn<T>, reject?: RejectFn): number {
    this.interceptors.push({
      resolve,
      reject
    })
    return this.interceptors.length - 1
  }
  eject(id: number): void {
    this.interceptors[id] = null
  }
  // 函数表达式 声明返回值类型使用=>
  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach(interceptor => {
      if (!isNull(interceptor)) {
        fn(interceptor)
      }
    })
  }
}
