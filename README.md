# imageCrop<h1>demo</h1>

<p>-----html-------</p>
input type="file" id="file" <br>
div class="content" id="container" <br>
button onclick="instance.reset()" 重置 <br>
button onclick="instance.scale(0)"缩/button <br>
button onclick="instance.scale(1)"放大/button <br>
button onclick="instance.rotate(0)"左旋/button <br>
button onclick="instance.rotate(1)"右旋/button <br>
button onclick="instance.gray()"黑白/button <br>
button onclick="instance.clip()"裁剪/button <br>
button onclick="instance.download()"下载/button <br>
buttonon onclick="instance.destroy()"销毁/button <br>


<p>-----js-------</p>
<script src="imageCrop.min.js"></script>
<script>

    const instance = new ImageCrop({
        file: document.getElementById("file"),
        el: document.getElementById("container"),
        width: "50vw",
        height: "50vw",
        output: {
            quality: 1,
            imageType: "image/jpeg",
            base64: true
        }
    })
</script>
***

<p>api</p>
<table>
    <tr>
        <td>字段/feild</td>
        <td>类型/type</td>
        <td>默认值/default</td>
        <td>描述/description</td>
    </tr>
    <tr>
        <td>el(必传/required)</td>
        <td>element/dom</td>
        <td>none</td>
        <td>图片包裹层/image wrap</td>
    </tr>
    <tr>
        <td>file(必传/required)</td>
        <td>element/dom</td>
        <td>none</td>
        <td>文件选择按钮/input file element for choose file</td>
    </tr>
    <tr>
        <td>width</td>
        <td>number/string</td>
        <td>300px</td>
        <td>el字段的宽度，如果是数字时，自动补充PX单位/The width of the el field, if it is a number, automatically replenish the PX unit
        </td>
    </tr>
    <tr>
        <td>height</td>
        <td>number/string</td>
        <td>300px</td>
        <td>el字段的高度，如果是数字时，自动补充PX单位/The height of the el field, if it is a number, automatically replenish the PX unit
        </td>
    </tr>
    <tr>
        <td>alert</td>
        <td>function</td>
        <td>window.alert</td>
        <td>错误信息提示时的弹窗方法引用/Popup method reference when the error message is prompted</td>
    </tr>
    <tr>
        <td>maxSize</td>
        <td>number</td>
        <td>4096kb</td>
        <td>允许读取图片的最大字节。单位KB / Allows reading the maximum byte of a file. Unit KB</td>
    </tr>
    <tr>
        <td>scaleStep</td>
        <td>number</td>
        <td>0.1</td>
        <td>缩放的步进数 /Scaled step number</td>
    </tr>
    <tr>
        <td>rotateStep</td>
        <td>number</td>
        <td>15</td>
        <td>旋转的步进数 /Rotate step number (deg)</td>
    </tr>
    <tr>
        <td>fileNames</td>
        <td>Array</td>
        <td>["image/gif", "image/png", "image/jpeg", "image/jpg", "image/svg"]</td>
        <td>允许选取的图片类型/Allowed file types to be selected</td>
    </tr>
    <tr>
        <td>output</td>
        <td>Object</td>
        <td>empty{}</td>
        <td>图片输出配置/image output config</td>
    </tr>
</table>
<p>ouput config</p>
<table>
    <tr>
        <td>字段/feild</td>
        <td>类型/type</td>
        <td>默认值/default</td>
        <td>描述/description</td>
    </tr>
    <tr>
        <td>quality</td>
        <td>number/float number (0-1)</td>
        <td>1</td>
        <td>图片输出的清晰度，范围0-1 /Image output clarity, range 0-1</td>
    </tr>
    <tr>
        <td>size</td>
        <td>object</td>
        <td>{width:el.width,height:el.height} (px)</td>
        <td>图片输出尺寸，单位PX。宽高建议同时自定义/Picture output size in PX. Width and height are recommended to customize at the same time</td>
    </tr>
    <tr>
        <td>imageType</td>
        <td>string</td>
        <td>image/png</td>
        <td>图片输出的格式/Image output format</td>
    </tr>
    <tr>
        <td>imagePrefix</td>
        <td>string</td>
        <td>unkown</td>
        <td>图片输出的名称/Image output name
        </td>
    </tr>
    <tr>
        <td>base64</td>
        <td>boolean</td>
        <td>false</td>
        <td>片输出的类型，默认未blob格式 /The type of image output, default is blob format,when true for base64 format</td>
    </tr>
</table>

<p>Methods</p>
<table>
    <tr>
        <td>字段/feild (instance/static)</td>
        <td>参数/arguments</td>
        <td>描述/description</td>
        <td>返回/return</td>
    </tr>
    <tr>
        <td>reset(instance)</td>
        <td>none</td>
        <td>重置图片到初始化状态/Reset picture to initialization state</td>
        <td>none</td>
    </tr>
    <tr>
        <td>scale(instance)</td>
        <td>boolean</td>
        <td>对图片进行缩放，false是缩小，true是放大/ Scale the image, false is zoom out, true is zoom in</td>
        <td>none</td>
    </tr>
    <tr>
        <td>rotate(instance)</td>
        <td>boolean</td>
        <td>对图片进行旋转，false是逆时针，true是顺时针/ Rotate the image, false is counterclockwise, true is clockwise</td>
        <td>none</td>
    </tr>
    <tr>
        <td>gray(instance)</td>
        <td>none</td>
        <td>使图片变成黑白/ Make the picture black and white</td>
        <td>none</td>
    </tr>
    <tr>
        <td>clip(instance)</td>
        <td>none</td>
        <td>对图片进行裁切/ Crop the image</td>
        <td>返回一个promise,返回结果是包含name,preview(url),type,size的对象/Returns a promise, the result is an object containing
            name, preview(url), type, size
        </td>
    </tr>
    <tr>
        <td>download(instance)</td>
        <td>none</td>
        <td>下载图片/ download the image</td>
        <td>none</td>
    </tr>
    <tr>
        <td>darkAndWhite(static)</td>
        <td>(canvas,canvas.context2d)</td>
        <td>将图片变成灰白并画入画布/ Make the picture black and white and draw on canvas</td>
        <td>none</td>
    </tr>
    <tr>
        <td>base64ToBlob(static)</td>
        <td>base64</td>
        <td>将base64转为blob/Convert base64 to blob</td>
        <td>blob</td>
    </tr>
    <tr>
        <td>blobToDataURL(static)</td>
        <td>blob</td>
        <td>将blob转为base64/Convert blob to base64</td>
        <td>base64</td>
    </tr>
    <tr>
        <td>downloadFile(static)</td>
        <td>(fileName,url)</td>
        <td>下载url指向的文件并命名为filename/Download the file pointed to by url and name it filename</td>
        <td>none</td>
    </tr>
    <tr>
        <td>base64FileSize(static)</td>
        <td>base64</td>
        <td>计算base64的大小/ calc base64 file's size</td>
        <td>size(number)</td>
    </tr>

</table>
