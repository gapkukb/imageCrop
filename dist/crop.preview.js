
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Crop = factory());
}(this, function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var URL = window.URL || window.webkitURL;
    var _mobile = 'ontouchend' in document;
    var events = {
        end: _mobile ? 'ontouchend' : 'onmouseup',
        move: _mobile ? 'ontouchmove' : 'onmousemove',
        begin: _mobile ? 'ontouchstart' : 'onmousedown',
    };
    var _isEmpty = function (can, ctx) {
        var data = ctx.getImageData(0, 0, can.width, can.height).data;
        var len = data.length;
        for (var i = 0; i < len; i++) {
            if (data[i] !== 255 && data[i] !== 0)
                return false;
        }
        return true;
    };
    var getValueWithBoundary = function (c, min, max) {
        return Math.min(Math.max(c, min), max);
    };
    var $ = function (seletor, parent) {
        return (parent || document).querySelector(seletor);
    };
    var reader = new FileReader();
    var Crop = (function () {
        function Crop(config) {
            this.cfg = {
                size: 1024 * 1024 * 5,
                maskWidth: '60%',
                maskHeight: '60%',
                minWidth: 100,
                minHeight: 100,
                outWidth: 0,
                outHeight: 0,
                keepPP: true,
                event: 'end',
                quality: 100,
                error: function () { }
            };
            this.cfg = __assign({}, this.cfg, config);
            this.view = $(config.view);
            this.file = $(config.file);
            this.init();
        }
        Crop.prototype.init = function () {
            this.vw = this.view.offsetWidth;
            this.vh = this.view.offsetHeight;
            if (this.cfg.circle) {
                this.cfg.keepPP = true;
            }
            this.render();
            this.bindFileEvt();
            this.mk[events.begin] = this.bindEvt.bind(this);
        };
        Crop.prototype.render = function () {
            this.mk = document.createElement('div');
            this.view.style.cssText = "font-size:0;position:relative;overflow:hidden";
            this.img = new Image();
            this.img.draggable = false;
            this.img.crossOrigin = "";
            this.mk.style.cssText = "visibility:hidden;touch-action:none;position: absolute;width:" + this.cfg.maskWidth + ";height:" + this.cfg.maskHeight + ";left:0;top:0;box-shadow:rgba(0,0,0,.7) 0 0 0 " + (this.vw +
                50) + "px";
            this.view.appendChild(this.img);
            this.view.appendChild(this.mk);
            this.mk.innerHTML += "<div style=\"box-sizing:border-box;border:1px dashed #39f;height:100%\"></div><svg id=\"c_c\" style=\"position: absolute;right:-10px;bottom: -12px;touch-action:none\" width=\"30\" height=\"30\" xmlns=\"http://www.w3.org/2000/svg\"><rect style=\"pointer-events:none\" x=\"10\" y = \"10\" width = \"10\" height = \"10\" fill = \"#39f\" /></svg></div>";
            this.dot = $('svg', this.mk);
        };
        Crop.prototype.bindFileEvt = function () {
            if (this.file) {
                this.file.accept = "image/jpeg,image/png,image/webp,image/gif";
                this.file.onchange = this.fileEvt.bind(this);
            }
        };
        Crop.prototype.fileEvt = function () {
            var _this = this;
            var file = this.file.files[0];
            this.file.value = "";
            if (file.type.indexOf("image") === -1) {
                this.cfg.error(0);
            }
            else if (file.size > this.cfg.size) {
                return this.cfg.error(1);
            }
            else if (URL) {
                this.loadImage(URL.createObjectURL(file));
            }
            else {
                reader.readAsDataURL(file);
                reader.onload = function (evt) {
                    _this.loadImage(evt.target.result);
                };
            }
        };
        Crop.prototype.loadImage = function (url, file) {
            var _this = this;
            this.img.src = url;
            this.img.onerror = this.cfg.error.call(null, 2);
            this.img.onload = function () { return _this.loaded(file); };
        };
        Crop.prototype.loaded = function (file) {
            var nw = this.img.naturalWidth, nh = this.img.naturalHeight, w = this.mk.offsetWidth, h = this.mk.offsetHeight;
            this.mk.style.visibility = "";
            this.mp = { w: w, h: h };
            this.kp = w / h;
            if (this.cfg.circle) {
                var min = Math.min(w, h);
                this.resizeDiv(min, min);
                this.mk.style.borderRadius = "50%";
            }
            this.pmt = Math.min(this.vw / nw, this.vh / nh);
            this.img.width = nw * this.pmt;
            this.img.height = nh * this.pmt;
            this.ip = {
                l: (this.vw - this.img.width) / 2,
                t: (this.vh - this.img.height) / 2,
                w: nw,
                h: nh,
            };
            this.img.style.transform = "translate3d(" + this.ip.l + "px," + this.ip.t + "px,0)";
            this.moveDiv((this.vw - w) / 2, (this.vh - h) / 2);
            this.rp = __assign({}, this.mp);
        };
        Crop.prototype.bindEvt = function (e) {
            var _this = this;
            var x1, y1;
            var _a = this.mp, w = _a.w, h = _a.h, l = _a.l, t = _a.t;
            var divFlag = e.srcElement.id !== 'c_c';
            document[events.move] = function (e) {
                e.preventDefault();
                var x2 = e.pageX || e.touches[0].pageX, y2 = e.pageY || e.touches[0].pageY, vw = _this.vw, vh = _this.vh;
                if (!x1)
                    x1 = x2, y1 = y2;
                divFlag ?
                    _this.moveDiv(_this.mp.l = getValueWithBoundary(l + x2 - x1, 0, vw - w), _this.mp.t = getValueWithBoundary(t + y2 - y1, 0, vh - h)) :
                    _this.resizeDiv(getValueWithBoundary(w + x2 - x1, _this.cfg.minWidth, vw - l), getValueWithBoundary(h + y2 - y1, _this.cfg.minHeight, vh - t));
            };
            document[events.end] = function () {
                document[events.move] = document[events.end] = null;
            };
        };
        Crop.prototype.resizeDiv = function (w, h) {
            if (this.cfg.keepPP) {
                if (this.kp > 1)
                    h = w / this.kp;
                else
                    w = h * this.kp;
            }
            this.mp.w = w;
            this.mp.h = h;
            this.mk.style.width = w + 'px';
            this.mk.style.height = h + 'px';
        };
        Crop.prototype.moveDiv = function (left, top) {
            this.mp.l = left;
            this.mp.t = top;
            this.mk.style.transform = "translate3d(" + left + "px," + top + "px,0px)";
        };
        Crop.prototype.cropped = function () {
            var cfg = this.cfg;
            var can = document.createElement('canvas');
            var ctx = can.getContext('2d');
            var _a = this.mp, w = _a.w, h = _a.h, l = _a.l, t = _a.t;
            var outSize = Math.max(cfg.outWidth, cfg.outHeight);
            var p = Math.min(outSize / w, outSize / h);
            can.width = outSize > 0 ? w * p : h / this.pmt;
            can.height = outSize > 0 ? h * p : h / this.pmt;
            var _b = [can.width, can.height], cw = _b[0], ch = _b[1];
            if (cfg.ext.indexOf('jpg') !== -1) {
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, cw, ch);
            }
            if (cfg.circle) {
                ctx.arc(cw / 2, ch / 2, cw / 2, 0, 2 * Math.PI);
                ctx.clip();
            }
            var l1 = l - this.ip.l, t1 = t - this.ip.t, l2 = l1 / this.pmt, t2 = t1 / this.pmt;
            ctx.drawImage(this.img, Math.max(0, l2), Math.max(0, t2), w / this.pmt, h / this.pmt, -Math.min(l1, 0) * cw / w, -Math.min(t1, 0) * ch / w, cw, ch);
            if (_isEmpty(can, ctx)) {
                return cfg.error(3);
            }
            var data = can.toDataURL("image/" + cfg.ext, cfg.quality / 100);
            can = ctx = null;
            var img = new Image();
            img.src = data;
            document.body.appendChild(img);
            return data;
        };
        Crop.prototype.reset = function () {
            var _a = this.rp, w = _a.w, h = _a.h, l = _a.l, t = _a.t;
            this.moveDiv(l, t);
            this.resizeDiv(w, h);
        };
        Crop.prototype.clear = function () {
            URL['revokeObjectURL'](this.img.src);
            clearTimeout(this.t);
            this.file.onchange =
                this.mk[events.begin] =
                    events =
                        getValueWithBoundary =
                            reader =
                                HTMLImageElement.prototype.ready =
                                    this.img.onerror =
                                        null;
        };
        return Crop;
    }());

    var Crop$1 = (function (_super) {
        __extends(Crop, _super);
        function Crop() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Crop.prototype.loadImage = function () {
        };
        return Crop;
    }(Crop));

    return Crop$1;

}));
