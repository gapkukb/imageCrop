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
    var ImageCrop = function ImageCrop(option) {
        if (!option || !option.el || !option.file)
            throw new Error("必传el&&file参数");
        this.el = option.el;
        this.file = option.file;
        this.f = option.alert;
        this.width = option.width || 300;
        this.height = option.height || 300;
        this.maxSize = option.maxSize * 1000 || 4096 * 1000;
        this.scaleStep = option.scaleStep || 0.1;
        this.rotateStep = option.rotateStep || 15;
        this.fileNames = option.fileNames || ["image/gif", "image/png", "image/jpeg", "image/jpg", "image/svg"];
        this.output = option.output || {};
        this.quality = this.output.quality || 1;
        this.file.accept = this.fileNames.join(",");
        this.according = {
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0
        };
        this.image = null;
        this.canvas = null;
        this.ok = false;
        this.darkWhite = false;
        this.init();
    };
    ImageCrop.prototype = {
        constructor: "ImageCrop",
        alert: function(msg) {
            (this.f || window.alert)(msg);
        },
        events: window.navigator.userAgent.includes("Mobile") ? {
            s: "ontouchstart",
            m: "ontouchmove",
            ed: "ontouchend"
        } : {
            s: "onmousedown",
            m: "onmousemove",
            ed: "onmouseup"
        },
        init: function() {
            var $__1 = this;
            this.el.style.cssText = ("width:" + this.width + ";height:" + this.height + ";overflow:hidden;box-shadow:#ccc 0 0 2px 2px");
            this.file.onchange = function(e) {
                $__1.ok = false;
                var file = $__1.file.files[0];
                $__1.file.value = "";
                if (file.size > $__1.maxSize)
                    return $__1.alert("文件不得大于" + ($__1.maxSize) + "");
                if (!$__1.fileNames.includes(file.type))
                    return $__1.alert("不支持的文件格式");
                if (!$__1.image) {
                    $__1.image = new Image();
                    $__1.image.draggable = false;
                    $__1.image.style.transformOrigin = "left top";
                    $__1.el.appendChild($__1.image);
                    $__1.bindEvt();
                } else {
                    $__1.reset();
                }
                var url = window.URL.createObjectURL(file);
                $__1.image.src = url;
                $__1.image.onload = function(e) {
                    window.URL.revokeObjectURL(url);
                    $__1.ok = true;
                    $__1.image.removeAttribute("width");
                    $__1.image.removeAttribute("height");
                    $__1.image.width < $__1.image.height ? $__1.image.height = $__1.el.offsetHeight : $__1.image.width = $__1.el.offsetWidth;
                };
            };
        },
        bindEvt: function() {
            var $__1 = this;
            var ac = this.according;
            this.el[this.events.s] = function(e) {
                e.preventDefault();
                var x1 = e.pageX || e.touches[0].pageX;
                var y1 = e.pageY || e.touches[0].pageY;
                document[$__1.events.m] = function(e) {
                    e.preventDefault();
                    var x2 = e.pageX || e.touches[0].pageX;
                    var y2 = e.pageY || e.touches[0].pageY;
                    ac.x += x2 - x1;
                    ac.y += y2 - y1;
                    x1 = x2;
                    y1 = y2;
                    $__1.setCss();
                };
                document[$__1.events.ed] = function(e) {
                    document[$__1.events.m] = document[$__1.events.ed] = null;
                };
            };
        },
        reset: function() {
            this.according.x = this.according.y = this.according.rotate = 0;
            this.according.scale = 1;
            this.image.style.filter = "";
            this.darkWhite = false;
            this.setCss();
        },
        setCss: function() {
            var ac = this.according;
            this.image.style.transform = ("translate3d(" + ac.x + "px," + ac.y + "px,0px) scale(" + ac.scale + ") rotate(" + ac.rotate + "deg)");
        },
        scale: function(flag) {
            if (!this.ok)
                return;
            this.according.scale += flag ? this.scaleStep : -this.scaleStep;
            this.setCss();
        },
        rotate: function(flag) {
            if (!this.ok)
                return;
            this.according.rotate = (this.according.rotate + (flag ? this.rotateStep : -this.rotateStep)) % 360;
            this.setCss();
        },
        gray: function() {
            this.darkWhite = true;
            this.image.style.filter = "grayscale(100%)";
        },
        clip: function() {
            var $__1 = this;
            if (!this.ok)
                return;
            var canvas = document.createElement("canvas");
            var canvas2 = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            var ctx2 = canvas2.getContext("2d");
            canvas.width = this.el.offsetWidth;
            canvas.height = this.el.offsetHeight;
            var size = this.output.size || {};
            canvas2.width = size.width || canvas.width;
            canvas2.height = size.height || canvas.height;
            var deg = Math.PI * this.according.rotate / 180;
            ctx.translate(this.according.x, this.according.y);
            ctx.rotate(deg, deg);
            ctx.scale(this.according.scale, this.according.scale);
            if (this.output.imageType === "image/jpeg") {
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, this.width, this.height);
            }
            ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height);
            ctx2.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas2.width, canvas2.height);
            if (this.darkWhite) {
                ImageCrop.darkAndWhite(canvas2, ctx2);
            }
            return new Promise(function(resolve) {
                var name = (($__1.output.imagePrefix || "unkown") + "." + $__1.output.imageType.replace("image/", ""));
                if ($__1.output.base64) {
                    var data = canvas2.toDataURL($__1.output.imageType, $__1.quality);
                    resolve({
                        size: ImageCrop.base64FileSize(data),
                        preview: data,
                        name: name,
                        type: $__1.output.imageType
                    });
                    data = null;
                } else {
                    canvas2.toBlob(function(blob) {
                        resolve(Object.assign(blob, {
                            preview: URL.createObjectURL(blob),
                            name: name
                        }));
                    }, $__1.output.imageType, $__1.quality);
                }
            });
        },
        download: function() {
            this.clip().then(function(rs) {
                return ImageCrop.downloadFile(rs.name, rs.preview);
            });
        },
        destroy: function() {
            this.file.onchange = this.el[this.events.s] = null;
            this.el.innerHTML = "";
            this.image = null;
        }
    };
    ImageCrop.darkAndWhite = function(canv, ctx) {
        var img_data = ctx.getImageData(0, 0, canv.width, canv.height);
        for (var i = 0; i < img_data.data.length; i += 4) {
            var myRed = img_data.data[i],
                myGreen = img_data.data[i + 1],
                myBlue = img_data.data[i + 2];
            myGray = parseInt((myRed + myGreen + myBlue) / 3);
            img_data.data[i] = myGray;
            img_data.data[i + 1] = myGray;
            img_data.data[i + 2] = myGray;
        }
        ctx.putImageData(img_data, 0, 0);
    };
    ImageCrop.base64ToBlob = function(dataurl) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type: mime});
    };
    ImageCrop.blobToDataURL = function(blob) {
        var a = new FileReader();
        return a.readAsDataURL(blob);
    };
    ImageCrop.downloadFile = function(fileName, url) {
        var aLink = document.createElement('a');
        aLink.download = fileName;
        aLink.href = url;
        aLink.click();
        aLink = null;
    };
    ImageCrop.base64FileSize = function(base64) {
        var tag = "base64,";
        base64 = base64.substring(base64.indexOf(tag) + tag.length);
        var eq = base64.indexOf("=");
        eq !== -1 && (base64 = base64.substring(0, eq));
        var l = base64.length;
        return Math.ceil(l - (l / 8) * 2);
    };
    return ImageCrop
})