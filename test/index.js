/*
 * @Filename: index.js
 * @Author: jin5354
 * @Email: xiaoyanjinx@gmail.com
 * @Last Modified time: 2017-08-29 16:01:10
 */

import 'regenerator-runtime/runtime'
import {createStore, combineReducers, compose} from '../src/index.js'
import test from 'ava'

const initialData = {
  title: '测试title',
  counter: 0,
  themeColor: '#cccccc',
  text: 'hello'
}

const reducer = (data = initialData, action) => {
  switch(action.type) {
    case('CHANGE_TITLE'): {
      return {
        ...data,
        title: action.title
      }
      break
    }
    case('ADD_COUNTER'): {
      return {
        ...data,
        counter: data.counter++
      }
      break
    }
    case('CHANGE_THEME_COLOR'): {
      return {
        ...data,
        themeColor: action.themeColor
      }
      break
    }
    case('CHANGE_TEXT'): {
      return {
        ...data,
        text: action.text
      }
      break
    }
  }
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
        break
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
        break
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
        break
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
        break
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
        break
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
