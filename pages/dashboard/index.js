//index.js
import keys from '../../config/keys.js'
//获取应用实例
var app = getApp()
Page({
    data: {
        // attachedDevices: [{ memberName: '爸爸', sleepStatus: { fallAsleepTime: '0', sleepTime: '9', deepSleepTime: '3', evalution: '85' } }],
        uptoken: null,
        attachedDevice:{},
        attachedDevices: []
    },
    nextPerson:function(e){
        let old_order = e.currentTarget.dataset.id
        let attachedDevices = this.data.attachedDevices
        let attachedDevice = this.data.attachedDevice
        let order = old_order
        attachedDevice = attachedDevices[order]
        attachedDevice.order = order
        this.setData({
            attachedDevice
        })
    }
    ,
    onPullDownRefresh: function () {
        this.getAttachedDevices(() => { wx.stopPullDownRefresh() })
    },
    ownInfo: function (e) {
        let id = e.currentTarget.dataset.id
        let attachedDevices = this.data.attachedDevices;
        console.log("ownInfo:",attachedDevices[id]);
        let cid = attachedDevices[id].carePersonId;
        wx.navigateTo({
            url: '../mine/carePerson-info?cid='+cid
        })
    },
    showMoreInfo: function (e) {
        console.log("showMoreInfo");
        let devId = e.currentTarget.dataset.id
        console.log("devId:",devId);
        wx.navigateTo({
            url: '../mine/report-info?devId='+devId
        })
    },
    addDevice: function () {
        console.log("sleepZoneTap")
        let deviceInfo = this.data.deviceInfo
        wx.scanCode({
            success: (res) => {
                console.log(res.result)
                wx.navigateTo({
                    url: '../mine/addDevice?info=' + res.result
                })
            },
        })
    },
    onShow: function (options) {
        app.gOnShowFlags[keys.G_ON_SHOW_NEW_ATTACH_DEVICE] && this.getAttachedDevices()
    },
    getAttachedDevices: function (cb) {
        let that = this
        let attachedDevice = this.data.attachedDevice
        let tenantId = app.config[keys.CONFIG_SERVER].getTenantId();
        app.libs.http.post(app.config[keys.CONFIG_SERVER].getBizUrl() + 'sleepDevicews$getAttachDevice', {tenantId}, (attachedDevices) => {
            console.log("getAttachedDevices成功")
            console.log(attachedDevices)
            attachedDevice = attachedDevices[0]
            attachedDevice.order = 0
            that.setData({
                attachedDevices: attachedDevices,
                attachedDevice:attachedDevice
            })
            console.log("attachedDevice1",attachedDevice)
            wx.setStorage({
                key: "attachedDeviceNumbers",
                data: attachedDevices.length
            })
            if (cb && typeof cb == 'function') cb()
        }, { loadingText: false })
        if (cb && typeof cb == 'function') {
            setTimeout(cb, 2000)
        }
    },
    onLoad: function (options) {
        let that = this
        app.toast.init(this)
        this.getAttachedDevices()
    },
    onPullDownRefresh: function () {
        // Do something when pull down.
    },
})