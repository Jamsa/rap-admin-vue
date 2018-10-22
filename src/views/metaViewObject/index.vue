<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="searchCondition.objectName" style="width: 200px;" class="filter-item" placeholder="名称" @keyup.enter.native="query"/>
      <el-input v-model="searchCondition.objectCode" style="width: 200px;" class="filter-item" placeholder="代码" @keyup.enter.native="query"/>
      <el-select v-model="searchCondition.sort" style="width: 140px" class="filter-item" placeholder="排序方式" @change="query">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.value"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="query">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-add" @click="add">添加</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="edit">编辑</el-button>
      <!--
      <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button>

      <el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+1' v-model="showReviewer">{{$t('table.reviewer')}}</el-checkbox>    -->
    </div>

    <el-table v-loading.body="loading" :data="list" element-loading-text="拼命加载中" border fit highlight-current-row @row-dblclick="edit" @current-change="selectRow">
      <el-table-column align="center" label="行号" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.objectName }}</span>
          <!--<router-link :to="{ path: '/metaViewObject/'+scope.row.viewObjectId }">{{ scope.row.objectName }}</router-link>-->
        </template>
      </el-table-column>
      <el-table-column label="代码" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.objectCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表名" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.tableCode }}
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="pageNum"
      :total="total"
      background
      layout="prev, pager, next"
      @current-change="gotoPage"/>

    <el-dialog :visible.sync="dialogVisible" title="明细" @close="query">
      <MetaViewObjectForm :record-id="recordId" :visible="dialogVisible" @deleted="closeDialog"/>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/metaViewObject'
import {listPageMixin} from '@/utils/views'
import { default as MetaViewObjectForm } from './detail.vue'

// import waves from '@/directive/waves' // 水波纹指令

export default {
  mixins: [listPageMixin],
  components: {
    MetaViewObjectForm
  },
  directives: {
    // waves
  },
  data() {
    return {
      api: api,
      moduleName: 'metaViewObject',
      keyFieldName: 'viewObjectId',
      sortOptions: [{label: '名称升序', value: 'objectName asc'}, {label: '名称倒序', value: 'objectName asc'}, {
        label: '代码升序',
        value: 'objectCode asc'
      }, {label: '编号倒序', value: 'objectCode desc'}],
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
  }
}
</script>
