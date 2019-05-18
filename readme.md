#mini-imageCrop ##轻量级的 HTML5 图片裁剪插件
1.mini-imagecrop 是一款利用 HTML5
canvas 为实现方式的在线裁剪图片软件。体积小巧，功能紧致。核心文件仅有 5.32kb。GZIP 压缩后味道更美
<br /> 2.支持 GIF,PNG,JPEG,WEBP 四种常用图片裁剪。具体因浏览器支持而异 <br /> 3.支持圆形裁剪 <br /> 4.支持任意宽高调整<br /> 5.支持固定尺寸导出和实际裁剪尺寸导出<br /> 6.丰富的自定义配置。<br /> 7.支持 IE10（含）以上浏览器 <br /> 8.支持 AMD,CMD,commonJS,ES6 导入<br />
<br />
<br />
用法： const crop = new Crop(options)<br>
const result=crop.cropped()<br>
if(result){
    ....
}
<br />
<br />
github 地址：https://github.com/gapkukb/imageCrop<br />
demo 地址:http://ic.gogogoup.com/<br /><br />
`注意:` dist 文件夹下的 core.js 不包含预览功能，如要要使用预览功能，请使用 preview.js
<br /><br />
propetys:`除view属性是必填外，其他都为选填`
<br><br>
| Left-aligned | Center-aligned | Right-aligned |
| :---         |     :---:      |          ---: |
| git status   | git status     | git status    |
| git diff     | git diff       | git diff      |
<br>


crop 实例方法：<br>
loadImage(url) 如果需要支持在线图片裁剪，则直接调用该方法即可，需要注意的是可能会有跨域问题，请自行斟酌<br>
cropped() 导出图片裁剪结果,`当options.blob为true时，导出为promise,否则导出base64`<br>
reset() 重置选取框到初始状态<br>
clear() 内存回收<br>
