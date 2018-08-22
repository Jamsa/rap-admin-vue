const defaultOptions = {
  moduleName: undefined

}

function checkOptions(opts) {
  if (opts.moduleName === undefined) throw 'moduleName未定义'
}

function createView(options) {
  const opts = Object.assign(Object.assign({}, defaultOptions), options)
}

