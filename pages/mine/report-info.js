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
        report: {}
    },
    //事件
    getReport: function (devId) {
        let that = this
        let today = util.formatTime(new Date)
        let report = this.data.report
        let reportInfos = this.data.reportInfos
        var today_result = today.split(" ")
        today = today_result[0].replace(/\//g, "-")
        let tenantId = app.config[keys.CONFIG_SERVER].getTenantId()
        app.libs.http.post(app.config[keys.CONFIG_SERVER].getBizUrl() + 'sleepDevicews$getDateReport', { devId, tenantId, skip: reportInfos.length }, (dateReports) => {
            console.log("dateReports成功")
            console.log(dateReports)

            for (var i = 0, length = dateReports.length; i < length; i++) {
                var date_end_result = dateReports[i].date_end.split("T")
                dateReports[i].endTime = date_end_result[0]
                var fallasleep_time = dateReports[i].fallasleep_time.split("T")
                var awake_time = dateReports[i].fallasleep_time.split("T")
                var light_sleep_duraion = dateReports[i].light_sleep_duraion.toFixed(2)
                var deep_sleep_duraion = dateReports[i].deep_sleep_duraion.toFixed(2)
                reportInfos = dateReports
                if (date_end_result[0] == today) {
                    report = dateReports[i]
                    report.beginTime = dateReports[i].date_begin.split("T")[0]
                    report.endTime = date_end_result[0]
                    report.fallasleep_time = fallasleep_time[1].split(".")[0]
                    report.awake_time = awake_time[1].split(".")[0]
                    report.light_sleep_duraion = light_sleep_duraion
                    report.deep_sleep_duraion = deep_sleep_duraion
                    that.setData({
                        report: report
                    })
                }
                that.setData({
                    reportInfos:reportInfos
                })
                console.log("reportInfos:", reportInfos)
                console.log("report:", report)
            }
        }, { loadingText: false })
    },
    onLoad: function (options) {
        let devId = options.devId
        this.setData({
            devId: devId
        })
        this.getReport(devId);
    }
})