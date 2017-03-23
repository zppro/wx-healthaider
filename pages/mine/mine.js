//index.js
import keys from '../../config/keys.js'
//获取应用实例
var app = getApp()
Page({
    data: {
    },
    //事件
    setting:function(){
        console.log("setting");
    },
    sleepZoneTap:function(){
        console.log("sleepZoneTap");
    //  wx.navigateTo({
    //   url: './addDevice'
    // })
    wx.scanCode({
        complete: (res) => {
            console.log(res.result)
            var result =  res.result.split("A");
            console.log("A"+result[1]);
        }
        })
    },
    braceletTap:function(){
         console.log("braceletTap");
    },
    otherTap:function(){
        console.log("otherTap");
    },
    deleteTap:function(){
        console.log("deleteTap");
    },
    ownTap:function(){
        console.log("ownTap");
    },
    useHelpTap:function(){
        console.log("useHelpTap");
    },
    downLoadTap:function(){
        console.log("downLoadTap");
    },
    onLoad: function (options) {
        let that = this;
        console.log(" onLoad mine");
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        })
    }
})