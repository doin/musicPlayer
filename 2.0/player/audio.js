/**
 * @fileoverview
 * @author doin<hansheng.sl@taobao.com>
 * @module musicPlayer
 **/
KISSY.add(function (S, Node) {
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
             * �¼���
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
             * ����SWF���
             */
            _createAudio: function() {
                audio = document.createElement("audio");
                audio.contentType = "Content-Type:application/octet-stream"
                audio.addEventListener("timeupdate", this._progress_handle, true);
                audio.addEventListener("ended", this._ended_handle, true);
                audio.addEventListener("loadedmetadata", function(_event) {
                  // alert(audio.duration);
                });
            },
            /**
             * ���Ž���
             */
            _progress_handle: function() {
                var _curTime = formatTime(audio.currentTime);
                var _countTime = formatTime(audio.duration);
                var _progress = Math.floor(audio.currentTime/audio.duration*100);
                if((_curTime != curTime || _progress != curProgress) && _countTime != "NaN:NaN") {
                    curTime = _curTime;
                    countTime = audio.duration;
                    curProgress = _progress;
                    if(curTime == _countTime) _progress = 100;
                    MusicPlayer.sendProgress({index:curIndex, curtime:_curTime, counttime:_countTime, progress:_progress});
                }

            },
            /**
             * ���Ž���
             */
            _ended_handle: function() {
                MusicPlayer.stop("ended");
            },
            /**
             * ��ʼ�����
             * @param {Object} ���ò���
             */
            _init : function(config) {
                MusicPlayer = this
                S.mix(defaultConfig, config);
                this._createAudio();
                this._bindEvent();
                this._initAudio();
            },
            /**
             * ��ʼ����Ƶ
             */
            _initAudio : function() {
                S.log(["audio", audio]);
                this.setList(defaultConfig.musicList);

                if(defaultConfig.auto) {
                    this.play("first_delay_sendstatus");
                }
            },
            /**
             * ����
             * @param {int} ���������� 0-(len-1)  Ĭ�� ��ǰ
             */
            play : function(index) {
                if(index == null) index = -1;
                if(index > count) {
                    sendError("�������ֵ�����������Χ");
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

                //��һ���Զ�����,��������BUG..����ʱ
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
             * ֹͣ
             */
            stop : function(ended) {
                if(isPlay)
                {
                    audio.currentTime = 0;
                    audio.pause();
                    isPlay = false;
                }

                sendStatus("stop");

                //�������Ȼ���Ž���, ����ģʽ, ���õ�ǰ����״̬
                if(ended != null)
                {
                    runMode();
                }
            },
            /**
             * ��ͣ
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
             * ��һ��
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
             * ��һ��
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
             * �����б� �ο� [{name:'name', path:'path'}]
             */
            setList : function(obj) {
                mp3List = obj || {};
                if(mp3List == null || mp3List.length <= 0) {
                    sendError("��������б�, �ο� [{name:'name', path:'path'}]");
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
        var _msg = msg || "�����쳣!";
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
     *  ���ֲ��Ž���֮��,���ݲ���ģʽ��������
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
            setObj();
            return _obj;
        }
    };
}, {requires:['node']});