//index.js
import keys from '../../config/keys.js'
//获取应用实例
var app = getApp()
Page({
    data: {
        //deviceInfo: [{ name: '爸爸', gotoBedTime: '22:00', sleepTime: '9', deepSleepTime: '3' }]
        deviceInfo:[]
    },
    //事件
    setting: function () {
        console.log("setting")
    },
    sleepZoneTap: function () {
        console.log("sleepZoneTap")
        let deviceInfo = this.data.deviceInfo
        if(deviceInfo.length<=0){
             app.libs.http.post(app.config[keys.CONFIG_SERVER].getBizUrl() + 'sleepDevicews$getAttachDevice',{session: app.globalData.session}, (ret) => {
                        console.log("设备添加接口成功");
                        console.log(ret);
                    }, { loadingText: false });
        // wx.navigateTo({
        //             url: './addDevice?info=a0e6f855129fA1100123'
        //         })
        // wx.scanCode({
        //     complete: (res) => {
        //         console.log(res.result)
        //          wx.navigateTo({
        //             url: './addDevice?info='+res.result
        //         })
        //     }
        //     })
        }
        else{
           wx.navigateTo({
            url: './device-list'
        }) 
        }
    },
    braceletTap: function () {
        console.log("braceletTap");
    },
    otherTap: function () {
        console.log("otherTap");
    },
    deleteTap: function () {
        console.log("deleteTap");
    },
    ownTap: function () {
        console.log("ownTap");
    },
    useHelpTap: function () {
        console.log("useHelpTap");
    },
    downLoadTap: function () {
        console.log("downLoadTap");
    },
    onLoad: function (options) {
        let that = this;
        console.log(" onLoad mine");
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        })
    }
})