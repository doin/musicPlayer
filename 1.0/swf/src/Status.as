package {
	
	/**
	 * @author hansheng  2013-9-19
	 * 发送状态常量
	 **/
	public class Status {
		//播放
		public static var PLAY			:String = "play"
		//暂停
		public static var PAUSE			:String = "pause"
		//停止
		public static var STOP			:String = "stop"
		//渲染完成
		public static var RENDER		:String = "render"
		
		public function Status() {
			trace("Status");
		}
	}
}