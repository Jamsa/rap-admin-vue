<template>
  <div class="app-container">
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row>
      <el-table-column align="center" label='行号' width="95">
        <template scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column label="姓名">
        <template scope="scope">
          {{scope.row.fullname}}
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
import { getList } from '@/api/table'

export default {
  data() {
    return {
      list: null,
      total:0,
      pageNum:1,
      listLoading: true
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
      getList({pageNum:this.pageNum}).then(response => {
          //console.log(response);
        this.list = response.data.list;
        this.total = response.data.total;
        this.pageNum = response.data.pageNum;
        this.listLoading = false;
      })
    },
    changePage(val){
        this.pageNum = val;
        this.fetchData();
    }
  }
}
</script>
