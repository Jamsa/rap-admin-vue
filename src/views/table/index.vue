<template>
  <div class="app-container">
    <el-table v-loading.body="listLoading" :data="list" element-loading-text="拼命加载中" border fit highlight-current-row>
      <el-table-column align="center" label="行号" width="95">
        <template scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="姓名">
        <template scope="scope">
          {{ scope.row.fullname }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="110" align="center">
        <template scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" width="110" align="center">
        <template scope="scope">
          {{ scope.row.tel }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="pageNum"
      :total="total"
      background
      layout="prev, pager, next"
      @current-change="changePage"/>

  </div>
</template>

<script>
import { getList } from '@/api/table'

export default {
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
  data() {
    return {
      list: null,
      total: 0,
      pageNum: 1,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      // this.listQuery
      // console.log('111');
      getList({ pageNum: this.pageNum }).then(response => {
        // console.log(response);
        this.list = response.data.list
        this.total = response.data.total
        this.pageNum = response.data.pageNum
        this.listLoading = false
      })
    },
    changePage(val) {
      this.pageNum = val
      this.fetchData()
    }
  }
}
</script>
