//index.js
import keys from '../../config/keys.js'
//获取应用实例
var app = getApp()
Page({
    data: {
     // attachedcarePersons:[{carePersonId:'',name:'睡眠监测带',carePersonName:'爸爸',deviceId:'A1100065'},{name:'睡眠监测带',memberName:'爸爸',deviceId:'A1100065'}],
      attachedcarePersons:[]
    },
    gotoDeviceList:function(e){
        console.log("gotoDeviceList:",e);
        var id = e.currentTarget.dataset.id
        console.log("gotoDeviceList:",e);
          wx.navigateTo({
            url: '../mine/device-list?id='+id
        })
    },
     addDevice: function () {
        console.log("addDevice")
        wx.scanCode({
            success: (res) => {
                console.log(res.result)
                 wx.navigateTo({
                    url: '../mine/addDevice?info='+res.result
                })
            },
    })
    },
    getAttachedDevices: function () {
        let that = this
        app.libs.http.post(app.config[keys.CONFIG_SERVER].getBizUrl() + 'sleepDevicews$getAttachDevice', {}, (attachedcarePersons) => {
            console.log("getAttachedDevices成功");
            console.log(attachedcarePersons);
            that.setData({
                attachedcarePersons: attachedcarePersons
            })
        }, { loadingText: false });
    },
     onShow: function (options) {
      this.getAttachedDevices() 
     },
    onLoad: function (options) {
        this.getAttachedDevices()
    }
})