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
        <el-table v-loading.body="grids.metaViewField.loading" :data="grids.metaViewField.list" element-loading-text="拼命加载中" border fit highlight-current-row @row-dblclick="gridEdit" @current-change="gridSelectRow()">
          <el-table-column align="center" label="行号" width="95">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column label="名称">
            <template slot-scope="scope">
              <span>{{ scope.row.fieldName }}</span>
              <!--<router-link :to="{ path: '/metaViewObject/'+scope.row.viewObjectId }">{{ scope.row.objectName }}</router-link>-->
            </template>
          </el-table-column>
          <el-table-column label="代码" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.fieldCode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="别名" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row._inedit" v-model="scope.row.fieldAlias" class="edit-input" size="small"></el-input>
              <span v-else >{{ scope.row.fieldAlias }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作" width="120">
            <template slot-scope="scope">
              <el-button v-show="scope.row._inedit" type="success" size="small" icon="el-icon-circle-check-outline" @click="gridSave('metaViewField',scope.row)">保存</el-button>
              <el-button v-show="true != scope.row._inedit" type="primary" size="small" icon="el-icon-edit" @click="gridEdit('metaViewField',scope.row)">编辑</el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-tab-pane>


      <el-tab-pane label="ag grid" name="aaa">
        <!--class="ag-theme-bootstrap" -->
        <ag-grid-vue
                style="width: 100%; height: 500px;" class="ag-theme-balham"
                     :columnDefs="columnDefs"
                     :singleClickEdit="true"
                     rowSelection="single"
                     :cellValueChanged="test"
                     :rowDataChanged="test"
                     :gridReady="onGridReady"
                     :rowData="grids.metaViewField.list">
        </ag-grid-vue>
      </el-tab-pane>
    </el-tabs>
    <el-row>
      <el-col :span="24"></el-col>
      <el-col :span="3"><el-button type="primary" @click="save(false)">保存</el-button></el-col>
      <el-col :span="4"><el-button type="primary" @click="save(true)">保存&新增</el-button></el-col>
      <el-col :span="3"><el-button v-if="isNew==false" type="danger" @click="del(detail[keyFieldName])">删除</el-button></el-col>
      <!--
      <router-link :to="{path: '/role/index'}"><el-button>返回</el-button></router-link>
      -->
    </el-row>
  </div>

</template>

<script>
import api from '@/api/metaViewObject'
import { editPageMixin } from '@/utils/views'
import {AgGridVue} from "ag-grid-vue"

export default {
  mixins: [editPageMixin],
  components: {
    AgGridVue
  },
  methods:{
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
    },
    test(v1,v2){
      //v1.data._inedit= !(v1.data._inedit===true)
      console.log(v1,v2)
      /*let rowdata = this.grids.metaViewField.list[v1.rowIndex]
      rowdata.fieldCode='aaaa'
      this.$set(this.grids.metaViewField.list,v1.rowIndex,rowdata)*/
      let nodes = this.gridApi.getSelectedNodes()
      nodes[0].setDataValue('fieldCode','aaaaa')
      //v1.data.fieldCode='aaaa'

      nodes.map(function(n){

      })
    }
  },
  data() {
    return {
      theme:"ag-theme-bootstrap",
      columnDefs:[
        {headerName: '名称', field: 'fieldName',editable:true},
        {headerName: '代码', field: 'fieldCode',editable:true},
        {headerName: '别名', field: 'fieldAlias',editable:true}
      ],
      api: api,
      keyFieldName: 'viewObjectId',
      grids: {
        metaViewField: {}
      }
    }
  }
}

</script>
