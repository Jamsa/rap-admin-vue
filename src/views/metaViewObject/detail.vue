<template>
  <div v-loading.body="loading" class="app-container" element-loading-text="拼命加载中" >
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

      <el-form-item label="字段"/>
      <el-form-item>
        <el-button type="primary" @click="save(false)">保存</el-button>
        <el-button type="primary" @click="save(true)">保存&新增</el-button>
        <el-button v-if="isNew==false" type="danger" @click="del(detail[keyFieldName])">删除</el-button>
        <!--
        <router-link :to="{path: '/role/index'}"><el-button>返回</el-button></router-link>
        -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from '@/api/metaViewObject'
import {editPageMixin} from '@/utils/views'

export default {
  mixins: [editPageMixin],
  data() {
    return {
      api:api,
      keyFieldName: 'viewObjectId'
    }
  }
}

</script>
