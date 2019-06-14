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
        this.in.style.cssText = `visibility:hidden;font-size:0;overflow:hidden;${this.cfg.circle ? 'border-radius:50%' : ''}`;
        this.pv.appendChild(this.in)
        const w = this.pv.offsetWidth
        this.pp = { w, h: w / this.vw * this.vh }
        this.pv.style.cssText = `position:relative;overflow:hidden;height:${this.pp.h}px`
        this.img.addEventListener('load', this.loadpre.bind(this))
    }
    loadpre() {
        setTimeout(() => {
            var pi = this.img.cloneNode() as HTMLImageElement
            pi.style.transformOrigin = `left top`
            if(this.pi){
                this.in.replaceChild(pi,this.pi)
            }else{
                this.in.appendChild(pi)
            }
            this.pi = pi
            this.pc()
            this.in.style.visibility = ``;
        })
    }
    public pc() {
        const p = 1 / Math.max(this.mp.w / this.pp.w, this.mp.h / this.pp.h)
        this.pi.style.transform = `translate3d(${this.ip.l - this.mp.l}px,${this.ip.t - this.mp.t}px,0)`
        this.in.style.width = this.mp.w + `px`
        this.in.style.height = this.mp.h + `px`
        this.in.style.transform = `scale(${p}) translate3d(${(this.pp.w - this.mp.w) / 2 / p}px,${(this.pp.h - this.mp.h) / 2 / p}px,0)`
    }
    public resetAll() {
        this.reset()
        this.mk.style.visibility = this.img.style.visibility = this.in.style.visibility=`hidden`;
    }
}