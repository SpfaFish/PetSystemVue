<template>
    <el-container class="main-container">
        <el-aside v-bind:class="asideClass">
            <LeftAside></LeftAside>
        </el-aside>
        <el-container>
            <el-header class="main-header">
                <TopNav></TopNav>
            </el-header>
            <el-main class="main-center">


                <el-row :gutter="10">
                    <el-page-header @back="goBack" content="帖子列表" style="margin-left: 60px; margin-top: 50px;">
                    </el-page-header>
                    <el-col :span="5" v-for="(posts, index) in postList" :key="index" :offset="index > 0 ? 0 : 0">
                        <el-card :body-style="{ padding: '0px' }" style="width: 250px; margin-top: 50px; margin-left: 60px;">
                            <img :src = "posts.pic_id" alt="Image" class="image" v-on:click="gopost(posts.post_id)"/>
                            <div style="padding: 14px;">
                                <span v-on:click="gopost(posts.post_id)">{{posts.name }}</span>
                                <div class="bottom clearfix">
                                    <span v-on:click="gouser(posts.person_id)" class="menu-item">{{ posts.person_id }}</span>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>


            </el-main>
        </el-container>
    </el-container>
</template>

<script>
// 导入组件
import TopNav from '@/views/TopNav.vue'
import LeftAside from '@/views/LeftAside.vue'
import axios from "axios";

// 导出模块
export default {
    name: "MainPage",
    data: function() {
        return {
            my_id:'',
            postList:[],
            collapsed: false,
            currentDate: new Date()
        }
    },
    mounted() {
        const token = localStorage.getItem('token');
        if(!token){this.$router.push({name:'Login'});}
        const payload = token.split('.')[1];
        const decodedPayload = atob(payload);
        const dat = JSON.parse(decodedPayload);
        this.my_id = dat.id;
        axios.get('http://10.136.133.87:9000/MyPost',{
            params:{
                id: dat.id
            }
        })
            .then((response) => {
                const { code, data} = response.data;
                if (code===1) {
                    this.postList = data;
                    for (let i = 0; i < this.postList.length; i++){
                        this.postList[i].person_id = dat.id;
                        this.postList[i].pic_id = 'http://10.136.133.87:9000/image/' + this.postList[i].pic_id;
                    }
                }
            })
            .catch((error) => {
                console.error(error);
                alert('获取信息失败：' + error.message);
            });
    },
    methods: {
        gouser(uid){
            localStorage.setItem('sto_id', uid);
            this.$router.push({name:'Userpage'});
        },
        gopost(postid){
            localStorage.setItem('post_id', postid);
            this.$router.push({name:'PostPage'});
        }
    },
    computed: { //计算属性
        asideClass: function() { //如果collapsed属性为true就展开不样式 反之就展开样式
            return this.collapsed ? "main-aside-collapsed" : "main-aside";
        }
    },
    components: { //引入组件
        TopNav,
        LeftAside

    },
    created: function() { //钩子函数
        this.$root.Bus.$on("Handle", value => {
            this.collapsed = value;
        });
    }
};
</script>
<style scoped>
.main-container {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
}

/* 不展开样式*/
.main-aside-collapsed {
    /* 在CSS中，通过对某一样式声明! important ，可以更改默认的CSS样式优先级规则，使该条样式属性声明具有最高优先级 */
    width: 64px !important;
    height: 100%;
    background-color: #ff695f;
    margin: 0px;
}
.logoimg {
    height: 300px;
    width: 500px;
}
/* 展开样式*/
.main-aside {
    width: 200px !important;
    height: 100%;
    background-color: #ff695f;
    margin: 0px;
}
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}
.main-header,
.main-center {
    padding: 0px;
    border-left: 2px solid #333;
}
.demo-table-expand {
    font-size: 0;
}
.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}
.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}
.time {
    font-size: 13px;
    color: #999;
}

.bottom {
    margin-top: 13px;
    line-height: 12px;
    width: 250px;
}

.button {
    padding: 0;
    margin-right: 20px;
    float: right;
}

.image {
    height: 300px;
    width: 250px;
    display: block;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}
</style>