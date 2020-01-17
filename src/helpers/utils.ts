const toString = Object.prototype.toString
// 类型谓词开启类型保护 parameterName is Type
// 如果该函数的返回值为true，则意味着类型谓词是成立的，于是它后面的作用域的类型也就被固定为Type
export function isNull(val: any): val is null {
  return val === null
}

export function isUndefined(val: any): val is undefined {
  return val === void 0
}

export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

export function isString(val: any): val is string {
  return typeof val === 'string'
}

export function isFormData(val: any): val is FormData {
  return toString.call(val) === '[object FormData]'
}

export function isURLSearchParams(val: any): val is URLSearchParams {
  return toString.call(val) === '[object URLSearchParams]'
}

// 泛型函数,使用交叉类型
export function extend<T, U>(to: T, from: U): T & U {
  for (let key in from) {
    // key是T类型的键名，to是U类型，所以不可以直接to[key]
    // from[key]是T类型的键值，to[key]是U类型的键值，两者不可直接赋值
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

// 深拷贝
export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)
  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        let val = obj[key]
        if (isPlainObject(val)) {
          if (!isPlainObject(result[key])) {
            result[key] = {}
          }
          result[key] = deepMerge(result[key], val)
        } else {
          result[key] = val
        }
      })
    }
  })
  return result
}

// jquery的$.extend实现  深浅拷贝
// target: 为boolean类型时表示是否深拷贝，为对象时表示目标对象
export function $extend(target: any, ...objs: any[]) {
  let deep: boolean = false
  if (typeof target === 'boolean') {
    deep = target
    target = objs[0] // 目标对象
  }
  objs.forEach(obj => {
    _extend(target, obj, deep)
  })
  return target
}

function _extend(target: any, source: any, deep: boolean): any {
  for (let key in source) {
    let sVal = source[key]
    if (deep && (isPlainObject(sVal) || Array.isArray(sVal))) {
      // source[key] 是对象，而 target[key] 不是对象， 则 target[key] = {} 初始化一下，否则递归会出错的
      if (isPlainObject(sVal) && !isPlainObject(target[key])) {
        target[key] = {}
      }
      // source[key] 是数组，而 target[key] 不是数组，则 target[key] = [] 初始化一下，否则递归会出错的
      if (Array.isArray(sVal) && !Array.isArray(target[key])) {
        target[key] = []
      }
      _extend(target[key], sVal, deep)
    } else if (!isUndefined(sVal)) {
      target[key] = sVal
    }
  }
}
