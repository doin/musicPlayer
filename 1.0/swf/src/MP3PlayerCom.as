package {
	import flash.display.Sprite;
	import flash.events.ErrorEvent;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.external.ExternalInterface;
	import flash.media.Sound;
	import flash.media.SoundChannel;
	import flash.media.SoundLoaderContext;
	import flash.media.SoundMixer;
	import flash.media.SoundTransform;
	import flash.net.URLRequest;
	import flash.system.Security;
	import flash.system.System;
	import flash.utils.setTimeout;
	
	/**
	 * @author hansheng  2013-9-19
	 * MP3播放器组件 V1.0.1
	 **/
	[SWF(width="1",height="1",frameRate="60")]
	public class MP3PlayerCom extends Sprite
	{
		private var SWFID					:String;
		private var mp3ListArray			:Object;
		private var mp3Sound				:Sound ;
		private var mp3SoundChannel			:SoundChannel;
		private var curIndex				:int;
		//从0开始算起
		private var count					:int;
		private var position				:Number; 
		private var isPlay					:Boolean = false;
		private var isPause					:Boolean = false;
		//状态　loading  play  pause  stop  error　　外部直接获取　　只读
		private var status					:String = "stop"; 
		//　默认顺序 直接停止 单曲循环　随机播放　顺序播放 stop  single  random  order  读写
		private var mode					:String = "order";
		private var buffer					:SoundLoaderContext = new SoundLoaderContext(1000);
		//歌曲总时长
		private var countTime				:Number;
		
		public function MP3PlayerCom()
		{
			Security.allowDomain("*");
			Security.allowInsecureDomain("*");
			System.useCodePage = true;
			
			ExternalInterface.addCallback("onPlay", onPlay);
			ExternalInterface.addCallback("onPause", onPause);
			ExternalInterface.addCallback("onStop", onStop);
			ExternalInterface.addCallback("onNext", nextPlay);
			ExternalInterface.addCallback("onPre", prePlay);
			ExternalInterface.addCallback("setMP3List", setMP3List);
			ExternalInterface.addCallback("setMode", setMode);
			ExternalInterface.addCallback("setBuffer", setBuffer);
			ExternalInterface.addCallback("setVolume", setVolume);
			ExternalInterface.addCallback("setSWFID", setSWFID);
			ExternalInterface.addCallback("setProgress", setProgress);
			
			ExternalInterface.call("swfMP3Loaded");
			init();
		}
		
		private function init():void
		{
			var param:Object = root.loaderInfo.parameters;
			if(param.mp3ListArray != null) mp3ListArray = param.mp3ListArray;
			if(param.mode != null) setMode(param.mode);
			if(param.buffer != null) setBuffer(param.buffer);
			//ExternalInterface.call("mp.error", {"type":null, "msg":null});
			//trace(param.mp3list, param)
			try
			{
				setMP3List(JSON.parse(param.mp3list))
			}
			catch(ev:Error)
			{
				sendError("歌曲列表格式不对, json解析失败!参考[{name:'name', path:'path'}]");
				return;
			}
			
			//自动播放
			if(param.auto == "true") onPlay();
			//设置音量
			if(param.volume != null) setVolume(param.volume);
		}
		/**
		 *  @设置播放列表
		 * 	@param	Array 音乐播放列表 [{"name":"歌名", "path":"./1.mp3"}, {"name":"歌名", "path":"./2.mp3"}]
		 * 	@return	void
		 **/
		public function setMP3List(obj:Object):void
		{
			//ExternalInterface.call("mp3Player_status", {"status":status, "index":curIndex, "name":mp3ListArray[curIndex].name});
			mp3ListArray = obj;
			curIndex = 0;
			count = mp3ListArray.length-1;
			
			if(!mp3ListArray[curIndex].name) {
				sendError("歌曲列表为空!");
				return;
			}
		}
		/**
		 *  播放功能
		 *  @param int index　歌曲列表索引
		 **/
		public function onPlay($index:int=-1):void
		{
			if($index > count) {
				sendError("播放音乐的索引超出范围");
				return;
			}
			if($index >= 0) curIndex = $index;
			try {
				SoundMixer.stopAll();
				mp3Sound = new Sound();
				trace(mp3ListArray[curIndex].path);
				mp3Sound.load(new URLRequest(encodeURI(mp3ListArray[curIndex].path)), buffer); 
				mp3Sound.addEventListener(IOErrorEvent.IO_ERROR, IOError_handle); 
				if(isPause) {
					mp3SoundChannel = mp3Sound.play(position); 
				}
				else { 
					mp3SoundChannel = mp3Sound.play();
				}
			}
			catch(ev:Error) {
				trace(ev.message,ev.name, ev.errorID, ev.toString())
				sendError("数据异常, 请检查音乐列表! index:" + curIndex);
				return;
			}
			
			try {
				mp3SoundChannel.addEventListener(Event.SOUND_COMPLETE, onStop);
				addEventListener(Event.ENTER_FRAME,time_Handler);
			}
			catch(ev:Error) {
				trace("没有检测到音频设备");
				sendError("没有检测到音频设备!");
			}
			
			isPlay = true; 
			isPause = false; 
			sendStatus(Status.PLAY);
		}
		/**
		 *  handle 加载进度
		 **/
		private function progress_Handler($ev:ProgressEvent):void{
			var _loaded:int = Math.ceil(100*$ev.bytesLoaded/$ev.bytesTotal);
			trace("_loaded", _loaded)
		}
		private function IOError_handle($ev:IOErrorEvent):void {
			trace("该声音没有被载入: " + $ev.text);  
			sendError("声音没有被载入 : " + mp3ListArray[curIndex].path);
		}
		private var curTime:String;
		private function time_Handler(_evt:Event):void{
			
			var _load:int = Math.ceil(100*mp3Sound.bytesLoaded/mp3Sound.bytesTotal);
			var _slen:Number= mp3Sound.length;
			countTime = _slen = _slen / (mp3Sound.bytesLoaded/mp3Sound.bytesTotal);
			var _position:Number = mp3SoundChannel.position;
			
			var _curTime:String = formatTime(_position);
			var _countTime:String = formatTime(_slen);
			var _progress:int = Math.floor(_position/_slen*100);
			
			if(_curTime != curTime && _countTime != "NaN:NaN") {
				curTime = _curTime;
				if(curTime == _countTime) _progress = 100;
				ExternalInterface.call(SendEvent.PROGRESS_EVENT, {index:curIndex, curtime:_curTime, counttime:_countTime, progress:_progress, load:_load});
			}
		}
		/**
		 *  音量设置
		 *  @param Number 音量 0-1
		 **/
		public function setVolume($value:Number):void
		{
			if($value < 0 || $value >1)
			{
				sendError("音量设置错误,值在0-1之间!");
				return;
			}
			
			var _stransform:SoundTransform = new SoundTransform();
			_stransform.volume = $value;
			SoundMixer.soundTransform = _stransform;
		}
		private function formatTime(time:Number):String {
			var minutes:* = Math.floor(time/1000/60);
			var seconds:* = Math.floor(time/1000%60);
			if (seconds<10) {
				seconds = "0"+seconds;
			}
			if (minutes<10) {
				minutes = "0"+minutes;
			}
			
			return minutes+":"+seconds;
		}
		/**
		 *  停止功能
		 **/
		public function onStop(ev:Event=null, isSend:Boolean=false):void
		{
			if(isPlay) 
			{ 
				try{
					mp3SoundChannel.stop(); 
					isPlay = false;   
				}
				catch(e:Error) {
					trace("请检查您的音频设备！");
					sendError("请检查您的音频设备！");
					return;
				}
			} 
			
			if(!isSend) {
				sendStatus(Status.STOP);
			}
			
			//如果是自然播放结束, 根据模式, 设置当前播放状态
			if(ev != null)
			{
				runMode();
			}
		}
		/**
		 *  暂停功能
		 **/
		public function onPause():void
		{
			if(isPlay) 
			{                        
				try{
					position = mp3SoundChannel.position; 
					isPause = true;    
					sendStatus(Status.PAUSE);
					onStop(null, true); 
				}
				catch(e:Error) {
					sendError("请检查您的音频设备！");
					return;
				}
			} 
		}
		
		/**
		 *  下一首
		 *  @return	index　当前索引
		 **/
		public function nextPlay():int
		{
			if(curIndex < count)
			{
				curIndex++;
			}
			onStop(null, true);
			onPlay();
			
			return curIndex;
		}
		
		/**
		 *  上一首
		 *  @return	index　当前索引
		 **/
		public function prePlay():int
		{
			if(curIndex > 0)
			{
				curIndex--;
			}
			onStop(null, true);
			onPlay();
			
			return curIndex;
		}
		/**
		 *  发送状态事件 
		 *  @param String 当前状态 默认为NULL 
		 **/
		public function sendStatus($status:String=null):void
		{
			status = $status ? $status : status;
			
			var _status:String = status ? status : undefined;
			var _index:int = curIndex ? curIndex : undefined;
			var _name:String = null;
			var _path:String = null;
			if(mp3ListArray && curIndex) {
				_name = mp3ListArray[curIndex].name
				_path = mp3ListArray[curIndex].path
			}
			var _mode:String = mode != null ? mode : null;
			
			var _obj:Object = {"swfid":SWFID, "status":_status, "index":_index, "name":_name, "path":_path, "mode":_mode };
			
			ExternalInterface.call(SendEvent.STATUS_EVENT, _obj);
		}
		/**
		 *  发送错误事件 
		 *  @param String 错误提示 默认为NULL 
		 **/
		public function sendError($msg:String="内容异常!"):void
		{
			var _msg:String = $msg;
			var _type:int = 1000;
			
			var _obj:Object = { "type":_type, "msg":_msg };
			
			ExternalInterface.call(SendEvent.ERROR_EVENT, _obj);
		}
		/**
		 *  音乐播放模式
		 *  @param	String  stop:直接停止 |  single:单曲循环 | random:随机播放 | order:顺序播放
		 **/
		public function setMode($mode:String):void 
		{
			mode = $mode;
			//sendStatus();
		}
		/**
		 *  音乐播放缓冲区时间
		 *  @param	int  默认 1000毫秒
		 **/
		public function setBuffer($time:int):void 
		{
			if($time < 0){
				sendError("缓冲区时间设置不能小于0!");
			}
			buffer.bufferTime = $time;
		}
		/**
		 *  设置OBJECT标签ID值
		 *  @param	String
		 **/
		public function setSWFID($id:String):void
		{
			SWFID = $id;
		}
		/**
		 *  设置当前播放进度
		 *  @param	int  ０-１
		 **/
		public function setProgress($progress:int):void 
		{
			position = $progress / 100　*　countTime;
			isPause = true;
			onPlay();
		}
		/**
		 *  音乐播放结束之后,根据播放模式继续运行
		 **/
		private function runMode():void {
			switch(mode)
			{
				case Mode.ORDER:
				{
					curIndex = curIndex==count ? 0 : curIndex+1;
					onPlay(curIndex);
					break;
				}
				case Mode.RANDOM:
				{
					curIndex = Math.ceil(Math.random()*count);
					onPlay(curIndex);
					break;
				}
				case Mode.SINGLE:
				{
					onPlay(curIndex);
					break;
				}
				case Mode.STOP:
				{
					break;
				}
				default:
			}
		}
		
	}
}