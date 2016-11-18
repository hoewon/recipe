!function(element, proceed) {
  if ("object" == typeof module && "object" == typeof module.exports) {
    module.exports = element.document ? proceed(element, true) : function(element) {
      if (!element.document) {
        throw new Error("jQuery requires a window with a document");
      }
      return proceed(element);
    };
  } else {
    proceed(element);
  }
}("undefined" != typeof window ? window : this, function(win, dataAndEvents) {
  /**
   * @param {?} obj
   * @return {?}
   */
  function isArraylike(obj) {
    var length = !!obj && ("length" in obj && obj.length);
    var type = jQuery.type(obj);
    return "function" === type || jQuery.isWindow(obj) ? false : "array" === type || (0 === length || "number" == typeof length && (length > 0 && length - 1 in obj));
  }
  /**
   * @param {?} elements
   * @param {?} qualifier
   * @param {boolean} not
   * @return {?}
   */
  function winnow(elements, qualifier, not) {
    if (jQuery.isFunction(qualifier)) {
      return jQuery.grep(elements, function(elem, i) {
        return!!qualifier.call(elem, i, elem) !== not;
      });
    }
    if (qualifier.nodeType) {
      return jQuery.grep(elements, function(elem) {
        return elem === qualifier !== not;
      });
    }
    if ("string" == typeof qualifier) {
      if (isSimple.test(qualifier)) {
        return jQuery.filter(qualifier, elements, not);
      }
      qualifier = jQuery.filter(qualifier, elements);
    }
    return jQuery.grep(elements, function(arg) {
      return jQuery.inArray(arg, qualifier) > -1 !== not;
    });
  }
  /**
   * @param {Object} cur
   * @param {string} dir
   * @return {?}
   */
  function _singleSibling(cur, dir) {
    do {
      cur = cur[dir];
    } while (cur && 1 !== cur.nodeType);
    return cur;
  }
  /**
   * @param {string} options
   * @return {?}
   */
  function createOptions(options) {
    var buf = {};
    return jQuery.each(options.match(core_rnotwhite) || [], function(dataAndEvents, off) {
      /** @type {boolean} */
      buf[off] = true;
    }), buf;
  }
  /**
   * @return {undefined}
   */
  function domReady() {
    if (doc.addEventListener) {
      doc.removeEventListener("DOMContentLoaded", handler);
      win.removeEventListener("load", handler);
    } else {
      doc.detachEvent("onreadystatechange", handler);
      win.detachEvent("onload", handler);
    }
  }
  /**
   * @return {undefined}
   */
  function handler() {
    if (doc.addEventListener || ("load" === win.event.type || "complete" === doc.readyState)) {
      domReady();
      jQuery.ready();
    }
  }
  /**
   * @param {?} qualifier
   * @param {string} key
   * @param {string} data
   * @return {?}
   */
  function dataAttr(qualifier, key, data) {
    if (void 0 === data && 1 === qualifier.nodeType) {
      var elem = "data-" + key.replace(r20, "-$1").toLowerCase();
      if (data = qualifier.getAttribute(elem), "string" == typeof data) {
        try {
          data = "true" === data ? true : "false" === data ? false : "null" === data ? null : +data + "" === data ? +data : rbrace.test(data) ? jQuery.parseJSON(data) : data;
        } catch (r) {
        }
        jQuery.data(qualifier, key, data);
      } else {
        data = void 0;
      }
    }
    return data;
  }
  /**
   * @param {Object} obj
   * @return {?}
   */
  function filter(obj) {
    var name;
    for (name in obj) {
      if (("data" !== name || !jQuery.isEmptyObject(obj[name])) && "toJSON" !== name) {
        return false;
      }
    }
    return true;
  }
  /**
   * @param {Object} elem
   * @param {string} data
   * @param {boolean} def
   * @param {string} dataAndEvents
   * @return {?}
   */
  function get(elem, data, def, dataAndEvents) {
    if (next(elem)) {
      var sortby;
      var item;
      var internalKey = jQuery.expando;
      var isNode = elem.nodeType;
      var cache = isNode ? jQuery.cache : elem;
      var id = isNode ? elem[internalKey] : elem[internalKey] && internalKey;
      if (id && (cache[id] && (dataAndEvents || cache[id].data)) || (void 0 !== def || "string" != typeof data)) {
        return id || (id = isNode ? elem[internalKey] = core_deletedIds.pop() || jQuery.guid++ : internalKey), cache[id] || (cache[id] = isNode ? {} : {
          toJSON : jQuery.noop
        }), "object" != typeof data && "function" != typeof data || (dataAndEvents ? cache[id] = jQuery.extend(cache[id], data) : cache[id].data = jQuery.extend(cache[id].data, data)), item = cache[id], dataAndEvents || (item.data || (item.data = {}), item = item.data), void 0 !== def && (item[jQuery.camelCase(data)] = def), "string" == typeof data ? (sortby = item[data], null == sortby && (sortby = item[jQuery.camelCase(data)])) : sortby = item, sortby;
      }
    }
  }
  /**
   * @param {Object} elem
   * @param {string} name
   * @param {boolean} skipped
   * @return {undefined}
   */
  function cb(elem, name, skipped) {
    if (next(elem)) {
      var cache;
      var i;
      var isNode = elem.nodeType;
      var response = isNode ? jQuery.cache : elem;
      var id = isNode ? elem[jQuery.expando] : jQuery.expando;
      if (response[id]) {
        if (name && (cache = skipped ? response[id] : response[id].data)) {
          if (jQuery.isArray(name)) {
            name = name.concat(jQuery.map(name, jQuery.camelCase));
          } else {
            if (name in cache) {
              /** @type {Array} */
              name = [name];
            } else {
              name = jQuery.camelCase(name);
              name = name in cache ? [name] : name.split(" ");
            }
          }
          i = name.length;
          for (;i--;) {
            delete cache[name[i]];
          }
          if (skipped ? !filter(cache) : !jQuery.isEmptyObject(cache)) {
            return;
          }
        }
        if (skipped || (delete response[id].data, filter(response[id]))) {
          if (isNode) {
            jQuery.cleanData([elem], true);
          } else {
            if (support.deleteExpando || response != response.window) {
              delete response[id];
            } else {
              response[id] = void 0;
            }
          }
        }
      }
    }
  }
  /**
   * @param {Function} qualifier
   * @param {?} prop
   * @param {Object} parts
   * @param {Object} t
   * @return {?}
   */
  function add(qualifier, prop, parts, t) {
    var end;
    /** @type {number} */
    var scale = 1;
    /** @type {number} */
    var a = 20;
    /** @type {function (): ?} */
    var getTarget = t ? function() {
      return t.cur();
    } : function() {
      return jQuery.css(qualifier, prop, "");
    };
    var target = getTarget();
    var unit = parts && parts[3] || (jQuery.cssNumber[prop] ? "" : "px");
    var start = (jQuery.cssNumber[prop] || "px" !== unit && +target) && rfxnum.exec(jQuery.css(qualifier, prop));
    if (start && start[3] !== unit) {
      unit = unit || start[3];
      parts = parts || [];
      /** @type {number} */
      start = +target || 1;
      do {
        /** @type {(number|string)} */
        scale = scale || ".5";
        start /= scale;
        jQuery.style(qualifier, prop, start + unit);
      } while (scale !== (scale = getTarget() / target) && (1 !== scale && --a));
    }
    return parts && (start = +start || (+target || 0), end = parts[1] ? start + (parts[1] + 1) * parts[2] : +parts[2], t && (t.unit = unit, t.start = start, t.end = end)), end;
  }
  /**
   * @param {(Document|DocumentFragment)} doc
   * @return {?}
   */
  function save(doc) {
    /** @type {Array.<string>} */
    var braceStack = uHostName.split("|");
    var ctx = doc.createDocumentFragment();
    if (ctx.createElement) {
      for (;braceStack.length;) {
        ctx.createElement(braceStack.pop());
      }
    }
    return ctx;
  }
  /**
   * @param {Node} context
   * @param {string} tag
   * @return {?}
   */
  function getAll(context, tag) {
    var opt_nodes;
    var node;
    /** @type {number} */
    var i = 0;
    var ret = "undefined" != typeof context.getElementsByTagName ? context.getElementsByTagName(tag || "*") : "undefined" != typeof context.querySelectorAll ? context.querySelectorAll(tag || "*") : void 0;
    if (!ret) {
      /** @type {Array} */
      ret = [];
      opt_nodes = context.childNodes || context;
      for (;null != (node = opt_nodes[i]);i++) {
        if (!tag || jQuery.nodeName(node, tag)) {
          ret.push(node);
        } else {
          jQuery.merge(ret, getAll(node, tag));
        }
      }
    }
    return void 0 === tag || tag && jQuery.nodeName(context, tag) ? jQuery.merge([context], ret) : ret;
  }
  /**
   * @param {(Array|NodeList)} elems
   * @param {Array} refElements
   * @return {undefined}
   */
  function setGlobalEval(elems, refElements) {
    var node;
    /** @type {number} */
    var i = 0;
    for (;null != (node = elems[i]);i++) {
      jQuery._data(node, "globalEval", !refElements || jQuery._data(refElements[i], "globalEval"));
    }
  }
  /**
   * @param {Element} elem
   * @return {undefined}
   */
  function callback(elem) {
    if (manipulation_rcheckableType.test(elem.type)) {
      elem.defaultChecked = elem.checked;
    }
  }
  /**
   * @param {Array} elems
   * @param {Document} doc
   * @param {boolean} scripts
   * @param {Object} values
   * @param {Array} arg
   * @return {?}
   */
  function parse(elems, doc, scripts, values, arg) {
    var j;
    var elem;
    var contains;
    var tmp;
    var tag;
    var tbody;
    var wrap;
    var l = elems.length;
    var fragment = save(doc);
    /** @type {Array} */
    var nodes = [];
    /** @type {number} */
    var i = 0;
    for (;l > i;i++) {
      if (elem = elems[i], elem || 0 === elem) {
        if ("object" === jQuery.type(elem)) {
          jQuery.merge(nodes, elem.nodeType ? [elem] : elem);
        } else {
          if (selector.test(elem)) {
            tmp = tmp || fragment.appendChild(doc.createElement("div"));
            tag = (matches.exec(elem) || ["", ""])[1].toLowerCase();
            wrap = wrapMap[tag] || wrapMap._default;
            tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2];
            j = wrap[0];
            for (;j--;) {
              tmp = tmp.lastChild;
            }
            if (!support.leadingWhitespace && (rtagName.test(elem) && nodes.push(doc.createTextNode(rtagName.exec(elem)[0]))), !support.tbody) {
              elem = "table" !== tag || rhtml.test(elem) ? "<table>" !== wrap[1] || rhtml.test(elem) ? 0 : tmp : tmp.firstChild;
              j = elem && elem.childNodes.length;
              for (;j--;) {
                if (jQuery.nodeName(tbody = elem.childNodes[j], "tbody")) {
                  if (!tbody.childNodes.length) {
                    elem.removeChild(tbody);
                  }
                }
              }
            }
            jQuery.merge(nodes, tmp.childNodes);
            /** @type {string} */
            tmp.textContent = "";
            for (;tmp.firstChild;) {
              tmp.removeChild(tmp.firstChild);
            }
            tmp = fragment.lastChild;
          } else {
            nodes.push(doc.createTextNode(elem));
          }
        }
      }
    }
    if (tmp) {
      fragment.removeChild(tmp);
    }
    if (!support.appendChecked) {
      jQuery.grep(getAll(nodes, "input"), callback);
    }
    /** @type {number} */
    i = 0;
    for (;elem = nodes[i++];) {
      if (values && jQuery.inArray(elem, values) > -1) {
        if (arg) {
          arg.push(elem);
        }
      } else {
        if (contains = jQuery.contains(elem.ownerDocument, elem), tmp = getAll(fragment.appendChild(elem), "script"), contains && setGlobalEval(tmp), scripts) {
          /** @type {number} */
          j = 0;
          for (;elem = tmp[j++];) {
            if (rchecked.test(elem.type || "")) {
              scripts.push(elem);
            }
          }
        }
      }
    }
    return tmp = null, fragment;
  }
  /**
   * @return {?}
   */
  function returnTrue() {
    return true;
  }
  /**
   * @return {?}
   */
  function returnFalse() {
    return false;
  }
  /**
   * @return {?}
   */
  function safeActiveElement() {
    try {
      return doc.activeElement;
    } catch (e) {
    }
  }
  /**
   * @param {Object} object
   * @param {Object} types
   * @param {Object} selector
   * @param {Object} data
   * @param {Object} fn
   * @param {(number|string)} deepDataAndEvents
   * @return {?}
   */
  function on(object, types, selector, data, fn, deepDataAndEvents) {
    var origFn;
    var type;
    if ("object" == typeof types) {
      if ("string" != typeof selector) {
        data = data || selector;
        selector = void 0;
      }
      for (type in types) {
        on(object, type, selector, data, types[type], deepDataAndEvents);
      }
      return object;
    }
    if (null == data && null == fn ? (fn = selector, data = selector = void 0) : null == fn && ("string" == typeof selector ? (fn = data, data = void 0) : (fn = data, data = selector, selector = void 0)), fn === false) {
      /** @type {function (): ?} */
      fn = returnFalse;
    } else {
      if (!fn) {
        return object;
      }
    }
    return 1 === deepDataAndEvents && (origFn = fn, fn = function(event) {
      return jQuery().off(event), origFn.apply(this, arguments);
    }, fn.guid = origFn.guid || (origFn.guid = jQuery.guid++)), object.each(function() {
      jQuery.event.add(this, types, fn, data, selector);
    });
  }
  /**
   * @param {Node} elem
   * @param {Object} content
   * @return {?}
   */
  function manipulationTarget(elem, content) {
    return jQuery.nodeName(elem, "table") && jQuery.nodeName(11 !== content.nodeType ? content : content.firstChild, "tr") ? elem.getElementsByTagName("tbody")[0] || elem.appendChild(elem.ownerDocument.createElement("tbody")) : elem;
  }
  /**
   * @param {Object} elem
   * @return {?}
   */
  function restoreScript(elem) {
    return elem.type = (null !== jQuery.find.attr(elem, "type")) + "/" + elem.type, elem;
  }
  /**
   * @param {Object} elem
   * @return {?}
   */
  function fn(elem) {
    /** @type {(Array.<string>|null)} */
    var match = rscriptTypeMasked.exec(elem.type);
    return match ? elem.type = match[1] : elem.removeAttribute("type"), elem;
  }
  /**
   * @param {Object} src
   * @param {Object} dest
   * @return {undefined}
   */
  function cloneCopyEvent(src, dest) {
    if (1 === dest.nodeType && jQuery.hasData(src)) {
      var type;
      var i;
      var ilen;
      var oldData = jQuery._data(src);
      var curData = jQuery._data(dest, oldData);
      var events = oldData.events;
      if (events) {
        delete curData.handle;
        curData.events = {};
        for (type in events) {
          /** @type {number} */
          i = 0;
          ilen = events[type].length;
          for (;ilen > i;i++) {
            jQuery.event.add(dest, type, events[type][i]);
          }
        }
      }
      if (curData.data) {
        curData.data = jQuery.extend({}, curData.data);
      }
    }
  }
  /**
   * @param {Element} src
   * @param {Object} dest
   * @return {undefined}
   */
  function cloneFixAttributes(src, dest) {
    var _undefined;
    var type;
    var pdataCur;
    if (1 === dest.nodeType) {
      if (_undefined = dest.nodeName.toLowerCase(), !support.noCloneEvent && dest[jQuery.expando]) {
        pdataCur = jQuery._data(dest);
        for (type in pdataCur.events) {
          jQuery.removeEvent(dest, type, pdataCur.handle);
        }
        dest.removeAttribute(jQuery.expando);
      }
      if ("script" === _undefined && dest.text !== src.text) {
        restoreScript(dest).text = src.text;
        fn(dest);
      } else {
        if ("object" === _undefined) {
          if (dest.parentNode) {
            dest.outerHTML = src.outerHTML;
          }
          if (support.html5Clone) {
            if (src.innerHTML) {
              if (!jQuery.trim(dest.innerHTML)) {
                dest.innerHTML = src.innerHTML;
              }
            }
          }
        } else {
          if ("input" === _undefined && manipulation_rcheckableType.test(src.type)) {
            dest.defaultChecked = dest.checked = src.checked;
            if (dest.value !== src.value) {
              dest.value = src.value;
            }
          } else {
            if ("option" === _undefined) {
              dest.defaultSelected = dest.selected = src.defaultSelected;
            } else {
              if (!("input" !== _undefined && "textarea" !== _undefined)) {
                dest.defaultValue = src.defaultValue;
              }
            }
          }
        }
      }
    }
  }
  /**
   * @param {Array} elements
   * @param {Object} args
   * @param {Function} callback
   * @param {?} until
   * @return {?}
   */
  function init(elements, args, callback, until) {
    /** @type {Array} */
    args = core_concat.apply([], args);
    var first;
    var node;
    var _len;
    var scripts;
    var doc;
    var fragment;
    /** @type {number} */
    var i = 0;
    var l = elements.length;
    /** @type {number} */
    var iNoClone = l - 1;
    var html = args[0];
    var isFunction = jQuery.isFunction(html);
    if (isFunction || l > 1 && ("string" == typeof html && (!support.checkClone && BEGIN_TAG_REGEXP.test(html)))) {
      return elements.each(function(index) {
        var el = elements.eq(index);
        if (isFunction) {
          args[0] = html.call(this, index, el.html());
        }
        init(el, args, callback, until);
      });
    }
    if (l && (fragment = parse(args, elements[0].ownerDocument, false, elements, until), first = fragment.firstChild, 1 === fragment.childNodes.length && (fragment = first), first || until)) {
      scripts = jQuery.map(getAll(fragment, "script"), restoreScript);
      _len = scripts.length;
      for (;l > i;i++) {
        node = fragment;
        if (i !== iNoClone) {
          node = jQuery.clone(node, true, true);
          if (_len) {
            jQuery.merge(scripts, getAll(node, "script"));
          }
        }
        callback.call(elements[i], node, i);
      }
      if (_len) {
        doc = scripts[scripts.length - 1].ownerDocument;
        jQuery.map(scripts, fn);
        /** @type {number} */
        i = 0;
        for (;_len > i;i++) {
          node = scripts[i];
          if (rchecked.test(node.type || "")) {
            if (!jQuery._data(node, "globalEval")) {
              if (jQuery.contains(doc, node)) {
                if (node.src) {
                  if (jQuery._evalUrl) {
                    jQuery._evalUrl(node.src);
                  }
                } else {
                  jQuery.globalEval((node.text || (node.textContent || (node.innerHTML || ""))).replace(rclass, ""));
                }
              }
            }
          }
        }
      }
      /** @type {null} */
      fragment = first = null;
    }
    return elements;
  }
  /**
   * @param {Object} elements
   * @param {Function} qualifier
   * @param {boolean} keepData
   * @return {?}
   */
  function remove(elements, qualifier, keepData) {
    var node;
    var scripts = qualifier ? jQuery.filter(qualifier, elements) : elements;
    /** @type {number} */
    var path = 0;
    for (;null != (node = scripts[path]);path++) {
      if (!keepData) {
        if (!(1 !== node.nodeType)) {
          jQuery.cleanData(getAll(node));
        }
      }
      if (node.parentNode) {
        if (keepData) {
          if (jQuery.contains(node.ownerDocument, node)) {
            setGlobalEval(getAll(node, "script"));
          }
        }
        node.parentNode.removeChild(node);
      }
    }
    return elements;
  }
  /**
   * @param {?} data
   * @param {Document} d
   * @return {?}
   */
  function render(data, d) {
    var el = jQuery(d.createElement(data)).appendTo(d.body);
    var displayStyle = jQuery.css(el[0], "display");
    return el.detach(), displayStyle;
  }
  /**
   * @param {?} data
   * @return {?}
   */
  function defaultDisplay(data) {
    var d = doc;
    var result = cache[data];
    return result || (result = render(data, d), "none" !== result && result || (iframe = (iframe || jQuery("<iframe frameborder='0' width='0' height='0'/>")).appendTo(d.documentElement), d = (iframe[0].contentWindow || iframe[0].contentDocument).document, d.write(), d.close(), result = render(data, d), iframe.detach()), cache[data] = result), result;
  }
  /**
   * @param {?} $timeout
   * @param {Function} hookFn
   * @return {?}
   */
  function addGetHookIf($timeout, hookFn) {
    return{
      /**
       * @return {?}
       */
      get : function() {
        return $timeout() ? void delete this.get : (this.get = hookFn).apply(this, arguments);
      }
    };
  }
  /**
   * @param {string} name
   * @return {?}
   */
  function camelCase(name) {
    if (name in style) {
      return name;
    }
    var capName = name.charAt(0).toUpperCase() + name.slice(1);
    /** @type {number} */
    var i = cssPrefixes.length;
    for (;i--;) {
      if (name = cssPrefixes[i] + capName, name in style) {
        return name;
      }
    }
  }
  /**
   * @param {Array} elements
   * @param {boolean} show
   * @return {?}
   */
  function showHide(elements, show) {
    var display;
    var elem;
    var hidden;
    /** @type {Array} */
    var values = [];
    /** @type {number} */
    var index = 0;
    var length = elements.length;
    for (;length > index;index++) {
      elem = elements[index];
      if (elem.style) {
        values[index] = jQuery._data(elem, "olddisplay");
        display = elem.style.display;
        if (show) {
          if (!values[index]) {
            if (!("none" !== display)) {
              /** @type {string} */
              elem.style.display = "";
            }
          }
          if ("" === elem.style.display) {
            if (suiteView(elem)) {
              values[index] = jQuery._data(elem, "olddisplay", defaultDisplay(elem.nodeName));
            }
          }
        } else {
          hidden = suiteView(elem);
          if (display && "none" !== display || !hidden) {
            jQuery._data(elem, "olddisplay", hidden ? display : jQuery.css(elem, "display"));
          }
        }
      }
    }
    /** @type {number} */
    index = 0;
    for (;length > index;index++) {
      elem = elements[index];
      if (elem.style) {
        if (!(show && ("none" !== elem.style.display && "" !== elem.style.display))) {
          elem.style.display = show ? values[index] || "" : "none";
        }
      }
    }
    return elements;
  }
  /**
   * @param {Object} second
   * @param {string} value
   * @param {string} keepData
   * @return {?}
   */
  function setPositiveNumber(second, value, keepData) {
    /** @type {(Array.<string>|null)} */
    var iterator = rrelNum.exec(value);
    return iterator ? Math.max(0, iterator[1] - (keepData || 0)) + (iterator[2] || "px") : value;
  }
  /**
   * @param {Object} elem
   * @param {string} keepData
   * @param {string} extra
   * @param {boolean} isBorderBox
   * @param {?} styles
   * @return {?}
   */
  function augmentWidthOrHeight(elem, keepData, extra, isBorderBox, styles) {
    /** @type {number} */
    var i = extra === (isBorderBox ? "border" : "content") ? 4 : "width" === keepData ? 1 : 0;
    /** @type {number} */
    var val = 0;
    for (;4 > i;i += 2) {
      if ("margin" === extra) {
        val += jQuery.css(elem, extra + cssExpand[i], true, styles);
      }
      if (isBorderBox) {
        if ("content" === extra) {
          val -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
        }
        if ("margin" !== extra) {
          val -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
        }
      } else {
        val += jQuery.css(elem, "padding" + cssExpand[i], true, styles);
        if ("padding" !== extra) {
          val += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
        }
      }
    }
    return val;
  }
  /**
   * @param {Object} elem
   * @param {string} name
   * @param {string} extra
   * @return {?}
   */
  function getWidthOrHeight(elem, name, extra) {
    /** @type {boolean} */
    var valueIsBorderBox = true;
    var val = "width" === name ? elem.offsetWidth : elem.offsetHeight;
    var styles = getStyles(elem);
    var isBorderBox = support.boxSizing && "border-box" === jQuery.css(elem, "boxSizing", false, styles);
    if (doc.msFullscreenElement && (win.top !== win && (elem.getClientRects().length && (val = Math.round(100 * elem.getBoundingClientRect()[name])))), 0 >= val || null == val) {
      if (val = css(elem, name, styles), (0 > val || null == val) && (val = elem.style[name]), rnumnonpx.test(val)) {
        return val;
      }
      valueIsBorderBox = isBorderBox && (support.boxSizingReliable() || val === elem.style[name]);
      /** @type {number} */
      val = parseFloat(val) || 0;
    }
    return val + augmentWidthOrHeight(elem, name, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles) + "px";
  }
  /**
   * @param {?} selector
   * @param {string} context
   * @param {string} prop
   * @param {Window} end
   * @param {Array} easing
   * @return {?}
   */
  function Tween(selector, context, prop, end, easing) {
    return new Tween.prototype.init(selector, context, prop, end, easing);
  }
  /**
   * @return {?}
   */
  function createFxNow() {
    return win.setTimeout(function() {
      fxNow = void 0;
    }), fxNow = jQuery.now();
  }
  /**
   * @param {string} type
   * @param {boolean} includeWidth
   * @return {?}
   */
  function $(type, includeWidth) {
    var which;
    var attrs = {
      height : type
    };
    /** @type {number} */
    var i = 0;
    /** @type {number} */
    includeWidth = includeWidth ? 1 : 0;
    for (;4 > i;i += 2 - includeWidth) {
      which = cssExpand[i];
      attrs["margin" + which] = attrs["padding" + which] = type;
    }
    return includeWidth && (attrs.opacity = attrs.width = type), attrs;
  }
  /**
   * @param {?} value
   * @param {?} prop
   * @param {?} animation
   * @return {?}
   */
  function createTween(value, prop, animation) {
    var tween;
    var q = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]);
    /** @type {number} */
    var i = 0;
    var l = q.length;
    for (;l > i;i++) {
      if (tween = q[i].call(animation, prop, value)) {
        return tween;
      }
    }
  }
  /**
   * @param {Object} elem
   * @param {Object} props
   * @param {Object} opts
   * @return {undefined}
   */
  function defaultPrefilter(elem, props, opts) {
    var prop;
    var value;
    var thisp;
    var tween;
    var hooks;
    var oldfire;
    var oldDisplay;
    var type;
    var anim = this;
    var orig = {};
    var style = elem.style;
    var hidden = elem.nodeType && suiteView(elem);
    var dataShow = jQuery._data(elem, "fxshow");
    if (!opts.queue) {
      hooks = jQuery._queueHooks(elem, "fx");
      if (null == hooks.unqueued) {
        /** @type {number} */
        hooks.unqueued = 0;
        /** @type {function (): undefined} */
        oldfire = hooks.empty.fire;
        /**
         * @return {undefined}
         */
        hooks.empty.fire = function() {
          if (!hooks.unqueued) {
            oldfire();
          }
        };
      }
      hooks.unqueued++;
      anim.always(function() {
        anim.always(function() {
          hooks.unqueued--;
          if (!jQuery.queue(elem, "fx").length) {
            hooks.empty.fire();
          }
        });
      });
    }
    if (1 === elem.nodeType) {
      if ("height" in props || "width" in props) {
        /** @type {Array} */
        opts.overflow = [style.overflow, style.overflowX, style.overflowY];
        oldDisplay = jQuery.css(elem, "display");
        type = "none" === oldDisplay ? jQuery._data(elem, "olddisplay") || defaultDisplay(elem.nodeName) : oldDisplay;
        if ("inline" === type) {
          if ("none" === jQuery.css(elem, "float")) {
            if (support.inlineBlockNeedsLayout && "inline" !== defaultDisplay(elem.nodeName)) {
              /** @type {number} */
              style.zoom = 1;
            } else {
              /** @type {string} */
              style.display = "inline-block";
            }
          }
        }
      }
    }
    if (opts.overflow) {
      /** @type {string} */
      style.overflow = "hidden";
      if (!support.shrinkWrapBlocks()) {
        anim.always(function() {
          style.overflow = opts.overflow[0];
          style.overflowX = opts.overflow[1];
          style.overflowY = opts.overflow[2];
        });
      }
    }
    for (prop in props) {
      if (value = props[prop], rplusequals.exec(value)) {
        if (delete props[prop], thisp = thisp || "toggle" === value, value === (hidden ? "hide" : "show")) {
          if ("show" !== value || (!dataShow || void 0 === dataShow[prop])) {
            continue;
          }
          /** @type {boolean} */
          hidden = true;
        }
        orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
      } else {
        oldDisplay = void 0;
      }
    }
    if (jQuery.isEmptyObject(orig)) {
      if ("inline" === ("none" === oldDisplay ? defaultDisplay(elem.nodeName) : oldDisplay)) {
        style.display = oldDisplay;
      }
    } else {
      if (dataShow) {
        if ("hidden" in dataShow) {
          hidden = dataShow.hidden;
        }
      } else {
        dataShow = jQuery._data(elem, "fxshow", {});
      }
      if (thisp) {
        /** @type {boolean} */
        dataShow.hidden = !hidden;
      }
      if (hidden) {
        jQuery(elem).show();
      } else {
        anim.done(function() {
          jQuery(elem).hide();
        });
      }
      anim.done(function() {
        var prop;
        jQuery._removeData(elem, "fxshow");
        for (prop in orig) {
          jQuery.style(elem, prop, orig[prop]);
        }
      });
      for (prop in orig) {
        tween = createTween(hidden ? dataShow[prop] : 0, prop, anim);
        if (!(prop in dataShow)) {
          dataShow[prop] = tween.start;
          if (hidden) {
            tween.end = tween.start;
            /** @type {number} */
            tween.start = "width" === prop || "height" === prop ? 1 : 0;
          }
        }
      }
    }
  }
  /**
   * @param {Object} object
   * @param {Object} paramMap
   * @return {undefined}
   */
  function propFilter(object, paramMap) {
    var key;
    var name;
    var value;
    var val;
    var hooks;
    for (key in object) {
      if (name = jQuery.camelCase(key), value = paramMap[name], val = object[key], jQuery.isArray(val) && (value = val[1], val = object[key] = val[0]), key !== name && (object[name] = val, delete object[key]), hooks = jQuery.cssHooks[name], hooks && "expand" in hooks) {
        val = hooks.expand(val);
        delete object[name];
        for (key in val) {
          if (!(key in object)) {
            object[key] = val[key];
            paramMap[key] = value;
          }
        }
      } else {
        paramMap[name] = value;
      }
    }
  }
  /**
   * @param {Object} elem
   * @param {?} properties
   * @param {Object} options
   * @return {?}
   */
  function Animation(elem, properties, options) {
    var that;
    var r;
    /** @type {number} */
    var methodName = 0;
    var cnl = Animation.prefilters.length;
    var deferred = jQuery.Deferred().always(function() {
      delete tick.elem;
    });
    /**
     * @return {?}
     */
    var tick = function() {
      if (r) {
        return false;
      }
      var currentTime = fxNow || createFxNow();
      /** @type {number} */
      var remaining = Math.max(0, animation.startTime + animation.duration - currentTime);
      /** @type {number} */
      var temp = remaining / animation.duration || 0;
      /** @type {number} */
      var percent = 1 - temp;
      /** @type {number} */
      var index = 0;
      var startOffset = animation.tweens.length;
      for (;startOffset > index;index++) {
        animation.tweens[index].run(percent);
      }
      return deferred.notifyWith(elem, [animation, percent, remaining]), 1 > percent && startOffset ? remaining : (deferred.resolveWith(elem, [animation]), false);
    };
    var animation = deferred.promise({
      elem : elem,
      props : jQuery.extend({}, properties),
      opts : jQuery.extend(true, {
        specialEasing : {},
        easing : jQuery.easing._default
      }, options),
      originalProperties : properties,
      originalOptions : options,
      startTime : fxNow || createFxNow(),
      duration : options.duration,
      tweens : [],
      /**
       * @param {?} prop
       * @param {string} end
       * @return {?}
       */
      createTween : function(prop, end) {
        var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
        return animation.tweens.push(tween), tween;
      },
      /**
       * @param {boolean} gotoEnd
       * @return {?}
       */
      stop : function(gotoEnd) {
        /** @type {number} */
        var index = 0;
        var length = gotoEnd ? animation.tweens.length : 0;
        if (r) {
          return this;
        }
        /** @type {boolean} */
        r = true;
        for (;length > index;index++) {
          animation.tweens[index].run(1);
        }
        return gotoEnd ? (deferred.notifyWith(elem, [animation, 1, 0]), deferred.resolveWith(elem, [animation, gotoEnd])) : deferred.rejectWith(elem, [animation, gotoEnd]), this;
      }
    });
    var scripts = animation.props;
    propFilter(scripts, animation.opts.specialEasing);
    for (;cnl > methodName;methodName++) {
      if (that = Animation.prefilters[methodName].call(animation, elem, scripts, animation.opts)) {
        return jQuery.isFunction(that.stop) && (jQuery._queueHooks(animation.elem, animation.opts.queue).stop = jQuery.proxy(that.stop, that)), that;
      }
    }
    return jQuery.map(scripts, createTween, animation), jQuery.isFunction(animation.opts.start) && animation.opts.start.call(elem, animation), jQuery.fx.timer(jQuery.extend(tick, {
      elem : elem,
      anim : animation,
      queue : animation.opts.queue
    })), animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
  }
  /**
   * @param {Error} key
   * @return {?}
   */
  function getter(key) {
    return jQuery.attr(key, "class") || "";
  }
  /**
   * @param {Object} structure
   * @return {?}
   */
  function addToPrefiltersOrTransports(structure) {
    return function(selector, fn) {
      if ("string" != typeof selector) {
        /** @type {(Function|string)} */
        fn = selector;
        /** @type {string} */
        selector = "*";
      }
      var node;
      /** @type {number} */
      var i = 0;
      var elem = selector.toLowerCase().match(core_rnotwhite) || [];
      if (jQuery.isFunction(fn)) {
        for (;node = elem[i++];) {
          if ("+" === node.charAt(0)) {
            node = node.slice(1) || "*";
            (structure[node] = structure[node] || []).unshift(fn);
          } else {
            (structure[node] = structure[node] || []).push(fn);
          }
        }
      }
    };
  }
  /**
   * @param {?} structure
   * @param {?} options
   * @param {Object} originalOptions
   * @param {?} jqXHR
   * @return {?}
   */
  function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
    /**
     * @param {string} key
     * @return {?}
     */
    function inspect(key) {
      var oldName;
      return old[key] = true, jQuery.each(structure[key] || [], function(dataAndEvents, prefilterOrFactory) {
        var name = prefilterOrFactory(options, originalOptions, jqXHR);
        return "string" != typeof name || (seekingTransport || old[name]) ? seekingTransport ? !(oldName = name) : void 0 : (options.dataTypes.unshift(name), inspect(name), false);
      }), oldName;
    }
    var old = {};
    /** @type {boolean} */
    var seekingTransport = structure === transports;
    return inspect(options.dataTypes[0]) || !old["*"] && inspect("*");
  }
  /**
   * @param {(Object|string)} target
   * @param {Object} src
   * @return {?}
   */
  function ajaxExtend(target, src) {
    var deep;
    var key;
    var flatOptions = jQuery.ajaxSettings.flatOptions || {};
    for (key in src) {
      if (void 0 !== src[key]) {
        (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
      }
    }
    return deep && jQuery.extend(true, target, deep), target;
  }
  /**
   * @param {Object} s
   * @param {XMLHttpRequest} jqXHR
   * @param {Object} responses
   * @return {?}
   */
  function ajaxHandleResponses(s, jqXHR, responses) {
    var firstDataType;
    var ct;
    var finalDataType;
    var type;
    var contents = s.contents;
    var dataTypes = s.dataTypes;
    for (;"*" === dataTypes[0];) {
      dataTypes.shift();
      if (void 0 === ct) {
        ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
      }
    }
    if (ct) {
      for (type in contents) {
        if (contents[type] && contents[type].test(ct)) {
          dataTypes.unshift(type);
          break;
        }
      }
    }
    if (dataTypes[0] in responses) {
      finalDataType = dataTypes[0];
    } else {
      for (type in responses) {
        if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
          /** @type {string} */
          finalDataType = type;
          break;
        }
        if (!firstDataType) {
          /** @type {string} */
          firstDataType = type;
        }
      }
      /** @type {(string|undefined)} */
      finalDataType = finalDataType || firstDataType;
    }
    return finalDataType ? (finalDataType !== dataTypes[0] && dataTypes.unshift(finalDataType), responses[finalDataType]) : void 0;
  }
  /**
   * @param {Object} s
   * @param {Object} response
   * @param {?} jqXHR
   * @param {Object} isSuccess
   * @return {?}
   */
  function ajaxConvert(s, response, jqXHR, isSuccess) {
    var conv2;
    var current;
    var conv;
    var tmp;
    var prev;
    var converters = {};
    var dataTypes = s.dataTypes.slice();
    if (dataTypes[1]) {
      for (conv in s.converters) {
        converters[conv.toLowerCase()] = s.converters[conv];
      }
    }
    current = dataTypes.shift();
    for (;current;) {
      if (s.responseFields[current] && (jqXHR[s.responseFields[current]] = response), !prev && (isSuccess && (s.dataFilter && (response = s.dataFilter(response, s.dataType)))), prev = current, current = dataTypes.shift()) {
        if ("*" === current) {
          current = prev;
        } else {
          if ("*" !== prev && prev !== current) {
            if (conv = converters[prev + " " + current] || converters["* " + current], !conv) {
              for (conv2 in converters) {
                if (tmp = conv2.split(" "), tmp[1] === current && (conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]])) {
                  if (conv === true) {
                    conv = converters[conv2];
                  } else {
                    if (converters[conv2] !== true) {
                      /** @type {string} */
                      current = tmp[0];
                      dataTypes.unshift(tmp[1]);
                    }
                  }
                  break;
                }
              }
            }
            if (conv !== true) {
              if (conv && s["throws"]) {
                response = conv(response);
              } else {
                try {
                  response = conv(response);
                } catch (e) {
                  return{
                    state : "parsererror",
                    error : conv ? e : "No conversion from " + prev + " to " + current
                  };
                }
              }
            }
          }
        }
      }
    }
    return{
      state : "success",
      data : response
    };
  }
  /**
   * @param {Object} elem
   * @return {?}
   */
  function hide(elem) {
    return elem.style && elem.style.display || jQuery.css(elem, "display");
  }
  /**
   * @param {Object} el
   * @return {?}
   */
  function handle(el) {
    for (;el && 1 === el.nodeType;) {
      if ("none" === hide(el) || "hidden" === el.type) {
        return true;
      }
      el = el.parentNode;
    }
    return false;
  }
  /**
   * @param {string} prefix
   * @param {Function} qualifier
   * @param {boolean} traditional
   * @param {Function} add
   * @return {undefined}
   */
  function buildParams(prefix, qualifier, traditional, add) {
    var name;
    if (jQuery.isArray(qualifier)) {
      jQuery.each(qualifier, function(i, v) {
        if (traditional || rmargin.test(prefix)) {
          add(prefix, v);
        } else {
          buildParams(prefix + "[" + ("object" == typeof v && null != v ? i : "") + "]", v, traditional, add);
        }
      });
    } else {
      if (traditional || "object" !== jQuery.type(qualifier)) {
        add(prefix, qualifier);
      } else {
        for (name in qualifier) {
          buildParams(prefix + "[" + name + "]", qualifier[name], traditional, add);
        }
      }
    }
  }
  /**
   * @return {?}
   */
  function createStandardXHR() {
    try {
      return new win.XMLHttpRequest;
    } catch (t) {
    }
  }
  /**
   * @return {?}
   */
  function createActiveXHR() {
    try {
      return new win.ActiveXObject("Microsoft.XMLHTTP");
    } catch (t) {
    }
  }
  /**
   * @param {Object} elem
   * @return {?}
   */
  function getWindow(elem) {
    return jQuery.isWindow(elem) ? elem : 9 === elem.nodeType ? elem.defaultView || elem.parentWindow : false;
  }
  /** @type {Array} */
  var core_deletedIds = [];
  var doc = win.document;
  /** @type {function (this:(Array.<T>|string|{length: number}), *=, *=): Array.<T>} */
  var core_slice = core_deletedIds.slice;
  /** @type {function (this:*, ...[*]): Array} */
  var core_concat = core_deletedIds.concat;
  /** @type {function (this:(Array.<T>|{length: number}), ...[T]): number} */
  var core_push = core_deletedIds.push;
  /** @type {function (this:(Array.<T>|string|{length: number}), T, number=): number} */
  var core_indexOf = core_deletedIds.indexOf;
  var class2type = {};
  /** @type {function (this:*): string} */
  var core_toString = class2type.toString;
  /** @type {function (this:Object, *): boolean} */
  var core_hasOwn = class2type.hasOwnProperty;
  var support = {};
  /** @type {string} */
  var core_version = "1.12.1";
  /**
   * @param {Object} selector
   * @param {string} context
   * @return {?}
   */
  var jQuery = function(selector, context) {
    return new jQuery.fn.init(selector, context);
  };
  /** @type {RegExp} */
  var badChars = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
  /** @type {RegExp} */
  var rmsPrefix = /^-ms-/;
  /** @type {RegExp} */
  var emptyParagraphRegexp = /-([\da-z])/gi;
  /**
   * @param {?} all
   * @param {string} letter
   * @return {?}
   */
  var fcamelCase = function(all, letter) {
    return letter.toUpperCase();
  };
  jQuery.fn = jQuery.prototype = {
    jquery : core_version,
    /** @type {function (Object, string): ?} */
    constructor : jQuery,
    selector : "",
    length : 0,
    /**
     * @return {?}
     */
    toArray : function() {
      return core_slice.call(this);
    },
    /**
     * @param {string} second
     * @return {?}
     */
    get : function(second) {
      return null != second ? 0 > second ? this[second + this.length] : this[second] : core_slice.call(this);
    },
    /**
     * @param {Array} elems
     * @return {?}
     */
    pushStack : function(elems) {
      var ret = jQuery.merge(this.constructor(), elems);
      return ret.prevObject = this, ret.context = this.context, ret;
    },
    /**
     * @param {Function} opt_attributes
     * @return {?}
     */
    each : function(opt_attributes) {
      return jQuery.each(this, opt_attributes);
    },
    /**
     * @param {Function} callback
     * @return {?}
     */
    map : function(callback) {
      return this.pushStack(jQuery.map(this, function(el, operation) {
        return callback.call(el, operation, el);
      }));
    },
    /**
     * @return {?}
     */
    slice : function() {
      return this.pushStack(core_slice.apply(this, arguments));
    },
    /**
     * @return {?}
     */
    first : function() {
      return this.eq(0);
    },
    /**
     * @return {?}
     */
    last : function() {
      return this.eq(-1);
    },
    /**
     * @param {number} i
     * @return {?}
     */
    eq : function(i) {
      var len = this.length;
      var n = +i + (0 > i ? len : 0);
      return this.pushStack(n >= 0 && len > n ? [this[n]] : []);
    },
    /**
     * @return {?}
     */
    end : function() {
      return this.prevObject || this.constructor();
    },
    /** @type {function (this:(Array.<T>|{length: number}), ...[T]): number} */
    push : core_push,
    /** @type {function (this:(Array.<T>|{length: number}), function (T, T): number=): ?} */
    sort : core_deletedIds.sort,
    /** @type {function (this:(Array.<T>|{length: number}), *=, *=, ...[T]): Array.<T>} */
    splice : core_deletedIds.splice
  };
  /** @type {function (): ?} */
  jQuery.extend = jQuery.fn.extend = function() {
    var src;
    var copyIsArray;
    var copy;
    var name;
    var options;
    var clone;
    var target = arguments[0] || {};
    /** @type {number} */
    var i = 1;
    /** @type {number} */
    var l = arguments.length;
    /** @type {boolean} */
    var deep = false;
    if ("boolean" == typeof target) {
      /** @type {boolean} */
      deep = target;
      target = arguments[i] || {};
      i++;
    }
    if (!("object" == typeof target)) {
      if (!jQuery.isFunction(target)) {
        target = {};
      }
    }
    if (i === l) {
      target = this;
      i--;
    }
    for (;l > i;i++) {
      if (null != (options = arguments[i])) {
        for (name in options) {
          src = target[name];
          copy = options[name];
          if (target !== copy) {
            if (deep && (copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy))))) {
              if (copyIsArray) {
                /** @type {boolean} */
                copyIsArray = false;
                clone = src && jQuery.isArray(src) ? src : [];
              } else {
                clone = src && jQuery.isPlainObject(src) ? src : {};
              }
              target[name] = jQuery.extend(deep, clone, copy);
            } else {
              if (void 0 !== copy) {
                target[name] = copy;
              }
            }
          }
        }
      }
    }
    return target;
  };
  jQuery.extend({
    expando : "jQuery" + (core_version + Math.random()).replace(/\D/g, ""),
    isReady : true,
    /**
     * @param {Function} obj
     * @return {?}
     */
    error : function(obj) {
      throw new Error(obj);
    },
    /**
     * @return {undefined}
     */
    noop : function() {
    },
    /**
     * @param {Function} obj
     * @return {?}
     */
    isFunction : function(obj) {
      return "function" === jQuery.type(obj);
    },
    /** @type {function (*): boolean} */
    isArray : Array.isArray || function(obj) {
      return "array" === jQuery.type(obj);
    },
    /**
     * @param {Object} obj
     * @return {?}
     */
    isWindow : function(obj) {
      return null != obj && obj == obj.window;
    },
    /**
     * @param {Object} value
     * @return {?}
     */
    isNumeric : function(value) {
      var val = value && value.toString();
      return!jQuery.isArray(value) && val - parseFloat(val) + 1 >= 0;
    },
    /**
     * @param {?} obj
     * @return {?}
     */
    isEmptyObject : function(obj) {
      var prop;
      for (prop in obj) {
        return false;
      }
      return true;
    },
    /**
     * @param {?} obj
     * @return {?}
     */
    isPlainObject : function(obj) {
      var key;
      if (!obj || ("object" !== jQuery.type(obj) || (obj.nodeType || jQuery.isWindow(obj)))) {
        return false;
      }
      try {
        if (obj.constructor && (!core_hasOwn.call(obj, "constructor") && !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf"))) {
          return false;
        }
      } catch (n) {
        return false;
      }
      if (!support.ownFirst) {
        for (key in obj) {
          return core_hasOwn.call(obj, key);
        }
      }
      for (key in obj) {
      }
      return void 0 === key || core_hasOwn.call(obj, key);
    },
    /**
     * @param {Function} obj
     * @return {?}
     */
    type : function(obj) {
      return null == obj ? obj + "" : "object" == typeof obj || "function" == typeof obj ? class2type[core_toString.call(obj)] || "object" : typeof obj;
    },
    /**
     * @param {?} data
     * @return {undefined}
     */
    globalEval : function(data) {
      if (data) {
        if (jQuery.trim(data)) {
          (win.execScript || function(expr) {
            win.eval.call(win, expr);
          })(data);
        }
      }
    },
    /**
     * @param {string} string
     * @return {?}
     */
    camelCase : function(string) {
      return string.replace(rmsPrefix, "ms-").replace(emptyParagraphRegexp, fcamelCase);
    },
    /**
     * @param {Node} elem
     * @param {string} name
     * @return {?}
     */
    nodeName : function(elem, name) {
      return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
    },
    /**
     * @param {Function} obj
     * @param {Function} callback
     * @return {?}
     */
    each : function(obj, callback) {
      var l;
      /** @type {number} */
      var i = 0;
      if (isArraylike(obj)) {
        l = obj.length;
        for (;l > i && callback.call(obj[i], i, obj[i]) !== false;i++) {
        }
      } else {
        for (i in obj) {
          if (callback.call(obj[i], i, obj[i]) === false) {
            break;
          }
        }
      }
      return obj;
    },
    /**
     * @param {string} s
     * @return {?}
     */
    trim : function(s) {
      return null == s ? "" : (s + "").replace(badChars, "");
    },
    /**
     * @param {?} arr
     * @param {Array} results
     * @return {?}
     */
    makeArray : function(arr, results) {
      var ret = results || [];
      return null != arr && (isArraylike(Object(arr)) ? jQuery.merge(ret, "string" == typeof arr ? [arr] : arr) : core_push.call(ret, arr)), ret;
    },
    /**
     * @param {?} elem
     * @param {Array} arr
     * @param {number} i
     * @return {?}
     */
    inArray : function(elem, arr, i) {
      var len;
      if (arr) {
        if (core_indexOf) {
          return core_indexOf.call(arr, elem, i);
        }
        len = arr.length;
        i = i ? 0 > i ? Math.max(0, len + i) : i : 0;
        for (;len > i;i++) {
          if (i in arr && arr[i] === elem) {
            return i;
          }
        }
      }
      return-1;
    },
    /**
     * @param {(Function|string)} first
     * @param {?} second
     * @return {?}
     */
    merge : function(first, second) {
      /** @type {number} */
      var jlen = +second.length;
      /** @type {number} */
      var j = 0;
      var i = first.length;
      for (;jlen > j;) {
        first[i++] = second[j++];
      }
      if (jlen !== jlen) {
        for (;void 0 !== second[j];) {
          first[i++] = second[j++];
        }
      }
      return first.length = i, first;
    },
    /**
     * @param {Array} elems
     * @param {Function} callback
     * @param {?} inv
     * @return {?}
     */
    grep : function(elems, callback, inv) {
      var val;
      /** @type {Array} */
      var ret = [];
      /** @type {number} */
      var i = 0;
      var l = elems.length;
      /** @type {boolean} */
      var skip = !inv;
      for (;l > i;i++) {
        /** @type {boolean} */
        val = !callback(elems[i], i);
        if (val !== skip) {
          ret.push(elems[i]);
        }
      }
      return ret;
    },
    /**
     * @param {Object} elems
     * @param {Function} callback
     * @param {?} arg
     * @return {?}
     */
    map : function(elems, callback, arg) {
      var l;
      var value;
      /** @type {number} */
      var i = 0;
      /** @type {Array} */
      var ret = [];
      if (isArraylike(elems)) {
        l = elems.length;
        for (;l > i;i++) {
          value = callback(elems[i], i, arg);
          if (null != value) {
            ret.push(value);
          }
        }
      } else {
        for (i in elems) {
          value = callback(elems[i], i, arg);
          if (null != value) {
            ret.push(value);
          }
        }
      }
      return core_concat.apply([], ret);
    },
    guid : 1,
    /**
     * @param {Object} fn
     * @param {Object} context
     * @return {?}
     */
    proxy : function(fn, context) {
      var args;
      var proxy;
      var tmp;
      return "string" == typeof context && (tmp = fn[context], context = fn, fn = tmp), jQuery.isFunction(fn) ? (args = core_slice.call(arguments, 2), proxy = function() {
        return fn.apply(context || this, args.concat(core_slice.call(arguments)));
      }, proxy.guid = fn.guid = fn.guid || jQuery.guid++, proxy) : void 0;
    },
    /**
     * @return {?}
     */
    now : function() {
      return+new Date;
    },
    support : support
  });
  if ("function" == typeof Symbol) {
    jQuery.fn[Symbol.iterator] = core_deletedIds[Symbol.iterator];
  }
  jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(dataAndEvents, m3) {
    class2type["[object " + m3 + "]"] = m3.toLowerCase();
  });
  var Sizzle = function(win) {
    /**
     * @param {string} selector
     * @param {Object} context
     * @param {Array} results
     * @param {Array} seed
     * @return {?}
     */
    function Sizzle(selector, context, results, seed) {
      var node;
      var i;
      var elem;
      var ret;
      var c;
      var nodes;
      var groups;
      var expression;
      var element = context && context.ownerDocument;
      var midline = context ? context.nodeType : 9;
      if (results = results || [], "string" != typeof selector || (!selector || 1 !== midline && (9 !== midline && 11 !== midline))) {
        return results;
      }
      if (!seed && ((context ? context.ownerDocument || context : preferredDoc) !== doc && setDocument(context), context = context || doc, documentIsHTML)) {
        if (11 !== midline && (nodes = rquickExpr.exec(selector))) {
          if (node = nodes[1]) {
            if (9 === midline) {
              if (!(elem = context.getElementById(node))) {
                return results;
              }
              if (elem.id === node) {
                return results.push(elem), results;
              }
            } else {
              if (element && ((elem = element.getElementById(node)) && (contains(context, elem) && elem.id === node))) {
                return results.push(elem), results;
              }
            }
          } else {
            if (nodes[2]) {
              return jQuery.apply(results, context.getElementsByTagName(selector)), results;
            }
            if ((node = nodes[3]) && (support.getElementsByClassName && context.getElementsByClassName)) {
              return jQuery.apply(results, context.getElementsByClassName(node)), results;
            }
          }
        }
        if (support.qsa && (!compilerCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector)))) {
          if (1 !== midline) {
            /** @type {Object} */
            element = context;
            /** @type {string} */
            expression = selector;
          } else {
            if ("object" !== context.nodeName.toLowerCase()) {
              if (ret = context.getAttribute("id")) {
                ret = ret.replace(rreturn, "\\$&");
              } else {
                context.setAttribute("id", ret = expando);
              }
              groups = tokenize(selector);
              i = groups.length;
              /** @type {string} */
              c = ridentifier.test(ret) ? "#" + ret : "[id='" + ret + "']";
              for (;i--;) {
                /** @type {string} */
                groups[i] = c + " " + toSelector(groups[i]);
              }
              expression = groups.join(",");
              element = rsibling.test(selector) && testContext(context.parentNode) || context;
            }
          }
          if (expression) {
            try {
              return jQuery.apply(results, element.querySelectorAll(expression)), results;
            } catch (g) {
            } finally {
              if (ret === expando) {
                context.removeAttribute("id");
              }
            }
          }
        }
      }
      return select(selector.replace(rtrim, "$1"), context, results, seed);
    }
    /**
     * @return {?}
     */
    function createCache() {
      /**
       * @param {string} key
       * @param {?} value
       * @return {?}
       */
      function cache(key, value) {
        return buf.push(key + " ") > Expr.cacheLength && delete cache[buf.shift()], cache[key + " "] = value;
      }
      /** @type {Array} */
      var buf = [];
      return cache;
    }
    /**
     * @param {Function} fn
     * @return {?}
     */
    function markFunction(fn) {
      return fn[expando] = true, fn;
    }
    /**
     * @param {Function} fn
     * @return {?}
     */
    function assert(fn) {
      var t = doc.createElement("div");
      try {
        return!!fn(t);
      } catch (n) {
        return false;
      } finally {
        if (t.parentNode) {
          t.parentNode.removeChild(t);
        }
        /** @type {null} */
        t = null;
      }
    }
    /**
     * @param {string} attrs
     * @param {Function} handler
     * @return {undefined}
     */
    function addHandle(attrs, handler) {
      var arr = attrs.split("|");
      var i = arr.length;
      for (;i--;) {
        /** @type {Function} */
        Expr.attrHandle[arr[i]] = handler;
      }
    }
    /**
     * @param {Object} a
     * @param {Object} b
     * @return {?}
     */
    function siblingCheck(a, b) {
      var cur = b && a;
      var diff = cur && (1 === a.nodeType && (1 === b.nodeType && (~b.sourceIndex || MAX_NEGATIVE) - (~a.sourceIndex || MAX_NEGATIVE)));
      if (diff) {
        return diff;
      }
      if (cur) {
        for (;cur = cur.nextSibling;) {
          if (cur === b) {
            return-1;
          }
        }
      }
      return a ? 1 : -1;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    function createInputPseudo(type) {
      return function(elem) {
        var b = elem.nodeName.toLowerCase();
        return "input" === b && elem.type === type;
      };
    }
    /**
     * @param {?} type
     * @return {?}
     */
    function createButtonPseudo(type) {
      return function(elem) {
        var NULL = elem.nodeName.toLowerCase();
        return("input" === NULL || "button" === NULL) && elem.type === type;
      };
    }
    /**
     * @param {Function} fn
     * @return {?}
     */
    function createPositionalPseudo(fn) {
      return markFunction(function(argument) {
        return argument = +argument, markFunction(function(seed, matches) {
          var j;
          var matchIndexes = fn([], seed.length, argument);
          var i = matchIndexes.length;
          for (;i--;) {
            if (seed[j = matchIndexes[i]]) {
              /** @type {boolean} */
              seed[j] = !(matches[j] = seed[j]);
            }
          }
        });
      });
    }
    /**
     * @param {Object} context
     * @return {?}
     */
    function testContext(context) {
      return context && ("undefined" != typeof context.getElementsByTagName && context);
    }
    /**
     * @return {undefined}
     */
    function setFilters() {
    }
    /**
     * @param {Array} tokens
     * @return {?}
     */
    function toSelector(tokens) {
      /** @type {number} */
      var i = 0;
      var nTokens = tokens.length;
      /** @type {string} */
      var selector = "";
      for (;nTokens > i;i++) {
        selector += tokens[i].value;
      }
      return selector;
    }
    /**
     * @param {Function} matcher
     * @param {Object} combinator
     * @param {boolean} dataAndEvents
     * @return {?}
     */
    function addCombinator(matcher, combinator, dataAndEvents) {
      var dir = combinator.dir;
      var r = dataAndEvents && "parentNode" === dir;
      /** @type {number} */
      var doneName = done++;
      return combinator.first ? function(elem, context, xml) {
        for (;elem = elem[dir];) {
          if (1 === elem.nodeType || r) {
            return matcher(elem, context, xml);
          }
        }
      } : function(elem, context, xml) {
        var oldCache;
        var outerCache;
        var callbacks;
        /** @type {Array} */
        var newCache = [dirruns, doneName];
        if (xml) {
          for (;elem = elem[dir];) {
            if ((1 === elem.nodeType || r) && matcher(elem, context, xml)) {
              return true;
            }
          }
        } else {
          for (;elem = elem[dir];) {
            if (1 === elem.nodeType || r) {
              if (callbacks = elem[expando] || (elem[expando] = {}), outerCache = callbacks[elem.uniqueID] || (callbacks[elem.uniqueID] = {}), (oldCache = outerCache[dir]) && (oldCache[0] === dirruns && oldCache[1] === doneName)) {
                return newCache[2] = oldCache[2];
              }
              if (outerCache[dir] = newCache, newCache[2] = matcher(elem, context, xml)) {
                return true;
              }
            }
          }
        }
      };
    }
    /**
     * @param {Object} matchers
     * @return {?}
     */
    function elementMatcher(matchers) {
      return matchers.length > 1 ? function(elem, context, xml) {
        var i = matchers.length;
        for (;i--;) {
          if (!matchers[i](elem, context, xml)) {
            return false;
          }
        }
        return true;
      } : matchers[0];
    }
    /**
     * @param {string} selector
     * @param {Array} contexts
     * @param {?} results
     * @return {?}
     */
    function multipleContexts(selector, contexts, results) {
      /** @type {number} */
      var i = 0;
      var len = contexts.length;
      for (;len > i;i++) {
        Sizzle(selector, contexts[i], results);
      }
      return results;
    }
    /**
     * @param {Array} second
     * @param {Object} elems
     * @param {boolean} filter
     * @param {Object} context
     * @param {string} xml
     * @return {?}
     */
    function condense(second, elems, filter, context, xml) {
      var elem;
      /** @type {Array} */
      var newUnmatched = [];
      /** @type {number} */
      var i = 0;
      var l = second.length;
      /** @type {boolean} */
      var u = null != elems;
      for (;l > i;i++) {
        if (elem = second[i]) {
          if (!(filter && !filter(elem, context, xml))) {
            newUnmatched.push(elem);
            if (u) {
              elems.push(i);
            }
          }
        }
      }
      return newUnmatched;
    }
    /**
     * @param {Object} preFilter
     * @param {string} selector
     * @param {boolean} matcher
     * @param {Object} postFilter
     * @param {Object} postFinder
     * @param {string} postSelector
     * @return {?}
     */
    function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
      return postFilter && (!postFilter[expando] && (postFilter = setMatcher(postFilter))), postFinder && (!postFinder[expando] && (postFinder = setMatcher(postFinder, postSelector))), markFunction(function(seed, results, context, xml) {
        var qualifier;
        var i;
        var elem;
        /** @type {Array} */
        var destElements = [];
        /** @type {Array} */
        var elements = [];
        var preexisting = results.length;
        var elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []);
        var matcherIn = !preFilter || !seed && selector ? elems : condense(elems, destElements, preFilter, context, xml);
        var matcherOut = matcher ? postFinder || (seed ? preFilter : preexisting || postFilter) ? [] : results : matcherIn;
        if (matcher && matcher(matcherIn, matcherOut, context, xml), postFilter) {
          qualifier = condense(matcherOut, elements);
          postFilter(qualifier, [], context, xml);
          i = qualifier.length;
          for (;i--;) {
            if (elem = qualifier[i]) {
              /** @type {boolean} */
              matcherOut[elements[i]] = !(matcherIn[elements[i]] = elem);
            }
          }
        }
        if (seed) {
          if (postFinder || preFilter) {
            if (postFinder) {
              /** @type {Array} */
              qualifier = [];
              i = matcherOut.length;
              for (;i--;) {
                if (elem = matcherOut[i]) {
                  qualifier.push(matcherIn[i] = elem);
                }
              }
              postFinder(null, matcherOut = [], qualifier, xml);
            }
            i = matcherOut.length;
            for (;i--;) {
              if (elem = matcherOut[i]) {
                if ((qualifier = postFinder ? equal(seed, elem) : destElements[i]) > -1) {
                  /** @type {boolean} */
                  seed[qualifier] = !(results[qualifier] = elem);
                }
              }
            }
          }
        } else {
          matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut);
          if (postFinder) {
            postFinder(null, results, matcherOut, xml);
          } else {
            jQuery.apply(results, matcherOut);
          }
        }
      });
    }
    /**
     * @param {Object} tokens
     * @return {?}
     */
    function matcherFromTokens(tokens) {
      var type;
      var matcher;
      var j;
      var len = tokens.length;
      var leadingRelative = Expr.relative[tokens[0].type];
      var implicitRelative = leadingRelative || Expr.relative[" "];
      /** @type {number} */
      var i = leadingRelative ? 1 : 0;
      var matchContext = addCombinator(function(clas) {
        return clas === type;
      }, implicitRelative, true);
      var matchAnyContext = addCombinator(function(initial) {
        return equal(type, initial) > -1;
      }, implicitRelative, true);
      /** @type {Array} */
      var matchers = [function(elem, context, xml) {
        var r = !leadingRelative && (xml || context !== queuedFn) || ((type = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
        return type = null, r;
      }];
      for (;len > i;i++) {
        if (matcher = Expr.relative[tokens[i].type]) {
          /** @type {Array} */
          matchers = [addCombinator(elementMatcher(matchers), matcher)];
        } else {
          if (matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches), matcher[expando]) {
            /** @type {number} */
            j = ++i;
            for (;len > j && !Expr.relative[tokens[j].type];j++) {
            }
            return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(tokens.slice(0, i - 1).concat({
                value : " " === tokens[i - 2].type ? "*" : ""
              })).replace(rtrim, "$1"), matcher, j > i && matcherFromTokens(tokens.slice(i, j)), len > j && matcherFromTokens(tokens = tokens.slice(j)), len > j && toSelector(tokens));
          }
          matchers.push(matcher);
        }
      }
      return elementMatcher(matchers);
    }
    /**
     * @param {Array} elementMatchers
     * @param {Array} setMatchers
     * @return {?}
     */
    function matcherFromGroupMatchers(elementMatchers, setMatchers) {
      /** @type {boolean} */
      var bySet = setMatchers.length > 0;
      /** @type {boolean} */
      var triggerElem = elementMatchers.length > 0;
      /**
       * @param {HTMLElement} dataAndEvents
       * @param {boolean} xml
       * @param {boolean} results
       * @param {Array} context
       * @param {Object} seed
       * @return {?}
       */
      var superMatcher = function(dataAndEvents, xml, results, context, seed) {
        var elem;
        var j;
        var matcher;
        /** @type {number} */
        var matchedCount = 0;
        /** @type {string} */
        var i = "0";
        var unmatched = dataAndEvents && [];
        /** @type {Array} */
        var ret = [];
        var fn = queuedFn;
        var elems = dataAndEvents || triggerElem && Expr.find.TAG("*", seed);
        var dirrunsUnique = dirruns += null == fn ? 1 : Math.random() || 0.1;
        var len = elems.length;
        if (seed) {
          queuedFn = xml === doc || (xml || seed);
        }
        for (;i !== len && null != (elem = elems[i]);i++) {
          if (triggerElem && elem) {
            /** @type {number} */
            j = 0;
            if (!xml) {
              if (!(elem.ownerDocument === doc)) {
                setDocument(elem);
                /** @type {boolean} */
                results = !documentIsHTML;
              }
            }
            for (;matcher = elementMatchers[j++];) {
              if (matcher(elem, xml || doc, results)) {
                context.push(elem);
                break;
              }
            }
            if (seed) {
              dirruns = dirrunsUnique;
            }
          }
          if (bySet) {
            if (elem = !matcher && elem) {
              matchedCount--;
            }
            if (dataAndEvents) {
              unmatched.push(elem);
            }
          }
        }
        if (matchedCount += i, bySet && i !== matchedCount) {
          /** @type {number} */
          j = 0;
          for (;matcher = setMatchers[j++];) {
            matcher(unmatched, ret, xml, results);
          }
          if (dataAndEvents) {
            if (matchedCount > 0) {
              for (;i--;) {
                if (!unmatched[i]) {
                  if (!ret[i]) {
                    ret[i] = pop.call(context);
                  }
                }
              }
            }
            ret = condense(ret);
          }
          jQuery.apply(context, ret);
          if (seed) {
            if (!dataAndEvents) {
              if (ret.length > 0) {
                if (matchedCount + setMatchers.length > 1) {
                  Sizzle.uniqueSort(context);
                }
              }
            }
          }
        }
        return seed && (dirruns = dirrunsUnique, queuedFn = fn), unmatched;
      };
      return bySet ? markFunction(superMatcher) : superMatcher;
    }
    var i;
    var support;
    var Expr;
    var getText;
    var isXML;
    var tokenize;
    var compile;
    var select;
    var queuedFn;
    var sortInput;
    var stability;
    var setDocument;
    var doc;
    var docElem;
    var documentIsHTML;
    var rbuggyQSA;
    var rbuggyMatches;
    var matches;
    var contains;
    /** @type {string} */
    var expando = "sizzle" + 1 * new Date;
    var preferredDoc = win.document;
    /** @type {number} */
    var dirruns = 0;
    /** @type {number} */
    var done = 0;
    var classCache = createCache();
    var tokenCache = createCache();
    var compilerCache = createCache();
    /**
     * @param {?} type
     * @param {?} code
     * @return {?}
     */
    var a = function(type, code) {
      return type === code && (stability = true), 0;
    };
    /** @type {number} */
    var MAX_NEGATIVE = 1 << 31;
    /** @type {function (this:Object, *): boolean} */
    var hasOwn = {}.hasOwnProperty;
    /** @type {Array} */
    var arr = [];
    /** @type {function (this:(Array.<T>|{length: number})): T} */
    var pop = arr.pop;
    /** @type {function (this:(Array.<T>|{length: number}), ...[T]): number} */
    var push = arr.push;
    /** @type {function (this:(Array.<T>|{length: number}), ...[T]): number} */
    var jQuery = arr.push;
    /** @type {function (this:(Array.<T>|string|{length: number}), *=, *=): Array.<T>} */
    var slice = arr.slice;
    /**
     * @param {Array} a
     * @param {?} obj
     * @return {?}
     */
    var equal = function(a, obj) {
      /** @type {number} */
      var i = 0;
      var l = a.length;
      for (;l > i;i++) {
        if (a[i] === obj) {
          return i;
        }
      }
      return-1;
    };
    /** @type {string} */
    var booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped";
    /** @type {string} */
    var whitespace = "[\\x20\\t\\r\\n\\f]";
    /** @type {string} */
    var ele = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+";
    /** @type {string} */
    var attributes = "\\[" + whitespace + "*(" + ele + ")(?:" + whitespace + "*([*^$|!~]?=)" + whitespace + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + ele + "))|)" + whitespace + "*\\]";
    /** @type {string} */
    var pseudos = ":(" + ele + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|.*)\\)|)";
    /** @type {RegExp} */
    var regexp = new RegExp(whitespace + "+", "g");
    /** @type {RegExp} */
    var rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g");
    /** @type {RegExp} */
    var rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*");
    /** @type {RegExp} */
    var rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*");
    /** @type {RegExp} */
    var rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g");
    /** @type {RegExp} */
    var rpseudo = new RegExp(pseudos);
    /** @type {RegExp} */
    var ridentifier = new RegExp("^" + ele + "$");
    var matchExpr = {
      ID : new RegExp("^#(" + ele + ")"),
      CLASS : new RegExp("^\\.(" + ele + ")"),
      TAG : new RegExp("^(" + ele + "|[*])"),
      ATTR : new RegExp("^" + attributes),
      PSEUDO : new RegExp("^" + pseudos),
      CHILD : new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
      bool : new RegExp("^(?:" + booleans + ")$", "i"),
      needsContext : new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
    };
    /** @type {RegExp} */
    var rinputs = /^(?:input|select|textarea|button)$/i;
    /** @type {RegExp} */
    var rheader = /^h\d$/i;
    /** @type {RegExp} */
    var rnative = /^[^{]+\{\s*\[native \w/;
    /** @type {RegExp} */
    var rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/;
    /** @type {RegExp} */
    var rsibling = /[+~]/;
    /** @type {RegExp} */
    var rreturn = /'|\\/g;
    /** @type {RegExp} */
    var runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig");
    /**
     * @param {?} _
     * @param {(number|string)} escaped
     * @param {boolean} escapedWhitespace
     * @return {?}
     */
    var funescape = function(_, escaped, escapedWhitespace) {
      /** @type {number} */
      var high = "0x" + escaped - 65536;
      return high !== high || escapedWhitespace ? escaped : 0 > high ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, 1023 & high | 56320);
    };
    /**
     * @return {undefined}
     */
    var f = function() {
      setDocument();
    };
    try {
      jQuery.apply(arr = slice.call(preferredDoc.childNodes), preferredDoc.childNodes);
      arr[preferredDoc.childNodes.length].nodeType;
    } catch (Ce) {
      jQuery = {
        /** @type {function (?, ?): undefined} */
        apply : arr.length ? function(a, obj) {
          push.apply(a, slice.call(obj));
        } : function(a, str) {
          var j = a.length;
          /** @type {number} */
          var endPos = 0;
          for (;a[j++] = str[endPos++];) {
          }
          /** @type {number} */
          a.length = j - 1;
        }
      };
    }
    support = Sizzle.support = {};
    /** @type {function (Object): ?} */
    isXML = Sizzle.isXML = function(elem) {
      var node = elem && (elem.ownerDocument || elem).documentElement;
      return node ? "HTML" !== node.nodeName : false;
    };
    /** @type {function (Node): ?} */
    setDocument = Sizzle.setDocument = function(node) {
      var n;
      var win;
      var result = node ? node.ownerDocument || node : preferredDoc;
      return result !== doc && (9 === result.nodeType && result.documentElement) ? (doc = result, docElem = doc.documentElement, documentIsHTML = !isXML(doc), (win = doc.defaultView) && (win.top !== win && (win.addEventListener ? win.addEventListener("unload", f, false) : win.attachEvent && win.attachEvent("onunload", f))), support.attributes = assert(function(div) {
        return div.className = "i", !div.getAttribute("className");
      }), support.getElementsByTagName = assert(function(div) {
        return div.appendChild(doc.createComment("")), !div.getElementsByTagName("*").length;
      }), support.getElementsByClassName = rnative.test(doc.getElementsByClassName), support.getById = assert(function(div) {
        return docElem.appendChild(div).id = expando, !doc.getElementsByName || !doc.getElementsByName(expando).length;
      }), support.getById ? (Expr.find.ID = function(id, context) {
        if ("undefined" != typeof context.getElementById && documentIsHTML) {
          var m = context.getElementById(id);
          return m ? [m] : [];
        }
      }, Expr.filter.ID = function(id) {
        var attrId = id.replace(runescape, funescape);
        return function(elem) {
          return elem.getAttribute("id") === attrId;
        };
      }) : (delete Expr.find.ID, Expr.filter.ID = function(id) {
        var attrId = id.replace(runescape, funescape);
        return function(elem) {
          var node = "undefined" != typeof elem.getAttributeNode && elem.getAttributeNode("id");
          return node && node.value === attrId;
        };
      }), Expr.find.TAG = support.getElementsByTagName ? function(selector, el) {
        return "undefined" != typeof el.getElementsByTagName ? el.getElementsByTagName(selector) : support.qsa ? el.querySelectorAll(selector) : void 0;
      } : function(tag, from) {
        var cur;
        /** @type {Array} */
        var eventPath = [];
        /** @type {number} */
        var ri = 0;
        var tmp = from.getElementsByTagName(tag);
        if ("*" === tag) {
          for (;cur = tmp[ri++];) {
            if (1 === cur.nodeType) {
              eventPath.push(cur);
            }
          }
          return eventPath;
        }
        return tmp;
      }, Expr.find.CLASS = support.getElementsByClassName && function(dataAndEvents, instanceMethods) {
          return "undefined" != typeof instanceMethods.getElementsByClassName && documentIsHTML ? instanceMethods.getElementsByClassName(dataAndEvents) : void 0;
        }, rbuggyMatches = [], rbuggyQSA = [], (support.qsa = rnative.test(doc.querySelectorAll)) && (assert(function(div) {
        /** @type {string} */
        docElem.appendChild(div).innerHTML = "<a id='" + expando + "'></a><select id='" + expando + "-\r\\' msallowcapture=''><option selected=''></option></select>";
        if (div.querySelectorAll("[msallowcapture^='']").length) {
          rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
        }
        if (!div.querySelectorAll("[selected]").length) {
          rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
        }
        if (!div.querySelectorAll("[id~=" + expando + "-]").length) {
          rbuggyQSA.push("~=");
        }
        if (!div.querySelectorAll(":checked").length) {
          rbuggyQSA.push(":checked");
        }
        if (!div.querySelectorAll("a#" + expando + "+*").length) {
          rbuggyQSA.push(".#.+[+~]");
        }
      }), assert(function(div) {
        var input = doc.createElement("input");
        input.setAttribute("type", "hidden");
        div.appendChild(input).setAttribute("name", "D");
        if (div.querySelectorAll("[name=d]").length) {
          rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
        }
        if (!div.querySelectorAll(":enabled").length) {
          rbuggyQSA.push(":enabled", ":disabled");
        }
        div.querySelectorAll("*,:x");
        rbuggyQSA.push(",.*:");
      })), (support.matchesSelector = rnative.test(matches = docElem.matches || (docElem.webkitMatchesSelector || (docElem.mozMatchesSelector || (docElem.oMatchesSelector || docElem.msMatchesSelector))))) && assert(function(div) {
        support.disconnectedMatch = matches.call(div, "div");
        matches.call(div, "[s!='']:x");
        rbuggyMatches.push("!=", pseudos);
      }), rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|")), rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|")), n = rnative.test(docElem.compareDocumentPosition), contains = n || rnative.test(docElem.contains) ? function(a, b) {
        var adown = 9 === a.nodeType ? a.documentElement : a;
        var bup = b && b.parentNode;
        return a === bup || !(!bup || (1 !== bup.nodeType || !(adown.contains ? adown.contains(bup) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(bup))));
      } : function(a, b) {
        if (b) {
          for (;b = b.parentNode;) {
            if (b === a) {
              return true;
            }
          }
        }
        return false;
      }, a = n ? function(a, b) {
        if (a === b) {
          return stability = true, 0;
        }
        /** @type {number} */
        var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
        return compare ? compare : (compare = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 1 & compare || !support.sortDetached && b.compareDocumentPosition(a) === compare ? a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ? -1 : b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ? 1 : sortInput ? equal(sortInput, a) - equal(sortInput, b) : 0 : 4 & compare ? -1 : 1);
      } : function(a, b) {
        if (a === b) {
          return stability = true, 0;
        }
        var cur;
        /** @type {number} */
        var i = 0;
        var aup = a.parentNode;
        var bup = b.parentNode;
        /** @type {Array} */
        var ap = [a];
        /** @type {Array} */
        var bp = [b];
        if (!aup || !bup) {
          return a === doc ? -1 : b === doc ? 1 : aup ? -1 : bup ? 1 : sortInput ? equal(sortInput, a) - equal(sortInput, b) : 0;
        }
        if (aup === bup) {
          return siblingCheck(a, b);
        }
        /** @type {string} */
        cur = a;
        for (;cur = cur.parentNode;) {
          ap.unshift(cur);
        }
        /** @type {string} */
        cur = b;
        for (;cur = cur.parentNode;) {
          bp.unshift(cur);
        }
        for (;ap[i] === bp[i];) {
          i++;
        }
        return i ? siblingCheck(ap[i], bp[i]) : ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0;
      }, doc) : doc;
    };
    /**
     * @param {Function} expr
     * @param {Array} elements
     * @return {?}
     */
    Sizzle.matches = function(expr, elements) {
      return Sizzle(expr, null, null, elements);
    };
    /**
     * @param {HTMLElement} elem
     * @param {string} expr
     * @return {?}
     */
    Sizzle.matchesSelector = function(elem, expr) {
      if ((elem.ownerDocument || elem) !== doc && setDocument(elem), expr = expr.replace(rattributeQuotes, "='$1']"), support.matchesSelector && (documentIsHTML && (!compilerCache[expr + " "] && ((!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr)))))) {
        try {
          var ret = matches.call(elem, expr);
          if (ret || (support.disconnectedMatch || elem.document && 11 !== elem.document.nodeType)) {
            return ret;
          }
        } catch (r) {
        }
      }
      return Sizzle(expr, doc, null, [elem]).length > 0;
    };
    /**
     * @param {HTMLElement} context
     * @param {Object} b
     * @return {?}
     */
    Sizzle.contains = function(context, b) {
      return(context.ownerDocument || context) !== doc && setDocument(context), contains(context, b);
    };
    /**
     * @param {Object} elem
     * @param {string} name
     * @return {?}
     */
    Sizzle.attr = function(elem, name) {
      if ((elem.ownerDocument || elem) !== doc) {
        setDocument(elem);
      }
      var fn = Expr.attrHandle[name.toLowerCase()];
      var val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : void 0;
      return void 0 !== val ? val : support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
    };
    /**
     * @param {Function} obj
     * @return {?}
     */
    Sizzle.error = function(obj) {
      throw new Error("Syntax error, unrecognized expression: " + obj);
    };
    /**
     * @param {Array} results
     * @return {?}
     */
    Sizzle.uniqueSort = function(results) {
      var elem;
      /** @type {Array} */
      var duplicates = [];
      /** @type {number} */
      var j = 0;
      /** @type {number} */
      var i = 0;
      if (stability = !support.detectDuplicates, sortInput = !support.sortStable && results.slice(0), results.sort(a), stability) {
        for (;elem = results[i++];) {
          if (elem === results[i]) {
            /** @type {number} */
            j = duplicates.push(i);
          }
        }
        for (;j--;) {
          results.splice(duplicates[j], 1);
        }
      }
      return sortInput = null, results;
    };
    /** @type {function (string): ?} */
    getText = Sizzle.getText = function(obj) {
      var node;
      /** @type {string} */
      var ret = "";
      /** @type {number} */
      var d = 0;
      var type = obj.nodeType;
      if (type) {
        if (1 === type || (9 === type || 11 === type)) {
          if ("string" == typeof obj.textContent) {
            return obj.textContent;
          }
          obj = obj.firstChild;
          for (;obj;obj = obj.nextSibling) {
            ret += getText(obj);
          }
        } else {
          if (3 === type || 4 === type) {
            return obj.nodeValue;
          }
        }
      } else {
        for (;node = obj[d++];) {
          ret += getText(node);
        }
      }
      return ret;
    };
    Expr = Sizzle.selectors = {
      cacheLength : 50,
      /** @type {function (Function): ?} */
      createPseudo : markFunction,
      match : matchExpr,
      attrHandle : {},
      find : {},
      relative : {
        ">" : {
          dir : "parentNode",
          first : true
        },
        " " : {
          dir : "parentNode"
        },
        "+" : {
          dir : "previousSibling",
          first : true
        },
        "~" : {
          dir : "previousSibling"
        }
      },
      preFilter : {
        /**
         * @param {Array} match
         * @return {?}
         */
        ATTR : function(match) {
          return match[1] = match[1].replace(runescape, funescape), match[3] = (match[3] || (match[4] || (match[5] || ""))).replace(runescape, funescape), "~=" === match[2] && (match[3] = " " + match[3] + " "), match.slice(0, 4);
        },
        /**
         * @param {Array} match
         * @return {?}
         */
        CHILD : function(match) {
          return match[1] = match[1].toLowerCase(), "nth" === match[1].slice(0, 3) ? (match[3] || Sizzle.error(match[0]), match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * ("even" === match[3] || "odd" === match[3])), match[5] = +(match[7] + match[8] || "odd" === match[3])) : match[3] && Sizzle.error(match[0]), match;
        },
        /**
         * @param {Array} match
         * @return {?}
         */
        PSEUDO : function(match) {
          var excess;
          var unquoted = !match[6] && match[2];
          return matchExpr.CHILD.test(match[0]) ? null : (match[3] ? match[2] = match[4] || (match[5] || "") : unquoted && (rpseudo.test(unquoted) && ((excess = tokenize(unquoted, true)) && ((excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length) && (match[0] = match[0].slice(0, excess), match[2] = unquoted.slice(0, excess))))), match.slice(0, 3));
        }
      },
      filter : {
        /**
         * @param {string} nodeNameSelector
         * @return {?}
         */
        TAG : function(nodeNameSelector) {
          var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
          return "*" === nodeNameSelector ? function() {
            return true;
          } : function(elem) {
            return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
          };
        },
        /**
         * @param {string} dataAndEvents
         * @return {?}
         */
        CLASS : function(dataAndEvents) {
          var pattern = classCache[dataAndEvents + " "];
          return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + dataAndEvents + "(" + whitespace + "|$)")) && classCache(dataAndEvents, function(elem) {
              return pattern.test("string" == typeof elem.className && elem.className || ("undefined" != typeof elem.getAttribute && elem.getAttribute("class") || ""));
            });
        },
        /**
         * @param {string} name
         * @param {string} not
         * @param {string} check
         * @return {?}
         */
        ATTR : function(name, not, check) {
          return function(elem) {
            var result = Sizzle.attr(elem, name);
            return null == result ? "!=" === not : not ? (result += "", "=" === not ? result === check : "!=" === not ? result !== check : "^=" === not ? check && 0 === result.indexOf(check) : "*=" === not ? check && result.indexOf(check) > -1 : "$=" === not ? check && result.slice(-check.length) === check : "~=" === not ? (" " + result.replace(regexp, " ") + " ").indexOf(check) > -1 : "|=" === not ? result === check || result.slice(0, check.length + 1) === check + "-" : false) : true;
          };
        },
        /**
         * @param {string} type
         * @param {string} argument
         * @param {?} dataAndEvents
         * @param {boolean} first
         * @param {number} last
         * @return {?}
         */
        CHILD : function(type, argument, dataAndEvents, first, last) {
          /** @type {boolean} */
          var simple = "nth" !== type.slice(0, 3);
          /** @type {boolean} */
          var forward = "last" !== type.slice(-4);
          /** @type {boolean} */
          var ofType = "of-type" === argument;
          return 1 === first && 0 === last ? function(contestant) {
            return!!contestant.parentNode;
          } : function(elem, deepDataAndEvents, dataAndEvents) {
            var cache;
            var outerCache;
            var options;
            var node;
            var nodeIndex;
            var eventPath;
            /** @type {string} */
            var which = simple !== forward ? "nextSibling" : "previousSibling";
            var parent = elem.parentNode;
            var name = ofType && elem.nodeName.toLowerCase();
            /** @type {boolean} */
            var useCache = !dataAndEvents && !ofType;
            /** @type {boolean} */
            var diff = false;
            if (parent) {
              if (simple) {
                for (;which;) {
                  /** @type {Node} */
                  node = elem;
                  for (;node = node[which];) {
                    if (ofType ? node.nodeName.toLowerCase() === name : 1 === node.nodeType) {
                      return false;
                    }
                  }
                  /** @type {(boolean|string)} */
                  eventPath = which = "only" === type && (!eventPath && "nextSibling");
                }
                return true;
              }
              if (eventPath = [forward ? parent.firstChild : parent.lastChild], forward && useCache) {
                node = parent;
                options = node[expando] || (node[expando] = {});
                outerCache = options[node.uniqueID] || (options[node.uniqueID] = {});
                cache = outerCache[type] || [];
                nodeIndex = cache[0] === dirruns && cache[1];
                diff = nodeIndex && cache[2];
                node = nodeIndex && parent.childNodes[nodeIndex];
                for (;node = ++nodeIndex && (node && node[which]) || ((diff = nodeIndex = 0) || eventPath.pop());) {
                  if (1 === node.nodeType && (++diff && node === elem)) {
                    /** @type {Array} */
                    outerCache[type] = [dirruns, nodeIndex, diff];
                    break;
                  }
                }
              } else {
                if (useCache && (node = elem, options = node[expando] || (node[expando] = {}), outerCache = options[node.uniqueID] || (options[node.uniqueID] = {}), cache = outerCache[type] || [], nodeIndex = cache[0] === dirruns && cache[1], diff = nodeIndex), diff === false) {
                  for (;(node = ++nodeIndex && (node && node[which]) || ((diff = nodeIndex = 0) || eventPath.pop())) && ((ofType ? node.nodeName.toLowerCase() !== name : 1 !== node.nodeType) || (!++diff || (useCache && (options = node[expando] || (node[expando] = {}), outerCache = options[node.uniqueID] || (options[node.uniqueID] = {}), outerCache[type] = [dirruns, diff]), node !== elem)));) {
                  }
                }
              }
              return diff -= last, diff === first || diff % first === 0 && diff / first >= 0;
            }
          };
        },
        /**
         * @param {string} pseudo
         * @param {?} context
         * @return {?}
         */
        PSEUDO : function(pseudo, context) {
          var args;
          var fn = Expr.pseudos[pseudo] || (Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo));
          return fn[expando] ? fn(context) : fn.length > 1 ? (args = [pseudo, pseudo, "", context], Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(obj, target) {
            var prop;
            var source = fn(obj, context);
            var i = source.length;
            for (;i--;) {
              prop = equal(obj, source[i]);
              /** @type {boolean} */
              obj[prop] = !(target[prop] = source[i]);
            }
          }) : function(err) {
            return fn(err, 0, args);
          }) : fn;
        }
      },
      pseudos : {
        not : markFunction(function(selector) {
          /** @type {Array} */
          var elem = [];
          /** @type {Array} */
          var memory = [];
          var matcher = compile(selector.replace(rtrim, "$1"));
          return matcher[expando] ? markFunction(function(seed, qs, dataAndEvents, xml) {
            var val;
            var unmatched = matcher(seed, null, xml, []);
            var i = seed.length;
            for (;i--;) {
              if (val = unmatched[i]) {
                /** @type {boolean} */
                seed[i] = !(qs[i] = val);
              }
            }
          }) : function(value, dataAndEvents, xml) {
            return elem[0] = value, matcher(elem, null, xml, memory), elem[0] = null, !memory.pop();
          };
        }),
        has : markFunction(function(selector) {
          return function(elem) {
            return Sizzle(selector, elem).length > 0;
          };
        }),
        contains : markFunction(function(id) {
          return id = id.replace(runescape, funescape), function(elem) {
            return(elem.textContent || (elem.innerText || getText(elem))).indexOf(id) > -1;
          };
        }),
        lang : markFunction(function(lang) {
          return ridentifier.test(lang || "") || Sizzle.error("unsupported lang: " + lang), lang = lang.replace(runescape, funescape).toLowerCase(), function(elem) {
            var elemLang;
            do {
              if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {
                return elemLang = elemLang.toLowerCase(), elemLang === lang || 0 === elemLang.indexOf(lang + "-");
              }
            } while ((elem = elem.parentNode) && 1 === elem.nodeType);
            return false;
          };
        }),
        /**
         * @param {Function} obj
         * @return {?}
         */
        target : function(obj) {
          var models = win.location && win.location.hash;
          return models && models.slice(1) === obj.id;
        },
        /**
         * @param {string} elem
         * @return {?}
         */
        root : function(elem) {
          return elem === docElem;
        },
        /**
         * @param {Function} obj
         * @return {?}
         */
        focus : function(obj) {
          return obj === doc.activeElement && ((!doc.hasFocus || doc.hasFocus()) && !!(obj.type || (obj.href || ~obj.tabIndex)));
        },
        /**
         * @param {EventTarget} a
         * @return {?}
         */
        enabled : function(a) {
          return a.disabled === false;
        },
        /**
         * @param {Element} a
         * @return {?}
         */
        disabled : function(a) {
          return a.disabled === true;
        },
        /**
         * @param {Function} obj
         * @return {?}
         */
        checked : function(obj) {
          var b = obj.nodeName.toLowerCase();
          return "input" === b && !!obj.checked || "option" === b && !!obj.selected;
        },
        /**
         * @param {Node} elem
         * @return {?}
         */
        selected : function(elem) {
          return elem.parentNode && elem.parentNode.selectedIndex, elem.selected === true;
        },
        /**
         * @param {Object} elem
         * @return {?}
         */
        empty : function(elem) {
          elem = elem.firstChild;
          for (;elem;elem = elem.nextSibling) {
            if (elem.nodeType < 6) {
              return false;
            }
          }
          return true;
        },
        /**
         * @param {Object} elem
         * @return {?}
         */
        parent : function(elem) {
          return!Expr.pseudos.empty(elem);
        },
        /**
         * @param {Node} elem
         * @return {?}
         */
        header : function(elem) {
          return rheader.test(elem.nodeName);
        },
        /**
         * @param {Node} elem
         * @return {?}
         */
        input : function(elem) {
          return rinputs.test(elem.nodeName);
        },
        /**
         * @param {Node} elem
         * @return {?}
         */
        button : function(elem) {
          var b = elem.nodeName.toLowerCase();
          return "input" === b && "button" === elem.type || "button" === b;
        },
        /**
         * @param {Function} obj
         * @return {?}
         */
        text : function(obj) {
          var evt;
          return "input" === obj.nodeName.toLowerCase() && ("text" === obj.type && (null == (evt = obj.getAttribute("type")) || "text" === evt.toLowerCase()));
        },
        first : createPositionalPseudo(function() {
          return[0];
        }),
        last : createPositionalPseudo(function(dataAndEvents, deepDataAndEvents) {
          return[deepDataAndEvents - 1];
        }),
        eq : createPositionalPseudo(function(dataAndEvents, length, index) {
          return[0 > index ? index + length : index];
        }),
        even : createPositionalPseudo(function(assigns, dataAndEvents) {
          /** @type {number} */
          var vvar = 0;
          for (;dataAndEvents > vvar;vvar += 2) {
            assigns.push(vvar);
          }
          return assigns;
        }),
        odd : createPositionalPseudo(function(assigns, dataAndEvents) {
          /** @type {number} */
          var vvar = 1;
          for (;dataAndEvents > vvar;vvar += 2) {
            assigns.push(vvar);
          }
          return assigns;
        }),
        lt : createPositionalPseudo(function(assigns, length, index) {
          var vvar = 0 > index ? index + length : index;
          for (;--vvar >= 0;) {
            assigns.push(vvar);
          }
          return assigns;
        }),
        gt : createPositionalPseudo(function(assigns, length, index) {
          var vvar = 0 > index ? index + length : index;
          for (;++vvar < length;) {
            assigns.push(vvar);
          }
          return assigns;
        })
      }
    };
    Expr.pseudos.nth = Expr.pseudos.eq;
    for (i in{
      radio : true,
      checkbox : true,
      file : true,
      password : true,
      image : true
    }) {
      Expr.pseudos[i] = createInputPseudo(i);
    }
    for (i in{
      submit : true,
      reset : true
    }) {
      Expr.pseudos[i] = createButtonPseudo(i);
    }
    return setFilters.prototype = Expr.filters = Expr.pseudos, Expr.setFilters = new setFilters, tokenize = Sizzle.tokenize = function(walkers, parseOnly) {
      var matched;
      var match;
      var tokens;
      var type;
      var soFar;
      var groups;
      var preFilters;
      var cached = tokenCache[walkers + " "];
      if (cached) {
        return parseOnly ? 0 : cached.slice(0);
      }
      /** @type {Function} */
      soFar = walkers;
      /** @type {Array} */
      groups = [];
      preFilters = Expr.preFilter;
      for (;soFar;) {
        if (!(matched && !(match = rcomma.exec(soFar)))) {
          if (match) {
            soFar = soFar.slice(match[0].length) || soFar;
          }
          groups.push(tokens = []);
        }
        /** @type {boolean} */
        matched = false;
        if (match = rcombinators.exec(soFar)) {
          /** @type {string} */
          matched = match.shift();
          tokens.push({
            value : matched,
            type : match[0].replace(rtrim, " ")
          });
          soFar = soFar.slice(matched.length);
        }
        for (type in Expr.filter) {
          if (!!(match = matchExpr[type].exec(soFar))) {
            if (!(preFilters[type] && !(match = preFilters[type](match)))) {
              matched = match.shift();
              tokens.push({
                value : matched,
                type : type,
                matches : match
              });
              soFar = soFar.slice(matched.length);
            }
          }
        }
        if (!matched) {
          break;
        }
      }
      return parseOnly ? soFar.length : soFar ? Sizzle.error(walkers) : tokenCache(walkers, groups).slice(0);
    }, compile = Sizzle.compile = function(selector, group) {
      var i;
      /** @type {Array} */
      var setMatchers = [];
      /** @type {Array} */
      var elementMatchers = [];
      var cached = compilerCache[selector + " "];
      if (!cached) {
        if (!group) {
          group = tokenize(selector);
        }
        i = group.length;
        for (;i--;) {
          cached = matcherFromTokens(group[i]);
          if (cached[expando]) {
            setMatchers.push(cached);
          } else {
            elementMatchers.push(cached);
          }
        }
        cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));
        /** @type {string} */
        cached.selector = selector;
      }
      return cached;
    }, select = Sizzle.select = function(selector, context, results, qualifier) {
      var i;
      var tokens;
      var token;
      var type;
      var find;
      /** @type {(Function|boolean)} */
      var compiled = "function" == typeof selector && selector;
      var match = !qualifier && tokenize(selector = compiled.selector || selector);
      if (results = results || [], 1 === match.length) {
        if (tokens = match[0] = match[0].slice(0), tokens.length > 2 && ("ID" === (token = tokens[0]).type && (support.getById && (9 === context.nodeType && (documentIsHTML && Expr.relative[tokens[1].type]))))) {
          if (context = (Expr.find.ID(token.matches[0].replace(runescape, funescape), context) || [])[0], !context) {
            return results;
          }
          if (compiled) {
            context = context.parentNode;
          }
          selector = selector.slice(tokens.shift().value.length);
        }
        i = matchExpr.needsContext.test(selector) ? 0 : tokens.length;
        for (;i-- && (token = tokens[i], !Expr.relative[type = token.type]);) {
          if ((find = Expr.find[type]) && (qualifier = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context))) {
            if (tokens.splice(i, 1), selector = qualifier.length && toSelector(tokens), !selector) {
              return jQuery.apply(results, qualifier), results;
            }
            break;
          }
        }
      }
      return(compiled || compile(selector, match))(qualifier, context, !documentIsHTML, results, !context || (rsibling.test(selector) && testContext(context.parentNode) || context)), results;
    }, support.sortStable = expando.split("").sort(a).join("") === expando, support.detectDuplicates = !!stability, setDocument(), support.sortDetached = assert(function(div1) {
      return 1 & div1.compareDocumentPosition(doc.createElement("div"));
    }), assert(function(div) {
      return div.innerHTML = "<a href='#'></a>", "#" === div.firstChild.getAttribute("href");
    }) || addHandle("type|href|height|width", function(elem, name, flag_xml) {
      return flag_xml ? void 0 : elem.getAttribute(name, "type" === name.toLowerCase() ? 1 : 2);
    }), support.attributes && assert(function(div) {
      return div.innerHTML = "<input/>", div.firstChild.setAttribute("value", ""), "" === div.firstChild.getAttribute("value");
    }) || addHandle("value", function(target, dataAndEvents, defaultValue) {
      return defaultValue || "input" !== target.nodeName.toLowerCase() ? void 0 : target.defaultValue;
    }), assert(function(div) {
      return null == div.getAttribute("disabled");
    }) || addHandle(booleans, function(elem, name, dataAndEvents) {
      var val;
      return dataAndEvents ? void 0 : elem[name] === true ? name.toLowerCase() : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
    }), Sizzle;
  }(win);
  jQuery.find = Sizzle;
  jQuery.expr = Sizzle.selectors;
  jQuery.expr[":"] = jQuery.expr.pseudos;
  jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
  jQuery.text = Sizzle.getText;
  jQuery.isXMLDoc = Sizzle.isXML;
  jQuery.contains = Sizzle.contains;
  /**
   * @param {Object} elem
   * @param {string} dir
   * @param {string} until
   * @return {?}
   */
  var dir = function(elem, dir, until) {
    /** @type {Array} */
    var matched = [];
    /** @type {boolean} */
    var truncate = void 0 !== until;
    for (;(elem = elem[dir]) && 9 !== elem.nodeType;) {
      if (1 === elem.nodeType) {
        if (truncate && jQuery(elem).is(until)) {
          break;
        }
        matched.push(elem);
      }
    }
    return matched;
  };
  /**
   * @param {Object} n
   * @param {Object} elem
   * @return {?}
   */
  var sibling = function(n, elem) {
    /** @type {Array} */
    var r = [];
    for (;n;n = n.nextSibling) {
      if (1 === n.nodeType) {
        if (n !== elem) {
          r.push(n);
        }
      }
    }
    return r;
  };
  var rneedsContext = jQuery.expr.match.needsContext;
  /** @type {RegExp} */
  var rsingleTag = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/;
  /** @type {RegExp} */
  var isSimple = /^.[^:#\[\.,]*$/;
  /**
   * @param {Function} obj
   * @param {?} value
   * @param {Object} iterator
   * @return {?}
   */
  jQuery.filter = function(obj, value, iterator) {
    var elem = value[0];
    return iterator && (obj = ":not(" + obj + ")"), 1 === value.length && 1 === elem.nodeType ? jQuery.find.matchesSelector(elem, obj) ? [elem] : [] : jQuery.find.matches(obj, jQuery.grep(value, function(dest) {
      return 1 === dest.nodeType;
    }));
  };
  jQuery.fn.extend({
    /**
     * @param {?} selector
     * @return {?}
     */
    find : function(selector) {
      var i;
      /** @type {Array} */
      var ret = [];
      var self = this;
      var len = self.length;
      if ("string" != typeof selector) {
        return this.pushStack(jQuery(selector).filter(function() {
          /** @type {number} */
          i = 0;
          for (;len > i;i++) {
            if (jQuery.contains(self[i], this)) {
              return true;
            }
          }
        }));
      }
      /** @type {number} */
      i = 0;
      for (;len > i;i++) {
        jQuery.find(selector, self[i], ret);
      }
      return ret = this.pushStack(len > 1 ? jQuery.unique(ret) : ret), ret.selector = this.selector ? this.selector + " " + selector : selector, ret;
    },
    /**
     * @param {Function} obj
     * @return {?}
     */
    filter : function(obj) {
      return this.pushStack(winnow(this, obj || [], false));
    },
    /**
     * @param {Array} selector
     * @return {?}
     */
    not : function(selector) {
      return this.pushStack(winnow(this, selector || [], true));
    },
    /**
     * @param {string} selector
     * @return {?}
     */
    is : function(selector) {
      return!!winnow(this, "string" == typeof selector && rneedsContext.test(selector) ? jQuery(selector) : selector || [], false).length;
    }
  });
  var element;
  /** @type {RegExp} */
  var rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
  /** @type {function (Object, Object, Node): ?} */
  var T = jQuery.fn.init = function(selector, context, rootjQuery) {
    var match;
    var elem;
    if (!selector) {
      return this;
    }
    if (rootjQuery = rootjQuery || element, "string" == typeof selector) {
      if (match = "<" === selector.charAt(0) && (">" === selector.charAt(selector.length - 1) && selector.length >= 3) ? [null, selector, null] : rquickExpr.exec(selector), !match || !match[1] && context) {
        return!context || context.jquery ? (context || rootjQuery).find(selector) : this.constructor(context).find(selector);
      }
      if (match[1]) {
        if (context = context instanceof jQuery ? context[0] : context, jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : doc, true)), rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
          for (match in context) {
            if (jQuery.isFunction(this[match])) {
              this[match](context[match]);
            } else {
              this.attr(match, context[match]);
            }
          }
        }
        return this;
      }
      if (elem = doc.getElementById(match[2]), elem && elem.parentNode) {
        if (elem.id !== match[2]) {
          return element.find(selector);
        }
        /** @type {number} */
        this.length = 1;
        this[0] = elem;
      }
      return this.context = doc, this.selector = selector, this;
    }
    return selector.nodeType ? (this.context = this[0] = selector, this.length = 1, this) : jQuery.isFunction(selector) ? "undefined" != typeof rootjQuery.ready ? rootjQuery.ready(selector) : selector(jQuery) : (void 0 !== selector.selector && (this.selector = selector.selector, this.context = selector.context), jQuery.makeArray(selector, this));
  };
  T.prototype = jQuery.fn;
  element = jQuery(doc);
  /** @type {RegExp} */
  var rparentsprev = /^(?:parents|prev(?:Until|All))/;
  var guaranteedUnique = {
    children : true,
    contents : true,
    next : true,
    prev : true
  };
  jQuery.fn.extend({
    /**
     * @param {?} target
     * @return {?}
     */
    has : function(target) {
      var i;
      var targets = jQuery(target, this);
      var l = targets.length;
      return this.filter(function() {
        /** @type {number} */
        i = 0;
        for (;l > i;i++) {
          if (jQuery.contains(this, targets[i])) {
            return true;
          }
        }
      });
    },
    /**
     * @param {Object} selectors
     * @param {Node} context
     * @return {?}
     */
    closest : function(selectors, context) {
      var cur;
      /** @type {number} */
      var i = 0;
      var l = this.length;
      /** @type {Array} */
      var matched = [];
      var pos = rneedsContext.test(selectors) || "string" != typeof selectors ? jQuery(selectors, context || this.context) : 0;
      for (;l > i;i++) {
        cur = this[i];
        for (;cur && cur !== context;cur = cur.parentNode) {
          if (cur.nodeType < 11 && (pos ? pos.index(cur) > -1 : 1 === cur.nodeType && jQuery.find.matchesSelector(cur, selectors))) {
            matched.push(cur);
            break;
          }
        }
      }
      return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
    },
    /**
     * @param {Object} elem
     * @return {?}
     */
    index : function(elem) {
      return elem ? "string" == typeof elem ? jQuery.inArray(this[0], jQuery(elem)) : jQuery.inArray(elem.jquery ? elem[0] : elem, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
    },
    /**
     * @param {Function} selector
     * @param {string} context
     * @return {?}
     */
    add : function(selector, context) {
      return this.pushStack(jQuery.uniqueSort(jQuery.merge(this.get(), jQuery(selector, context))));
    },
    /**
     * @param {?} qualifier
     * @return {?}
     */
    addBack : function(qualifier) {
      return this.add(null == qualifier ? this.prevObject : this.prevObject.filter(qualifier));
    }
  });
  jQuery.each({
    /**
     * @param {Node} elem
     * @return {?}
     */
    parent : function(elem) {
      var parent = elem.parentNode;
      return parent && 11 !== parent.nodeType ? parent : null;
    },
    /**
     * @param {Object} elem
     * @return {?}
     */
    parents : function(elem) {
      return dir(elem, "parentNode");
    },
    /**
     * @param {Object} elem
     * @param {?} i
     * @param {string} until
     * @return {?}
     */
    parentsUntil : function(elem, i, until) {
      return dir(elem, "parentNode", until);
    },
    /**
     * @param {Object} elem
     * @return {?}
     */
    next : function(elem) {
      return _singleSibling(elem, "nextSibling");
    },
    /**
     * @param {Object} elem
     * @return {?}
     */
    prev : function(elem) {
      return _singleSibling(elem, "previousSibling");
    },
    /**
     * @param {Object} elem
     * @return {?}
     */
    nextAll : function(elem) {
      return dir(elem, "nextSibling");
    },
    /**
     * @param {Object} elem
     * @return {?}
     */
    prevAll : function(elem) {
      return dir(elem, "previousSibling");
    },
    /**
     * @param {Object} elem
     * @param {?} i
     * @param {string} until
     * @return {?}
     */
    nextUntil : function(elem, i, until) {
      return dir(elem, "nextSibling", until);
    },
    /**
     * @param {Object} elem
     * @param {?} i
     * @param {string} until
     * @return {?}
     */
    prevUntil : function(elem, i, until) {
      return dir(elem, "previousSibling", until);
    },
    /**
     * @param {HTMLElement} elem
     * @return {?}
     */
    siblings : function(elem) {
      return sibling((elem.parentNode || {}).firstChild, elem);
    },
    /**
     * @param {Element} node
     * @return {?}
     */
    children : function(node) {
      return sibling(node.firstChild);
    },
    /**
     * @param {Element} elem
     * @return {?}
     */
    contents : function(elem) {
      return jQuery.nodeName(elem, "iframe") ? elem.contentDocument || elem.contentWindow.document : jQuery.merge([], elem.childNodes);
    }
  }, function(name, fn) {
    /**
     * @param {?} until
     * @param {?} qualifier
     * @return {?}
     */
    jQuery.fn[name] = function(until, qualifier) {
      var ret = jQuery.map(this, fn, until);
      return "Until" !== name.slice(-5) && (qualifier = until), qualifier && ("string" == typeof qualifier && (ret = jQuery.filter(qualifier, ret))), this.length > 1 && (guaranteedUnique[name] || (ret = jQuery.uniqueSort(ret)), rparentsprev.test(name) && (ret = ret.reverse())), this.pushStack(ret);
    };
  });
  /** @type {RegExp} */
  var core_rnotwhite = /\S+/g;
  /**
   * @param {string} options
   * @return {?}
   */
  jQuery.Callbacks = function(options) {
    options = "string" == typeof options ? createOptions(options) : jQuery.extend({}, options);
    var memory;
    var data;
    var stack;
    var h;
    /** @type {Array} */
    var list = [];
    /** @type {Array} */
    var s = [];
    /** @type {number} */
    var i = -1;
    /**
     * @return {undefined}
     */
    var fire = function() {
      h = options.once;
      /** @type {boolean} */
      stack = memory = true;
      for (;s.length;i = -1) {
        data = s.shift();
        for (;++i < list.length;) {
          if (list[i].apply(data[0], data[1]) === false) {
            if (options.stopOnFalse) {
              i = list.length;
              /** @type {boolean} */
              data = false;
            }
          }
        }
      }
      if (!options.memory) {
        /** @type {boolean} */
        data = false;
      }
      /** @type {boolean} */
      memory = false;
      if (h) {
        /** @type {(Array|string)} */
        list = data ? [] : "";
      }
    };
    var self = {
      /**
       * @return {?}
       */
      add : function() {
        return list && (data && (!memory && (i = list.length - 1, s.push(data))), function add(args) {
          jQuery.each(args, function(dataAndEvents, qualifier) {
            if (jQuery.isFunction(qualifier)) {
              if (!(options.unique && self.has(qualifier))) {
                list.push(qualifier);
              }
            } else {
              if (qualifier) {
                if (qualifier.length) {
                  if ("string" !== jQuery.type(qualifier)) {
                    add(qualifier);
                  }
                }
              }
            }
          });
        }(arguments), data && (!memory && fire())), this;
      },
      /**
       * @return {?}
       */
      remove : function() {
        return jQuery.each(arguments, function(dataAndEvents, arg) {
          var index;
          for (;(index = jQuery.inArray(arg, list, index)) > -1;) {
            list.splice(index, 1);
            if (i >= index) {
              i--;
            }
          }
        }), this;
      },
      /**
       * @param {?} fn
       * @return {?}
       */
      has : function(fn) {
        return fn ? jQuery.inArray(fn, list) > -1 : list.length > 0;
      },
      /**
       * @return {?}
       */
      empty : function() {
        return list && (list = []), this;
      },
      /**
       * @return {?}
       */
      disable : function() {
        return h = s = [], list = data = "", this;
      },
      /**
       * @return {?}
       */
      disabled : function() {
        return!list;
      },
      /**
       * @return {?}
       */
      lock : function() {
        return h = true, data || self.disable(), this;
      },
      /**
       * @return {?}
       */
      locked : function() {
        return!!h;
      },
      /**
       * @param {?} context
       * @param {Array} args
       * @return {?}
       */
      fireWith : function(context, args) {
        return h || (args = args || [], args = [context, args.slice ? args.slice() : args], s.push(args), memory || fire()), this;
      },
      /**
       * @return {?}
       */
      fire : function() {
        return self.fireWith(this, arguments), this;
      },
      /**
       * @return {?}
       */
      fired : function() {
        return!!stack;
      }
    };
    return self;
  };
  jQuery.extend({
    /**
     * @param {Function} func
     * @return {?}
     */
    Deferred : function(func) {
      /** @type {Array} */
      var which = [["resolve", "done", jQuery.Callbacks("once memory"), "resolved"], ["reject", "fail", jQuery.Callbacks("once memory"), "rejected"], ["notify", "progress", jQuery.Callbacks("memory")]];
      /** @type {string} */
      var state = "pending";
      var promise = {
        /**
         * @return {?}
         */
        state : function() {
          return state;
        },
        /**
         * @return {?}
         */
        always : function() {
          return deferred.done(arguments).fail(arguments), this;
        },
        /**
         * @return {?}
         */
        then : function() {
          /** @type {Arguments} */
          var fns = arguments;
          return jQuery.Deferred(function(newDefer) {
            jQuery.each(which, function(i, tuple) {
              var fn = jQuery.isFunction(fns[i]) && fns[i];
              deferred[tuple[1]](function() {
                var returned = fn && fn.apply(this, arguments);
                if (returned && jQuery.isFunction(returned.promise)) {
                  returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);
                } else {
                  newDefer[tuple[0] + "With"](this === promise ? newDefer.promise() : this, fn ? [returned] : arguments);
                }
              });
            });
            /** @type {null} */
            fns = null;
          }).promise();
        },
        /**
         * @param {string} obj
         * @return {?}
         */
        promise : function(obj) {
          return null != obj ? jQuery.extend(obj, promise) : promise;
        }
      };
      var deferred = {};
      return promise.pipe = promise.then, jQuery.each(which, function(dataAndEvents, tuple) {
        var list = tuple[2];
        var stateString = tuple[3];
        promise[tuple[1]] = list.add;
        if (stateString) {
          list.add(function() {
            state = stateString;
          }, which[1 ^ dataAndEvents][2].disable, which[2][2].lock);
        }
        /**
         * @return {?}
         */
        deferred[tuple[0]] = function() {
          return deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments), this;
        };
        deferred[tuple[0] + "With"] = list.fireWith;
      }), promise.promise(deferred), func && func.call(deferred, deferred), deferred;
    },
    /**
     * @param {Object} subordinate
     * @return {?}
     */
    when : function(subordinate) {
      var progressValues;
      var progressContexts;
      var resolveContexts;
      /** @type {number} */
      var i = 0;
      /** @type {Array.<?>} */
      var resolveValues = core_slice.call(arguments);
      /** @type {number} */
      var length = resolveValues.length;
      /** @type {number} */
      var remaining = 1 !== length || subordinate && jQuery.isFunction(subordinate.promise) ? length : 0;
      var deferred = 1 === remaining ? subordinate : jQuery.Deferred();
      /**
       * @param {number} i
       * @param {(Array|NodeList)} contexts
       * @param {Array} values
       * @return {?}
       */
      var updateFunc = function(i, contexts, values) {
        return function(value) {
          contexts[i] = this;
          values[i] = arguments.length > 1 ? core_slice.call(arguments) : value;
          if (values === progressValues) {
            deferred.notifyWith(contexts, values);
          } else {
            if (!--remaining) {
              deferred.resolveWith(contexts, values);
            }
          }
        };
      };
      if (length > 1) {
        /** @type {Array} */
        progressValues = new Array(length);
        /** @type {Array} */
        progressContexts = new Array(length);
        /** @type {Array} */
        resolveContexts = new Array(length);
        for (;length > i;i++) {
          if (resolveValues[i] && jQuery.isFunction(resolveValues[i].promise)) {
            resolveValues[i].promise().progress(updateFunc(i, progressContexts, progressValues)).done(updateFunc(i, resolveContexts, resolveValues)).fail(deferred.reject);
          } else {
            --remaining;
          }
        }
      }
      return remaining || deferred.resolveWith(resolveContexts, resolveValues), deferred.promise();
    }
  });
  var readyList;
  /**
   * @param {Function} walkers
   * @return {?}
   */
  jQuery.fn.ready = function(walkers) {
    return jQuery.ready.promise().done(walkers), this;
  };
  jQuery.extend({
    isReady : false,
    readyWait : 1,
    /**
     * @param {?} hold
     * @return {undefined}
     */
    holdReady : function(hold) {
      if (hold) {
        jQuery.readyWait++;
      } else {
        jQuery.ready(true);
      }
    },
    /**
     * @param {boolean} wait
     * @return {undefined}
     */
    ready : function(wait) {
      if (!(wait === true ? --jQuery.readyWait : jQuery.isReady)) {
        /** @type {boolean} */
        jQuery.isReady = true;
        if (!(wait !== true && --jQuery.readyWait > 0)) {
          readyList.resolveWith(doc, [jQuery]);
          if (jQuery.fn.triggerHandler) {
            jQuery(doc).triggerHandler("ready");
            jQuery(doc).off("ready");
          }
        }
      }
    }
  });
  /**
   * @param {string} obj
   * @return {?}
   */
  jQuery.ready.promise = function(obj) {
    if (!readyList) {
      if (readyList = jQuery.Deferred(), "complete" === doc.readyState || "loading" !== doc.readyState && !doc.documentElement.doScroll) {
        win.setTimeout(jQuery.ready);
      } else {
        if (doc.addEventListener) {
          doc.addEventListener("DOMContentLoaded", handler);
          win.addEventListener("load", handler);
        } else {
          doc.attachEvent("onreadystatechange", handler);
          win.attachEvent("onload", handler);
          /** @type {boolean} */
          var tempNode = false;
          try {
            tempNode = null == win.frameElement && doc.documentElement;
          } catch (i) {
          }
          if (tempNode) {
            if (tempNode.doScroll) {
              !function doScrollCheck() {
                if (!jQuery.isReady) {
                  try {
                    tempNode.doScroll("left");
                  } catch (t) {
                    return win.setTimeout(doScrollCheck, 50);
                  }
                  domReady();
                  jQuery.ready();
                }
              }();
            }
          }
        }
      }
    }
    return readyList.promise(obj);
  };
  jQuery.ready.promise();
  var i;
  for (i in jQuery(support)) {
    break;
  }
  /** @type {boolean} */
  support.ownFirst = "0" === i;
  /** @type {boolean} */
  support.inlineBlockNeedsLayout = false;
  jQuery(function() {
    var xhrSupported;
    var div;
    var body;
    var container;
    body = doc.getElementsByTagName("body")[0];
    if (body) {
      if (body.style) {
        div = doc.createElement("div");
        container = doc.createElement("div");
        /** @type {string} */
        container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
        body.appendChild(container).appendChild(div);
        if ("undefined" != typeof div.style.zoom) {
          /** @type {string} */
          div.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1";
          /** @type {boolean} */
          support.inlineBlockNeedsLayout = xhrSupported = 3 === div.offsetWidth;
          if (xhrSupported) {
            /** @type {number} */
            body.style.zoom = 1;
          }
        }
        body.removeChild(container);
      }
    }
  });
  (function() {
    var closer = doc.createElement("div");
    /** @type {boolean} */
    support.deleteExpando = true;
    try {
      delete closer.test;
    } catch (t) {
      /** @type {boolean} */
      support.deleteExpando = false;
    }
    /** @type {null} */
    closer = null;
  })();
  /**
   * @param {Node} elem
   * @return {?}
   */
  var next = function(elem) {
    var noData = jQuery.noData[(elem.nodeName + " ").toLowerCase()];
    /** @type {number} */
    var code = +elem.nodeType || 1;
    return 1 !== code && 9 !== code ? false : !noData || noData !== true && elem.getAttribute("classid") === noData;
  };
  /** @type {RegExp} */
  var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;
  /** @type {RegExp} */
  var r20 = /([A-Z])/g;
  jQuery.extend({
    cache : {},
    noData : {
      "applet " : true,
      "embed " : true,
      "object " : "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
    },
    /**
     * @param {Object} elem
     * @return {?}
     */
    hasData : function(elem) {
      return elem = elem.nodeType ? jQuery.cache[elem[jQuery.expando]] : elem[jQuery.expando], !!elem && !filter(elem);
    },
    /**
     * @param {Function} obj
     * @param {?} value
     * @param {Object} data
     * @return {?}
     */
    data : function(obj, value, data) {
      return get(obj, value, data);
    },
    /**
     * @param {Object} key
     * @param {?} name
     * @return {?}
     */
    removeData : function(key, name) {
      return cb(key, name);
    },
    /**
     * @param {Object} owner
     * @param {string} name
     * @param {boolean} expectedNumberOfNonCommentArgs
     * @return {?}
     */
    _data : function(owner, name, expectedNumberOfNonCommentArgs) {
      return get(owner, name, expectedNumberOfNonCommentArgs, true);
    },
    /**
     * @param {Object} elem
     * @param {string} name
     * @return {?}
     */
    _removeData : function(elem, name) {
      return cb(elem, name, true);
    }
  });
  jQuery.fn.extend({
    /**
     * @param {Function} obj
     * @param {Object} value
     * @return {?}
     */
    data : function(obj, value) {
      var i;
      var name;
      var data;
      var qualifier = this[0];
      var types = qualifier && qualifier.attributes;
      if (void 0 === obj) {
        if (this.length && (data = jQuery.data(qualifier), 1 === qualifier.nodeType && !jQuery._data(qualifier, "parsedAttrs"))) {
          i = types.length;
          for (;i--;) {
            if (types[i]) {
              name = types[i].name;
              if (0 === name.indexOf("data-")) {
                name = jQuery.camelCase(name.slice(5));
                dataAttr(qualifier, name, data[name]);
              }
            }
          }
          jQuery._data(qualifier, "parsedAttrs", true);
        }
        return data;
      }
      return "object" == typeof obj ? this.each(function() {
        jQuery.data(this, obj);
      }) : arguments.length > 1 ? this.each(function() {
        jQuery.data(this, obj, value);
      }) : qualifier ? dataAttr(qualifier, obj, jQuery.data(qualifier, obj)) : void 0;
    },
    /**
     * @param {?} key
     * @return {?}
     */
    removeData : function(key) {
      return this.each(function() {
        jQuery.removeData(this, key);
      });
    }
  });
  jQuery.extend({
    /**
     * @param {Object} elem
     * @param {string} type
     * @param {?} data
     * @return {?}
     */
    queue : function(elem, type, data) {
      var queue;
      return elem ? (type = (type || "fx") + "queue", queue = jQuery._data(elem, type), data && (!queue || jQuery.isArray(data) ? queue = jQuery._data(elem, type, jQuery.makeArray(data)) : queue.push(data)), queue || []) : void 0;
    },
    /**
     * @param {string} elem
     * @param {string} type
     * @return {undefined}
     */
    dequeue : function(elem, type) {
      type = type || "fx";
      var queue = jQuery.queue(elem, type);
      var ln = queue.length;
      var fn = queue.shift();
      var hooks = jQuery._queueHooks(elem, type);
      /**
       * @return {undefined}
       */
      var next = function() {
        jQuery.dequeue(elem, type);
      };
      if ("inprogress" === fn) {
        fn = queue.shift();
        ln--;
      }
      if (fn) {
        if ("fx" === type) {
          queue.unshift("inprogress");
        }
        delete hooks.stop;
        fn.call(elem, next, hooks);
      }
      if (!ln) {
        if (hooks) {
          hooks.empty.fire();
        }
      }
    },
    /**
     * @param {Object} elem
     * @param {string} type
     * @return {?}
     */
    _queueHooks : function(elem, type) {
      /** @type {string} */
      var key = type + "queueHooks";
      return jQuery._data(elem, key) || jQuery._data(elem, key, {
          empty : jQuery.Callbacks("once memory").add(function() {
            jQuery._removeData(elem, type + "queue");
            jQuery._removeData(elem, key);
          })
        });
    }
  });
  jQuery.fn.extend({
    /**
     * @param {string} type
     * @param {string} data
     * @return {?}
     */
    queue : function(type, data) {
      /** @type {number} */
      var setter = 2;
      return "string" != typeof type && (data = type, type = "fx", setter--), arguments.length < setter ? jQuery.queue(this[0], type) : void 0 === data ? this : this.each(function() {
        var queue = jQuery.queue(this, type, data);
        jQuery._queueHooks(this, type);
        if ("fx" === type) {
          if ("inprogress" !== queue[0]) {
            jQuery.dequeue(this, type);
          }
        }
      });
    },
    /**
     * @param {string} type
     * @return {?}
     */
    dequeue : function(type) {
      return this.each(function() {
        jQuery.dequeue(this, type);
      });
    },
    /**
     * @param {string} type
     * @return {?}
     */
    clearQueue : function(type) {
      return this.queue(type || "fx", []);
    },
    /**
     * @param {string} type
     * @param {string} obj
     * @return {?}
     */
    promise : function(type, obj) {
      var body;
      /** @type {number} */
      var i = 1;
      var defer = jQuery.Deferred();
      var elements = this;
      var j = this.length;
      /**
       * @return {undefined}
       */
      var resolve = function() {
        if (!--i) {
          defer.resolveWith(elements, [elements]);
        }
      };
      if ("string" != typeof type) {
        /** @type {string} */
        obj = type;
        type = void 0;
      }
      type = type || "fx";
      for (;j--;) {
        body = jQuery._data(elements[j], type + "queueHooks");
        if (body) {
          if (body.empty) {
            i++;
            body.empty.add(resolve);
          }
        }
      }
      return resolve(), defer.promise(obj);
    }
  });
  (function() {
    var shrinkWrapBlocks;
    /**
     * @return {?}
     */
    support.shrinkWrapBlocks = function() {
      if (null != shrinkWrapBlocks) {
        return shrinkWrapBlocks;
      }
      /** @type {boolean} */
      shrinkWrapBlocks = false;
      var div;
      var target;
      var container;
      return target = doc.getElementsByTagName("body")[0], target && target.style ? (div = doc.createElement("div"), container = doc.createElement("div"), container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", target.appendChild(container).appendChild(div), "undefined" != typeof div.style.zoom && (div.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1",
        div.appendChild(doc.createElement("div")).style.width = "5px", shrinkWrapBlocks = 3 !== div.offsetWidth), target.removeChild(container), shrinkWrapBlocks) : void 0;
    };
  })();
  /** @type {string} */
  var core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
  /** @type {RegExp} */
  var rfxnum = new RegExp("^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i");
  /** @type {Array} */
  var cssExpand = ["Top", "Right", "Bottom", "Left"];
  /**
   * @param {Object} b
   * @param {Function} a
   * @return {?}
   */
  var suiteView = function(b, a) {
    return b = a || b, "none" === jQuery.css(b, "display") || !jQuery.contains(b.ownerDocument, b);
  };
  /**
   * @param {Object} elems
   * @param {Function} fn
   * @param {?} qualifier
   * @param {Function} value
   * @param {boolean} chainable
   * @param {string} emptyGet
   * @param {boolean} raw
   * @return {?}
   */
  var access = function(elems, fn, qualifier, value, chainable, emptyGet, raw) {
    /** @type {number} */
    var i = 0;
    var length = elems.length;
    /** @type {boolean} */
    var bulk = null == qualifier;
    if ("object" === jQuery.type(qualifier)) {
      /** @type {boolean} */
      chainable = true;
      for (i in qualifier) {
        access(elems, fn, i, qualifier[i], true, emptyGet, raw);
      }
    } else {
      if (void 0 !== value && (chainable = true, jQuery.isFunction(value) || (raw = true), bulk && (raw ? (fn.call(elems, value), fn = null) : (bulk = fn, fn = function(elem, event, value) {
          return bulk.call(jQuery(elem), value);
        })), fn)) {
        for (;length > i;i++) {
          fn(elems[i], qualifier, raw ? value : value.call(elems[i], i, fn(elems[i], qualifier)));
        }
      }
    }
    return chainable ? elems : bulk ? fn.call(elems) : length ? fn(elems[0], qualifier) : emptyGet;
  };
  /** @type {RegExp} */
  var manipulation_rcheckableType = /^(?:checkbox|radio)$/i;
  /** @type {RegExp} */
  var matches = /<([\w:-]+)/;
  /** @type {RegExp} */
  var rchecked = /^$|\/(?:java|ecma)script/i;
  /** @type {RegExp} */
  var rtagName = /^\s+/;
  /** @type {string} */
  var uHostName = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|dialog|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|picture|progress|section|summary|template|time|video";
  !function() {
    var div = doc.createElement("div");
    var fragment = doc.createDocumentFragment();
    var input = doc.createElement("input");
    /** @type {string} */
    div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
    /** @type {boolean} */
    support.leadingWhitespace = 3 === div.firstChild.nodeType;
    /** @type {boolean} */
    support.tbody = !div.getElementsByTagName("tbody").length;
    /** @type {boolean} */
    support.htmlSerialize = !!div.getElementsByTagName("link").length;
    /** @type {boolean} */
    support.html5Clone = "<:nav></:nav>" !== doc.createElement("nav").cloneNode(true).outerHTML;
    /** @type {string} */
    input.type = "checkbox";
    /** @type {boolean} */
    input.checked = true;
    fragment.appendChild(input);
    /** @type {boolean} */
    support.appendChecked = input.checked;
    /** @type {string} */
    div.innerHTML = "<textarea>x</textarea>";
    /** @type {boolean} */
    support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
    fragment.appendChild(div);
    input = doc.createElement("input");
    input.setAttribute("type", "radio");
    input.setAttribute("checked", "checked");
    input.setAttribute("name", "t");
    div.appendChild(input);
    support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;
    /** @type {boolean} */
    support.noCloneEvent = !!div.addEventListener;
    /** @type {number} */
    div[jQuery.expando] = 1;
    /** @type {boolean} */
    support.attributes = !div.getAttribute(jQuery.expando);
  }();
  var wrapMap = {
    option : [1, "<select multiple='multiple'>", "</select>"],
    legend : [1, "<fieldset>", "</fieldset>"],
    area : [1, "<map>", "</map>"],
    param : [1, "<object>", "</object>"],
    thead : [1, "<table>", "</table>"],
    tr : [2, "<table><tbody>", "</tbody></table>"],
    col : [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
    td : [3, "<table><tbody><tr>", "</tr></tbody></table>"],
    _default : support.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
  };
  /** @type {Array} */
  wrapMap.optgroup = wrapMap.option;
  /** @type {Array} */
  wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
  /** @type {Array} */
  wrapMap.th = wrapMap.td;
  /** @type {RegExp} */
  var selector = /<|&#?\w+;/;
  /** @type {RegExp} */
  var rhtml = /<tbody/i;
  !function() {
    var i;
    var eventName;
    var div = doc.createElement("div");
    for (i in{
      submit : true,
      change : true,
      focusin : true
    }) {
      /** @type {string} */
      eventName = "on" + i;
      if (!(support[i] = eventName in win)) {
        div.setAttribute(eventName, "t");
        /** @type {boolean} */
        support[i] = div.attributes[eventName].expando === false;
      }
    }
    /** @type {null} */
    div = null;
  }();
  /** @type {RegExp} */
  var rformElems = /^(?:input|select|textarea)$/i;
  /** @type {RegExp} */
  var rmouseEvent = /^key/;
  /** @type {RegExp} */
  var rkeyEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/;
  /** @type {RegExp} */
  var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;
  /** @type {RegExp} */
  var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
  jQuery.event = {
    global : {},
    /**
     * @param {Object} elem
     * @param {string} types
     * @param {Function} handler
     * @param {Object} e
     * @param {Object} selector
     * @return {undefined}
     */
    add : function(elem, types, handler, e, selector) {
      var segmentMatch;
      var events;
      var t;
      var handleObjIn;
      var special;
      var eventHandle;
      var handleObj;
      var handlers;
      var type;
      var namespaces;
      var origType;
      var elemData = jQuery._data(elem);
      if (elemData) {
        if (handler.handler) {
          /** @type {Function} */
          handleObjIn = handler;
          handler = handleObjIn.handler;
          selector = handleObjIn.selector;
        }
        if (!handler.guid) {
          /** @type {number} */
          handler.guid = jQuery.guid++;
        }
        if (!(events = elemData.events)) {
          events = elemData.events = {};
        }
        if (!(eventHandle = elemData.handle)) {
          /** @type {function (Object): ?} */
          eventHandle = elemData.handle = function(src) {
            return "undefined" == typeof jQuery || src && jQuery.event.triggered === src.type ? void 0 : jQuery.event.dispatch.apply(eventHandle.elem, arguments);
          };
          /** @type {Object} */
          eventHandle.elem = elem;
        }
        types = (types || "").match(core_rnotwhite) || [""];
        t = types.length;
        for (;t--;) {
          /** @type {Array} */
          segmentMatch = rtypenamespace.exec(types[t]) || [];
          type = origType = segmentMatch[1];
          namespaces = (segmentMatch[2] || "").split(".").sort();
          if (type) {
            special = jQuery.event.special[type] || {};
            type = (selector ? special.delegateType : special.bindType) || type;
            special = jQuery.event.special[type] || {};
            handleObj = jQuery.extend({
              type : type,
              origType : origType,
              data : e,
              /** @type {Function} */
              handler : handler,
              guid : handler.guid,
              selector : selector,
              needsContext : selector && jQuery.expr.match.needsContext.test(selector),
              namespace : namespaces.join(".")
            }, handleObjIn);
            if (!(handlers = events[type])) {
              /** @type {Array} */
              handlers = events[type] = [];
              /** @type {number} */
              handlers.delegateCount = 0;
              if (!(special.setup && special.setup.call(elem, e, namespaces, eventHandle) !== false)) {
                if (elem.addEventListener) {
                  elem.addEventListener(type, eventHandle, false);
                } else {
                  if (elem.attachEvent) {
                    elem.attachEvent("on" + type, eventHandle);
                  }
                }
              }
            }
            if (special.add) {
              special.add.call(elem, handleObj);
              if (!handleObj.handler.guid) {
                handleObj.handler.guid = handler.guid;
              }
            }
            if (selector) {
              handlers.splice(handlers.delegateCount++, 0, handleObj);
            } else {
              handlers.push(handleObj);
            }
            /** @type {boolean} */
            jQuery.event.global[type] = true;
          }
        }
        /** @type {null} */
        elem = null;
      }
    },
    /**
     * @param {Object} elem
     * @param {Object} types
     * @param {Function} handler
     * @param {string} selector
     * @param {boolean} keepData
     * @return {undefined}
     */
    remove : function(elem, types, handler, selector, keepData) {
      var j;
      var handleObj;
      var tmp;
      var origCount;
      var t;
      var events;
      var special;
      var handlers;
      var type;
      var namespaces;
      var origType;
      var elemData = jQuery.hasData(elem) && jQuery._data(elem);
      if (elemData && (events = elemData.events)) {
        types = (types || "").match(core_rnotwhite) || [""];
        t = types.length;
        for (;t--;) {
          if (tmp = rtypenamespace.exec(types[t]) || [], type = origType = tmp[1], namespaces = (tmp[2] || "").split(".").sort(), type) {
            special = jQuery.event.special[type] || {};
            type = (selector ? special.delegateType : special.bindType) || type;
            handlers = events[type] || [];
            tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");
            origCount = j = handlers.length;
            for (;j--;) {
              handleObj = handlers[j];
              if (!(!keepData && origType !== handleObj.origType)) {
                if (!(handler && handler.guid !== handleObj.guid)) {
                  if (!(tmp && !tmp.test(handleObj.namespace))) {
                    if (!(selector && (selector !== handleObj.selector && ("**" !== selector || !handleObj.selector)))) {
                      handlers.splice(j, 1);
                      if (handleObj.selector) {
                        handlers.delegateCount--;
                      }
                      if (special.remove) {
                        special.remove.call(elem, handleObj);
                      }
                    }
                  }
                }
              }
            }
            if (origCount) {
              if (!handlers.length) {
                if (!(special.teardown && special.teardown.call(elem, namespaces, elemData.handle) !== false)) {
                  jQuery.removeEvent(elem, type, elemData.handle);
                }
                delete events[type];
              }
            }
          } else {
            for (type in events) {
              jQuery.event.remove(elem, type + types[t], handler, selector, true);
            }
          }
        }
        if (jQuery.isEmptyObject(events)) {
          delete elemData.handle;
          jQuery._removeData(elem, "events");
        }
      }
    },
    /**
     * @param {Object} event
     * @param {?} data
     * @param {Object} elem
     * @param {boolean} onlyHandlers
     * @return {?}
     */
    trigger : function(event, data, elem, onlyHandlers) {
      var handle;
      var ontype;
      var cur;
      var bubbleType;
      var special;
      var tmp;
      var i;
      /** @type {Array} */
      var eventPath = [elem || doc];
      var type = core_hasOwn.call(event, "type") ? event.type : event;
      var namespaces = core_hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
      if (cur = tmp = elem = elem || doc, 3 !== elem.nodeType && (8 !== elem.nodeType && (!rfocusMorph.test(type + jQuery.event.triggered) && (type.indexOf(".") > -1 && (namespaces = type.split("."), type = namespaces.shift(), namespaces.sort()), ontype = type.indexOf(":") < 0 && "on" + type, event = event[jQuery.expando] ? event : new jQuery.Event(type, "object" == typeof event && event), event.isTrigger = onlyHandlers ? 2 : 3, event.namespace = namespaces.join("."), event.rnamespace = event.namespace ?
          new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, event.result = void 0, event.target || (event.target = elem), data = null == data ? [event] : jQuery.makeArray(data, [event]), special = jQuery.event.special[type] || {}, onlyHandlers || (!special.trigger || special.trigger.apply(elem, data) !== false))))) {
        if (!onlyHandlers && (!special.noBubble && !jQuery.isWindow(elem))) {
          bubbleType = special.delegateType || type;
          if (!rfocusMorph.test(bubbleType + type)) {
            cur = cur.parentNode;
          }
          for (;cur;cur = cur.parentNode) {
            eventPath.push(cur);
            tmp = cur;
          }
          if (tmp === (elem.ownerDocument || doc)) {
            eventPath.push(tmp.defaultView || (tmp.parentWindow || win));
          }
        }
        /** @type {number} */
        i = 0;
        for (;(cur = eventPath[i++]) && !event.isPropagationStopped();) {
          event.type = i > 1 ? bubbleType : special.bindType || type;
          handle = (jQuery._data(cur, "events") || {})[event.type] && jQuery._data(cur, "handle");
          if (handle) {
            handle.apply(cur, data);
          }
          handle = ontype && cur[ontype];
          if (handle) {
            if (handle.apply) {
              if (next(cur)) {
                event.result = handle.apply(cur, data);
                if (event.result === false) {
                  event.preventDefault();
                }
              }
            }
          }
        }
        if (event.type = type, !onlyHandlers && (!event.isDefaultPrevented() && ((!special._default || special._default.apply(eventPath.pop(), data) === false) && (next(elem) && (ontype && (elem[type] && !jQuery.isWindow(elem))))))) {
          tmp = elem[ontype];
          if (tmp) {
            /** @type {null} */
            elem[ontype] = null;
          }
          jQuery.event.triggered = type;
          try {
            elem[type]();
          } catch (m) {
          }
          jQuery.event.triggered = void 0;
          if (tmp) {
            elem[ontype] = tmp;
          }
        }
        return event.result;
      }
    },
    /**
     * @param {Object} event
     * @return {?}
     */
    dispatch : function(event) {
      event = jQuery.event.fix(event);
      var i;
      var j;
      var ret;
      var matched;
      var handleObj;
      /** @type {Array} */
      var handlerQueue = [];
      /** @type {Array.<?>} */
      var args = core_slice.call(arguments);
      var handlers = (jQuery._data(this, "events") || {})[event.type] || [];
      var special = jQuery.event.special[event.type] || {};
      if (args[0] = event, event.delegateTarget = this, !special.preDispatch || special.preDispatch.call(this, event) !== false) {
        handlerQueue = jQuery.event.handlers.call(this, event, handlers);
        /** @type {number} */
        i = 0;
        for (;(matched = handlerQueue[i++]) && !event.isPropagationStopped();) {
          event.currentTarget = matched.elem;
          /** @type {number} */
          j = 0;
          for (;(handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped();) {
            if (!(event.rnamespace && !event.rnamespace.test(handleObj.namespace))) {
              event.handleObj = handleObj;
              event.data = handleObj.data;
              ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);
              if (void 0 !== ret) {
                if ((event.result = ret) === false) {
                  event.preventDefault();
                  event.stopPropagation();
                }
              }
            }
          }
        }
        return special.postDispatch && special.postDispatch.call(this, event), event.result;
      }
    },
    /**
     * @param {Event} event
     * @param {Object} handlers
     * @return {?}
     */
    handlers : function(event, handlers) {
      var j;
      var matches;
      var sel;
      var handleObj;
      /** @type {Array} */
      var handlerQueue = [];
      var delegateCount = handlers.delegateCount;
      var cur = event.target;
      if (delegateCount && (cur.nodeType && ("click" !== event.type || (isNaN(event.button) || event.button < 1)))) {
        for (;cur != this;cur = cur.parentNode || this) {
          if (1 === cur.nodeType && (cur.disabled !== true || "click" !== event.type)) {
            /** @type {Array} */
            matches = [];
            /** @type {number} */
            j = 0;
            for (;delegateCount > j;j++) {
              handleObj = handlers[j];
              /** @type {string} */
              sel = handleObj.selector + " ";
              if (void 0 === matches[sel]) {
                matches[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) > -1 : jQuery.find(sel, this, null, [cur]).length;
              }
              if (matches[sel]) {
                matches.push(handleObj);
              }
            }
            if (matches.length) {
              handlerQueue.push({
                elem : cur,
                handlers : matches
              });
            }
          }
        }
      }
      return delegateCount < handlers.length && handlerQueue.push({
        elem : this,
        handlers : handlers.slice(delegateCount)
      }), handlerQueue;
    },
    /**
     * @param {Object} event
     * @return {?}
     */
    fix : function(event) {
      if (event[jQuery.expando]) {
        return event;
      }
      var i;
      var prop;
      var copy;
      var type = event.type;
      /** @type {Object} */
      var originalEvent = event;
      var fixHook = this.fixHooks[type];
      if (!fixHook) {
        this.fixHooks[type] = fixHook = rkeyEvent.test(type) ? this.mouseHooks : rmouseEvent.test(type) ? this.keyHooks : {};
      }
      copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;
      event = new jQuery.Event(originalEvent);
      i = copy.length;
      for (;i--;) {
        prop = copy[i];
        event[prop] = originalEvent[prop];
      }
      return event.target || (event.target = originalEvent.srcElement || doc), 3 === event.target.nodeType && (event.target = event.target.parentNode), event.metaKey = !!event.metaKey, fixHook.filter ? fixHook.filter(event, originalEvent) : event;
    },
    props : "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
    fixHooks : {},
    keyHooks : {
      props : "char charCode key keyCode".split(" "),
      /**
       * @param {Function} obj
       * @param {Object} event
       * @return {?}
       */
      filter : function(obj, event) {
        return null == obj.which && (obj.which = null != event.charCode ? event.charCode : event.keyCode), obj;
      }
    },
    mouseHooks : {
      props : "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
      /**
       * @param {Function} obj
       * @param {Object} event
       * @return {?}
       */
      filter : function(obj, event) {
        var b;
        var d;
        var de;
        var old = event.button;
        var fromElement = event.fromElement;
        return null == obj.pageX && (null != event.clientX && (d = obj.target.ownerDocument || doc, de = d.documentElement, b = d.body, obj.pageX = event.clientX + (de && de.scrollLeft || (b && b.scrollLeft || 0)) - (de && de.clientLeft || (b && b.clientLeft || 0)), obj.pageY = event.clientY + (de && de.scrollTop || (b && b.scrollTop || 0)) - (de && de.clientTop || (b && b.clientTop || 0)))), !obj.relatedTarget && (fromElement && (obj.relatedTarget = fromElement === obj.target ? event.toElement :
          fromElement)), obj.which || (void 0 === old || (obj.which = 1 & old ? 1 : 2 & old ? 3 : 4 & old ? 2 : 0)), obj;
      }
    },
    special : {
      load : {
        noBubble : true
      },
      focus : {
        /**
         * @return {?}
         */
        trigger : function() {
          if (this !== safeActiveElement() && this.focus) {
            try {
              return this.focus(), false;
            } catch (e) {
            }
          }
        },
        delegateType : "focusin"
      },
      blur : {
        /**
         * @return {?}
         */
        trigger : function() {
          return this === safeActiveElement() && this.blur ? (this.blur(), false) : void 0;
        },
        delegateType : "focusout"
      },
      click : {
        /**
         * @return {?}
         */
        trigger : function() {
          return jQuery.nodeName(this, "input") && ("checkbox" === this.type && this.click) ? (this.click(), false) : void 0;
        },
        /**
         * @param {Function} elem
         * @return {?}
         */
        _default : function(elem) {
          return jQuery.nodeName(elem.target, "a");
        }
      },
      beforeunload : {
        /**
         * @param {Object} event
         * @return {undefined}
         */
        postDispatch : function(event) {
          if (void 0 !== event.result) {
            if (event.originalEvent) {
              event.originalEvent.returnValue = event.result;
            }
          }
        }
      }
    },
    /**
     * @param {string} type
     * @param {?} elem
     * @param {Event} event
     * @return {undefined}
     */
    simulate : function(type, elem, event) {
      var e = jQuery.extend(new jQuery.Event, event, {
        type : type,
        isSimulated : true
      });
      jQuery.event.trigger(e, null, elem);
      if (e.isDefaultPrevented()) {
        event.preventDefault();
      }
    }
  };
  /** @type {function (Object, string, ?): undefined} */
  jQuery.removeEvent = doc.removeEventListener ? function(elem, type, handle) {
    if (elem.removeEventListener) {
      elem.removeEventListener(type, handle);
    }
  } : function(elem, keepData, listener) {
    /** @type {string} */
    var type = "on" + keepData;
    if (elem.detachEvent) {
      if ("undefined" == typeof elem[type]) {
        /** @type {null} */
        elem[type] = null;
      }
      elem.detachEvent(type, listener);
    }
  };
  /**
   * @param {Object} selector
   * @param {boolean} event
   * @return {?}
   */
  jQuery.Event = function(selector, event) {
    return this instanceof jQuery.Event ? (selector && selector.type ? (this.originalEvent = selector, this.type = selector.type, this.isDefaultPrevented = selector.defaultPrevented || void 0 === selector.defaultPrevented && selector.returnValue === false ? returnTrue : returnFalse) : this.type = selector, event && jQuery.extend(this, event), this.timeStamp = selector && selector.timeStamp || jQuery.now(), void(this[jQuery.expando] = true)) : new jQuery.Event(selector, event);
  };
  jQuery.Event.prototype = {
    /** @type {function (Object, boolean): ?} */
    constructor : jQuery.Event,
    /** @type {function (): ?} */
    isDefaultPrevented : returnFalse,
    /** @type {function (): ?} */
    isPropagationStopped : returnFalse,
    /** @type {function (): ?} */
    isImmediatePropagationStopped : returnFalse,
    /**
     * @return {undefined}
     */
    preventDefault : function() {
      var e = this.originalEvent;
      /** @type {function (): ?} */
      this.isDefaultPrevented = returnTrue;
      if (e) {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          /** @type {boolean} */
          e.returnValue = false;
        }
      }
    },
    /**
     * @return {undefined}
     */
    stopPropagation : function() {
      var e = this.originalEvent;
      /** @type {function (): ?} */
      this.isPropagationStopped = returnTrue;
      if (e) {
        if (!this.isSimulated) {
          if (e.stopPropagation) {
            e.stopPropagation();
          }
          /** @type {boolean} */
          e.cancelBubble = true;
        }
      }
    },
    /**
     * @return {undefined}
     */
    stopImmediatePropagation : function() {
      var e = this.originalEvent;
      /** @type {function (): ?} */
      this.isImmediatePropagationStopped = returnTrue;
      if (e) {
        if (e.stopImmediatePropagation) {
          e.stopImmediatePropagation();
        }
      }
      this.stopPropagation();
    }
  };
  jQuery.each({
    mouseenter : "mouseover",
    mouseleave : "mouseout",
    pointerenter : "pointerover",
    pointerleave : "pointerout"
  }, function(orig, fix) {
    jQuery.event.special[orig] = {
      delegateType : fix,
      bindType : fix,
      /**
       * @param {Object} event
       * @return {?}
       */
      handle : function(event) {
        var returnValue;
        var target = this;
        var related = event.relatedTarget;
        var handleObj = event.handleObj;
        return related && (related === target || jQuery.contains(target, related)) || (event.type = handleObj.origType, returnValue = handleObj.handler.apply(this, arguments), event.type = fix), returnValue;
      }
    };
  });
  if (!support.submit) {
    jQuery.event.special.submit = {
      /**
       * @return {?}
       */
      setup : function() {
        return jQuery.nodeName(this, "form") ? false : void jQuery.event.add(this, "click._submit keypress._submit", function(e) {
          var elem = e.target;
          var dest = jQuery.nodeName(elem, "input") || jQuery.nodeName(elem, "button") ? jQuery.prop(elem, "form") : void 0;
          if (dest) {
            if (!jQuery._data(dest, "submit")) {
              jQuery.event.add(dest, "submit._submit", function(dataAndEvents) {
                /** @type {boolean} */
                dataAndEvents._submitBubble = true;
              });
              jQuery._data(dest, "submit", true);
            }
          }
        });
      },
      /**
       * @param {Event} event
       * @return {undefined}
       */
      postDispatch : function(event) {
        if (event._submitBubble) {
          delete event._submitBubble;
          if (this.parentNode) {
            if (!event.isTrigger) {
              jQuery.event.simulate("submit", this.parentNode, event);
            }
          }
        }
      },
      /**
       * @return {?}
       */
      teardown : function() {
        return jQuery.nodeName(this, "form") ? false : void jQuery.event.remove(this, "._submit");
      }
    };
  }
  if (!support.change) {
    jQuery.event.special.change = {
      /**
       * @return {?}
       */
      setup : function() {
        return rformElems.test(this.nodeName) ? ("checkbox" !== this.type && "radio" !== this.type || (jQuery.event.add(this, "propertychange._change", function(event) {
          if ("checked" === event.originalEvent.propertyName) {
            /** @type {boolean} */
            this._justChanged = true;
          }
        }), jQuery.event.add(this, "click._change", function(event) {
          if (this._justChanged) {
            if (!event.isTrigger) {
              /** @type {boolean} */
              this._justChanged = false;
            }
          }
          jQuery.event.simulate("change", this, event);
        })), false) : void jQuery.event.add(this, "beforeactivate._change", function(event) {
          var cur = event.target;
          if (rformElems.test(cur.nodeName)) {
            if (!jQuery._data(cur, "change")) {
              jQuery.event.add(cur, "change._change", function(event) {
                if (!!this.parentNode) {
                  if (!event.isSimulated) {
                    if (!event.isTrigger) {
                      jQuery.event.simulate("change", this.parentNode, event);
                    }
                  }
                }
              });
              jQuery._data(cur, "change", true);
            }
          }
        });
      },
      /**
       * @param {Event} event
       * @return {?}
       */
      handle : function(event) {
        var current = event.target;
        return this !== current || (event.isSimulated || (event.isTrigger || "radio" !== current.type && "checkbox" !== current.type)) ? event.handleObj.handler.apply(this, arguments) : void 0;
      },
      /**
       * @return {?}
       */
      teardown : function() {
        return jQuery.event.remove(this, "._change"), !rformElems.test(this.nodeName);
      }
    };
  }
  if (!support.focusin) {
    jQuery.each({
      focus : "focusin",
      blur : "focusout"
    }, function(action, name) {
      /**
       * @param {Object} event
       * @return {undefined}
       */
      var handler = function(event) {
        jQuery.event.simulate(name, event.target, jQuery.event.fix(event));
      };
      jQuery.event.special[name] = {
        /**
         * @return {undefined}
         */
        setup : function() {
          var target = this.ownerDocument || this;
          var $target = jQuery._data(target, name);
          if (!$target) {
            target.addEventListener(action, handler, true);
          }
          jQuery._data(target, name, ($target || 0) + 1);
        },
        /**
         * @return {undefined}
         */
        teardown : function() {
          var node = this.ownerDocument || this;
          /** @type {number} */
          var value = jQuery._data(node, name) - 1;
          if (value) {
            jQuery._data(node, name, value);
          } else {
            node.removeEventListener(action, handler, true);
            jQuery._removeData(node, name);
          }
        }
      };
    });
  }
  jQuery.fn.extend({
    /**
     * @param {string} name
     * @param {Function} selector
     * @param {Function} one
     * @param {Object} fn
     * @return {?}
     */
    on : function(name, selector, one, fn) {
      return on(this, name, selector, one, fn);
    },
    /**
     * @param {Object} type
     * @param {Object} selector
     * @param {Object} callback
     * @param {Object} types
     * @return {?}
     */
    one : function(type, selector, callback, types) {
      return on(this, type, selector, callback, types, 1);
    },
    /**
     * @param {Object} types
     * @param {Function} selector
     * @param {Function} fn
     * @return {?}
     */
    off : function(types, selector, fn) {
      var handleObj;
      var type;
      if (types && (types.preventDefault && types.handleObj)) {
        return handleObj = types.handleObj, jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler), this;
      }
      if ("object" == typeof types) {
        for (type in types) {
          this.off(type, selector, types[type]);
        }
        return this;
      }
      return selector !== false && "function" != typeof selector || (fn = selector, selector = void 0), fn === false && (fn = returnFalse), this.each(function() {
        jQuery.event.remove(this, types, fn, selector);
      });
    },
    /**
     * @param {string} type
     * @param {?} data
     * @return {?}
     */
    trigger : function(type, data) {
      return this.each(function() {
        jQuery.event.trigger(type, data, this);
      });
    },
    /**
     * @param {string} type
     * @param {?} data
     * @return {?}
     */
    triggerHandler : function(type, data) {
      var parent = this[0];
      return parent ? jQuery.event.trigger(type, data, parent, true) : void 0;
    }
  });
  /** @type {RegExp} */
  var normalizr = / jQuery\d+="(?:null|\d+)"/g;
  /** @type {RegExp} */
  var regexp = new RegExp("<(?:" + uHostName + ")[\\s/>]", "i");
  /** @type {RegExp} */
  var br = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi;
  /** @type {RegExp} */
  var rRadial = /<script|<style|<link/i;
  /** @type {RegExp} */
  var BEGIN_TAG_REGEXP = /checked\s*(?:[^=]|=\s*.checked.)/i;
  /** @type {RegExp} */
  var rscriptTypeMasked = /^true\/(.*)/;
  /** @type {RegExp} */
  var rclass = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
  var el = save(doc);
  var fragmentDiv = el.appendChild(doc.createElement("div"));
  jQuery.extend({
    /**
     * @param {string} b
     * @return {?}
     */
    htmlPrefilter : function(b) {
      return b.replace(br, "<$1></$2>");
    },
    /**
     * @param {Object} node
     * @param {boolean} dataAndEvents
     * @param {boolean} deepDataAndEvents
     * @return {?}
     */
    clone : function(node, dataAndEvents, deepDataAndEvents) {
      var destElements;
      var elem;
      var clone;
      var i;
      var tmp;
      var inPage = jQuery.contains(node.ownerDocument, node);
      if (support.html5Clone || (jQuery.isXMLDoc(node) || !regexp.test("<" + node.nodeName + ">")) ? clone = node.cloneNode(true) : (fragmentDiv.innerHTML = node.outerHTML, fragmentDiv.removeChild(clone = fragmentDiv.firstChild)), !(support.noCloneEvent && support.noCloneChecked || (1 !== node.nodeType && 11 !== node.nodeType || jQuery.isXMLDoc(node)))) {
        destElements = getAll(clone);
        tmp = getAll(node);
        /** @type {number} */
        i = 0;
        for (;null != (elem = tmp[i]);++i) {
          if (destElements[i]) {
            cloneFixAttributes(elem, destElements[i]);
          }
        }
      }
      if (dataAndEvents) {
        if (deepDataAndEvents) {
          tmp = tmp || getAll(node);
          destElements = destElements || getAll(clone);
          /** @type {number} */
          i = 0;
          for (;null != (elem = tmp[i]);i++) {
            cloneCopyEvent(elem, destElements[i]);
          }
        } else {
          cloneCopyEvent(node, clone);
        }
      }
      return destElements = getAll(clone, "script"), destElements.length > 0 && setGlobalEval(destElements, !inPage && getAll(node, "script")), destElements = tmp = elem = null, clone;
    },
    /**
     * @param {Array} elems
     * @param {?} dataAndEvents
     * @return {undefined}
     */
    cleanData : function(elems, dataAndEvents) {
      var elem;
      var type;
      var id;
      var data;
      /** @type {number} */
      var i = 0;
      var expando = jQuery.expando;
      var cache = jQuery.cache;
      /** @type {boolean} */
      var attrs = support.attributes;
      var special = jQuery.event.special;
      for (;null != (elem = elems[i]);i++) {
        if ((dataAndEvents || next(elem)) && (id = elem[expando], data = id && cache[id])) {
          if (data.events) {
            for (type in data.events) {
              if (special[type]) {
                jQuery.event.remove(elem, type);
              } else {
                jQuery.removeEvent(elem, type, data.handle);
              }
            }
          }
          if (cache[id]) {
            delete cache[id];
            if (attrs || "undefined" == typeof elem.removeAttribute) {
              elem[expando] = void 0;
            } else {
              elem.removeAttribute(expando);
            }
            core_deletedIds.push(id);
          }
        }
      }
    }
  });
  jQuery.fn.extend({
    /** @type {function (Array, Object, Function, ?): ?} */
    domManip : init,
    /**
     * @param {Function} selector
     * @return {?}
     */
    detach : function(selector) {
      return remove(this, selector, true);
    },
    /**
     * @param {?} selector
     * @return {?}
     */
    remove : function(selector) {
      return remove(this, selector);
    },
    /**
     * @param {Function} obj
     * @return {?}
     */
    text : function(obj) {
      return access(this, function(text) {
        return void 0 === text ? jQuery.text(this) : this.empty().append((this[0] && this[0].ownerDocument || doc).createTextNode(text));
      }, null, obj, arguments.length);
    },
    /**
     * @return {?}
     */
    append : function() {
      return init(this, arguments, function(elem) {
        if (1 === this.nodeType || (11 === this.nodeType || 9 === this.nodeType)) {
          var target = manipulationTarget(this, elem);
          target.appendChild(elem);
        }
      });
    },
    /**
     * @return {?}
     */
    prepend : function() {
      return init(this, arguments, function(elem) {
        if (1 === this.nodeType || (11 === this.nodeType || 9 === this.nodeType)) {
          var target = manipulationTarget(this, elem);
          target.insertBefore(elem, target.firstChild);
        }
      });
    },
    /**
     * @return {?}
     */
    before : function() {
      return init(this, arguments, function(elem) {
        if (this.parentNode) {
          this.parentNode.insertBefore(elem, this);
        }
      });
    },
    /**
     * @return {?}
     */
    after : function() {
      return init(this, arguments, function(elem) {
        if (this.parentNode) {
          this.parentNode.insertBefore(elem, this.nextSibling);
        }
      });
    },
    /**
     * @return {?}
     */
    empty : function() {
      var elem;
      /** @type {number} */
      var unlock = 0;
      for (;null != (elem = this[unlock]);unlock++) {
        if (1 === elem.nodeType) {
          jQuery.cleanData(getAll(elem, false));
        }
        for (;elem.firstChild;) {
          elem.removeChild(elem.firstChild);
        }
        if (elem.options) {
          if (jQuery.nodeName(elem, "select")) {
            /** @type {number} */
            elem.options.length = 0;
          }
        }
      }
      return this;
    },
    /**
     * @param {boolean} dataAndEvents
     * @param {boolean} deepDataAndEvents
     * @return {?}
     */
    clone : function(dataAndEvents, deepDataAndEvents) {
      return dataAndEvents = null == dataAndEvents ? false : dataAndEvents, deepDataAndEvents = null == deepDataAndEvents ? dataAndEvents : deepDataAndEvents, this.map(function() {
        return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
      });
    },
    /**
     * @param {Function} value
     * @return {?}
     */
    html : function(value) {
      return access(this, function(value) {
        var elem = this[0] || {};
        /** @type {number} */
        var i = 0;
        var l = this.length;
        if (void 0 === value) {
          return 1 === elem.nodeType ? elem.innerHTML.replace(normalizr, "") : void 0;
        }
        if ("string" == typeof value && (!rRadial.test(value) && ((support.htmlSerialize || !regexp.test(value)) && ((support.leadingWhitespace || !rtagName.test(value)) && !wrapMap[(matches.exec(value) || ["", ""])[1].toLowerCase()])))) {
          value = jQuery.htmlPrefilter(value);
          try {
            for (;l > i;i++) {
              elem = this[i] || {};
              if (1 === elem.nodeType) {
                jQuery.cleanData(getAll(elem, false));
                /** @type {(Object|string)} */
                elem.innerHTML = value;
              }
            }
            /** @type {number} */
            elem = 0;
          } catch (r) {
          }
        }
        if (elem) {
          this.empty().append(value);
        }
      }, null, value, arguments.length);
    },
    /**
     * @return {?}
     */
    replaceWith : function() {
      /** @type {Array} */
      var selection = [];
      return init(this, arguments, function(relatedNode) {
        var node = this.parentNode;
        if (jQuery.inArray(this, selection) < 0) {
          jQuery.cleanData(getAll(this));
          if (node) {
            node.replaceChild(relatedNode, this);
          }
        }
      }, selection);
    }
  });
  jQuery.each({
    appendTo : "append",
    prependTo : "prepend",
    insertBefore : "before",
    insertAfter : "after",
    replaceAll : "replaceWith"
  }, function(original, method) {
    /**
     * @param {Object} scripts
     * @return {?}
     */
    jQuery.fn[original] = function(scripts) {
      var resp;
      /** @type {number} */
      var i = 0;
      /** @type {Array} */
      var ret = [];
      var insert = jQuery(scripts);
      /** @type {number} */
      var segments = insert.length - 1;
      for (;segments >= i;i++) {
        resp = i === segments ? this : this.clone(true);
        jQuery(insert[i])[method](resp);
        core_push.apply(ret, resp.get());
      }
      return this.pushStack(ret);
    };
  });
  var iframe;
  var cache = {
    HTML : "block",
    BODY : "block"
  };
  /** @type {RegExp} */
  var rbracket = /^margin/;
  /** @type {RegExp} */
  var rnumnonpx = new RegExp("^(" + core_pnum + ")(?!px)[a-z%]+$", "i");
  /**
   * @param {Object} elem
   * @param {?} options
   * @param {Function} callback
   * @param {Array} args
   * @return {?}
   */
  var swap = function(elem, options, callback, args) {
    var ret;
    var name;
    var old = {};
    for (name in options) {
      old[name] = elem.style[name];
      elem.style[name] = options[name];
    }
    ret = callback.apply(elem, args || []);
    for (name in options) {
      elem.style[name] = old[name];
    }
    return ret;
  };
  var docElem = doc.documentElement;
  !function() {
    /**
     * @return {undefined}
     */
    function getSize() {
      var marginDiv;
      var ret;
      var docElem = doc.documentElement;
      docElem.appendChild(container);
      /** @type {string} */
      div.style.cssText = "-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%";
      /** @type {boolean} */
      pa = ne = ep = false;
      /** @type {boolean} */
      stack = memory = true;
      if (win.getComputedStyle) {
        ret = win.getComputedStyle(div);
        /** @type {boolean} */
        pa = "1%" !== (ret || {}).top;
        /** @type {boolean} */
        ep = "2px" === (ret || {}).marginLeft;
        /** @type {boolean} */
        ne = "4px" === (ret || {
            width : "4px"
          }).width;
        /** @type {string} */
        div.style.marginRight = "50%";
        /** @type {boolean} */
        stack = "4px" === (ret || {
            marginRight : "4px"
          }).marginRight;
        marginDiv = div.appendChild(doc.createElement("div"));
        /** @type {string} */
        marginDiv.style.cssText = div.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0";
        /** @type {string} */
        marginDiv.style.marginRight = marginDiv.style.width = "0";
        /** @type {string} */
        div.style.width = "1px";
        /** @type {boolean} */
        memory = !parseFloat((win.getComputedStyle(marginDiv) || {}).marginRight);
        div.removeChild(marginDiv);
      }
      /** @type {string} */
      div.style.display = "none";
      /** @type {boolean} */
      o = 0 === div.getClientRects().length;
      if (o) {
        /** @type {string} */
        div.style.display = "";
        /** @type {string} */
        div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
        marginDiv = div.getElementsByTagName("td");
        /** @type {string} */
        marginDiv[0].style.cssText = "margin:0;border:0;padding:0;display:none";
        /** @type {boolean} */
        o = 0 === marginDiv[0].offsetHeight;
        if (o) {
          /** @type {string} */
          marginDiv[0].style.display = "";
          /** @type {string} */
          marginDiv[1].style.display = "none";
          /** @type {boolean} */
          o = 0 === marginDiv[0].offsetHeight;
        }
      }
      docElem.removeChild(container);
    }
    var pa;
    var stack;
    var ne;
    var o;
    var memory;
    var ep;
    var container = doc.createElement("div");
    var div = doc.createElement("div");
    if (div.style) {
      /** @type {string} */
      div.style.cssText = "float:left;opacity:.5";
      /** @type {boolean} */
      support.opacity = "0.5" === div.style.opacity;
      /** @type {boolean} */
      support.cssFloat = !!div.style.cssFloat;
      /** @type {string} */
      div.style.backgroundClip = "content-box";
      /** @type {string} */
      div.cloneNode(true).style.backgroundClip = "";
      /** @type {boolean} */
      support.clearCloneStyle = "content-box" === div.style.backgroundClip;
      container = doc.createElement("div");
      /** @type {string} */
      container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute";
      /** @type {string} */
      div.innerHTML = "";
      container.appendChild(div);
      /** @type {boolean} */
      support.boxSizing = "" === div.style.boxSizing || ("" === div.style.MozBoxSizing || "" === div.style.WebkitBoxSizing);
      jQuery.extend(support, {
        /**
         * @return {?}
         */
        reliableHiddenOffsets : function() {
          return null == pa && getSize(), o;
        },
        /**
         * @return {?}
         */
        boxSizingReliable : function() {
          return null == pa && getSize(), ne;
        },
        /**
         * @return {?}
         */
        pixelMarginRight : function() {
          return null == pa && getSize(), stack;
        },
        /**
         * @return {?}
         */
        pixelPosition : function() {
          return null == pa && getSize(), pa;
        },
        /**
         * @return {?}
         */
        reliableMarginRight : function() {
          return null == pa && getSize(), memory;
        },
        /**
         * @return {?}
         */
        reliableMarginLeft : function() {
          return null == pa && getSize(), ep;
        }
      });
    }
  }();
  var getStyles;
  var css;
  /** @type {RegExp} */
  var fnTest = /^(top|right|bottom|left)$/;
  if (win.getComputedStyle) {
    /**
     * @param {Object} elem
     * @return {?}
     */
    getStyles = function(elem) {
      var defaultView = elem.ownerDocument.defaultView;
      return defaultView && defaultView.opener || (defaultView = win), defaultView.getComputedStyle(elem);
    };
    /**
     * @param {Object} b
     * @param {string} prop
     * @param {Object} computed
     * @return {?}
     */
    css = function(b, prop, computed) {
      var width;
      var minWidth;
      var maxWidth;
      var ret;
      var style = b.style;
      return computed = computed || getStyles(b), ret = computed ? computed.getPropertyValue(prop) || computed[prop] : void 0, "" !== ret && void 0 !== ret || (jQuery.contains(b.ownerDocument, b) || (ret = jQuery.style(b, prop))), computed && (!support.pixelMarginRight() && (rnumnonpx.test(ret) && (rbracket.test(prop) && (width = style.width, minWidth = style.minWidth, maxWidth = style.maxWidth, style.minWidth = style.maxWidth = style.width = ret, ret = computed.width, style.width = width, style.minWidth =
        minWidth, style.maxWidth = maxWidth)))), void 0 === ret ? ret : ret + "";
    };
  } else {
    if (docElem.currentStyle) {
      /**
       * @param {Object} elem
       * @return {?}
       */
      getStyles = function(elem) {
        return elem.currentStyle;
      };
      /**
       * @param {Object} elem
       * @param {string} prop
       * @param {Object} el
       * @return {?}
       */
      css = function(elem, prop, el) {
        var left;
        var rs;
        var rsLeft;
        var ret;
        var style = elem.style;
        return el = el || getStyles(elem), ret = el ? el[prop] : void 0, null == ret && (style && (style[prop] && (ret = style[prop]))), rnumnonpx.test(ret) && (!fnTest.test(prop) && (left = style.left, rs = elem.runtimeStyle, rsLeft = rs && rs.left, rsLeft && (rs.left = elem.currentStyle.left), style.left = "fontSize" === prop ? "1em" : ret, ret = style.pixelLeft + "px", style.left = left, rsLeft && (rs.left = rsLeft))), void 0 === ret ? ret : ret + "" || "auto";
      };
    }
  }
  /** @type {RegExp} */
  var ralpha = /alpha\([^)]*\)/i;
  /** @type {RegExp} */
  var stopParent = /opacity\s*=\s*([^)]*)/i;
  /** @type {RegExp} */
  var rdisplayswap = /^(none|table(?!-c[ea]).+)/;
  /** @type {RegExp} */
  var rrelNum = new RegExp("^(" + core_pnum + ")(.*)$", "i");
  var cssShow = {
    position : "absolute",
    visibility : "hidden",
    display : "block"
  };
  var cssNormalTransform = {
    letterSpacing : "0",
    fontWeight : "400"
  };
  /** @type {Array} */
  var cssPrefixes = ["Webkit", "O", "Moz", "ms"];
  var style = doc.createElement("div").style;
  jQuery.extend({
    cssHooks : {
      opacity : {
        /**
         * @param {Object} elem
         * @param {string} keepData
         * @return {?}
         */
        get : function(elem, keepData) {
          if (keepData) {
            var buffer = css(elem, "opacity");
            return "" === buffer ? "1" : buffer;
          }
        }
      }
    },
    cssNumber : {
      animationIterationCount : true,
      columnCount : true,
      fillOpacity : true,
      flexGrow : true,
      flexShrink : true,
      fontWeight : true,
      lineHeight : true,
      opacity : true,
      order : true,
      orphans : true,
      widows : true,
      zIndex : true,
      zoom : true
    },
    cssProps : {
      "float" : support.cssFloat ? "cssFloat" : "styleFloat"
    },
    /**
     * @param {Object} obj
     * @param {?} name
     * @param {string} val
     * @param {string} extra
     * @return {?}
     */
    style : function(obj, name, val, extra) {
      if (obj && (3 !== obj.nodeType && (8 !== obj.nodeType && obj.style))) {
        var parts;
        var type;
        var hooks;
        var prop = jQuery.camelCase(name);
        var style = obj.style;
        if (name = jQuery.cssProps[prop] || (jQuery.cssProps[prop] = camelCase(prop) || prop), hooks = jQuery.cssHooks[name] || jQuery.cssHooks[prop], void 0 === val) {
          return hooks && ("get" in hooks && void 0 !== (parts = hooks.get(obj, false, extra))) ? parts : style[name];
        }
        if (type = typeof val, "string" === type && ((parts = rfxnum.exec(val)) && (parts[1] && (val = add(obj, name, parts), type = "number"))), null != val && (val === val && ("number" === type && (val += parts && parts[3] || (jQuery.cssNumber[prop] ? "" : "px")), support.clearCloneStyle || ("" !== val || (0 !== name.indexOf("background") || (style[name] = "inherit"))), !(hooks && ("set" in hooks && void 0 === (val = hooks.set(obj, val, extra))))))) {
          try {
            /** @type {string} */
            style[name] = val;
          } catch (u) {
          }
        }
      }
    },
    /**
     * @param {Object} elem
     * @param {string} prop
     * @param {boolean} recurring
     * @param {?} val
     * @return {?}
     */
    css : function(elem, prop, recurring, val) {
      var result;
      var ret;
      var hooks;
      var name = jQuery.camelCase(prop);
      return prop = jQuery.cssProps[name] || (jQuery.cssProps[name] = camelCase(name) || name), hooks = jQuery.cssHooks[prop] || jQuery.cssHooks[name], hooks && ("get" in hooks && (ret = hooks.get(elem, true, recurring))), void 0 === ret && (ret = css(elem, prop, val)), "normal" === ret && (prop in cssNormalTransform && (ret = cssNormalTransform[prop])), "" === recurring || recurring ? (result = parseFloat(ret), recurring === true || isFinite(result) ? result || 0 : ret) : ret;
    }
  });
  jQuery.each(["height", "width"], function(dataAndEvents, name) {
    jQuery.cssHooks[name] = {
      /**
       * @param {Object} elem
       * @param {Object} keepData
       * @param {string} extra
       * @return {?}
       */
      get : function(elem, keepData, extra) {
        return keepData ? rdisplayswap.test(jQuery.css(elem, "display")) && 0 === elem.offsetWidth ? swap(elem, cssShow, function() {
          return getWidthOrHeight(elem, name, extra);
        }) : getWidthOrHeight(elem, name, extra) : void 0;
      },
      /**
       * @param {Object} elem
       * @param {string} iterator
       * @param {(Object|string)} extra
       * @return {?}
       */
      set : function(elem, iterator, extra) {
        var styles = extra && getStyles(elem);
        return setPositiveNumber(elem, iterator, extra ? augmentWidthOrHeight(elem, name, extra, support.boxSizing && "border-box" === jQuery.css(elem, "boxSizing", false, styles), styles) : 0);
      }
    };
  });
  if (!support.opacity) {
    jQuery.cssHooks.opacity = {
      /**
       * @param {Object} elem
       * @param {boolean} computed
       * @return {?}
       */
      get : function(elem, computed) {
        return stopParent.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ? 0.01 * parseFloat(RegExp.$1) + "" : computed ? "1" : "";
      },
      /**
       * @param {Object} elem
       * @param {number} value
       * @return {undefined}
       */
      set : function(elem, value) {
        var elemStyle = elem.style;
        var currentStyle = elem.currentStyle;
        /** @type {string} */
        var opacity = jQuery.isNumeric(value) ? "alpha(opacity=" + 100 * value + ")" : "";
        var filter = currentStyle && currentStyle.filter || (elemStyle.filter || "");
        /** @type {number} */
        elemStyle.zoom = 1;
        if (!((value >= 1 || "" === value) && ("" === jQuery.trim(filter.replace(ralpha, "")) && (elemStyle.removeAttribute && (elemStyle.removeAttribute("filter"), "" === value || currentStyle && !currentStyle.filter))))) {
          elemStyle.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : filter + " " + opacity;
        }
      }
    };
  }
  jQuery.cssHooks.marginRight = addGetHookIf(support.reliableMarginRight, function(array, hex) {
    return hex ? swap(array, {
      display : "inline-block"
    }, css, [array, "marginRight"]) : void 0;
  });
  jQuery.cssHooks.marginLeft = addGetHookIf(support.reliableMarginLeft, function(elem, x) {
    return x ? (parseFloat(css(elem, "marginLeft")) || (jQuery.contains(elem.ownerDocument, elem) ? elem.getBoundingClientRect().left - swap(elem, {
      marginLeft : 0
    }, function() {
      return elem.getBoundingClientRect().left;
    }) : 0)) + "px" : void 0;
  });
  jQuery.each({
    margin : "",
    padding : "",
    border : "Width"
  }, function(prefix, suffix) {
    jQuery.cssHooks[prefix + suffix] = {
      /**
       * @param {string} line
       * @return {?}
       */
      expand : function(line) {
        /** @type {number} */
        var i = 0;
        var expanded = {};
        /** @type {Array} */
        var tokens = "string" == typeof line ? line.split(" ") : [line];
        for (;4 > i;i++) {
          expanded[prefix + cssExpand[i] + suffix] = tokens[i] || (tokens[i - 2] || tokens[0]);
        }
        return expanded;
      }
    };
    if (!rbracket.test(prefix)) {
      /** @type {function (Object, string, string): ?} */
      jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
    }
  });
  jQuery.fn.extend({
    /**
     * @param {Object} selector
     * @param {string} value
     * @return {?}
     */
    css : function(selector, value) {
      return access(this, function(qualifier, prop, value) {
        var styles;
        var _len;
        var map = {};
        /** @type {number} */
        var name = 0;
        if (jQuery.isArray(prop)) {
          styles = getStyles(qualifier);
          _len = prop.length;
          for (;_len > name;name++) {
            map[prop[name]] = jQuery.css(qualifier, prop[name], false, styles);
          }
          return map;
        }
        return void 0 !== value ? jQuery.style(qualifier, prop, value) : jQuery.css(qualifier, prop);
      }, selector, value, arguments.length > 1);
    },
    /**
     * @return {?}
     */
    show : function() {
      return showHide(this, true);
    },
    /**
     * @return {?}
     */
    hide : function() {
      return showHide(this);
    },
    /**
     * @param {?} state
     * @return {?}
     */
    toggle : function(state) {
      return "boolean" == typeof state ? state ? this.show() : this.hide() : this.each(function() {
        if (suiteView(this)) {
          jQuery(this).show();
        } else {
          jQuery(this).hide();
        }
      });
    }
  });
  /** @type {function (?, string, string, Window, Array): ?} */
  jQuery.Tween = Tween;
  Tween.prototype = {
    /** @type {function (?, string, string, Window, Array): ?} */
    constructor : Tween,
    /**
     * @param {?} allBindingsAccessor
     * @param {Object} options
     * @param {?} prop
     * @param {number} to
     * @param {string} easing
     * @param {string} unit
     * @return {undefined}
     */
    init : function(allBindingsAccessor, options, prop, to, easing, unit) {
      this.elem = allBindingsAccessor;
      this.prop = prop;
      this.easing = easing || jQuery.easing._default;
      /** @type {Object} */
      this.options = options;
      this.start = this.now = this.cur();
      /** @type {number} */
      this.end = to;
      this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
    },
    /**
     * @return {?}
     */
    cur : function() {
      var hooks = Tween.propHooks[this.prop];
      return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
    },
    /**
     * @param {number} percent
     * @return {?}
     */
    run : function(percent) {
      var eased;
      var hooks = Tween.propHooks[this.prop];
      return this.options.duration ? this.pos = eased = jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration) : this.pos = eased = percent, this.now = (this.end - this.start) * eased + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), hooks && hooks.set ? hooks.set(this) : Tween.propHooks._default.set(this), this;
    }
  };
  Tween.prototype.init.prototype = Tween.prototype;
  Tween.propHooks = {
    _default : {
      /**
       * @param {Object} tween
       * @return {?}
       */
      get : function(tween) {
        var node;
        return 1 !== tween.elem.nodeType || null != tween.elem[tween.prop] && null == tween.elem.style[tween.prop] ? tween.elem[tween.prop] : (node = jQuery.css(tween.elem, tween.prop, ""), node && "auto" !== node ? node : 0);
      },
      /**
       * @param {Object} tween
       * @return {undefined}
       */
      set : function(tween) {
        if (jQuery.fx.step[tween.prop]) {
          jQuery.fx.step[tween.prop](tween);
        } else {
          if (1 !== tween.elem.nodeType || null == tween.elem.style[jQuery.cssProps[tween.prop]] && !jQuery.cssHooks[tween.prop]) {
            tween.elem[tween.prop] = tween.now;
          } else {
            jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
          }
        }
      }
    }
  };
  Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
    /**
     * @param {Object} tween
     * @return {undefined}
     */
    set : function(tween) {
      if (tween.elem.nodeType) {
        if (tween.elem.parentNode) {
          tween.elem[tween.prop] = tween.now;
        }
      }
    }
  };
  jQuery.easing = {
    /**
     * @param {?} t
     * @return {?}
     */
    linear : function(t) {
      return t;
    },
    /**
     * @param {number} p
     * @return {?}
     */
    swing : function(p) {
      return 0.5 - Math.cos(p * Math.PI) / 2;
    },
    _default : "swing"
  };
  /** @type {function (?, Object, ?, number, string, string): undefined} */
  jQuery.fx = Tween.prototype.init;
  jQuery.fx.step = {};
  var fxNow;
  var readyStateTimer;
  /** @type {RegExp} */
  var rplusequals = /^(?:toggle|show|hide)$/;
  /** @type {RegExp} */
  var rrun = /queueHooks$/;
  jQuery.Animation = jQuery.extend(Animation, {
    tweeners : {
      "*" : [function(v, value) {
        var tween = this.createTween(v, value);
        return add(tween.elem, v, rfxnum.exec(value), tween), tween;
      }]
    },
    /**
     * @param {Object} value
     * @param {Function} callback
     * @return {undefined}
     */
    tweener : function(value, callback) {
      if (jQuery.isFunction(value)) {
        /** @type {Object} */
        callback = value;
        /** @type {Array} */
        value = ["*"];
      } else {
        value = value.match(core_rnotwhite);
      }
      var y;
      /** @type {number} */
      var x = 0;
      var len = value.length;
      for (;len > x;x++) {
        y = value[x];
        Animation.tweeners[y] = Animation.tweeners[y] || [];
        Animation.tweeners[y].unshift(callback);
      }
    },
    prefilters : [defaultPrefilter],
    /**
     * @param {?} suite
     * @param {?} prepend
     * @return {undefined}
     */
    prefilter : function(suite, prepend) {
      if (prepend) {
        Animation.prefilters.unshift(suite);
      } else {
        Animation.prefilters.push(suite);
      }
    }
  });
  /**
   * @param {Object} speed
   * @param {Object} easing
   * @param {Object} fn
   * @return {?}
   */
  jQuery.speed = function(speed, easing, fn) {
    var opt = speed && "object" == typeof speed ? jQuery.extend({}, speed) : {
      complete : fn || (!fn && easing || jQuery.isFunction(speed) && speed),
      duration : speed,
      easing : fn && easing || easing && (!jQuery.isFunction(easing) && easing)
    };
    return opt.duration = jQuery.fx.off ? 0 : "number" == typeof opt.duration ? opt.duration : opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default, null != opt.queue && opt.queue !== true || (opt.queue = "fx"), opt.old = opt.complete, opt.complete = function() {
      if (jQuery.isFunction(opt.old)) {
        opt.old.call(this);
      }
      if (opt.queue) {
        jQuery.dequeue(this, opt.queue);
      }
    }, opt;
  };
  jQuery.fn.extend({
    /**
     * @param {?} speed
     * @param {(number|string)} to
     * @param {Object} callback
     * @param {Object} _callback
     * @return {?}
     */
    fadeTo : function(speed, to, callback, _callback) {
      return this.filter(suiteView).css("opacity", 0).show().end().animate({
        opacity : to
      }, speed, callback, _callback);
    },
    /**
     * @param {?} prop
     * @param {?} speed
     * @param {Object} easing
     * @param {Object} callback
     * @return {?}
     */
    animate : function(prop, speed, easing, callback) {
      var empty = jQuery.isEmptyObject(prop);
      var optall = jQuery.speed(speed, easing, callback);
      /**
       * @return {undefined}
       */
      var doAnimation = function() {
        var anim = Animation(this, jQuery.extend({}, prop), optall);
        if (empty || jQuery._data(this, "finish")) {
          anim.stop(true);
        }
      };
      return doAnimation.finish = doAnimation, empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
    },
    /**
     * @param {Object} type
     * @param {Object} clearQueue
     * @param {Object} gotoEnd
     * @return {?}
     */
    stop : function(type, clearQueue, gotoEnd) {
      /**
       * @param {Object} e
       * @return {undefined}
       */
      var stop = function(e) {
        var stop = e.stop;
        delete e.stop;
        stop(gotoEnd);
      };
      return "string" != typeof type && (gotoEnd = clearQueue, clearQueue = type, type = void 0), clearQueue && (type !== false && this.queue(type || "fx", [])), this.each(function() {
        /** @type {boolean} */
        var t = true;
        var index = null != type && type + "queueHooks";
        /** @type {Array} */
        var timers = jQuery.timers;
        var iteratee = jQuery._data(this);
        if (index) {
          if (iteratee[index]) {
            if (iteratee[index].stop) {
              stop(iteratee[index]);
            }
          }
        } else {
          for (index in iteratee) {
            if (iteratee[index]) {
              if (iteratee[index].stop) {
                if (rrun.test(index)) {
                  stop(iteratee[index]);
                }
              }
            }
          }
        }
        /** @type {number} */
        index = timers.length;
        for (;index--;) {
          if (!(timers[index].elem !== this)) {
            if (!(null != type && timers[index].queue !== type)) {
              timers[index].anim.stop(gotoEnd);
              /** @type {boolean} */
              t = false;
              timers.splice(index, 1);
            }
          }
        }
        if (!(!t && gotoEnd)) {
          jQuery.dequeue(this, type);
        }
      });
    },
    /**
     * @param {string} type
     * @return {?}
     */
    finish : function(type) {
      return type !== false && (type = type || "fx"), this.each(function() {
        var index;
        var data = jQuery._data(this);
        var array = data[type + "queue"];
        var event = data[type + "queueHooks"];
        /** @type {Array} */
        var timers = jQuery.timers;
        var length = array ? array.length : 0;
        /** @type {boolean} */
        data.finish = true;
        jQuery.queue(this, type, []);
        if (event) {
          if (event.stop) {
            event.stop.call(this, true);
          }
        }
        /** @type {number} */
        index = timers.length;
        for (;index--;) {
          if (timers[index].elem === this) {
            if (timers[index].queue === type) {
              timers[index].anim.stop(true);
              timers.splice(index, 1);
            }
          }
        }
        /** @type {number} */
        index = 0;
        for (;length > index;index++) {
          if (array[index]) {
            if (array[index].finish) {
              array[index].finish.call(this);
            }
          }
        }
        delete data.finish;
      });
    }
  });
  jQuery.each(["toggle", "show", "hide"], function(dataAndEvents, name) {
    var matcherFunction = jQuery.fn[name];
    /**
     * @param {Object} speed
     * @param {Object} callback
     * @param {Object} next_callback
     * @return {?}
     */
    jQuery.fn[name] = function(speed, callback, next_callback) {
      return null == speed || "boolean" == typeof speed ? matcherFunction.apply(this, arguments) : this.animate($(name, true), speed, callback, next_callback);
    };
  });
  jQuery.each({
    slideDown : $("show"),
    slideUp : $("hide"),
    slideToggle : $("toggle"),
    fadeIn : {
      opacity : "show"
    },
    fadeOut : {
      opacity : "hide"
    },
    fadeToggle : {
      opacity : "toggle"
    }
  }, function(original, props) {
    /**
     * @param {?} speed
     * @param {Object} callback
     * @param {Object} next_callback
     * @return {?}
     */
    jQuery.fn[original] = function(speed, callback, next_callback) {
      return this.animate(props, speed, callback, next_callback);
    };
  });
  /** @type {Array} */
  jQuery.timers = [];
  /**
   * @return {undefined}
   */
  jQuery.fx.tick = function() {
    var last;
    /** @type {Array} */
    var timers = jQuery.timers;
    /** @type {number} */
    var i = 0;
    fxNow = jQuery.now();
    for (;i < timers.length;i++) {
      last = timers[i];
      if (!last()) {
        if (!(timers[i] !== last)) {
          timers.splice(i--, 1);
        }
      }
    }
    if (!timers.length) {
      jQuery.fx.stop();
    }
    fxNow = void 0;
  };
  /**
   * @param {?} timer
   * @return {undefined}
   */
  jQuery.fx.timer = function(timer) {
    jQuery.timers.push(timer);
    if (timer()) {
      jQuery.fx.start();
    } else {
      jQuery.timers.pop();
    }
  };
  /** @type {number} */
  jQuery.fx.interval = 13;
  /**
   * @return {undefined}
   */
  jQuery.fx.start = function() {
    if (!readyStateTimer) {
      readyStateTimer = win.setInterval(jQuery.fx.tick, jQuery.fx.interval);
    }
  };
  /**
   * @return {undefined}
   */
  jQuery.fx.stop = function() {
    win.clearInterval(readyStateTimer);
    /** @type {null} */
    readyStateTimer = null;
  };
  jQuery.fx.speeds = {
    slow : 600,
    fast : 200,
    _default : 400
  };
  /**
   * @param {HTMLElement} time
   * @param {string} type
   * @return {?}
   */
  jQuery.fn.delay = function(time, type) {
    return time = jQuery.fx ? jQuery.fx.speeds[time] || time : time, type = type || "fx", this.queue(type, function(next, event) {
      var timeout = win.setTimeout(next, time);
      /**
       * @return {undefined}
       */
      event.stop = function() {
        win.clearTimeout(timeout);
      };
    });
  };
  (function() {
    var e;
    var input = doc.createElement("input");
    var d = doc.createElement("div");
    var select = doc.createElement("select");
    var opt = select.appendChild(doc.createElement("option"));
    d = doc.createElement("div");
    d.setAttribute("className", "t");
    /** @type {string} */
    d.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
    e = d.getElementsByTagName("a")[0];
    input.setAttribute("type", "checkbox");
    d.appendChild(input);
    e = d.getElementsByTagName("a")[0];
    /** @type {string} */
    e.style.cssText = "top:1px";
    /** @type {boolean} */
    support.getSetAttribute = "t" !== d.className;
    /** @type {boolean} */
    support.style = /top/.test(e.getAttribute("style"));
    /** @type {boolean} */
    support.hrefNormalized = "/a" === e.getAttribute("href");
    /** @type {boolean} */
    support.checkOn = !!input.value;
    support.optSelected = opt.selected;
    /** @type {boolean} */
    support.enctype = !!doc.createElement("form").enctype;
    /** @type {boolean} */
    select.disabled = true;
    /** @type {boolean} */
    support.optDisabled = !opt.disabled;
    input = doc.createElement("input");
    input.setAttribute("value", "");
    /** @type {boolean} */
    support.input = "" === input.getAttribute("value");
    /** @type {string} */
    input.value = "t";
    input.setAttribute("type", "radio");
    /** @type {boolean} */
    support.radioValue = "t" === input.value;
  })();
  /** @type {RegExp} */
  var rreturn = /\r/g;
  jQuery.fn.extend({
    /**
     * @param {Function} value
     * @return {?}
     */
    val : function(value) {
      var hooks;
      var ret;
      var isFunction;
      var elem = this[0];
      if (arguments.length) {
        return isFunction = jQuery.isFunction(value), this.each(function(i) {
          var val;
          if (1 === this.nodeType) {
            val = isFunction ? value.call(this, i, jQuery(this).val()) : value;
            if (null == val) {
              /** @type {string} */
              val = "";
            } else {
              if ("number" == typeof val) {
                val += "";
              } else {
                if (jQuery.isArray(val)) {
                  val = jQuery.map(val, function(month) {
                    return null == month ? "" : month + "";
                  });
                }
              }
            }
            hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];
            if (!(hooks && ("set" in hooks && void 0 !== hooks.set(this, val, "value")))) {
              this.value = val;
            }
          }
        });
      }
      if (elem) {
        return hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()], hooks && ("get" in hooks && void 0 !== (ret = hooks.get(elem, "value"))) ? ret : (ret = elem.value, "string" == typeof ret ? ret.replace(rreturn, "") : null == ret ? "" : ret);
      }
    }
  });
  jQuery.extend({
    valHooks : {
      option : {
        /**
         * @param {Function} owner
         * @return {?}
         */
        get : function(owner) {
          var unlock = jQuery.find.attr(owner, "value");
          return null != unlock ? unlock : jQuery.trim(jQuery.text(owner));
        }
      },
      select : {
        /**
         * @param {Object} elem
         * @return {?}
         */
        get : function(elem) {
          var copies;
          var option;
          var options = elem.options;
          var index = elem.selectedIndex;
          /** @type {boolean} */
          var one = "select-one" === elem.type || 0 > index;
          /** @type {(Array|null)} */
          var out = one ? null : [];
          var max = one ? index + 1 : options.length;
          var i = 0 > index ? max : one ? index : 0;
          for (;max > i;i++) {
            if (option = options[i], (option.selected || i === index) && ((support.optDisabled ? !option.disabled : null === option.getAttribute("disabled")) && (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup")))) {
              if (copies = jQuery(option).val(), one) {
                return copies;
              }
              out.push(copies);
            }
          }
          return out;
        },
        /**
         * @param {Object} instance
         * @param {string} value
         * @return {?}
         */
        set : function(instance, value) {
          var selected;
          var elem;
          var nodes = instance.options;
          var values = jQuery.makeArray(value);
          var i = nodes.length;
          for (;i--;) {
            if (elem = nodes[i], jQuery.inArray(jQuery.valHooks.option.get(elem), values) >= 0) {
              try {
                /** @type {boolean} */
                elem.selected = selected = true;
              } catch (s) {
                elem.scrollHeight;
              }
            } else {
              /** @type {boolean} */
              elem.selected = false;
            }
          }
          return selected || (instance.selectedIndex = -1), nodes;
        }
      }
    }
  });
  jQuery.each(["radio", "checkbox"], function() {
    jQuery.valHooks[this] = {
      /**
       * @param {Object} elem
       * @param {string} value
       * @return {?}
       */
      set : function(elem, value) {
        return jQuery.isArray(value) ? elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1 : void 0;
      }
    };
    if (!support.checkOn) {
      /**
       * @param {Object} elem
       * @return {?}
       */
      jQuery.valHooks[this].get = function(elem) {
        return null === elem.getAttribute("value") ? "on" : elem.value;
      };
    }
  });
  var nodeHook;
  var boolHook;
  var object = jQuery.expr.attrHandle;
  /** @type {RegExp} */
  var exclude = /^(?:checked|selected)$/i;
  var getSetAttribute = support.getSetAttribute;
  var str = support.input;
  jQuery.fn.extend({
    /**
     * @param {Object} elem
     * @param {string} val
     * @return {?}
     */
    attr : function(elem, val) {
      return access(this, jQuery.attr, elem, val, arguments.length > 1);
    },
    /**
     * @param {Object} name
     * @return {?}
     */
    removeAttr : function(name) {
      return this.each(function() {
        jQuery.removeAttr(this, name);
      });
    }
  });
  jQuery.extend({
    /**
     * @param {Object} elem
     * @param {string} name
     * @param {string} value
     * @return {?}
     */
    attr : function(elem, name, value) {
      var ret;
      var hooks;
      var nodeType = elem.nodeType;
      if (3 !== nodeType && (8 !== nodeType && 2 !== nodeType)) {
        return "undefined" == typeof elem.getAttribute ? jQuery.prop(elem, name, value) : (1 === nodeType && jQuery.isXMLDoc(elem) || (name = name.toLowerCase(), hooks = jQuery.attrHooks[name] || (jQuery.expr.match.bool.test(name) ? boolHook : nodeHook)), void 0 !== value ? null === value ? void jQuery.removeAttr(elem, name) : hooks && ("set" in hooks && void 0 !== (ret = hooks.set(elem, value, name))) ? ret : (elem.setAttribute(name, value + ""), value) : hooks && ("get" in hooks && null !== (ret =
          hooks.get(elem, name))) ? ret : (ret = jQuery.find.attr(elem, name), null == ret ? void 0 : ret));
      }
    },
    attrHooks : {
      type : {
        /**
         * @param {Object} elem
         * @param {string} value
         * @return {?}
         */
        set : function(elem, value) {
          if (!support.radioValue && ("radio" === value && jQuery.nodeName(elem, "input"))) {
            var val = elem.value;
            return elem.setAttribute("type", value), val && (elem.value = val), value;
          }
        }
      }
    },
    /**
     * @param {Object} elem
     * @param {string} value
     * @return {undefined}
     */
    removeAttr : function(elem, value) {
      var name;
      var propName;
      /** @type {number} */
      var i = 0;
      var attrNames = value && value.match(core_rnotwhite);
      if (attrNames && 1 === elem.nodeType) {
        for (;name = attrNames[i++];) {
          propName = jQuery.propFix[name] || name;
          if (jQuery.expr.match.bool.test(name)) {
            if (str && getSetAttribute || !exclude.test(name)) {
              /** @type {boolean} */
              elem[propName] = false;
            } else {
              /** @type {boolean} */
              elem[jQuery.camelCase("default-" + name)] = elem[propName] = false;
            }
          } else {
            jQuery.attr(elem, name, "");
          }
          elem.removeAttribute(getSetAttribute ? name : propName);
        }
      }
    }
  });
  boolHook = {
    /**
     * @param {Object} elem
     * @param {string} value
     * @param {string} name
     * @return {?}
     */
    set : function(elem, value, name) {
      return value === false ? jQuery.removeAttr(elem, name) : str && getSetAttribute || !exclude.test(name) ? elem.setAttribute(!getSetAttribute && jQuery.propFix[name] || name, name) : elem[jQuery.camelCase("default-" + name)] = elem[name] = true, name;
    }
  };
  jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(dataAndEvents, name) {
    var getter = object[name] || jQuery.find.attr;
    if (str && getSetAttribute || !exclude.test(name)) {
      /**
       * @param {Object} elem
       * @param {string} name
       * @param {string} isXML
       * @return {?}
       */
      object[name] = function(elem, name, isXML) {
        var source;
        var value;
        return isXML || (value = object[name], object[name] = source, source = null != getter(elem, name, isXML) ? name.toLowerCase() : null, object[name] = value), source;
      };
    } else {
      /**
       * @param {?} dataAndEvents
       * @param {string} name
       * @param {boolean} deepDataAndEvents
       * @return {?}
       */
      object[name] = function(dataAndEvents, name, deepDataAndEvents) {
        return deepDataAndEvents ? void 0 : dataAndEvents[jQuery.camelCase("default-" + name)] ? name.toLowerCase() : null;
      };
    }
  });
  if (!(str && getSetAttribute)) {
    jQuery.attrHooks.value = {
      /**
       * @param {Object} elem
       * @param {string} value
       * @param {string} name
       * @return {?}
       */
      set : function(elem, value, name) {
        return jQuery.nodeName(elem, "input") ? void(elem.defaultValue = value) : nodeHook && nodeHook.set(elem, value, name);
      }
    };
  }
  if (!getSetAttribute) {
    nodeHook = {
      /**
       * @param {Object} elem
       * @param {string} value
       * @param {string} name
       * @return {?}
       */
      set : function(elem, value, name) {
        var ret = elem.getAttributeNode(name);
        return ret || elem.setAttributeNode(ret = elem.ownerDocument.createAttribute(name)), ret.value = value += "", "value" === name || value === elem.getAttribute(name) ? value : void 0;
      }
    };
    /** @type {function (Object, ?, boolean): ?} */
    object.id = object.name = object.coords = function(elem, name, isXML) {
      var weight;
      return isXML ? void 0 : (weight = elem.getAttributeNode(name)) && "" !== weight.value ? weight.value : null;
    };
    jQuery.valHooks.button = {
      /**
       * @param {Object} elem
       * @param {string} name
       * @return {?}
       */
      get : function(elem, name) {
        var node = elem.getAttributeNode(name);
        return node && node.specified ? node.value : void 0;
      },
      /** @type {function (Object, string, string): ?} */
      set : nodeHook.set
    };
    jQuery.attrHooks.contenteditable = {
      /**
       * @param {Object} elem
       * @param {string} value
       * @param {string} name
       * @return {undefined}
       */
      set : function(elem, value, name) {
        nodeHook.set(elem, "" === value ? false : value, name);
      }
    };
    jQuery.each(["width", "height"], function(dataAndEvents, name) {
      jQuery.attrHooks[name] = {
        /**
         * @param {Object} elem
         * @param {string} value
         * @return {?}
         */
        set : function(elem, value) {
          return "" === value ? (elem.setAttribute(name, "auto"), value) : void 0;
        }
      };
    });
  }
  if (!support.style) {
    jQuery.attrHooks.style = {
      /**
       * @param {Object} second
       * @return {?}
       */
      get : function(second) {
        return second.style.cssText || void 0;
      },
      /**
       * @param {Object} elem
       * @param {string} value
       * @return {?}
       */
      set : function(elem, value) {
        return elem.style.cssText = value + "";
      }
    };
  }
  /** @type {RegExp} */
  var rinputs = /^(?:input|select|textarea|button|object)$/i;
  /** @type {RegExp} */
  var rheader = /^(?:a|area)$/i;
  jQuery.fn.extend({
    /**
     * @param {?} name
     * @param {string} value
     * @return {?}
     */
    prop : function(name, value) {
      return access(this, jQuery.prop, name, value, arguments.length > 1);
    },
    /**
     * @param {(Element|string)} name
     * @return {?}
     */
    removeProp : function(name) {
      return name = jQuery.propFix[name] || name, this.each(function() {
        try {
          this[name] = void 0;
          delete this[name];
        } catch (t) {
        }
      });
    }
  });
  jQuery.extend({
    /**
     * @param {Object} elem
     * @param {string} name
     * @param {string} value
     * @return {?}
     */
    prop : function(elem, name, value) {
      var ret;
      var hooks;
      var nodeType = elem.nodeType;
      if (3 !== nodeType && (8 !== nodeType && 2 !== nodeType)) {
        return 1 === nodeType && jQuery.isXMLDoc(elem) || (name = jQuery.propFix[name] || name, hooks = jQuery.propHooks[name]), void 0 !== value ? hooks && ("set" in hooks && void 0 !== (ret = hooks.set(elem, value, name))) ? ret : elem[name] = value : hooks && ("get" in hooks && null !== (ret = hooks.get(elem, name))) ? ret : elem[name];
      }
    },
    propHooks : {
      tabIndex : {
        /**
         * @param {Object} elem
         * @return {?}
         */
        get : function(elem) {
          var tabindex = jQuery.find.attr(elem, "tabindex");
          return tabindex ? parseInt(tabindex, 10) : rinputs.test(elem.nodeName) || rheader.test(elem.nodeName) && elem.href ? 0 : -1;
        }
      }
    },
    propFix : {
      "for" : "htmlFor",
      "class" : "className"
    }
  });
  if (!support.hrefNormalized) {
    jQuery.each(["href", "src"], function(dataAndEvents, name) {
      jQuery.propHooks[name] = {
        /**
         * @param {Object} elem
         * @return {?}
         */
        get : function(elem) {
          return elem.getAttribute(name, 4);
        }
      };
    });
  }
  if (!support.optSelected) {
    jQuery.propHooks.selected = {
      /**
       * @param {Object} second
       * @return {?}
       */
      get : function(second) {
        var elem = second.parentNode;
        return elem && (elem.selectedIndex, elem.parentNode && elem.parentNode.selectedIndex), null;
      }
    };
  }
  jQuery.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
    jQuery.propFix[this.toLowerCase()] = this;
  });
  if (!support.enctype) {
    /** @type {string} */
    jQuery.propFix.enctype = "encoding";
  }
  /** @type {RegExp} */
  var rQuot = /[\t\r\n\f]/g;
  jQuery.fn.extend({
    /**
     * @param {string} fn
     * @return {?}
     */
    addClass : function(fn) {
      var classNames;
      var elem;
      var arg;
      var ret;
      var className;
      var i;
      var value;
      /** @type {number} */
      var c = 0;
      if (jQuery.isFunction(fn)) {
        return this.each(function(val) {
          jQuery(this).addClass(fn.call(this, val, getter(this)));
        });
      }
      if ("string" == typeof fn && fn) {
        /** @type {Array} */
        classNames = fn.match(core_rnotwhite) || [];
        for (;elem = this[c++];) {
          if (ret = getter(elem), arg = 1 === elem.nodeType && (" " + ret + " ").replace(rQuot, " ")) {
            /** @type {number} */
            i = 0;
            for (;className = classNames[i++];) {
              if (arg.indexOf(" " + className + " ") < 0) {
                arg += className + " ";
              }
            }
            value = jQuery.trim(arg);
            if (ret !== value) {
              jQuery.attr(elem, "class", value);
            }
          }
        }
      }
      return this;
    },
    /**
     * @param {string} value
     * @return {?}
     */
    removeClass : function(value) {
      var res;
      var elem;
      var html;
      var ret;
      var apn;
      var resLength;
      var i;
      /** @type {number} */
      var c = 0;
      if (jQuery.isFunction(value)) {
        return this.each(function(j) {
          jQuery(this).removeClass(value.call(this, j, getter(this)));
        });
      }
      if (!arguments.length) {
        return this.attr("class", "");
      }
      if ("string" == typeof value && value) {
        /** @type {Array} */
        res = value.match(core_rnotwhite) || [];
        for (;elem = this[c++];) {
          if (ret = getter(elem), html = 1 === elem.nodeType && (" " + ret + " ").replace(rQuot, " ")) {
            /** @type {number} */
            resLength = 0;
            for (;apn = res[resLength++];) {
              for (;html.indexOf(" " + apn + " ") > -1;) {
                /** @type {string} */
                html = html.replace(" " + apn + " ", " ");
              }
            }
            i = jQuery.trim(html);
            if (ret !== i) {
              jQuery.attr(elem, "class", i);
            }
          }
        }
      }
      return this;
    },
    /**
     * @param {string} value
     * @param {?} stateVal
     * @return {?}
     */
    toggleClass : function(value, stateVal) {
      /** @type {string} */
      var type = typeof value;
      return "boolean" == typeof stateVal && "string" === type ? stateVal ? this.addClass(value) : this.removeClass(value) : jQuery.isFunction(value) ? this.each(function(i) {
        jQuery(this).toggleClass(value.call(this, i, getter(this), stateVal), stateVal);
      }) : this.each(function() {
        var name;
        var i;
        var elem;
        var attrNames;
        if ("string" === type) {
          /** @type {number} */
          i = 0;
          elem = jQuery(this);
          attrNames = value.match(core_rnotwhite) || [];
          for (;name = attrNames[i++];) {
            if (elem.hasClass(name)) {
              elem.removeClass(name);
            } else {
              elem.addClass(name);
            }
          }
        } else {
          if (!(void 0 !== value && "boolean" !== type)) {
            name = getter(this);
            if (name) {
              jQuery._data(this, "__className__", name);
            }
            jQuery.attr(this, "class", name || value === false ? "" : jQuery._data(this, "__className__") || "");
          }
        }
      });
    },
    /**
     * @param {string} name
     * @return {?}
     */
    hasClass : function(name) {
      var tval;
      var node;
      /** @type {number} */
      var i = 0;
      /** @type {string} */
      tval = " " + name + " ";
      for (;node = this[i++];) {
        if (1 === node.nodeType && (" " + getter(node) + " ").replace(rQuot, " ").indexOf(tval) > -1) {
          return true;
        }
      }
      return false;
    }
  });
  jQuery.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(dataAndEvents, name) {
    /**
     * @param {Function} one
     * @param {Object} fn
     * @return {?}
     */
    jQuery.fn[name] = function(one, fn) {
      return arguments.length > 0 ? this.on(name, null, one, fn) : this.trigger(name);
    };
  });
  jQuery.fn.extend({
    /**
     * @param {undefined} fnOver
     * @param {Object} fnOut
     * @return {?}
     */
    hover : function(fnOver, fnOut) {
      return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
    }
  });
  var location = win.location;
  var iIdCounter = jQuery.now();
  /** @type {RegExp} */
  var rquery = /\?/;
  /** @type {RegExp} */
  var rSlash = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
  /**
   * @param {(number|string)} data
   * @return {?}
   */
  jQuery.parseJSON = function(data) {
    if (win.JSON && win.JSON.parse) {
      return win.JSON.parse(data + "");
    }
    var result;
    /** @type {null} */
    var deferred = null;
    var s = jQuery.trim(data + "");
    return s && !jQuery.trim(s.replace(rSlash, function(promise, err2, err, dataAndEvents) {
      return result && (err2 && (deferred = 0)), 0 === deferred ? promise : (result = err || err2, deferred += !dataAndEvents - !err, "");
    })) ? Function("return " + s)() : jQuery.error("Invalid JSON: " + data);
  };
  /**
   * @param {string} data
   * @return {?}
   */
  jQuery.parseXML = function(data) {
    var xml;
    var tmp;
    if (!data || "string" != typeof data) {
      return null;
    }
    try {
      if (win.DOMParser) {
        tmp = new win.DOMParser;
        xml = tmp.parseFromString(data, "text/xml");
      } else {
        xml = new win.ActiveXObject("Microsoft.XMLDOM");
        /** @type {string} */
        xml.async = "false";
        xml.loadXML(data);
      }
    } catch (r) {
      xml = void 0;
    }
    return xml && (xml.documentElement && !xml.getElementsByTagName("parsererror").length) || jQuery.error("Invalid XML: " + data), xml;
  };
  /** @type {RegExp} */
  var trimLeft = /#.*$/;
  /** @type {RegExp} */
  var rts = /([?&])_=[^&]*/;
  /** @type {RegExp} */
  var re = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm;
  /** @type {RegExp} */
  var selfClosingTag = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/;
  /** @type {RegExp} */
  var rnoContent = /^(?:GET|HEAD)$/;
  /** @type {RegExp} */
  var rprotocol = /^\/\//;
  /** @type {RegExp} */
  var quickExpr = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/;
  var prefilters = {};
  var transports = {};
  /** @type {string} */
  var Kt = "*/".concat("*");
  var url = location.href;
  /** @type {Array} */
  var match = quickExpr.exec(url.toLowerCase()) || [];
  jQuery.extend({
    active : 0,
    lastModified : {},
    etag : {},
    ajaxSettings : {
      url : url,
      type : "GET",
      isLocal : selfClosingTag.test(match[1]),
      global : true,
      processData : true,
      async : true,
      contentType : "application/x-www-form-urlencoded; charset=UTF-8",
      accepts : {
        "*" : Kt,
        text : "text/plain",
        html : "text/html",
        xml : "application/xml, text/xml",
        json : "application/json, text/javascript"
      },
      contents : {
        xml : /\bxml\b/,
        html : /\bhtml/,
        json : /\bjson\b/
      },
      responseFields : {
        xml : "responseXML",
        text : "responseText",
        json : "responseJSON"
      },
      converters : {
        /** @type {function (new:String, *=): string} */
        "* text" : String,
        "text html" : true,
        /** @type {function ((number|string)): ?} */
        "text json" : jQuery.parseJSON,
        /** @type {function (string): ?} */
        "text xml" : jQuery.parseXML
      },
      flatOptions : {
        url : true,
        context : true
      }
    },
    /**
     * @param {(Object|string)} target
     * @param {Object} settings
     * @return {?}
     */
    ajaxSetup : function(target, settings) {
      return settings ? ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) : ajaxExtend(jQuery.ajaxSettings, target);
    },
    ajaxPrefilter : addToPrefiltersOrTransports(prefilters),
    ajaxTransport : addToPrefiltersOrTransports(transports),
    /**
     * @param {Object} arg
     * @param {Object} options
     * @return {?}
     */
    ajax : function(arg, options) {
      /**
       * @param {number} status
       * @param {Node} nativeStatusText
       * @param {Object} responses
       * @param {string} total
       * @return {undefined}
       */
      function done(status, nativeStatusText, responses, total) {
        var isSuccess;
        var success;
        var error;
        var response;
        var modified;
        /** @type {Node} */
        var statusText = nativeStatusText;
        if (2 !== number) {
          /** @type {number} */
          number = 2;
          if (resizeId) {
            win.clearTimeout(resizeId);
          }
          transport = void 0;
          value = total || "";
          /** @type {number} */
          jqXHR.readyState = status > 0 ? 4 : 0;
          /** @type {boolean} */
          isSuccess = status >= 200 && 300 > status || 304 === status;
          if (responses) {
            response = ajaxHandleResponses(s, jqXHR, responses);
          }
          response = ajaxConvert(s, response, jqXHR, isSuccess);
          if (isSuccess) {
            if (s.ifModified) {
              modified = jqXHR.getResponseHeader("Last-Modified");
              if (modified) {
                jQuery.lastModified[cacheURL] = modified;
              }
              modified = jqXHR.getResponseHeader("etag");
              if (modified) {
                jQuery.etag[cacheURL] = modified;
              }
            }
            if (204 === status || "HEAD" === s.type) {
              /** @type {string} */
              statusText = "nocontent";
            } else {
              if (304 === status) {
                /** @type {string} */
                statusText = "notmodified";
              } else {
                statusText = response.state;
                success = response.data;
                error = response.error;
                /** @type {boolean} */
                isSuccess = !error;
              }
            }
          } else {
            error = statusText;
            if (!(!status && statusText)) {
              /** @type {string} */
              statusText = "error";
              if (0 > status) {
                /** @type {number} */
                status = 0;
              }
            }
          }
          /** @type {number} */
          jqXHR.status = status;
          /** @type {string} */
          jqXHR.statusText = (nativeStatusText || statusText) + "";
          if (isSuccess) {
            deferred.resolveWith(context, [success, statusText, jqXHR]);
          } else {
            deferred.rejectWith(context, [jqXHR, statusText, error]);
          }
          jqXHR.statusCode(statusCode);
          statusCode = void 0;
          if (ajaxSend) {
            globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [jqXHR, s, isSuccess ? success : error]);
          }
          completeDeferred.fireWith(context, [jqXHR, statusText]);
          if (ajaxSend) {
            globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
            if (!--jQuery.active) {
              jQuery.event.trigger("ajaxStop");
            }
          }
        }
      }
      if ("object" == typeof arg) {
        /** @type {Object} */
        options = arg;
        arg = void 0;
      }
      options = options || {};
      var t;
      var i;
      var cacheURL;
      var value;
      var resizeId;
      var ajaxSend;
      var transport;
      var target;
      var s = jQuery.ajaxSetup({}, options);
      var context = s.context || s;
      var globalEventContext = s.context && (context.nodeType || context.jquery) ? jQuery(context) : jQuery.event;
      var deferred = jQuery.Deferred();
      var completeDeferred = jQuery.Callbacks("once memory");
      var statusCode = s.statusCode || {};
      var requestHeaders = {};
      var requestHeadersNames = {};
      /** @type {number} */
      var number = 0;
      /** @type {string} */
      var strAbort = "canceled";
      var jqXHR = {
        readyState : 0,
        /**
         * @param {string} key
         * @return {?}
         */
        getResponseHeader : function(key) {
          var src;
          if (2 === number) {
            if (!target) {
              target = {};
              for (;src = re.exec(value);) {
                /** @type {string} */
                target[src[1].toLowerCase()] = src[2];
              }
            }
            src = target[key.toLowerCase()];
          }
          return null == src ? null : src;
        },
        /**
         * @return {?}
         */
        getAllResponseHeaders : function() {
          return 2 === number ? value : null;
        },
        /**
         * @param {string} name
         * @param {?} value
         * @return {?}
         */
        setRequestHeader : function(name, value) {
          var lname = name.toLowerCase();
          return number || (name = requestHeadersNames[lname] = requestHeadersNames[lname] || name, requestHeaders[name] = value), this;
        },
        /**
         * @param {(Object|number)} type
         * @return {?}
         */
        overrideMimeType : function(type) {
          return number || (s.mimeType = type), this;
        },
        /**
         * @param {Object} map
         * @return {?}
         */
        statusCode : function(map) {
          var letter;
          if (map) {
            if (2 > number) {
              for (letter in map) {
                /** @type {Array} */
                statusCode[letter] = [statusCode[letter], map[letter]];
              }
            } else {
              jqXHR.always(map[jqXHR.status]);
            }
          }
          return this;
        },
        /**
         * @param {string} statusText
         * @return {?}
         */
        abort : function(statusText) {
          var finalText = statusText || strAbort;
          return transport && transport.abort(finalText), done(0, finalText), this;
        }
      };
      if (deferred.promise(jqXHR).complete = completeDeferred.add, jqXHR.success = jqXHR.done, jqXHR.error = jqXHR.fail, s.url = ((arg || (s.url || url)) + "").replace(trimLeft, "").replace(rprotocol, match[1] + "//"), s.type = options.method || (options.type || (s.method || s.type)), s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().match(core_rnotwhite) || [""], null == s.crossDomain && (t = quickExpr.exec(s.url.toLowerCase()), s.crossDomain = !(!t || t[1] === match[1] && (t[2] === match[2] &&
        (t[3] || ("http:" === t[1] ? "80" : "443")) === (match[3] || ("http:" === match[1] ? "80" : "443"))))), s.data && (s.processData && ("string" != typeof s.data && (s.data = jQuery.param(s.data, s.traditional)))), inspectPrefiltersOrTransports(prefilters, s, options, jqXHR), 2 === number) {
        return jqXHR;
      }
      ajaxSend = jQuery.event && s.global;
      if (ajaxSend) {
        if (0 === jQuery.active++) {
          jQuery.event.trigger("ajaxStart");
        }
      }
      s.type = s.type.toUpperCase();
      /** @type {boolean} */
      s.hasContent = !rnoContent.test(s.type);
      /** @type {string} */
      cacheURL = s.url;
      if (!s.hasContent) {
        if (s.data) {
          /** @type {string} */
          cacheURL = s.url += (rquery.test(cacheURL) ? "&" : "?") + s.data;
          delete s.data;
        }
        if (s.cache === false) {
          /** @type {string} */
          s.url = rts.test(cacheURL) ? cacheURL.replace(rts, "$1_=" + iIdCounter++) : cacheURL + (rquery.test(cacheURL) ? "&" : "?") + "_=" + iIdCounter++;
        }
      }
      if (s.ifModified) {
        if (jQuery.lastModified[cacheURL]) {
          jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
        }
        if (jQuery.etag[cacheURL]) {
          jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
        }
      }
      if (s.data && (s.hasContent && s.contentType !== false) || options.contentType) {
        jqXHR.setRequestHeader("Content-Type", s.contentType);
      }
      jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + ("*" !== s.dataTypes[0] ? ", " + Kt + "; q=0.01" : "") : s.accepts["*"]);
      for (i in s.headers) {
        jqXHR.setRequestHeader(i, s.headers[i]);
      }
      if (s.beforeSend && (s.beforeSend.call(context, jqXHR, s) === false || 2 === number)) {
        return jqXHR.abort();
      }
      /** @type {string} */
      strAbort = "abort";
      for (i in{
        success : 1,
        error : 1,
        complete : 1
      }) {
        jqXHR[i](s[i]);
      }
      if (transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR)) {
        if (jqXHR.readyState = 1, ajaxSend && globalEventContext.trigger("ajaxSend", [jqXHR, s]), 2 === number) {
          return jqXHR;
        }
        if (s.async) {
          if (s.timeout > 0) {
            resizeId = win.setTimeout(function() {
              jqXHR.abort("timeout");
            }, s.timeout);
          }
        }
        try {
          /** @type {number} */
          number = 1;
          transport.send(requestHeaders, done);
        } catch (e) {
          if (!(2 > number)) {
            throw e;
          }
          done(-1, e);
        }
      } else {
        done(-1, "No Transport");
      }
      return jqXHR;
    },
    /**
     * @param {Object} elem
     * @param {Object} name
     * @param {string} callback
     * @return {?}
     */
    getJSON : function(elem, name, callback) {
      return jQuery.get(elem, name, callback, "json");
    },
    /**
     * @param {Object} elem
     * @param {string} callback
     * @return {?}
     */
    getScript : function(elem, callback) {
      return jQuery.get(elem, void 0, callback, "script");
    }
  });
  jQuery.each(["get", "post"], function(dataAndEvents, method) {
    /**
     * @param {string} value
     * @param {Object} html
     * @param {Object} success
     * @param {boolean} dataType
     * @return {?}
     */
    jQuery[method] = function(value, html, success, dataType) {
      return jQuery.isFunction(html) && (dataType = dataType || success, success = html, html = void 0), jQuery.ajax(jQuery.extend({
        url : value,
        type : method,
        dataType : dataType,
        data : html,
        success : success
      }, jQuery.isPlainObject(value) && value));
    };
  });
  /**
   * @param {string} url
   * @return {?}
   */
  jQuery._evalUrl = function(url) {
    return jQuery.ajax({
      url : url,
      type : "GET",
      dataType : "script",
      cache : true,
      async : false,
      global : false,
      "throws" : true
    });
  };
  jQuery.fn.extend({
    /**
     * @param {Function} html
     * @return {?}
     */
    wrapAll : function(html) {
      if (jQuery.isFunction(html)) {
        return this.each(function(i) {
          jQuery(this).wrapAll(html.call(this, i));
        });
      }
      if (this[0]) {
        var wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);
        if (this[0].parentNode) {
          wrap.insertBefore(this[0]);
        }
        wrap.map(function() {
          var sandbox = this;
          for (;sandbox.firstChild && 1 === sandbox.firstChild.nodeType;) {
            sandbox = sandbox.firstChild;
          }
          return sandbox;
        }).append(this);
      }
      return this;
    },
    /**
     * @param {Function} html
     * @return {?}
     */
    wrapInner : function(html) {
      return jQuery.isFunction(html) ? this.each(function(i) {
        jQuery(this).wrapInner(html.call(this, i));
      }) : this.each(function() {
        var self = jQuery(this);
        var contents = self.contents();
        if (contents.length) {
          contents.wrapAll(html);
        } else {
          self.append(html);
        }
      });
    },
    /**
     * @param {Function} html
     * @return {?}
     */
    wrap : function(html) {
      var isFunction = jQuery.isFunction(html);
      return this.each(function(i) {
        jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
      });
    },
    /**
     * @return {?}
     */
    unwrap : function() {
      return this.parent().each(function() {
        if (!jQuery.nodeName(this, "body")) {
          jQuery(this).replaceWith(this.childNodes);
        }
      }).end();
    }
  });
  /**
   * @param {Function} obj
   * @return {?}
   */
  jQuery.expr.filters.hidden = function(obj) {
    return support.reliableHiddenOffsets() ? obj.offsetWidth <= 0 && (obj.offsetHeight <= 0 && !obj.getClientRects().length) : handle(obj);
  };
  /**
   * @param {Function} walkers
   * @return {?}
   */
  jQuery.expr.filters.visible = function(walkers) {
    return!jQuery.expr.filters.hidden(walkers);
  };
  /** @type {RegExp} */
  var rLt = /%20/g;
  /** @type {RegExp} */
  var rmargin = /\[\]$/;
  /** @type {RegExp} */
  var rCRLF = /\r?\n/g;
  /** @type {RegExp} */
  var mouseTypeRegex = /^(?:submit|button|image|reset|file)$/i;
  /** @type {RegExp} */
  var rsubmittable = /^(?:input|select|textarea|keygen)/i;
  /**
   * @param {Object} a
   * @param {Object} traditional
   * @return {?}
   */
  jQuery.param = function(a, traditional) {
    var prefix;
    /** @type {Array} */
    var klass = [];
    /**
     * @param {?} key
     * @param {Object} value
     * @return {undefined}
     */
    var add = function(key, value) {
      value = jQuery.isFunction(value) ? value() : null == value ? "" : value;
      /** @type {string} */
      klass[klass.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
    };
    if (void 0 === traditional && (traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional), jQuery.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) {
      jQuery.each(a, function() {
        add(this.name, this.value);
      });
    } else {
      for (prefix in a) {
        buildParams(prefix, a[prefix], traditional, add);
      }
    }
    return klass.join("&").replace(rLt, "+");
  };
  jQuery.fn.extend({
    /**
     * @return {?}
     */
    serialize : function() {
      return jQuery.param(this.serializeArray());
    },
    /**
     * @return {?}
     */
    serializeArray : function() {
      return this.map(function() {
        var elements = jQuery.prop(this, "elements");
        return elements ? jQuery.makeArray(elements) : this;
      }).filter(function() {
        var type = this.type;
        return this.name && (!jQuery(this).is(":disabled") && (rsubmittable.test(this.nodeName) && (!mouseTypeRegex.test(type) && (this.checked || !manipulation_rcheckableType.test(type)))));
      }).map(function(dataAndEvents, elem) {
        var val = jQuery(this).val();
        return null == val ? null : jQuery.isArray(val) ? jQuery.map(val, function(val) {
          return{
            name : elem.name,
            value : val.replace(rCRLF, "\r\n")
          };
        }) : {
          name : elem.name,
          value : val.replace(rCRLF, "\r\n")
        };
      }).get();
    }
  });
  /** @type {function (): ?} */
  jQuery.ajaxSettings.xhr = void 0 !== win.ActiveXObject ? function() {
    return this.isLocal ? createActiveXHR() : doc.documentMode > 8 ? createStandardXHR() : /^(get|post|head|put|delete|options)$/i.test(this.type) && createStandardXHR() || createActiveXHR();
  } : createStandardXHR;
  /** @type {number} */
  var rightId = 0;
  var map = {};
  var nativeXHR = jQuery.ajaxSettings.xhr();
  if (win.attachEvent) {
    win.attachEvent("onunload", function() {
      var letter;
      for (letter in map) {
        map[letter](void 0, true);
      }
    });
  }
  /** @type {boolean} */
  support.cors = !!nativeXHR && "withCredentials" in nativeXHR;
  /** @type {boolean} */
  nativeXHR = support.ajax = !!nativeXHR;
  if (nativeXHR) {
    jQuery.ajaxTransport(function(s) {
      if (!s.crossDomain || support.cors) {
        var callback;
        return{
          /**
           * @param {Object} headers
           * @param {Function} complete
           * @return {undefined}
           */
          send : function(headers, complete) {
            var i;
            var xhr = s.xhr();
            /** @type {number} */
            var id = ++rightId;
            if (xhr.open(s.type, s.url, s.async, s.username, s.password), s.xhrFields) {
              for (i in s.xhrFields) {
                xhr[i] = s.xhrFields[i];
              }
            }
            if (s.mimeType) {
              if (xhr.overrideMimeType) {
                xhr.overrideMimeType(s.mimeType);
              }
            }
            if (!s.crossDomain) {
              if (!headers["X-Requested-With"]) {
                /** @type {string} */
                headers["X-Requested-With"] = "XMLHttpRequest";
              }
            }
            for (i in headers) {
              if (void 0 !== headers[i]) {
                xhr.setRequestHeader(i, headers[i] + "");
              }
            }
            xhr.send(s.hasContent && s.data || null);
            /**
             * @param {?} opt_attributes
             * @param {boolean} isAbort
             * @return {undefined}
             */
            callback = function(opt_attributes, isAbort) {
              var e;
              var statusText;
              var responses;
              if (callback && (isAbort || 4 === xhr.readyState)) {
                if (delete map[id], callback = void 0, xhr.onreadystatechange = jQuery.noop, isAbort) {
                  if (4 !== xhr.readyState) {
                    xhr.abort();
                  }
                } else {
                  responses = {};
                  e = xhr.status;
                  if ("string" == typeof xhr.responseText) {
                    /** @type {string} */
                    responses.text = xhr.responseText;
                  }
                  try {
                    statusText = xhr.statusText;
                  } catch (l) {
                    /** @type {string} */
                    statusText = "";
                  }
                  if (e || (!s.isLocal || s.crossDomain)) {
                    if (1223 === e) {
                      /** @type {number} */
                      e = 204;
                    }
                  } else {
                    /** @type {number} */
                    e = responses.text ? 200 : 404;
                  }
                }
              }
              if (responses) {
                complete(e, statusText, responses, xhr.getAllResponseHeaders());
              }
            };
            if (s.async) {
              if (4 === xhr.readyState) {
                win.setTimeout(callback);
              } else {
                /** @type {function (?, boolean): undefined} */
                xhr.onreadystatechange = map[id] = callback;
              }
            } else {
              callback();
            }
          },
          /**
           * @return {undefined}
           */
          abort : function() {
            if (callback) {
              callback(void 0, true);
            }
          }
        };
      }
    });
  }
  jQuery.ajaxPrefilter(function(options) {
    if (options.crossDomain) {
      /** @type {boolean} */
      options.contents.script = false;
    }
  });
  jQuery.ajaxSetup({
    accepts : {
      script : "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
    },
    contents : {
      script : /\b(?:java|ecma)script\b/
    },
    converters : {
      /**
       * @param {?} value
       * @return {?}
       */
      "text script" : function(value) {
        return jQuery.globalEval(value), value;
      }
    }
  });
  jQuery.ajaxPrefilter("script", function(s) {
    if (void 0 === s.cache) {
      /** @type {boolean} */
      s.cache = false;
    }
    if (s.crossDomain) {
      /** @type {string} */
      s.type = "GET";
      /** @type {boolean} */
      s.global = false;
    }
  });
  jQuery.ajaxTransport("script", function(s) {
    if (s.crossDomain) {
      var script;
      var head = doc.head || (jQuery("head")[0] || doc.documentElement);
      return{
        /**
         * @param {?} _
         * @param {Function} callback
         * @return {undefined}
         */
        send : function(_, callback) {
          script = doc.createElement("script");
          /** @type {boolean} */
          script.async = true;
          if (s.scriptCharset) {
            script.charset = s.scriptCharset;
          }
          script.src = s.url;
          /** @type {function (?, boolean): undefined} */
          script.onload = script.onreadystatechange = function(evt, aEvt) {
            if (aEvt || (!script.readyState || /loaded|complete/.test(script.readyState))) {
              /** @type {null} */
              script.onload = script.onreadystatechange = null;
              if (script.parentNode) {
                script.parentNode.removeChild(script);
              }
              /** @type {null} */
              script = null;
              if (!aEvt) {
                callback(200, "success");
              }
            }
          };
          head.insertBefore(script, head.firstChild);
        },
        /**
         * @return {undefined}
         */
        abort : function() {
          if (script) {
            script.onload(void 0, true);
          }
        }
      };
    }
  });
  /** @type {Array} */
  var eventPath = [];
  /** @type {RegExp} */
  var rjsonp = /(=)\?(?=&|$)|\?\?/;
  jQuery.ajaxSetup({
    jsonp : "callback",
    /**
     * @return {?}
     */
    jsonpCallback : function() {
      var unlock = eventPath.pop() || jQuery.expando + "_" + iIdCounter++;
      return this[unlock] = true, unlock;
    }
  });
  jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
    var callbackName;
    var fn2;
    var args;
    /** @type {(boolean|string)} */
    var jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : "string" == typeof s.data && (0 === (s.contentType || "").indexOf("application/x-www-form-urlencoded") && (rjsonp.test(s.data) && "data")));
    return jsonProp || "jsonp" === s.dataTypes[0] ? (callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback, jsonProp ? s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName) : s.jsonp !== false && (s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName), s.converters["script json"] = function() {
      return args || jQuery.error(callbackName + " was not called"), args[0];
    }, s.dataTypes[0] = "json", fn2 = win[callbackName], win[callbackName] = function() {
      /** @type {Arguments} */
      args = arguments;
    }, jqXHR.always(function() {
      if (void 0 === fn2) {
        jQuery(win).removeProp(callbackName);
      } else {
        win[callbackName] = fn2;
      }
      if (s[callbackName]) {
        s.jsonpCallback = originalSettings.jsonpCallback;
        eventPath.push(callbackName);
      }
      if (args) {
        if (jQuery.isFunction(fn2)) {
          fn2(args[0]);
        }
      }
      args = fn2 = void 0;
    }), "script") : void 0;
  });
  support.createHTMLDocument = function() {
    if (!doc.implementation.createHTMLDocument) {
      return false;
    }
    var list = doc.implementation.createHTMLDocument("");
    return list.body.innerHTML = "<form></form><form></form>", 2 === list.body.childNodes.length;
  }();
  /**
   * @param {?} data
   * @param {boolean} context
   * @param {boolean} keepScripts
   * @return {?}
   */
  jQuery.parseHTML = function(data, context, keepScripts) {
    if (!data || "string" != typeof data) {
      return null;
    }
    if ("boolean" == typeof context) {
      /** @type {boolean} */
      keepScripts = context;
      /** @type {boolean} */
      context = false;
    }
    context = context || (support.createHTMLDocument ? doc.implementation.createHTMLDocument("") : doc);
    /** @type {(Array.<string>|null)} */
    var parsed = rsingleTag.exec(data);
    /** @type {(Array|boolean)} */
    var scripts = !keepScripts && [];
    return parsed ? [context.createElement(parsed[1])] : (parsed = parse([data], context, scripts), scripts && (scripts.length && jQuery(scripts).remove()), jQuery.merge([], parsed.childNodes));
  };
  /** @type {function ((Function|string), Object, Object): ?} */
  var matcherFunction = jQuery.fn.load;
  /**
   * @param {(Function|string)} url
   * @param {Object} data
   * @param {Object} callback
   * @return {?}
   */
  jQuery.fn.load = function(url, data, callback) {
    if ("string" != typeof url && matcherFunction) {
      return matcherFunction.apply(this, arguments);
    }
    var selector;
    var method;
    var args;
    var self = this;
    var off = url.indexOf(" ");
    return off > -1 && (selector = jQuery.trim(url.slice(off, url.length)), url = url.slice(0, off)), jQuery.isFunction(data) ? (callback = data, data = void 0) : data && ("object" == typeof data && (method = "POST")), self.length > 0 && jQuery.ajax({
      url : url,
      type : method || "GET",
      dataType : "html",
      data : data
    }).done(function(responseText) {
      /** @type {Arguments} */
      args = arguments;
      self.html(selector ? jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) : responseText);
    }).always(callback && function(obj, value) {
        self.each(function() {
          callback.apply(self, args || [obj.responseText, value, obj]);
        });
      }), this;
  };
  jQuery.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(dataAndEvents, name) {
    /**
     * @param {Function} selector
     * @return {?}
     */
    jQuery.fn[name] = function(selector) {
      return this.on(name, selector);
    };
  });
  /**
   * @param {string} elem
   * @return {?}
   */
  jQuery.expr.filters.animated = function(elem) {
    return jQuery.grep(jQuery.timers, function(fn) {
      return elem === fn.elem;
    }).length;
  };
  jQuery.offset = {
    /**
     * @param {Object} elem
     * @param {Object} value
     * @param {?} i
     * @return {undefined}
     */
    setOffset : function(elem, value, i) {
      var curPosition;
      var curLeft;
      var curCSSTop;
      var curTop;
      var offset;
      var curCSSLeft;
      var u;
      var position = jQuery.css(elem, "position");
      var curElem = jQuery(elem);
      var props = {};
      if ("static" === position) {
        /** @type {string} */
        elem.style.position = "relative";
      }
      offset = curElem.offset();
      curCSSTop = jQuery.css(elem, "top");
      curCSSLeft = jQuery.css(elem, "left");
      /** @type {boolean} */
      u = ("absolute" === position || "fixed" === position) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1;
      if (u) {
        curPosition = curElem.position();
        curTop = curPosition.top;
        curLeft = curPosition.left;
      } else {
        /** @type {number} */
        curTop = parseFloat(curCSSTop) || 0;
        /** @type {number} */
        curLeft = parseFloat(curCSSLeft) || 0;
      }
      if (jQuery.isFunction(value)) {
        value = value.call(elem, i, jQuery.extend({}, offset));
      }
      if (null != value.top) {
        /** @type {number} */
        props.top = value.top - offset.top + curTop;
      }
      if (null != value.left) {
        /** @type {number} */
        props.left = value.left - offset.left + curLeft;
      }
      if ("using" in value) {
        value.using.call(elem, props);
      } else {
        curElem.css(props);
      }
    }
  };
  jQuery.fn.extend({
    /**
     * @param {number} options
     * @return {?}
     */
    offset : function(options) {
      if (arguments.length) {
        return void 0 === options ? this : this.each(function(dataName) {
          jQuery.offset.setOffset(this, options, dataName);
        });
      }
      var doc;
      var win;
      var animation = {
        top : 0,
        left : 0
      };
      var b = this[0];
      var elem = b && b.ownerDocument;
      if (elem) {
        return doc = elem.documentElement, jQuery.contains(doc, b) ? ("undefined" != typeof b.getBoundingClientRect && (animation = b.getBoundingClientRect()), win = getWindow(elem), {
          top : animation.top + (win.pageYOffset || doc.scrollTop) - (doc.clientTop || 0),
          left : animation.left + (win.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
        }) : animation;
      }
    },
    /**
     * @return {?}
     */
    position : function() {
      if (this[0]) {
        var elem;
        var offset;
        var parentOffset = {
          top : 0,
          left : 0
        };
        var offsetParent = this[0];
        return "fixed" === jQuery.css(offsetParent, "position") ? offset = offsetParent.getBoundingClientRect() : (elem = this.offsetParent(), offset = this.offset(), jQuery.nodeName(elem[0], "html") || (parentOffset = elem.offset()), parentOffset.top += jQuery.css(elem[0], "borderTopWidth", true), parentOffset.left += jQuery.css(elem[0], "borderLeftWidth", true)), {
          top : offset.top - parentOffset.top - jQuery.css(offsetParent, "marginTop", true),
          left : offset.left - parentOffset.left - jQuery.css(offsetParent, "marginLeft", true)
        };
      }
    },
    /**
     * @return {?}
     */
    offsetParent : function() {
      return this.map(function() {
        var offsetParent = this.offsetParent;
        for (;offsetParent && (!jQuery.nodeName(offsetParent, "html") && "static" === jQuery.css(offsetParent, "position"));) {
          offsetParent = offsetParent.offsetParent;
        }
        return offsetParent || docElem;
      });
    }
  });
  jQuery.each({
    scrollLeft : "pageXOffset",
    scrollTop : "pageYOffset"
  }, function(name, prop) {
    /** @type {boolean} */
    var top = /Y/.test(prop);
    /**
     * @param {Function} isXML
     * @return {?}
     */
    jQuery.fn[name] = function(isXML) {
      return access(this, function(elem, method, val) {
        var win = getWindow(elem);
        return void 0 === val ? win ? prop in win ? win[prop] : win.document.documentElement[method] : elem[method] : void(win ? win.scrollTo(top ? jQuery(win).scrollLeft() : val, top ? val : jQuery(win).scrollTop()) : elem[method] = val);
      }, name, isXML, arguments.length, null);
    };
  });
  jQuery.each(["top", "left"], function(dataAndEvents, prop) {
    jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition, function(elem, val) {
      return val ? (val = css(elem, prop), rnumnonpx.test(val) ? jQuery(elem).position()[prop] + "px" : val) : void 0;
    });
  });
  jQuery.each({
    Height : "height",
    Width : "width"
  }, function(name, type) {
    jQuery.each({
      padding : "inner" + name,
      content : type,
      "" : "outer" + name
    }, function(defaultExtra, original) {
      /**
       * @param {?} margin
       * @param {boolean} value
       * @return {?}
       */
      jQuery.fn[original] = function(margin, value) {
        var chainable = arguments.length && (defaultExtra || "boolean" != typeof margin);
        var extra = defaultExtra || (margin === true || value === true ? "margin" : "border");
        return access(this, function(qualifier, prop, value) {
          var doc;
          return jQuery.isWindow(qualifier) ? qualifier.document.documentElement["client" + name] : 9 === qualifier.nodeType ? (doc = qualifier.documentElement, Math.max(qualifier.body["scroll" + name], doc["scroll" + name], qualifier.body["offset" + name], doc["offset" + name], doc["client" + name])) : void 0 === value ? jQuery.css(qualifier, prop, extra) : jQuery.style(qualifier, prop, value, extra);
        }, type, chainable ? margin : void 0, chainable, null);
      };
    });
  });
  jQuery.fn.extend({
    /**
     * @param {string} name
     * @param {Function} one
     * @param {Object} fn
     * @return {?}
     */
    bind : function(name, one, fn) {
      return this.on(name, null, one, fn);
    },
    /**
     * @param {Object} types
     * @param {Function} fn
     * @return {?}
     */
    unbind : function(types, fn) {
      return this.off(types, null, fn);
    },
    /**
     * @param {Function} selector
     * @param {string} ev
     * @param {Function} data
     * @param {Object} fn
     * @return {?}
     */
    delegate : function(selector, ev, data, fn) {
      return this.on(ev, selector, data, fn);
    },
    /**
     * @param {string} selector
     * @param {Object} types
     * @param {Function} fn
     * @return {?}
     */
    undelegate : function(selector, types, fn) {
      return 1 === arguments.length ? this.off(selector, "**") : this.off(types, selector || "**", fn);
    }
  });
  /**
   * @return {?}
   */
  jQuery.fn.size = function() {
    return this.length;
  };
  jQuery.fn.andSelf = jQuery.fn.addBack;
  if ("function" == typeof define) {
    if (define.amd) {
      define("jquery", [], function() {
        return jQuery;
      });
    }
  }
  var _jQuery = win.jQuery;
  var _$ = win.$;
  return jQuery.noConflict = function(deep) {
    return win.$ === jQuery && (win.$ = _$), deep && (win.jQuery === jQuery && (win.jQuery = _jQuery)), jQuery;
  }, dataAndEvents || (win.jQuery = win.$ = jQuery), jQuery;
}),
    function() {
  /**
   * @param {Object} layer
   * @param {Object} handler
   * @return {undefined}
   */

  function FastClick(layer, handler) {
    /**
     * @param {Function} fn
     * @param {?} context
     * @return {?}
     */
    function bind(fn, context) {
      return function() {
        return fn.apply(context, arguments);
      };
    }
    var oldOnClick;
    if (handler = handler || {}, this.trackingClick = false, this.trackingClickStart = 0, this.targetElement = null, this.touchStartX = 0, this.touchStartY = 0, this.lastTouchIdentifier = 0, this.touchBoundary = handler.touchBoundary || 10, this.layer = layer, this.tapDelay = handler.tapDelay || 200, this.tapTimeout = handler.tapTimeout || 700, !FastClick.notNeeded(layer)) {
      /** @type {Array} */
      var parts = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"];
      var obj = this;
      /** @type {number} */
      var i = 0;
      /** @type {number} */
      var l = parts.length;
      for (;l > i;i++) {
        obj[parts[i]] = bind(obj[parts[i]], obj);
      }
      if (mousedown) {
        layer.addEventListener("mouseover", this.onMouse, true);
        layer.addEventListener("mousedown", this.onMouse, true);
        layer.addEventListener("mouseup", this.onMouse, true);
      }
      layer.addEventListener("click", this.onClick, true);
      layer.addEventListener("touchstart", this.onTouchStart, false);
      layer.addEventListener("touchmove", this.onTouchMove, false);
      layer.addEventListener("touchend", this.onTouchEnd, false);
      layer.addEventListener("touchcancel", this.onTouchCancel, false);
      if (!Event.prototype.stopImmediatePropagation) {
        /**
         * @param {string} type
         * @param {Function} callback
         * @param {boolean} recurring
         * @return {undefined}
         */
        layer.removeEventListener = function(type, callback, recurring) {
          /** @type {function (this:Node, string, (EventListener|function ((Event|null)): (boolean|undefined)|null), boolean): undefined} */
          var rmv = Node.prototype.removeEventListener;
          if ("click" === type) {
            rmv.call(layer, type, callback.hijacked || callback, recurring);
          } else {
            rmv.call(layer, type, callback, recurring);
          }
        };
        /**
         * @param {string} type
         * @param {Function} callback
         * @param {boolean} recurring
         * @return {undefined}
         */
        layer.addEventListener = function(type, callback, recurring) {
          /** @type {function (this:Node, string, (EventListener|function ((Event|null)): (boolean|undefined)|null), boolean): undefined} */
          var adv = Node.prototype.addEventListener;
          if ("click" === type) {
            adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
                if (!event.propagationStopped) {
                  callback(event);
                }
              }), recurring);
          } else {
            adv.call(layer, type, callback, recurring);
          }
        };
      }
      if ("function" == typeof layer.onclick) {
        /** @type {Function} */
        oldOnClick = layer.onclick;
        layer.addEventListener("click", function(event) {
          oldOnClick(event);
        }, false);
        /** @type {null} */
        layer.onclick = null;
      }
    }
  }
  /** @type {boolean} */
  var t = navigator.userAgent.indexOf("Windows Phone") >= 0;
  /** @type {boolean} */
  var mousedown = navigator.userAgent.indexOf("Android") > 0 && !t;
  /** @type {boolean} */
  var b = /iP(ad|hone|od)/.test(navigator.userAgent) && !t;
  /** @type {boolean} */
  var bup = b && /OS 4_\d(_\d)?/.test(navigator.userAgent);
  /** @type {boolean} */
  var cur = b && /OS [6-7]_\d/.test(navigator.userAgent);
  /** @type {boolean} */
  var a = navigator.userAgent.indexOf("BB10") > 0;
  /**
   * @param {Element} elem
   * @return {?}
   */
  FastClick.prototype.needsClick = function(elem) {
    switch(elem.nodeName.toLowerCase()) {
      case "button":
        ;
      case "select":
        ;
      case "textarea":
        if (elem.disabled) {
          return true;
        }
        break;
      case "input":
        if (b && "file" === elem.type || elem.disabled) {
          return true;
        }
        break;
      case "label":
        ;
      case "iframe":
        ;
      case "video":
        return true;
    }
    return/\bneedsclick\b/.test(elem.className);
  };
  /**
   * @param {Object} target
   * @return {?}
   */
  FastClick.prototype.needsFocus = function(target) {
    switch(target.nodeName.toLowerCase()) {
      case "textarea":
        return true;
      case "select":
        return!mousedown;
      case "input":
        switch(target.type) {
          case "button":
            ;
          case "checkbox":
            ;
          case "file":
            ;
          case "image":
            ;
          case "radio":
            ;
          case "submit":
            return false;
        }
        return!target.disabled && !target.readOnly;
      default:
        return/\bneedsfocus\b/.test(target.className);
    }
  };
  /**
   * @param {Object} targetElement
   * @param {Event} event
   * @return {undefined}
   */
  FastClick.prototype.sendClick = function(targetElement, event) {
    var clickEvent;
    var touch;
    if (document.activeElement) {
      if (document.activeElement !== targetElement) {
        document.activeElement.blur();
      }
    }
    touch = event.changedTouches[0];
    /** @type {(Event|null)} */
    clickEvent = document.createEvent("MouseEvents");
    clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
    /** @type {boolean} */
    clickEvent.forwardedTouchEvent = true;
    targetElement.dispatchEvent(clickEvent);
  };
  /**
   * @param {Node} targetElement
   * @return {?}
   */
  FastClick.prototype.determineEventType = function(targetElement) {
    return mousedown && "select" === targetElement.tagName.toLowerCase() ? "mousedown" : "click";
  };
  /**
   * @param {Function} obj
   * @return {undefined}
   */
  FastClick.prototype.focus = function(obj) {
    var pos;
    if (b && (obj.setSelectionRange && (0 !== obj.type.indexOf("date") && ("time" !== obj.type && "month" !== obj.type)))) {
      pos = obj.value.length;
      obj.setSelectionRange(pos, pos);
    } else {
      obj.focus();
    }
  };
  /**
   * @param {EventTarget} targetElement
   * @return {undefined}
   */
  FastClick.prototype.updateScrollParent = function(targetElement) {
    var scrollParent;
    var parentElement;
    if (scrollParent = targetElement.fastClickScrollParent, !scrollParent || !scrollParent.contains(targetElement)) {
      /** @type {EventTarget} */
      parentElement = targetElement;
      do {
        if (parentElement.scrollHeight > parentElement.offsetHeight) {
          scrollParent = parentElement;
          targetElement.fastClickScrollParent = parentElement;
          break;
        }
        parentElement = parentElement.parentElement;
      } while (parentElement);
    }
    if (scrollParent) {
      scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
    }
  };
  /**
   * @param {Object} eventTarget
   * @return {?}
   */
  FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
    return eventTarget.nodeType === Node.TEXT_NODE ? eventTarget.parentNode : eventTarget;
  };
  /**
   * @param {Event} event
   * @return {?}
   */
  FastClick.prototype.onTouchStart = function(event) {
    var targetElement;
    var touch;
    var selection;
    if (event.targetTouches.length > 1) {
      return true;
    }
    if (targetElement = this.getTargetElementFromEventTarget(event.target), touch = event.targetTouches[0], b) {
      if (selection = window.getSelection(), selection.rangeCount && !selection.isCollapsed) {
        return true;
      }
      if (!bup) {
        if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
          return event.preventDefault(), false;
        }
        this.lastTouchIdentifier = touch.identifier;
        this.updateScrollParent(targetElement);
      }
    }
    return this.trackingClick = true, this.trackingClickStart = event.timeStamp, this.targetElement = targetElement, this.touchStartX = touch.pageX, this.touchStartY = touch.pageY, event.timeStamp - this.lastClickTime < this.tapDelay && event.preventDefault(), true;
  };
  /**
   * @param {Event} event
   * @return {?}
   */
  FastClick.prototype.touchHasMoved = function(event) {
    var touch = event.changedTouches[0];
    var boundary = this.touchBoundary;
    return Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary;
  };
  /**
   * @param {Event} event
   * @return {?}
   */
  FastClick.prototype.onTouchMove = function(event) {
    return this.trackingClick ? ((this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) && (this.trackingClick = false, this.targetElement = null), true) : true;
  };
  /**
   * @param {HTMLLabelElement} labelElement
   * @return {?}
   */
  FastClick.prototype.findControl = function(labelElement) {
    return void 0 !== labelElement.control ? labelElement.control : labelElement.htmlFor ? document.getElementById(labelElement.htmlFor) : labelElement.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea");
  };
  /**
   * @param {Event} event
   * @return {?}
   */
  FastClick.prototype.onTouchEnd = function(event) {
    var forElement;
    var trackingClickStart;
    var C;
    var scrollParent;
    var touch;
    var suiteView = this.targetElement;
    if (!this.trackingClick) {
      return true;
    }
    if (event.timeStamp - this.lastClickTime < this.tapDelay) {
      return this.cancelNextClick = true, true;
    }
    if (event.timeStamp - this.trackingClickStart > this.tapTimeout) {
      return true;
    }
    if (this.cancelNextClick = false, this.lastClickTime = event.timeStamp, trackingClickStart = this.trackingClickStart, this.trackingClick = false, this.trackingClickStart = 0, cur && (touch = event.changedTouches[0], suiteView = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || suiteView, suiteView.fastClickScrollParent = this.targetElement.fastClickScrollParent), C = suiteView.tagName.toLowerCase(), "label" === C) {
      if (forElement = this.findControl(suiteView)) {
        if (this.focus(suiteView), mousedown) {
          return false;
        }
        suiteView = forElement;
      }
    } else {
      if (this.needsFocus(suiteView)) {
        return event.timeStamp - trackingClickStart > 100 || b && (window.top !== window && "input" === C) ? (this.targetElement = null, false) : (this.focus(suiteView), this.sendClick(suiteView, event), b && "select" === C || (this.targetElement = null, event.preventDefault()), false);
      }
    }
    return b && (!bup && (scrollParent = suiteView.fastClickScrollParent, scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop)) ? true : (this.needsClick(suiteView) || (event.preventDefault(), this.sendClick(suiteView, event)), false);
  };
  /**
   * @return {undefined}
   */
  FastClick.prototype.onTouchCancel = function() {
    /** @type {boolean} */
    this.trackingClick = false;
    /** @type {null} */
    this.targetElement = null;
  };
  /**
   * @param {Event} event
   * @return {?}
   */
  FastClick.prototype.onMouse = function(event) {
    return this.targetElement ? event.forwardedTouchEvent ? true : event.cancelable && (!this.needsClick(this.targetElement) || this.cancelNextClick) ? (event.stopImmediatePropagation ? event.stopImmediatePropagation() : event.propagationStopped = true, event.stopPropagation(), event.preventDefault(), false) : true : true;
  };
  /**
   * @param {Event} event
   * @return {?}
   */
  FastClick.prototype.onClick = function(event) {
    var permitted;
    return this.trackingClick ? (this.targetElement = null, this.trackingClick = false, true) : "submit" === event.target.type && 0 === event.detail ? true : (permitted = this.onMouse(event), permitted || (this.targetElement = null), permitted);
  };
  /**
   * @return {undefined}
   */
  FastClick.prototype.destroy = function() {
    var layer = this.layer;
    if (mousedown) {
      layer.removeEventListener("mouseover", this.onMouse, true);
      layer.removeEventListener("mousedown", this.onMouse, true);
      layer.removeEventListener("mouseup", this.onMouse, true);
    }
    layer.removeEventListener("click", this.onClick, true);
    layer.removeEventListener("touchstart", this.onTouchStart, false);
    layer.removeEventListener("touchmove", this.onTouchMove, false);
    layer.removeEventListener("touchend", this.onTouchEnd, false);
    layer.removeEventListener("touchcancel", this.onTouchCancel, false);
  };
  /**
   * @param {Node} layer
   * @return {?}
   */
  FastClick.notNeeded = function(layer) {
    var metaViewport;
    var i;
    var r;
    var o;
    if ("undefined" == typeof window.ontouchstart) {
      return true;
    }
    if (i = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]) {
      if (!mousedown) {
        return true;
      }
      if (metaViewport = document.querySelector("meta[name=viewport]")) {
        if (-1 !== metaViewport.content.indexOf("user-scalable=no")) {
          return true;
        }
        if (i > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
          return true;
        }
      }
    }
    if (a && (r = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/), r[1] >= 10 && (r[2] >= 3 && (metaViewport = document.querySelector("meta[name=viewport]"))))) {
      if (-1 !== metaViewport.content.indexOf("user-scalable=no")) {
        return true;
      }
      if (document.documentElement.scrollWidth <= window.outerWidth) {
        return true;
      }
    }
    return "none" === layer.style.msTouchAction || "manipulation" === layer.style.touchAction ? true : (o = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1], o >= 27 && (metaViewport = document.querySelector("meta[name=viewport]"), metaViewport && (-1 !== metaViewport.content.indexOf("user-scalable=no") || document.documentElement.scrollWidth <= window.outerWidth)) ? true : "none" === layer.style.touchAction || "manipulation" === layer.style.touchAction);
  };
  /**
   * @param {Object} layer
   * @param {Array} handler
   * @return {?}
   */
  FastClick.attach = function(layer, handler) {
    return new FastClick(layer, handler);
  };
  if ("function" == typeof define && ("object" == typeof define.amd && define.amd)) {
    define(function() {
      return FastClick;
    });
  } else {
    if ("undefined" != typeof module && module.exports) {
      /** @type {function (Object, Array): ?} */
      module.exports = FastClick.attach;
      /** @type {function (Object, Object): undefined} */
      module.exports.FastClick = FastClick;
    } else {
      /** @type {function (Object, Object): undefined} */
      window.FastClick = FastClick;
    }
  }
}(), !function(element, proceed) {
  if ("function" == typeof define && (define.amd || define.cmd)) {
    define(function() {
      return proceed(element);
    });
  } else {
    proceed(element, true);
  }
}(this, function(req, dataAndEvents) {
  /**
   * @param {string} value
   * @param {?} opt_attributes
   * @param {Object} model
   * @return {undefined}
   */
  function callback(value, opt_attributes, model) {
    if (req.WeixinJSBridge) {
      WeixinJSBridge.invoke(value, postMessage(opt_attributes), function(resp) {
        success(value, resp, model);
      });
    } else {
      extend(value, model);
    }
  }
  /**
   * @param {string} name
   * @param {Object} opt_attributes
   * @param {Object} options
   * @return {undefined}
   */
  function ajax(name, opt_attributes, options) {
    if (req.WeixinJSBridge) {
      WeixinJSBridge.on(name, function(type) {
        if (options) {
          if (options.trigger) {
            options.trigger(type);
          }
        }
        success(name, type, opt_attributes);
      });
    } else {
      if (options) {
        extend(name, options);
      } else {
        extend(name, opt_attributes);
      }
    }
  }
  /**
   * @param {Object} data
   * @return {?}
   */
  function postMessage(data) {
    return data = data || {}, data.appId = options.appId, data.verifyAppId = options.appId, data.verifySignType = "sha1", data.verifyTimestamp = options.timestamp + "", data.verifyNonceStr = options.nonceStr, data.verifySignature = options.signature, data;
  }
  /**
   * @param {Object} obj
   * @return {?}
   */
  function inspect(obj) {
    return{
      timeStamp : obj.timestamp + "",
      nonceStr : obj.nonceStr,
      "package" : obj["package"],
      paySign : obj.paySign,
      signType : obj.signType || "SHA1"
    };
  }
  /**
   * @param {string} name
   * @param {Function} data
   * @param {Object} result
   * @return {undefined}
   */
  function success(name, data, result) {
    var key;
    var beginBracket;
    var o;
    switch(delete data.err_code, delete data.err_desc, delete data.err_detail, key = data.errMsg, key || (key = data.err_msg, delete data.err_msg, key = next(name, key), data.errMsg = key), result = result || {}, result._complete && (result._complete(data), delete result._complete), key = data.errMsg || "", options.debug && (!result.isInnerInvoke && alert(JSON.stringify(data))), beginBracket = key.indexOf(":"), o = key.substring(beginBracket + 1)) {
      case "ok":
        if (result.success) {
          result.success(data);
        }
        break;
      case "cancel":
        if (result.cancel) {
          result.cancel(data);
        }
        break;
      default:
        if (result.fail) {
          result.fail(data);
        }
        ;
    }
    if (result.complete) {
      result.complete(data);
    }
  }
  /**
   * @param {string} name
   * @param {string} event
   * @return {?}
   */
  function next(name, event) {
    var key;
    var pos;
    /** @type {string} */
    var namespace = name;
    var ns = cache[namespace];
    return ns && (namespace = ns), key = "ok", event && (pos = event.indexOf(":"), key = event.substring(pos + 1), "confirm" == key && (key = "ok"), "failed" == key && (key = "fail"), -1 != key.indexOf("failed_") && (key = key.substring(7)), -1 != key.indexOf("fail_") && (key = key.substring(5)), key = key.replace(/_/g, " "), key = key.toLowerCase(), ("access denied" == key || "no permission to execute" == key) && (key = "permission denied"), "config" == namespace && ("function not exist" == key &&
    (key = "ok")), "" == key && (key = "fail")), event = namespace + ":" + key;
  }
  /**
   * @param {Array} object
   * @return {?}
   */
  function defaults(object) {
    var index;
    var length;
    var id;
    var value;
    if (object) {
      /** @type {number} */
      index = 0;
      length = object.length;
      for (;length > index;++index) {
        id = object[index];
        value = module[id];
        if (value) {
          object[index] = value;
        }
      }
      return object;
    }
  }
  /**
   * @param {string} b
   * @param {string} id
   * @return {undefined}
   */
  function extend(b, id) {
    if (!(!options.debug || id && id.isInnerInvoke)) {
      var c = cache[b];
      if (c) {
        b = c;
      }
      if (id) {
        if (id._complete) {
          delete id._complete;
        }
      }
      console.log('"' + b + '",', id || "");
    }
  }
  /**
   * @return {undefined}
   */
  function compile() {
    if (0 != config.preVerifyState) {
      if (!b) {
        if (!w) {
          if (!options.debug) {
            if (!("6.0.2" > cversion)) {
              if (!(config.systemType < 0)) {
                if (!E) {
                  /** @type {boolean} */
                  E = true;
                  config.appId = options.appId;
                  /** @type {number} */
                  config.initTime = fx.initEndTime - fx.initStartTime;
                  /** @type {number} */
                  config.preVerifyTime = fx.preVerifyEndTime - fx.preVerifyStartTime;
                  context.getNetworkType({
                    isInnerInvoke : true,
                    /**
                     * @param {Function} obj
                     * @return {undefined}
                     */
                    success : function(obj) {
                      var href;
                      var objNext;
                      config.networkType = obj.networkType;
                      /** @type {string} */
                      href = "http://open.weixin.qq.com/sdk/report?v=" + config.version + "&o=" + config.preVerifyState + "&s=" + config.systemType + "&c=" + config.clientVersion + "&a=" + config.appId + "&n=" + config.networkType + "&i=" + config.initTime + "&p=" + config.preVerifyTime + "&u=" + config.url;
                      /** @type {Image} */
                      objNext = new Image;
                      /** @type {string} */
                      objNext.src = href;
                    }
                  });
                }
              }
            }
          }
        }
      }
    }
  }
  /**
   * @return {?}
   */
  function now() {
    return(new Date).getTime();
  }
  /**
   * @param {Function} fn
   * @return {undefined}
   */
  function init(fn) {
    if (T) {
      if (req.WeixinJSBridge) {
        fn();
      } else {
        if (doc.addEventListener) {
          doc.addEventListener("WeixinJSBridgeReady", fn, false);
        }
      }
    }
  }
  /**
   * @return {undefined}
   */
  function setup() {
    if (!context.invoke) {
      /**
       * @param {string} func
       * @param {Object} obj
       * @param {Function} thisArg
       * @return {undefined}
       */
      context.invoke = function(func, obj, thisArg) {
        if (req.WeixinJSBridge) {
          WeixinJSBridge.invoke(func, postMessage(obj), thisArg);
        }
      };
      /**
       * @param {string} name
       * @param {Function} selector
       * @return {undefined}
       */
      context.on = function(name, selector) {
        if (req.WeixinJSBridge) {
          WeixinJSBridge.on(name, selector);
        }
      };
    }
  }
  var module;
  var cache;
  var doc;
  var data;
  var userAgent;
  var ua;
  var b;
  var w;
  var T;
  var length;
  var bulk;
  var cversion;
  var E;
  var N;
  var fx;
  var config;
  var options;
  var self;
  var result;
  var context;
  return req.jWeixin ? void 0 : (module = {
    config : "preVerifyJSAPI",
    onMenuShareTimeline : "menu:share:timeline",
    onMenuShareAppMessage : "menu:share:appmessage",
    onMenuShareQQ : "menu:share:qq",
    onMenuShareWeibo : "menu:share:weiboApp",
    onMenuShareQZone : "menu:share:QZone",
    previewImage : "imagePreview",
    getLocation : "geoLocation",
    openProductSpecificView : "openProductViewWithPid",
    addCard : "batchAddCard",
    openCard : "batchViewCard",
    chooseWXPay : "getBrandWCPayRequest"
  }, cache = function() {
    var i;
    var _hexToByte = {};
    for (i in module) {
      /** @type {string} */
      _hexToByte[module[i]] = i;
    }
    return _hexToByte;
  }(), doc = req.document, data = doc.title, userAgent = navigator.userAgent.toLowerCase(), ua = navigator.platform.toLowerCase(), b = !(!ua.match("mac") && !ua.match("win")), w = -1 != userAgent.indexOf("wxdebugger"), T = -1 != userAgent.indexOf("micromessenger"), length = -1 != userAgent.indexOf("android"), bulk = -1 != userAgent.indexOf("iphone") || -1 != userAgent.indexOf("ipad"), cversion = function() {
    var namespaceMatch = userAgent.match(/micromessenger\/(\d+\.\d+\.\d+)/) || userAgent.match(/micromessenger\/(\d+\.\d+)/);
    return namespaceMatch ? namespaceMatch[1] : "";
  }(), E = false, N = false, fx = {
    initStartTime : now(),
    initEndTime : 0,
    preVerifyStartTime : 0,
    preVerifyEndTime : 0
  }, config = {
    version : 1,
    appId : "",
    initTime : 0,
    preVerifyTime : 0,
    networkType : "",
    preVerifyState : 1,
    systemType : bulk ? 1 : length ? 2 : -1,
    clientVersion : cversion,
    url : encodeURIComponent(location.href)
  }, options = {}, self = {
    _completes : []
  }, result = {
    state : 0,
    data : {}
  }, init(function() {
    fx.initEndTime = now();
  }), context = {
    /**
     * @param {Object} o
     * @return {undefined}
     */
    config : function(o) {
      /** @type {Object} */
      options = o;
      extend("config", o);
      /** @type {boolean} */
      var t = options.check !== false;
      init(function() {
        var _ref5;
        var argIndex;
        var _len2;
        if (t) {
          callback(module.config, {
            verifyJsApiList : defaults(options.jsApiList)
          }, function() {
            /**
             * @param {Object} e
             * @return {undefined}
             */
            self._complete = function(e) {
              fx.preVerifyEndTime = now();
              /** @type {number} */
              result.state = 1;
              /** @type {Object} */
              result.data = e;
            };
            /**
             * @return {undefined}
             */
            self.success = function() {
              /** @type {number} */
              config.preVerifyState = 0;
            };
            /**
             * @param {Function} obj
             * @return {undefined}
             */
            self.fail = function(obj) {
              if (self._fail) {
                self._fail(obj);
              } else {
                /** @type {number} */
                result.state = -1;
              }
            };
            var matched = self._completes;
            return matched.push(function() {
              compile();
            }), self.complete = function() {
              /** @type {number} */
              var name_fragment = 0;
              var cnl = matched.length;
              for (;cnl > name_fragment;++name_fragment) {
                matched[name_fragment]();
              }
              /** @type {Array} */
              self._completes = [];
            }, self;
          }());
          fx.preVerifyStartTime = now();
        } else {
          /** @type {number} */
          result.state = 1;
          _ref5 = self._completes;
          /** @type {number} */
          argIndex = 0;
          _len2 = _ref5.length;
          for (;_len2 > argIndex;++argIndex) {
            _ref5[argIndex]();
          }
          /** @type {Array} */
          self._completes = [];
        }
      });
      if (options.beta) {
        setup();
      }
    },
    /**
     * @param {Object} func
     * @return {undefined}
     */
    ready : function(func) {
      if (0 != result.state) {
        func();
      } else {
        self._completes.push(func);
        if (!T) {
          if (options.debug) {
            func();
          }
        }
      }
    },
    /**
     * @param {Function} obj
     * @return {undefined}
     */
    error : function(obj) {
      if (!("6.0.2" > cversion)) {
        if (!N) {
          /** @type {boolean} */
          N = true;
          if (-1 == result.state) {
            obj(result.data);
          } else {
            /** @type {Function} */
            self._fail = obj;
          }
        }
      }
    },
    /**
     * @param {?} self
     * @return {undefined}
     */
    checkJsApi : function(self) {
      /**
       * @param {Function} second
       * @return {?}
       */
      var merge = function(second) {
        var i;
        var key;
        var set = second.checkResult;
        for (i in set) {
          key = cache[i];
          if (key) {
            set[key] = set[i];
            delete set[i];
          }
        }
        return second;
      };
      callback("checkJsApi", {
        jsApiList : defaults(self.jsApiList)
      }, function() {
        return self._complete = function(o) {
          if (length) {
            var data = o.checkResult;
            if (data) {
              /** @type {*} */
              o.checkResult = JSON.parse(data);
            }
          }
          o = merge(o);
        }, self;
      }());
    },
    /**
     * @param {Object} options
     * @return {undefined}
     */
    onMenuShareTimeline : function(options) {
      ajax(module.onMenuShareTimeline, {
        /**
         * @return {undefined}
         */
        complete : function() {
          callback("shareTimeline", {
            title : options.title || data,
            desc : options.title || data,
            img_url : options.imgUrl || "",
            link : options.link || location.href,
            type : options.type || "link",
            data_url : options.dataUrl || ""
          }, options);
        }
      }, options);
    },
    /**
     * @param {Object} options
     * @return {undefined}
     */
    onMenuShareAppMessage : function(options) {
      ajax(module.onMenuShareAppMessage, {
        /**
         * @return {undefined}
         */
        complete : function() {
          callback("sendAppMessage", {
            title : options.title || data,
            desc : options.desc || "",
            link : options.link || location.href,
            img_url : options.imgUrl || "",
            type : options.type || "link",
            data_url : options.dataUrl || ""
          }, options);
        }
      }, options);
    },
    /**
     * @param {Object} options
     * @return {undefined}
     */
    onMenuShareQQ : function(options) {
      ajax(module.onMenuShareQQ, {
        /**
         * @return {undefined}
         */
        complete : function() {
          callback("shareQQ", {
            title : options.title || data,
            desc : options.desc || "",
            img_url : options.imgUrl || "",
            link : options.link || location.href
          }, options);
        }
      }, options);
    },
    /**
     * @param {Object} options
     * @return {undefined}
     */
    onMenuShareWeibo : function(options) {
      ajax(module.onMenuShareWeibo, {
        /**
         * @return {undefined}
         */
        complete : function() {
          callback("shareWeiboApp", {
            title : options.title || data,
            desc : options.desc || "",
            img_url : options.imgUrl || "",
            link : options.link || location.href
          }, options);
        }
      }, options);
    },
    /**
     * @param {Object} options
     * @return {undefined}
     */
    onMenuShareQZone : function(options) {
      ajax(module.onMenuShareQZone, {
        /**
         * @return {undefined}
         */
        complete : function() {
          callback("shareQZone", {
            title : options.title || data,
            desc : options.desc || "",
            img_url : options.imgUrl || "",
            link : options.link || location.href
          }, options);
        }
      }, options);
    },
    /**
     * @param {Object} collection
     * @return {undefined}
     */
    startRecord : function(collection) {
      callback("startRecord", {}, collection);
    },
    /**
     * @param {Object} collection
     * @return {undefined}
     */
    stopRecord : function(collection) {
      callback("stopRecord", {}, collection);
    },
    /**
     * @param {Object} opt_attributes
     * @return {undefined}
     */
    onVoiceRecordEnd : function(opt_attributes) {
      ajax("onVoiceRecordEnd", opt_attributes);
    },
    /**
     * @param {Object} collection
     * @return {undefined}
     */
    playVoice : function(collection) {
      callback("playVoice", {
        localId : collection.localId
      }, collection);
    },
    /**
     * @param {Object} collection
     * @return {undefined}
     */
    pauseVoice : function(collection) {
      callback("pauseVoice", {
        localId : collection.localId
      }, collection);
    },
    /**
     * @param {Object} collection
     * @return {undefined}
     */
    stopVoice : function(collection) {
      callback("stopVoice", {
        localId : collection.localId
      }, collection);
    },
    /**
     * @param {Object} opt_attributes
     * @return {undefined}
     */
    onVoicePlayEnd : function(opt_attributes) {
      ajax("onVoicePlayEnd", opt_attributes);
    },
    /**
     * @param {Object} collection
     * @return {undefined}
     */
    uploadVoice : function(collection) {
      callback("uploadVoice", {
        localId : collection.localId,
        isShowProgressTips : 0 == collection.isShowProgressTips ? 0 : 1
      }, collection);
    },
    /**
     * @param {Object} collection
     * @return {undefined}
     */
    downloadVoice : function(collection) {
      callback("downloadVoice", {
        serverId : collection.serverId,
        isShowProgressTips : 0 == collection.isShowProgressTips ? 0 : 1
      }, collection);
    },
    /**
     * @param {Object} collection
     * @return {undefined}
     */
    translateVoice : function(collection) {
      callback("translateVoice", {
        localId : collection.localId,
        isShowProgressTips : 0 == collection.isShowProgressTips ? 0 : 1
      }, collection);
    },
    /**
     * @param {Object} item
     * @return {undefined}
     */
    chooseImage : function(item) {
      callback("chooseImage", {
        scene : "1|2",
        count : item.count || 9,
        sizeType : item.sizeType || ["original", "compressed"],
        sourceType : item.sourceType || ["album", "camera"]
      }, function() {
        return item._complete = function(response) {
          if (length) {
            var content = response.localIds;
            if (content) {
              /** @type {*} */
              response.localIds = JSON.parse(content);
            }
          }
        }, item;
      }());
    },
    /**
     * @param {Object} me
     * @return {undefined}
     */
    previewImage : function(me) {
      callback(module.previewImage, {
        current : me.current,
        urls : me.urls
      }, me);
    },
    /**
     * @param {Object} collection
     * @return {undefined}
     */
    uploadImage : function(collection) {
      callback("uploadImage", {
        localId : collection.localId,
        isShowProgressTips : 0 == collection.isShowProgressTips ? 0 : 1
      }, collection);
    },
    /**
     * @param {Object} collection
     * @return {undefined}
     */
    downloadImage : function(collection) {
      callback("downloadImage", {
        serverId : collection.serverId,
        isShowProgressTips : 0 == collection.isShowProgressTips ? 0 : 1
      }, collection);
    },
    /**
     * @param {?} opt_attributes
     * @return {undefined}
     */
    getNetworkType : function(opt_attributes) {
      /**
       * @param {Object} data
       * @return {?}
       */
      var func = function(data) {
        var type;
        var i;
        var k;
        var raw = data.errMsg;
        if (data.errMsg = "getNetworkType:ok", type = data.subtype, delete data.subtype, type) {
          data.networkType = type;
        } else {
          switch(i = raw.indexOf(":"), k = raw.substring(i + 1)) {
            case "wifi":
              ;
            case "edge":
              ;
            case "wwan":
              data.networkType = k;
              break;
            default:
              /** @type {string} */
              data.errMsg = "getNetworkType:fail";
          }
        }
        return data;
      };
      callback("getNetworkType", {}, function() {
        return opt_attributes._complete = function(value) {
          value = func(value);
        }, opt_attributes;
      }());
    },
    /**
     * @param {Object} self
     * @return {undefined}
     */
    openLocation : function(self) {
      callback("openLocation", {
        latitude : self.latitude,
        longitude : self.longitude,
        name : self.name || "",
        address : self.address || "",
        scale : self.scale || 28,
        infoUrl : self.infoUrl || ""
      }, self);
    },
    /**
     * @param {Object} details
     * @return {undefined}
     */
    getLocation : function(details) {
      details = details || {};
      callback(module.getLocation, {
        type : details.type || "wgs84"
      }, function() {
        return details._complete = function(event) {
          delete event.type;
        }, details;
      }());
    },
    /**
     * @param {Object} collection
     * @return {undefined}
     */
    hideOptionMenu : function(collection) {
      callback("hideOptionMenu", {}, collection);
    },
    /**
     * @param {Object} collection
     * @return {undefined}
     */
    showOptionMenu : function(collection) {
      callback("showOptionMenu", {}, collection);
    },
    /**
     * @param {Object} collection
     * @return {undefined}
     */
    closeWindow : function(collection) {
      collection = collection || {};
      callback("closeWindow", {}, collection);
    },
    /**
     * @param {Object} collection
     * @return {undefined}
     */
    hideMenuItems : function(collection) {
      callback("hideMenuItems", {
        menuList : collection.menuList
      }, collection);
    },
    /**
     * @param {Object} collection
     * @return {undefined}
     */
    showMenuItems : function(collection) {
      callback("showMenuItems", {
        menuList : collection.menuList
      }, collection);
    },
    /**
     * @param {Object} collection
     * @return {undefined}
     */
    hideAllNonBaseMenuItem : function(collection) {
      callback("hideAllNonBaseMenuItem", {}, collection);
    },
    /**
     * @param {Object} collection
     * @return {undefined}
     */
    showAllNonBaseMenuItem : function(collection) {
      callback("showAllNonBaseMenuItem", {}, collection);
    },
    /**
     * @param {Object} proto
     * @return {undefined}
     */

    scanQRCode : function(proto) {
      proto = proto || {};
      callback("scanQRCode", {
        needResult : proto.needResult || 0,
        scanType : proto.scanType || ["qrCode", "barCode"]
      }, function() {
        return proto._complete = function(response) {
          var content;
          var options;
          if (bulk) {
            content = response.resultStr;
            if (content) {
              /** @type {*} */
              options = JSON.parse(content);
              /** @type {*} */
              response.resultStr = options && (options.scan_code && options.scan_code.scan_result);
            }
          }
        }, proto;
      }());
    },
    /**
     * @param {Object} collection
     * @return {undefined}
     */
    openProductSpecificView : function(collection) {
      callback(module.openProductSpecificView, {
        pid : collection.productId,
        view_type : collection.viewType || 0,
        ext_info : collection.extInfo
      }, collection);
    },
    /**
     * @param {?} item
     * @return {undefined}
     */
    addCard : function(item) {
      var position;
      var _len;
      var result;
      var vvar;
      var children = item.cardList;
      /** @type {Array} */
      var assigns = [];
      /** @type {number} */
      position = 0;
      _len = children.length;
      for (;_len > position;++position) {
        result = children[position];
        vvar = {
          card_id : result.cardId,
          card_ext : result.cardExt
        };
        assigns.push(vvar);
      }
      callback(module.addCard, {
        card_list : assigns
      }, function() {
        return item._complete = function(response) {
          var i;
          var l;
          var result;
          var headers = response.card_list;
          if (headers) {
            /** @type {*} */
            headers = JSON.parse(headers);
            /** @type {number} */
            i = 0;
            l = headers.length;
            for (;l > i;++i) {
              result = headers[i];
              result.cardId = result.card_id;
              result.cardExt = result.card_ext;
              /** @type {boolean} */
              result.isSuccess = !!result.is_succ;
              delete result.card_id;
              delete result.card_ext;
              delete result.is_succ;
            }
            /** @type {*} */
            response.cardList = headers;
            delete response.card_list;
          }
        }, item;
      }());
    },
    /**
     * @param {?} data
     * @return {undefined}
     */

    chooseCard : function(data) {
      callback("chooseCard", {
        app_id : options.appId,
        location_id : data.shopId || "",
        sign_type : data.signType || "SHA1",
        card_id : data.cardId || "",
        card_type : data.cardType || "",
        card_sign : data.cardSign,
        time_stamp : data.timestamp + "",
        nonce_str : data.nonceStr
      }, function() {
        return data._complete = function(response) {
          response.cardList = response.choose_card_info;
          delete response.choose_card_info;
        }, data;
      }());
    },
    /**
     * @param {Object} collection
     * @return {undefined}
     */

    openCard : function(collection) {
      var p;
      var i;
      var item;
      var vvar;
      var items = collection.cardList;
      /** @type {Array} */
      var assigns = [];
      /** @type {number} */
      p = 0;
      i = items.length;
      for (;i > p;++p) {
        item = items[p];
        vvar = {
          card_id : item.cardId,
          code : item.code
        };
        assigns.push(vvar);
      }
      callback(module.openCard, {
        card_list : assigns
      }, collection);
    },
    /**
     * @param {Object} arg
     * @return {undefined}
     */

    chooseWXPay : function(arg) {
      callback(module.chooseWXPay, inspect(arg), arg);
    }
  }, dataAndEvents && (req.wx = req.jWeixin = context), context);
}), function() {
  $(document).on("ready page:load", function() {
    return $(".container.home .qrcode").click(function() {
      return $(this).fadeOut(500).removeClass("active");
    }), $(".container.home .wechat-icon").click(function() {
      return $(".wechat-qrcode").hasClass("active") ? $(".wechat-qrcode").fadeOut(500).removeClass("active") : $(".wechat-qrcode").fadeIn(500).addClass("active"), false;
    }), $(".container.home .download a").click(function() {
      return isWechatBrowser ? window.location.href = "/install" : ($(window).width() >= 640 ? $(".ios-qrcode").hasClass("active") ? $(".ios-qrcode").fadeOut(500).removeClass("active") : $(".ios-qrcode").fadeIn(500).addClass("active") : window.location.href = downloadAppURL, false);
    }), $(".container.home").length && (isWechatBrowser && $.ajax("/wechat/sign", {
      method : "GET",
      data : {
        url : location.href
      },
      /**
       * @param {Function} obj
       * @return {?}
       */

      success : function(obj) {
        return wx.config(obj), wx.ready(function() {
          return wx.onMenuShareAppMessage({
            title : $(".wechat-share #title").text(),
            imgUrl : $(".wechat-share #imgUrl").text(),
            desc : $(".wechat-share #desc").text()
          });
        }), wx.error(function() {
        });
      }
    })), $(".container.install").length && !isWechatBrowser ? window.location.href = downloadAppURL : void 0;
  });
}.call(this), function() {
  /**
   * @return {?}
   */
  this.showContainer = function() {
    return "none" !== $(".loader-container").css("display") ? ($(".loader-container").hide(), $(".container.share").css("visibility", "visible").hide().fadeIn("slow")) : void 0;
  };
  $(window).load(function() {
    return showContainer();
  });
  setTimeout(function() {
    return showContainer();
  }, 5E3);
  $(document).on("ready page:load", function() {
    var n;
    var result;
    return $(".container.share .main .tabbars .tabbar").click(function() {
      var template;
      return $(this).hasClass("active") || ($(".tabbar").removeClass("active"), $(this).addClass("active"), template = $(this).data("content"), $(".tabcontent").hide(), $(template).fadeIn(500)), false;
    }), $(".container.share .main").on("click", ".info", function() {
      var j;
      return j = $(this).find("i"), j.hasClass("fa-angle-down") ? (j.removeClass("fa-angle-down").addClass("fa-angle-up"), $(".info .desc").removeClass("hide")) : (j.removeClass("fa-angle-up").addClass("fa-angle-down"), $(".info .desc").addClass("hide"));
    }), $(".container.share .main .video").on("click", ".cover", function() {
      var v1videos;
      return $(".cover").hide(), $(".player").show(), $("#player").get(0).play(), v1videos = $("#id").text().trim();
      //   $.ajax(changeAPIURL + "/v1/videos/" + v1videos + "/play.json?from=web",
      //     {
      //   method : "POST"
      // })
      // 这里是上传播放信息？？

    }), $(".container.share .main .download a").click(function() {
      return isWechatBrowser || isWeiboBrowser ? window.location.href = "/install" : window.location.href = downloadAppURL;
    }), $(".container.share").length && (result = $(".main > .video").width(), n = result >= 640 ? 360 : 0.5625 * result, $(".main > .video").css({
      height : n
    }), isWechatBrowser) ? $.ajax("/wechat/sign", {
      method : "GET",
      data : {
        url : location.href
      },
      /**
       * @param {Function} obj
       * @return {?}
       */
      success : function(obj) {
        return wx.config(obj), wx.ready(function() {
          var v1videos;
          return v1videos = $("#id").text().trim(), wx.onMenuShareAppMessage({
            title : $(".wechat-share #title").text().trim(),
            imgUrl : $(".wechat-share #imgUrl").text().trim(),
            desc : $(".wechat-share #desc").text().trim(),
            /**
             * @return {?}
             */
            success : function() {
              // 分享成功后的提交？
              return $.ajax(changeAPIURL + "/v1/videos/" + v1videos + "/share.json?from=web", {
                method : "POST"
              });
            }
          }), wx.onMenuShareTimeline({
            title : $(".wechat-share #title").text().trim(),
            imgUrl : $(".wechat-share #imgUrl").text().trim(),
            desc : $(".wechat-share #desc").text().trim(),
            /**
             * @return {?}
             */
            success : function() {
              return $.ajax(changeAPIURL + "/v1/videos/" + v1videos + "/share.json", {
                method : "POST"
              });
            }
          });
        }), wx.error(function() {
        });
      }
    }) : void 0;
  });
}.call(this), function() {
  $(function() {
    return FastClick.attach(document.body);
  });
  /** @type {string} */
  // ios下载地址？
  this.downloadAppURL = "https://itunes.apple.com/cn/app/change-jian-shen-chao-liu/id1081061856?l=en&mt=8";
  this.isWechatBrowser = function() {
    return navigator.userAgent.toLowerCase().match(/micromessenger/);
  }();
  this.isWeiboBrowser = function() {
    return navigator.userAgent.toLowerCase().match(/weibo/);
  }();
  this.isIOSDevice = function() {
    return navigator.userAgent.toLowerCase().match(/(iphone|ipod|ipad)/);
  }();
  this.isAndroidDevice = function() {
    return navigator.userAgent.toLowerCase().match(/android/);
  }();
}.call(this);

