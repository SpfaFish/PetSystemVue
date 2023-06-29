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

                <div class="container">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>个人信息</span>
                        <el-button style=" margin-left : 10px;float: right; padding: 3px 0" type="text" v-if="this.is_me === false" v-on:click="startchat">私聊ta</el-button>
                        <el-button style=" margin-left : 10px;float: right; padding: 3px 0" type="text" v-if="this.is_me === false && this.attentioned === true" v-on:click="unattention">取消关注</el-button>
                        <el-button style=" margin-left : 10px;float: right; padding: 3px 0" type="text" v-if="this.is_me === false && this.attentioned === false" v-on:click="attention">关注</el-button>
                        <el-button style="float: right; padding: 3px 0" type="text" v-if="this.is_me === true" v-on:click="updateprofile">修改信息</el-button>
                    </div>
                    <el-avatar :src ="avatar" @error="errorHandler">
                        <img src = "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202003%2F25%2F20200325142318_jWPnn.thumb.400_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1690593076&t=47969880749444460d2d4c6b07ea969d" alt="Image" class="logoimg"/>
                    </el-avatar>
                    <el-upload
                        class="upload-demo"
                        ref="upload"
                        action="http://10.136.133.87:9000/image/Upload"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :file-list="fileList"

                        :on-success="get_id"
                    v-if="this.is_me === true">
                        <el-button slot="trigger" size="small" type="primary">选取头像</el-button>
                    </el-upload>
                    <label for="name" class="char_lt">昵称:</label>
                    <el-input type="text" id="name" v-model="name" required></el-input>
                    <br>
                    <label for="id" class="char_lt">账号ID :</label>
                    <el-input type="text" id="id" v-model="id" disabled></el-input>
                    <label for="province" class="char_lt">省份:</label>
                    <el-input type="text" id="province" v-model="province"></el-input>
                    <br>
                    <label for="city_or_county" class="char_lt">城市 :</label>
                    <el-input type="text" id="city_or_county" v-model="city_or_county"></el-input>
                    <br>
                    <label for="distinguish" class="char_lt">下辖地区 : </label>
                    <el-input type="text" id="distinguish" v-model="distinguish"></el-input>
                    <br>
                    <label for="community" class="char_lt">社区 :</label>
                    <el-input type="text" id="community" v-model="community"></el-input>
                    <br>
                    <label for="email" class="char_lt">邮箱 :</label>
                    <el-input type="text" id="email" v-model="email"></el-input>
                    <br>
                    <label for="oldpassword" class="char_lt">旧密码 :</label>
                    <el-input type="text" id="odlpassword" v-model="oldpassword"></el-input>
                    <br>
                    <label for="newpassword" class="char_lt">新密码 :</label>
                    <el-input type="text" id="newpassword" v-model="newpassword"></el-input>
                </el-card>

                    <el-card class="box-card2">
                        <div slot="header" class="clearfix">
                            <span>关注列表</span>
                        </div>
                        <div class="chat-container" ref="chatContainer">
                            <div class="chat-box" ref="chatBox">
                                <el-scrollbar ref="scrollbar" wrap-class="scrollbar-wrap">
                                    <ul class="message-list" ref="messageList">

                                        <li v-for="(attention,index) in attentionlist" :key="index" @click="gouser(attention.id)" >
                                            <el-avatar >
                                                <img :src = "attention.avatar" alt="Image" class="logoimg"/>
                                            </el-avatar>
                                            <span class="author">{{ attention.name }}</span>
                                        </li>
                                    </ul>
                                </el-scrollbar>
                            </div>

                        </div>

                    </el-card>

                </div>
                
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
    name: "UserPage",
    data: function() {
        return {
            avatar:'',
            attentioned :false,
            is_me :false,
            collapsed: false,
            id: '',
            password:'',
            name: '',
            province: '',
            city_or_county: '',
            distinguish: '',
            community: '',
            email: '',
            oldpassword: '',
            newpassword: '',
            attentionlist: [],
            attentionlistl: [],
            fileList:[],
            idList:[],
        }
    },
    mounted() {
        const token = localStorage.getItem('token');
        if(!token){this.$router.push({name:'Login'});}
        const payload = token.split('.')[1];
        const decodedPayload = atob(payload);
        const dat = JSON.parse(decodedPayload);
        var to_id = dat.id;
        const sto_id = localStorage.getItem('sto_id');
        if(sto_id)to_id = sto_id;
        //获得个人信息
        axios.get('http://10.136.133.87:9000/getPerson',{
            params: {
                'id': to_id
            }
        })
            .then((response) => {
                const now=response.data.data;
                this.avatar = 'http://10.136.133.87:9000/image/'+now.picture_id;
                this.id=now.id;
                if(dat.id == now.id)this.is_me = true;
                this.password=now.password;
                this.name=now.name;
                this.province=now.province;
                this.city_or_county=now.city_or_county;
                this.distinguish=now.distinguish;
                this.community=now.community;
                this.email=now.email;
                //得到信息后复制
            })
            .catch((error) => {
                console.error(error);
            });
        //获得关注列表
        axios.get('http://10.136.133.87:9000/MyAttention',{
            params: {
                'id': Number(to_id)
            }
        })
            .then((response) => {
                const now=response.data.data;
                for(let i=0; i < now.length ; i++){
                    axios.get('http://10.136.133.87:9000/getPerson',{
                        params: {
                            'id': now[i]
                        }
                    })
                        .then((response) => {
                            const nowl=response.data.data;
                            this.attentionlist.push({id: now[i],avatar: 'http://10.136.133.87:9000/image/'+nowl.picture_id,name: nowl.name});
                        })
                        .catch((error) => {
                            console.error(error);
                            alert('无法调取信息：' + error.message);
                        });

                }
                //得到信息后复制
            })
            .catch((error) => {
                console.error(error);
            });
        //看是否关注
        if(this.is_me === false){
            const data = {
                id: Number(to_id),
            };
            const token = localStorage.getItem('token');
            axios.post('http://10.136.133.87:9000/CheckAttention',data,{
                headers: {
                    'token': token
                }
            })
                .then((response) => {
                    const now=response.data.data;
                    this.attentioned = now;
                })
                .catch((error) => {
                    console.error(error);
                    alert('无法调取信息：' + error.message);
                });
        }
    },
    methods: {
        errorHandler() {
            return true
        },
        get_id(res) {
            this.idList.push(res.data);
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        beforeRemove(file) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        },
        updateprofile(){
            const data = {
                name: this.name,
                oldPassword: this.oldpassword,
                newPassword: this.newpassword,
                province: this.province,
                city_or_county: this.city_or_county,
                distinguish: this.distinguish,
                community: this.community,
                email: this.email,
                picture_id: this.idList[0],
            };
            const token = localStorage.getItem('token');
            axios.post('http://10.136.133.87:9000/updateProfile', data,{
                headers: {
                    'token': token
                }
            })
                .then((response) => {
                    const { code } = response.data;
                    if (code===1) {
                        alert('修改成功');
                        location.reload();
                    } else {
                        alert('修改失败');
                    }
                })
                .catch((error) => {
                    console.error(error);
                    alert('修改失败：' + error.message);
                });
        },
        attention(){//关注
            const data = {
                id: this.id,
            };
            const token = localStorage.getItem('token');
            axios.post('http://10.136.133.87:9000/LikePerson', data,{
                headers: {
                    'token': token
                }
            })
                .then((response) => {
                    const { code } = response.data;
                    if (code===1) {
                        alert('成功');
                        location.reload();
                    } else {
                        alert('失败');
                    }
                })
                .catch((error) => {
                    console.error(error);
                    alert('失败：' + error.message);
                });
        },
        unattention(){
            const data = {
                id: Number(this.id),
            };
            const token = localStorage.getItem('token');
            axios.post('http://10.136.133.87:9000/UnLikePerson', data,{
                headers: {
                    'token': token
                }
            })
                .then((response) => {
                    const { code } = response.data;
                    if (code===1) {
                        alert('成功');
                        location.reload();
                    } else {
                        alert('失败');
                    }
                })
                .catch((error) => {
                    console.error(error);
                    alert('失败：' + error.message);
                });
        },
        gouser(uid){
            localStorage.setItem('sto_id', uid);
            location.reload();
        },
        startchat(){
            const token = localStorage.getItem('token');
            const data = {
                to_id : this.id,
                text : '你好~',
            };
            axios.post('http://10.136.133.87:9000/sendMessage',data,{
                headers: {
                    'token': token
                }
            })
                .then((response) => {
                    const { code } = response.data;
                    if (code===1) {
                        this.$router.push({name:'ChatPage'});
                    } else {
                        alert('失败');
                    }
                    //得到信息后复制
                })
                .catch((error) => {
                    console.error(error);
                    alert('无法调取信息：' + error.message);
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
.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}
.box-card2 {
    font-family: -apple-system, BlinkMacSystemFont, "San Francisco", "Helvetica Neue", "Noto Sans", "Noto Sans CJK SC", "Noto Sans CJK", "Source Han Sans", "PingFang SC", "Segoe UI", "Microsoft YaHei", sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: rgba(0, 0, 0, .75);
    margin-top: 60px;
    margin-left: 3px;
    width: 300px;

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
    margin-left: 10px;
}
.box-card {
    margin-top: 60px;
    margin-left: 150px;
    width: 600px;
}
.user-box {
    width: 700px;
    height: 950px;
    background-color: #fff;
    margin: 100px auto;
    border-radius: 10px;
    box-shadow: 0 0 5px #000;
    padding: 20px;
    color: aliceblue;
    background-color: #9a52ff;
}
.chat-box {
    overflow-y: auto;
    flex: 1;
    padding: 5px;
    border: 1px solid #ccc;
    height: 700px;
}
/* “邮箱”“省份”等相关标题的字体 */
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

/* 不展开样式*/
.main-aside-collapsed {
    /* 在CSS中，通过对某一样式声明! important ，可以更改默认的CSS样式优先级规则，使该条样式属性声明具有最高优先级 */
    width: 64px !important;
    height: 100%;
    background-color: #ff695f;
    margin: 0px;
}

/* 展开样式*/
.main-aside {
    width: 200px !important;
    height: 100%;
    background-color: #ff695f;
    margin: 0px;
}
.container {
    display: flex;
}
.main-header,
.main-center {
    padding: 0px;
    border-left: 2px solid #333;
}
</style>