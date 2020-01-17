// 该接口是类类型接口，用来描述Axios类的公共方法及属性，接口也只能描述类的公共部分，且是针对类的实例部分
export interface AxiosInterface {
  defaults: AxiosRequestConfig
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
  getUri(config?: AxiosRequestConfig): string
}

// Axios类的类类型，针对静态部分
export interface AxiosClassStatic {
  new (config: AxiosRequestConfig): AxiosInterface
}

// AxiosInstance继承Axios接口，获得了那些方法，同时它自己本身就是一个函数类型接口，所以它是一个混合类型接口，
// 可以同时做为函数和对象使用，如注释部分所示还可以描述属性
export interface AxiosInstance extends AxiosInterface {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  // 函数重载
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  // isInstance: boolean
}

// 继承AxiosInstance接口，且自己新增一个方法
export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance

  CancelToken: CancelTokenStatic
  Cancel: CancelStatic
  isCancel: (value: any) => boolean

  all<T>(promises: (T | Promise<T>)[]): Promise<T[]>
  spread<T, R>(callback: (...args: T[]) => R): (arr: T[]) => R
  Axios: AxiosClassStatic
}

export interface AxiosRequestConfig {
  url?: string
  method?: Method
  headers?: any
  data?: any
  params?: any
  responseType?: XMLHttpRequestResponseType // 响应的数据类型
  timeout?: number
  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]
  cancelToken?: CancelTokenInterface
  withCredentials?: boolean
  xsrfCookieName?: string
  xsrfHeaderName?: string
  auth?: AxiosBasicCredentials
  baseURL?: string
  onDownloadProgress?: (e: ProgressEvent) => void
  onUploadProgress?: (e: ProgressEvent) => void
  validateStatus?: (status: number) => boolean
  paramsSerializer?: (params: any) => string
  [propName: string]: any
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

export interface AxiosTransformer {
  (data: any, headers?: any): any
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

// CancelToken类接口，针对CancelToken实例部分
export interface CancelTokenInterface {
  promise: Promise<CancelInterface>
  reason?: CancelInterface
  throwIfRequested(): void
}

// 取消函数接口
export interface Canceler {
  (message?: string): void
}

// CancelToken 类构造函数 参数的接口定义
export interface CancelExecutor {
  (cancel: Canceler): void
}

// CancelToken 类静态方法 source 函数的返回值类型
export interface CancelTokenSource {
  token: CancelTokenInterface
  cancel: Canceler
}

// CancelTokenStatic 则作为 CancelToken 类的类类型， 针对CancelToken类的静态部分
export interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelTokenInterface // 构造函数

  source(): CancelTokenSource // 静态方法
}

// Cancle类 的接口，针对实例部分()
export interface CancelInterface {
  message?: string
}

// Cancle类 的接口，针对静态部分
export interface CancelStatic {
  new (message?: string): CancelInterface
}

// auth 对象的接口
export interface AxiosBasicCredentials {
  username: string
  password: string
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
