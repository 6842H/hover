
//加载CSS，立即生效
function loadCSS(url){
	var mlink = document.createElement('link');
	mlink.type = 'text/css';
	mlink.rel = 'stylesheet';
	mlink.href = url;
	var head = document.getElementsByTagName('head')[0];
	head.appendChild(mlink);
}

//加载JS，立即生效
function loadJS(url){
	var mlink = document.createElement('script');
	mlink.src = url;
	var head = document.getElementsByTagName('head')[0];
	head.appendChild(mlink);
}

//loadCSS('http://127.0.0.1/mycss.css')
loadJS('http://127.0.0.1/tools/myscript.js')
//xpath_key=9;	//重置获取xpath的快捷键
