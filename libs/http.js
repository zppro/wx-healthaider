// var jws =  require('jws-3.3.min.js');
import { jws } from 'jsrsasign-latest-all-min.js'

    ; (function (factory) {
        module.exports = factory()
    }((function () {
        'use strict';

        var http = {
            init: function (app) {
                this.app = app
            },
            save: function (url, data, successFn, options, bizFailFn) {
                data.id ? this.put(url + '/' + data.id, data, successFn, options, bizFailFn) : this.post(url, data, successFn, options, bizFailFn)
            },
            get: function (url, successFn, options, bizFailFn) {
                // console.log('get options:', options, url);
                this.fetch(url, {}, successFn, options, bizFailFn);
            },
            post: function (url, data, successFn, options, bizFailFn) {
                options = options || {};
                options.method = 'POST';
                this.fetch(url, data, successFn, options, bizFailFn);
            },
            put: function (url, data, successFn, options, bizFailFn) {
                options = options || {};
                options.method = 'PUT';
                this.fetch(url, data, successFn, options, bizFailFn);
            },
            delete: function (url, successFn, options, bizFailFn) {
                options = options || {};
                options.method = 'DELETE';
                this.fetch(url, {}, successFn, options, bizFailFn);
            },
            fetch: function (url, data, successFn, {useJWT = true, customHeader, method = 'GET', loadingText = '数据载入中...', toastInfo = '' } = {}, bizFailFn) {
                var self = this;
                // console.log(jws);
                console.log('fetch invoke:', method, url, data, useJWT);
                loadingText && wx.showToast({ title: loadingText, icon: 'loading' });

                wx.request({
                    url, data: data || {},
                    header: useJWT ? this.buildHeaderAsJWT(customHeader) : {},
                    method,
                    success: function (res) {
                        // var app =  getApp();
                        console.log('fetch result:', res)
                        if (res.statusCode === 200) {
                            if (res.data.success) {
                                console.log(!!toastInfo)
                                console.log('self.app', self.app)
                                toastInfo && self.app.toast.show(toastInfo, { duration: 1500 })
                                console.log('res data:', res.data)
                                if (res.data.rows) {
                                    successFn(res.data.rows)
                                } else if (res.data.ret) {
                                    successFn(res.data.ret)
                                } else {
                                    successFn()
                                }
                            } else {
                                self.app.toast.showError(res.data.msg)
                                console.log(res.data.code + '/' + res.data.msg)
                                if (bizFailFn && typeof bizFailFn == 'function') {
                                    bizFailFn(res.data)
                                }
                            }
                        } else {
                            self.app.toast.showError(res.data)
                        }

                    },
                    fail: function (res) {
                        console.log('fail');
                        console.log(res)
                    },
                    complete: function () {
                        wx.hideToast();
                    }
                })
            },
            buildHeaderAsJWT(customHeader) {
                let defaultHeader = {};
                var ts = this.app.libs.moment().unix()

                var salt = 'woosiyuan-wxapp-general:' + ts
                var sHeader = JSON.stringify({ alg: 'HS256', typ: 'JWT' })
                console.log('this.open',this.app.globalData.session.openid);
                var sPayload = JSON.stringify({ openid: this.app.globalData.session.openid })
                
                var sJWT = jws.JWS.sign('HS256', sHeader, sPayload, salt)
                defaultHeader['X-Custom-TS'] = ts
                defaultHeader.Authorization = 'Bearer ' + sJWT
                console.log('defaultHeader:', defaultHeader)
                return Object.assign(defaultHeader, customHeader);
            }
        }
        return http;
    })));