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
                        <span >发布帖子</span>
                    </div>

                    <form  @submit.prevent="uploadpost" >

                        <label for="name" class="char_lt">标题</label>
                        <input type="text" id="name" v-model="name" placeholder="请输入标题" required>

                        <label for="id" class="char_lt"> 正文</label>
                        <textarea class="char" v-model="text" placeholder="请输入正文" required></textarea>

                        <label for="id" class="char_lt"> 有关宠物ID</label>
                        <input type="text" v-model="pet_id" placeholder="请输入宠物ID (请在宠物列表查看)">

                        <label for="png" class="char_lt">图片</label>
                        <el-upload
                            class="upload-demo"
                            :on-preview="handlePreview"
                            action="http://10.136.133.87:9000/image/Upload"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            multiple
                            :limit="6"
                            :on-exceed="handleExceed"
                            :file-list="fileList"
                            :on-success="get_id">
                            <el-button size="small" type="primary">点击选择图片</el-button>
                        </el-upload>


                        <button type="submit" id="submit-btn">确认发布</button>
                    </form>

                </el-card>




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
            pet_id:'',
            tot: 0,
            currentTime:'',
            name:'',
            text:'',
            fileList: [],
            idList:[],
            collapsed: false,
            picture_id:'',
        }
    },
    mounted() {
        const token = localStorage.getItem('token');
        if(!token){this.$router.push({name:'Login'});}
    },
    methods: {
        get_id(res) {
            if(this.tot === 0){this.tot++; this.picture_id = res.data;}
            else this.idList.push({pic_id: res.data});
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 6 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        },
        uploadpost() {
            const now = new Date();
            this.currentTime = now.toLocaleTimeString();
            const data ={
                name: this.name,
                text: this.text,
                picture_id: this.picture_id,
                Array: this.idList,
                pet_id: Number(this.pet_id),
            }
            const token = localStorage.getItem('token');
            axios.post('http://10.136.133.87:9000/uploadPost', data, {
                headers: {
                    'token': token
                }
            })
                .then((response) => {
                    const {code} = response.data;
                    if (code === 1) {
                        alert("发布成功");
                        this.$router.push({name:'MainPage'});
                    }
                    else{
                        alert('发布失败');
                    }
                })
                .catch((error) => {
                    console.error(error);
                    alert('失败：' + error.message);
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
.char_lt
 {
     /* color: #333; */
     text-align: left;
     font-family: '宋体';
     font-size: 15px;
     line-height: 2.5;
 }
.char
{
    height: 400px; /* 设置输入框高度 */
    width: 97%; /* 设置输入框宽度 */
    padding: 10px; /* 设置内边距 */
    border: 1px solid #ccc; /* 设置边框样式 */
    background-color: #f8f8f8; /* 设置背景色 */
    font-family: Arial, sans-serif; /* 设置字体样式 */
    resize: vertical; /* 启用垂直调整大小 */
    overflow-y: auto; /* 自动显示垂直滚动条 */
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

.main-header,
.main-center {
    padding: 0px;
    border-left: 2px solid #333;
}


input[type=text],
input[type=email]
{
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    box-sizing: border-box;
    border-radius: 4px;
}
.box-card {
    margin-top: 60px;
    margin-left: 150px;
    width: 900px;
}
button {
    background-color: aliceblue;
    color: #528aff;
    padding: 14px 20px;
    margin: 8px 0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    box-sizing: border-box;
    width: 100%;
}

/* 按钮悬停效果 */
button:hover {
    background-color: #cccccc;
}

</style>