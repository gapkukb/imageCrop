#mini-imageCrop
##轻量级的HTML5图片裁剪插件
1.mini-imagecrop 是一款利用HTML5
canvas为实现方式的在线裁剪图片软件。体积小巧，功能紧致。核心文件仅有5.18kb。GZIP压缩后不足1KB
<br />
2.支持GIF,PNG,JPEG,WEBP四种常用图片裁剪。具体因浏览器支持而异 <br />
3.支持圆形裁剪 <br />
4.支持任意宽高调整<br />
5.支持固定尺寸导出和实际裁剪尺寸导出<br />
6.丰富的自定义配置。<br />
7.支持IE10（含）以上浏览器 <br />
8.支持AMD,CMD,commonJS,ES6导入<br />
<br />
github地址：https://github.com/gapkukb/imageCrop
demo地址:ip.gogogoup.com
<br />
用法： const crop = new Crop(options) . `除view属性是必填外，其他都为选填`
<br />
`注意:` dist文件夹下的core.js 不包含预览功能，如要要使用预览功能，请使用preview.js
<br />

| options propety/参数  | explain/说明 |type/类型  | defualt value/默认值 |
| ------------- | ------------- | ------------- | ------------- |
| view  |指定图片显示的包裹元素的选择器，可以是类名或者ID或者元素对象.需自行设置素宽高 | string &#124; HTMLElement  | none  |
| preview  |指定图片`预览`显示的包裹元素的选择器，可以是类名或者ID或者元素对象，需自行设置元素宽度，`高度`会与view元素按比例自动计算 | string &#124; HTMLElement  | none  |
| file  |指定input file元素，可以是类名或者ID或者元素对象 | string &#124; HTMLInputElement  | none  |
| error  |错误回调函数，返回参数errCode,错误代号如下: 0 - 非图片文件类型， 1 - 文件过大 , 2 - 图片加载失败 ，3 -所选区域是空的(裁剪范围内不能全黑或全白)|function | none  |
| size  |指定选择图片的最大字节，单位KB|number | 1024*1024*5 == 5M  |
| maskWidth  |指定选取框的初始宽度，可以是px,%,vw,vh,vmax,vmin,pt任意合法的CSS单位|string | 60%  |
| maskHeight  |指定选取框的初始高度，可以是px,%,vw,vh,vmax,vmin,pt任意合法的CSS单位|string | 60%  |
| minWidth  |指定选取框可调整的最小宽度，传入数字即可，会自行添加px单位|number | 100  |
| minHeight  |指定选取框可调整的最小高度，传入数字即可，会自行添加px单位|number | 100  |
| outWidth  |导出图片的宽度，0表示不作限制，根据裁剪区域的图片`真实宽度`输出|number | 0  |
| outHeight  |导出图片的高度，0表示不作限制，根据裁剪区域的图片`真实高度`输出|boolean | true  |
| keepPP  |是否保持宽高比例调整|number | 0  |
| blob  |是否导出为blob对象,默认导出base64,blob对象性能优于base64,但IE浏览器不支持Blob对象，请根据实际情况选择|boolean | false |
| circle  |是否使用圆形裁剪，使用圆形裁剪，会在maskWidth,maskHeight中取小的作为园直径|boolean | false |
| isEnd  |实时预览触发时机,true表示在touchend和mouseup触发，false表示在touchmove和mousemove触发|boolean | false |
| quality  |导出图片质量 ，范围 0 -100|number | 100 |
| type  |导出图片格式 ，jpeg &#124; png| string | png |


crop实例方法：<br>
loadImage(url) 如果需要支持在线图片裁剪，则直接调用该方法即可，需要注意的是可能会有跨域问题，请自行斟酌<br>
cropped() 导出图片裁剪结果<br>
reset() 重置选取框到初始状态<br>
clear() 内存回收<br>