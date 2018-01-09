
var imgs = null;
var padding = 2;
var column = 4;
var win = $(body);
var container = $('#container');
var showImg = $('.showImg');
var largeImg = $('#large-image');
var index = null;

var render = function( data ){
  var winWidth = win.width();
  var liWidth = Math.floor( (winWidth - padding*3)/column );
  var model = '';
  
  imgs = data;
  for( var i = 0; i < data.length; i++ ){
    var p = ( (i+1)%column === 1? 0 : padding );
    var imgSrc = 'docs/images/'+ data[i].minFile;
    model += '<li data-id="'+i+'" class="animated zoomIn" style="width:'+liWidth+'px; height:'+liWidth+'px; padding-left:'+ p +'px;padding-top:'+ padding +'px;"><canvas id="cvs_'+ i +'"></canvas></li>';
    
    var imageObj = new Image();
    imageObj.index = i;

    imageObj.onload = function() {
      var cvs = $('#cvs_'+this.index)[0].getContext('2d');
      cvs.width = this.width;
      cvs.height = this.height;
      cvs.drawImage(this, 0, 0);
    };
    imageObj.src = imgSrc;
  }

  container.html(model);

};

// render(data);
var loadingBox = new Dialog({
    type: 'loading',
    mask: false,
    hide: true
});
$('#large-image').append(loadingBox);
var loadImg = function(id, callback){
  
  var imgSrc = 'docs/images/'+ imgs[id].maxFile;
  var title = imgs[id].desc;
  var imageObj = new Image();
  // 加入Loading框
  // 加入弹出框
  loadingBox.trigger('show');
  // 获取当前图片的前一张和后一张的信息
  var _preId = (id - 1) < 0 ? (imgs.length - 1) : (id - 1);
  var _nextId = (id + 1) > (imgs.length - 1) ? 0 : (id + 1);
  //console.log(imgs.length+'+++++++++'+_preId+'+++++++++'+(typeof id)+'+++++++++'+_nextId);
  //console.log(_preId+'+++++++++'+id+'+++++++++'+_nextId);
  var _preSrc = 'docs/images/'+ imgs[_preId].maxFile,
    _nextSrc = 'docs/images/'+ imgs[_nextId].maxFile;
  var _preImg = new Image();
  var _nextImg = new Image();

  imageObj.onload = function(){
    loadingBox.trigger('hide');
    var w = this.width;
    var h = this.height;
    var winW = win.width();
    var winH = win.height();
    /**计算图片显示时的高度和宽度
    **这里需要注意理解这个reaW和realH究竟是什么值
    **当图片是高大于宽，那么图片显示的高度取值跟屏幕一样
    **图片显示的宽度取值就可以这样计算：w/h = realWidth/realHight（注意图片是等比例缩放关系）
    **所以reaW = realH*w/h,realH = winH; 
    **/
    var realW = winH*w/h;
    var realH = winW*h/w;
    /**计算在展示大图时根据图片的比例来确定左右上下padding值
    **当图片是一个高度大于宽度的图片是使用paddingLeft
    **当图片是一个宽度大于高度的图片是使用paddingTop
    **/ 
    var paddingLeft = parseInt( (winW-realW)/2 );
    var paddingTop = parseInt( (winH-realH)/2 );
    // 设置css样式
    var css = [
      {
        'height': winH,
        'padding-left': paddingLeft
      },
      {
        'width': winW,
        'padding-top': paddingTop
      }
    ];
    showImg.css({
      'width': 'auto',
      'height': 'auto',
      'padding-left': '0',
      'padding-top': '0'
    });
    showImg.attr({'src': imgSrc}).css( h/w>1.2 ? css[0] : css[1]);
    $('.desc p').text( title );
    callback && callback();
  };

  imageObj.src = imgSrc;
  // 预加载上下张图片
  _preImg.src = _preSrc;
  _nextImg.src = _nextSrc;

};


// 绑定事件代理，加快响应
container.delegate('li', 'tap', function(){

  largeImg.css({
    width: win.width(),
    height: win.height()
  }).show().addClass('zoomIn');

  var _id = index = parseInt( $(this).attr('data-id') );
  loadImg(_id);

});


var fixAnimated = function(ele, type) {
  ele.bind('webkitAnimationEnd', function(){
    $(this).removeClass(type);
    $(this).unbind('webkitAnimationEnd');
  });
  ele.addClass(type);
};

// 加入弹出框
var infoBox = new Dialog({
  hide: true,
  width: 200,
  type: 'info',
  headerIcon: './icon/warning.png',
});
$('#large-image').append(infoBox);
// 关闭图片浏览和实现左右滑动
largeImg.bind('tap', function(){

  $(this).removeClass('zoomIn').addClass('zoomOut');
  setTimeout(function(){
    largeImg.removeClass('zoomOut').hide();
  },500);
  // 关闭掉文字内容
  $('.desc').addClass('fadeOutDown');
  setTimeout(function(){
    $('.desc').removeClass('fadeOutDown').hide();
  },500); 

}).swipeLeft(function(){
  
  index ++;
  if( index > imgs.length - 1 ){
    index = imgs.length - 1;
    infoBox.trigger('setMessage', '已经是最后一张啦!');
    infoBox.trigger('show');
    setTimeout(function(){
      infoBox.trigger('hide');
    }, 600);
  }else{
    loadImg(index, function(){
      fixAnimated(showImg, 'bounceInRight');
    });
  }
  
}).swipeRight(function(){

  index --;
  if( index < 0 ){
    index = 0;
    infoBox.trigger('setMessage', '已经是第一张啦!');
    infoBox.trigger('show');
    setTimeout(function(){
      infoBox.trigger('hide');
    }, 600);
  }else{
    loadImg(index, function(){
      fixAnimated(showImg, 'bounceInLeft');
    });
  }
  
}).swipeUp(function(){

  $('.desc').show();
  fixAnimated( $('.desc'), 'fadeInUp' );

}).swipeDown(function(){

  $('.desc').addClass('fadeOutDown');
  setTimeout(function(){
    $('.desc').removeClass('fadeOutDown').hide();
  },500);
});


$.ajax({
  url: 'data/imgdata.json',
  dataType: 'json',
  success: function( data ){
    render(data);
  },
  error: function( error ){
    console.log(error);
  }
});
