// dialog 组件
var Dialog = function( obj ) {
  this.obj = obj;
  // 默认参数设置
  var isMask = this.obj.mask || true;
  this.obj.align = obj.align || 'vetically';
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
    var _width = obj.width ? obj.width : 70;
    var _height = obj.height ? obj.height : 70;
    dialog_body.width( _width );
    dialog_body.height( _height );
  };
  switch ( this.obj.type ) {
    case 'loading':
      loading_run();
      dialog_body.append( this.loading() );
      break;
    case 'info':
      obj.width && dialog_body.width( obj.width );
      obj.height && dialog_body.height( obj.height );
      dialog_body.append( this.info() ); 
      break;
    default:
      loading_run();
      dialog_body.append( this.loading() );
  }
 
  // 样式设置
  if ( obj && obj.css ) {
    dialog_body.css( obj.css );
  }

  // 边框圆角设置
  var radius = dialog_body.width() >= 300 ? 10 : 5;
  dialog_body.css({borderRadius: radius+'px'});

  // 对齐方式设置
  if (this.obj.align) {
    switch (this.obj.align) {
      case 'vetically':
        dialog_body.css({
          top: '50%',
          left: '50%',
        });
        // 根据是否指定弹出框宽度来设置左右偏移
        if ( this.obj.width && this.obj.height ) {
          dialog_body.css({
            marginLeft: - this.obj.width/2,
            marginTop: - this.obj.height/2,
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

  dialog.append(dialog_mask).append(dialog_body);
  // 返回创建的弹出框组件
  return dialog;

};

Dialog.prototype = {
  
  // 加载提示框
  loading: function() {
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
  info: function( info ) {
    var dialog_content = $('<div class="dialog_content">');
    var message = info || this.obj.text || '请在此处加入提示信息';
    var dialog_p = $('<p>'+ message +'</p>');
    if ( this.obj.textCss != 'undefined' ) {
      dialog_p.css( this.obj.textCss );
    }
    dialog_content.append( dialog_p );
    return dialog_content;
  },

};