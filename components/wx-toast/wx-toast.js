module.exports = {
    init: function (page) {
        this.page = page;
    },
    showError: function (msg) {
        console.log(msg);
        this.show(msg, { icon: 'cancel', duration: 3000 });
    },
    show: function (msg, {icon = 'success', color = "white", size = "45", duration = 1500 } = {}) {
        if (this.page) {
            this.page.setData({
                toastOptions: { msg, icon, color, size, visiable: true }
            });
            duration && (this.hideId = setTimeout(this.hide.bind(this), duration));
        }
    },
    hide: function () {
        if (this.hideId) {
            clearInterval(this.hideId);
        }
        if (this.page) {
            this.page.setData({
                toastOptions: {
                    visiable: false
                }
            })
        }
    }
}