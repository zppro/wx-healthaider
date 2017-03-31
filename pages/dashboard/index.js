//index.js
import keys from '../../config/keys.js'
//获取应用实例
var app = getApp()
Page({
    data: {
        //deviceInfo:[{name:'爸爸',gotoBedTime:'22:00',sleepTime:'9',deepSleepTime:'3'}]
        deviceInfo: []
    },
    bangding: function () {//扫描
        console.log("bangding");
        // wx.scanCode({
        //     complete: (res) => {
        //         console.log(res.result)
        //         var result =  res.result.split("A");
        //         console.log("A"+result[1]);
        //     }
        //     })
    },
    onLoad: function (options) {
        let that = this
        let deviceInfo = this.data.deviceInfo
        console.log("index");
        app.libs.http.post(app.config[keys.CONFIG_SERVER].getBizUrl() + 'sleepDevicews$getAttachDevice', { session: app.globalData.session }, (ret) => {
            console.log("设备添加接口成功");
            console.log(ret);
            deviceInfo.push(ret);
            that.setData({
                deviceInfo: deviceInfo
            })
        }, { loadingText: false });
        console.log(deviceInfo);
    }
})