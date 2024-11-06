import Vue from 'vue';
import Router from 'vue-router';
import Layout from '@/layout/index.vue';

Vue.use(Router);

const router = new Router({
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      component: () =>
        import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
      meta: { title: '项目管理系统', hidden: true, notNeedAuth: true }
    },
    {
      path: '/404',
      component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue'),
      meta: { title: '项目管理系统', hidden: true, notNeedAuth: true }
    },
    {
      path: '/',
      component: Layout,
      redirect: '/mainInterface',
      children: [
        {
          path: 'mainInterface',
          component: () =>
            import(/* webpackChunkName: "mainInterface" */ '@/views/mainInterface/index.vue'),
          name: 'mainInterface',
          meta: {
            title: '工作台',
            icon: 'mainInterface',
            affix: true,
            showEventbar: true,
            showDetailbar: false,
            showSidebar: false
          }
        },
        {
          path: 'projectArc',
          component: () =>
            import(/* webpackChunkName: "shopTable" */ '@/views/projectArc/index.vue'),
          meta: {
            title: '项目档案',
            showEventbar: true,
            showDetailbar: true,
            showSidebar: true
          }
        },
        {
          path: 'taskList',
          component: () =>
            import(/* webpackChunkName: "shopTable" */ '@/views/taskList/index.vue'),
          meta: {
            title: '任务清单',
            showEventbar: true,
            showDetailbar: true,
            showSidebar: true
          }
        },
        {
          path: 'projectInfo',
          component: () =>
            import(/* webpackChunkName: "shopTable" */ '@/views/projectInfo/index.vue'),
          meta: {
            title: '项目信息',
            showEventbar: true,
            showDetailbar: true,
            showSidebar: true
          }
        },
        {
          path: 'projectFile',
          component: () =>
            import(/* webpackChunkName: "shopTable" */ '@/views/projectFile/index.vue'),
          meta: {
            title: '项目文档',
            showEventbar: true,
            showDetailbar: true,
            showSidebar: true
          }
        },
        {
          path: 'projectNote',
          component: () =>
            import(/* webpackChunkName: "shopTable" */ '@/views/projectNote/index.vue'),
          meta: {
            title: '项目简介',
            showEventbar: true,
            showDetailbar: true,
            showSidebar: true
          }
        },
        {
          path: 'employee',
          component: () =>
            import(/* webpackChunkName: "shopTable" */ '@/views/employee/index.vue'),
          meta: {
            title: '项目成员',
            icon: 'icon-employee',
            showEventbar: true,
            showDetailbar: true,
            showSidebar: true
          }
        },
        {
          path: '/employee/add',
          component: () =>
            import(/* webpackChunkName: "shopTable" */ '@/views/employee/addEmployee.vue'),
          meta: {
            title: '添加成员',
            icon: 'icon-employee',
            hidden: true
          }
        },
        {
          path: 'taskList/taskDisassemble',
          component: () =>
            import(/* webpackChunkName: "shopTable" */ '@/views/taskList/taskDisassemble.vue'),
          meta: {
            title: '任务分解',
            showEventbar: true,
            showSidebar: true,
            hidden: true
          }
        },
        {
          path: '/project/add',
          component: () =>
            import(/* webpackChunkName: "shopTable" */ '@/views/mainInterface/addProject.vue'),
          meta: {
            title: '新增项目',
            showEventbar: true,
            showSidebar: true,
            hidden: true
          }
        },
        {
          path: '/taskList/addTask',
          component: () =>
            import(/* webpackChunkName: "shopTable" */ '@/views/taskList/addTask.vue'),
          meta: {
            title: '新增任务',
            hidden: true,
          }
        }
      ]
    },
    {
      path: '*',
      redirect: '/404',
      meta: { hidden: true }
    }
  ]
});

export default router;
