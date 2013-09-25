/**
 * @fileoverview
 * @author doin<hansheng.sl@taobao.com>
 * @module musicPlayer
 **/
KISSY.add(function (S, Node,Base,SWF) {
    var _this;
    /**
     *
     * @class MusicPlayer
     * @constructor
     * @extends Base
     */
    var swf;

    function MusicPlayer(comConfig) {
        _this = this;
        this._init(comConfig);

        var self = this;
        //调用父类构造函数
        MusicPlayer.superclass.constructor.call(self, comConfig);
    }

    S.namespace('MusicPlayer');
    S.mix(S.MusicPlayer, {
        error : function(ev) {
            _this.fire("error", ev);
        },
        status : function(ev) {
            _this.fire("status", ev);
        },
        progress : function(ev) {
            _this.fire("progress", ev);
        },
        _mode : {ORDER:'order', RANDOM:'random', SINGLE:'single'},
        _event : {LOADING:'loading', RENDER:'render', STATU:'status', ERROR:'error'},
        _status : {PLAY:'play', PAUSE:'pause', STOP:'stop', LOADING:'loading', RENDER:'render'}
    });

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
        buffer : 1000
    };

    S.extend(MusicPlayer, Base, {
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
                    src:'http://gtms04.alicdn.com/tps/i4/T1b9m8FmdaXXXtxVjX.swf',
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
                            _this.fire("status", {"status":"render", "swfid":swf.get('el').id});
							
                            setTimeout(function(){
                                swf.callSWF('setSWFID', [swf.get('el').id]);},100);
                            clearInterval(_id);
                            break;
                        case SWF.Status.NOT_INSTALLED :
                            _this.fire("error", {"type":2000, "msg":SWF.Status.NOT_INSTALLED});
                            clearInterval(_id);
                            break;
                        case SWF.Status.TOO_LOW :
                            _this.fire("error", {"type":2000, "msg":SWF.Status.TOO_LOW});
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
                S.mix(defaultConfig, config);
				this._createDIV();
                this._createSWF();
                this._bindEvent();

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
            }
        },
        {
            ATTRS :{
                //设置播放模式 默认order
                mode : {
                    value : defaultConfig.mode,
                    setter : function(v){
                        swf.callSWF('setMode',[v]);
                        return v;
                    }
                },
                //设置播放缓冲区 默认1秒
                buffer : {
                    value : defaultConfig.buffer,
                    setter : function(v){
                        swf.callSWF('setBuffer',[v]);
                        return v;
                    }
                },
                //设置音量 0-1之间
                volume : {
                    value : defaultConfig.volume,
                    setter : function(v){
                        swf.callSWF('setVolume',[v]);
                        return v;
                    }
                },
                progress : {
                    value : 0,
                    setter : function(v){
                        swf.callSWF('setProgress',[v]);
                        return v;
                    }
                }
            }
        });

    return MusicPlayer;

}, {requires:['node', 'base', 'swf']});