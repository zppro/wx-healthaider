//index.js
import keys from '../../config/keys.js'


//获取应用实例
var app = getApp()
Page({
    data: {
        deviceInfo: {},
        actionSheetHidden: true,
        actionSheetSexItems: [
            { bindtap: 'SetSex', txt: '男' },
            { bindtap: 'SetSex', txt: '女' }
        ],
        sex: '',
    },
    //事件
    sleepZoneTap: function () {
        console.log("sleepZoneTap")
        // wx.scanCode({
        //     complete: (res) => {
        //         console.log(res.result)
        //          wx.navigateTo({
        //             url: './addDevice?info='+res.result
        //         })
        //     }
        //     })

    },
    bindSetSex: function (e) {
        var sexId = e.currentTarget.dataset.id
        let deviceInfo = this.data.deviceInfo
        let sex = this.data.sex
        console.log('bindChange:', sexId)
        if (sexId == 0) {
            sex = '男'
        } else {
            sex = '女'
        }
        this.setData({
            deviceInfo: deviceInfo,
            sex: sex,
            actionSheetHidden: !this.data.actionSheetHidden
        })
        console.log(JSON.stringify(deviceInfo));
    },
    bindChange: function (e) {
        const val = e.detail.value
        console.log('bindChange:', e);
        let year = this.data.year
        let month = this.data.month
        this.setData({
            year: this.data.years[val[0]],
            month: this.data.months[val[1]]
        })
        console.log('bindChange:', this.data);
    },
    sexTap: function () {
        this.setData({
            actionSheetHidden: !this.data.actionSheetHidden
        })
    },
    sexchange: function () {
        this.setData({
            actionSheetHidden: !this.data.actionSheetHidden
        })
    },
    formSubmit: function (e) {
        var that = this
        let deviceInfo = this.data.deviceInfo
        var tenantId = app.config[keys.CONFIG_SERVER].getTenantId();
        if (that.checkOut(e)) {
            console.log("e:", e.detail.value)
            var devId = deviceInfo.devId
            var deviceMac = deviceInfo.deviceMac
            deviceInfo = e.detail.value
            deviceInfo.operator = 'add'
            deviceInfo.type = 'Mattress'
            deviceInfo.devId = devId
            deviceInfo.deviceMac = deviceMac
            console.log("id:", devId);
            that.setData({
                deviceInfo
            });
            console.log('deviceInfo携带数据为：', JSON.stringify(deviceInfo))
            wx.showActionSheet({
                itemList: ['确定绑定？'],
                itemColor: '#f00',
                success: function (res) {
                    app.libs.http.post(app.config[keys.CONFIG_SERVER].getBizUrl() + 'sleepDevicews$addDevice', {deviceInfo, tenantId}, (ret) => {
                        console.log("设备添加接口成功");
                        console.log(ret);
                        app.gOnShowFlags[keys.G_ON_SHOW_NEW_ATTACH_DEVICE] =true
                        wx.switchTab({
                            url: '../dashboard/index'
                        })
                    }, { loadingText: false });
                    //console.log(JSON.stringify(deviceInfo));
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
        let that = this
        let deviceInfo = this.data.deviceInfo
        console.log(" addDevice")
        console.log(options)
        var result = options.info.split("A")
        console.log("A" + result[1])
        //判断是否添加设备
        var tenantId = app.config[keys.CONFIG_SERVER].getTenantId()
        console.log("device list")
        var deviceId = "A" + result[1]
        var deviceMac = result[0]
        app.libs.http.post(app.config[keys.CONFIG_SERVER].getBizUrl() + 'sleepDevicews$isAttach', {deviceId, tenantId }, (ret) => {
            console.log('RET:', ret);
            if (ret.isAttach) {
                console.log("true");
                wx.showModal({
                    content: '请勿重复绑定同一个设备',
                    showCancel:false,
                    success: function (res) {
                        wx.redirectTo({
                            url: './device-list'
                        })
                    }
                })
            } else {
                console.log("false");
            }
        }, { loadingText: false });
        deviceInfo.devId = deviceId
        deviceInfo.deviceMac = deviceMac
        //alert(result);
        this.setData({
            deviceInfo: deviceInfo
        })
    }
})