import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

/* layout */
import Layout from '../views/layout/Layout'

Vue.use(Router)

/**
* icon : the icon show in the sidebar
* hidden : if `hidden:true` will not show in the sidebar
* redirect : if `redirect:noredirect` will not redirct in the levelbar
* noDropdown : if `noDropdown:true` will not has submenu in the sidebar
* meta : `{ role: ['admin'] }`  will control the page role
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [{ path: 'dashboard', component: _import('dashboard/index') }]
  },

  {
    path: '/example',
    component: Layout,
    redirect: 'noredirect',
    name: 'Example',
    icon: 'zujian',
    children: [
      { path: 'index', name: 'Form', icon: 'zonghe', component: _import('page/form') }
    ]
  },

  {
    path: '/table',
    component: Layout,
    redirect: '/table/index',
    icon: 'tubiao',
    noDropdown: true,
    children: [
        { path: 'index', name: 'Table', component: _import('table/index'), meta: { role: ['admin'] }}
    ]
  },

  {
      component: Layout,
      path:'/user',
      redirect: '/user/index',
      icon: 'tubiao',
      noDropdown: true,
      //name:'用户管理',
      children: [
        { path: 'index', name: '用户管理', component: _import('user/index'), meta: { role: ['admin'] }},
        { path: 'create', name: '新建用户', component: _import('user/detail'), meta: { role: ['admin'] }},
        { path: ':id', name: '用户明细', component: _import('user/detail'), meta: { role: ['admin'] }}
      ]
  },

  {
    component: Layout,
    path:'/role',
    redirect: '/role/index',
    icon: 'tubiao',
    noDropdown: true,
    //name:'用户管理',
    children: [
      { path: 'index', name: '角色管理', component: _import('role/index'), meta: { role: ['admin'] }},
      { path: 'create', name: '创建角色', component: _import('role/detail'), meta: { role: ['admin'] }},
      { path: ':id', name: '角色明细', component: _import('role/detail'), meta: { role: ['admin'] }}
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
];

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

