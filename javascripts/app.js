$(function() {

  var canvas = $('#canvas'), x, y, rect, clipWrapper, clip;
  paper = Raphael(canvas[0], canvas.width(), canvas.height());

  canvas.mousedown(function(e) {
    x = e.pageX - canvas.offset().left;
    y = e.pageY - canvas.offset().top;
    rect = paper.image('http://www.google.com/intl/en_ALL/images/logo.gif', x, y, 1, 1);

    rect.attr({'clip-rect': '0 0 0 0'});
    clipWrapper = $(rect.jq().attr('clip-path').match(/\((.*)\)/)[1]);
    clipWrapper.find('rect').remove();
    clip = paper.ellipse(x, y, 0, 0);
    clipWrapper.append(clip);

    $('body').mousemove(function(e) {
      var width = e.pageX - rect.offset().left,
          height = e.pageY - rect.offset().top,
          width = Math.max(0, width),
          height = Math.max(0, height);
      rect.attr({ width: width, height: height });
      clip.attr({ cx: x + width/2, cy: y + height/2, rx: width/2, ry: height/2 });
    }).one('mouseup', function(e) {
      $('body').unbind('mousemove');
      rect.draggable();
    });
  });

  $('#images').hover(function() {
    $(this).animate({width: '600px'});
  }, function() {
    $(this).animate({width: '200px'});
  });

  $.getJSON("http://api.flickr.com/services/feeds/photoset.gne?set=72157623197061266&nsid=86613980@N00&lang=en-us&format=json&jsoncallback=?", function(data){
    $.each(data.items, function(i,item){
      $("<img/>").attr("src", item.media.m).appendTo("#images .container")
        .wrap("<a href='#'></a>");
    });
  });

  $('#images a').live('click', function() {
    var img = $(this).find('img'),
        src = img.attr('src').replace(/m\.jpg/, 'b.jpg'),
        aspect = img.width() / img.height(),
        image = paper.image(src, 20, 20, 400, 400 / aspect);

    image.draggable();
    return false;
  });

});

Raphael.el.jq = function() { 
  var el = $(this.node);
  if (!el.data('raphael')) el.data('raphael', this);
  return el;
};

Raphael.el.offset = function() {
  var paperOffset = $('#canvas').offset();
  return { left: paperOffset.left + this.attr('x'),
           top: paperOffset.top + this.attr('y') }
};

Raphael.el.draggable = function() {
  var dragging, offsetX, offsetY;

  this.jq().mousedown(function(e) {
    dragging = $(this).raph();
    offsetX = e.pageX - dragging.offset().left;
    offsetY = e.pageY - dragging.offset().top;
    $('body').mousemove(drag);
    return false;
  }).mouseup(function(e) {
    dragging = null;
    $('body').unbind('mousemove');
    return false;
  });

  function drag(e) {
    var x = e.pageX - offsetX - $('#canvas').offset().left;
    var y = e.pageY - offsetY - $('#canvas').offset().top;
    dragging.attr({x: x, y: y});
  }
};

$.fn.extend({
  raph: function() { return this.data('raphael') }
});
