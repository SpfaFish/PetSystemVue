<template>
    <el-menu default-active="2" class="el-menu-vertical-demo" background-color="#ffffff" text-color="#333333"
             active-text-color="#ffd04b" :collapse="collapsed" :collapse-transition="bb" >
        <div class="logobox" v-on:click="mainpage">
            <img class="logoimg" src="../assets/logo3.png" alt="" >
        </div>
        <el-menu-item index="1" v-on:click="mainpage">
            <i class="el-icon-menu" v-on:click="mainpage"></i>
            <span slot="title" v-on:click="mainpage">首页</span>
        </el-menu-item>
        <el-submenu index="2">
            <template slot="title">
                <i class="el-icon-location"></i>
                <span>宠物中心</span>
            </template>
            <el-menu-item-group>
                <template slot="title">我的宠物</template>
                <el-menu-item index="2-1" v-on:click="petlist">宠物列表</el-menu-item>
                <el-menu-item index="2-2" v-on:click="petupload">上传宠物</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
                <template slot="title">申请记录</template>
                <el-menu-item index="2-3" v-on:click="myapply">我的申请</el-menu-item>
                <el-menu-item index="2-4" v-on:click="otherapply">他人申请</el-menu-item>
            </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
            <template slot="title">
                <i class="el-icon-menu"></i>
                <span>组织中心</span>
            </template>
            <el-menu-item-group>
                <template slot="title">我的组织</template>
                <el-menu-item index="3-1" v-on:click="org">组织列表</el-menu-item>
                <el-menu-item index="3-2" v-on:click="creatorg">创建组织</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="申请记录">
                <el-menu-item index="3-3">我的申请</el-menu-item>
                <el-menu-item index="3-4">管理申请</el-menu-item>
            </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="4" v-on:click="mypost">
            <i class="el-icon-document" ></i>
            <span slot="title">我的帖子</span>
        </el-menu-item>
        <el-menu-item index="5" v-on:click="uploadpost">
            <i class="el-icon-document"></i>
            <span slot="title">发布帖子</span>
        </el-menu-item>

    </el-menu>
</template>
<script>
export default {
    name: "LeftAside",
    data: function() {
        return {
            collapsed: false,
            bb: true
        }
    },
    methods: {
        mainpage(){
            this.$router.push({name:'MainPage'});
        },
        petlist(){
            this.$router.push({name:'PetList'});
        },
        petupload(){
            this.$router.push({name:'PetUpload'});
        },
        myapply(){
            this.$router.push({name:'MyApply'});
        },
        otherapply(){
            this.$router.push({name:'OtherApply'});
        },
        creatorg(){
            this.$router.push({name:'Creatorganization'});
        },
        org(){
            this.$router.push({name:'Organize'});
        },
        uploadpost(){
            this.$router.push({name:'UploadPost'});
        },
        mypost(){
            this.$router.push({name:'MyPost'});
        }

    },
    created: function() { //钩子函数
        this.$root.Bus.$on("Handle", value => {
            this.collapsed = value;
        });
    }

}
</script>
<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 1900px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    border: none;
    text-align: left;
}

.el-menu-item-group__title {
    padding: 0px;
}

.el-menu-bg {
    background-color: #9d9d9d !important;
    color: #528aff
}

.el-menu {
    border: none;
}

.logobox {
    height: 40px;
    line-height: 40px;
    color: #9d9d9d;
    font-size: 20px;
    text-align: center;
    padding: 20px 0px;
}

.logoimg {
    height: 80px;
    margin-top: -17px;
}

.TTTITLE
{
    height: 40px;
    line-height: 50px;
    color: #70f1b5;
    font-size: 25px;
}
</style>