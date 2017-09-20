/*
 * @Filename: index.js
 * @Author: jin5354
 * @Email: xiaoyanjinx@gmail.com
 * @Last Modified time: 2017-08-30 19:00:49
 */

import 'regenerator-runtime/runtime'
import {createStore, combineReducers, compose, applyMiddleware} from '../src/index.js'
import test from 'ava'

const pause = function(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

test('basis test 基本测试', t => {

  const initialState = {
    counter: 0,
  }

  const reducer = (state = initialState, action) => {
    switch(action.type) {
      case('ADD_COUNTER'): {
        return Object.assign({}, state, {
          counter: state.counter + 1
        })
      }
      default: {
        return state
      }
    }
  }

  const store = createStore(reducer)

  t.is(store.getState().counter, 0)

  store.dispatch({
    type: 'ADD_COUNTER'
  })

  t.is(store.getState().counter, 1)

})

test('subscribe 订阅', t => {

  const initialState = {
    counter: 0,
  }

  const reducer = (state = initialState, action) => {
    switch(action.type) {
      case('ADD_COUNTER'): {
        return Object.assign({}, state, {
          counter: state.counter + 1
        })
      }
      default: {
        return state
      }
    }
  }

  const store = createStore(reducer)

  let actionToken
  let stateToken

  store.subscribe((action, state) => {
    actionToken = action
    stateToken = state
  })

  store.dispatch({
    type: 'ADD_COUNTER'
  })

  t.is(actionToken.type, 'ADD_COUNTER')
  t.is(stateToken.counter, 1)

})

test('unSubscribe 取消订阅', t => {

  const initialState = {
    counter: 0,
  }

  const reducer = (state = initialState, action) => {
    switch(action.type) {
      case('ADD_COUNTER'): {
        return Object.assign({}, state, {
          counter: state.counter + 1
        })
      }
      default: {
        return state
      }
    }
  }

  const store = createStore(reducer)

  let actionToken
  let stateToken

  let unsubscribe = store.subscribe((action, state) => {
    actionToken = action
    stateToken = state
  })

  store.dispatch({
    type: 'ADD_COUNTER'
  })

  t.is(actionToken.type, 'ADD_COUNTER')
  t.is(stateToken.counter, 1)

  unsubscribe()

  actionToken = null
  stateToken = null

  store.dispatch({
    type: 'ADD_COUNTER'
  })

  t.is(actionToken, null)
  t.is(stateToken, null)

})

test('combineReducers 组装reduce', t => {

  const initialStateA = {
    counterA: 0,
  }

  const reducerA = (state = initialStateA, action) => {
    switch(action.type) {
      case('ADD_COUNTERA'): {
        return Object.assign({}, state, {
          counterA: state.counterA + 1
        })
      }
      default: {
        return state
      }
    }
  }

  const initialStateB = {
    counterB: 10,
  }

  const reducerB = (state = initialStateB, action) => {
    switch(action.type) {
      case('ADD_COUNTERB'): {
        return Object.assign({}, state, {
          counterB: state.counterB + 1
        })
      }
      default: {
        return state
      }
    }
  }

  const store = createStore(combineReducers({
    reducerA,
    reducerB
  }))

  t.is(store.getState().reducerA.counterA, 0)
  t.is(store.getState().reducerB.counterB, 10)

  store.dispatch({
    type: 'ADD_COUNTERA'
  })
  store.dispatch({
    type: 'ADD_COUNTERB'
  })

  t.is(store.getState().reducerA.counterA, 1)
  t.is(store.getState().reducerB.counterB, 11)
  let oldState = store.getState()

  store.dispatch({})

  t.is(store.getState().reducerA.counterA, 1)
  t.is(store.getState().reducerB.counterB, 11)
  let newState = store.getState()
  t.is(newState, oldState)

})

test('compose 组装reduce', t => {

  function add(num) {
    return num + 1
  }

  function multi(num) {
    return num * 2
  }

  function divide(num) {
    return num / 10
  }

  let composer = compose(divide, multi, add)
  let composerWithoutArg = compose()
  let composerWith1Arg = compose(add)

  t.is(composer(1), 0.4)
  t.is(composerWithoutArg(1), 1)
  t.is(composerWith1Arg(1), 2)

})

test('applyMiddleware 中间件系统 + 异步', async t => {

  let thunkMiddleware = store => next => action => {
    if (typeof action === 'function') {
      return action(store.dispatch, store.getState)
    }
    return next(action)
  }

  const initialState = {
    counter: 0,
  }

  const reducer = (state = initialState, action) => {
    switch(action.type) {
      case('ADD_COUNTER'): {
        return Object.assign({}, state, {
          counter: state.counter + 1
        })
      }
      default: {
        return state
      }
    }
  }

  const store = createStore(reducer, applyMiddleware(thunkMiddleware))


  t.is(store.getState().counter, 0)

  store.dispatch({
    type: 'ADD_COUNTER'
  })

  t.is(store.getState().counter, 1)

  store.dispatch((dispatch) => {
    dispatch({type: 'ADD_COUNTER'})
    dispatch({type: 'ADD_COUNTER'})
    dispatch({type: 'ADD_COUNTER'})
  })

  t.is(store.getState().counter, 4)

  store.dispatch(async (dispatch) => {
    await pause(200)
    dispatch({type: 'ADD_COUNTER'})
    await pause(200)
    dispatch({type: 'ADD_COUNTER'})
  })
  await pause(200)
  t.is(store.getState().counter, 5)
  await pause(200)
  t.is(store.getState().counter, 6)

})

test('applyMiddleware 多中间件串联', async t => {

  const tokenArray = []

  let thunkMiddleware = store => next => action => {
    if (typeof action === 'function') {
      return action(store.dispatch, store.getState)
    }
    return next(action)
  }

  let logMiddlewareA = store => next => action => {
    tokenArray.push('A')
    let result = next(action)
    return result
  }

  let logMiddlewareB = store => next => action => {
    tokenArray.push('B')
    let result = next(action)
    return result
  }

  let logMiddlewareC = store => next => action => {
    tokenArray.push('C')
    let result = next(action)
    return result
  }

  const initialState = {
    counter: 0,
  }

  const reducer = (state = initialState, action) => {
    switch(action.type) {
      case('ADD_COUNTER'): {
        return Object.assign({}, state, {
          counter: state.counter + 1
        })
      }
      default: {
        return state
      }
    }
  }

  const store = createStore(reducer, applyMiddleware(thunkMiddleware, logMiddlewareA, logMiddlewareB, logMiddlewareC))


  t.is(store.getState().counter, 0)

  store.dispatch({
    type: 'ADD_COUNTER'
  })


  t.deepEqual(tokenArray, ['A', 'B', 'C'])
  t.is(store.getState().counter, 1)


})


