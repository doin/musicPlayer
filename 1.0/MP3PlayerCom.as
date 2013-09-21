package {
	import flash.display.Sprite;
	import flash.events.ErrorEvent;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.external.ExternalInterface;
	import flash.media.Sound;
	import flash.media.SoundChannel;
	import flash.media.SoundMixer;
	import flash.net.URLRequest;
	import flash.system.Security;
	import flash.utils.setTimeout;
	
	/**
	 * @author hansheng  2013-9-19
	 **/
	[SWF(width="1",height="1",frameRate="30")]
	public class MP3PlayerCom extends Sprite
	{
		private var mp3ListArray			:Array = new Array();
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
		//　默认顺序 单曲循环　随机播放　顺序播放   single  radom  shunxu  读写
		private var module					:String = "single";
		
		public function MP3PlayerCom()
		{
			Security.allowDomain("*");
			Security.allowInsecureDomain("*");
			
			ExternalInterface.addCallback("onPlay", onPlay);
			ExternalInterface.addCallback("onPause", onPause);
			ExternalInterface.addCallback("onStop", onStop);
			ExternalInterface.addCallback("onNext", nextPlay);
			ExternalInterface.addCallback("onPre", prePlay);
			ExternalInterface.addCallback("setMP3List", setMP3List);
			
			ExternalInterface.call("swfMP3Loaded");
			//mp3Sound.addEventListener(IOErrorEvent.IO_ERROR, handler_io_error);
			init();
		}
		
		private function init():void
		{
			var param:Object = root.loaderInfo.parameters;
			if(param.mp3ListArray != null) mp3ListArray = param.mp3ListArray;
			trace(param.mp3list, param)
		}
		/**
		 *  @设置播放列表
		 * 	@param	Array 音乐播放列表 [{"name":"歌名", "path":"./1.mp3"}, {"name":"歌名", "path":"./2.mp3"}]
		 * 	@return	void
		 **/
		public function setMP3List(str:Array):void
		{
			ExternalInterface.call("function(){alert(1);}");
			mp3ListArray = str;
			curIndex = 0;
			count = mp3ListArray.length-1;
			trace(str[0].name,mp3ListArray);
		}
		/**
		 *  播放功能
		 *  @param int index　歌曲列表索引
		 * 	@return	int 当前索引
		 **/
		public function onPlay(index:int=-1):int
		{
			ExternalInterface.call("function(){alert('something111');}");
			
			if(index >= 0) curIndex = index;
			try {
				SoundMixer.stopAll();
				mp3Sound = new Sound();
				mp3Sound.load(new URLRequest(mp3ListArray[curIndex].path)); 
				if(isPause) {
					mp3SoundChannel = mp3Sound.play(position); 
				}
				else { 
					mp3SoundChannel = mp3Sound.play();
				}
			}
			catch(ev:Error) {
				ExternalInterface.call("function(){alert('出钷工');}");
			}
			
			isPlay = true; 
			isPause = false; 
			status = "play";

			mp3SoundChannel.addEventListener(Event.SOUND_COMPLETE, onStop);
			return curIndex;
		}
		/**
		 *  停止功能
		 * 	@return	int 当前索引
		 **/
		public function onStop(ev:Event=null):int
		{
			if(isPlay) 
			{ 
				try{
					mp3SoundChannel.stop(); 
					isPlay = false;   
					status = "stop";
				}
				catch(e:Error) {
					trace("请检查您的音频设备！");
					ExternalInterface.call("swfMP3Error", "请检查您的音频设备！");
				}
			} 
			ExternalInterface.call("function(){alert('something1111111');}");
			return curIndex;
		}
		/**
		 *  暂停功能
		 *  @return	int 当前索引
		 **/
		public function onPause():int
		{
			if(isPlay) 
			{                        
				try{
					position = mp3SoundChannel.position; 
					onStop();         
					isPause = true;    
					status = "pause";
				}
				catch(e:Error) {
					ExternalInterface.call("swfMP3Error", "请检查您的音频设备！");
				}
			} 
			
			return curIndex;
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
			onStop();
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
			onStop();
			onPlay();
			
			return curIndex;
		}
		
		public function getStatus():String
		{
			return status;
		}
		
		private function handler_io_error(evt:IOErrorEvent):void
		{
			ExternalInterface.call("swfMP3Error", "io error"+evt);
		}
	}
}