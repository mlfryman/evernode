 'use strict';

 $(window).bind('load', function(){
    var footer = $('#footer'),
        pos = footer.position(),
        height = $(window).height();
    height = height - pos.top;
    height = height - footer.height();
    if (height > 0) {
      footer.css({
        'margin-top': height + 'px'
      });
    }
});
