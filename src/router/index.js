import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
}
const routes = [
  {
    path: '/',
    name: 'MainPage',
    component:()=>import('../views/MainPage.vue'),
  },
  {
    path: '/MainPage',
    name: 'MainPage',
    component:()=>import('../views/MainPage.vue'),
  },
  {
    path: '/Login',
    name: 'Login',
    component:()=>import('../views/Login.vue'),
  },
  {
    path: '/Signup',
    name: 'Signup',
    component:()=>import('../views/Signup.vue'),
  },
  {
    path: '/Userpage',
    name: 'Userpage',
    component:()=>import('../views/Userpage.vue'),
  },
  {
    path: '/PetList',
    name: 'PetList',
    component:()=>import('../views/PetList.vue'),
  },
  {
    path: '/PetUpload',
    name: 'PetUpload',
    component:()=>import('../views/PetUpload.vue'),
  },
  {
    path: '/MyApply',
    name: 'MyApply',
    component:()=>import('../views/MyApply.vue'),
  },
  {
    path: '/OtherApply',
    name: 'OtherApply',
    component:()=>import('../views/OtherApply.vue'),
  },
  {
    path: '/ChatPage',
    name: 'ChatPage',
    component:()=>import('../views/ChatPage.vue'),
  },
  {
    path: '/Creatorganization',
    name: 'Creatorganization',
    component:()=>import('../views/Createorganization.vue'),
  },
  {
    path: '/Organize',
    name: 'Organize',
    component:()=>import('../views/Organize.vue'),
  },
  {
    path: '/UploadPost',
    name: 'UploadPost',
    component:()=>import('../views/UploadPost.vue'),
  },
  {
    path: '/PostPage',
    name: 'PostPage',
    component:()=>import('../views/PostPage.vue'),
  },
  {
    path: '/MyPost',
    name: 'MyPost',
    component:()=>import('../views/MyPost.vue'),
  },
  {
    path: '/OtherApplyPet',
    name: 'OtherApplyPet',
    component:()=>import('../views/OtherApplyPet.vue'),
  },
]

const router = new VueRouter({
  routes
})

export default router
