/*
 * @Filename: index.js
 * @Author: jin5354
 * @Email: xiaoyanjinx@gmail.com
 * @Last Modified time: 2017-08-29 11:07:35
 */

import 'regenerator-runtime/runtime'
import {createStore, combineReducers} from '../src/index.js'
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
          counterA: state.counterB + 1
        })
        break
      }
      default: {
        return state
      }
    }
  }

  const initialStateB = {
    counter: 0,
  }

  const reducerB = (state = initialStateB, action) => {
    switch(action.type) {
      case('ADD_COUNTERB'): {
        return Object.assign({}, state, {
          counter: state.counterB + 1
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