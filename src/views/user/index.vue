<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="searchCondition.fullname" style="width: 200px;" class="filter-item" placeholder="姓名" @keyup.enter.native="query"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-add" @click="onCreate">添加</el-button>
      <!--<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="onEdit">编辑</el-button>

      <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button>

      <el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+1' v-model="showReviewer">{{$t('table.reviewer')}}</el-checkbox>    -->
    </div>
    <el-table v-loading.body="listLoading" :data="list" element-loading-text="拼命加载中" border fit highlight-current-row @row-dblclick="edit">
      <el-table-column align="center" label="行号" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <router-link :to="{ path: '/user/'+scope.row.userId }">{{ scope.row.fullname }}</router-link>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.tel }}
        </template>
      </el-table-column>
      <el-table-column label="年龄" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.birthday | ageFilter }}
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center">
        <template slot-scope="scope">
          {{ scope.row.sex | sexFilter }}
        </template>
      </el-table-column>
      <!--
            <el-table-column class-name="status-col" label="Status" width="110" align="center">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status | statusFilter">{{scope.row.status}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="created_at" label="Display_time" width="200">
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span>{{scope.row.display_time}}</span>
                </template>
            </el-table-column>
            -->
    </el-table>

    <el-pagination
      :current-page="pageNum"
      :total="total"
      background
      layout="prev, pager, next"
      @current-change="gotoPage"/>

  </div>
</template>

<script>
import userApi from '@/api/user'

const obj = {
  options: {
    moduleName: 'user',
    api: userApi,
    createPath: '/user/create',
    editPath: '/user/'
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
    ageFilter(birthDay) {
      if (birthDay) {
        const today = new Date()
        const birthday = new Date()
        birthday.setTime(birthDay)

        let age = today.getFullYear() - birthday.getFullYear()
        const m = today.getMonth() - birthday.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
          age--
        }
        return age + ''
      } else {
        return ''
      }
    },
    sexFilter(sex) {
      return (sex === 'M') ? '男' : '女'
    }
  },
  data() {
    const moduleState = this.$store.state.globstate['user'] || {}
    return {
      list: null,
      total: 0,
      pageNum: moduleState['pageNum'] || 1,
      listLoading: true,
      searchCondition: moduleState['searchCondition'] || {}
    }
  },
  created() {
    this.query()
  },
  methods: {
    query() {
      this.listLoading = true
      // this.listQuery
      // console.log('111');
      userApi.getList({ pageNum: this.pageNum, fullname: this.searchCondition.fullname }).then(response => {
        // console.log(response);
        this.list = response.data.list
        this.total = response.data.total
        this.pageNum = response.data.pageNum
        this.$store.dispatch('saveState', { module: 'user', key: 'pageNum', value: this.pageNum })
        this.$store.dispatch('saveState', { module: 'user', key: 'searchCondition', value: this.searchCondition })
        this.listLoading = false
      }, response => {
        this.listLoading = false
      })
    },
    gotoPage(val) {
      this.pageNum = val
      this.query()
    },
    edit(row, event) {
      this.$router.push({ path: '/user/' + row.primaryKey })
    },
    create() {
      this.$router.push({ path: '/user/create' })
    }
  }
}
export default obj
</script>
