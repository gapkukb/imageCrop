import { resolve } from "dns";

declare var window: Window & { URL: any, webkitURL: any }
const URL = window.URL || window.webkitURL
const enum Ecode {
    inValidFile,
    oversize,
    loadFailed,
    emptyImage
}

let _mobile = 'ontouchend' in document;
let events: {
    [index: string]: 'ontouchend' | 'onmouseup' | 'ontouchmove' | 'onmousemove' | 'ontouchstart' | 'onmousedown'
} = {
    end: _mobile ? 'ontouchend' : 'onmouseup',
    move: _mobile ? 'ontouchmove' : 'onmousemove',
    begin: _mobile ? 'ontouchstart' : 'onmousedown',
};
let _isEmpty = (
    can: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
): boolean => {
    const data = ctx.getImageData(0, 0, can.width, can.height).data;
    const len = data.length;
    for (var i = 0; i < len; i++) {
        if (data[i] !== 255 && data[i] !== 0) return false;
    }
    return true;
};
let getValueWithBoundary = (c: number, min: number, max: number): number => {
    return Math.min(Math.max(c, min), max)
}

let reader = new FileReader()
/**
 * @property view 最外层的盒子
 * @property img 待处理的图片
 * @property mk 作为裁剪视口的DIV 
 * @property dot 调整裁剪视口的蓝色按钮
 * @property mp mk的props集合
 * @property ip img的props集合
 * @property kp mk的宽高比
 * @property pmt view的宽高比
 * @property vw 最外层的盒子的宽度
 * @property vh 最外层盒子的高度
 * @export
 * @class Crop
 * @implements {Base}
 */
export default class Crop implements Base {
    view: HTMLElement;
    file: HTMLInputElement;
    mk: HTMLElement;
    img: HTMLImageElement;
    dot: HTMLElement;
    type: string;
    mp: Props;
    ip: Props;
    rsp: Props
    vw: number;
    vh: number;
    kp: number;
    pmt: number;
    cfg: Config = {
        size: 1024 * 1024 * 5, //1M
        maskWidth: '60%',
        maskHeight: '60%',
        minWidth: 40,
        minHeight: 40,
        outWidth: 0,
        outHeight: 0,
        keepPP: true,
        isEnd: true,
        quality: 100,
        error: () => { }
    };
    constructor(config: Config) {
        this.cfg = { ...this.cfg, ...config };
        this.view = this.$(config.view)!;
        this.file = this.$(config.file) as HTMLInputElement;
        this.vw = this.view.offsetWidth;
        this.vh = this.view.offsetHeight;
        this.init();
    }
    protected $(seletor: string, parent?: HTMLElement): HTMLElement {
        return (parent || document).querySelector(seletor);
    }
    protected $c(element: string): HTMLElement {
        return document.createElement(element)
    }
    private init() {
        if (this.cfg.circle) {
            this.cfg.keepPP = true;
        }
        this.render();
        this.bindFileEvt();
        this.mk[events.begin] = this.bindEvt.bind(this);
    }
    private render() {
        this.mk = this.$c('div');
        this.view.style.cssText = `font-size:0;position:relative;overflow:hidden`;
        this.img = this.$c(`img`) as HTMLImageElement;
        this.img.draggable = false;
        this.img.crossOrigin = ``
        this.mk.style.cssText = `visibility:hidden;touch-action:none;position: absolute;width:${
            this.cfg.maskWidth
            };height:${this.cfg.maskHeight};left:0;top:0;box-shadow:rgba(0,0,0,.7) 0 0 0 ${this.vw +
            50}px`;
        this.view.appendChild(this.img);
        this.view.appendChild(this.mk);
        this.mk.innerHTML += `<div style="box-sizing:border-box;border:1px dashed #39f;height:100%"></div><svg id="c_c" style="position: absolute;right:-10px;bottom: -10px;touch-action:none" width="30" height="30" xmlns="http://www.w3.org/2000/svg"><rect style="pointer-events:none" x="10" y = "10" width = "10" height = "10" fill = "#39f" /></svg></div>`
        this.dot = this.$('svg', this.mk);
    }
    private bindFileEvt() {
        if (this.file) {
            this.file.accept = `image/jpeg,image/png,image/webp,image/gif`;
            this.file.onchange = this.fileEvt.bind(this)
        }
    }
    private fileEvt() {
        const file: File = this.file.files[0]
        this.file.value = ``
        if (file.type.indexOf(`image`) === -1) {
            this.cfg.error(Ecode.inValidFile);
        } else if (file.size > this.cfg.size) {
            return this.cfg.error(Ecode.oversize);
        } else if (URL) {
            this.loadImage(URL.createObjectURL(file))
        } else {
            reader.readAsDataURL(file)
            reader.onload = (evt): void => {
                this.loadImage((evt.target as any).result)
            }
        }
    }
    public loadImage(url: string, file?: File) {
        this.img.src = url;
        this.img.onerror = this.cfg.error.call(null, Ecode.loadFailed)
        this.img.onload = () => this.loaded(file)
    }
    private loaded(file: File) {
        const nw = this.img.naturalWidth, nh = this.img.naturalHeight, w = this.mk.offsetWidth, h = this.mk.offsetHeight
        this.mk.style.visibility = ``;
        this.mp = { w, h }
        this.kp = w / h
        if (this.cfg.circle) {
            const min: number = Math.min(w, h);
            this.resizeDiv(min, min)
            this.mk.style.borderRadius = `50%`;
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
        this.img.style.transform = `translate3d(${this.ip.l}px,${
            this.ip.t
            }px,0)`;
        this.moveDiv((this.vw - w) / 2, (this.vh - h) / 2)
        this.rsp = { ...this.mp }
    }
    private bindEvt(e: Event): void {
        let x1: number, y1: number
        const { w, h, l, t } = this.mp
        let divFlag =
            (e.srcElement as HTMLElement).id !== 'c_c';
        document[events.move] = (e: Event): void => {
            e.preventDefault()
            const x2 = (e as MouseEvent).pageX || (e as TouchEvent).touches[0].pageX,
                y2 = (e as MouseEvent).pageY || (e as TouchEvent).touches[0].pageY,
                vw = this.vw, vh = this.vh
            if (!x1) x1 = x2, y1 = y2
            divFlag ?
                this.moveDiv(this.mp.l = getValueWithBoundary(l + x2 - x1, 0, vw - w),
                    this.mp.t = getValueWithBoundary(t + y2 - y1, 0, vh - h)) :
                this.resizeDiv(getValueWithBoundary(w + x2 - x1, this.cfg.minWidth, vw - l), getValueWithBoundary(h + y2 - y1, this.cfg.minHeight, vh - t));
            !this.cfg.isEnd && this.pc()
        }
        document[events.end] = () => {
            document[events.move] = document[events.end] = null;
            this.cfg.isEnd && this.pc()
        };
    }
    public pc() {
    }

    public loadpre() {
    }

    private resizeDiv(w: number, h: number) {
        if (this.cfg.keepPP) {
            if (this.kp > 1) h = w / this.kp
            else w = h * this.kp
        }
        this.mp.w = w
        this.mp.h = h
        this.mk.style.width = w + 'px';
        this.mk.style.height = h + 'px';
    }

    private moveDiv(left: number, top: number) {
        this.mp.l = left
        this.mp.t = top
        this.mk.style.transform = `translate3d(${left}px,${top}px,0px)`;
    }
    public cropped(): string | Promise<Blob> | void {
        const cfg = this.cfg
        let can: HTMLCanvasElement = this.$c('canvas') as HTMLCanvasElement;
        let ctx: CanvasRenderingContext2D = can.getContext('2d');
        let { w, h, l, t } = this.mp;
        const outSize = Math.max(cfg.outWidth, cfg.outHeight);
        const p = Math.min(outSize / w, outSize / h);
        can.width = outSize > 0 ? w * p : h / this.pmt;
        can.height = outSize > 0 ? h * p : h / this.pmt;
        let [cw, ch] = [can.width, can.height]
        if (cfg.ext.indexOf('jpg') !== -1) {
            ctx.fillStyle = `#fff`;
            ctx.fillRect(0, 0, cw, ch);
        }
        if (cfg.circle) {
            ctx.arc(cw / 2, ch / 2, cw / 2, 0, 2 * Math.PI);
            ctx.clip();
        }
        const l1 = l - this.ip.l,
            t1 = t - this.ip.t,
            l2 = l1 / this.pmt,
            t2 = t1 / this.pmt
        ctx.drawImage(this.img, Math.max(0, l2), Math.max(0, t2), w / this.pmt, h / this.pmt, -Math.min(l1, 0) * cw / w, -Math.min(t1, 0) * ch / w, cw, ch);
        if (_isEmpty(can, ctx)) {
            return cfg.error(Ecode.emptyImage);
        }
        return this.export(can, cfg);
    }
    export(can: HTMLCanvasElement, cfg: Config): string | Promise<Blob> {
        const e = `image/` + cfg.ext, q = cfg.quality / 100
        if (cfg.blob) return new Promise(resolve => {
            can.toBlob(blob => resolve(blob), e, q)
        })
        return can.toDataURL(e, q)
    }
    public reset() {
        const { w, h, l, t } = this.rsp
        this.moveDiv(l, t)
        this.resizeDiv(w, h)
    }
    public clear() {
        URL['revokeObjectURL'](this.img.src)
        this.img.removeEventListener('load', this.loadpre, false)
        this.file.onchange =
            this.mk[events.begin] =
            events =
            getValueWithBoundary =
            reader =
            HTMLImageElement.prototype.ready =
            this.img.onerror =
            null
    }
}
