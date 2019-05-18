!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?module.exports=i():"function"==typeof define&&define.amd?define(i):(t=t||self).Crop=i()}(this,function(){"use strict";var n=function(){return(n=Object.assign||function(t){for(var i,e=1,h=arguments.length;e<h;e++)for(var s in i=arguments[e])Object.prototype.hasOwnProperty.call(i,s)&&(t[s]=i[s]);return t}).apply(this,arguments)},e=window.URL||window.webkitURL,t="ontouchend"in document,h={end:t?"ontouchend":"onmouseup",move:t?"ontouchmove":"onmousemove",begin:t?"ontouchstart":"onmousedown"},g=function(t,i,e){return Math.min(Math.max(t,i),e)},s=new FileReader;function i(t){this.cfg={size:5242880,maskWidth:"60%",maskHeight:"60%",minWidth:100,minHeight:100,outWidth:0,outHeight:0,keepPP:!0,isEnd:!0,quality:100,type:"png",error:function(){}},this.cfg=n({},this.cfg,t),this.view="string"==typeof t.view?this.$(t.view):t.view,this.file="string"==typeof t.file?this.$(t.file):t.file,this.vw=this.view.offsetWidth,this.vh=this.view.offsetHeight,this.init()}return i.prototype.$=function(t,i){return(i||document).querySelector(t)},i.prototype.$c=function(t){return document.createElement(t)},i.prototype.init=function(){this.cfg.circle&&(this.cfg.keepPP=!0),this.render(),this.bindFileEvt(),this.mk[h.begin]=this.bindEvt.bind(this)},i.prototype.render=function(){this.mk=this.$c("div"),this.view.style.cssText="font-size:0;position:relative;overflow:hidden",this.img=this.$c("img"),this.img.draggable=!1,this.img.crossOrigin="",this.mk.style.cssText="visibility:hidden;touch-action:none;position: absolute;width:"+this.cfg.maskWidth+";height:"+this.cfg.maskHeight+";left:0;top:0;box-shadow:rgba(0,0,0,.7) 0 0 0 "+(this.vw+50)+"px",this.view.appendChild(this.img),this.view.appendChild(this.mk),this.mk.innerHTML+='<div style="box-sizing:border-box;border:1px dashed #39f;height:100%"></div><svg id="c_c" style="position: absolute;right:-10px;bottom: -10px;touch-action:none" width="30" height="30" xmlns="http://www.w3.org/2000/svg"><rect style="pointer-events:none" x="10" y = "10" width = "10" height = "10" fill = "#39f" /></svg></div>',this.dot=this.$("svg",this.mk)},i.prototype.bindFileEvt=function(){this.file&&(this.file.accept="image/jpeg,image/png,image/webp,image/gif",this.file.onchange=this.fileEvt.bind(this))},i.prototype.fileEvt=function(){var i=this,t=this.file.files[0];if(this.file.value="",-1===t.type.indexOf("image"))this.cfg.error(0);else{if(t.size>this.cfg.size)return this.cfg.error(1);e?this.loadImage(e.createObjectURL(t)):(s.readAsDataURL(t),s.onload=function(t){i.loadImage(t.target.result)})}},i.prototype.loadImage=function(t,i){var e=this;this.img.src=t,this.img.onerror=function(){return e.cfg.error(2)},this.img.onload=function(){return e.loaded(i)}},i.prototype.loaded=function(t){var i=this.img.naturalWidth,e=this.img.naturalHeight,h=this.mk.offsetWidth,s=this.mk.offsetHeight;if(this.mk.style.visibility="",this.mp={w:h,h:s},this.kp=h/s,this.cfg.circle){var o=Math.min(h,s);this.resizeDiv(o,o),this.mk.style.borderRadius="50%"}this.pmt=Math.min(this.vw/i,this.vh/e),this.img.width=i*this.pmt,this.img.height=e*this.pmt,this.ip={l:(this.vw-this.img.width)/2,t:(this.vh-this.img.height)/2,w:i,h:e},this.img.style.transform="translate3d("+this.ip.l+"px,"+this.ip.t+"px,0)",this.moveDiv((this.vw-h)/2,(this.vh-s)/2),this.rsp=n({},this.mp)},i.prototype.bindEvt=function(t){var o,n,r=this,i=this.mp,p=i.w,a=i.h,c=i.l,m=i.t,f="c_c"!==t.srcElement.id;document[h.move]=function(t){t.preventDefault();var i=t.pageX||t.touches[0].pageX,e=t.pageY||t.touches[0].pageY,h=r.vw,s=r.vh;o||(o=i,n=e),f?r.moveDiv(r.mp.l=g(c+i-o,0,h-p),r.mp.t=g(m+e-n,0,s-a)):r.resizeDiv(g(p+i-o,r.cfg.minWidth,h-c),g(a+e-n,r.cfg.minHeight,s-m)),r.cfg.isEnd||r.pc()},document[h.end]=function(){document[h.move]=document[h.end]=null,r.cfg.isEnd&&r.pc()}},i.prototype.pc=function(){},i.prototype.loadpre=function(){},i.prototype.resizeDiv=function(t,i){this.cfg.keepPP&&(1<this.kp?i=t/this.kp:t=i*this.kp),this.mp.w=t,this.mp.h=i,this.mk.style.width=t+"px",this.mk.style.height=i+"px"},i.prototype.moveDiv=function(t,i){this.mp.l=t,this.mp.t=i,this.mk.style.transform="translate3d("+t+"px,"+i+"px,0px)"},i.prototype.cropped=function(){if(!this.img.src)return this.cfg.error(3);var t=this.cfg,i=this.$c("canvas"),e=i.getContext("2d"),h=this.mp,s=h.w,o=h.h,n=h.l,r=h.t,p=Math.max(t.outWidth,t.outHeight),a=Math.min(p/s,p/o);i.width=0<p?s*a:o/this.pmt,i.height=0<p?o*a:o/this.pmt;var c=[i.width,i.height],m=c[0],f=c[1];-1!==t.type.indexOf("jpeg")&&(e.fillStyle="#fff",e.fillRect(0,0,m,f)),t.circle&&(e.arc(m/2,f/2,m/2,0,2*Math.PI),e.clip());var g=n-this.ip.l,d=r-this.ip.t,l=g/this.pmt,u=d/this.pmt;return e.drawImage(this.img,Math.max(0,l),Math.max(0,u),s/this.pmt,o/this.pmt,-Math.min(g,0)*m/s,-Math.min(d,0)*f/s,m,f),function(t,i){for(var e=i.getImageData(0,0,t.width,t.height).data,h=e.length,s=0;s<h;s++)if(255!==e[s]&&0!==e[s])return!1;return!0}(i,e)?t.error(3):this.export(i,t)},i.prototype.export=function(t,i){var e="image/"+i.type,h=i.quality/100;return i.blob?new Promise(function(i){t.toBlob(function(t){return i(t)},e,h)}):t.toDataURL(e,h)},i.prototype.reset=function(){var t=this.rsp,i=t.w,e=t.h,h=t.l,s=t.t;this.moveDiv(h,s),this.resizeDiv(i,e)},i.prototype.clear=function(){e.revokeObjectURL(this.img.src),this.img.removeEventListener("load",this.loadpre,!1),this.file.onchange=this.mk[h.begin]=h=g=s=HTMLImageElement.prototype.ready=this.img.onerror=null},i});
