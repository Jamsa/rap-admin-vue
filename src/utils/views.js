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

const ROW_IN_EDIT = '_inedit'
const ROW_ADDED = '_newrow'
const ROW_DELETED = '_deleted'
const ROW_UPDATED = '_updated'

export const editPageMixin = {
  props: { recordId: { type: [String, Number], default: null }, visible: { type: Boolean, default: false }},
  data() {
    return {
      detail: {},
      isNew: false,
      activeTabName: 'detail',
      grids: {
        /*fields: { // 单个表格,表格名称为fields
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
      defaultGridOptions:{
        list: [],
        loading: false,
        total: 0,
        pageNum: 1,
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
      if (nv) {
        this.load(this.recordId,true)
      }
    }
  },
  created() {
    this.initOptions()
    if (this.recordId) {
      this.load(this.recordId,true)
    } else {
      this.add()
    }
  },
  methods: {
    initOptions() {
      Object.keys(this.grids).map((k, idx) => {
        let gridOption = this.grids[k]
        gridOption = Object.assign({},this.defaultGridOptions,gridOption)
        let grid = {}
        grid[k] = gridOption
        Object.assign(this.grids,grid)
      })
    },
    load(id,loadGrids) {
      this.isNew = false
      this.loading = true
      this.api.getDetail(id).then(response => {
        this.detail = response.data
        this.loading = false

        if(loadGrids===true){
          Object.keys(this.grids).map((k, idx) => {
            this.gridQuery(k,id,{})
            /*let grid = this.grids[k]
            this.api.gridQuery(k,id,{}).then(response => {
              let data = response.data.list
              data.map(function(v){
                v._inedit=false

              })
              grid.list = data
              grid.loading = false
            },() => {
              grid.loading=false
            })*/
          })
        }
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
      const opt = {}
      Object.assign(opt, this.defaultSaveOptions, { addFlag: addFlag })
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
    gridQuery(name,id,params){
      if(this.grids[name]){
        this.api.gridQuery(name,id,params).then(response =>{
          let data = response.data.list
          data.map(function(v){
            v._inedit = false
          })
          let result = {}
          result[name] = {
            list: data,
            loading: false,
            addRows : [],
            updateRows : [],
            deleteRows : []
          }
          Object.assign(this.grids,result)
        },e=>{
          this.$set(this.grids,name,{loading: false})
        })
      }
    },
    gridAdd(name, row) {
      if (this.grids[name]===undefined) return
      const arr = this.grids[name].addRows
      row[ROW_IN_EDIT] = true
      row[ROW_ADDED] = true
      this.grids[name].list.push(row)
    },
    gridSelectRow(name,row) {
      if (this.grids[name]===undefined) return

    },
    gridDel(name, row) {
      if (this.grids[name]===undefined) return

      row[ROW_DELETED] = true
      if(row[ROW_ADDED]===true){
        const arr = this.grids[name].addRows
        if (arr.includes(row)) arr.splice(arr.indexOf(row), 1) // 如果是新增的行，则从添加行中删除

        this.grids[name].list.splice(arr.indexOf(row),1) // 新增的行，直接从数据集中删除
      }else {
        const arr = this.grids[name].deleteRows
        if (!arr.includes(row)) arr.push(row) // 非新增行，记录下来
      }
    },
    gridEdit(name, row) {
      if (this.grids[name]===undefined) return
      row._inedit=true
      //row[ROW_IN_EDIT] = true
    },
    gridSave(name, row) {
      if (this.grids[name]===undefined) return
      if(row[ROW_ADDED]===true){
        const arr = this.grids[name].addRows
        if(!arr.includes(row)) arr.push(row)
      }else{
        const arr = this.grids[name].updateRows
        if(!arr.includes(row)) arr.push(row)
        row[ROW_UPDATED] = true
      }
      row._inedit = false
      //row[ROW_IN_EDIT] = false
    }
  }
}
