//index.js
import keys from '../../config/keys.js'
//获取应用实例
var app = getApp()
Page({
    data: {
        // deviceInfo:[{name:'睡眠监测带',personName:'爸爸',id:'A1100065'},{name:'睡眠监测带',personName:'爸爸',id:'A1100065'}]
       deviceInfo:[]
    },
    gotoDetails:function(e){
        console.log(e);
        var id = e.currentTarget.dataset.id
          wx.navigateTo({
            url: '../mine/device-info?id='+id
        })
    },
     addDevice: function () {
        console.log("sleepZoneTap")
        let deviceInfo = this.data.deviceInfo
        wx.scanCode({
            success: (res) => {
                console.log(res.result)
                 wx.navigateTo({
                    url: '../mine/addDevice?info='+res.result
                })
            },
            })
    },
    onLoad: function (options) {
        let that = this
        let deviceInfo = this.data.deviceInfo
        var tenantId = app.config[keys.CONFIG_SERVER].getTenantId();
        console.log("device list");
        app.libs.http.post(app.config[keys.CONFIG_SERVER].getBizUrl() + 'sleepDevicews$getAttachDevice', { session: app.globalData.session,tenantId:tenantId }, (ret) => {
            console.log("设备添加接口成功");
            console.log(ret);
                 if(ret.ret.ret =='null'){
                that.setData({
                deviceInfo: []
            })
            }else{
            that.setData({
                deviceInfo: ret.ret.ret
            })
            }
        }, { loadingText: false });
        console.log("get:",deviceInfo);
    }
})