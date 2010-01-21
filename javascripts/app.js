$(function() {

  var canvas = $('#canvas'), rect;
  paper = Raphael(canvas[0], canvas.width(), canvas.height());

  canvas.mousedown(function(e) {
    var x = e.pageX - canvas.offset().left;
    var y = e.pageY - canvas.offset().top;
    rect = paper.rect(x, y, 1, 1);
    rect.attr({fill: '#f00', 'stroke-width': 0});

    $('body').mousemove(function(e) {
      var width = e.pageX - rect.offset().left;
      var height = e.pageY - rect.offset().top;
      rect.attr({ width:  Math.max(0, width), 
                  height: Math.max(0, height) });
    });
  }).mouseup(function(e) {
    $('body').unbind('mousemove');
    rect.draggable();
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
