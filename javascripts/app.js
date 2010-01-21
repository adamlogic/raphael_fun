$(function() {

  var canvas = $('#canvas'), rect;
  paper = Raphael(canvas[0], canvas.width(), canvas.height());

  canvas.mousedown(function(e) {
    var x = e.pageX - canvas.offset().left;
    var y = e.pageY - canvas.offset().top;
    rect = paper.rect(x, y, 1, 1);
    rect.attr({fill: '#f00', 'stroke-width': 0});

    $('body').mousemove(function(e) {
      var width = e.pageX - rect.jq().offset().left;
      var height = e.pageY - rect.jq().offset().top;
      rect.attr({width: width, height: height});
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

Raphael.el.draggable = function() {
  var dragging, offsetX, offsetY;

  this.jq().mousedown(function(e) {
    dragging = $(this);
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
    dragging.raphael().attr({x: x, y: y});
  }
};

$.fn.extend({
  raphael: function() { return this.data('raphael') }
});
