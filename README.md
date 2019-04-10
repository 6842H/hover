# hover
模仿浏览器开发者模式下鼠标在标签上停留时标签变色，并获取该标签的Xpath


进入浏览器开发者模式console面板，粘贴代码

function loadJS(url){
	var mlink = document.createElement('script');
	mlink.src = url;
	var head = document.getElementsByTagName('head')[0];
	head.appendChild(mlink);
}

//参数url为myscript.js 的路径
loadJS('http://127.0.0.1/tools/myscript.js')

回车执行，退出开发者模式，可以看到鼠标在标签之间移动的效果，按键盘上的‘`~’键可以将当前鼠标指向的标签xpath写到中间的显示板上
当然你可以添加其它的操作

脚本解决了标签嵌套的问题，列如dom的部分结构如下：
<A>
  <B>
    <C>
      <D>
      </D>
    </C>
  </B>
</A>
当鼠标在标签D内时，鼠标也在标签D的上层标签C、B、A内，此时应该判定鼠标是在标签D内的
