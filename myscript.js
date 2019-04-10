
var hot=null;	//当前鼠标所指的标签
var xpath_key=9;	//获取xpath的快捷键：Tab9  `~192

// 添加到body后面
//div{width: 100%; height: 30px; position: fixed; top: 0;opacity:0.75;}  
function addXpathPanel() {
	var tag="<mydiv style='width:30%;height:30px;position:fixed;top:300px;left:500px;opacity:0.5;float:left;z-index:99'><mylabel style='width:20%;height:30px;color:blue;'>xpath:</mylabel><input id='xpath_panel' type='text' style='width:80%;height:30px;padding-left:4px;flaot:left;background-color:orange;'/></mydiv> ";
	//beforeBegin、 afterBegin、beforeEnd、afterEnd
	document.getElementsByTagName('body')[0].insertAdjacentHTML("afterBegin",tag);
};

//获取标签的xpath
function getXpath(element) {
    if (element.id !== "") {//判断id属性，如果这个元素有id，则显 示//*[@id="xPath"]  形式内容
        return '//*[@id=\"' + element.id + '\"]';
    }
    //这里需要需要主要字符串转译问题，可参考js 动态生成html时字符串和变量转译（注意引号的作用）
    if (element == document.body) {//递归到body处，结束递归
        return '/html/' + element.tagName.toLowerCase();
    }
    var ix = 1,//在nodelist中的位置，且每次点击初始化
         siblings = element.parentNode.childNodes;//同级的子元素

    for (var i = 0, l = siblings.length; i < l; i++) {
        var sibling = siblings[i];
        //如果这个元素是siblings数组中的元素，则执行递归操作
        if (sibling == element) {
            return arguments.callee(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix) + ']';
            //如果不符合，判断是否是element元素，并且是否是相同元素，如果是相同的就开始累加
        } else if (sibling.nodeType == 1 && sibling.tagName == element.tagName) {
            ix++;
        }
    }
};


//停止事件的冒泡传递
function stopBubble(e) { 
	//如果提供了事件对象，则这是一个非IE浏览器 
	if ( e && e.stopPropagation ) 
		//因此它支持W3C的stopPropagation()方法 
		e.stopPropagation(); 
	else 
		//否则，我们需要使用IE的方式来取消事件冒泡 
		window.event.cancelBubble = true; 
};


//获取鼠标坐标
function getMousePos(event) {
   var e = event || window.event;
   var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
   var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
   var x = e.pageX || e.clientX + scrollX;
   var y = e.pageY || e.clientY + scrollY;
   return [x, y];
}


//对鼠标所指的元素进行处理
function check_region(element, recolor){
	//思路：对于本标签，若鼠标落在本标签的下层标签上，则不处理本标签
	magicColor='#CDC0B0';
	children = element.getElementsByTagName("*");	//获取本标签的所有下层标签
	
	mouse_pos = getMousePos(event);	//获取鼠标坐标
	mouse_x = mouse_pos[0];
	mouse_y = mouse_pos[1];
	
	self_rect = element.getBoundingClientRect();	//本标签的位置
	
	//检查鼠标是否落在下层标签内，若鼠标在子标签内，本标签恢复原色
	for(var i= 0,L = children.length; i < L; i++){
		child_rect = children[i].getBoundingClientRect();
		if ((mouse_x > child_rect.left && mouse_x < child_rect.right) && (mouse_y > child_rect.top && mouse_y < child_rect.bottom)){
			element.style.backgroundColor = recolor;
			return;
		}
	}
	
	//情况1鼠标不在本标签的任一个下层标签内则本标签变色
	//情况2无子标签,则本标签变色
	element.style.backgroundColor=magicColor;
	//将本标签的xpath显示到xpath_panel
	hot = getXpath(element).toString();
	//hot = element;
	//document.getElementById('xpath_panel').value=hot;
	//鼠标进入标签内要进行的操作：
}

function recoverColor(element, recolor){
	//恢复原色
	element.style.backgroundColor=recolor.toString()
}

function addKeyMonitor(){
	if(navigator.userAgent.indexOf("MSIE")>0){          
		document.onkeydown=function(){
	　　	if(xpath_key == event.keyCode){　//Tab9  `~192
				document.getElementById('xpath_panel').value=hot;
				//e.preventDefault();
	　　	}
	　　}  
	}
	else{     //非IE      
		window.onkeydown=function(){
	　　	if(xpath_key == event.keyCode){
	　　　　　　document.getElementById('xpath_panel').value=hot;
				//e.preventDefault();
	　　　　}
	　　}  
	}
}


function addHover(){
	//需要处理的标签添加到tags
	var tags=new Array("button","span","img","input",'div','label','a','form');
	var i, j, L;
	for(i in tags){
		target = document.getElementsByTagName(tags[i]);
		L = target.length;
		for(j=0;j<L;j++){
			if (target[j].id && target[j].id =='xpath_panel'){
				continue;
			}
			recolor=target[j].style.backgroundColor;
			target[j].addEventListener('mousemove', check_region.bind(this, target[j], recolor), false);
			target[j].addEventListener('mouseleave', recoverColor.bind(this, target[j], recolor), false);
			/*
			//在当前标签获取焦点后发生复制事件时，将复制内容换成该标签的xpath
			target[j].addEventListener('copy', function(e) {
				//只有 clipboardEvent 有clipboardData属性
				e.clipboardData.setData('text/plain', hot);
				//var oldData = e.clipboardData.getData('text/plain');
				//e.clipboardData.setData('text/html', '<b>Hello, world!</b>');//只能粘贴到html里
				//alert(e);
				e.preventDefault();
			});*/
			target[j].setAttribute("title","按Tab复制Xpath");
		}
	}
}
addKeyMonitor();
addXpathPanel();
addHover();
