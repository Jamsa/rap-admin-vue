<template>
  <div class="app-container"  v-loading.body="detailLoading" element-loading-text="拼命加载中" >
    <el-form ref="detailForm" :model="detail" :rules="detailRules" label-width="120px">
      <el-form-item label="名称">
        <el-input v-model="detail.name"></el-input>
      </el-form-item>
      <el-form-item label="代码">
        <el-input v-model="detail.code"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="detail.memo"></el-input>
      </el-form-item>

      <!--
      <el-form-item label="Activity time">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="Pick a date" v-model="form.date1" style="width: 100%;"></el-date-picker>
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
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>-->
      <el-form-item>

        <el-button type="primary" @click="onSubmit(false)">保存</el-button>
        <el-button type="primary" @click="onSubmit(true)">保存&新增</el-button>
        <el-button type="danger" @click="onDelete(detail.primaryKey)" v-if="detail.primaryKey">删除</el-button>
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
   props: ['primaryKey', 'load'],
   created() {
     /* const id = this.$route.params.id
      * if(id) this.fetchData(id)
      * else this.detail = { name: 'role name', code: 'code'} */
     this.fetchData(this.primaryKey)
     console.log('#####')
   },
   watch: {
     load: function(nv, ov) {
       if (nv) {
         console.log('load')
         this.fetchData(this.primaryKey)
       }
     }
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
             roleApi.updateDetail(this.detail.primaryKey,this.detail).then(response => {
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
