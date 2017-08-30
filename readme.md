# leaf-store

[![Build Status](https://travis-ci.org/jin5354/leaf-store.svg?branch=master)](https://travis-ci.org/jin5354/leaf-stire)
[![Coverage Status](https://coveralls.io/repos/github/jin5354/leaf-store/badge.svg?branch=master)](https://coveralls.io/github/jin5354/leaf-store?branch=master)

state manager

## Install

```bash
npm install leaf-store --save
```
or
```bash
yarn add leaf-store
```

## Feature

- 支持并兼容已有的 redux 中间件
- 支持 combineReducers

## Usage

Write a initialState:

```javascript
const initialState = {
  counter: 0,
}
```

Write a reducer:
```javascript
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
```

Then create store:

```javascript
const store = createStore(reducer, applyMiddleware(thunkMiddleware))
```

Use store.getState to get store state:

```javascript
store.getState()
```

Use store.dispatch to dispatch action:

```javascript
store.dispatch({
  type: 'ADD_COUNTER'
})
```

## API

Similar to Redux.

- createStore(reducer, applyMiddleware)
  Create store from reducer and applyMiddleware(optional). Return store.

- combineReducers(reducerA, reducerB, ...)
  Return a root reducer from seperated reduce module. Usage like createStore(combineReducers(reducerA, reducerB, ...)).

- applyMiddleware(middlewareA, middlewareB, ...)
  Usage like createStore(reducer, applyMiddleware(middlewareA, middlewareB, ...)). Then you will get store, with middleware integration.

## LICENSE

MIT
