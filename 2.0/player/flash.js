/**
 * @fileoverview
 * @author doin<hansheng.sl@taobao.com>
 * @module musicPlayer
 **/
KISSY.add(function (S, Node, SWF) {
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