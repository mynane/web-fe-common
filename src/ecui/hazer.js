(function() {
    var core = ecui,
        dom = core.dom,
        ui = core.ui,
        util = core.util,
        ieVersion = /(msie (\d+\.\d)|IEMobile\/(\d+\.\d))/i.test(navigator.userAgent) ? document.documentMode || +(RegExp.$2 || RegExp.$3) : undefined;
    /**
     * 设置 Element 对象的属性值。
     * 在 IE 下，Element 对象的属性可以通过名称直接访问，效率是 setAttribute 方式的两倍。
     * @public
     *
     * @param {HTMLElement} el Element 对象
     * @param {object} obj 对像集合
     * @return {string} 属性值
     */
    function setAttribute(el, obj) {
        if (ieVersion < 8) {
            for (var a in obj) {
                el[a] = obj[a];
            }
        } else {
            for (var a in obj) {
                el.setAttribute(a, obj[a]);
            }
        }
    };

    function getAttribute(el, name) {
        if (ieVersion < 8) {
            return el[name];
        } else {
            return el.getAttribute(name);
        }
    }

    function moveEnd(obj, num) {
        var num = num ? num : 0;
        if (document.selection) {
            var sel = obj.createTextRange();
            sel.moveStart('character', num);
            sel.collapse();
            sel.select();
        } else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
            obj.selectionStart = obj.selectionEnd = num;
        }
    }

    function stopDefault(e) {

        //阻止默认浏览器动作(W3C) 

        if (e && e.preventDefault)

            e.preventDefault();

        //IE中阻止函数器默认动作的方式 

        else

            window.event.returnValue = false;

        return false;

    }
    ui.Placeholder = core.inherits(
        ui.Control,
        'ui-placehoder',
        function(el, options) {
            var _input = el;
            ui.Control.constructor.call(this, el, options);
            var placeholder = getAttribute(_input, 'placeholder');
            placeholder = placeholder ? placeholder : options.def ? options.def : '请输入内容';

            if (ieVersion < 10) {
                setAttribute(el, {
                    value: placeholder,
                    style: "color:#9D9E9F"
                });
            } else {
                setAttribute(el, {
                    placeholder: placeholder
                });

            }
            this._input = _input;
            this.dele = false;
        }, {
            $focus: function(event) {
                ui.Control.prototype.$focus.call(this, event);
                var that = this;
                dom.addEventListener(this._input, 'focus', function(event) {
                    if (this.value === this.defaultValue) {
                        moveEnd(this);
                    }
                    dom.addEventListener(this, 'keydown', function(event) {
                        var event = event || window.event;
                        if (!that.dele && (event.keyCode != 37 && event.keyCode != 38 && event.keyCode != 39 && event.keyCode != 40) || (that.dele && this.value == this.defaultValue && (event.keyCode != 37 && event.keyCode != 38 && event.keyCode != 39 && event.keyCode != 40))) {
                            this.value = '';
                            that.dele = true;
                            setAttribute(this, {
                                style: "color:#000"
                            });
                        } else if (!that.dele && (event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40) || (that.dele && this.value == this.defaultValue)) {
                            setAttribute(this, {
                                style: "color:#9D9E9F"
                            });
                            stopDefault(event);
                        }
                    });
                    dom.addEventListener(this, 'mousedown', function(event) {
                        if (!that.dele) {
                            moveEnd(that);
                        }
                    });
                });
            },

            $blur: function(event) {
                ui.Control.prototype.$blur.call(this, event);
                dom.addEventListener(this._input, 'blur', function(event) {
                    if (this.value === '') {
                        this.dele = false;
                        this.value = this.defaultValue;
                        setAttribute(this, {
                            style: "color:#9D9E9F"
                        });
                    }
                })
            },
        });


}(ecui));


(function() {
    var core = ecui,
        dom = core.dom,
        io = core.io,
        ui = core.ui,
        util = core.util,
        ieVersion = /(msie (\d+\.\d)|IEMobile\/(\d+\.\d))/i.test(navigator.userAgent) ? document.documentMode || +(RegExp.$2 || RegExp.$3) : undefined;
    /**
     * 设置 Element 对象的属性值。
     * 在 IE 下，Element 对象的属性可以通过名称直接访问，效率是 setAttribute 方式的两倍。
     * @public
     *
     * @param {HTMLElement} el Element 对象
     * @param {object} obj 对像集合
     * @return {string} 属性值
     */
    function setAttribute(el, obj) {
        if (ieVersion < 8) {
            for (var a in obj) {
                el[a] = obj[a];
            }
        } else {
            for (var a in obj) {
                el.setAttribute(a, obj[a]);
            }
        }
    };
    /**
     * 获取属性封装
     * @param  {[HTMLElement]} el   目标对象
     * @param  {[string]} name 属性名
     * @return {[string]}      属性值
     */
    function getAttribute(el, name) {
        if (ieVersion < 8) {
            return el[name];
        } else {
            return el.getAttribute(name);
        }
    }
    /**
     *console.log()封装简写
     */
    function c(str) {
        console.log(str);
    }
    /*递归实现获取无级树数据并生成DOM结构*/
    var str = "<ul>";

    function forTree(zNodes) {
        var arr = new Array();
        for (var i in zNodes) {
            arr.push(i);
        }
        for (var i = 0; i < arr.length; i++) {
            if (typeof zNodes[i] == 'object' && zNodes[i].children) {
                if (zNodes[i].open) {
                    str += '<li><i style="background-position:-110px -16px;"></i><span>' + zNodes[i].name + '</span><ul style="display:block">';
                } else {
                    str += '<li><i></i><span>' + zNodes[i].name + '</span><ul>';
                }
                arguments.callee(zNodes[i].children);
                str += "</ul>";
            } else if (typeof zNodes[i] == 'object' && !zNodes[i].children && zNodes[i].isParent) {
                str += '<li><i></i><span>' + zNodes[i].name + '</span></li>';
            } else {
                str += '<li><i style="background-position:-110px -32px;"></i><span>' + zNodes[i].name + '</span></li>';
            }
        }
        return str;
    }

    /**
     * [fold description] 判断树是否展开
     * @param  {[type]} event click对象
     * @return {[type]}       
     */
    function fold(event) {
        var _target = event.target;
        var _prev = dom.previous(_target);
        var _next = dom.next(_target);
        if (_next && _next.nodeName.toLowerCase() === 'ul') {
            if (dom.getStyle(_next, 'display') == 'block') {
                _next.style.display = 'none';
                _prev.style.backgroundPosition = "-110px 0";
            } else {
                _next.style.display = 'block';
                _prev.style.backgroundPosition = "-110px -16px";
            }
        }
    }

    ui.JsonTree = core.inherits(
        ui.Control,
        'ui-json',
        function(el, options) {
            ui.Control.constructor.call(this, el, options);
            var that = this;
            var src = options.json;
            io.loadScript('hazer/json.js', function() {
                el.innerHTML = forTree(eval(src));
            });

            // setAttribute(el,{style:"height:20px;border:1px solid #333;width:30px;"});
            this._jTree = el;
        }, {
            $click: function(event) {
                ui.Control.prototype.$click.call(this, event);
                fold(event);

            }
        });

}(ecui));

(function() {
    var core = ecui,
        dom = core.dom,
        io = core.io,
        ui = core.ui,
        util = core.util,
        ieVersion = /(msie (\d+\.\d)|IEMobile\/(\d+\.\d))/i.test(navigator.userAgent) ? document.documentMode || +(RegExp.$2 || RegExp.$3) : undefined;

    var prve = null;
    /**
     * 设置 Element 对象的属性值。
     * 在 IE 下，Element 对象的属性可以通过名称直接访问，效率是 setAttribute 方式的两倍。
     * @public
     *
     * @param {HTMLElement} el Element 对象
     * @param {object} obj 对像集合
     * @return {string} 属性值
     */
    function setAttribute(el, obj) {
        if (ieVersion < 8) {
            for (var a in obj) {
                el[a] = obj[a];
            }
        } else {
            for (var a in obj) {
                el.setAttribute(a, obj[a]);
            }
        }
    };
    /**
     * 获取属性封装
     * @param  {[HTMLElement]} el   目标对象
     * @param  {[string]} name 属性名
     * @return {[string]}      属性值
     */
    function getAttribute(el, name) {
        if (ieVersion < 8) {
            return el[name];
        } else {
            return el.getAttribute(name);
        }
    }
    /**
     *console.log()封装简写
     */
    function c(str) {
        console.log(str);
    }
    /**
     * 初始化分页
     */

    function createHtml() {
        var str = '<a href="javascript:void(0);" class="page_left">&lt;上一页</a>';
        str += '<ul id="list_container">';
        str += '</ul>';
        str += '<a href="javascript:void(0);" class="page_right">上一页&gt;</a>';
        return str;
    }

    function createLi(page, start, current) {
        var _ul = ecui.$('list_container');
        var _li = null;
        var _a = null;
        var start = start ? start : 1;
        var current = current ? current : 0;
        for (var i = start; i < page + start; i++) {
            _li = dom.create('', 'li');
            _a = dom.create('', 'a');
            if (i == (start + current)) {
                _a.className = "active";
                prve = _a;
            }
            _a.innerHTML = i;
            _li.appendChild(_a);
            _ul.appendChild(_li);

        }
    }
    /**
     * 获取到元素所有的兄弟节点
     * @param  {[HTMLElement]} elem 目标节点
     * @return {[array]}       返回兄弟节点的集合。
     */
    function sibling(elem) {
        var r = [];
        var n = elem.parentNode.firstChild;
        for (; n; n = n.nextSibling) {
            if (n.nodeType === 1 && n !== elem) {
                r.push(n);
            }
        }
    }

    function clickH(num, current, page, pages) {
        var num = parseInt(num),
            current = parseInt(current),
            page = parseInt(page),
            pages = parseInt(pages);
        if (num <= current) {
            prve && dom.hasClass(prve, 'active') && dom.removeClass(prve, 'active');
            ecui.$('list_container').innerHTML = '';
            createLi(page, 1, parseInt(num - 1));
        } else if (pages-num<current) {
            prve && dom.hasClass(prve, 'active') && dom.removeClass(prve, 'active');
            ecui.$('list_container').innerHTML = '';c(num);
            createLi(page, pages-page+1, current);
        } else {
            prve && dom.hasClass(prve, 'active') && dom.removeClass(prve, 'active');
            ecui.$('list_container').innerHTML = '';
            createLi(page, num - current, current);
        }
    }
    ui.Paging = core.inherits(
        ui.Control,
        'ui-paging',
        function(el, options) {
            ui.Control.constructor.call(this, el, options);
            var pages = parseInt(options.pages);
            var page1 = parseInt(options.page);
            page1 = page1 ? page1 : 10;
            var start = 1;
            var page = page1 < pages ? page1 : pages;
            var current = page % 2 == 0 ? (page / 2) : Math.ceil(page / 2);


            el.innerHTML = createHtml();
            createLi(page);



            this.current = current;
            this._paging = el;
            this.pages = pages;
            this.page = page;
        }, {
            $click: function(event) {
                ui.Control.prototype.$click.call(this, event);
                var pading = this._paging,
                    firstChild = dom.first(pading),
                    lastChild = dom.last(pading),
                    page = this.page,
                    pages = this.pages,
                    current = this.current;
                pading.onclick = function(event) {
                    var event = event || window.event;
                    var target = event.target;
                    var num = target.innerHTML;
                    if (target.nodeName.toLowerCase() == 'a' && target.parentNode.nodeName.toLowerCase() == 'li') {
                        clickH(num, current, page, pages);

                        dom.setStyle(lastChild, 'visibility', '');
                        dom.setStyle(firstChild, 'visibility', '');
                        if (target.innerHTML == '1') {
                            dom.setStyle(firstChild, 'visibility', 'hidden');

                        } else if (target.innerHTML == pages) {
                            dom.setStyle(lastChild, 'visibility', 'hidden');

                        }
                    } else if (target.nodeName.toLowerCase() == 'a' && target.parentNode.nodeName.toLowerCase() == 'div') {
                        var parentN = prve.parentNode,
                            aNext = dom.next(parentN),
                            aprev = dom.previous(parentN),
                            innerH = parseInt(prve.innerHTML);
                        dom.setStyle(lastChild, 'visibility', '');
                        dom.setStyle(firstChild, 'visibility', '');

                        if (dom.hasClass(target, 'page_right') && innerH < pages) {
                            innerH++;
                            clickH(innerH, current, page, pages);
                            if (innerH == pages) dom.setStyle(lastChild, 'visibility', 'hidden');

                        } else if (dom.hasClass(target, 'page_left') && innerH > 1) {
                            innerH--;
                            clickH(innerH, current, page, pages);
                            if (innerH == 1) dom.setStyle(firstChild, 'visibility', 'hidden');
                        }


                    }
                }

            }
        });

}(ecui));