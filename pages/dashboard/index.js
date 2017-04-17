//index.js
import keys from '../../config/keys.js'
//获取应用实例
var app = getApp()
Page({
    data: {
        //attachedDevices: [{ memberName: '爸爸', sleepStatus: { fallAsleepTime: '0', sleepTime: '9', deepSleepTime: '3', evalution: '85' } }],
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
    changeCarePersionAvatar: function (e) {
        wx.navigateTo({
            url: '../mine/carePerson-info'
        })
        // let that = this;
        // let id = e.currentTarget.dataset.id
        // if (!this.data.uptoken) {
        //     this.getUpToken().then(function (uptoken) {
        //         that.setData({
        //             uptoken
        //         })
        //         that.didPressChooseImage(id)
        //     });
        // } else {
        //     this.didPressChooseImage(id)
        // }
    },
    didPressChooseImage: function (id) {
        let that = this;
        let tenantId = app.config[keys.CONFIG_SERVER].getTenantId()
        let attachedDevices = this.data.attachedDevices
        let deviceName = attachedDevices[id].deviceId
        // 选择图片
        wx.chooseImage({
            count: 1,
            success: function (res) {
                let filePath = res.tempFilePaths[0];
                // 交给七牛上传
                app.libs.qiniuUploader.upload(filePath, (res) => {
                    // 每个文件上传成功后,处理相关的事情
                    // 其中 info 是文件上传成功后，服务端返回的json，形式如
                    // {
                    //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                    //    "key": "gogopher.jpg"
                    //  }
                    // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
                    console.log('upload success:', res.imageURL);
                    let portraitUrl = res.imageURL
                    app.libs.http.post(app.config[keys.CONFIG_SERVER].getBizUrl() + 'sleepDevicews$changeCarePersonPortrait', { portraitUrl, deviceName, tenantId }, (ret) => {
                        console.log("changeCarePersonPortrait okertrip");
                        attachedDevices[id].portraitUrl = portraitUrl
                        console.log("attachedDevices imageURL:", attachedDevices[id].portraitUrl)
                        that.setData({
                            attachedDevices
                        })
                        console.log(attachedDevices);
                    }, { loadingText: false })
                }, (error) => {
                    console.log('error: ' + error);
                }, {
                        uploadURL: 'https://up.qbox.me',
                        domain: 'https://img2.okertrip.com/',
                        key: ('avatar/' + filePath).replace(/:\/\//g, "/"),
                        uptoken: that.data.uptoken
                    });
            }
        })
    },
    showMoreInfo: function () {
        console.log("showMoreInfo");
        wx.navigateTo({
            url: '../mine/device-list'
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
    getUpToken: function () {
        return new Promise(function (resolve) {
            app.libs.http.get(app.config[keys.CONFIG_SERVER].getQiniuUrl() + 'uploadTokenForWXApp/', (uptoken) => {
                console.log("getUpToken", uptoken)
                resolve(uptoken)
            }, { loadingText: false })
        })
    },
    getAttachedDevices: function (cb) {
        let that = this
        let attachedDevice = this.data.attachedDevice
       
        app.libs.http.post(app.config[keys.CONFIG_SERVER].getBizUrl() + 'sleepDevicews$getAttachDevice', {}, (attachedDevices) => {
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