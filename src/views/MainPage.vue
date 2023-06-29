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

                <div style="width: 1000px; margin-left: 100px; margin-top: 40px;">
                    <span class="demonstration"></span>
                    <el-carousel :interval="4000" type="card" height="300px">
                        <el-carousel-item v-for="(png,index) in pngList" :key="index">

                            <img :src = "png" alt="Image" class="logoimg" @click="jump"/>

                        </el-carousel-item>
                    </el-carousel>
                </div>


                <el-row :gutter="10">
                    <div style="display: flex;">
                    <el-page-header @back="goBack" content="帖子列表" style="margin-left: 60px; margin-top: 50px;">
                    </el-page-header>
                        <span style="margin-top: 50px; font-size: 15px; margin-left: 60px;">关键词:</span>
                    <el-input style="width: 200px; margin-top: 43px; margin-left: 10px;" type="text" v-model="searchname"></el-input>
                        <span style="margin-top: 50px; font-size: 15px; margin-left: 10px;">点赞数:</span>
                        <div style="margin-top: 47px; margin-left: 10px;">
                            <el-radio-group v-model="searchlike" size="small">
                                <el-radio-button label="0"></el-radio-button>
                                <el-radio-button label="10"></el-radio-button>
                                <el-radio-button label="100"></el-radio-button>
                                <el-radio-button label="1000"></el-radio-button>
                            </el-radio-group>
                        </div>
                        <span style="margin-top: 52px; font-size: 15px; margin-left: 10px;">收藏数:</span>
                        <div style="margin-top: 47px; margin-left: 10px;">
                            <el-radio-group v-model="searchcollect" size="small">
                                <el-radio-button label="0"></el-radio-button>
                                <el-radio-button label="10"></el-radio-button>
                                <el-radio-button label="100"></el-radio-button>
                                <el-radio-button label="1000"></el-radio-button>
                            </el-radio-group>
                        </div>
                    <el-button style="height: 40px; margin-top: 43px; margin-left: 10px;" v-on:click="searchpost">搜索</el-button>
                    </div>
                    <div >

                    <el-col :span="5" v-for="(posts, index)  in postList.slice((currentPage-1) * PageSize, currentPage * PageSize)" :key="index" :offset="index > 0 ? 0 : 0">
                        <el-card :body-style="{ padding: '0px' }" style="width: 250px; margin-top: 50px; margin-left: 60px;">
                            <img :src = "posts.picture_id" alt="Image" class="image" v-on:click="gopost(posts.id)"/>
                            <div style="padding: 14px;">
                                <span v-on:click="gopost(posts.id)" class="postname">{{posts.name }}</span>
                                <div class="bottom clearfix">
                                    <span v-on:click="gouser(posts.person_id)" class="pname">{{ posts.person_name }}</span>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    </div>
                </el-row>
                <el-pagination
                               @current-change="handleCurrentChange"
                               :current-page="currentPage"
                               :page-size="PageSize" layout="total, prev, pager, next, jumper"
                               :total="totalCount"
                               style="margin-left: 40%; margin-top: 40px;">
                </el-pagination>


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
            // 默认显示第几页
            currentPage:1,
            // 总条数，根据接口获取数据长度(注意：这里不能为空)
            totalCount:0,
            // 默认每页显示的条数（可修改）
            PageSize:12,
            searchname:'',
            searchlike:'',
            searchcollect:'',
            my_id:'',
            postList:[],
            pngList:[
                'https://img2.baidu.com/it/u=1114221024,412737789&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
                 'https://img1.baidu.com/it/u=1505021688,2426333584&fm=253&fmt=auto&app=120&f=JPEG?w=928&h=500',
                'https://img.chongwuzhi.com.cn/2023/02/20230206143042374.png?imageView2/0/format/webp/q/75|imageslim',
                'https://img1.baidu.com/it/u=1916585894,1667750262&fm=253&fmt=auto&app=138&f=JPEG?w=883&h=500'],
            collapsed: false,
            currentDate: new Date()
        }
    },
    mounted() {
        axios.get('http://10.136.133.87:9000/searchPost',)
            .then((response) => {
                const { code, data} = response.data;
                if (code===1) {
                    this.postList = data;
                    this.totalCount = this.postList.length;
                    for (let i = 0; i < this.postList.length; i++){
                        this.postList[i].picture_id = 'http://10.136.133.87:9000/image/' + this.postList[i].picture_id;
                    }
                }
            })
            .catch((error) => {
                console.error(error);
                alert('获取信息失败：' + error.message);
            });
    },
    methods: {
        // 显示第几页
        handleCurrentChange(val) {
            // 改变默认的页数
            this.currentPage=val
        },
        gouser(uid){
            localStorage.setItem('sto_id', uid);
            this.$router.push({name:'Userpage'});
        },
        gopost(postid){
            localStorage.setItem('post_id', postid);
            this.$router.push({name:'PostPage'});
        },
        jump() {
            window.open('https://sr.mihoyo.com/', '_blank')
        },
        searchpost(){
            axios.get('http://10.136.133.87:9000/searchPost',{
                params:{
                    name: this.searchname,
                    like_count: this.searchlike,
                    collect_count: this.searchcollect
                }
            })
                .then((response) => {
                    const { code, data} = response.data;
                    if (code===1) {
                        this.postList = data;
                        this.totalCount = this.postList.length;
                        for (let i = 0; i < this.postList.length; i++){
                            this.postList[i].picture_id = 'http://10.136.133.87:9000/image/' + this.postList[i].picture_id;
                        }
                    }
                })
                .catch((error) => {
                    console.error(error);
                    alert('获取信息失败：' + error.message);
                });
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
.postname{
    width: 230px;
    overflow:hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    display: -webkit-box;
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
.pname{
    font-size: 14px;
    color: #9d9d9d;
}
.clearfix:after {
    clear: both
}
</style>