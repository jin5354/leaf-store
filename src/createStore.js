/*
 * @Filename: createStore.js
 * @Author: jin5354
 * @Email: xiaoyanjinx@gmail.com
 * @Last Modified time: 2017-08-29 11:09:06
 */

let listenerID = 1

export function createStore(reducer) {
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
