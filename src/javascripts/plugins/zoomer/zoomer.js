/**
 * Created by qizhang.yang on 2016/2/23.
 * image zoomer
 */

;
(function ($) {

    var _default = {
        imgSelector: '.image',
        scale: 2,
        sourceTag: 'data-src',
        pointerBG: 'zoomer-bg'
    };

    var Zoomer = function($el, _op) {
        var self = this;

        if (window.getComputedStyle) {
            var _position = window.getComputedStyle($el.get(0)).position;
        }
        else {
            _position = $el.get(0).currentStyle.position;
        }
        if (_position == 'static') {
            $el.css('position', 'relative');
        }

        self.$el = $el;

        self.op = $.extend({}, _default, $el.data(), _op);

        //img box
        self.$box = $('<div class="zoomer-img"></div>');
        self.$box.appendTo($el);

        //img dom
        self.$img = $('<img />');
        self.$img.appendTo(self.$box);

        //imgSrc
        var imgSrc = self.$el.attr(self.op.sourceTag);
        //pointer
        self.$pointerBlock = $('<div class="zoomer-pointer"></div>').addClass(self.op.pointerBG);
        //zoom box
        self.$zoomerBox = $('<div class="zoomer-box"><img ></div>');
        self.$zoomerImg = self.$zoomerBox.find('img');
        self.$el
            .addClass('zoomer')
            .append(self.$zoomerBox);
        self.$box.append(self.$pointerBlock);

        //current Image
        this.currentSrc = imgSrc;

        this.update(imgSrc);

    }


    /**
     * update image source
     * @param imgSrc
     */
    Zoomer.prototype.update = function (imgSrc) {
        var self = this, $el = self.$el, $box = self.$box, $img = self.$img, $pointerBlock = self.$pointerBlock, $zoomerBox = self.$zoomerBox, $zoomerImg = self.$zoomerImg;

        self.currentSrc = imgSrc;
        //dom size
        var dom_h = $el.height();
        var dom_w = $el.width();
        //pointer size
        var p_size = dom_h / self.op.scale;
        //start position
        var start_point, start_page_point;

        $box.trigger('mouseleave.zoomer');

        $box
            .off('mouseenter.zoomer')
            .off('mousemove.zoomer')
            .off('mouseleave.zoomer');


        var tempImg = new Image();
        $(tempImg).on('load', function (e) {
            //if not this image
            if(self.currentSrc != imgSrc)return;

            $box.show();
            var real_h = this.naturalHeight || this.height;
            var real_w = this.naturalWidth || this.width;

            if (real_h / real_w >= dom_h / dom_w) {
                var h = dom_h;
                var w = dom_h / real_h * real_w;
            }
            else {
                w = dom_w;
                h = dom_w / real_w * real_h;
                $box.css({marginTop: (dom_h - h) / 2});
            }

            $box.css({height: h, width: w});
            $img.attr('src', imgSrc);

            if (w > h) {
                p_size = h / self.op.scale;
                var imgScale = self.op.scale * w / h;
            }
            else {
                p_size = w / self.op.scale;
                imgScale = self.op.scale * h / w;
            }

            $pointerBlock.css({
                height: p_size,
                width: p_size
            });

            $zoomerBox.css({
                height: dom_h,
                width: dom_w,
                right: -dom_w - 10
            });


            $zoomerImg.css({
                height: h * imgScale,
                width: w * imgScale
            });

            bindEvent();

            function bindEvent() {
                $box
                    .on('mouseenter.zoomer', _mouserIn)
                    .on('mousemove.zoomer', _mouseMove)
                    .on('mouseleave.zoomer', _mouseLeave);
            }

            function _mouserIn(e) {
                var offset_x = e.offsetX;
                var offset_y = e.offsetY;
                $pointerBlock
                    .css({
                        left: offset_x + p_size > w ? (offset_x - p_size) : offset_x,
                        top: offset_y + p_size > h ? (offset_y - p_size) : offset_y
                    })
                    .show();

                $zoomerBox.show().find('img').attr('src', imgSrc);

                start_point = {
                    x: offset_x,
                    y: offset_y
                }

                start_page_point = {
                    x: e.pageX,
                    y: e.pageY
                }
            }

            function _mouseMove(e) {
                if (!start_point || !start_page_point)return;

                var offset_x = start_point.x + e.pageX - start_page_point.x;
                var offset_y = start_point.y + e.pageY - start_page_point.y;

                if (offset_x <= p_size / 2) {
                    offset_x = 0;
                }
                else if (offset_x >= w - p_size / 2) {
                    offset_x = w - p_size;
                }
                else {
                    offset_x = offset_x - p_size / 2;
                }

                if (offset_y <= p_size / 2) {
                    offset_y = 0;
                }
                else if (offset_y >= h - p_size / 2) {
                    offset_y = h - p_size;
                }
                else {
                    offset_y = offset_y - p_size / 2;
                }


                $pointerBlock.css({
                    left: offset_x,
                    top: offset_y
                });

                $zoomerImg.css({
                    left: -offset_x * imgScale,
                    top: -offset_y * imgScale
                });
            }

            function _mouseLeave(e) {
                $pointerBlock.hide();
                $zoomerBox.hide();
                start_page_point = null;
                start_point = null;
            }
        });

        tempImg.src = imgSrc;
    }


    /**
     * destroy
     */
    Zoomer.prototype.destroy = function(){
        this.$box
            .off('mouseenter.zoomer')
            .off('mousemove.zoomer')
            .off('mouseleave.zoomer');
        this.$el.empty();
        this.$el.removeData('zoomer');
    }


    function plugin(options) {
        var args = Array.prototype.slice.call(arguments, 1);
        this.each(function () {
            var $this = $(this);
            if (typeof options == 'object' || typeof options == 'undefined') {
                $this.data('zoomer', new Zoomer($this, options));
            }
            else if (typeof options == 'string') {
                var obj = $this.data('zoomer');
                if (!obj) {
                    console.error('zoomer has not initialed');
                    return;
                }
                obj[options].apply(obj, args);
            }
        });
        return this;
    }

    $.fn.zoomer = plugin;
    $.fn.zoomer.Constructor = Zoomer;

})(jQuery);
