package {
	
	/**
	 * @author hansheng  2013-9-19
	 * 发送给JS的返回事件
	 **/
	public class SendEvent {
		//stop:直接停止
		public static var STATUS_EVENT				:String = "KISSY.MusicPlayer.status";
		//stop:直接停止
		public static var ERROR_EVENT				:String = "KISSY.MusicPlayer.error";
		//stop:直接停止
		public static var PROGRESS_EVENT			:String = "KISSY.MusicPlayer.progress";
		
		public function SendEvent() {
			trace("SendEvent");
		}
	}
}