/**
 * Created by yqz on 2016/2/24.
 * number spinner
 */

;
(function ($) {

    var _default = {
        value: 1,
        max: null,
        min: 1
    }

    $.fn.numberSpinner = function (_op) {
        var $el = this,
            $plus = $el.find('.plus'),
            $minus = $el.find('.minus'),
            $input = $el.find('input');

        if (!$el.data('numberSpinner')) {
            var obj = {};
            $el.data('numberSpinner', obj);
        }
        else {
            obj = $el.data('numberSpinner');
        }

        var funcs = {
            init: function () {
                var self = this;
                var op = $.extend({}, _default, _op);
                this.op = op;
                obj.value = op.value;
                this.setValue(obj.value);

                $plus.on('click', function (e) {
                    if ($plus.hasClass('disabled') || !_checkTime())return;
                    self.setValue(obj.value + 1);
                    _checkMinus();
                    _checkPlus();
                });

                $minus.on('click', function () {
                    if ($minus.hasClass('disabled') || !_checkTime())return;
                    self.setValue(obj.value - 1);
                    _checkMinus();
                    _checkPlus();
                });

                $input.on('blur', function () {
                    if (isNaN(parseInt($input.val()))) {
                        self.setValue(parseInt(op.value));
                    }
                    else if (op.max && $input.val() >= op.max) {
                        self.setValue(parseInt(op.max));
                    }
                    else if (op.min && $input.val() <= op.min) {
                        self.setValue(parseInt(op.min));
                    }
                    else {
                        self.setValue(parseInt($input.val()));
                    }
                    _checkPlus();
                    _checkMinus();
                })

                $input.on('input', function () {
                    _checkValue();
                    _checkPlus();
                    _checkMinus();
                });

                //fix ie7 setValue causing stack overflow bug
                if (!('oninput' in $input.get(0))) {
                    var _preVal = $input.val();
                    (function _ie_bind() {
                        //$input.on('propertychange.ie', function () {
                        //    //$input.off('propertychange.ie');
                        //    //_checkValue();
                        //    //_checkPlus();
                        //    //_checkMinus();
                        //    //_ie_bind();
                        //    console.log('trigger');
                        //});

                        setTimeout(function () {
                            if ($input.val() != _preVal) {
                                $input.trigger('input');
                                _preVal = $input.val();
                            }
                            _ie_bind();
                        }, 100);
                    })();
                }

                _checkPlus();
                _checkMinus();

                function _checkValue() {
                    if (isNaN(parseInt($input.val()))) {
                        self.setValue(parseInt(op.value));
                    }
                    else if (op.max && $input.val() >= op.max) {
                        self.setValue(parseInt(op.max));
                    }
                    else if (op.min && $input.val() <= op.min) {
                        self.setValue(parseInt(op.min));
                    }
                    else {
                        self.setValue(parseInt($input.val()));
                    }
                }

                function _checkPlus() {
                    if (op.max && obj.value >= op.max) {
                        $plus.addClass('disabled');
                        return;
                    }
                    else {
                        $plus.removeClass('disabled');
                    }
                    return true;
                }

                function _checkMinus() {
                    if (obj.value <= op.min) {
                        $minus.addClass('disabled');
                        return;
                    }
                    else {
                        $minus.removeClass('disabled');
                    }
                    return true;
                }

                var lastTimeSpan = new Date().getTime();

                function _checkTime() {
                    var now = new Date().getTime();
                    if (now - lastTimeSpan > 100) {
                        lastTimeSpan = now;
                        return true;
                    }
                    return;
                }
            },
            setValue: function (val) {
                obj.value = val;
                $input.val(val);
                this.op.onChange && this.op.onChange(val);
            }
        }


        if (typeof _op === 'object' || _op === undefined) {
            funcs.init();
        }
    }

})(jQuery);
