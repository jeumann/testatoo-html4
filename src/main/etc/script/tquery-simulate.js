/*!
 * jQuery JavaScript Library v1.3.2
 * http://jquery.com/
 *
 * Copyright (c) 2009 John Resig
 * Dual licensed under the MIT and GPL licenses.
 * http://docs.jquery.com/License
 *
 * Date: 2009-02-19 17:34:21 -0500 (Thu, 19 Feb 2009)
 * Revision: 6246
 */
 ;
(function(tQuery)
{
    tQuery.fn.extend({
        simulate: function(type, options) {
            return this.each(function() {
                new tQuery.simulate(this, type, options);
            });
        }
    });

    tQuery.simulate = function(el, type, options) {
        this.target = el;
        this.options = options;

        if (/^type/.test(type)) {
            this.simulateType(el, options);
            return;
        } if (/^click/.test(type)) {
            this.simulateClick(el, options);
            return;
        } if (/^dblclick/.test(type)) {
            this.simulateDblClick(el, options);
            return;
        } if (/^rightclick/.test(type)) {
            this.simulateRightClick(el, options);
            return;
        } if (/^mouse(over|out|up|down)/.test(type)) {
            this.simulateMouseEvent(el,type, options);
            return;
        } if (/^change/.test(type)) {
            this.simulateChange(el, options);
            return;
        }
        if (/^dragTo/.test(type)) {
            this.dragTo(options);
        }
    };

    tQuery.extend(tQuery.simulate.prototype, {
        simulateClick: function(el, options) {
            this.dispatchEvent(el, 'mousedown', this.mouseEvent('mousedown', options));
            this.dispatchEvent(el, 'mouseup', this.mouseEvent('mouseup', options));
            this.dispatchEvent(el, 'click', this.mouseEvent('click', options));

            // Issue reported on http://yuilibrary.com/projects/yui2/ticket/2528826
            if (tQuery.browser.msie) {
                if (tQuery(el).attr('type') == 'checkbox') {
                    tQuery(el).attr('checked', !tQuery(el).attr('checked'));
                }
                if(tQuery(el).attr('type') == 'radio') {
                    tQuery(el).attr('checked', true);
                }
                if(tQuery(el).attr('type') == 'submit' || tQuery(el).attr('type') == 'image') {
                    tQuery(el).closest('form')[0].submit();
                }
                if(tQuery(el).attr('type') == 'reset') {
                    tQuery(el).closest('form')[0].reset();
                }
            }
        },

        simulateDblClick: function(el, options) {
            if (tQuery.browser.msie) {
                this.dispatchEvent(el, 'mousedown', this.mouseEvent('mousedown', options));
                this.dispatchEvent(el, 'mouseup', this.mouseEvent('mouseup', options));
                this.dispatchEvent(el, 'click', this.mouseEvent('click', options));
                this.dispatchEvent(el, 'mouseup', this.mouseEvent('mouseup', options));
                this.dispatchEvent(el, 'dblclick', this.mouseEvent('dblclick', options));
            } else {
                this.dispatchEvent(el, 'mousedown', this.mouseEvent('mousedown', options));
                this.dispatchEvent(el, 'mouseup', this.mouseEvent('mouseup', options));
                this.dispatchEvent(el, 'click', this.mouseEvent('click', options));
                this.dispatchEvent(el, 'mousedown', this.mouseEvent('mousedown', options));
                this.dispatchEvent(el, 'mouseup', this.mouseEvent('mouseup', options));
                this.dispatchEvent(el, 'click', this.mouseEvent('click', options));
                this.dispatchEvent(el, 'dblclick', this.mouseEvent('dblclick', options));
            }
        },

        simulateRightClick: function(el, options) {
            this.dispatchEvent(el, 'mousedown', this.mouseEvent('mousedown', options));
            this.dispatchEvent(el, 'mouseup', this.mouseEvent('mouseup', options));
            this.dispatchEvent(el, 'contextmenu', this.mouseEvent('contextmenu', options));
        },

        simulateMouseEvent: function(el, type, options) {
            this.dispatchEvent(el, type, this.mouseEvent(type, options));
        },

        mouseEvent: function(type, options) {
            var evt;
            var e = tQuery.extend({
                bubbles: true, cancelable: (type != "mousemove"), view: window, detail: 0,
                screenX: 0, screenY: 0, clientX: 0, clientY: 0,
                ctrlKey: false, altKey: false, shiftKey: false, metaKey: false,
                button: 0, relatedTarget: undefined
            }, options);

            var relatedTarget = tQuery(e.relatedTarget)[0];

            if (tQuery.isFunction(document.createEvent)) {
                evt = document.createEvent("MouseEvents");
                evt.initMouseEvent(type, e.bubbles, e.cancelable, e.view, e.detail,
                        e.screenX, e.screenY, e.clientX, e.clientY,
                        e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                        e.button, e.relatedTarget || document.body.parentNode);
            } else if (document.createEventObject) {
                evt = document.createEventObject();
                tQuery.extend(evt, e);
                evt.button = { 0:1, 1:4, 2:2 }[evt.button] || evt.button;
            }
            return evt;
        },

        simulateType: function(el, options) {
            this.dispatchEvent(el, 'keydown', this.keyboardEvent('keydown', options));
            this.dispatchEvent(el, 'keypress', this.keyboardEvent('keypress', options));
            if (tQuery.browser.webkit) {
                this.dispatchEvent(el, 'textInput', this.keyboardEvent('textInput', options));
            }
            this.dispatchEvent(el, 'keyup', this.keyboardEvent('keyup', options));
        },

        keyboardEvent: function(type, options) {
    		var evt;
	    	var e = tQuery.extend({bubbles: true, cancelable: true, view: window,
		    	ctrlKey: false, altKey: false, shiftKey: false, metaKey: false,
			    keyCode: 0, charCode: 0
		    }, options);

            if(/^textInput/.test(type)) {
                evt = document.createEvent('TextEvent');
                evt.initTextEvent(type, true, true, null, String.fromCharCode(options['charCode']));
                return evt;
            }

		    if (tQuery.isFunction(document.createEvent)) {
			    try {
				    evt = document.createEvent("KeyEvents");
				    evt.initKeyEvent(type, e.bubbles, e.cancelable, e.view,
					    e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
					    e.keyCode, e.charCode);
			    } catch(err) {
                    try {
				        evt = document.createEvent("Events");
                    } catch(err) {
                        evt = document.createEvent("UIEvents");
                    }
				    evt.initEvent(type, e.bubbles, e.cancelable);
				    tQuery.extend(evt, {view: e.view,
					    ctrlKey: e.ctrlKey, altKey: e.altKey, shiftKey: e.shiftKey, metaKey: e.metaKey,
					    keyCode: e.keyCode, charCode: e.charCode
				    });
			    }
		    } else if (document.createEventObject) {
			    evt = document.createEventObject();
			    tQuery.extend(evt, e);
		    }
		    if (tQuery.browser.msie || tQuery.browser.opera) {
			    evt.keyCode = (e.charCode > 0) ? e.charCode : e.keyCode;
			    evt.charCode = undefined;
		    }
		    return evt;
	    },

        simulateChange: function(el, options) {
            var evt;
            if (tQuery.isFunction(document.createEvent)) {
                evt = document.createEvent("HTMLEvents");
                evt.initEvent('change', true, true );
            } else {
                evt = document.createEventObject();
            }
            this.dispatchEvent(el, 'change', evt);
        },

        dispatchEvent: function(el, type, evt) {
            if (el.dispatchEvent) {
                el.dispatchEvent(evt);
            } else if (el.fireEvent) {
                el.fireEvent('on' + type, evt);
            }
            return evt;
        },

        dragTo: function(options) {
            var fromCenter = this.findCenter(this.target);
            var toCenter = this.findCenter(options['target']);

            var x = Math.floor(fromCenter.x);
            var y = Math.floor(fromCenter.y);

            var xDest = Math.floor(toCenter.x);
            var yDest = Math.floor(toCenter.y);

            var stepX = (xDest - x) / 10;
         	var stepY = (yDest - y) / 10;
            stepX = (stepX == 0) ? 1 : stepX;
            stepY = (stepY == 0) ? 1 : stepY;

            var coord = { clientX: x, clientY: y };
            this.simulateMouseEvent(this.target, "mousedown", coord);

            while ((Math.abs(xDest - x) > Math.abs(stepX)) || (Math.abs(yDest - y) > Math.abs(stepY)) ) {
   			    if (Math.abs(xDest - x) > Math.abs(stepX)) {
   				    x += stepX;
   			    }
   			    if (Math.abs(yDest - y) > Math.abs(stepY)) {
   				    y += stepY;
   			    }
                coord = { clientX: x, clientY: y };
  		        this.simulateMouseEvent(this.target, "mousemove", x, y);
   		    }

            this.simulateMouseEvent(this.target, "mousemove", coord);
            this.simulateMouseEvent(this.target, "mouseup", coord);
            this.simulateMouseEvent(options['target'], "mouseup", coord);
        },

        findCenter: function(el) {
            var el = tQuery(el), o = el.offset();
            return {
                x: o.left + el.outerWidth() / 2,
                y: o.top + el.outerHeight() / 2
            };
        }
    });

})(tQuery);
