;(function (name, definition) {
    var hasDefine = typeof define === 'function',
      hasExports = typeof module !== 'undefined' && module.exports
    if (hasDefine) {
        define(definition)
    } else if (hasExports) {
        module.exports = definition()
    } else {
        this[name] = definition()
    }
})('ImageCrop', function () {
    let _isMobile = window.navigator.userAgent.includes("Mobile")
    let _events = {
        begin: _isMobile ? "ontouchstart" : "onmousedown",
        move: _isMobile ? "ontouchmove" : "onmousemove",
        end: _isMobile ? "ontouchend" : "onmouseup",
    }
    let _$ = string => document.querySelector(string)
    let base64FileSize = base64 => {
        const tag = "base64,"
        base64 = base64.substring(base64.indexOf(tag) + tag.length)
        const eq = base64.indexOf("=")
        eq !== -1 && (base64 = base64.substring(0, eq))
        const l = base64.length
        return Math.ceil(l - (l / 8) * 2)
    }

    class ImageCrop {
        constructor(cfg = {}) {
            this.el = _$(cfg.el)
            this.inputFile = _$(cfg.inputFile)
            if (!this.el || !this.inputFile) {
                throw Error("the el element or fileInput element not define")
            }

            this.preview = _$(cfg.preview) || document.createElement("input")
            this.preview.type = "hidden"

            this.isCircle = cfg.circle || false
            this.alert = cfg.alert

            let {width, height} = getComputedStyle(this.el, false)
            this.width = parseInt(width)
            this.height = parseInt(height)

            this.entry = Object.assign({
                fileTypes: ["jpeg", "png", "gif", "bmp", "svg", "webp"],
                size: 5000 * 1024 * 1024, //b*1000 -> KB
                width: "60%", //px vw vh % number
                height: "60%", //px vh % vw number
                minWidth: 60,//px
                minHeight: 60,//px
                keepRatio: true, //true ,false
            }, cfg.entry)
            this.entry.fileTypes = this.entry.fileTypes.map(v => "image/" + (v === "svg" ? "svg+xml" : v))
            this.inputFile.accept = this.entry.fileTypes.join(",")

            this.output = Object.assign({
                fileType: "jpeg",
                imagePrefix: "unkown",
                width: 0,
                blob: true,
                quality: 1,
            }, cfg.output)
            this.keep = this.entry.keepRatio
            this._circle = this.circle
            this.tools = null
            this.image = null
            this.copy = null
            this.circle = null
            this.svg = null
            this.cf = parseInt(getComputedStyle(this.preview, false).width) / this.width
            this.ratio = 0
            this.props = {x: 0, y: 0, w: 0, h: 0, ix: 0, iy: 0}
            this.ok = false
            this.bindFileChange()
        }

        getCroped() {
            const scale1 = this.image.naturalWidth / this.width
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")
            const {x, y, w, h, ix, iy} = this.props
            const out = this.output
            canvas.width = out.width || (w * scale1)
            canvas.height = (h / w * out.width) || (h * scale1)
            ctx.fillStyle = "#fff"
            if (out.fileType === "jpeg") {
                ctx.fillRect(0, 0, canvas.width, canvas.height)
            }
            if (this.isCircle) {
                ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2, 0, Math.PI * 2)
                ctx.clip()
            }
            ctx.drawImage(this.image, (x - ix) * scale1, (y - iy) * scale1, w * scale1, h * scale1, 0, 0, canvas.width, canvas.height)
            return new Promise(rs => {
                const fileType = "image/" + out.fileType
                const name = out.imagePrefix + "." + fileType.replace("image/", "")
                if (out.blob) {
                    canvas.toBlob(blob => rs(Object.assign(blob, {
                        url: URL.createObjectURL(blob),
                        name: name
                    })), fileType, out.quality)
                } else {
                    let data = canvas.toDataURL(fileType, out.quality)
                    rs({
                        size: base64FileSize(data),
                        url: data,
                        name: name,
                        type: fileType
                    })
                    data = null
                }
            }).catch(e => console.error(e))
        }

        bindFileChange() {
            this._createElements()
            this.inputFile.onchange = e => {
                this.ok = false
                const file = this.inputFile.files[0]
                this.inputFile.value = ""
                if (file.size > this.entry.size) {
                    return (this.alert || window.alert)("文件不得大于" + Math.ceil(this.entry.size / 1000) + "KB")
                } else if (!this.entry.fileTypes.includes(file.type)) {
                    return (this.alert || window.alert)("不支持的文件格式")
                }
                this.update(window.URL.createObjectURL(file))
            }
        }

        adjustDms(e) {
            e = e || window.event
            e.stopPropagation()
            e.preventDefault()
            const x1 = e.pageX || e.touches[0].pageX
            const y1 = e.pageY || e.touches[0].pageY
            const isMove = e.target.nodeName.toLowerCase() !== "svg"
            let {x, y, w, h} = this.props
            document[_events.move] = e => {
                e = e || window.event
                e.preventDefault()
                let x2 = (e.pageX || e.touches[0].pageX) - x1
                let y2 = (e.pageY || e.touches[0].pageY) - y1
                if (isMove) {
                    x = this.props.x + x2
                    y = this.props.y + y2
                } else {
                    if (this.entry.keepRatio) {
                        const d = Math.max(x2, y2)
                        let tw = this.props.w + d * (x2 > y2 ? 1 : this.ratio)
                        let th = this.props.h + d / (x2 > y2 ? this.ratio : 1)
                        if (tw > this.width || th > this.height || tw < this.entry.minWidth || th < this.entry.minHeight) {
                            return
                        }
                        w = tw
                        h = th
                    } else {
                        w = this.props.w + x2
                        h = this.props.h + y2
                        w = w > this.width ? this.width : w < this.entry.minWidth ? this.entry.minWidth : w
                        h = h > this.height ? this.height : h < this.entry.minHeight ? this.entry.minHeight : h
                    }
                    this.tools.style.width = w + "px"
                    this.tools.style.height = h + "px"
                    x = this.props.x - (w - this.props.w) / 2
                    y = this.props.y - (h - this.props.h) / 2
                }
                x = x < 0 ? 0 : x > this.width - w ? this.width - w : x
                y = y < 0 ? 0 : y > this.height - h ? this.height - h : y
                this.tools.style.transform = `translate3d(${x}px,${y}px,0px)`
            }
            document[_events.end] = () => {
                document[_events.move] = document[_events.end] = null
                this.props.w = w
                this.props.h = h
                this.props.x = x
                this.props.y = y
                this.previewCb()
            }
        }

        previewCb() {
            let {x, y, w, h, ix, iy} = this.props
            const cw = this.preview.offsetWidth / w, ch = this.preview.offsetHeight / h
            this.copy.width = this.image.width * cw
            this.copy.height = this.image.height * ch
            this.copy.style.transform = `translate3d(${(ix - x) * cw}px,${(iy - y) * ch}px,0px)`
        }

        cropByCircle(flag) {
            this.entry.keepRatio = flag || this.keep
            this.isCircle = flag
            this.preview.style.borderRadius = flag ? `50%` : ""
            this._init()
        }

        _init() {
            const image = this.image
            const copy = this.copy
            this.tools.style.width = this.entry.width
            this.tools.style.height = this.entry.height

            const d = this.isCircle ? Math.min(this.tools.offsetWidth, this.tools.offsetHeight) : 0
            this.props.w = d || this.tools.offsetWidth
            this.props.h = d || this.tools.offsetHeight
            this.tools.style.width = this.props.w + "px"
            this.tools.style.height = this.props.h + "px"

            this.props.x = (this.width - this.props.w) / 2
            this.props.y = (this.height - this.props.h) / 2
            this.ratio = this.props.w / this.props.h
            this.entry.minHeight = this.entry.minWidth / this.ratio

            this.tools.style.transform = `translate3d(${this.props.x}px,${this.props.y}px,0px)`
            this.circle.style.display = this.isCircle ? "block" : "none"

            if (image.width >= image.height) {
                image.width = this.width
                copy.width = this.preview.offsetWidth
                image.removeAttribute("height")
                copy.removeAttribute("height")
            } else {
                image.height = this.height
                copy.height = this.preview.offsetHeight
                image.removeAttribute("width")
                copy.removeAttribute("width")
            }
            this.props.ix = (this.width - image.width) / 2
            this.props.iy = (this.height - image.height) / 2
            image.style.transform = `translate3d(${this.props.ix}px,${this.props.iy}px,0px)`
            this.previewCb()

            this.svg[_events.begin] = this.tools[_events.begin] = this.adjustDms.bind(this)
        }

        reset() {
            this.isCircle = this._circle
            this._init()
        }

        destroy() {
            this.svg[_events.begin] = this.tools[_events.begin] = this.inputFile.onchange = _isMobile = _events = _$ = base64FileSize = null
        }

        update(src) {
            this.image.src = src
            this.copy.src = src
            this.image.onload = e => {
                window.URL.revokeObjectURL(src)
                this.ok = true
                this._init()
            }
        }

        _createElements() {
            const div = this.tools = document.createElement("div")
            const svg = this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
            const image = this.image = new Image()
            const circle = this.circle = document.createElement("p")
            const bs = `box-shadow:rgba(0,0,0,.6) 0 0 0 ${Math.max(this.width, this.height)}px`
            this.el.style.cssText = `overflow: hidden;position: relative;background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC");`
            div.title = "移动选取框"
            div.style.cssText = `position: absolute;cursor: move;z-index: 2;left: 0;top: 0;${bs}`
            circle.style.cssText = `position: absolute;left: 0;top: 0;bottom: 0;right: 0;border-radius: 50%;margin: 0; z-index: -1;${bs}`

            svg.setAttribute("viewBox", "0 0 1025 1024")
            svg.setAttribute("width", "30")
            svg.setAttribute("height", "30")
            svg.setAttribute("fill", "#fff")
            svg.innerHTML = '<title>调整大小</title><path d="M324.8 444.8 442.752 325.632 252.032 131.968 381.12 1.152 3.328 1.152 3.328 384.256 134.272 251.392 324.8 444.8Z"></path><path d="M1024.222643 634.624 885.248 768.832 691.136 573.44 570.752 693.824 765.248 889.408 637.504 1022.808589 1024.222643 1022.808589 1024.222643 634.624Z"></path>'
            this.svg.setAttribute("style", `background-color: rgba(0, 0, 0, .5);position: absolute;z-index: 3;right: 0;bottom: 0;cursor: nwse-resize;padding: 2px;border:1px solid #666;`)
            this.preview.style.height = parseInt(getComputedStyle(this.preview, false).width) * this.height / this.width + "px"
            this.preview.style.overflow = "hidden"
            // this.preview.style.overflow = "hidden"
            const copy = this.copy = image.cloneNode(true)
            this.preview.appendChild(copy)
            div.appendChild(svg)
            div.appendChild(circle)
            this.el.appendChild(image)
            this.el.appendChild(div)
        }

        download() {
            this.getCroped().then(rs => {
                let aLink = document.createElement('a')
                aLink.download = rs.name
                aLink.href = rs.url
                aLink.click()
                aLink = null
            })
        }

        static blobToBase64(blob) {
            const a = new FileReader()
            return a.readAsDataURL(blob)
        };

        static base64ToBlob(data) {
            const arr = data.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]),
              u8arr = new Uint8Array(n)
            let n = bstr.length
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
            }
            return new Blob([u8arr], {type: mime})
        };
    }

    return ImageCrop
})