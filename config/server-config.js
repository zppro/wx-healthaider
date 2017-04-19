import keys from './keys.js'
const serverConfigProduct = {
    root: 'https://sh.okertrip.com/me-services/',
    biz: 'het/',
    wx: 'weixin/app/',
    qiniu: 'qiniu/open/',
    WSY: {
        wxaConfigId: '58abb97c03ab3c2d3b14cef3'
    }
}
const serverConfigDebugInOffice = {
    root: 'https://m.wx-api.com/me-services/',
    biz: 'het/',
    wx: 'weixin/app/',
    qiniu: 'qiniu/open/',
    WSY: {
        wxaConfigId: '58a65af5330f1e186f997aa0'
    }
}
const serverConfigDebugInHome = {
    root: 'https://m.wx-api.com/me-services/',
    biz: 'het/',
    wx: 'weixin/app/',
    qiniu: 'qiniu/open/',
    WSY: {
        wxaConfigId: 'unknow'
    }
}

module.exports = function (build) {
    let config;
    if (build.where === keys.ENV_BUILD_WHERE_DEBUG_OFFICE) {
        config = serverConfigDebugInOffice
    } else if (build.where === keys.ENV_BUILD_WHERE_DEBUG_HOME) {
        config = serverConfigDebugInHome
    } else {
        config = serverConfigProduct
    }
    return {
        config,
        getBizUrl: function () {
            return this.config.root + this.config.biz
        },
        getWXUrl: function () {
            return this.config.root + this.config.wx
        },
        getQiniuUrl: function () {
            return this.config.root + this.config.qiniu
        },
        getWxaConfigId: function () {
            return this.config[build.target].wxaConfigId
        },
        getTenantId: function () {
            return (this.wxaConfig || {}).tenantId
        },
        setWxaConfig: function (wxaConfig) {
            this.wxaConfig = wxaConfig
            this.wxaConfig.getTemplateId = function (templateKey) {
                let template
                if (this.templates.find) {
                    template = this.templates.find((o) => {
                        return o.key == templateKey
                    });
                } else {
                    for (let i = 0; i < this.templates.length; i++) {
                        if (this.templates[i].key == templateKey) {
                            template = memberInvoiceInfos[i]
                            break
                        }
                    }
                }
                if (template) {
                    return template.wx_template_id
                } else {
                    return ''
                }
            }
            this.appid = wxaConfig.app_id
            this.appname = wxaConfig.app_name
        }
    };
}