var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import Core from './core';
var Crop = (function (_super) {
    __extends(Crop, _super);
    function Crop(cfg) {
        var _this = _super.call(this, cfg) || this;
        _this.pv = typeof cfg.preview === 'string' ? _this.$(cfg.preview) : cfg.preview;
        _this.rp();
        return _this;
    }
    Crop.prototype.rp = function () {
        this.in = this.$c("div");
        this.in.style.cssText = "font-size:0;overflow:hidden;" + (this.cfg.circle ? 'border-radius:50%' : '');
        this.pv.appendChild(this.in);
        var w = this.pv.offsetWidth;
        this.pp = { w: w, h: w / this.vw * this.vh };
        this.pv.style.cssText = "position:relative;overflow:hidden;height:" + this.pp.h + "px";
        this.img.addEventListener('load', this.loadpre.bind(this));
    };
    Crop.prototype.loadpre = function () {
        var _this = this;
        setTimeout(function () {
            _this.pi = _this.img.cloneNode();
            _this.pi.style.transformOrigin = "left top";
            _this.in.appendChild(_this.pi);
            _this.pc();
        });
    };
    Crop.prototype.pc = function () {
        var p = 1 / Math.max(this.mp.w / this.pp.w, this.mp.h / this.pp.h);
        this.pi.style.transform = "translate3d(" + (this.ip.l - this.mp.l) + "px," + (this.ip.t - this.mp.t) + "px,0)";
        this.in.style.width = this.mp.w + "px";
        this.in.style.height = this.mp.h + "px";
        this.in.style.transform = "scale(" + p + ") translate3d(" + (this.pp.w - this.mp.w) / 2 / p + "px," + (this.pp.h - this.mp.h) / 2 / p + "px,0)";
    };
    return Crop;
}(Core));
export default Crop;
