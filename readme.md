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
propetys:`除view属性是必填外，其他都为选填`<br>
| options propety/参数 | explain/说明 | type/类型 | defualt value/默认值 |
|:--------------------|:------------:|:---------:|:-------------------:|
| view | 指定图片显示的包裹元素的选择器，可以是类名或者 ID 或者元素对象.需自行设置素宽高 | string &#124; HTMLElement | none |
| preview | 指定图片`预览`显示的包裹元素的选择器，可以是类名或者 ID 或者元素对象，需自行设置元素宽度，`高度`会与 view 元素按比例自动计算 | string &#124; HTMLElement | none |
| file | 指定 input file 元素，可以是类名或者 ID 或者元素对象 | string &#124; HTMLInputElement | none |
| error | 错误回调函数，返回参数 errCode,错误代号如下: 0 - 非图片文件类型， 1 - 文件过大 , 2 - 图片加载失败 ，3 -所选区域是空的(裁剪范围内不能全黑或全白) | function | none |
| size | 指定选择图片的最大字节，单位 KB | number | 1024*1024*5 == 5M |
| maskWidth | 指定选取框的初始宽度，可以是 px,%,vw,vh,vmax,vmin,pt 任意合法的 CSS 单位 | string | 60% |
| maskHeight | 指定选取框的初始高度，可以是 px,%,vw,vh,vmax,vmin,pt 任意合法的 CSS 单位 | string | 60% |
| minWidth | 指定选取框可调整的最小宽度，传入数字即可，会自行添加 px 单位 | number | 100 |
| minHeight | 指定选取框可调整的最小高度，传入数字即可，会自行添加 px 单位 | number | 100 |
| outmax | 导出图片的最大边长，对于横图它是宽度，对于竖图它是高度，默认根据裁剪区域的图片`真实尺度`输出 | number | 0 |
| keepPP | 是否保持宽高比例调整 | number | 0 |
| blob | 是否导出为 blob 对象,默认导出 base64,blob 对象性能优于 base64,但 IE 浏览器不支持 Blob 对象，请根据实际情况选择 | boolean | false |
| circle | 是否使用圆形裁剪，使用圆形裁剪，会在 maskWidth,maskHeight 中取小的作为园直径 | boolean | false |
| isEnd | 实时预览触发时机,true 表示在 touchend 和 mouseup 触发，false 表示在 touchmove 和 mousemove 触发 | boolean | false |
| quality | 导出图片质量 ，范围 0 -100 , 仅在 type == jpeg 时有效 | number | 100 |
| type | 导出图片格式 ，jpeg &#124; png | string | png |

crop 实例方法：<br>
loadImage(url) 如果需要支持在线图片裁剪，则直接调用该方法即可，需要注意的是可能会有跨域问题，请自行斟酌<br>
cropped() 导出图片裁剪结果,`当options.blob为true时，导出为promise,否则导出base64`<br>
reset() 重置选取框到初始状态<br>
clear() 内存回收<br>
