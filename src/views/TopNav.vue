<template>
    <el-menu class="el-menu-demo" mode="horizontal" background-color="#ffffff" text-color="333333" active-text-color="#333333">
        <el-button class="buttonimg">

        </el-button>
        <el-button class="loginbotton" v-if="this.IsLogin === false" v-on:click="login">登录</el-button>
        <el-button class="signupbotton" v-if="this.IsLogin === false" v-on:click="signup">注册</el-button>
        <el-submenu index="2" class="submenu">
            <template slot="title">
                <el-avatar :src="avatar" @error="errorHandler">
                <img src = "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202003%2F25%2F20200325142318_jWPnn.thumb.400_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1690593076&t=47969880749444460d2d4c6b07ea969d" alt="Image" class="logoimg"/>
                </el-avatar>
            </template>
            <el-menu-item index="2-1" v-on:click="chatpage">私信</el-menu-item>
            <el-menu-item index="2-2" v-on:click="userpage">个人中心</el-menu-item>
            <el-menu-item v-on:click="idquit" index="2-3">退出</el-menu-item>
        </el-submenu>
    </el-menu>
</template>

<script>
import axios from "axios";

export default {
    name: "TopNav",
    data: function() {
        return {
            avatar:'',
            IsLogin:false,
            collapsed: false,
            //imgshow: require("../assets/img/show.png"),
            //imgsq: require("../assets/img/sq.png")
        }
    },
    mounted() {
        const token = localStorage.getItem('token');
        const payload = token.split('.')[1];
        const decodedPayload = atob(payload);
        const dat = JSON.parse(decodedPayload);
        if(dat.id) this.IsLogin=true;


        axios.get('http://10.136.133.87:9000/getPerson',{
            params: {
                'id': dat.id
            }
        })
            .then((response) => {
                const now=response.data.data;
                this.avatar = 'http://10.136.133.87:9000/image/'+now.picture_id;
                //得到信息后复制
            })
            .catch((error) => {
                console.error(error);
            });

    },
    methods: {
        errorHandler() {
            return true
        },
        doToggle: function() { //主要控制collapsed为true和false
            this.collapsed = !this.collapsed;
            this.$root.Bus.$emit("Handle", this.collapsed);
        },
        exit:function(){
            this.$router.push({
                path:'/'
            })
        },
        idquit(){
            localStorage.removeItem('token');
            alert('退出成功');
            location.reload();
        },
        login(){
            this.$router.push({name:'Login'});
        },
        signup(){
            this.$router.push({name:'Signup'});
        },
        userpage(){
            localStorage.setItem('sto_id', '');
            if(this.$route.path === '/Userpage')location.reload();
            else this.$router.push({name:'Userpage'});
        },
        chatpage(){
            this.$router.push({name:'ChatPage'});
        }
    }

}
</script>

<style scoped>

.el-menu-vertical-demo:not(.el-menu--collapse) {
    border: none;
}

.submenu {
    float: right;
}

.buttonimg {
    height: 60px;
    background-color: transparent;
    border: none;
}
.showimg {
    width: 26px;
    height: 26px;
    position: absolute;
    top: 17px;
    left: 17px;
}
.loginbotton{
    margin-left: 1000px;
    color: #528aff;
    background-color: #ffffff;
    text-align: end;
}
.signupbotton{
    margin-left: 10px;
    color: #528aff;
    background-color: #ffffff;
    /* text-align: end; */
}
.showimg:active {
    border: none;
}
</style>