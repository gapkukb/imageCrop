import Core from './core'
export default class Crop extends Core {
    pi: HTMLImageElement;
    pp: Props;
    pv: HTMLElement
    in: HTMLElement
    constructor(cfg: Config) {
        super(cfg)
        this.pv = typeof cfg.preview === 'string' ? this.$(cfg.preview) : cfg.preview
        this.rp()
    }
    private rp() {
        this.in = this.$c(`div`)
        this.in.style.cssText = `box-shadow:0 0 0 100px #000;font-size:0;overflow:hidden;${this.cfg.circle ? 'border-radius:50%' : ''}`;
        this.pv.appendChild(this.in)
        const w = this.pv.offsetWidth
        this.pp = { w, h: w / this.vw * this.vh }
        this.pv.style.cssText = `position:relative;overflow:hidden;height:${this.pp.h}px`
        this.img.addEventListener('load', this.loadpre.bind(this))
    }
    loadpre() {
        setTimeout(() => {
            this.pi = this.img.cloneNode() as HTMLImageElement
            this.pi.style.transformOrigin = `left top`
            this.in.appendChild(this.pi)
            this.pc()
        })
    }
    public pc() {
        const p = 1 / Math.max(this.mp.w / this.pp.w, this.mp.h / this.pp.h)
        this.pi.style.transform = `translate3d(${this.ip.l - this.mp.l}px,${this.ip.t - this.mp.t}px,0)`
        this.in.style.width = this.mp.w + `px`
        this.in.style.height = this.mp.h + `px`
        this.in.style.transform = `scale(${p}) translate3d(${(this.pp.w - this.mp.w) / 2 / p}px,${(this.pp.h - this.mp.h) / 2 / p}px,0)`
    }
}