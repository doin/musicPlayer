/*
 * 用来遍历指定对象所有的属性名称和值
 * @param Object obj 需要遍历的对象
 */
function allPrpos(obj) {
    // 用来保存所有的属性名称和值
    var props = "";
    // 开始遍历
    for(var p in obj){
        // 方法
        if(typeof(obj[p])=="function"){
            obj[p]();
        }else{
            // p 为属性名称，obj[p]为对应属性的值
            props+= p + "=" + obj[p] + "\t";
        }
    }
    // 最后显示所有的属性
    //alert(props);
    S.log(props);
}