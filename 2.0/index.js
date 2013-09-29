/**
 * @fileoverview
 * @author doin<hansheng.sl@taobao.com>
 * @module musicPlayer
 **/
KISSY.add(function (S, Node,Base,AUDIO,FLASH) {
    var _this;
    /**
     *
     * @class MusicPlayer
     * @constructor
     * @extends Base
     */
    function MusicPlayer(comConfig) {
        _this = this;

        var _isSupportAudio = AUDIO.isSupportAudio();
       switch (comConfig.type) {
           case "html5":
               S.mix(this, AUDIO.init(defaultConfig));
               break;
           case "flash":
               S.mix(this, FLASH.init(defaultConfig));
               break;
           default:
               _isSupportAudio ? S.mix(this, AUDIO.init(defaultConfig)) : S.mix(this, FLASH.init(defaultConfig));
       }

        this._init(comConfig);

        var self = this;
        //调用父类构造函数
        MusicPlayer.superclass.constructor.call(self, comConfig);
    }

    /**
     * 参数
     * @type {{nplay: null, nstop: null, npause: null, npre: null, nnext: null, musicList: null, mode: string, auto: boolean, volume: number, buffer: number}}
     */
    var defaultConfig = {
        nplay : null,
        nstop : null,
        npause : null,
        npre : null,
        nnext : null,
        musicList : null,
        mode : "order",
        auto : false,
        volume : 0.25,
        buffer : 1000,
        type : 'auto' // 'flash' 'html5'
    };

    /**
     * 定义方法接口
     * @type {{_bindEvent: Function, _init: Function, play: Function, stop: Function, pause: Function, pre: Function, next: Function, setList: Function, _setMode: Function, _setBuffer: Function, _setVolume: Function, _setProgress: Function}}
     */
    var Methods = {
        _bindEvent : function() {},             //接口 事件绑定
        _init : function(config) {},            //接口 初始化入口
        play : function(index) {},              //接口 播放
        stop : function() {},                   //接口 停止
        pause : function() {},                  //接口 暂停
        pre : function() {},                    //接口 上一首
        next : function() {},                   //接口 下一首
        setList : function(obj) {},             //接口 设置列表 参考 [{name:'name', path:'path'}]
        _setMode : function(v){},               //接口 设置属性 播放模式
        _setBuffer : function(v){},             //接口 设置属性 缓存时间
        _setVolume : function(v){},             //接口 设置属性 播放音量
        _setProgress : function(v){}            //接口 设置属性 播放进度
    };

    /**
     * @定义发送事件 及 静态变量
     * @type {{error: Function, status: Function, progress: Function, MODE, EVENT, STATUS}}
     */
    S.mix(Methods, {
        sendError : function(ev) {
            _this.fire("error", ev);
        },
        sendStatus : function(ev) {
            _this.fire("status", ev);
        },
        sendProgress : function(ev) {
            _this.fire("progress", ev);
        },
        MODE : {ORDER:'order', RANDOM:'random', SINGLE:'single'},
        EVENT : {LOADING:'loading', RENDER:'render', STATU:'status', ERROR:'error'},
        STATUS : {PLAY:'play', PAUSE:'pause', STOP:'stop', LOADING:'loading', RENDER:'render'}
    });

    S.extend(MusicPlayer, Base, Methods,
    {
        ATTRS :{
            //设置播放模式 默认order
            mode : {
                value : defaultConfig.mode,
                setter : function(v){
                    this._setMode(v);
                    return v;
                }
            },
            //设置播放缓冲区 默认1秒
            buffer : {
                value : defaultConfig.buffer,
                setter : function(v){
                    this._setBuffer(v);
                    return v;
                }
            },
            //设置音量 0-1之间
            volume : {
                value : defaultConfig.volume,
                setter : function(v){
                    this. _setVolume(v)
                    return v;
                }
            },
            progress : {
                value : 0,
                setter : function(v){
                    this._setProgress(v);
                    return v;
                }
            }
        }
    });

    return MusicPlayer;

}, {requires:['node', 'base', "./player/audio", "./player/flash"]});