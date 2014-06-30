## 综述

musicPlayer是基于Flash和HTML5两个方案开发的MP3音乐播放组件, 3分钟即可完成简单的音乐播放, 我们不需要关心内部封装的数据和控制, 只要专注于侦听数据改变我们的视图即可.

* 版本：2.0
* 作者：doin
* demo : [https://github.com/doin/musicPlayer](https://github.com/doin/musicPlayer)

## 1分钟实例

1分钟实现背景音乐循环播放
引入KISSY1.3,复制嵌入代码,修改歌曲路径即可
```javascript
    S.use('gallery/musicPlayer/2.0/index', function (S, MusicPlayer) {
         var musicPlayer = new MusicPlayer({
                                           auto:'true', //自动播放 默认不播放.
                                           mode:'order', //如果几首歌想随机播放,设置为 random, 默认为order.
                                           musicList:[{"name":"歌名", "path":"./歌曲地址.mp3"},...{也可以几首歌循环播放}]
                                       });
    })
```

## 初始化配置参数说明

参数名|参数类型|默认|参数说明|描述
------------|------------|------------|-------------|-------------
type     |      String    |     'auto'   |auto,flash,html5  |  设置使用的播和方式,如设置强制使用FLASH播放,默认先走HTML5可用性再走FLASH
auto|Boolean|false|false:true|组件初始化完成是否自动播放, 默认需要点击播放按钮
volume|Number|0.25|0-1之间|音量控制,后期可随时设置
mode     |      String    |     'order'   |播放完直接停止(stop):单曲循环(single):随机播放(random):顺序播放(order)  |  设置自动播放完成后的模式
musicList |     Object    |     null      |    格式要求:[{"name":"歌名", "path":"./歌曲地址.mp3"}]   |    音乐列表,后期可随时设置
buffer    |     int       |     1000毫秒   |   缓冲毫秒   |  音乐播放缓冲区间
nplay     |     String    |     null      |   selector   | 默认绑定播放按钮,不自己调用play()方法时可设置
nstop     |     String    |     null      |   selector   | 默认绑定停止按钮,不自己调用stop()方法时可设置
npause     |    String    |     null      |   selector   | 默认绑定暂停按钮,不自己调用pause()方法时可设置
npre     |      String    |     null      |   selector   | 默认绑定上一曲按钮,不自己调用pre()方法时可设置
nnext     |     String    |     null      |   selector   | 默认绑定下一曲,不自己调用nexe()方法时可设置


## 属性说明

属性名     |    参数类型    |     读写      |    参数说明   |    描述
------------   | ------------ | ------------ | ------------- | -------------
mode     |     String     |     读/写      |播放完直接停止(stop):单曲循环(single):随机播放(random):顺序播放(order)  |  设置自动播放完成后的模式
buffer     |    int      |     读/写      |    默认1000毫秒   |    音乐播放缓冲区时间
volume     |    Number    |     读/写      |    0-1之间   |    音量控制,后期可随时设置
progress     |    int    |   只写      |    0-100之间   |   设置当前播放歌曲的进度

## 方法说明

方法名     |     参数类型  |   参数说明    |     返回值   |    描述
------------   | ------------ | ------------ | ------------- | -------------
setList     |   Object    |  格式要求:[{"name":"歌名", "path":"./歌曲地址.mp3"}]  |    无   | 设置歌曲列表,会默认播放新列表中的第一首
play     |      int    |   大于等于0, 不写参数默认当前歌曲  |    无   |  播放歌曲
stop     |      无    |     无      |    无   |    停止歌曲,再次调用播放,从头继续播放
pause     |      无    |     无      |    无   |    暂停歌曲, 再次调用播放,从断点继续播放
pre     |      无    |     无      |    无   |    从头播放上一曲
     next     |      无    |     无      |    无   |    从头播放下一曲

## 事件说明

事件名     |     描述
------------   | ------------
status    |  侦听该事件可获取play,stop等状态,写对应处理代码.
error     |  出错时,返回错误信息,调试的时候很有用.
progress  |  侦听该事件可获取curtime,counttime等信息,

> status      

参数名     |   描述
------------|--------------
status  |   获取当前状态(play:stop:pause:render)
index      |   获取当前索引值
name     |   获取当前歌名
path  |   获取当前歌曲路径
mode    |   获取当前播放模式

```javascript
    musicPlayer.on("status", function(ev) {
        switch(ev.status) {
            case "render": //SWF写入页面完成.
            case "play":
                break;
            case "stop":
                break;
            default;
         }
    }
```

> error     

参数名|描述
------------|------------
type|错误类型,1000为FLASH中出错
msg|出错信息

```javascript
    musicPlayer.on("error", function(ev) {
        S.log([ev.type, ev.msg]);
    }
```

> progress    

参数名     |     描述
------------   | ------------
curtime     |     获取当前播放时间,格式00:00
counttime     |    获取当前歌曲总时长,格式00:00
progress     |   获取当前歌曲播放进度,值为0-100

```javascript
    musicPlayer.on("progress", function(ev) {
        S.log([ev.curtime, ev.counttime, ev.progress]);
    }
```

## demo演示

* [简单的控制音乐播放](http://gallery.kissyui.com/musicPlayer/2.0/demo/demo1.html)
* [MP3列表模式实例](http://gallery.kissyui.com/musicPlayer/2.0/demo/demo2.html)
* [完整MP3播放器-演示所有功能](http://gallery.kissyui.com/musicPlayer/2.0/demo/demo3.html)

##Q&A

####处理跨域问题？

在url后面加上ks-debug，看下调试工具控制台输出是否有个“缺少crossdomain.xml”的提示。

crossdomain.xml是flash的安全策略文件，需要放在在域名根目录下，比如应用域名为refund.taobao.com，那么就应该有http://www.refund.taobao.com/crossdomain.xml，在调试时可以将这个文件代理到本地。

crossdomain.xml的内容可以如下：

```xml
<?xml version="1.0"?>
<cross-domain-policy>
    <allow-access-from domain="*"/>
    <!--下面这行代码必须有-->
    <allow-access-from domain="*.tbcdn.cn"/>
</cross-domain-policy>
```

#### 组件不可用

flash对象不能设置<code>display:none;</code>，父容器隐藏也是不行的！这点特别留意。

你可以设置<code>position:absolute;top:-2000px</code>，这样的位移方式来处理。








