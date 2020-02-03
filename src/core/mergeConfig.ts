import { isUndefined, isPlainObject, deepMerge } from '../helpers/utils'
import { AxiosRequestConfig } from '../types'

const strats = Object.create(null)

// 默认合并策略，val2有值就覆盖val1
function defaultStrat(val1: any, val2: any): any {
  return isUndefined(val2) ? val1 : val2
}

// 只从val2取值
function fromVal2Strat(val1: any, val2: any): any {
  if (!isUndefined(val2)) {
    return val2
  }
}

const stratKeysFromVal2 = ['url', 'params', 'data']
stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

// 复杂对象合并策略
function deepMergeStrat(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    // val2 是对象
    return deepMerge(val1, val2) // val2不是对象，但有值
  } else if (!isUndefined(val2)) {
    return val2
  } else if (isPlainObject(val1)) {
    // val1 是对象
    return deepMerge(val1)
  } else {
    return val1
  }
}

const stratKeysDeepMerge = ['headers', 'auth']
stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  const config = Object.create(null)
  if (!config2) {
    config2 = {}
  }

  for (let key in config2) {
    mergeFeild(key)
  }

  for (let key in config1) {
    if (!config2[key]) {
      mergeFeild(key)
    }
  }

  function mergeFeild(key: string): void {
    let strat = strats[key] || defaultStrat
    config[key] = strat(config1[key], config2![key])
  }

  return config
}
