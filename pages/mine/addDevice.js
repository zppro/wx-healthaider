//index.js
import keys from '../../config/keys.js'
//获取应用实例
var app = getApp()
Page({
    data: {
        deviceInfo:{},
        concernPersonInfo:{}
    },
    //事件
    formSubmit:function(e){
        var that = this
        let deviceInfo = this.data.deviceInfo
        let concernPersonInfo = this.data.concernPersonInfo
        if(!that.checkOut()){
            console.log("空");
        }
        deviceInfo.deviceName = e.detail.value.deviceName
        deviceInfo.deviceMac = e.detail.value.deviceMac
        deviceInfo.deviceType = e.detail.value.deviceType
        concernPersonInfo.cpNewName = e.detail.value.cpNewName
        concernPersonInfo.cpNewAge = e.detail.value.cpNewAge
        concernPersonInfo.cpNewGender = e.detail.value.cpNewGender
       that.setData({
           deviceInfo,
           concernPersonInfo
        });
         console.log('deviceInfo携带数据为：', JSON.stringify(deviceInfo))
         console.log('concernPersonInfo携带数据为：', JSON.stringify(concernPersonInfo))

          wx.showActionSheet({
                    itemList: ['确定绑定？'],
                    itemColor: '#f00',
                    success: function (res) {
                    }
             })
                   
    },
    checkOut:function(){
        console.log(this.data.concernPersonInfo.cpNewName)
        if (app.util.isEmpty(this.data.concernPersonInfo.cpNewName)) {
                    app.toast.showError('请输入关心人的名字');
                    return false
                }
        },
    onLoad: function (options) {
        let that = this;
        console.log(" addDevice");
    }
})