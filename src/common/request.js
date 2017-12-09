module.exports.install = function (Vue) {
  Vue.prototype.request = function (funcName, param, successFunc, errorFunc, successMsg, errorMsg) {
    console.info(param)
    this.$store.dispatch(funcName, param).then((resp) => {
      let respData = resp.body
      if (respData.code === 'L200') {
        if (successMsg !== '') {
          this.$Notice.success({
            title: successMsg
          })
        }
        successFunc(respData.data)
      } else {
        this.$Notice.error({
          title: errorMsg + 'errorCode<' + respData.code + '>',
          desc: respData.message
        })
        errorFunc()
      }
    }, (resp) => {
      this.$Notice.error({
        title: errorMsg,
        desc: resp
      })
      errorFunc()
    })
  }
}
