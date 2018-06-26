<template>
    <div class="app-container">
        <el-row>
            <el-col><el-button type="primary" @click="onCreate" >创建</el-button></el-col> <el-col>
            <el-form ref="searchForm" :model="searchCondition">
                <el-form-item label="姓名">
                    <el-input v-model="searchCondition.fullname"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="fetchData" >查询</el-button></el-col>
        </el-row>
        <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row @row-dblclick="onDoubleClick">
            <el-table-column align="center" label='行号' width="95">
                <template scope="scope">
                    {{scope.$index+1}}
                </template>
            </el-table-column>
            <el-table-column label="姓名">
                <template scope="scope">
                    <router-link :to="{path: '/user/'+scope.row.userId}">{{scope.row.fullname}}</router-link>
                </template>
            </el-table-column>
            <el-table-column label="用户名" width="110" align="center">
                <template scope="scope">
                    <span>{{scope.row.username}}</span>
                </template>
            </el-table-column>
            <el-table-column label="电话" width="110" align="center">
                <template scope="scope">
                    {{scope.row.tel}}
                </template>
            </el-table-column>
            <el-table-column label="年龄" width="110" align="center">
                <template scope="scope">
                    {{scope.row.birthday| ageFilter}}
                </template>
            </el-table-column>
            <el-table-column label="性别" align="center">
                <template scope="scope">
                    {{scope.row.sex| sexFilter}}
                </template>
            </el-table-column>
            <!--
            <el-table-column class-name="status-col" label="Status" width="110" align="center">
                <template scope="scope">
                    <el-tag :type="scope.row.status | statusFilter">{{scope.row.status}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="created_at" label="Display_time" width="200">
                <template scope="scope">
                    <i class="el-icon-time"></i>
                    <span>{{scope.row.display_time}}</span>
                </template>
            </el-table-column>
            -->
        </el-table>

        <el-pagination
                background
                layout="prev, pager, next"
                @current-change="changePage"
                :current-page="pageNum"
                :total="total">
        </el-pagination>

    </div>
</template>

<script>
  import {getList, getDetail} from '@/api/user'

  export default {
    data() {
      let moduleState = this.$store.state.globstate['user']||{}
      return {
        list: null,
        total: 0,
        pageNum: moduleState['pageNum']||1,
        listLoading: true,
        searchCondition:moduleState['searchCondition']||{}
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        }
        return statusMap[status]
      },
      ageFilter(birthDay){
        if(birthDay) {
          let today = new Date();
          let birthday = new Date();
          birthday.setTime(birthDay);

          let age = today.getFullYear() - birthday.getFullYear();
          let m = today.getMonth() - birthday.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
            age--;
          }
          return age+'';
        }else{
          return '';
        }
      },
      sexFilter(sex){
        return (sex==='M')?'男':'女'
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        //this.listQuery
        // console.log('111');
        getList({pageNum: this.pageNum,fullname:this.searchCondition.fullname}).then(response => {
          //console.log(response);
          this.list = response.data.list;
          this.total = response.data.total;
          this.pageNum = response.data.pageNum;
          this.$store.dispatch('saveState',{module:'user',key:'pageNum',value:this.pageNum})
          this.$store.dispatch('saveState',{module:'user',key:'searchCondition',value:this.searchCondition})
          this.listLoading = false;
        }, response => {
          this.listLoading = false
        })
      },
      changePage(val){
        this.pageNum = val;
        this.fetchData();
      },
      onDoubleClick(row,event){
        this.$router.push({path:'/user/'+row.primaryKey})
      },
      onCreate(){
        this.$router.push({path:'/user/create'})
      }
    }
  }
</script>
