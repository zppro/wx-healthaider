//index.js
import keys from '../../config/keys.js'
//获取应用实例
var app = getApp()
Page({
    data: {
        attachedDeviceNumbers:''
    },
    //事件
    setting: function () {
        console.log("setting")
    },
    sleepZoneTap: function () {
        console.log("sleepZoneTap")
        var attachedDeviceNumbers = this.data.attachedDeviceNumbers
        if (attachedDeviceNumbers <= 0) {
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
        this.getDeviceNumbers();
    },
    getDeviceNumbers:function(){
        let that = this;
         console.log("getDeviceNumbers");
        wx.getStorage({
            key: 'attachedDeviceNumbers',
            success: function (res) {
                console.log("getDeviceNumbers:",res.data)
                that.setData({
                    attachedDeviceNumbers:res.data
                })
            }
        })
    }
    ,
    onLoad: function (options) {
        let that = this;    
        console.log(" onLoad mine");
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        })
       this.getDeviceNumbers();
    }
})