define(function() {
  var _util = {
    // 网络请求
    request: function (param) {
      var _this = this
      $.ajax({
        type: param.method || 'get',
        url: param.url || '',
        beforeSend: function (request) {
          request.setRequestHeader('Authorization', 'bearer ' + param.token)
        },
        dataType: param.type || 'json',
        data: param.data || '',
        success: function (res) {
          // 请求成功
          if (res.code === 200) typeof param.success === 'function' && param.success(res.data)
          // 状态码非200
          else param.success === 'function' && param.success(res.data)
        },
        error: function (err) {
          // 请求失败
          typeof param.error === 'function' && param.error(err.statusText)
        }
      })
    },
  
    // 获取url参数
    getQueryString: function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
      var r = decodeURIComponent(window.location.search).substr(1).match(reg)
      if (r != null) return unescape(r[2])
      return null
    }
  }
  return _util
})