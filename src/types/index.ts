// 该接口是类类型接口，用来描述Axios类的公共方法，接口也只能描述类的公共部分
export interface AxiosInterface {
  interceptors: Interceptors
  request<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

// AxiosInstance继承Axios接口，获得了那些方法，同时它自己本身就是一个函数类型接口，所以它是一个混合类型接口，
// 可以同时做为函数和对象使用，如注释部分所示还可以描述属性
export interface AxiosInstance extends AxiosInterface {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  // 函数重载
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  // isInstance: boolean
}

export interface AxiosRequestConfig {
  url?: string
  method?: Method
  headers?: any
  data?: any
  params?: any
  responseType?: XMLHttpRequestResponseType // 响应的数据类型
  timeout?: number
}

export interface AxiosReponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

// AxiosPromise 这个接口继承 Promise<T> 这个泛型接口
// 这样当 axios 返回的是 AxiosPromise 类型，那么 resolve 函数中的参数就是一个 AxiosResponse 类型
// export interface AxiosPromise extends Promise<AxiosReponse> { }
// 两次泛型，则resolve函数中参数是AxiosReponse<T>类型，则response的data是T类型
export interface AxiosPromise<T = any> extends Promise<AxiosReponse<T>> {}

// 增强的error, 继承Error类，用来在外部使用，其实不定义这个接口，直接用AxiosErrorObject当类型也行
export interface AxiosError extends Error {
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosReponse
  isAxiosError: boolean
}

// Axios类的拦截器属性 接口， 有resuest和response两个属性，两者均有两个方法：use和eject
export interface Interceptors {
  request: InterceptorManagerInterface<AxiosRequestConfig>
  response: InterceptorManagerInterface<AxiosReponse>
}

// 单个拦截器管理类InterceptorManager 类型接口
export interface InterceptorManagerInterface<T = any> {
  use(resolve: ResolveFn<T>, reject?: RejectFn): number
  forEach(fn: (interceptor: Interceptor<T>) => void): void
  eject(id: number): void
}

// InterceptorManager类内部的私有属性interceptors的数组项的对象接口
export interface Interceptor<T> {
  resolve: ResolveFn<T>
  reject?: RejectFn
}

// request和respnse的拦截器传入resolve的参数类型不一样，所以要用泛型函数类型接口
export interface ResolveFn<T = any> {
  (val: T): T | Promise<T>
}
export interface RejectFn {
  (error: any): any
}

// 字符串字面量类型
export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'Delete'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'

export type XMLHttpRequestResponseType = '' | 'arraybuffer' | 'blob' | 'document' | 'json' | 'text'
