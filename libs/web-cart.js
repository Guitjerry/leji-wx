! function(t, i) {
  "object" == typeof exports && "object" == typeof module ? module.exports = i() : "function" == typeof define && define.amd ? define([], i) : "object" == typeof exports ? exports.WebCart = i() : t.WebCart = i()
}(this, function() {
  return function(t) {
    function i(n) {
      if (e[n]) return e[n].exports;
      var r = e[n] = {
        exports: {},
        id: n,
        loaded: !1
      };
      return t[n].call(r.exports, r, r.exports, i), r.loaded = !0, r.exports
    }
    var e = {};
    return i.m = t, i.c = e, i.p = "", i(0)
  }([function(t, i, e) {
    "use strict";

    function n(t) {
      return t && t.__esModule ? t : {
        "default": t
      }
    }
    Object.defineProperty(i, "__esModule", {
      value: !0
    }), i.Cart = i.Group = i.Entity = void 0;
    var r = e(2),
      a = n(r),
      u = e(3),
      o = n(u),
      s = e(4),
      c = n(s);
    i.Entity = a["default"], i.Group = o["default"], i.Cart = c["default"], i["default"] = c["default"]
  }, function(t, i) {
    "use strict";
    Object.defineProperty(i, "__esModule", {
      value: !0
    }), i["default"] = function(t) {
      return +t.toFixed(2)
    }
  }, function(t, i, e) {
    "use strict";

    function n(t) {
      return t && t.__esModule ? t : {
        "default": t
      }
    }

    function r(t, i) {
      if (!(t instanceof i)) throw new TypeError("Cannot call a class as a function")
    }
    var a = function() {
      function t(t, i) {
        for (var e = 0; e < i.length; e++) {
          var n = i[e];
          n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
        }
      }
      return function(i, e, n) {
        return e && t(i.prototype, e), n && t(i, n), i
      }
    }();
    Object.defineProperty(i, "__esModule", {
      value: !0
    });
    var u = e(1),
      o = n(u),
      s = function() {
        function t() {
          var i = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0],
            e = arguments.length <= 1 || void 0 === arguments[1] ? 1 : arguments[1],
            n = arguments.length <= 2 || void 0 === arguments[2] ? {} : arguments[2];
          r(this, t), (i.food_id || i.id) && (this.id = i.food_id || i.id), i.sku_id && (this.sku_id = i.sku_id), this.item_id = i.item_id, this.quantity = e, this.name = i.name, this.price = i.price, this.original_price = i.original_price, this.packing_fee = i.packing_fee, this.stock = i.stock || 0, this.minimum_purchase = i.minimum_purchase || 1, this.discount_isall = i.discount_isall || 0, this.is_required = i.is_required || 0, this.specs = i.specs || [], this.attrs = i.attrs || [], i.hasOwnProperty("weight") && (this.weight = i.weight), i.activity && (this.activity = i.activity), this.extra = n || {}, this.foodActivityLimit()
        }
        return a(t, [{
          key: "set",
          value: function(t) {
            var i = parseInt(t, 10);
            return i || 0 === i ? (0 > i ? this.quantity = 1 : this.quantity = i, {
              quantity: this.quantity,
              action: this.foodActivityLimit()
            }) : this.quantity
          }
        }, {
          key: "updateData",
          value: function(t, i) {
            var e = t.name,
              n = t.original_price,
              r = t.price,
              a = t.stock,
              b = t.minimum_purchase,
              g = t.discount_isall,
              d = t.is_required,
              u = t.packing_fee,
              o = t.specs,
              s = t.weight,
              c = t.attrs,
              f = {
                name: e,
                original_price: n,
                price: r,
                stock: a,
                minimum_purchase: b,
                discount_isall: g,
                is_required: d,
                packing_fee: u,
                specs: o,
                weight: s,
                attrs: c,
                extra: i
              };
            for (var l in f) {
              var d = f[l];
              this[l] = "undefined" == typeof d ? this[l] : d
            }
            return this.foodActivityLimit(), this
          }
        }, {
          key: "foodActivityLimit",
          value: function() {
            if (this.view_original_price = this.view_discount_price = (0, o["default"])((this.original_price || this.price) * this.quantity), this.activity) {
              var t = this.activity,
                i = t.applicable_quantity,
                e = t.quantity_condition,
                n = this.price,
                r = this.original_price,
                a = this.quantity,
                u = Math.floor(a / e),
                s = Math.min(u, i);
              this.view_discount_quantity = s;
              var c = s * n,
                f = (a - s) * r;
              return this.view_discount_price = (0, o["default"])(c + f), u - i === 1 ? "EXCEED_FOOD_ACTIVITY_LIMIT_TIP" : "EXCEED_FOOD_ACTIVITY_LIMIT"
            }
          }
        }]), t
      }();
    i["default"] = s
  }, function(t, i, e) {
    "use strict";

    function n(t) {
      return t && t.__esModule ? t : {
        "default": t
      }
    }

    function r(t, i) {
      if (!(t instanceof i)) throw new TypeError("Cannot call a class as a function")
    }
    var a = function() {
      function t(t, i) {
        for (var e = 0; e < i.length; e++) {
          var n = i[e];
          n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
        }
      }
      return function(i, e, n) {
        return e && t(i.prototype, e), n && t(i, n), i
      }
    }();
    Object.defineProperty(i, "__esModule", {
      value: !0
    });
    var u = e(2),
      o = n(u),
      s = e(1),
      c = n(s),
      f = function() {
        function t() {
          var i = arguments.length <= 0 || void 0 === arguments[0] ? [] : arguments[0],
            e = arguments[1];
          r(this, t), this.entities = i.map(function(t) {
            var i = t.quantity,
              e = t.extra;
            return new o["default"](t, i, e)
          }), this.maxDiscountQuantity = e, this.restaurantActivityLimit()
        }
        return a(t, [{
          key: "findById",
          value: function(t) {
            return this.entities.filter(function(i) {
              var e = t.sku_id ? "sku_id" : "id";
              return t[e] === i[e]
            })
          }
        }, {
          key: "find",
          value: function(t) {
            var i = this.findById(t);
            return t.attrs && Array.isArray(t.attrs) ? (i = i.filter(function(i) {
              return t.attrs.every(function(t, e) {
                var n = i.attrs[e];
                return n ? t.value === n.value : !1
              })
            }), i[0]) : i[0]
          }
        }, {
          key: "getQuantityById",
          value: function(t) {
            return this.findById(t).reduce(function(t, i) {
              return t + i.quantity
            }, 0)
          }
        }, {
          key: "getQuantityByIdAndAttrs",
          value: function(t) {
            return this.find(t).quantity
          }
        }, {
          key: "set",
          value: function(t, i) {
            var e = arguments.length <= 2 || void 0 === arguments[2] ? {} : arguments[2],
              n = this.find(t);
            n ? n.updateData(t, e) : (n = new o["default"](t, 0, e), this.entities.push(n));
            var r = n.quantity,
              a = n.set(i),
              u = a.quantity;
            if (0 >= u) return this.entities.splice(this.entities.indexOf(n), 1), {
              entity: n,
              action: "ENTITY_DESTROY"
            };
            var s = this.restaurantActivityLimit(n) || a.action || "",
              c = "";
            return c = 0 === r ? "ENTITY_CREATE" : u > r ? "ENTITY_ADD" : "ENTITY_SUB", {
              entity: n,
              action: c,
              activityAction: s
            }
          }
        }, {
          key: "restaurantActivityLimit",
          value: function() {
            var t = this,
              i = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0];
            if (-1 !== this.maxDiscountQuantity) {
              var e = this.entities.filter(function(t) {
                  return t.activity
                }),
                n = e.reduce(function(t, i) {
                  return t + i.view_discount_quantity
                }, 0);
              if (!(n <= this.maxDiscountQuantity)) {
                e.sort(function(t, i) {
                  var e = t.original_price - t.price,
                    n = i.original_price - i.price;
                  return n - e
                });
                var r = 0;
                if (e.forEach(function(i, e) {
                    var n = function(i) {
                      if (r >= t.maxDiscountQuantity) return i.view_discount_price = (0, c["default"])(i.original_price * i.quantity);
                      if (i.quantity + r >= t.maxDiscountQuantity) {
                        var e = t.maxDiscountQuantity - r;
                        r += e, i.view_discount_price = (0, c["default"])(i.price * e + (i.quantity - e) * i.original_price)
                      } else r += i.quantity
                    };
                    n(i)
                  }), i.activity) return n - this.maxDiscountQuantity === 1 ? "EXCEED_RESTAURANT_ACTIVITY_LIMIT_TIP" : "EXCEED_RESTAURANT_ACTIVITY_LIMIT"
              }
            }
          }
        }]), t
      }();
    i["default"] = f
  }, function(t, i, e) {
    "use strict";

    function n(t) {
      return t && t.__esModule ? t : {
        "default": t
      }
    }

    function r(t) {
      if (Array.isArray(t)) {
        for (var i = 0, e = Array(t.length); i < t.length; i++) e[i] = t[i];
        return e
      }
      return Array.from(t)
    }

    function a(t, i) {
      if (!(t instanceof i)) throw new TypeError("Cannot call a class as a function")
    }
    var u = function() {
      function t(t, i) {
        for (var e = 0; e < i.length; e++) {
          var n = i[e];
          n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
        }
      }
      return function(i, e, n) {
        return e && t(i.prototype, e), n && t(i, n), i
      }
    }();
    Object.defineProperty(i, "__esModule", {
      value: !0
    });
    var o = e(3),
      s = n(o),
      c = e(1),
      f = n(c),
      l = "CART_MAP",
      d = function() {
        return "undefined" != typeof localStorage ? localStorage.getItem(l) : "undefined" != typeof wx ? wx.getStorageSync(l) : {}
      },
      h = function() {
        var t = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0],
          i = JSON.stringify(t);
        return "undefined" != typeof localStorage ? localStorage.setItem(l, i) : "undefined" != typeof wx ? wx.setStorageSync(l, i) : {}
      },
      p = function() {
        function t(i) {
          var e = arguments.length <= 1 || void 0 === arguments[1] ? -1 : arguments[1];
          a(this, t), this.restaurant_id = i, this.cartMap = {}, this.groups = [], this.quantity = 0, this.total = 0, this.maxDiscountQuantity = e, this.load(), this.count()
        }
        return u(t, [{
          key: "loadCartMap",
          value: function() {
            var t = d("CART_MAP");
            if (!t) return void this.update([new s["default"]]);
            try {
              this.cartMap = JSON.parse(t)
            } catch (i) {
              console.error("CANNOT PARSE CART_MAP FROM LOCALSTORAGE.")
            }
          }
        }, {
          key: "load",
          value: function() {
            var t = this;
            this.loadCartMap(), this.cartMap[this.restaurant_id] || this.update([new s["default"]([], this.maxDiscountQuantity)]), this.groups = this.cartMap[this.restaurant_id].map(function(i) {
              return new s["default"](i.entities, t.maxDiscountQuantity)
            })
          }
        }, {
          key: "update",
          value: function(t) {
            this.groups = t, this.cartMap[this.restaurant_id] = t, h(this.cartMap), this.count()
          }
        }, {
          key: "updateFromCartData",
          value: function(t) {
            var i = t.map(function(t) {
              return new s["default"](t)
            });
            return this.loadCartMap(), this.update(i), this.groups
          }
        }, {
          key: "count",
          value: function() {
            var t, i = 0,
              e = 0,
              n = 0;
            return (t = []).concat.apply(t, r(this.groups.map(function(t) {
              return t.entities
            }))).forEach(function(t) {
              i += t.quantity, e += t.view_discount_price + t.quantity * (t.packing_fee || 0), n += t.view_original_price + t.quantity * (t.packing_fee || 0)
            }, 0), this.quantity = i, this.discountTotal = (0, f["default"])(e), this.originalTotal = (0, f["default"])(n), {
              quantity: i,
              discountTotal: e,
              originalTotal: n
            }
          }
        }, {
          key: "createGroup",
          value: function() {
            var t = new s["default"]([], this.maxDiscountQuantity);
            return this.loadCartMap(), this.update([].concat(r(this.groups), [t])), {
              group: t,
              action: "GROUP_CREATE"
            }
          }
        }, {
          key: "removeGroup",
          value: function(t) {
            var i = this.groups[t],
              e = this.groups.filter(function(i, e) {
                return e !== t
              });
            return this.loadCartMap(), this.update(e), {
              group: i,
              action: "GROUP_DESTROY"
            }
          }
        }, {
          key: "clearGroup",
          value: function(t) {
            var i = this.groups[t] = new s["default"];
            return this.loadCartMap(), this.update(this.groups), {
              group: i,
              action: "GROUP_CLEAR"
            }
          }
        }, {
          key: "clearCart",
          value: function() {
            this.groups = [];
            var t = this.createGroup(),
              i = t.group;
            return {
              group: i,
              action: "CART_CLEAR"
            }
          }
        }, {
          key: "setEntity",
          value: function(t) {
            var i = arguments.length <= 1 || void 0 === arguments[1] ? 1 : arguments[1],
              e = arguments.length <= 2 || void 0 === arguments[2] ? 0 : arguments[2],
              n = arguments.length <= 3 || void 0 === arguments[3] ? {} : arguments[3],
              r = this.groups[e] || this.clearCart().group,
              a = r.set(t, i, n),
              u = a.entity,
              o = a.action,
              s = a.activityAction;
            return this.loadCartMap(), this.update(this.groups), {
              entity: u,
              action: o,
              activityAction: s
            }
          }
        }]), t
      }();
    i["default"] = p
  }])
});