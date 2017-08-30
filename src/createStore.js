/*
 * @Filename: createStore.js
 * @Author: jin5354
 * @Email: xiaoyanjinx@gmail.com
 * @Last Modified time: 2017-08-30 10:52:07
 */

let listenerID = 1

/**
 * [createStore 创建 store]
 * @param  {[function]} reducer
 * @return {[object]}  store
 */
export default function createStore(reducer, enhancer) {

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

  dispatch({})

  return {
    getState,
    dispatch,
    subscribe
  }
}
