// pages/demo1/demo1.js
import {request} from "../../request/index";
Component({
    properties: {
        coupons: {
            type: Object,
        }
    },
    // observers: {
    //     'coupons': function(couponList) {
    //         this.setData({
    //             coupons: couponList
    //         })
    //     }
    // },
    data: {
        wHeight:0
    },
    methods: {

    },
    ready() {
        const that = this
        wx.getSystemInfo({
            success:function (res) {
                that.setData({
                    wHeight: res.windowHeight
                })
            }
        })
    }
})