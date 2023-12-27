// 模块
import Vue from 'vue';
import VueRouter from 'vue-router';
// 最外层页
import Login from '../view/LoginPage.vue';
import Register from '../view/RegisterPage.vue';
import Home from '../view/HomePage.vue';
import User from '../view/UserPage.vue';
import Analysis from '../view/AnalysisPage.vue';
import Setting from '../view/SettingPage.vue';

// 信息管理
import InformationPage from '../view/InformationPage';

import { jwtDecode } from 'jwt-decode';

Vue.use(VueRouter);

const routes = [
    // 默认跳转至首页
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: {
            breadcrumb: '首页'
        },
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/user',
        name: 'User',
        component: User,
        meta: {
            breadcrumb: '个人中心'
        },
    },
    // 信息管理
    {
        path: '/information',
        name: 'Information',
        component: InformationPage,
        meta: {
            breadcrumb: '信息管理'
        },
    },
    // 统计分析
    {
        path: '/analysis',
        name: 'Analysis',
        component: Analysis,
        meta: {
            breadcrumb: '统计分析'
        },
    },
    // 系统设置
    {
        path: '/setting',
        name: 'Setting',
        component: Setting,
        meta: {
            breadcrumb: '系统设置'
        },
    },
    // 404页面
    {
        path: '*',
        component: () => import('../view/NotFound.vue')
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

// 设置路由守卫
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');

    if (to.path === '/register' || to.path === '/login') {
        // 如果用户访问注册或登录路径，则不需要判断登录状态
        next();
    } else if (!token) {
        // Token不存在，执行其他处理逻辑，比如跳转到登录页面
        next('/login');
    } else {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.exp * 1000 < Date.now()) {
                    // Token已过期，清除localStorage数据
                    localStorage.clear();
                    // 执行其他过期处理逻辑，比如跳转到登录页面
                    next('/login');
                } else {
                    // Token未过期，继续进行路由跳转
                    next();
                }
            } catch (error) {
                console.error('Token解析失败', error);
                next('/login');
            }
        }
    }
});

export default router;
