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



                <el-table
                        :data="tableData"
                        style="width: 900px; margin-left: 150px; margin-top: 60px;">
                    <el-table-column
                            prop="from_id"
                            label="申请人id"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="pet_id"
                            label="宠物ID"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="time"
                            label="申请时间"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="stat"
                            label="申请状态"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="操作"
                            width="180">
                        <template slot-scope="scope">
                            <el-button @click="accept(scope.row)" type="text" size="small">同意</el-button>
                            <el-button @click="reject(scope.row)" type="text" size="small">拒绝</el-button>
                        </template>
                    </el-table-column>
                </el-table>




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
    name: "OtherApply",
    data: function() {
        return {
            collapsed: false,
            tableData: [],
        }
    },
    mounted() {
        const token = localStorage.getItem('token');
        if(!token){this.$router.push({name:'Login'});}
        const data ={

        }
        axios.post('http://10.136.133.87:9000/getAllAdoptApplication',data,{
            headers: {
                'token': token
            }
        })
            .then((response) => {
                const { code, data} = response.data;
                if (code===1) {
                    this.tableData = data;
                    for(let i=0; i < this.tableData.length;i++){
                        if(this.tableData[i].stat === -1)this.tableData[i].stat='已拒绝' ;
                        if(this.tableData[i].stat === 0)this.tableData[i].stat='待审核' ;
                        if(this.tableData[i].stat === 1)this.tableData[i].stat='已同意' ;
                    }
                } else {
                    alert('获取信息失败');
                }
            })
            .catch((error) => {
                console.error(error);
                alert('获取信息失败：' + error.message);
            });
    },
    methods: {
        accept(row){
            const data ={
                from_id: row.from_id,
                to_id: row.pet_id,
                time: row.time,
                stat: 1,
            }
            const token = localStorage.getItem('token');
            axios.post('http://10.136.133.87:9000/Adopt', data, {
                headers: {
                    'token': token
                }
            })
                .then((response) => {
                    const {code} = response.data;
                    if (code === 1) {
                        alert("成功");
                    }
                    else{
                        alert('失败');
                    }
                })
                .catch((error) => {
                    console.error(error);
                    alert('失败：' + error.message);
                });
        },
        reject(row){
            const data ={
                from_id: row.from_id,
                to_id: row.pet_id,
                time: row.time,
                stat: -1,
            }
            const token = localStorage.getItem('token');
            axios.post('http://10.136.133.87:9000/Adopt', data, {
                headers: {
                    'token': token
                }
            })
                .then((response) => {
                    const {code} = response.data;
                    if (code === 1) {
                        alert("成功");
                    }
                    else{
                        alert('失败');
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
</style>