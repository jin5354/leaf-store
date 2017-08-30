/*
 * @Filename: createStore.js
 * @Author: jin5354
 * @Email: xiaoyanjinx@gmail.com
 * @Last Modified time: 2017-08-30 15:12:48
 */

let listenerID = 1

/**
 * [createStore 创建 store]
 * @param  {[function]} reducer
 * @return {[object]}  store
 */
export default function createStore(reducer, enhancer) {

  // 如果有中间件，在 enhancer(即 applyMiddleware) 中进行 store 初始化与应用中间件工作
  if(typeof enhancer !== 'undefined') {
    return enhancer(createStore)(reducer)
  }

  let state
  let listeners = []

  const getState = () => {
    return state
  }

  const subscribe = (listener) => {
    let id = listenerID++
    listeners.push({
      id: id,
      func: listener
    })

    return function unSubscribe() {
      listeners.splice(listeners.findIndex(listener => listener.id === id), 1)
    }
  }

  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach(listener => {
      listener.func.call(null, action, state)
    })
  }

  // 发一个空的 disptach，获得默认 state, 要求在写 reducer 时在 switch 中加一个 default: return state 分支
  dispatch({})

  return {
    getState,
    dispatch,
    subscribe
  }
}
