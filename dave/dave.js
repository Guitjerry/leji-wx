!function (t, e) {
  "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : t.Dave = e()
}(this, function () {
  "use strict";
  var t = new (function () {
    return function () {
      this.apiHost = "https://mainsite-restapi.ele.me", this.fussHost = "https://fuss10.elemecdn.com", this.appid = "wxece3a9a4c82f58c9"
    }
  }()), e = function (t) {
    var e = t.shopId, n = t.orderId, r = wx.getStorageSync("PLACE"), o = r.latitude, i = r.longitude, a = o && i ? "loc=" + o + "," + i + ";" : "";
    return n ? a += "eosid=" + n : e && (a += "shopid=" + e), a
  }, n = function (n, r) {
    return void 0 === n && (n = {}), void 0 === r && (r = {}), new Promise(function (o, i) {
      n.success = function (t) {
        return o(t)
      }, n.fail = function (t) {
        return i(t)
      }, n.header || (n.header = {});
      var a = e(r);
      a && (n.header["X-Shard"] = a), n.url = (/\/\//.test(n.url) ? "" : t.apiHost) + n.url, wx.request(n)
    }).then(function (t) {
      return t.statusCode >= 200 && t.statusCode < 400 ? Promise.resolve(t) : Promise.reject(t)
    })
  }, r = {
    sendCode: function (t) {
      return n({url: "/eus/v1/weixin_light_app_login_code", method: "POST", data: t})
    }, captchas: function () {
      return n({url: "/eus/v1/users/{user_id}/captchas"})
    }, login: function (t) {
      return n({url: "/eus/v1/weixin_light_app_login", method: "POST", data: t})
    }
  };
  wx.getStorageSync("NEW_USER") || (wx.removeStorageSync("USER"), wx.setStorageSync("NEW_USER", !0));
  var o = new (function () {
    function t() {
      this.data = {}, this.loadSync()
    }

    var e = {union_id: {}, open_id: {}, SID: {}, info: {}, id: {}, user_id: {}};
    return t.prototype.login = function (t) {
      var e = this;
      void 0 === t && (t = {});
      var n = t.validate_token, o = t.validate_code;
      return new Promise(function (t, i) {
        wx.login({
          success: function (a) {
            if (!a.code)return i({name: "HAS_NO_CODE", message: "wx.login 好像有问题"});
            var s = {authcode: a.code};
            o && n && Object.assign(s, {validate_token: n, validate_code: o}), r.login(s).then(function (n) {
              var r = n.data, o = r.union_id, a = r.open_id, s = r.sid, u = r.user;
              if (e.data.union_id = o, e.data.open_id = a, n.data.SID = s, e.data.user = u, e.data.SID = s, wx.setStorageSync("USER", n.data), !u)return i({
                name: "WECHAT_NOT_BIND_USER",
                message: "这个微信号没有绑定过袋鼠公民账户",
                data: {union_id: o, open_id: a}
              });
              t(n.data)
            }).catch(function (t) {
              console.error(t), i(t)
            })
          }, fail: i
        })
      })
    }, t.prototype.save = function (t) {
      this.data = t
    }, t.prototype.loadSync = function () {
      var t = wx.getStorageSync("USER");
      t && (this.data = t)
    }, e.union_id.get = function () {
      return this.data.union_id
    }, e.open_id.get = function () {
      return this.data.open_id
    }, e.SID.get = function () {
      return this.data.SID
    }, e.info.get = function () {
      return this.data.user || {}
    }, e.id.get = function () {
      return this.info.user_id
    }, e.user_id.get = function () {
      return this.info.user_id
    }, t.prototype.removeSync = function () {
      try {
        wx.removeStorageSync("USER"), this.data = {}
      } catch (t) {
        console.log("error", t)
      }
    }, Object.defineProperties(t.prototype, e), t
  }()), i = function (t) {
    return new Promise(function (e, n) {
      wx.requestPayment(Object.assign(t, {success: e, fail: n}))
    })
  }, a = function (e) {
    return n({
      url: "/bos/v1/users/" + o.id + "/orders/" + e + "/transactions/wechat_app",
      method: "POST",
      header: {cookie: "SID=" + o.SID},
      data: {wx_appid: t.appid, open_id: o.open_id}
    }).then(function (t) {
      var e = JSON.parse(t.data.trans_info), n = {};
      decodeURIComponent(e.payData.WEIXIN_PAY).split("&").forEach(function (t) {
        var e = t.split("="), r = e[0], o = e[1], i = e[2];
        2 === e.length ? n[r] = o : n[r] = o + "=" + i
      });
      var r = n.timeStamp, o = n.nonceStr, a = n.signType, s = n.paySign;
      return i({timeStamp: r, nonceStr: o, package: n.package, signType: a, paySign: s})
    })
  }, s = {
    trackerUrl: "https://web-ubt.ele.me/collect/log",
    sortIdKey: "ubt-checking-sort-id",
    version: "1.3.3"
  }, u = function () {
    for (var t = "", e = 0; e < 4; e++)t += "0000000".concat(Math.floor(2821109907456 * Math.random()).toString(36)).slice(-8);
    return t
  }, c = function () {
    var t = wx.getStorageSync("ubt_ssid");
    if (t)return t;
    var e = new Date((new Date).getTime() + 288e5), n = u() + "_" + [e.getUTCFullYear(), e.getUTCMonth() + 1, e.getUTCDate()].join("-").replace(/\b\d\b/g, "0$&");
    return wx.setStorageSync("ubt_ssid", n), n
  }, d = function () {
    return (new Date).getTime().toString(36)
  }, f = function () {
    var t = 0;
    try {
      var e = wx.getStorageSync(s.sortIdKey) || "0";
      (t = parseInt(e, 10)) <= 1e6 ? t += 1 : t = 0, wx.setStorageSync(s.sortIdKey, t.toString())
    } catch (t) {
    }
    return t
  }, h = new (function () {
    function e() {
      this.ssid = c(), this.pvhash = u(), this.sortId = f(), this.scene = wx.getStorageSync("scene") || "", this.from = wx.getStorageSync("qrcode") || "", this.systemInfo = wx.getSystemInfoSync()
    }

    return e.prototype.send = function (t) {
      t.ssid = this.ssid, t.timestamp = d(), t.sort_id = this.sortId, t.pvhash = this.pvhash;
      var e = {data: [t], version: s.version};
      wx.request({url: s.trackerUrl, method: "POST", header: {"X-Requested-With": "ele.me"}, data: e})
    }, e.prototype.sendEvent = function (t) {
      void 0 === t && (t = {}), t.type = "EVENT", "object" != typeof t.params && (t.params = {}), t.params.scene = this.scene, t.params.from = this.from, this.send(t)
    }, e.prototype.sendPv = function () {
      var e = getCurrentPages(), n = e[e.length - 1].route;
      this.pvhash = u(), this.send({
        type: "PV",
        resolution: this.systemInfo.windowWidth + "x" + this.systemInfo.windowHeight,
        location: "https://servicewechat.com/" + t.appid + "/" + n + "?from=" + this.from + "&scene=" + this.scene,
        referrer: "",
        platform_user_id: o.union_id
      })
    }, e
  }()), p = function (e) {
    return e.replace(/^(.)(..)(.{29}(.*))$/, t.fussHost + "/$1/$2/$3.$4")
  }, g = function (t, e, n) {
    var r = e + "x" + n;
    return t + "?imageMogr/thumbnail/!" + r + "r/gravity/Center/crop/" + r + "/"
  }, l = function (t, e, n) {
    if (void 0 === e && (e = 200), void 0 === n && (n = 200), !t)return console.warn("Dave warn: hash is requried.");
    var r = t.match(/^http/) ? t : p(t);
    return g(r, e, n)
  }, S = function () {
    return new Promise(function (t, e) {
      wx.getLocation({type: "gcj02", success: t, fail: e})
    })
  }, m = function () {
    return S().then(function (t) {
      var e = t.latitude, r = t.longitude;
      return wx.setStorageSync("PLACE", {
        latitude: e,
        longitude: r
      }), n({url: "/bgs/poi/reverse_geo_coding?latitude=" + e + "&longitude=" + r})
    }).then(function (t) {
      var e = t.data, n = e.latitude, r = e.longitude;
      return "number" != typeof n || "number" != typeof r ? Promise.reject(t) : (wx.setStorageSync("PLACE", t.data), t.data)
    })
  };
  return new (function () {
    function e() {
      this.ApiCreater = n, this.User = o, this.Pay = a, this.HashToUrl = l, this.Ubt = h, this.Location = m
    }

    return e.prototype.config = function (e) {
      var n = e.apiHost, r = e.fussHost;
      t.apiHost = n, t.fussHost = r
    }, e
  }())
});
