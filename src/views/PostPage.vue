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



                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="font-weight: bold;">{{this.name}}</span>
                        <el-button style=" margin-left : 10px;float: right; padding: 3px 0" type="text" v-on:click="colletpost">收藏帖子</el-button>
                        <el-button style=" margin-left : 10px;float: right; padding: 3px 0" type="text"  v-on:click="likepost">点赞</el-button>
                        <el-button style="float: right; padding: 3px 0" type="text" v-if="this.root ||this.is_me === true" v-on:click="deletepost">删除帖子</el-button>
                    </div>
                    <el-avatar >
                        <img :src = "this.avatar" alt="Image" class="logoimg" v-on:click="gouser()"/>
                    </el-avatar>
                    <span style="margin-left: 10px;" v-on:click="gouser()">{{ this.p_name}}</span>

                    <span style="margin-left: 650px; font-style: italic;">{{this.like_count}}</span>
                    <span style="margin-left: 6px; font-style: italic; ">likes</span>
                    <span style="margin-left: 20px; font-style: italic;">{{this.collect_count}}</span>
                    <span style="margin-left: 6px; font-style: italic; ">collected</span>
                    <br>
                    <br>
                    <span style="font-size: 15px;white-space: pre-wrap;">{{this.text}}</span>
                    <br>
                    <br>
                    <br>
                    <img :src = "picture_id" alt="Image" style="width: 400px;" />

                    <li v-for="(pid,index) in idList" :key="index" >
                        <el-avatar >
                            <img :src = "pid" alt="Image" style="width: 400px;"/>
                        </el-avatar>
                    </li>
                    <br>
                    <br>
                    <br>
                    <el-button class="signupbotton" v-if="this.pet_id" @click="PetDetails()">关联宠物</el-button>

                </el-card>

                <el-dialog
                    title="宠物详情"
                    :visible.sync="centerDialogVisible"
                    width="46%"
                    top="20vh"
                    center
                >

                    <el-card>
                        <div slot="header" class="clearfix">
                            <span>宠物信息</span>
                            <el-button @click="adopt" style="float: right; padding: 3px 0" type="text" v-if="this.is_me === false">申请领养</el-button>

                        </div>
                        <label for="petData.name" class="char_lt">昵称 :</label>
                        <div>    {{ petData.name }}</div>
                        <br>
                        <label for="petData.breeds" class="char_lt">品种 :</label>
                        <div>    {{ petData.breeds }}</div>
                        <br>
                        <label for="petData.health" class="char_lt">健康状态 :</label>
                        <div>    {{ petData.health }}</div>
                        <br>
                        <label for="petData.notes" class="char_lt">备注 :</label>
                        <div>    {{ petData.notes }}</div>
                        <br>
                        <label for="petData.is_adopted" class="char_lt">是否被领养 : </label>
                        <div>    {{ petData.is_adopted }}</div>
                        <br>
                        <el-card :body-style="{ padding: '0px' }" style="width: 230px;">
                            <img :src = "url" alt="Image" style="width: 230px;"/>
                        </el-card>

                    </el-card>

                </el-dialog>



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
    name: "PostPage",
    data: function() {
        return {
            root:0,
            url:'',
            centerDialogVisible: false,
            p_name:'',
            p_id:'',
            avatar:'',
            is_me:false,
            name:'',
            text:'',
            like_count:0,
            collect_count:0,
            picture_id:'',
            idList:[],
            collapsed: false,
            pet_id:'',
            petData:[],
        }
    },
    mounted() {
        const token = localStorage.getItem('token');
        var dat;
        if(token) {
            const payload = token.split('.')[1];
            const decodedPayload = atob(payload);
            dat = JSON.parse(decodedPayload);
            axios.get('http://10.136.133.87:9000/CheckRoot',{
                headers: {
                    'token': token
                }
            })
                .then((response) => {

                    const { code, data} = response.data;
                    if (code===1) {
                        this.root = data;

                    }
                })
                .catch((error) => {
                    console.error(error);
                    alert('获取信息失败：' + error.message);
                });
        }
        var post_id = localStorage.getItem('post_id');
        axios.get('http://10.136.133.87:9000/GetPost',{
            params: {
                id: post_id
            }
        })
            .then((response) => {

                const { code, data} = response.data;
                if (code===1) {
                    this.name = data.name;
                    this.text = data.text;
                    this.like_count = data.like_count;
                    this.collect_count = data.collect_count;
                    this.picture_id = 'http://10.136.133.87:9000/image/' + data.picture_id;
                    this.idList = data.picArray;
                    for(let i=0; i < this.idList.length; i++){
                        this.idList[i] = 'http://10.136.133.87:9000/image/' + this.idList[i];
                    }
                    this.pet_id = data.pet_id;
                    this.p_id = data.person_id;
                    if(token && this.p_id === dat.id)this.is_me = true;

                    for (let i = 0; i < this.idList.length; i++){
                        this.idList[i].pic_id = 'http://10.136.133.87:9000/image/' + this.idList[i].pic_id;
                    }
                    axios.get('http://10.136.133.87:9000/getPerson',{
                        params: {
                            'id': this.p_id
                        }
                    })
                        .then((response) => {
                            const now=response.data.data;
                            this.p_name = now.name;
                            this.avatar = 'http://10.136.133.87:9000/image/'+now.picture_id;
                            //得到信息后复制
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                }
            })
            .catch((error) => {
                console.error(error);
                alert('获取信息失败：' + error.message);
            });

    },
    methods: {
        gouser(){
            localStorage.setItem('sto_id', this.p_id);
            this.$router.push({name:'Userpage'});
        },
        PetDetails() {
            this.centerDialogVisible = true;

            axios.get('http://10.136.133.87:9000/getPet',{
                params: {
                    'id': this.pet_id
                }
            })
                .then((response) => {
                    const { code, data} = response.data;
                    if (code===1) {
                        this.petData = data;
                        if(this.petData.health === -1)this.petData.health = "差";
                        if(this.petData.health === 0)this.petData.health = "一般";
                        if(this.petData.health === 1)this.petData.health = "好";
                        this.url = 'http://10.136.133.87:9000/image/' + this.petData.picture_id;
                    } else {
                        alert('获取信息失败');
                    }
                })
                .catch((error) => {
                    console.error(error);
                    alert('获取信息失败：' + error.message);
                });

        },
        likepost(){
            const token = localStorage.getItem('token');
            var post_id = localStorage.getItem('post_id');
            const data ={
                id: Number(post_id)
            }
            axios.post('http://10.136.133.87:9000/likePost',data,{
                headers: {
                    'token': token
                }
            })
                .then((response) => {
                    const {code}=response.data;
                    if(code){alert("点赞成功！");}
                    location.reload();
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        colletpost(){
            const token = localStorage.getItem('token');
            var post_id = localStorage.getItem('post_id');
            const data ={
                id: Number(post_id)
            }
            axios.post('http://10.136.133.87:9000/colletPost',data,{
                headers: {
                    'token': token
                }
            })
                .then((response) => {
                    const {code}=response.data;
                    if(code){alert("收藏成功！");}
                    location.reload();
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        deletepost(){
            const token = localStorage.getItem('token');
            var post_id = localStorage.getItem('post_id');
            const data ={
                id: Number(post_id)
            }
            axios.post('http://10.136.133.87:9000/DeletePost',data,{
                headers: {
                    'token': token
                }
            })
                .then((response) => {
                    const {code}=response.data;
                    if(code){alert("删除成功！");this.$router.push({name:'MainPage'});}

                })
                .catch((error) => {
                    console.error(error);
                });
        },
        adopt(){
            const token = localStorage.getItem('token');
            const data ={
                to_id: Number(this.pet_id)
            }
            axios.post('http://10.136.133.87:9000/adoptApplication',data,{
                headers: {
                    'token': token
                }
            })
                .then((response) => {
                    const {code}=response.data;
                    if(code)alert("申请成功！");

                })
                .catch((error) => {
                    console.error(error);
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
.signupbotton{
    margin-bottom: 20px;
    margin-left: 10px;
    color: #528aff;
    background-color: #ffffff;
    /* text-align: end; */
}
/* 展开样式*/
.main-aside {
    width: 200px !important;
    height: 100%;
    background-color: #ff695f;
    margin: 0px;
}

.main-header,
.main-center {
    padding: 0px;
    border-left: 2px solid #333;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}
.clearfix:after {
    clear: both
}
.author {
    font-weight: bold;
}
.box-card {
    margin-top: 60px;
    margin-left: 150px;
    width: 900px;
}
.char_lt
{
    /* color: #333; */
    text-align: left;
//font-family: '宋体';
    font-size: 15px;
    line-height: 2.5;
}
.main-container {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
}


.main-header,
.main-center {
    padding: 0px;
    border-left: 2px solid #333;
}
</style>