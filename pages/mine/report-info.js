//index.js
import keys from '../../config/keys.js'
//获取应用实例
var app = getApp()
var util = require('../../utils/util.js')
Page({
    data: {
        devId: '',
        //  reportInfos: [{fallasleep_time:"19:30",light_sleep_duraion:"5",deep_sleep_duraion:"3",endTime:"2017-04-18"},{fallasleep_time:"19:30",light_sleep_duraion:"5",deep_sleep_duraion:"3",endTime:"2017-04-17"},{fallasleep_time:"19:30",light_sleep_duraion:"5",deep_sleep_duraion:"3",endTime:"2017-04-18"},{fallasleep_time:"19:30",light_sleep_duraion:"5",deep_sleep_duraion:"3",endTime:"2017-04-17"},{fallasleep_time:"19:30",light_sleep_duraion:"5",deep_sleep_duraion:"3",endTime:"2017-04-18"},{fallasleep_time:"19:30",light_sleep_duraion:"5",deep_sleep_duraion:"3",endTime:"2017-04-17"}],
        // report: {fallasleep_time:"19:30",light_sleep_duraion:"5",deep_sleep_duraion:"3",endTime:"2017-04-18",beginTime:"2017-04-17"},
        reportInfos: [],
        report: {},
        isFirst:true
    },
    //事件
    getReport: function (devId, cb) {
        let that = this
        let today = util.formatTime(new Date)
        let report = this.data.report
        let isFirst = this.data.isFirst
        let reportInfos = this.data.reportInfos
        var today_result = today.split(" ")
        today = today_result[0].replace(/\//g, "-")
        let tenantId = app.config[keys.CONFIG_SERVER].getTenantId()
        app.libs.http.post(app.config[keys.CONFIG_SERVER].getBizUrl() + 'sleepDevicews$getDateReport', { devId, tenantId, skip: reportInfos.length }, (dateReports) => {
            console.log("dateReports成功")
            console.log(dateReports)
            reportInfos = reportInfos.concat(dateReports)
            if(isFirst){
                report = dateReports[0]
                isFirst = false
            }
             that.setData({
                    reportInfos,
                    report
                })
            if (cb && typeof cb == 'function') cb()
        }, { loadingText: false })
        if (cb && typeof cb == 'function') {
            setTimeout(cb, 2000)
        }
    },
    onLoad: function (options) {
        let devId = options.devId
        this.setData({
            devId: devId
        })
        this.getReport(devId);
    },
    onReachBottom: function () {
        console.log("onReachBottom report")
        let devId = this.data.devId
        wx.showLoading({
            title: '加载中',
            })
        this.getReport(devId, () => { 
            wx.hideLoading()
            wx.stopPullDownRefresh()
         })
    }
})