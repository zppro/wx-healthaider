//index.js
import keys from '../../config/keys.js'


//获取应用实例
var app = getApp()
Page({
    data: {
        deviceInfo: {deviceId:'A1100123',memberName:'爸爸',age:'58',sex:'F'},
        actionSheetHidden: true,
        actionSheetSexItems: [
            { bindtap: 'SetSex', txt: '男' },
            { bindtap: 'SetSex', txt: '女' }
        ],
        sex: '',
    },
    //事件
    removeDevice: function () {
        let that = this
        let deviceInfo = this.data.deviceInfo
        var tenantId = app.config[keys.CONFIG_SERVER].getTenantId();
        wx.showModal({
            title: '确定解绑？',
            success: function (res) {
                if (res.confirm) {
                    app.libs.http.post(app.config[keys.CONFIG_SERVER].getBizUrl() + 'sleepDevicews$removeDevice', { session: app.globalData.session, deviceId: deviceInfo.deviceId, tenantId: tenantId }, (ret) => {
                        console.log("解除绑定");
                        console.log(ret);
                        wx.switchTab({
                            url: './mine'
                            })
                    }, { loadingText: false });
                    console.log(JSON.stringify(deviceInfo));
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    gotoInfo: function (e) {
        wx.navigateTo({
            url: '/pages/mine/device-info'
        })
    },
    bindSetSex: function (e) {
        var sexId = e.currentTarget.dataset.id
        let deviceInfo = this.data.deviceInfo
        let sex = this.data.sex
        console.log('bindChange:', sexId)
        if (sexId == 0) {
            deviceInfo.sex = 'M';
            sex = 'M'
        } else {
            deviceInfo.sex = 'F';
            sex = 'F'
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
        var devId = deviceInfo.deviceId
        var tenantId = app.config[keys.CONFIG_SERVER].getTenantId();
        if (that.checkOut(e)) {
            console.log("e:", e.detail.value)
            deviceInfo = e.detail.value
            deviceInfo.operator = 'add'
            deviceInfo.devId = devId
            deviceInfo.type = 'Mattress'
            that.setData({
                deviceInfo
            });
            console.log('deviceInfo携带数据为：', JSON.stringify(deviceInfo))
            wx.showActionSheet({
                itemList: ['确定修改？'],
                itemColor: '#f00',
                success: function (res) {
                    app.libs.http.post(app.config[keys.CONFIG_SERVER].getBizUrl() + 'sleepDevicews$changeDeviceInfo', { deviceInfo: deviceInfo, session: app.globalData.session, tenantId: tenantId }, (ret) => {
                        console.log("信息修改成功");
                        console.log(ret);
                        wx.switchTab({
                            url: './mine'
                         })
                    }, { loadingText: false });
                    console.log(JSON.stringify(deviceInfo));
                }
            })
        }


    },
    checkOut: function (e) {
        var that = this
        console.log(e.detail.value.cpNewName)
        if (app.util.isEmpty(e.detail.value.cpName)) {
            that.showModal("请输入姓名");
        } else if (app.util.isEmpty(e.detail.value.cpAge)) {
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
    // onShow: function (options) {
    //     let that = this
    //     app.libs.http.post(app.config[keys.CONFIG_SERVER].getBizUrl() + 'sleepDevicews$getDeviceDetails', { session: app.globalData.session, devId: id, tenantId: tenantId }, (ret) => {
    //         console.log("设备添加接口成功");
    //         console.log(ret);
    //         that.setData({
    //             deviceInfo: ret
    //         })
    //     }, { loadingText: false });
    // },
    onLoad: function (options) {
        let that = this
        console.log(" addDevice")
        var id = options.id
        var tenantId = app.config[keys.CONFIG_SERVER].getTenantId();
        app.libs.http.post(app.config[keys.CONFIG_SERVER].getBizUrl() + 'sleepDevicews$getDeviceDetails', { session: app.globalData.session, devId: id, tenantId: tenantId }, (ret) => {
            console.log("设备添加接口成功");
            console.log(ret);
            that.setData({
                deviceInfo: ret
            })
        }, { loadingText: false });
    }
})