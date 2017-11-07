$.fn.select2.defaults.set('language', 'ru');
$.fn.select2.defaults.set('debug', true);
$.ui.autocomplete.escapeRegex = function (t) {
    t = t || "";
    tmap = BS_BT_Utils.translitMap(t);
    return tmap[0].replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&") + "|" + tmap[1].replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
};

Number.prototype.AddZero = function (b, c) {
    var l = (String(b || 10).length - String(this).length) + 1;
    return l > 0 ? new Array(l).join(c || '0') + this : this;
};
var BsDocControls = [];

var BS_BT_Utils = Class({
    $singleton: true,
    $const: {
        UTFREGEXP: /\\u([\d\w]{4})/gi
    },
    utfDecode: function (str) {
        return str.replace(this.UTFREGEXP, function (match, grp) { return String.fromCharCode(parseInt(grp, 16)); });
    },
    stripHtml: function (str) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = str;
        return tmp.textContent || tmp.innerText || "";
    },
    translitMap: function (str) {
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

            return s.replace(/./g, function (sub) {
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
    constructor: function (options) {
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
    link: function (linkId) {
        this.linked = true;
        this.linkid = linkId;
        return this;
    },
    text: {
        get: function () {
            return this._value;
        },
        set: function () {
            return false;
        }
    },
    formattedValue: {
        get: function () {
            return this.value;
        },
        set: function () {
            return false;
        }
    },
    value: {
        get: function () {
            this._value = (typeof this.$input == 'undefined') ? '' : this.$input.val();
            return this._value;
        },
        set: function (val) {
            if (typeof this.$input != 'undefined') this.$input.val(val);
            this._value = val;
        }
    },
    beforeInit: function () {
        //console.log('beforeInit >> '+this.ClassName);
    },
    afterInit: function () {
        //console.log('afterInit >> '+this.ClassName);
    },
    _init: function () { },
    init: function () {
        this.beforeInit.apply(this, arguments);
        this._init.apply(this, arguments);
        this.afterInit.apply(this, arguments);
        return this;
    }

});

var BS_BT_DentalGrid = Class(BS_BT_Widget, {
    constructor: function (options) {
        this.className = "BSDentalGrid";
        BS_BT_DentalGrid.$super.call(this, options);
        //Приватная переменная хранящая путь до сервера, предоставляющего информацию для модуля
        this.dataUrl = 'api/getToothMap';
        console.log(options);
    },

    components: {
        layoutGrid: function () {
            var template = $('<div class="row">\
                <div class="col-md-12 col-lg-9 col-sm-12 ">\
                    <div class="tooth-grid"></div>\
                    <hr class="divider"/>\
                    <div class="col-md-12 col-sm-12 anamnesis">\
                    </div>\
                </div>\
                <div class="col-lg-3 col-md-12 col-sm-12">\
                    <div class="action-list">\
                    <div class="badge badge-pill light-blue lighten-2">Действия:\
                    </div>\
                    </div>\
                    <div class="focus-tooth">\
                    <div class="badge badge-pill light-blue lighten-2">Фокус на зуб:</div>\
                    </div>\
                </div>\
            </div>');

            return template;
        },
        toothGrid: function () {
            var template = $('<div class="card">\
                                <div class="card-header light-blue lighten-1">\
                                     <span class="badge badge-pill light-blue lighten-2">\
                        <img class="head-logo" src="Content/Images/white-tooth-icon.png" style="width:20px;"> Зубная карта пациента</span>\
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
        toothGridItem: function (index, containerNumber, dentalData) {


            var lineTemplate = $('<div class="tooth-line"></div>');
            for (let i = 1; i < 9; i++) {
                posValue = containerNumber.toLocaleString() + i.toLocaleString();
                $(lineTemplate).append('\
                        <div class="tooth-double-item" \
                            data-position="' + posValue + '"\
                            data-active-state="inactive" >\
                            <img src="Content/svg/tooth.svg"></img>\
                            <span class="position-text badge badge-pill lighten-3 blue text-center">' + posValue + '</span>\
                        </div>');
                    }   
            let counter = 1;
            return lineTemplate;
        },

        focusTooth: function () {
            var template = $('<div class="card">\
                                    <div class="card-block p-2">\
                                      <h4 class="card-title"></h4>\
                                      <h6 class="card-subtitle mb-2 text-muted"></h6>\
                                      <p class="card-content">Ничего не выбрано</p>\
                                    </div>\
                                  </div>\
                                    </div>\
                                </div>');
            return template;
        },
        actionList: function () {
            var template = $('<div class="action-list"></div>')
            var $stateChangeBtnsTemplate = $('<div class="state-change-btns">\
            <h6>Изменить статус:</h6>\
            <div class="d-flex flex-column" data-toggle="buttons">\
            <button class="btn btn btn-outline-light-green" data-state="heal" data-legendAbbr="З" data-color="light-green">Здоров</button>\
            <button class="btn btn btn-outline-dark-green" data-state="healed" data-legendAbbr="В" data-color="dark-green">Вылечен</button>\
            <button class="btn btn btn-outline-blue-grey" data-state="removed" data-legendAbbr="У" data-color="light-grey" >Удален</button>\
            <button class="btn btn-outline-red" data-state="disease" data-legendAbbr="ТЛ" data-color="red"> Требует лечения</button>\
            <button class="btn btn-outline-light-blue" data-state="implant" data-legendAbbr="И" data-color="light-blue">Имплант</button>\
          </div>');
            
            $stateChangeBtnsTemplate.append('<button class="btn btn-sm btn-primary invisible">Применить</button>');/* Временно скрыта */

            var $treatTypesListTemplate = $('<div class="treat-types-list">\
                                                <div class="card">\
                                                    <div class="card-block p-2">\
                                                    <h4 class="card-title badge badge-pill light-blue lighten-2">\
                                                        <i class="bbz-i i_dentist"></i> Виды лечения</h4>\
                                                    </div>\
                                                    <ul class="treat-items list-group card-content">Ни один элемент не выбран</ul>\
                                                </div>');

            $(template)
                .append($stateChangeBtnsTemplate)
                .append($treatTypesListTemplate);
          return template;
        },
        anamnesis: function (data) {
            var template = $('<div class="card sh4 p-4" data-dental-card><span class="heading"></span>\
            <div class="user-inform custom-controls-stacked" data-user-inform></div>\
            <div class="item-table"></div>\
            </div>');
            $tableGrid = $('<div class="row"></div>')
            var $heading = $('<h4 class="card-title"><strong>Медицинская карта стоматологического больного</h4>');
            var $userInfoCardBlockTemplate = $('<ul class="list-inline d-flex flex-wrap flex-column">\
                    <li class="list-inline-item" data-prop="fullname"><b>ФИО: </b><span></span></li>\
                    <li class="list-inline-item" data-prop="gender"><b>Пол: </b><span></span></li>\
                    <li class="list-inline-item" data-prop="birthday"><b>Дата рождения: </b><span></span></li>\
                    <li class="list-inline-item" data-prop="phone"><b>Телефон: </b><span></span></li>\
                    <li class="list-inline-item" data-prop="mail"><b>E-mail: </b><span></span></li>\
                </ul>');
            var $legendTemplate = $('<div class="dental-legend-container">\
                                        <h4>Легенда:</h4>\
                                            <div class="row">\
                                                <div class="col-md-12 d-flex flex-row">\
                                                <p class="dental-legend-item" >\
                                                    <span data-state="heal" data-legendabbr="З" data-color="light-green">З</span> - Здоров</p>\
                                                <p class="dental-legend-item" >\
                                                    <span data-state="healed" data-legendabbr="В" data-color="dark-green">В</span> - Вылечен</p>\
                                                <p class="dental-legend-item" >\
                                                    <span data-state="removed" data-legendabbr="У" data-color="light-grey">У</span> - Удален</p>\
                                                <p class="dental-legend-item" >\
                                                    <span data-state="disease" data-legendabbr="ТЛ" data-color="red">ТЛ</span> - Требует лечения</p>\
                                                <p class="dental-legend-item">\
                                                    <span data-state="implant" data-legendabbr="И" data-color="light-blue">И</span> - Имплант</p>\
                                                </div>\
                                            </div>\
                                        </div>');

            var $dentalTable = $('<table></table>').addClass('dental-card-table table table-striped table-bordered table-hover table-responsive');
            $dentalTable.data('table-data', data);
            var $thead = $('<thead class="table-inverse"></thead>');

            var $tbody = $('<tbody></tbody>')

            $tr = $('<tr>')
            var tRow = '<tr>';


            for (var i = 8; i > 0; i--) {
                var cell = '<td data-row-pos="' + i + '">' + i + '</td>';
                tRow += cell;
            }
            for (var i = 1; i <= 8; i++) {
                var cell = '<td data-row-pos="' + i + '">' + i + '</td>';
                tRow += cell;
            }

            tRow += '</tr>';
            $thead.append(tRow);

            for (var index = 0; index < 1; index++) {
                //var tr = '<tr data-position-group='+(index+1)+'>';
                var tr = '<tr>'
                for (var i = 8; i > 0; i--) {
                    var cell = '<td data-group="' + (index + 1) + '" data-pos="' + i + '"><span class="abbr-text">' + i + '</span></td>';
                    tr += (cell);
                }
                for (var i = 1; i <= 8; i++) {
                    var cell = '<td data-group=' + (index + 1) * 2 + ' data-pos="' + i + '"><span class="abbr-text">' + i + '</span></td>';
                    tr += (cell);
                }
                tr += '</tr>';
                $tbody.append(tr);
            }
            for (var index = 3; index < 4; index++) {
                //var tr = '<tr data-position-group='+(index+1)+'>';
                var tr = '<tr>'
                for (var i = 8; i > 0; i--) {
                    var cell = '<td data-group="' + (index) + '" data-pos="' + i + '"><span class="abbr-text">' + i + '</span></td>';
                    tr += (cell);
                }
                for (var i = 1; i <= 8; i++) {
                    var cell = '<td data-group=' + (index + 1) + ' data-pos="' + i + '"><span class="abbr-text">' + i + '</span></td>';
                    tr += (cell);
                }
                tr += '</tr>';
                $tbody.append(tr);
            }
            $dentalTable.append($thead);
            $dentalTable.append($tbody);
            $tableLegend = $('<div></div>').addClass('card').append($legendTemplate);

            var $itemsList = $('<ul class="list-group d-flex" data-dental-card></ul>');
            $('.heading', template).html($heading);
            $(template).append
            //mediator.installTo(template);
            //         //template.subscribe('toothDataRecieved', function(data) {
            //     data = JSON.parse(data);

            //var data = that.dentalData;
            var _getPos = function (elem) { return $(elem).data('position'); }

            template.find('.user-inform').html($userInfoCardBlockTemplate)
            template.find('.item-table').html($itemsList);
            template.append($tableGrid)
            template.append($dentalTable);
            template.append($tableLegend);

            return template;
        }

    },
    getData: function (url) {
        var $this = this;
        var data = 'Нет данных';
        $.ajax({
            type: "get",
            url: url,
            data: JSON.stringify({ "btid": this.id, "docId": this.docId }),
            contentType: 'application/json',
            dataType: "json",
            success: function (response) {
                $this.dentalData = response;
                $this.$control.trigger('initialUpdatedData', response);
            }
        });
        return data;
    },
    _init: function () {
        // Получим data с сервера
        this.getData(this.dataUrl);
        this.render(this.components, this.dentalData);
        //И привяжем DOM события к нужным элементам модуля
        this.event();
        return this;
    },

    render: function (components, dentalData) {
        var that = this;
        this.$control.append(this.components.layoutGrid)
            .find('.tooth-grid').append(this.components.toothGrid());
        this.$control.find('.color-section')
            .each(function (ind, elem) {
                let containerNumber = ind + 1;
                $(elem).append(that.components.toothGridItem(ind, containerNumber, dentalData));
            });
        this.$control.find('.focus-tooth').append(this.components.focusTooth());
        this.$control.find('.action-list').append(this.components.actionList());
        this.$control.find('.anamnesis').append(this.components.anamnesis(dentalData));

    },

    event: function () {
        var that = this;
        //Toothgrid actions
        var deactivate = function (elements) {
            $(elements).data('active-state', 'inactive');
            $(elements).attr('data-active-state', 'inactive');
        };
        /* State - ui а не состояние модели */
        var toggleState = function (element) {
            $(element).data('active-state', ($(element).data('active-state') == 'active' ? 'inactive' : 'active'));
            $(element).attr('data-active-state', ($(element).attr('data-active-state') == 'active' ? 'inactive' : 'active'));
        };

        this.$control.find('.tooth-grid').on('click', '.tooth-double-item', function (e) {
            var $item = $(e.currentTarget);
            var data = $(this).data();
            deactivate('.tooth-double-item');
            toggleState($item);
            //global
            $(that.$control).trigger('changeActiveTooth', { data });

        });

        this.$control.find('.state-change-btns button').on('click', function (e, args) {
            //var state = $(e.currentTarget).data('activity-state');

            deactivate('.state-change-btns button');
            toggleState(e.currentTarget);
            var itemPosition = $(e.currentTarget).data('position');

            data = $(e.currentTarget).data();
            delete data['activeState'];
            if (typeof data['position'] == 'undefined') {
                alert('Сначала выберите что хотите изменить');
                deactivate('.state-change-btns button');
            } else {
                $(that.$control).trigger('changeToothState', { data });
            }

        });

        $(this.$control).on('changeToothState', function (e, args) {
            var itemPosition = args.data.position;
            var $updatingItems = $('[data-position="' + itemPosition + '"]', this.$control).not('button');
            for (var prop in args.data) {
                if (args.data['bs.button']) {
                    delete args.data['bs.button'];
                } else if (args.data[prop]) {
                    that.dentalData.customer.tooth_map[itemPosition][prop] = data[prop];
                    $updatingItems.data(prop, args.data[prop]);
                    $updatingItems.attr('data-' + prop, args.data[prop]);
                    if (prop == 'legendabbr') {
                        $updatingItems.find('.abbr-text').text(args.data[prop]);
                    }
                };
            }
        });

        $(this.$control).on('updateContent', function (e, args) {
            var $activityBtns = $('.state-change-btns button', this.$control);
            if (args.data.hasOwnProperty('position')) {
                $activityBtns.data('position', args.data['position']);
                $activityBtns.attr('data-position', args.data['position']);
            }
        });

        this.$control.on('initialUpdatedData', function (e, args) {
            $.each(args["customer"], function (key, value) {
                if (key == 'fullname') {
                    that.$control.find('[data-prop="fullname"]').text(value)
                };
                if ($('.anamnesis', this.$control).find('[data-prop="' + key + '"] span').length !== 0) {
                    $('.anamnesis', this.$control).find('[data-prop="' + key + '"] span').html(value);
                }
            });
        });

        this.$control.on('initialUpdatedData', function (e, args) {
            var dataMap = args.customer.tooth_map;
            var $updateCollection = $('.tooth-double-item', this.$control);
            $updateCollection.each(function (index, element) {
                var position = $(this).data('position');
                for (var prop in dataMap[position]) {
                    if (dataMap[position].hasOwnProperty(prop)) {
                        $(element).data(prop, dataMap[position][prop]);
                        $(element).attr('data-' + prop, dataMap[position][prop]);
                    };
                }
            });
        });

        this.$control.on('initialUpdatedData', function (e, args) {
            var dataMap = args.customer.tooth_map;
            var $dentalTableCells = $('.dental-card-table [data-pos]', this.$control);
            $dentalTableCells.each(function (index, element) {
                var position = $(this).data('pos');
                var group = $(this).data('group');
                var pos = group + '' + position;
                for (var prop in dataMap[pos]) {
                    if (dataMap[pos].hasOwnProperty(prop)) {
                        $(element).data(prop, dataMap[pos][prop]);
                        $(element).attr('data-' + prop, dataMap[pos][prop]);
                    };
                }
                var legendAbbr = $(element).data('legendAbbr');
                var stateColor = $(element).data('color');
                $(element).find('.abbr-text').text(legendAbbr);
            });

        });
        $(this.$control).on('changeActiveTooth',
            {
                oldStateData: $(this).data()
            }, function (e, args) {
                $(this).data('old-state', args);
                $('.focus-tooth .card-content', this).trigger('updateContent', args);
                $('.state-change-btns').trigger('updateContent', args);
            });

        $('.state-change-btns', this.$control).on('updateContent',
            function (e, args) {
                var $toggledButton = $('.state-change-btns button[data-state="' + args.data.state + '"]', this.$control);
                deactivate($(this).find('button'));
                toggleState($toggledButton)
            })
        $('.focus-tooth .card-content', this.$control).on('updateContent',
            function (e, args) {
                var stateContent = $('<ul></ul>');
                stateContent.append('<li class="preview-with-controls">\
                    <img class="focus-panel-left-img" src="/Content/Images/above-tooth.png">\
                    <img class="focus-panel-right-img" src="/Content/Images/side-tooth.png">\
                    <span class ="overlay-marker uk-transform-center">\
                    <img data-marker-position="top" src ="/Content/svg/marker.svg" />\
                    <img data-marker-position="center" src ="/Content/svg/marker.svg" />\
                    <img data-marker-position="right" src ="/Content/svg/marker.svg" />\
                    <img data-marker-position="left" src ="/Content/svg/marker.svg" />\
                    <img data-marker-position="bottom" src ="/Content/svg/marker.svg" />\
                    </span></li > ');
                for (var key in args.data) {
                    if (args.data.hasOwnProperty(key)) {
                        $(stateContent).append('<li><b>' + key + '</b>: ' + args.data[key] + '</li>');
                    } else {
                        $(stateContent).html('Ничего не выбрано');
                    }
                }
                $(this).html(stateContent);
            });

    }
});