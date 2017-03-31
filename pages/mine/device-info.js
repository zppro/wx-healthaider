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
        menu: '',
        sex:'',
    },
    //事件
    gotoInfo:function(e){
          wx.navigateTo({
            url: '/pages/mine/device-info'
        })
    },
    bindSetSex:function(e){
         var sexId = e.currentTarget.dataset.id
         let deviceInfo = this.data.deviceInfo
         let sex = this.data.sex
         console.log('bindChange:', sexId)
         if(sexId == 0){
            deviceInfo.cpNewSex = 'MALE';
            sex = '男'
         }else{
               deviceInfo.cpNewSex = 'FEMALE';
               sex = '女'
         }
        this.setData({
           deviceInfo:deviceInfo,
           sex:sex,
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
                    app.libs.http.post(app.config[keys.CONFIG_SERVER].getBizUrl() + 'sleepDevicews$addDevice', { deviceInfo: deviceInfo, session: app.globalData.session, tenantId: tenantId }, (ret) => {
                        console.log("设备添加接口成功");
                        console.log(ret);
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
        let that = this;
        console.log(" addDevice");
    }
})