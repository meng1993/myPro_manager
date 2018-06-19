import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true, meta: { title: '运营管理平台' }},
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  { path: '/', redirect: '/dashboard/index', hidden: true },
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/index',
    name: 'Dashboard',
    meta: { icon: 'example' },
    children: [
      { path: 'index', name: 'index', component: () => import('@/views/dashboard/index'), meta: { title: '首页', icon: 'tree' }}
    ]
  },
  // 课程
  {
    path: '/course',
    component: Layout,
    redirect: '/course/courseType',
    name: 'course',
    meta: { title: '课程管理', icon: 'example' },
    children: [
      { path: 'courseType', name: 'courseType', component: () => import('@/views/courseManage/courseType'), meta: { title: '课程类型', icon: 'table' }},
      { path: 'liveCourse', name: 'liveCourse', component: () => import('@/views/courseManage/liveCourse'), meta: { title: '直播课程', icon: 'tree' }},
      { path: 'videoCourse', name: 'videoCourse', component: () => import('@/views/courseManage/videoCourse'), meta: { title: '专栏课程', icon: 'tree' }},
      { path: 'addLiveCourse', name: 'addCourse', hidden: true, component: () => import('@/views/courseManage/addLive'), meta: { title: '新增直播课' }},
      { path: 'addVideoCourse', name: 'addVideoCourse', hidden: true, component: () => import('@/views/courseManage/addVideoCourse'), meta: { title: '新增专栏' }},
      { path: 'cateTag', name: 'cateTag', hidden: true, component: () => import('@/views/courseManage/cateTag'), meta: { title: '课时标签' }},
      { path: 'courseCatelog', name: 'courseCatelog', hidden: true, component: () => import('@/views/courseManage/courseCatelog'), meta: { title: '专栏详情' }},
      { path: 'addCourseCatelog', name: 'addCourseCatelog', hidden: true, component: () => import('@/views/courseManage/addCourseCatelog'), meta: { title: '新增课时' }},
      { path: 'training', name: 'training', hidden: true, component: () => import('@/views/courseManage/training'), meta: { title: '企业内训', icon: 'tree' }}
    ]

  },
  // 用户管理
  {
    path: '/userManage',
    component: Layout,
    redirect: '/userManage/userManageList',
    name: 'userManage',
    meta: { title: '用户管理', icon: 'example' },
    children: [
      { path: 'userManageList', name: 'userManageList', component: () => import('@/views/userManage/userManageList'), meta: { title: '用户管理', icon: 'table' }}
    ]
  },
  // 系统设置
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/banner',
    name: 'setting',
    meta: { title: '系统设置', icon: 'example' },
    children: [
      { path: 'banner', name: 'banner', component: () => import('@/views/setting/banner'), meta: { title: '轮播图', icon: 'table' }},
      { path: 'accountManage', name: 'accountManage', component: () => import('@/views/setting/accountManage'), meta: { title: '后台账号管理', icon: 'table' }},
      { path: 'accountManageAdd', name: 'accountManageAdd', hidden: true, component: () => import('@/views/setting/accountManageAdd'), meta: { title: '新增后台管理账号' }}
    ]
  },
  // 营销管理
  {
    path: '/marketing',
    component: Layout,
    redirect: '/marketing/coupon',
    name: 'marketing',
    meta: { title: '营销管理', icon: 'example' },
    children: [
      { path: 'groupActivity', name: 'groupActivity', component: () => import('@/views/activity/groupActivity'), meta: { title: '多人拼团', icon: 'tree' }},
      { path: 'addGroupActivity', name: 'addGroupActivity', hidden: true, component: () => import('@/views/activity/addGroupAcyivity'), meta: { title: '编辑多人拼团' }},
      { path: 'team', name: 'team', hidden: true, component: () => import('@/views/activity/team'), meta: { title: '拼团情况' }},
      { path: 'limitTime', name: 'limitTime', component: () => import('@/views/activity/limitTime'), meta: { title: '限时优惠', icon: 'tree' }},
      { path: 'addLimitTime', name: 'addLimitTime', hidden: true, component: () => import('@/views/activity/addLimitTime'), meta: { title: '编辑限时优惠' }},
      { path: 'coupon', name: 'coupon', component: () => import('@/views/marketingManage/coupon'), meta: { title: '优惠券', icon: 'table' }},
      { path: 'addCoupon', name: 'addCoupon', hidden: true, component: () => import('@/views/marketingManage/addCoupon'), meta: { title: '添加优惠券' }},
      { path: 'distributPromoteList', name: 'distributPromoteList', component: () => import('@/views/marketingManage/distributPromoteList'), meta: { title: '分销推广', icon: 'table' }},
      { path: 'distributPromoteEdit', name: 'distributPromoteEdit', hidden: true, component: () => import('@/views/marketingManage/distributPromoteEdit'), meta: { title: '设置分销' }},
      { path: 'distributRecord', name: 'distributRecord', hidden: true, component: () => import('@/views/marketingManage/distributRecord'), meta: { title: '推广记录' }}
    ]
  },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

