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
        this.proceduresUrl = 'api/getProcedures';
        
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
                    <hr class="divider"/>\
                    <div class="col-12 history-list"></div>\
                </div>\
                <div class="col-lg-3 col-md-12 col-sm-12">\
                    <div class="action-list">\
                    </div>\
                    <div class="focus-tooth">\
                    </div>\
                </div>\
                <hr>\
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
                            data-active-state="inactive">\
                            <svg id="circle" height="70px" width="40px" \
                            xmlns="http://www.w3.org/2000/svg"  \
                            xmlns: xlink="http://www.w3.org/1999/xlink">\
                                    <image x="-15" y="0" height="70" width="60" xlink: href="Content/svg/oldtooths/t-' + posValue + '.svg" />\
                            </svg>\
                            <span class="position-text badge badge-pill lighten-3 blue text-center">' + posValue + "</span>\
                        </div>");

                         /*  <img src="Content/svg/t-'+posValue+'.svg"></img>\ <img src="Content/svg/oldtooths/t-' + posValue + '.svg"></img>\
                            <span class="position-text badge badge-pill lighten-3 blue text-center">' + posValue + "</span>\ 
                            */
                    }   
            return lineTemplate;
        },
        focusTooth: function () {
            var template = $('<div class="card">\
                                    <div class="card-block p-2">\
                                    <div class="badge badge-pill light-blue lighten-2">Фокус на зуб:</div>\
                                      <h4 class="card-title"></h4>\
                                      <h6 class="card-subtitle mb-2 text-muted"></h6>\
                                      <p class="card-content">Ничего не выбрано</p>\
                                    </div>\
                                  </div>\
                                    </div>\
                                </div>');
            return template;
        },
        actionList: function (proceduresData) {
            var template = $('<div></div>');
            var $stateChangeBtnsTemplate = $('<div class="state-change-btns card">\
                                                <div class="card-block"><h4 class="card-title badge badge-pill light-blue lighten-2">\
                                                    <i class="bbz-i i_repair"></i> Состояние:\
                                                </div>\
                                                <div class="d-flex flex-column" data-toggle="buttons">\
                                                    <button class="btn btn btn-outline-light-green" data-state="heal" data-legendAbbr="З" data-color="light-green">Здоров</button>\
                                                    <button class="btn btn btn-outline-dark-green" data-state="healed" data-legendAbbr="В" data-color="dark-green">Вылечен</button>\
                                                    <button class="btn btn btn-outline-blue-grey" data-state="removed" data-legendAbbr="У" data-color="light-grey" >Удален</button>\
                                                    <button class="btn btn-outline-red" data-state="disease" data-legendAbbr="ТЛ" data-color="red"> Требует лечения</button>\
                                                    <button class="btn btn-outline-light-blue" data-state="implant" data-legendAbbr="И" data-color="light-blue">Имплант</button>\
                                                </div>');
            
           /*  $stateChangeBtnsTemplate.append('<button class="btn btn-sm btn-primary invisible">Применить</button>'); Временно скрыта */

            var $treatTypesListTemplate = $('<div class="treat-types-list">\
                                                <div class="card">\
                                                    <div class="card-block p-2">\
                                                    <h4 class="card-title badge badge-pill light-blue lighten-2">\
                                                        <i class="bbz-i i_dentist"></i> Виды лечения</h4>\
                                                    </div>\
                                                    <div class="treat-items list-group card-content"><span class="text-center pb-2">Ни один элемент не выбран</span></div>\
                                                </div>\
                                                <button type="submit" class="btn btn-outline-info col-md-12 mt-2"> Добавить</button>');
            $(template)
                .append($stateChangeBtnsTemplate)
                .append($treatTypesListTemplate);
          return template;
        },
        anamnesis: function (data) {
            var template = $('<div class="card sh4 p-4" data-dental-card><span class="heading"></span>\
                    <div class="user-inform custom-controls-stacked invisible" data-user-inform></div>\
                    <div class="item-table"></div>\
                </div>');
            $tableGrid = $('<div class="row"></div>');
             
            var $heading = $('<h4 class="card-title"><strong>Медицинская карта стоматологического больного</h4>');
            /*  var $heading = $('<h4 class="card-title invisible"><strong>Медицинская карта стоматологического больного</h4>');
            var $userInfoCardBlockTemplate = $('<ul class="list-inline d-flex flex-wrap flex-column">\
                    <li class="list-inline-item" data-prop="fullname"><b>ФИО: </b><span></span></li>\
                    <li class="list-inline-item" data-prop="gender"><b>Пол: </b><span></span></li>\
                    <li class="list-inline-item" data-prop="birthday"><b>Дата рождения: </b><span></span></li>\
                    <li class="list-inline-item" data-prop="phone"><b>Телефон: </b><span></span></li>\
                    <li class="list-inline-item" data-prop="mail"><b>E-mail: </b><span></span></li>\
                 </ul>');*/
                var $legendTemplate = $('<div class="dental-legend-container">\
                <h4>Легенда:</h4>\
                    <div class="row">\
                        <div class="col-md-12 d-flex flex-row">\
                        <p class="dental-legend-item" >\
                            <span data-state="heal" data-legendabbr="З" data-color="white">З</span> - Здоров</p>\
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
                //var $thead = $('<thead"></thead>'); //Шапка таблицы находиться в середине таблицы
                var $tbody = $('<tbody></tbody>');
                //$tr = $('<tr>');
                var tRow = '<tr class="inline-body-divider">';

                for (var index = 0; index < 1; index++) {
                //var tr = '<tr data-position-group='+(index+1)+'>';
                var tr = "<tr>";
                    for (var i = 8; i > 0; i--) {
                        var cell = '<td data-group="' + (index + 1) + '" data-pos="' + i + '"><span class="abbr-text">' + i + "</span></td>";
                        tr += cell;
                    }
                    for (var i = 1; i <= 8; i++) {
                        var cell = "<td data-group=" + (index + 1) * 2 + ' data-pos="' + i + '"><span class="abbr-text">' + i + "</span></td>";
                        tr += cell;
                    }
                    tr += "</tr>";
                    $tbody.append(tr);
                }
                
                /* Шапку таблицы вставляем в середину таблицы */
                for (var i = 8; i > 0; i--) {
                    var cell = '<td data-row-pos="' + i + '">' + i + "</td>";
                    tRow += cell;
                }

                for (var i = 1; i <= 8; i++) {
                    var cell = '<td data-row-pos="' + i + '">' + i + "</td>";
                    tRow += cell;
                }

                tRow += "</tr>";
                $tbody.append(tRow);
                //$thead.append(tRow);

                /* 3 и 4 ряды зубов */
                for (var index = 4; index > 3; index--) {
                    var tr = "<tr>";
                    for (var i = 8; i > 0; i--) {
                        var cell = '<td data-group="' + index + '" data-pos="' + i + '"><span class="abbr-text">' + i + "</span></td>";
                        tr += cell;
                    }
                    for (var i = 1; i <= 8; i++) {
                        var cell = "<td data-group=" + (index-1) + ' data-pos="' + i + '"><span class="abbr-text">' + i + "</span></td>";
                        tr += cell;
                    }
                    tr += "</tr>";
                    $tbody.append(tr);
                }

                //$dentalTable.append($thead);
                $dentalTable.append($tbody);
                $tableLegend = $("<div></div>")
                .addClass("card")
                .append($legendTemplate);

                var $itemsList = $('<ul class="list-group d-flex" data-dental-card></ul>');
                $(".heading", template).html($heading);

                var _getPos = function(elem) {
                return $(elem).data("position");
                };

                //template.find(".user-inform").html($userInfoCardBlockTemplate);
                
                template
                .find(".item-table")
                .html($itemsList);
                template.append($tableGrid);
                template.append($dentalTable);
                template.append($tableLegend);

                return template;
            },
        historyList: function(widget){
            var template = $('<div class="card"></div>');
            var $navPanel = $('<nav class="nav nav-tabs mb-3 nav-fill" role="tablist">\
                <a class="nav-item nav-link active main-hist-link" data-toggle="tab" href="#'+widget.id+'-main-hist-tab" role="tab">Процесс Лечения:</a>\
                <a class="nav-item nav-link focus-hist-link" data-toggle="tab" href="#'+widget.id+'-focus-hist-tab" role="tab">История изменений</a>\
                </nav>');
            var $histTabsPanel = $('<div class="tab-content" id="'+widget.id+'-hist-tabs"></div>');
            var $mainHistTab = $('<div class="main-hist-tab tab-pane fade show active" id="' + widget.id +'-main-hist-tab">\
                                    <h4 class= "card-title text-center"> Зуб №</h4 >\
                                    <div class="card-body">\
                                        <div class="card-text content">Зуб не выбран...</div>\
                                    </div>\
                                     <button type="button" class="btn btn-outline-primary hidden" data-toggle="modal" data-target="#'+ widget.$modal[0].id +'" data-call-type="new-comment">Новый комментарий</button>\
                                </div>');
           
            var $focusHistTab = $('<div class="focus-hist-tab tab-pane fade" id="' + widget.id +'-focus-hist-tab" data-tab>\
                <h4 class= "card-title text-center"> Зуб №</h4 >\
                <div class="card-body">\
                    <div class="card-text content">Не выбран зуб...</div>\
                </div>\
                 <button type="button" class="btn btn-outline-primary hidden" data-toggle="modal" data-target="#'+ widget.$modal[0].id +'" data-call-type="new-comment">Добавить комментарий</button>\
            </div>');
            $histTabsPanel.append($mainHistTab).append($focusHistTab);                          
            $(template).append($navPanel).append($histTabsPanel);
            
            return template;
        },

        modalCont : function (widget, btId) {
            var modalContent = function () {
                var previewMarkup = '<h6>Just a modal</h6>\
                        <span><b>Дата</b>: </span>\
                        <span><b>Процедура</b>: Удаление зуба</span>\
                        <span><b>Комментарии</b>: Удаление прошло успешно, осложнений нет</span>';

                return previewMarkup;
            }
            var stateMarkups = {
                'new-comment': function(){
                    return '<div class="form-row">\
                                <div class="form-group col-md-6" >\
                                <label for="inputEmail4">Email</label>\
                                <input type="email" class="form-control" id="inputEmail4" placeholder="Email">\
                            </div>\
                            <div class="form-group col-md-6">\
                                <label for="inputPassword4">Password</label>\
                                <input type="password" class="form-control" id="inputPassword4" placeholder="Password">\
                            </div>\
                        </div>';
                }
            };
            var modal = document.getElementById(btId + '-dental-modal') || $('<div id="' + btId + '-preview-modal" class="modal fade preview-modal" role="dialog">' +
                '<div class="modal-dialog modal-lg">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<h4 class="modal-title">Новая запись:</h4>' +
                '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                '<span aria-hidden="true">×</span>' +
                '</button>' +
                '</div>' +
                '<div class="modal-body">' +
                modalContent() +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>').appendTo('body');
            
                widget.$modal = $(modal);
            
        }

    },

    getToothData: function (url) {
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
    getProcedures: function(proceduresUrl){
        var $this = this;
        var data = 'Нет данных';
        $.ajax({
            type: "get",
            url: proceduresUrl,
            data: JSON.stringify({ "btid": this.id, "docId": this.docId }),
            contentType: 'application/json',
            dataType: "json",
            success: function (response) {
                $this.proceduresData = response;
                $this.$control.trigger('initialUpdatedProceduresData', response);
            }
        });
        return data;
    },

    _init: function () {
        // Получим data с сервера
        this.getToothData(this.dataUrl);
        this.getProcedures(this.proceduresUrl);
        this.render(this.components, this.dentalData, this.proceduresData);
        //И привяжем DOM события к нужным элементам модуля
        this.event();
        return this;
    },

    render: function (components, dentalData, proceduresData) {
        var that = this;
        this.$control.append(this.components.layoutGrid)
            .find('.tooth-grid').append(this.components.toothGrid());
        this.$control.find('.color-section')
            .each(function (ind, elem) {
                let containerNumber = $(elem).data('partValue');
                $(elem).append(that.components.toothGridItem(ind, containerNumber, dentalData));
            });
        //this.$control.find('.focus-tooth').append(this.components.focusTooth());
        this.components.modalCont(this, this.options.btid);//this = widget
        this.$control.find('.action-list').append(this.components.actionList(proceduresData));
        this.$control.find('.anamnesis').append(this.components.anamnesis(dentalData));
        this.$control.find('.history-list').append(this.components.historyList(this));
        //this.$control.find('.focus-tooth').append(this.components.focusTooth())    
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
        this.$modal.on('show.bs.modal', function (e) {
            let data = $(event.currentTarget).data();
           
            var button = $(event.target) // Button that triggered the modal
            var callType = button.data('call-type') // Extract info from data-* attributes
                // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
                // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
            var modal = $(this);
               
            modalCall(e, callType, button, data);
            })

        
        var modalCall = function (e, callType, fromElement, data){
            console.log('showed');
            switch (callType) {
                case 'new-comment':
                    $(e.currentTarget).find('.modal-title').text('Новый комментарий');
                    console.log(that);
                    var $newCommentMarkup = $('<div class="form-controls">\
                                                    <label for="dateTimeComment"> Дата: </label>\
                                                    <input type="datetime" id="dateTimeComment" />\
                                                    <div class= "col-auto" >\
                                                    <label class="sr-only" for="commentTextArea">Комментарий:</label>\
                                                        <div class="comments">\
                                                            <div class="add-comment-wrap">\
                                                                <textarea class="form-control comment-text" rows="4" placeholder="Новый комментарий"></textarea>\
                                                                <br>\
                                                                <button class="btn btn-success add-comment">Добавить</button>\
                                                            </div>\
                                                        </div>\
                                                    </div>\
                                                </div>');
                    $(e.currentTarget).find('.modal-body').html($newCommentMarkup);
                    break;
                
                default:
                    break;
            }
        }
        
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
            if (args !=='null' && args.data.hasOwnProperty('position')) {
                $activityBtns.data('position', args.data['position']);
                $activityBtns.attr('data-position', args.data['position']);
            }
        });

        //МедКарта -> заполняется данными профиля 
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

        this.$control.on('initialUpdatedProceduresData', function(e, args){
            var procedures = args;
            console.table(procedures);
            var $itemsList = $('<ul class="list-group"></ul>');
            for (var key in procedures) {
                if (procedures.hasOwnProperty(key)) {
                    $itemsList.append('<li>\
                        <form class="form-inline">\
                            <div class="form-group">\
                                <input type="checkbox" id="checkbox'+key+'">\
                                <label for="checkbox'+key+'">'+key+'\
                                    &nbsp;<i class="bbz-i i_'+ procedures[key]["icon-name"]+'"></i>\
                                </label>\
                            </div>\
                        </form>\
                    </li>');
                } else {
                    $itemsList.html('<ul class="list-group"><li>Ничего не выбрано...</li></ul>');
                }
            }
            $('.treat-types-list .card-content', this).html($itemsList)
        })

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
                $('.state-change-btns', this).trigger('updateContent', args);
                $('.history-list .card-text', this).trigger('updateContent', args);
            });

        $('.state-change-btns', this.$control).on('updateContent',
            function (e, args) {
                var $toggledButton = $('.state-change-btns button[data-state="' + args.data.state + '"]', this.$control);
                deactivate($(this).find('button'));
                toggleState($toggledButton)
        });


        $('.focus-tooth .card-content', this.$control).on('updateContent',
            function (e, args) {
                var stateContent = $('<ul></ul>');
                stateContent.append('<li class="preview-with-controls">\
                    <img class="focus-panel-left-img" src="/Content/svg/app-icon-grid.png">\
                    <img class="focus-panel-right-img" src="/Content/Images/side-tooth.png">\
                    <span class ="overlay-marker uk-transform-center">\
                    <img data-marker-position="top" src ="/Content/svg/marker.svg" />\
                    <img data-marker-position="center" src ="/Content/svg/marker.svg" />\
                    <img data-marker-position="right" src ="/Content/svg/marker.svg" />\
                    <img data-marker-position="left" src ="/Content/svg/marker.svg" />\
                    <img data-marker-position="bottom" src ="/Content/svg/marker.svg" />\
                    </span></li>');
                var canalList = $('<div class="alert alert-info"></div>');
                $('[overlay-marker]', stateContent).each(function (index, element) {
                    // element == this
                    dependedPanelList = $('<div data-position="'+$(element).data('position')+'">'+[index]+'Info block</div>').appendTo(canalList);
                });
                stateContent.append(canalList);

                stateContent.on('click', function(e){
                    toggleState(e.target);
                    let currentPosition = $(e.target).data('position')|| 'null';
                    //Сменить стейт canalList ..-> пробросить data-props
                });

               /* data atributes output */
                
                
                for (var key in args.data) {
                    if (args.data.hasOwnProperty(key)) {
                        $(stateContent).append('<li><b>' + key + '</b>: ' + args.data[key] + '</li>');
                    } else {
                        $(stateContent).html('Ничего не выбрано');
                    }
                }
                $(this).html(stateContent);
            });

        $('.history-list', this.$control).on('updateContent',
            function (e, args) {
                var $mainHistTab = $('.main-hist-tab', this);
                var $focusHistTab = $('.focus-hist-tab', this);
            
                if(!args.data || args.data.serviceHistory === 'null'){

                    $('.content', $mainHistTab).html('<span class="text-center">Нет записей</span>');
                }else{
                var historyData = args.data.serviceHistory;
                var $histList = $('<ul class="list-group"></ul>');
                for (var key in historyData) { 
                    var $itemContainer = $('<li data-toggle="list"><h6>Запись №'+key+'</h6></li>') 
                    for (var prop in historyData[key]) {
                         /* console.log(prop); */
                         $itemContainer.append('<span><b>' + prop + '</b>: ' + historyData[key][prop]+'</span>') 
                    } 
                    $itemContainer.addClass('d-flex flex-column list-group-item list-group-item-action align-items-start');
                    var $changeBtns = $('<div class="btn-group redact-btns" role="group">\
                    <button type="button" class="btn btn-info" data-edit-btn><i class="fa fa-pencil-square-o" /></i> Изменить </button>\
                    <button type = "button" class = "btn btn-danger" data-remove-btn><i class="fa fa-remove"/></i> Удалить</button > \
                    </div>');
                    $itemContainer.append($changeBtns);
                    $histList.append($itemContainer);
                }
                    $focusHistTab.children('.card-title').text('Зуб №'+args.data.position);
                    $focusHistTab.find('.content').html($histList);
                    $mainHistTab.find('.focus-hist-link').removeClass('disabled').toggle('active');
                }
            }
        );

    }
});
function BSConfirm(options, callback) {
    callback = callback || function () { };
    var deferredObject = $.Deferred();
    var defaults = {
        type: "confirm", //alert, prompt,confirm 
        modalSize: 'modal-sm', //modal-sm, modal-lg
        okButtonText: 'Ok',
        cancelButtonText: 'Отмена',
        yesButtonText: 'Да',
        noButtonText: 'Нет',
        headerText: 'Внимание',
        messageText: 'Действительно удалить?',
        alertType: 'default', //default, primary, success, info, warning, danger
    }
    $.extend(defaults, options);

    var _show = function () {
        var headClass = "navbar-default";
        switch (defaults.alertType) {
            case "primary":
                headClass = "alert-primary";
                break;
            case "success":
                headClass = "alert-success";
                break;
            case "info":
                headClass = "alert-info";
                break;
            case "warning":
                headClass = "alert-warning";
                break;
            case "danger":
                headClass = "alert-danger";
                break;
        }
        $('BODY').append(
            '<div id="ezAlerts" class="modal fade">' +
            '<div class="modal-dialog" class="' + defaults.modalSize + '">' +
            '<div class="modal-content">' +
            '<div id="ezAlerts-header" class="modal-header ' + headClass + '">' +
            '<button id="close-button" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>' +
            '<h4 id="ezAlerts-title" class="modal-title">Modal title</h4>' +
            '</div>' +
            '<div id="ezAlerts-body" class="modal-body">' +
            '<div id="ezAlerts-message" ></div>' +
            '</div>' +
            '<div id="ezAlerts-footer" class="modal-footer">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>'
        );

        $('.modal-header').css({
            'padding': '15px 15px',
            '-webkit-border-top-left-radius': '5px',
            '-webkit-border-top-right-radius': '5px',
            '-moz-border-radius-topleft': '5px',
            '-moz-border-radius-topright': '5px',
            'border-top-left-radius': '5px',
            'border-top-right-radius': '5px'
        });

        $('#ezAlerts-title').text(defaults.headerText);
        $('#ezAlerts-message').html(defaults.messageText);

        var keyb = "false", backd = "static";
        var calbackParam = "";
        switch (defaults.type) {
            case 'alert':
                keyb = "true";
                backd = "true";
                $('#ezAlerts-footer').html('<button class="btn btn-' + defaults.alertType + '">' + defaults.okButtonText + '</button>').on('click', ".btn", function () {
                    calbackParam = true;
                    $('#ezAlerts').modal('hide');
                });
                break;
            case 'confirm':
                var btnhtml = '<button id="ezok-btn" class="btn btn-primary">' + defaults.yesButtonText + '</button>';
                if (defaults.noButtonText && defaults.noButtonText.length > 0) {
                    btnhtml += '<button id="ezclose-btn" class="btn btn-default">' + defaults.noButtonText + '</button>';
                }
                $('#ezAlerts-footer').html(btnhtml).on('click', 'button', function (e) {
                    if (e.target.id === 'ezok-btn') {
                        calbackParam = true;
                        $('#ezAlerts').modal('hide');
                    } else if (e.target.id === 'ezclose-btn') {
                        calbackParam = false;
                        $('#ezAlerts').modal('hide');
                    }
                });
                break;
            case 'prompt':
                $('#ezAlerts-message').html(defaults.messageText + '<br /><br /><div class="form-group"><input type="' + defaults.inputFieldType + '" class="form-control" id="prompt" /></div>');
                $('#ezAlerts-footer').html('<button class="btn btn-primary">' + defaults.okButtonText + '</button>').on('click', ".btn", function () {
                    calbackParam = $('#prompt').val();
                    $('#ezAlerts').modal('hide');
                });
                break;
        }

        $('#ezAlerts').modal({
            show: false,
            backdrop: backd,
            keyboard: keyb == "true"
        }).on('hidden.bs.modal', function (e) {
            $('#ezAlerts').remove();
            if (calbackParam)
                deferredObject.resolve(callback());
            else
                deferredObject.reject();
        }).on('shown.bs.modal', function (e) {
            if ($('#prompt').length > 0) {
                $('#prompt').focus();
            }
        }).modal('show');
    }

    _show();
    return deferredObject.promise();
}