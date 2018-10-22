/*function checkListOptions(opts) {
  if (opts.moduleName === undefined) throw 'moduleName未定义'
}

function createListView(options) {
  const defaultListOptions = {
    moduleName: undefined,
    routePath:{
      add: undefined,
      edit: undefined
    }
  }

  const opts = Object.assign(Object.assign({}, defaultListOptions), options)
}*/

export const listPageMixin = {
  data() {
    const moduleState = this.$store.state.globstate[this.moduleName] || {}
    return {
      list: [],
      total: 0,
      pageNum: moduleState['pageNum'] || 1,
      loading: true,
      searchCondition: moduleState['searchCondition'] || { name: '', code: '', sort: '' },
      //sortOptions: [{ label: '名称升序', value: 'objectName asc' }, { label: '名称倒序', value: 'objectName asc' }, { label: '代码升序', value: 'objectCode asc' }, { label: '编号倒序', value: 'objectCode desc' }],
      dialogVisible: false,
      recordId: undefined,
      //keyFieldName: 'viewObjectId',
      //moduleName: 'metaViewObject',
      //api:api
    }
  },
  created() {
    this.query()
  },
  methods: {
    query() {
      this.loading = true
      this.api.getList({ pageNum: this.pageNum }).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.pageNum = response.data.pageNum
        this.$store.dispatch('saveState', { module: this.moduleName, key: 'pageNum', value: this.pageNum })
        this.$store.dispatch('saveState', { module: this.moduleName, key: 'searchCondition', value: this.searchCondition })
        this.loading = false
      }, response => {
        this.loading = false
      })
    },
    gotoPage(val) {
      this.pageNum = val
      this.query()
    },
    closeDialog() {
      this.dialogVisible = false
    },
    showDialog() {
      this.dialogVisible = true
    },
    selectRow(currentRow, oldRow) {
      this.recordId = currentRow ? currentRow[this.keyFieldName] : undefined
    },
    add() {
      this.recordId = undefined
      this.showDialog()
    },
    edit(row, event) {
      if (row) this.recordId = row[this.keyFieldName]
      if (this.recordId !== undefined) {
        this.showDialog()
      } else {
        this.$message('请先选择一行记录！')
      }
    }
  }
}

export const editPageMixin = {
  props: { recordId: { type: [String, Number], default: null }, visible: { type: Boolean, default: false }},
  data() {
    return {
      detail: {},
      isNew: false,
      grids: {
        fields: {
          list: [],
          total: 0,
          pageNum: 1,
          loading: false,
          searchCondition: {},
          sortOptions: {},
          addRows: [],
          updateRows: [],
          deleteRows: []
        }
      },
      //api:api,
      loading: false,
      //keyFieldName: 'viewObjectId',
      defaultRecord: {
        // viewObjectId: undefined
      },
      defaultSaveOptions: {
        addFlag: false,
        showLoading: true,
        showSuccessMessage: true,
        // successMesage:'保存成功!',
        showErrorMessage: true,
        // errorMessage:'保存失败！',
        onSave: function(validData) {
        },
        success: function(data) {
        },
        error: function(data) {
        }
      }
    }
  },
  watch: {
    visible: function(nv, ov) {
      if (nv) {
        this.load(this.recordId)
      }
    }
  },
  created() {
    if (this.recordId) {
      this.load(this.recordId)
    } else {
      this.add()
    }
  },
  methods: {
    load(id) {
      this.isNew = false
      this.loading = true
      this.api.getDetail(id).then(response => {
        this.detail = response.data
        this.loading = false
      }, () => {
        this.loading = false
      })
    },
    add() {
      this.isNew = true
      this.detail = {}

      this.detail = Object.assign(this.detail, this.defaultRecord)
      this.detail[this.keyFieldName] = undefined
    },
    saveWithOption(opt) {
      this.$refs.detailForm.validate(valid => {
        if (valid) {
          if (opt.onSave(valid) === false) return

          if (opt.showLoading) this.loading = true

          if (!this.isNew) {
            this.api.updateDetail(this.detail[this.keyFieldName], this.detail).then(response => {
              if (opt.showLoading) this.loading = false

              if (opt.addFlag) {
                this.add()
              }
              if (opt.showSuccessMessage) this.$message('修改成功!')
            }, (e) => {
              if (opt.showLoading) this.loading = false
              if (opt.showErrorMessage) this.$message('修改出错' + e)
            })
          } else {
            this.api.saveDetail(this.detail).then(response => {
              if (opt.showLoading) this.loading = false
              if (opt.addFlag) {
                this.add()
              } else {
                this.load(response.data[this.keyFieldName])
              }

              if (opt.showSuccessMessage) this.$message('创建成功!')
            }, (e) => {
              if (opt.showLoading) this.loading = false
              if (opt.showErrorMessage) this.$message('创建出错' + e)
            })
          }
        }
      })
    },
    save(addFlag) {
      let opt = {}
      Object.assign(opt, this.defaultSaveOptions,{ addFlag: addFlag })
      this.saveWithOption(opt)
    },
    del(id) {
      this.loading = true
      this.api.deleteDetail(id).then(response => {
        this.$message('删除成功！')
        this.loading = false
        this.$emit('deleted')
      }, () => {
        this.loading = false
      })
    },
    gridAdd(name, row) {
      if (this.grids[name]) {
        const arr = this.grids[name].addRows
        if (!arr.includes(row)) arr.push(row)
      }
    },
    gridDel(name, rowid) {
      if (this.grids[name]) {
        const arr = this.grids[name].addRows
        if (arr.includes(row)) arr.splice(arr.indexOf(row), 1)
      }
    },
    gridUpdate(name, row) {
      //
    },
    gridQuery(name) {
      this.grids[name].addRows = []
      this.grids[name].updateRows = []
      this.grids[name].deleteRows = []
    },
    gridSave(name, row) {

    }
  }
}
