//index.js
import keys from '../../config/keys.js'


//获取应用实例
var app = getApp()
Page({
    data: {
        memberCarePersonInfo: {},
        actionSheetHidden: true,
        actionSheetSexItems: [
            { bindtap: 'SetSex', txt: '男' },
            { bindtap: 'SetSex', txt: '女' }
        ],
        sex: '',
    },
      changeCarePersionAvatar: function (e) {
        let that = this;
        let id = e.currentTarget.dataset.id
         console.log('id:', id);
        if (!this.data.uptoken) {
            this.getUpToken().then(function (uptoken) {
                that.setData({
                    uptoken
                })
                that.didPressChooseImage(id)
            });
        } else {
            this.didPressChooseImage(id)
        }
    },
    didPressChooseImage: function (id) {
        let that = this;
        let memberCarePersonInfo = this.data.memberCarePersonInfo
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
                    app.libs.http.post(app.config[keys.CONFIG_SERVER].getBizUrl() + 'sleepDevicews$changeCarePersonPortrait', { portraitUrl, id }, (ret) => {
                        console.log("changeCarePersonPortrait okertrip");
                        memberCarePersonInfo.portraitUrl = portraitUrl
                        console.log("attachedDevices imageURL:", memberCarePersonInfo.portraitUrl)
                        that.setData({
                            memberCarePersonInfo
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
     getUpToken: function () {
        return new Promise(function (resolve) {
            app.libs.http.get(app.config[keys.CONFIG_SERVER].getQiniuUrl() + 'uploadTokenForWXApp/', (uptoken) => {
                console.log("getUpToken", uptoken)
                resolve(uptoken)
            }, { loadingText: false })
        })
    },
    bindnameInput:function(e){
        let memberCarePersonInfo = this.data.memberCarePersonInfo
        memberCarePersonInfo.carePersonName = e.detail.value
        this.setData({
         memberCarePersonInfo
         })
    },
     bindageInput:function(e){
        let memberCarePersonInfo = this.data.memberCarePersonInfo
        memberCarePersonInfo.age = e.detail.value
        this.setData({
         memberCarePersonInfo
         })
    },
    bindSetSex: function (e) {
        var sexId = e.currentTarget.dataset.id
        let memberCarePersonInfo = this.data.memberCarePersonInfo
        let sex = this.data.sex
        console.log('bindChange:', sexId)
        if (sexId == 0) {
            memberCarePersonInfo.sex = 'M';
            sex = 'M'
        } else {
            memberCarePersonInfo.sex = 'F';
            sex = 'F'
        }
        this.setData({
            memberCarePersonInfo: memberCarePersonInfo,
            sex: sex,
            actionSheetHidden: !this.data.actionSheetHidden
        })
        console.log(JSON.stringify(memberCarePersonInfo));
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
        let memberCarePersonInfo = this.data.memberCarePersonInfo
        var carePersonId = memberCarePersonInfo.carePersonId
        var tenantId = app.config[keys.CONFIG_SERVER].getTenantId();
        if (that.checkOut(e)) {
            console.log("e:", e.detail.value)
            memberCarePersonInfo = e.detail.value
            memberCarePersonInfo.carePersonId = carePersonId
            that.setData({
                memberCarePersonInfo
            });
            console.log('memberCarePersonInfo携带数据为：', JSON.stringify(memberCarePersonInfo))
            wx.showActionSheet({
                itemList: ['确定修改？'],
                itemColor: '#f00',
                success: function (res) {
                    app.libs.http.post(app.config[keys.CONFIG_SERVER].getBizUrl() + 'sleepDevicews$changeCarePersonInfo', { memberCarePersonInfo, tenantId }, (ret) => {
                        console.log("信息修改成功");
                        app.gOnShowFlags[keys.G_ON_SHOW_NEW_ATTACH_DEVICE] = true
                        wx.switchTab({
                            url: '../dashboard/index'
                         })
                    }, { loadingText: false });
                    console.log(JSON.stringify(memberCarePersonInfo));
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
    onLoad: function (options) {
        let that = this
        console.log(" carePerson")
        var cid = options.cid
        console.log(" carePerson:",cid)
        app.libs.http.post(app.config[keys.CONFIG_SERVER].getBizUrl() + 'sleepDevicews$getCarePersonInfoById', {cid}, (ret) => {
            console.log("getCarePersonInfoById");
            console.log(ret.memberCarePerson);
            that.setData({
                memberCarePersonInfo: ret.memberCarePerson
            })
        }, { loadingText: false });
    }
})