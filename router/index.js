import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'login',
        component: () =>
            import ('../views/login/VueLogin.vue')
    },
    {
        path: '/home',
        name: 'home',
        component: () =>
            import ('../views/home/VueHome.vue')
    },{
        path: '/write',
        name: 'write',
        component: () =>
            import ('../views/write/VueWrite.vue')
    },{
        path: '/manage',
        name: 'manage',
        component: () =>
            import ('../views/manage/VueManage.vue')
    },{
        path: '/details',
        name: 'detail',
        component: () =>
            import ('../views/detail/VueDetails.vue')
    },{
        path: '/reback',
        name: 'reback',
        component: () =>
            import ('../views/reback/VueReback.vue')
    }
]


const router = new VueRouter({
    mode: 'history',
    routes
})

// // 以下代码写在 router 文件夹下的 index.js 文件中，与路由表 routes 同级
// // to，要去的路径；from，来时的路径，一般用不到；next，函数，
// // 不调用的话这个守卫钩子不会进行下一步
// router.beforeEach((to, from, next) => {
//     // 判断路径是否是登录页
//       if (to.path === '/login') {
//     // 是登录页，执行下一步
//         next();
//       } else {
//     // 不是登录页，判断本地有无 token
//         let token = localStorage.getItem('Authorization');
//         if (token === null || token === ' ') {
//     // token 为空或不存在，跳转到登录页
//           next('/login');
//         } else {
//           next();
//         }
//       }
//     })

export default router