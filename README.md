photofigure（**[demo view](http://htmlpreview.github.io/?https://github.com/robinma/photofigure/blob/master/demo/demo_test.html)**）
===========

## 一 简介 ##

本组件，主要用于图片查看的功能，主要实现了图片的切换，旋转，放大区域查看，以及按屏幕大小改变尺寸。

###1.1主要功能###
- 小图片的预览
- 大图的查看与放大，旋转，区域查看
- 默认当前显示图片

### 1.2问题反馈

在使用过程中如有任何问题，欢迎反馈给我

- email:`ahmzj@163.com`
- QQ:`316933268`



##二 How to use ##

first,in HTML include javascript files

the lib is *relative jQuery*

### 2.1 include base file
    
    <script type="text/javascript" src="http://www.21boya.cn/dianping/www/js/2013/lib/jquery-1.7.min.js?v=201407181929"></script>
    <script type="text/javascript" src="../src/js/photofigure.js"></script>
    
###2.2 init to do ###

     /**
      * param {Data} imgData,the data nust include bigImg and smallImg path.
      * param {Number} imgIndex, this is current show images.default is 1
      */
     photofigure(imgData,imgIndex);   
     
**demo**

    var imgdata=[{bigImg:'http://ww3.sinaimg.cn/bmiddle/69602d30jw1ejc82km177j20c80vkq5r.jpg',smallImg:'http://ww3.sinaimg.cn/bmiddle/69602d30jw1ejc82km177j20c80vkq5r.jpg'},{bigImg:'http://www.33.la/uploads/20130217bz/650.jpg',smallImg:'http://www.33.la/uploads/20130217bz/650.jpg'},{bigImg:'http://s6.yiban.cn/topic/7d/df/0b/af/744140ba60b7326b.jpg',smallImg:'http://s6.yiban.cn/topic/7d/df/0b/af/744140ba60b7326b.jpg'},
		{bigImg:'http://soft.tu6.cn/uploads/wallpaper/art/110-5-1280x800.jpg',smallImg:'http://soft.tu6.cn/uploads/wallpaper/art/110-5-1280x800.jpg'},{bigImg:'http://s6.yiban.cn/topic/7d/df/0b/af/744140ba60b7326b.jpg',smallImg:'http://s6.yiban.cn/topic/7d/df/0b/af/744140ba60b7326b.jpg'},
		
	];
	
	var photoshow = photofigure(imgdata,2);
	
	//when change image ,trigger change event
    photoshow.on('switch',function(){
    	//code body...
    });
   
   
###2.3 method ###
 
 when to do photofigure,will return a phtotfigure object.
 that have some method and events;
 
 ** add(imgData) **
 
     photoshow.add({bigImg:'imgUrl',smallImg:'imgUrl'}); 
     
**events switch**

it can to do define method
 
     photoshow.on('switch',function(index,imageobjs,thisObj){
     	//todo sth
     })  

![Demo Image](https://raw.githubusercontent.com/robinma/photofigure/master/src/images/demo.jpg)
