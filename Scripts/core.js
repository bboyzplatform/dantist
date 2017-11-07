$.fn.select2.defaults.set('language', 'ru');
$.fn.select2.defaults.set('debug', true);
$.ui.autocomplete.escapeRegex = function(t) {
    t = t || "";
    tmap = BS_BT_Utils.translitMap(t);
    return tmap[0].replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&") + "|" + tmap[1].replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
};

Number.prototype.AddZero = function(b, c) {
    var l = (String(b || 10).length - String(this).length) + 1;
    return l > 0 ? new Array(l).join(c || '0') + this : this;
};
var BsDocControls = [];

var BS_BT_Utils = Class({
    $singleton: true,
    $const: {
        UTFREGEXP: /\\u([\d\w]{4})/gi
    },
    utfDecode: function(str) {
        return str.replace(this.UTFREGEXP, function(match, grp) { return String.fromCharCode(parseInt(grp, 16)); });
    },
    stripHtml: function(str) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = str;
        return tmp.textContent || tmp.innerText || "";
    },
    translitMap: function(str) {
        var result = [];
        var map = [
            [
                "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "z", "x", "c", "v", "b", "n", "m", ",", ".", "<", ">", ":", '"', "{", "}", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "б", "ю", "ж", "э", "х", "ъ"
            ],
            [
                "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "б", "ю", "ж", "э", "х", "ъ", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "z", "x", "c", "v", "b", "n", "m", ",", ".", "<", ">", ":", '"', "{", "}"
            ]
        ];

        function mapCyr(s, map, dir) {
            dir = dir || 0;
            var sdir = (dir === 0) ? 1 : 0;

            return s.replace(/./g, function(sub) {
                var index = map[dir].indexOf(sub.toLowerCase());
                if (index >= 0)
                    return map[sdir][index];
                else
                    return sub;
            });
        }
        result.push(str);
        result.push(mapCyr(str, map, 0));
        return result;
    }
});

var BS_BT_Widget = Class({
    constructor: function(options) {
        this.$input = $('<INPUT>');
        this.state = 'ready';
        this.id = options.btid;
        this.options = options;
        this.docid = options.id;
        this.controlSelector = 'bsbt' + this.id + '_container_' + BsDocControls.length;
        this.className = this.className || '';
        this.className += ' btContainer BSWidget';
        document.write('<div id="' + this.controlSelector + '" class="' + this.className + '"></div>');
        this.$control = $('#' + this.controlSelector);
        this.$control.attr('style', (options.style || ""));
        this._value = options.value;
        this.ClassName = 'BaseBSWidgetClass';
    },
    link: function(linkId) {
        this.linked = true;
        this.linkid = linkId;
        return this;
    },
    text: {
        get: function() {
            return this._value;
        },
        set: function() {
            return false;
        }
    },
    formattedValue: {
        get: function() {
            return this.value;
        },
        set: function() {
            return false;
        }
    },
    value: {
        get: function() {
            this._value = (typeof this.$input == 'undefined') ? '' : this.$input.val();
            return this._value;
        },
        set: function(val) {
            if (typeof this.$input != 'undefined') this.$input.val(val);
            this._value = val;
        }
    },
    beforeInit: function() {
        //console.log('beforeInit >> '+this.ClassName);
    },
    afterInit: function() {
        //console.log('afterInit >> '+this.ClassName);
    },
    _init: function() {},
    init: function() {
        this.beforeInit.apply(this, arguments);
        this._init.apply(this, arguments);
        this.afterInit.apply(this, arguments);
        return this;
    }

});