// 配置API接口地址
var root = '/onlineStudyManager'
// 引用axios
var axios = require('axios')
// 自定义判断元素类型JS
function toType(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filterNull(o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}
/*
  接口处理函数
  这个函数每个项目都是不一样的，我现在调整的是适用于
  自己的接口，如果是其他接口
  需要根据接口的参数进行调整。
  主要是，不同的接口的成功标识和失败提示是不一致的。
  另外，不同的项目的处理方法也是不一致的，这里出错就是简单的alert
*/

function apiAxios(method, url, params, isObj, success, failure) {
  if (params) {
    params = filterNull(params)
  }
  axios({
    method: method,
    url: url,
    data: isObj && (method === 'POST' || method === 'PUT') ? params : null,
    params: !isObj || method === 'GET' || method === 'DELETE' ? params : null,
    baseURL: root,
    withCredentials: false
  })
    .then(function (res) {
      if (res.data.status === 0) {
        if (success) {
          success(res.data)
        }
      } else {
        if (failure) {
          failure(res.data)
        } else {
          window.console.log('error: ' + JSON.stringify(res.data))
        }
      }
    })
    .catch(function (err) {
      let res = err.response
      if (err) {
        window.console.log('api error, HTTP CODE: ' + res.status)
      }
    })
}

// 返回在vue模板中的调用接口
export default {
  get: function (url, params, isObj, success, failure) {
    return apiAxios('GET', url, params, isObj, success, failure)
  },
  post: function (url, params, isObj, success, failure) {
    return apiAxios('POST', url, params, isObj, success, failure)
  },
  put: function (url, params, isObj, success, failure) {
    return apiAxios('PUT', url, params, isObj, success, failure)
  },
  delete: function (url, params, isObj, success, failure) {
    return apiAxios('DELETE', url, params, isObj, success, failure)
  }
}
