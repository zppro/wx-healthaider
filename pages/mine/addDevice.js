//index.js
import keys from '../../config/keys.js'


//获取应用实例
var app = getApp()

Page({
    data: {
        deviceInfo: {},
    },
    //事件
    formSubmit: function (e) {
        var that = this
        let deviceInfo = this.data.deviceInfo
        var tenantId =  app.config[keys.CONFIG_SERVER].getTenantId();
        if (that.checkOut(e)) {
            console.log("e:", e.detail.value)
            deviceInfo = e.detail.value
            deviceInfo.operator = 'add'
            deviceInfo.type = 'Mattress'
            that.setData({
                deviceInfo
            });
            console.log('deviceInfo携带数据为：', JSON.stringify(deviceInfo))
            wx.showActionSheet({
                itemList: ['确定绑定？'],
                itemColor: '#f00',
                success: function (res) {
                    app.libs.http.post(app.config[keys.CONFIG_SERVER].getBizUrl() + 'sleepDevicews$addDevice', {deviceInfo: deviceInfo,session:app.globalData.session,tenantId:tenantId}, (ret) => {
                        console.log("设备添加接口成功");
                        console.log(ret);
                    }, { loadingText: false });
                }
            })
        }


    },
    checkOut: function (e) {
        var that = this
        console.log(e.detail.value.cpNewName)
        if (app.util.isEmpty(e.detail.value.cpNewName)) {
            that.showModal("请输入姓名");
        } else if (app.util.isEmpty(e.detail.value.cpNewAge)) {
            that.showModal("请输入年龄");
        } else if (app.util.isEmpty(e.detail.value.sex)) {
            that.showModal("请输入性别");
        }
        else {
            return true
        }
    },
    showModal: function (title) {
        wx.showModal({
            title: title,
            //content: '请输入关心人的名字',
            success: function (res) {
                if (res.confirm) {
                    return false
                }
            }
        })
    },
    onLoad: function (options) {
        let that = this;
        console.log(" addDevice");
    }
})