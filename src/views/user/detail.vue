<template>
  <div class="app-container">
    <el-form ref="detailForm" :model="detail" :rules="detailRules" label-width="120px">
      <el-form-item label="姓名">
        <el-input v-model="detail.fullname"/>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="detail.username"/>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="detail.tel"/>
      </el-form-item>
      <el-form-item label="生日">
        <el-date-picker v-model="detail.birthday" type="date" placeholder="选择日期" style="width: 100%;"/>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="detail.memo"/>
      </el-form-item>

      <el-form-item label="性别">
        <el-select v-model="detail.sex" placeholder="请选择性别">
          <el-option label="男" value="M"/>
          <el-option label="女" value="F"/>
        </el-select>
      </el-form-item>
      <!--
      <el-form-item label="Activity time">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="Pick a date" v-model="form.date1" style="width: 100%;"/>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-time-picker type="fixed-time" placeholder="Pick a time" v-model="form.date2" style="width: 100%;"></el-time-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="Instant delivery">
        <el-switch on-text="" off-text="" v-model="form.delivery"></el-switch>
      </el-form-item>
      <el-form-item label="Activity type">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="Online activities" name="type"></el-checkbox>
          <el-checkbox label="Promotion activities" name="type"></el-checkbox>
          <el-checkbox label="Offline activities" name="type"></el-checkbox>
          <el-checkbox label="Simple brand exposure" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Resources">
        <el-radio-group v-model="form.resource">
          <el-radio label="Sponsor"></el-radio>
          <el-radio label="Venue"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Activity form">
        <el-input type="textarea" v-model="form.desc"/>
      </el-form-item>-->
      <el-form-item>

        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button v-if="detail.primaryKey" type="danger" @click="onDelete(detail.primaryKey)">删除</el-button>
        <router-link :to="{path: '/user/index'}"><el-button>返回</el-button></router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { getList, getDetail, saveDetail, updateDetail, deleteDetail } from '@/api/user'

export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validateFullname = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      detail: { username: '', fullname: '' },
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
  created() {
    const id = this.$route.params.id
    if (id) this.fetchData(id)
    else this.detail = { birthday: '1979-01-01', username: 'aaa', sex: 'M' }
  },
  methods: {
    fetchData(id) {
      this.detailLoading = true
      getDetail(id).then(response => {
        this.detail = Object.assign({ sex: 'F' }, response.data)
        this.listLoading = false
      }, error => {
        this.detailLoading = false
      })
    },
    onSubmit() {
      this.$refs.detailForm.validate(valid => {
        if (valid) {
          this.detailLoading = true
          if (this.detail && this.detail.primaryKey) {
            updateDetail(this.detail.primaryKey, this.detail).then(response => {
              this.$message('修改成功!')
              this.detailLoading = false
            }, error => {
              this.detailLoading = false
            })
          } else {
            saveDetail(this.detail).then(response => {
              this.$message('创建成功!')
              this.$router.push({ path: '/user/' + response.data.primaryKey })
              this.detailLoading = false
            }, error => {
              this.detailLoading = false
            })
          }
        }
      })
    },
    onDelete(id) {
      this.detailLoading = true
      deleteDetail(id).then(response => {
        this.$message('删除成功！')
        this.detailLoading = false
        this.$router.push({ path: '/user' })
      }, error => {
        this.detailLoading = false
      })
    }
  }
}
</script>
