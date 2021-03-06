import Mock from 'mockjs'
import loginAPI from './login'
import tableApi from './table'
// import articleAPI from './article'
// import remoteSearchAPI from './remoteSearch'

Mock.setup({
  timeout: '350-600'
})

// 登录相关
Mock.mock(/\/user\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/user\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

Mock.mock(/\/table\/list\.*/, 'get', tableApi.getTableData)

// 文章相关
// Mock.mock(/\/article\/list/, 'get', articleAPI.getList)
// Mock.mock(/\/article\/detail/, 'get', articleAPI.getArticle)
// Mock.mock(/\/article\/pv/, 'get', articleAPI.getPv)

// 搜索相关
// Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser)

export default Mock
