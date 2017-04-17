//index.js
import keys from '../../config/keys.js'
//获取应用实例
var app = getApp()
Page({
    data: {
       //attachedDevices:[{name:'睡眠监测带',memberName:'爸爸',deviceId:'A1100065'},{name:'睡眠监测带',memberName:'爸爸',deviceId:'A1100065'}],
      memberCarePersonInfo:{}
    },
    removeDevice:function(e){
        console.log(e);
        let that = this
        let deviceId = e.currentTarget.dataset.id
        var tenantId = app.config[keys.CONFIG_SERVER].getTenantId();
        wx.showModal({
            title: '确定解绑？',
            success: function (res) {
                if (res.confirm) {
                    app.libs.http.post(app.config[keys.CONFIG_SERVER].getBizUrl() + 'sleepDevicews$removeDevice', { deviceId, tenantId}, (ret) => {
                        console.log("解除绑定");
                        app.gOnShowFlags[keys.G_ON_SHOW_NEW_ATTACH_DEVICE]=true
                        wx.switchTab({
                            url: '../dashboard/index'
                            })
                    }, { loadingText: false });
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    getCarePersonInfoById: function (cid) {
        let that = this
        app.libs.http.post(app.config[keys.CONFIG_SERVER].getBizUrl() + 'sleepDevicews$getCarePersonInfoById', {cid}, (ret) => {
            console.log("getCarePersonInfoById");
            console.log(ret.memberCarePerson);
            that.setData({
                memberCarePersonInfo: ret.memberCarePerson
            })
        }, { loadingText: false });
    },
    //  onShow: function (options) {
    //   this.getCarePersonInfoById() 
    //  },
    onLoad: function (options) {
        console.log(" carePerson")
        var cid = options.id
        console.log(" carePerson:",cid)
        this.getCarePersonInfoById(cid)
    }
})