import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/index.vue'
import Rank from '../views/rank.vue'
import Rules from '../views/rules.vue'
Vue.use(VueRouter)

const router = new VueRouter({
    routes: [{
            path: '/',
            component: Index,
            name: 'Index',
            meta: {
                keepAlive: true,
                title: '全民抗疫',
            }
        },
        {
            path: '/rank',
            component: Rank,
            name: 'Rank',
            meta: {
                title: '排行榜',
            }
        },
        {
          path: '/rules',
          component: Rules,
          name: 'Rules',
          meta: {
              title: '说明规则',
          }
      }
    ],
    scrollBehavior(to, from, savedPosition) {
        return { x: 0, y: 0 }
    }
})

export default router;
router.beforeEach(function(to, from, next) {
    document.title = to.meta.title;
    next()
})