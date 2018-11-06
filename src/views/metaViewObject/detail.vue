<template>

  <div v-loading.body="loading" class="app-container" element-loading-text="拼命加载中" >
    <el-tabs v-model="activeTabName" >
      <el-tab-pane label="明细信息" name="detail">
        <el-form ref="detailForm" :model="detail" label-width="120px">
          <el-form-item label="名称">
            <el-input v-model="detail.objectName"/>
          </el-form-item>
          <el-form-item label="代码">
            <el-input v-model="detail.objectCode"/>
          </el-form-item>
          <el-form-item label="表备注">
            <el-input v-model="detail.tableName"/>
          </el-form-item>
          <el-form-item label="表名">
            <el-input v-model="detail.tableCode"/>
          </el-form-item>
          <el-form-item label="查询语句">
            <el-input v-model="detail.objectSql" type="textarea"/>
          </el-form-item>

        </el-form>
      </el-tab-pane>
      <el-tab-pane label="字段信息" name="fields">
        <el-row>
          <el-col :span="22">
            <el-pagination
              :current-page="grids.metaViewField.pageNum"
              :total="grids.metaViewField.total"
              background
              layout="prev, pager, next"
              @current-change="(page)=>{gotoPage('metaViewField',recordId,page)}"
          /></el-col>
          <el-col :span="2">
            <i class="el-icon-plus" @click="gridAdd('metaViewField',{})" />
          </el-col>
        </el-row>
        <el-table v-loading.body="grids.metaViewField.loading" :data="grids.metaViewField.list" :row-class-name="gridRowClassName" style="margin-bottom: 20px" element-loading-text="拼命加载中" border fit highlight-current-row @row-dblclick="gridEdit" @current-change="gridSelectRow()">
          <el-table-column align="center" label="行号" width="95">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column label="名称">
            <template slot-scope="scope">
              <el-input v-if="scope.row._inedit" v-model="scope.row.fieldName" class="edit-input" size="small"/>
              <span v-else>{{ scope.row.fieldName }}</span>
              <!--<router-link :to="{ path: '/metaViewObject/'+scope.row.viewObjectId }">{{ scope.row.objectName }}</router-link>-->
            </template>
          </el-table-column>
          <el-table-column label="代码" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row._inedit" v-model="scope.row.fieldCode" class="edit-input" size="small"/>
              <span v-else>{{ scope.row.fieldCode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="别名" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row._inedit" v-model="scope.row.fieldAlias" class="edit-input" size="small"/>
              <span v-else >{{ scope.row.fieldAlias }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" ><!--label="操作" width="120"-->
            <template slot="header" slot-scope="slot">
              <i class="el-icon-plus" @click="gridAdd('metaViewField',{})" />
              <el-button size="mini" @click="gridAdd('metaViewField',{})">Add</el-button>
            </template>
            <template slot-scope="scope">
              <i v-show="scope.row._inedit" class="el-icon-check" @click="gridSave('metaViewField',scope.row)"/>
              <i v-show="scope.row._inedit" class="el-icon-close" @click="gridCancel('metaViewField',scope.row)"/>
              <i v-show="!scope.row._inedit && !scope.row._deleted" class="el-icon-edit" @click="gridEdit('metaViewField',scope.row)"/>
              <i v-show="!scope.row._inedit && !scope.row._deleted" class="el-icon-delete" @click="gridDel('metaViewField',scope.row)"/>
            </template>
          </el-table-column>

        </el-table>

      </el-tab-pane>

    </el-tabs>
    <el-row>
      <el-col :span="24"/>
      <el-col :span="3"><el-button type="primary" @click="save(false)">保存</el-button></el-col>
      <el-col :span="4"><el-button type="primary" @click="save(true)">保存&新增</el-button></el-col>
      <el-col :span="3"><el-button v-if="isNew==false" type="danger" @click="del(detail[keyFieldName])">删除</el-button></el-col>
      <!--
      <router-link :to="{path: '/role/index'}"><el-button>返回</el-button></router-link>
      -->
    </el-row>
  </div>

</template>

<style>
  .el-table .deleted-row {
    border-color: #f00;

  }

  .el-table .updated-row {
    background: #00f;
  }

  .el-table .added-row {
    background: #0f0;
  }
</style>

<script>
import api from '@/api/metaViewObject'
import { editPageMixin } from '@/utils/views'

export default {
  mixins: [editPageMixin],
  data() {
    return {
      api: api,
      keyFieldName: 'viewObjectId',
      grids: {
        metaViewField: {}
      }
    }
  },
  methods: {

  }
}

</script>
