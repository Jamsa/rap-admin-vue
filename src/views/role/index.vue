<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="名称" v-model="searchCondition.name">
      </el-input>
      <el-input @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="代码" v-model="searchCondition.code">
      </el-input>
      <el-select @change='fetchData' style="width: 140px" class="filter-item" v-model="searchCondition.sort" placeholder="排序方式">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="fetchData">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="onCreate" type="primary" icon="el-icon-add">添加</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="onEdit" type="primary" icon="el-icon-edit">编辑</el-button>
      <!-- 
      <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button>
      
      <el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+1' v-model="showReviewer">{{$t('table.reviewer')}}</el-checkbox>    -->
    </div>
    <!-- 
    <el-row>
      <el-col>
        <el-button type="primary" @click="onCreate" >创建</el-button>
        <el-button type="primary" @click="onEdit" >编辑</el-button>
      </el-col>
      <el-col>
        <el-form ref="searchForm" :model="searchCondition">
          <el-form-item label="名称">
            <el-input v-model="searchCondition.name"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="fetchData" >查询</el-button>
      </el-col>
    </el-row>
    -->
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row @row-dblclick="onDoubleClick" @current-change="onCurrentChange">
      <el-table-column align="center" label='行号' width="95">
        <template scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column label="名称">
        <template scope="scope">
          <router-link :to="{path: '/role/'+scope.row.roleId}">{{scope.row.name}}</router-link>
        </template>
      </el-table-column>
      <el-table-column label="代码" width="110" align="center">
        <template scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="110" align="center">
        <template scope="scope">
          {{scope.row.memo}}
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

    <el-dialog title="角色明细" :visible.sync="dialogVisible" @close="fetchData">
      <RoleForm :primaryKey="detailId" :load="dialogVisible"  v-on:deleted="onDelete"/>
    </el-dialog>
  </div>
</template>

<script>
 import { getList, getDetail } from '@/api/role'
 import { default as RoleForm } from './detail.vue'
// import waves from '@/directive/waves' // 水波纹指令

 export default {
   data() {
     let moduleState = this.$store.state.globstate['role'] || {}
     return {
       list: null,
       total: 0,
       pageNum: moduleState['pageNum'] || 1,
       listLoading: true,
       searchCondition: moduleState['searchCondition'] || {name: '', code: '', sort: ''},
       sortOptions: [{label: '名称升序', value: 'name asc'}, {label: '名称倒序', value: 'name asc'}, {label: '编号升序', value: 'code asc'}, {label: '编号倒序', value: 'code desc'}],
       dialogVisible: false,
       detailId: 'new'
     }
   },
   components: {
     RoleForm
   },
   directives: {
     //waves
   },
   filters: {
     statusFilter(status) {
       const statusMap = {
         published: 'success',
         draft: 'gray',
         deleted: 'danger'
       }
       return statusMap[status]
     }
   },
   created() {
     this.fetchData()
   },
   methods: {
     fetchData() {
       this.listLoading = true
       getList({ pageNum: this.pageNum }).then(response => {
         this.list = response.data.list
         this.total = response.data.total
         this.pageNum = response.data.pageNum
         this.$store.dispatch('saveState', { module: 'role', key: 'pageNum', value: this.pageNum })
         this.$store.dispatch('saveState', { module: 'role', key: 'searchCondition', value: this.searchCondition })
         this.listLoading = false
       }, response => {
         this.listLoading = false
       })
     },
     changePage(val) {
       this.pageNum = val
       this.fetchData()
     },
     onDelete() {
       this.dialogVisible = false
       // this.fetchData()
     },
     onDoubleClick(row, event) {
       // this.$router.push({path:'/role/'+row.primaryKey})
       this.detailId = row.primaryKey
       this.dialogVisible = true
       /* this.$nextTick(() => {
        *   this.$refs.detail.fetchData(row.primaryKey)
        * }) */
     },
     onCurrentChange(currentRow, oldRow) {
       this.detailId = currentRow ? currentRow.primaryKey : 'new'
     },
     onCreate() {
       // this.$router.push({path:'/role/create'})
       this.dialogVisible = true
       this.detailId = 'new'
       /* this.$nextTick(() => {
        *   this.$refs.detail.fetchData('new')
        * }) */
     },
     onEdit() {
       if (this.detailId !== 'new') {
         this.dialogVisible = true
       } else {
         this.$message('请先选择一行记录！')
       }
       /* this.$nextTick(() => {
        *   this.$refs.detail.fetchData('new')
        * }) */
     }
   }
 }
</script>
