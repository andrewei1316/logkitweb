module.exports.install = function (Vue) {
  Vue.prototype.request = function (funcName, param, successFunc, errorFunc, successMsg, errorMsg) {
    console.info(param)
    this.$Loading.start()
    this.$store.dispatch(funcName, param).then((resp) => {
      let respData = resp.body
      if (respData.code === 'L200') {
        if (successMsg !== '') {
          this.$Notice.success({
            title: successMsg
          })
        }
        this.$Loading.finish()
        successFunc(respData.data)
      } else {
        this.$Notice.error({
          title: errorMsg,
          desc: 'errorCode<' + respData.code + '>: ' + respData.message
        })
        this.$Loading.error()
        errorFunc()
      }
    }, (resp) => {
      this.$Notice.error({
        title: errorMsg,
        desc: resp.bodyText
      })
      this.$Loading.error()
      errorFunc()
    })
  }
}
