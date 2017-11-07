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

// MODULE: Pattern mediator -> sub\pub for statement store via module components ***bbz
var mediator = (function() {
    var subscribe = function(channel, fn) {
            if (!mediator.channels[channel]) {
                mediator.channels[channel] = [];
            }
            mediator.channels[channel].push({
                context: this,
                callback: fn
            });
            return this;
        },
        publish = function(channel) {
            if (!mediator.channels[channel]) return false;
            var args = Array.prototype.slice.call(arguments, 1);
            for (var i = 0, l = mediator.channels[channel].length; i < l; i++) {
                var subscription = mediator.channels[channel][i];
                subscription.callback.apply(subscription.context, args);
            }
            return this;
        };

    return {
        channels: {},
        publish: publish,
        subscribe: subscribe,
        installTo: function(obj) {
            obj.subscribe = subscribe;
            obj.publish = publish;
        }
    };

})();


var BS_BT_DentalGrid = Class(BS_BT_Widget, {

    constructor: function(options) {
        this.className = "BSDentalGrid";
        BS_BT_DentalGrid.$super.call(this, options);

        console.log(options)
    },
    moduleConfig: {
        language: 'ru',
        themeUI: 'material', // 'ios', 'bootstrap-standart'
        viewType: 'web-page' // 'web-view', 'iframe', 'desktop windows' - влияет на layoutGrid  
            /* Добавить настройки отображения и свойство functionalScaling: full, custom , lite (ограничивает кол-во компонентов в зщависимости от версии или требований) */
    },
    components: {
        layoutGrid: function() {
            var template = $('<div class="row">\
            <div class="col-md-12 col-lg-9 col-sm-12 tooth-grid">\
                <h4 class="badge badge-pill light-blue lighten-2"><img class="head-logo " src="Content/Images/white-tooth-icon.png"> Зубная карта пациента</h4>\
            </div>\
            <div class="col-lg-3 col-md-12 col-sm-12">\
                <div class="focus-tooth">\
                <div class="badge badge-pill light-blue lighten-2">Фокус на зуб:</div>\
                </div>\
                <div class="action-list">\
                    <div class="badge badge-pill light-blue lighten-2">Действия:\
                </div>\
            </div>\
            </div>\
        </div>\
            <hr class="divider"/>\
            <div class="row">\
                <div class="col-md-12 col-sm-12 anamnesis">Анамнез:\
                </div>\
            </div>');
           /*  <div class="dental-card col-md-12 col-sm-12">\
                <h4>Назначенные процедуры:</h4>\
            </div>'); */

            return template;

        },
        toothGrid: function() {
            var template = $('<div class="card">\
                            <div class="card-header light-blue lighten-1">\
                                <h3 data-full-name></h3>\
                            </div>\
                            <div class="card-body">\
                            <div class="row">\
                                <div class="color-section reverse col-xs-12 col-sm-12 col-md-12 col-lg-6" data-part-value="1">\
                                </div>\
                                <div class="color-section col-xs-12 col-sm-12 col-md-12 col-lg-6" data-part-value="2">\
                                </div>\
                                <div class="color-section reverse col-xs-12 col-sm-12 col-md-12 col-lg-6" data-part-value="4">\
                                </div>\
                                <div class="color-section col-xs-12 col-sm-12 col-md-12 col-lg-6" data-part-value="3">\
                                </div>\
                            </div>\
                            </div>\
                        </div>');
            return template;
        },
        toothGridItem: function(index, containerNumber) {
            var toggleState = function (element, stateOne, stateTwo){
                var $el = $(element);
                $(element).data('active-state', $(element).data('active-state') === stateOne ? stateTwo : stateOne);
                $(element).attr('data-active-state', $(element).data('active-state'));
                mediator.publish('changeState', index , element )
            };
        
            var lineTemplate = $('<div class="tooth-line"></div>');
            for (let i = 1; i < 9; i++) {
                posValue = containerNumber.toLocaleString() + i.toLocaleString();
                $(lineTemplate).append('\
                    <div class="tooth-double-item" \
                        data-position="' + posValue + '\
                        data-active-state="inactive" \
                    ">\
                        <img src="/Content/Images/side-tooth.png"></img>\
                        <img src="/Content/Images/above-tooth.png"></img>\
                        <span class="position-text badge badge-pill lighten-3 blue text-center">' + posValue + '</span>\
                    </div>');
            }
            let counter = 1;
            mediator.installTo(lineTemplate);
            lineTemplate.subscribe('toothDataRecieved', function(data) {
                data = JSON.parse(data);
                var _getPos = function(elem) { return $(elem).data('position'); }
                    
                $('.tooth-double-item', lineTemplate).each(function(index, elem) {
                    posIndex = _getPos($(this));
                    if (typeof data['costumer']['tooth_map'][posIndex] == 'undefined') return;
                    $(this).data('model', data['costumer']['tooth_map'][posIndex]);
                    
                  
                });
            });
            return lineTemplate;
        },
        
        focusTooth: function() {
            var template = $('<div class="card">\
                                <div class="card-block p-5">\
                                  <h4 class="card-title">Focus tooth</h4>\
                                  <h6 class="card-subtitle mb-2 text-muted"></h6>\
                                  <p class="card-content">Nothing selected</p>\
                                </div>\
                              </div>\
                                </div>\
                            </div>');
            return template;
        },
        actionList: function() {
            var template = $('<div class="card"><ul class="list-group"></ul></div>');

            function getActionList(template) {
                $.ajax({
                    type: "get",
                    url: "api/getProcedures/",
                    data: JSON.stringify({ btid: this.id, docId: this.docid }),
                    contentType: 'application/json',
                    dataType: "json",
                    success: function(response) {
                        $.each(response, function(index, value) {
                            template.find('.list-group').append('<li class="list-group-item justify-content-between">\
                            <div class="form-group">\
                                <input type="checkbox" class=""/> <b>' + index + ':</b> ' + value + '\
                            </div></li>');
                        });
                    }
                });
            }
            getActionList(template);
            $(template).append('<button class="btn btn-sm btn-primary invisible">Применить</button>');
            return template;
        },
      /*   dentalCard: function(){
           
            var template = $('<div class="toothDataTable"></div>');
            //var data = JSON.stringify({ btid: this.id, docId: this.docid });
            var getLayout = function(template){
                $.ajax({
                    type: "get",
                    url: "api/componentlayout/",
                    data: JSON.stringify({ btid: this.id, docId: this.docid }),
                    contentType: 'application/json',
                    dataType: "html",
                    success: function(response) {
                        debugger;
                        $(template).append(data);
                    },
            }); 
            getLayout(template);
            return template;
        }
    }, */
        anamnesis: function() {
            var template = $('<div class="card sh4 p-4" data-dental-card><span class="heading"></span><div class="user-inform custom-controls-stacked" data-user-inform></div><div class="item-table"></div></div>');
            var $heading = $('<h4 class="card-title"><strong>Медицинская карта стоматологического больного</h4>');
            var $userInfoCardBlockTemplate = $('<ul class="list-inline d-flex flex-wrap flex-column">\
                <li class="list-inline-item" data-prop="fullname"><b>ФИО: </b><span></span></li>\
                <li class="list-inline-item" data-prop="gender"><b>Пол: </b><span></span></li>\
                <li class="list-inline-item" data-prop="birthday"><b>Дата рождения: </b><span></span></li>\
                <li class="list-inline-item" data-prop="phone"><b>Телефон: </b><span></span></li>\
                <li class="list-inline-item" data-prop="mail"><b>E-mail: </b><span></span></li>\
            </ul>');

            var $itemsList = $('<ul class="list-group d-flex" data-dental-card></ul>');
          
            $('.heading',template).html($heading);
            $(template).append
            mediator.installTo(template);
            template.subscribe('toothDataRecieved', function(data) {
                data = JSON.parse(data);
                var _getPos = function(elem) { return $(elem).data('position'); }
                
                $.each(data["costumer"], function(key, value) {      
                
                    if($userInfoCardBlockTemplate.find('[data-prop="'+key+'"] span').length !== 0){
                        $userInfoCardBlockTemplate.find('[data-prop="'+key+'"] span').html(value);
                    }else{
                        $itemsList.append('<li class="list-group-item" data-list-group-item="'+key+'"><b>' + key + '</b>: ' + value + '</li>');
                    }
                    
                });
                
                template.find('.user-inform').html($userInfoCardBlockTemplate)
                template.find('.item-table').html($itemsList);
                
            });
            
            return template;
        }

    },
    toothItemObserver: function($control) {
        /* active components */
        var toothMap = {};
        var $focusToothContainer = $('.focus-tooth .card-content', $control);
        var $toothItemsCollection = $('.tooth-double-item', $control);
        var $fullNameElem = $('[data-full-name]', $control);
        var $dentalCard = $('[data-dental-card]', $control);
        /* Все подписчики сюда: */
        mediator.installTo(toothMap);
        toothMap.subscribe('toothDataRecieved', function(data) {
            this.actualData = JSON.parse(data)['costumer'];
            
        });
        mediator.installTo($focusToothContainer);
        $focusToothContainer.subscribe('stateChange', function(arguments) {
            var dataMap = $('[data-position="' + arguments[0].position + '"]').data();
            $(this).html('<ul class="list-group"></ul>');
            for (let prop in dataMap) {
                $(this).append('<li class="list-group-item list-group-item-success">\
                                    '+prop + ' = ' + dataMap[prop]+'\
                                     </li>');
            }

        });
            
        mediator.installTo($toothItemsCollection);
        $toothItemsCollection.on('click', function(e) {
            var $elem = $(e.currentTarget);
            if(typeof $elem.data('active-state') == 'undefined'){
                $elem.attr('data-active-state', 'active');
                $elem.data('active-state', 'active');
            }
            var model = $elem.data('model');
            var position = $elem.data('position')
            $toothItemsCollection.publish('stateChange', $elem, position, model);
            
        });
        $toothItemsCollection.subscribe('stateChange', function(position, model){
           var $el = $(this);
             if(typeof $(this).data('activeState') == 'undefined') {
                       $(this).data('activeState', 'active');
                   }else{
                    $(this).toggleState(this, 'active', 'inactive');
                   }
        })
    
//         mediator.installTo($dentalCard);

//         $dentalCard.subscribe('toothDataRecieved', function(data) {
//             this.actualData = JSON.parse(data)[0];
//             debugger;
//         });
//         $dentalCard.subscribe('stateChange', function(data){
//             debugger;
//         })

        $.when($.ajax('../api/getToothMap/'))
            .then(function(data, textStatus, jqXHR) {
                toothMap.publish('toothDataRecieved', data);
                var dataObj = JSON.parse(data)
                if (typeof $fullNameElem.text(dataObj['costumer']['fullname']) !== 'undefined') {
                    $fullNameElem.text(dataObj['costumer']['fullname']);
                };
            });
        _getToothMap = function() {
            $.ajax('api/getToothMap/');
        }
        _getToothMap();
        /* change active state of tooth observer */
        mediator.installTo($toothItemsCollection);
        $toothItemsCollection.subscribe('toothDataRecieved', function(data) {
            var thisPosition = $(this).data('position');
        });

    },
    _init: function() {
        var that = this;
        this.render();
        this.toothItemObserver(this.$control);
        // _getToothMap();
        return this;
    },
    formattedValue: {
        get: function() {
            return this.value.join(',');
        }
    },
    value: {
        get: function() {
            return this._value;
        },
        set: function(val) {
            this._value = val;
        }
    },
    render: function() {
        var that = this;
        this.$control.append(this.components.layoutGrid)
            .find('.tooth-grid').append(this.components.toothGrid());
        this.$control.find('.color-section').each(function(ind, elem) {
            let containerNumber = ind + 1;
            $(elem).append(that.components.toothGridItem(ind, containerNumber));
        });
        //this.$control.find('.dental-card').append(this.components.dentalCard());
        this.$control.find('.focus-tooth').append(this.components.focusTooth());
        this.$control.find('.action-list').append(this.components.actionList());
        this.$control.find('.anamnesis').append(this.components.anamnesis());

    }

});