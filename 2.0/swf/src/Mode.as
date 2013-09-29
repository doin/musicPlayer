package {
	
	/**
	 * @author hansheng  2013-9-19
	 * 播放器播放模式常量
	 **/
	public class Mode {
		//stop:直接停止
		public static var STOP				:String = "stop";
		//single:单曲循环
		public static var SINGLE			:String = "single";
		//random:随机播放
		public static var RANDOM			:String = "random";
		//order:顺序播放
		public static var ORDER				:String = "order";
		
		public function Mode() {
			trace("Mode");
			init();
		}
	}
}