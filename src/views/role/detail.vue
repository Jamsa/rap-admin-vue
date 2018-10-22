<template>
  <div v-loading.body="detailLoading" class="app-container" element-loading-text="拼命加载中" >
    <el-form ref="detailForm" :model="detail" :rules="detailRules" label-width="120px">
      <el-form-item label="名称">
        <el-input v-model="detail.name"/>
      </el-form-item>
      <el-form-item label="代码">
        <el-input v-model="detail.code"/>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="detail.memo"/>
      </el-form-item>

      <el-form-item label="资源">
        <!--<el-table v-loading.body="listLoading" :data="list" element-loading-text="拼命加载中" border fit highlight-current-row @row-dblclick="onDoubleClick" @current-change="onCurrentChange">
          <el-table-column align="center" label="行号" width="95">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column label="名称">
            <template slot-scope="scope">
              <router-link :to="{ path: '/role/'+scope.row.roleId }">{{ scope.row.name }}</router-link>
            </template>
          </el-table-column>
          <el-table-column label="代码" width="110" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.code }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" width="110" align="center">
            <template slot-scope="scope">
              {{ scope.row.memo }}
            </template>
          </el-table-column>
        </el-table>-->
      </el-form-item>
      <el-form-item>

        <el-button type="primary" @click="onSubmit(false)">保存</el-button>
        <el-button type="primary" @click="onSubmit(true)">保存&新增</el-button>
        <el-button v-if="detail.primaryKey" type="danger" @click="onDelete(detail.primaryKey)">删除</el-button>
        <!--
        <router-link :to="{path: '/role/index'}"><el-button>返回</el-button></router-link>
        -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import roleApi from '@/api/role'

export default {
  props: { primaryKey: { type: [String, Number], default: '' }, load: { type: Boolean, default: false }},
  data() {
    return {
      detail: { name: 'name', code: 'code' },
      detailLoading: false,
      /* form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
          },*/
      detailRules: {
        username: [{ required: true, trigger: 'blur' }],
        fullname: [{ required: true, trigger: 'blur' }]
      }
    }
  },
  watch: {
    load: function(nv, ov) {
      if (nv) {
        this.fetchData(this.primaryKey)
      }
    }
  },
  created() {
    /* const id = this.$route.params.id
      * if(id) this.fetchData(id)
      * else this.detail = { name: 'role name', code: 'code'} */
    this.fetchData(this.primaryKey)
  },
  methods: {
    fetchData(id) {
      if (id === 'new') {
        this.detail = {}
        return
      }
      this.detailLoading = true
      roleApi.getDetail(id).then(response => {
        this.detail = response.data
        this.detailLoading = false
      }, () => {
        this.detailLoading = false
      })
    },
    onSubmit(op) {
      this.$refs.detailForm.validate(valid => {
        if (valid) {
          this.detailLoading = true
          if (this.detail && this.detail.primaryKey) {
            roleApi.updateDetail(this.detail.primaryKey, this.detail).then(response => {
              this.detailLoading = false
              if (op) {
                this.fetchData('new')
              }
              this.$message('修改成功!')
            }, () => {
              this.detailLoading = false
            })
          } else {
            roleApi.saveDetail(this.detail).then(response => {
              this.detailLoading = false
              if (op) {
                this.fetchData('new')
              } else {
                this.fetchData(response.data.primaryKey)
              }
              this.$message('创建成功!')
            }, () => {
              this.detailLoading = false
            })
          }
        }
      })
    },
    onDelete(id) {
      this.detailLoading = true
      roleApi.deleteDetail(id).then(response => {
        this.$message('删除成功！')
        this.detailLoading = false
        this.$emit('deleted')
      }, () => {
        this.detailLoading = false
      })
    }
  }
}
</script>
