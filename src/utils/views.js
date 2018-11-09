/* function checkListOptions(opts) {
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
    return {
      list: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      loading: true,
      searchCondition: {},
      // sortOptions: [{ label: '名称升序', value: 'objectName asc' }, { label: '名称倒序', value: 'objectName asc' }, { label: '代码升序', value: 'objectCode asc' }, { label: '编号倒序', value: 'objectCode desc' }],
      dialogVisible: false,
      recordId: undefined
      // keyFieldName: 'viewObjectId',
      // moduleName: 'metaViewObject',
      // api:api
    }
  },
  created() {
    this.query()
    const moduleState = this.$store.state.globstate[this.moduleName] || {}
    this.pageNum = moduleState['pageNum'] || 1
    this.searchCondition = moduleState['searchCondition'] || {}
  },
  methods: {
    query() {
      this.loading = true
      this.api.getList(Object.assign({ pageNum: this.pageNum, pageSize: this.pageSize }, this.searchCondition)).then(response => {
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
      activeTabName: 'detail',
      grids: {
        /* fields: { // 单个表格,表格名称为fields
          list: [],
          loading: false,
          total: 0,
          pageNum: 1,
          loading: false,
          searchCondition: {},
          sortOptions: {},
          addRows: [],
          updateRows: [],
          deleteRows: []
        }*/
      },
      // api:api,
      loading: false,
      // keyFieldName: 'viewObjectId',
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
      },
      defaultGridOptions: {
        list: [],
        loading: false,
        editType: 'cell',//'inline'
        total: 0,
        pageNum: 1,
        pageSize: 10,
        searchCondition: {},
        sortOptions: {},
        addRows: [],
        updateRows: [],
        deleteRows: []
      }
    }
  },
  watch: {
    visible: function(nv, ov) {
      if (nv === true) {
        if (this.recordId) this.load(this.recordId, true)
        else this.add()
      }
    }
  },
  created() {
    this.initOptions()
    if (this.recordId) {
      this.load(this.recordId, true)
    } else {
      this.add()
    }
  },
  methods: {
    initOptions() {
      Object.keys(this.grids).map((k, idx) => {
        let gridOption = this.grids[k]
        gridOption = Object.assign({}, this.defaultGridOptions, gridOption)
        const grid = {}
        grid[k] = gridOption
        Object.assign(this.grids, grid)
      })
    },
    load(id, loadGrids) {
      this.isNew = false
      this.loading = true
      this.api.getDetail(id).then(response => {
        this.detail = response.data
        this.loading = false

        if (loadGrids === true) {
          Object.keys(this.grids).map((k, idx) => {
            this.gridQuery(k, id, {})
          })
        }
      }, () => {
        this.loading = false
      })
    },
    add(dtl) {
      this.isNew = true
      this.detail = dtl
      this.detail = Object.assign({}, this.defaultRecord, this.detail)
      this.detail[this.keyFieldName] = undefined

      Object.keys(this.grids).map((k, idx) => {
        const gridOption = this.grids[k]
        gridOption.list = []
        gridOption.pageNum = 1
        gridOption.searchCondition = {}
        const grid = {}
        grid[k] = gridOption
        Object.assign(this.grids, grid)
      })
    },
    saveWithOption(opt) {
      this.$refs.detailForm.validate(valid => {
        if (valid) {
          if (opt.onSave(valid) === false) return

          if (opt.showLoading) this.loading = true
          const data = Object.assign({}, this.detail)

          Object.keys(this.grids).map((k, idx) => {
            data[k] = {}
            data[k].addRows = this.grids[k].addRows
            data[k].updateRows = this.grids[k].updateRows
            data[k].deleteRows = this.grids[k].deleteRows
          })

          if (!this.isNew) {
            this.api.updateDetail(this.detail[this.keyFieldName], data).then(response => {
              if (opt.showLoading) this.loading = false

              if (opt.addFlag) {
                this.add()
              } else {
                this.load(response.data[this.keyFieldName], true)
              }
              if (opt.showSuccessMessage) this.$message('修改成功!')
            }, (e) => {
              if (opt.showLoading) this.loading = false
              if (opt.showErrorMessage) this.$message('修改出错' + e)
            })
          } else {
            this.api.saveDetail(data).then(response => {
              if (opt.showLoading) this.loading = false
              if (opt.addFlag) {
                this.add()
              } else {
                this.load(response.data[this.keyFieldName], true)
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
      const opt = {}
      Object.assign(opt, this.defaultSaveOptions, { addFlag: addFlag })
      this.saveWithOption(opt)
    },
    del(id) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.api.deleteDetail(id).then(response => {
          this.$message('删除成功！')
          this.loading = false
          this.$emit('deleted')
        }, () => {
          this.loading = false
        })
      }).catch(() => {
        /* this.$message({
          type: 'info',
          message: '已取消删除'
        });*/
      })
    },
    gridQuery(name, id, params) {
      if (this.grids[name]) {
        let param = Object.assign({},{pageSize:this.grids[name].pageSize,pageNum:this.grids[name].pageNum},params)
        this.api.gridQuery(name, id, param).then(response => {
          let gridState = Object.assign({},this.grids[name])
          const data = response.data.list
          data.map(function(v) {
            v._inedit = (gridState.editType === 'cell')
            v._added = false
            v._updated = false
            v._deleted = false
          })
          gridState.list = data
          gridState.loading = false
          gridState.total = response.data.total
          gridState.pageNum = response.data.pageNum
          gridState.addRows = []
          gridState.updateRows = []
          gridState.deleteRows = []

          const result = {}
          result[name] = gridState
          this.grids = Object.assign({}, this.grids, result)
        }, e => {
          const result = {}
          result[name] = {
            loading: false
          }
          Object.assign(this.grids, result)
        })
      }
    },
    gotoPage(name, id, page) {
      this.gridQuery(name, id, { pageNum: page })
    },
    gridAdd(name, row) {
      if (this.grids[name] === undefined) return
      row._inedit = true // (this.grids[name].editType === 'cell')
      row._added = true
      row._updated = false
      row._deleted = false
      this.grids[name].list.unshift(row)
    },
    gridSelectRow(name, row) {
      if (this.grids[name] === undefined) return
    },
    gridDel(name, row) {
      if (this.grids[name] === undefined) return

      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row._deleted = true
        let arr = []

        if (row._added === true) {
          arr = this.grids[name].list
          if (arr.includes(row)) arr.splice(arr.indexOf(row), 1) // 新增的行，直接删除
          arr = this.grids[name].addRows
        } else {
          arr = this.grids[name].deleteRows // 被修改的记录，要记录
          if (!arr.includes(row)) arr.push(row) // 记录删除的记录
          arr = this.grids[name].updateRows
          row._updated = false
        }
        if (arr.includes(row)) arr.splice(arr.indexOf(row), 1) // 从添加或修改行中删除
      }).catch(() => {
        /* this.$message({
          type: 'info',
          message: '已取消删除'
        });*/
      })
    },
    gridEdit(name, row) {
      if (this.grids[name] === undefined) return
      row._originData = {}
      Object.assign(row._originData, row)
      row._inedit = true
    },
    gridCancel(name, row) {
      row._inedit = false
      if (row._added) {
        const arr = this.grids[name].list
        arr.splice(arr.indexOf(row), 1) // 新增的行，直接从数据集中删除
      } else {
        Object.assign(row, row._originData)
        delete row._originData
      }
    },
    gridSave(name, row) {
      if (this.grids[name] === undefined) return
      let arr = []
      if (row._added === true) {
        arr = this.grids[name].addRows
      } else {
        arr = this.grids[name].updateRows
        row._updated = true
      }
      if (!arr.includes(row)) arr.push(row)

      if (this.grids[name].editType != 'cell') {
        row._inedit = false
        delete row._originData
      }
    },
    /*gridChange(name, row) {
      if (this.grids[name] === undefined) return
      let arr = []
      if (row._added === true) {
        arr = this.grids[name].addRows
      } else {
        arr = this.grids[name].updateRows
        row._updated = true
      }
      if (!arr.includes(row)) arr.push(row)
    },*/
    gridRowClassName({ row, rowIndex }) {
      //return ''
      //if (this.grids[name].editType != 'cell' && row._inedit) return ''

      if (row._deleted) {
        return 'deleted-row'
      }
      if (row._updated) {
        return 'updated-row'
      }
      if (row._added) {
        return 'added-row'
      }
    }
  }
}
