/*
 * @Filename: combineReducers.js
 * @Author: jin5354
 * @Email: xiaoyanjinx@gmail.com
 * @Last Modified time: 2017-08-29 14:55:21
 */

/**
 * [combineReducers 组合多个 reducer]
 * @param  {[object]} reducers
 * @return {[type]}
 */
export default function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers)

  return function combination(state = {}, action) {
    let newState = {}
    let hasChanged = false // 如果各个子 reduce 的 state 均未变化，直接返回原 state
    reducerKeys.forEach(key => {
      let oldKeyState = state[key]
      let newKeyState = reducers[key](state[key], action)
      newState[key] = newKeyState // 将 action 分发到各个子 reduce 上，再将返回的结果子 state 挂在根 state 上
      hasChanged = hasChanged || newKeyState !== oldKeyState
    })
    return hasChanged ? newState : state
  }
}
