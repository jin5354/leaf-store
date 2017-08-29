/*
 * @Filename: compose.js
 * @Author: jin5354
 * @Email: xiaoyanjinx@gmail.com
 * @Last Modified time: 2017-08-29 15:45:32
 */


/**
 * [compose 函数组合]
 * @param  {...[function]} funcs 待组合函数
 * @return {[function]}    组合后函数
 *
 * example:
 * compose(a,b,c,d)(...args) = a(b(c(d(...args))))
 *
 */

export default function compose(...funcs) {

  if(funcs.length === 0) {
    return arg => arg
  }

  if(funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => {
    return function(...args) {
      return a(b(...args))
    }
  })
}
