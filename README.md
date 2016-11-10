## musicPlayer

* 版本：2.0
* 概述：musicPlayer是基于Flash和HTML5两个方案开发的MP3音乐播放组件, 3分钟即可完成简单的音乐播放, 我们不需要关心内部封装的数据和控制, 只要专注于侦听数据改变我们的视图即可.
* 教程：[http://kpm.alibaba.net/musicPlayer/doc/guide/index.html](http://kpm.alibaba.net/musicPlayer/doc/guide/index.html)

## demo演示

* [简单的控制音乐播放](http://nb.labs.taobao.net/demo/kpm/musicPlayer/demo1.html?account=hansheng.sl)
* [MP3列表模式实例](http://nb.labs.taobao.net/demo/kpm/musicPlayer/demo2.html?account=hansheng.sl)
* [完整MP3播放器-演示所有功能](http://nb.labs.taobao.net/demo/kpm/musicPlayer/demo3.html?account=hansheng.sl)

## FAQ
1. DEMO无法播放    
MP3地址失效,请通知到我修改MP3有效地址 / 自行下载DEMO代码修改MP3地址

2. IOS设置 safari浏览器不能播放    
html audio 在iPhone，ipd,safari浏览器不能播放原因
(在safri on ios里面明确指出等待用户的交互动作后才能播放media，也就是说如果你没有得到用户的action就播放的话就会被safri拦截)

3. 调试
修改代码如下
```javascript    
var S = KISSY;
S.Config.debug = true;  //加入如下行
if (S.Config.debug) {
var srcPath = "../../../";
```    

## changelog

### V1.0

    [!]仅支持SWF的MP3播放器

### V2.0

    [!]播放器加入对HTML5的支持,自动优先使用audio功能.
    [!]支持手机多终端上MP3的播放.
    [!]增加初始始属性'type',可选择强制使用方案.

### V2.0.1 - '修改中'

    [!]播放器加入对HTML5的支持,自动优先使用audio功能.
    [!]支持手机多终端上MP3的播放.
    [!]增加初始始属性'type',可选择强制使用方案.
