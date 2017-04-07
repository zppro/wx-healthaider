//index.js
import keys from '../../config/keys.js'
//获取应用实例
var app = getApp()
Page({
    data: {
         //deviceInfo: [{ name: '爸爸', gotoBedTime: '22:00', sleepTime: '9', deepSleepTime: '3' }]
        deviceInfo: []
    },
    //事件
    setting: function () {
        console.log("setting")
    },
    sleepZoneTap: function () {
        console.log("sleepZoneTap")
        let deviceInfo = this.data.deviceInfo
        if (deviceInfo.length <= 0) {
            wx.scanCode({
                success: (res) => {
                    console.log(res.result)
                    wx.navigateTo({
                        url: './addDevice?info=' + res.result
                    })
                }
            })
        }
        else {
            wx.navigateTo({
                url: './device-list'
            })
        }
    },
    deleteTap: function () {
        console.log("deleteTap");
        wx.showModal({
            title: '确定清除？',
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    ownTap: function () {
        console.log("ownTap");
        //  wx.navigateTo({
        //                 url: './addDevice'
        //             })
    },
    useHelpTap: function () {
        console.log("useHelpTap");
        wx.navigateTo({
            url: './howtouse'
        })
    },
    downLoadTap: function () {
        console.log("downLoadTap");
    },
    onShow: function (options) {
        let that = this;
        console.log(" onLoad mine");
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        })
        app.libs.http.post(app.config[keys.CONFIG_SERVER].getBizUrl() + 'sleepDevicews$getAttachDevice', { session: app.globalData.session }, (ret) => {
            console.log("设备添加接口成功");
            console.log(ret);
            if (ret.ret.ret == 'null') {
                that.setData({
                    deviceInfo: []
                })
            } else {
                that.setData({
                    deviceInfo: ret.ret.ret
                })
            }
        }, { loadingText: false });
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
        app.libs.http.post(app.config[keys.CONFIG_SERVER].getBizUrl() + 'sleepDevicews$getAttachDevice', { session: app.globalData.session }, (ret) => {
            console.log("设备添加接口成功");
            console.log(ret);
            if (ret.ret.ret == 'null') {
                that.setData({
                    deviceInfo: []
                })
            } else {
                that.setData({
                    deviceInfo: ret.ret.ret
                })
            }
        }, { loadingText: false });
    }
})