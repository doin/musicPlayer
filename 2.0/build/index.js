/*
combined files : 

gallery/musicPlayer/2.0/player/audio
gallery/musicPlayer/2.0/player/flash
gallery/musicPlayer/2.0/index

*/
/**
 * @fileoverview
 * @author doin<hansheng.sl@taobao.com>
 * @module musicPlayer
 **/
KISSY.add('gallery/musicPlayer/2.0/player/audio',function (S, Node) {
    var Mode = {ORDER:"order", RANDOM:"random", STOP:"stop", SINGLE:"single"};
    var MusicPlayer,
        audio,
        defaultConfig,
        _obj;
    var mp3List,
        curIndex,
        curTime,
        curProgress,
        count,
        position,
        isPlay,
        isPause,
        mode,
        volume,
    //buffer,
        countTime;

    function setObj() {
        _obj = {
            /**
             * 事件绑定
             */
            _bindEvent : function() {
                S.all(defaultConfig.nstop) && S.all(defaultConfig.nstop).on('click', function(ev) {
                    MusicPlayer.stop();
                });
                S.all(defaultConfig.nplay) && S.all(defaultConfig.nplay).on('click', function(ev) {
                    MusicPlayer.play();
                });
                S.all(defaultConfig.npause) && S.all(defaultConfig.npause).on('click', function(ev) {
                    MusicPlayer.pause();
                });
                S.all(defaultConfig.npre) && S.all(defaultConfig.npre).on('click', function(ev) {
                    MusicPlayer.pre();
                });
                S.all(defaultConfig.nnext) && S.all(defaultConfig.nnext).on('click', function(ev) {
                    MusicPlayer.next();
                });
            },
            /**
             * 创建SWF组件
             */
            _createAudio: function() {
                audio = document.createElement("audio");
            },
            /**
             * 播放进度
             */
            _progress_handle: function() {
                var _curTime = formatTime(audio.currentTime);
                var _countTime = formatTime(audio.duration);
                //var _progress = Math.floor(audio.currentTime/audio.duration*100);
                var _progress = (audio.currentTime/audio.duration*100).toFixed(2);
                //audio.autobuffer = ;
                //S.log([_curTime, _countTime, _progress, audio.byteLength, audio.loadedmetadata, audio.autobuffer, audio]);
                if(_curTime != curTime && _countTime != "NaN:NaN") {
                    curTime = _curTime;
                    countTime = audio.duration;
                    curProgress = _progress;
                    if(curTime == _countTime) _progress = 100;
                    MusicPlayer.sendProgress({index:curIndex, curtime:_curTime, counttime:_countTime, progress:_progress});
                }

            },
            /**
             * 播放进度
             */
            _ended_handle: function() {
                MusicPlayer.stop("ended");
            },
            /**
             * 初始化入口
             * @param {Object} 配置参数
             */
            _init : function(config) {
                MusicPlayer = this
                S.mix(defaultConfig, config);
                //this._createAudio();
                this._bindEvent();
                this._initAudio();
            },
            /**
             * 初始化音频
             */
            _initAudio : function() {
                S.log(["audio", audio]);
                audio.addEventListener("timeupdate", this._progress_handle, true);
                audio.addEventListener("ended", this._ended_handle, true);
                audio.addEventListener("loadedmetadata", function(_event) {
                     //alert(audio.duration);
                });
                this.setList(defaultConfig.musicList);

                if(defaultConfig.auto) {
                    this.play("first_delay_sendstatus");
                }
            },
            /**
             * 播放
             * @param {int} 播放索引号 0-(len-1)  默认 当前
             */
            play : function(index) {
                if(index == null) index = -1;
                if(index > count) {
                    sendError("播放音乐的索引超出范围");
                    return;
                }
                if(index >= 0) curIndex = index;

                audio.addEventListener('canplaythrough', function(){

                }, false );

                audio.addEventListener('loadedmetadata',function(){
                    //audio.currentTime = aTime / 1000.0;
                }, false );
                if(!isPause) {
                    audio.src = mp3List[curIndex].path;
                }
                audio.play();
                    //mp3SoundChannel.addEventListener(Event.SOUND_COMPLETE, onStop);
                    //addEventListener(Event.ENTER_FRAME,time_Handler);

                isPlay = true;
                isPause = false;

                //第一次自动播放,不触发的BUG..做延时
                if(index == "first_delay_sendstatus") {
                    setTimeout(function(){
                        sendStatus("play");
                    },10)
                }
                else {
                    sendStatus("play");
                }


            },
            /**
             * 停止
             */
            stop : function(ended) {
                if(isPlay)
                {
                    audio.currentTime = 0;
                    audio.pause();
                    isPlay = false;
                }

                sendStatus("stop");

                //如果是自然播放结束, 根据模式, 设置当前播放状态
                if(ended != null)
                {
                    runMode();
                }
            },
            /**
             * 暂停
             */
            pause : function() {
                if(isPlay)
                {
                    position = audio.currentTime;
                    audio.pause();
                    isPause = true;
                    sendStatus("pause");
                }
            },
            /**
             * 上一首
             */
            pre : function() {
                if(curIndex > 0)
                {
                    curIndex--;
                }
                this.stop(null);
                this.play();
            },
            /**
             * 下一首
             */
            next : function() {
                if(curIndex < count)
                {
                    curIndex++;
                }
                this.stop(null);
                this.play();
            },
            /**
             * 设置列表 参考 [{name:'name', path:'path'}]
             */
            setList : function(obj) {
                mp3List = obj || {};
                if(mp3List == null || mp3List.length <= 0) {
                    sendError("请检查歌曲列表, 参考 [{name:'name', path:'path'}]");
                    return;
                }
                count = mp3List.length - 1;
                curIndex = 0;
            },
            _setMode : function(v){
                mode = v;
            },
            _setBuffer : function(v){
                audio.buffer = v;
            },
            _setVolume : function(v){
                audio.volume = v
            },
            _setProgress : function(v){
                audio.currentTime = v/100*countTime;
            }
        };
    }

    function sendError(msg){
        var _msg = msg || "错误异常!";
        var _type = 2000;

        var _obj = { "type":_type, "msg":_msg };

        MusicPlayer.sendError(_obj);
    }

    function sendStatus(status) {
        var _status = status || null;
        var _index = curIndex;
        var _name = mp3List[curIndex].name || null;
        var _path = mp3List[curIndex].path || null;
        var _mode = mode || null;

        var _obj = {"status":_status, "index":_index, "name":_name, "path":_path, "mode":_mode };

        MusicPlayer.sendStatus(_obj);
    }

    /**
     *  音乐播放结束之后,根据播放模式继续运行
     **/
    function runMode() {
        switch(mode) {
            case Mode.ORDER:
                {
                    curIndex = curIndex==count ? 0 : curIndex+1;
                    MusicPlayer.play(curIndex);
                    break;
                }
            case Mode.RANDOM:
                {
                    curIndex = Math.ceil(Math.random()*count);
                    MusicPlayer.play(curIndex);
                    break;
                }
            case Mode.SINGLE:
                {
                    MusicPlayer.play(curIndex);
                    break;
                }
            case Mode.STOP:
                {
                    break;
                }
            default:
        }
    }

    /**
     * 把秒转变成 00:00 格式的时间
     * @param time 秒
     * @returns {string}
     */
    function formatTime(time) {
        var minutes = Math.floor(time/60);
        var seconds = Math.floor(time%60);
        if (seconds<10) {
            seconds = "0"+seconds;
        }
        if (minutes<10) {
            minutes = "0"+minutes;
        }

        return minutes+":"+seconds;
    }

    return {
        init : function(_defaultConfig) {
            defaultConfig = _defaultConfig;
            setObj()
            return _obj;
        },
        /**
         *  检测是否支持H5的audio标签
         */
        isSupportAudio : function() {
            audio = document.createElement("audio");
            audio.contentType = "Content-Type:application/octet-stream";
            var _isSupport = !!(audio.canPlayType);
            return _isSupport;
        }
    };
}, {requires:['node']});
/**
 * @fileoverview
 * @author doin<hansheng.sl@taobao.com>
 * @module musicPlayer
 **/
KISSY.add('gallery/musicPlayer/2.0/player/flash',function (S, Node, SWF) {
    var MusicPlayer,
        swf,
        defaultConfig,
        _obj;

    function setObj() {
        _obj = {
            /**
             * 事件绑定
             */
            _bindEvent : function() {
                S.all(defaultConfig.nstop) && S.all(defaultConfig.nstop).on('click', function(ev) {
                    swf.callSWF('onStop');
                });
                S.all(defaultConfig.nplay) && S.all(defaultConfig.nplay).on('click', function(ev) {
                    swf.callSWF('onPlay');
                });
                S.all(defaultConfig.npause) && S.all(defaultConfig.npause).on('click', function(ev) {
                    swf.callSWF('onPause');
                });
                S.all(defaultConfig.npre) && S.all(defaultConfig.npre).on('click', function(ev) {
                    swf.callSWF('onPre');
                });
                S.all(defaultConfig.nnext) && S.all(defaultConfig.nnext).on('click', function(ev) {
                    swf.callSWF('onNext');
                });
            },
            /**
             * 创建SWF组件
             */
            _createSWF : function() {
                swf = new SWF({
                    src:'http://gtms02.alicdn.com/tps/i2/T1iNTbFbddXXXtxVjX.swf',
                    attrs:{
                        width:1,
                        height:1
                    },
                    params:{
                        flashVars:{
                            mp3list : defaultConfig.musicList,
                            auto : defaultConfig.auto,
                            mode : defaultConfig.mode,
                            volume : defaultConfig.volume,
                            buffer : defaultConfig.buffer
                        },
                        allowscriptaccess : 'always',
                        quality : 'low'
                    },
                    render:'#ks-musicplayer'
                });
                var _id = setInterval(function(){
                    switch (swf.get('status')) {
                        case SWF.Status.SUCCESS :
                            MusicPlayer.sendStatus({"status":"render", "swfid":swf.get('el').id});
                            setTimeout(function(){
                                swf.callSWF('setSWFID', [swf.get('el').id]);},100);
                            clearInterval(_id);
                            break;
                        case SWF.Status.NOT_INSTALLED :
                            MusicPlayer.sendError({"type":2000, "msg":SWF.Status.NOT_INSTALLED});
                            clearInterval(_id);
                            break;
                        case SWF.Status.TOO_LOW :
                            MusicPlayer.sendError({"type":2000, "msg":SWF.Status.TOO_LOW});
                            clearInterval(_id);
                            break;
                        default :
                    }
                },10)
            },
            /**
             * 创建包裹SWF的DIV
             */
            _createDIV : function() {
                var _tlp = '<div id="ks-musicplayer" style="position:absolute;left: -9999px; top: -9999px; width:1px; height:1px"></div>';
                S.one('body').append(_tlp);
            },
            /**
             * 初始化入口
             * @param {Object} 配置参数
             * @return {Boolean}
             */
            _init : function(config) {
                S.log("flash");
                MusicPlayer = this
                S.mix(defaultConfig, config);
                this._createDIV();
                this._createSWF();
                this._bindEvent();
                this._setfire();
            },
            /**
             * 侦听事件绑定
             */
            _setfire : function() {
                S.namespace('MusicPlayer');
                S.mix(S.MusicPlayer, {
                    error : function(ev) {
                        MusicPlayer.sendError(ev);
                    },
                    status : function(ev) {
                        MusicPlayer.sendStatus(ev);
                    },
                    progress : function(ev) {
                        MusicPlayer.sendProgress(ev);
                    }
                });
            },
            /**
             * 播放
             * @param {int} 播放索引号 0-(len-1)  默认 当前
             * @return {Boolean}
             */
            play : function(index) {
                if(index == null) index = -1;
                swf.callSWF('onPlay', [index]);
            },
            /**
             * 停止
             */
            stop : function() {
                swf.callSWF('onStop');
            },
            /**
             * 暂停
             */
            pause : function() {
                swf.callSWF('onPause');
            },
            /**
             * 上一首
             */
            pre : function() {
                swf.callSWF('onPre');
            },
            /**
             * 下一首
             */
            next : function() {
                swf.callSWF('onNext');
            },
            /**
             * 设置列表 参考 [{name:'name', path:'path'}]
             */
            setList : function(obj) {
                if(obj == null) obj = {};
                swf.callSWF('setMP3List', [obj]);
            },
            _setMode : function(v){
                swf.callSWF('setMode',[v]);
            },
            _setBuffer : function(v){
                swf.callSWF('setBuffer',[v]);
            },
            _setVolume : function(v){
                swf.callSWF('setVolume',[v]);
            },
            _setProgress : function(v){
                swf.callSWF('setProgress',[v]);
            }
        };
    }

    return {
        init : function(_defaultConfig) {
            defaultConfig = _defaultConfig;
            setObj();
            return _obj;
        }
    };
}, {requires:['node', 'swf']});
/**
 * @fileoverview
 * @author doin<hansheng.sl@taobao.com>
 * @module musicPlayer
 **/
KISSY.add('gallery/musicPlayer/2.0/index',function (S, Node,Base,AUDIO,FLASH) {
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
