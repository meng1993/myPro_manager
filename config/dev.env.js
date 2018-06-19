'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENV_CONFIG: '"dev"',
  /**
   * todo:模拟登录数据
   */
  BASE_API: '"http://192.168.1.168:8089/onlineStudyManager"'
})
