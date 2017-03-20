//app.js
import libs from 'utils/libs.js'
import util from 'utils/util.js'
import keys from 'config/keys.js'
import toast from 'components/wx-toast/wx-toast'

const build = {
  where: keys.ENV_BUILD_WHERE_DEBUG_OFFICE, //ENV_BUILD_WHERE_DEBUG_OFFICE, ENV_BUILD_WHERE_PRODUCE
  target: keys.ENV_BUILD_TARGET_WSY // ENV_BUILD_TARGET_WSY
}
const serverConfig = require('config/server-config.js')(build)

App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var that = this;
    // 读取配置
    this.config[keys.CONFIG_SERVER] = serverConfig
    this.libs.http.get(serverConfig.getWXUrl() + 'wxaConfig/' + serverConfig.getWxaConfigId(), (wxaConfig) => {
      console.log('wxaConfig:' + wxaConfig)
      serverConfig.setWxaConfig(wxaConfig)
      that.appid = serverConfig.appid
      that.appname = serverConfig.appname
      // 读取缓存中的session_key并从服务端读取session
      let gen_session_key = wx.getStorageSync(keys.STG_SESSION_KEY_NAME);
      if (gen_session_key) {
        that.libs.http.get(serverConfig.getWXUrl() + 'getSession/' + gen_session_key, (session) => {
          console.log(session);
          if (!session) {
            //过期重新请求
            that.requestSession()
          } else {
            that.globalData.session = session;
            that.getUserInfo();
          }
        }, {loadingText: false})
      } else {
        that.requestSession()
      }
      that.noStateComponentsInit()
    }, {loadingText: false})
  },
  noStateComponentsInit: function () {
  },
  requestAccessToken: function (cb) {
    let that = this;
    this.libs.http.post(that.config[keys.CONFIG_SERVER].getWXUrl() + 'requestAccessToken', { appid: this.appid }, function (ret) {
      if (ret) {
        console.log('requestAccessToken:' + ret)
        typeof cb == 'function' && cb(ret)
      }
    }, {loadingText: false})
  },
  requestSession: function () {
    console.log('requestSession')
    let that = this;
    wx.login({
      success: function (res1) {
        console.log('requestSession with code:' + res1.code);
        that.libs.http.post(that.config[keys.CONFIG_SERVER].getWXUrl() + 'requestSession', { appid: that.appid, code: res1.code }, (ret) => {
          if (ret && ret.session_key && ret.session_value) {
            wx.setStorageSync(keys.STG_SESSION_KEY_NAME, ret.session_key);
            that.globalData.session = ret.session_value;
          }
        }, {loadingText: false});
        wx.getUserInfo({
          success: function (res2) {
            that.globalData.userInfo = res2.userInfo
          }
        });
      },
      fail: function (err) {
        console.log('requestSession error');
        console.log(err);
      }
    });

  },
  getUserInfo: function (cb) {
    console.log("用户登录");
        var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (res1) {
          console.log(res1);
          wx.getUserInfo({
            success: function (res2) {
              console.log("res2");
              that.globalData.userInfo = res2.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  getSession: function () {
    return this.globalData.session
  },
  toast,
  util,
  libs,
  env: {
    build
  },
  config: {},
  globalData: {
    session: null,
    userInfo: null
  }
})