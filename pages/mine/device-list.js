//index.js
import keys from '../../config/keys.js'
//获取应用实例
var app = getApp()
Page({
    data: {
         deviceInfo:[{name:'睡眠监测带',personName:'爸爸',id:'A1100065'},{name:'睡眠监测带',personName:'爸爸',id:'A1100065'}]
       // deviceInfo:[]
    },
    goToInfo:function(){
        console.log("go to");
    },
    bangding:function(){//扫描
    wx.scanCode({
        complete: (res) => {
            console.log(res.result)
            var result =  res.result.split("A");
            console.log("A"+result[1]);
        }
        })
    },
    onLoad: function (options) {
        let deviceInfo = this.data.deviceInfo
        console.log("device list");
        console.log(deviceInfo);
    }
})