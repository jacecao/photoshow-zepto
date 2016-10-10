// dialog 组件
var Dialog = function( config ) {
  var _this = this;
  this.config = config;
  // 默认参数设置
  var isMask = this.config.mask || true;
  this.config.align = config.align || 'vetically';
  // 默认DOM元素创建
  var dialog = $('<div class="dialog">');
  var dialog_mask = $('<div class="dialog_mask">');
  var dialog_body = $('<div class="dialog_body">');
  // 是否显示遮罩
  if ( !isMask ) {
    dialog_mask = null;
  }

  // 创建对话框类别
  // 创建默认loading对话框的宽高
  var loading_run = function () {
    var _width = config.width ? config.width : 70;
    var _height = config.height ? config.height : 70;
    dialog_body.width( _width );
    dialog_body.height( _height );
  };
  switch ( this.config.type ) {
    case 'loading':
      loading_run();
      dialog_body.append( this.loading() );
      break;
    case 'info':
      config.width && dialog_body.width( config.width );
      config.height && dialog_body.height( config.height );
      dialog_body.append( this.info() );
      break;
    case 'interactive':
      config.width && dialog_body.width( config.width );
      config.height && dialog_body.height( config.height );
      break; 
    default:
      loading_run();
      dialog_body.append( this.loading() );
  }
 
  // 样式设置
  if ( config && config.css ) {
    dialog_body.css( config.css );
  }

  // 边框圆角设置
  var radius = dialog_body.width() >= 300 ? 10 : 5;
  dialog_body.css({borderRadius: radius+'px'});

  // 对齐方式设置
  if (this.config.align) {
    switch (this.config.align) {
      case 'vetically':
        dialog_body.css({
          top: '50%',
          left: '50%',
        });
        // 根据是否指定弹出框宽度来设置左右偏移
        if ( this.config.width && this.config.height ) {
          dialog_body.css({
            marginLeft: - this.config.width/2,
            marginTop: - this.config.height/2,
          });
        }else{
          dialog_body.css({
            transform: 'translateX(-50%) translateY(-50%)',
          });
        }
        break;
      case 'center':
    }
  }

  // 初始状态是否需要隐藏
  this.config.hide = config.hide ? config.hide : false;
  this.config.hide && dialog.css('opacity',0).hide();

  dialog.append(dialog_mask).append(dialog_body);
  
  // *****绑定事件
  
  // 修改信息内容
  dialog.on('setMessage', function (e,info) {
    
    if (info) {
      switch (typeof info) {
        case 'string':
          $('.dialog_content p').text(info);
          break;
        default:
          $('.dialog_content p').text('the type of argument only string'); 
      }
    }else{
      $('.dialog_content p').text('wirte down change message');
    }

  });

  // 检查传入的参数
  var checkArguments = function (ar1, ar2, callback) {
    if (ar1) {
      // 如果指传入一个参数
      switch (typeof ar1) {
        case 'string':
        case 'object':
          console.error('if here(show event) only one argument , the type of argument must be function or number');
          console.error('如果触发show事件中你只想传入一个参数，那该参数只能是数字或回调方法');
          break;
        case 'function':
          ar2 = ar1;
          ar1 = 400;
          break;  
      }
    }
    callback(ar1, ar2);
  };

  // 显示组件
  var showFun = function (time, callback) {
    dialog.show().animate({
      opacity: 1
    },{
      // 设置动画时长
      duration: time || 400,
      // 完成动画后执行回调函数
      complete: callback || null,
    });
  };
  dialog.on('show', function(e, time, callback) {
    checkArguments(time, callback, showFun);
  });

  // 隐藏组件
  var hideFun = function (time, callback) {
    dialog.animate({
      opacity: 0
    }, {
      duration: time || 400,
      complete: function() {
        dialog.hide();
        callback && callback();
      }
    });
  };
  dialog.on('hide', function(e, time, callback) {
    checkArguments(time, callback, hideFun);
  });


  // 返回创建的弹出框组件
  return dialog;

};




Dialog.prototype = {
  
  // 加载提示框
  loading: function () {
    var loading = $('<div class="loading">');
    loading.css( {zIndex: 0} );
    loading.html(
      '<div class="circle"></div>'+
      '<div class="circle"></div>'+
      '<div class="circle"></div>'+
      '<div class="circle"></div>'
    );
    return loading;
  },
  
  // 信息提示框
  info: function () {
    var dialog_info = $('<div class="dialog_info">');
    var dialog_header = null;
    // 如果弹出框头部有图片设置
    if (this.config.headerIcon || this.config.headerFontIcon) {
      dialog_header = $('<div class="dialog_header">');
      // 设置头部默认的padding
      dialog_header.css({
        paddingTop: '10px',
        textAlign: 'center'
      });
      var icon = this.config.headerIcon ? 
                 $('<img src="'+this.config.headerIcon+'" alt="headerIcon">') :
                 $('<span>'+this.config.headerFontIcon+'</span>') ;
      dialog_header.append( icon );       
    }
    // 弹出框文字信息
    var dialog_content = $('<div class="dialog_content">');
    var message = this.config.text || '请在此处加入提示信息';
    var dialog_p = $('<p>'+message+'</p>');
    if ( this.config.textCss != 'undefined' ) {
      dialog_p.css( this.config.textCss );
    }
    dialog_content.append( dialog_p );
    dialog_info.append( dialog_header ).append( dialog_content );
    return dialog_info;
  },

  // 交互弹框
  interactive: function () {

  }
};