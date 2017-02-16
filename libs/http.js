;(function (factory) {
    module.exports = factory()
}((function () { 'use strict';
    var http = {
            save: function (url, data, successFn, options, bizFailFn) {
                data.id ? this.put(url+ '/' + data.id, data, successFn, options, bizFailFn) : this.post(url, data, successFn, options, bizFailFn)
            },
            get: function(url, successFn, options, bizFailFn) {
                this.fetch(url, {}, successFn, options, bizFailFn);
            },
            post: function(url, data, successFn, options, bizFailFn) {
                console.log(url);
                options = options || {};
                options.method = 'POST';
                this.fetch(url, data, successFn, options, bizFailFn);
            },
            put: function(url, data, successFn, options, bizFailFn) {
                console.log(url);
                options = options || {};
                options.method = 'PUT';
                this.fetch(url, data, successFn, options, bizFailFn);
            },
            delete: function(url, successFn, options, bizFailFn) {
                console.log(url);
                options = options || {};
                options.method = 'DELETE';
                this.fetch(url, {}, successFn, options, bizFailFn);
            },
            fetch: function(url, data, successFn, {method = 'GET', loadingText = '数据载入中...', toastInfo = '' } = {}, bizFailFn) {
                var app = getApp()
                console.log(url);
                console.log(data);
                loadingText && wx.showToast({title: loadingText, icon:'loading'});
                wx.request({
                    url, data: data || {},
                    method,
                    success: function(res) {
                        if (res.data.success) {
                            console.log(!!toastInfo)
                            toastInfo && app.toast.show(toastInfo, {duration: 1500})
                            if (res.data.rows){
                                successFn(res.data.rows)
                            } else if (res.data.ret) {
                                successFn(res.data.ret)
                            } else {
                                successFn()
                            }
                        } else {
                            app.toast.showError(res.data.msg)
                            console.log(res.data.code + '/'+ res.data.msg)
                            if (bizFailFn && typeof bizFailFn == 'function') {
                                bizFailFn(res.data)
                            }
                        }
                    },
                    fail: function (res) {
                        console.log('fail');
                        console.log(res)
                    },
                    complete: function() {
                        wx.hideToast();
                    }
                })
            }
    }
    return http;
})));