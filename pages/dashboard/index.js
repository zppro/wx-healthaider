//index.js
import keys from '../../config/keys.js'
//获取应用实例
var app = getApp()
Page({
    data: {
        deviceInfo:[]
    },

    onLoad: function (options) {
        let deviceInfo = this.data.deviceInfo
        console.log("index");
        console.log(deviceInfo);
    }
})