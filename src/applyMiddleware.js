/*
 * @Filename: applyMiddleware.js
 * @Author: jin5354
 * @Email: xiaoyanjinx@gmail.com
 * @Last Modified time: 2017-08-30 18:59:25
 */

/**
 * [applyMiddleware ]
 * @param  {...[type]} middlewares [description]
 * @return {[type]}                [description]
 */

export default function applyMiddleware(...middlewares) {
  return (createStore) => (reducer) => {
    const store = createStore(reducer)
    let dispatch = store.dispatch

    // 仅仅暴露 getState 和 dispatch 两个 api
    const storeWithLimitedAPI = {
      getState: store.getState(),
      dispatch: (...args) => dispatch(...args)
    }

    // 这里可选使用 compose
    // 使用中间件将 store.dispatch 重写
    middlewares.reverse().forEach(middleware => {
      dispatch = middleware(storeWithLimitedAPI)(dispatch)
    })

    // 使用compose 的写法

    // let chain = middlewares.map(middleware => middleware(storeWithLimitedAPI))
    // dispatch = compose(...chain)(dispatch)

    return {
      ...store,
      dispatch
    }
  }
}
