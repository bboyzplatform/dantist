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
        return str.replace(this.UTFREGEXP, function (match, grp) {
            return String.fromCharCode(parseInt(grp, 16));
        });
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
        BS_BT_DentalGrid.$super.call(this, options); //Приватная переменная хранящая путь до сервера, предоставляющего информацию для модуля
        this.dataUrl = '/api/getToothMap';
        this.proceduresUrl = '/api/getProcedures';
        this.doctorDataUrl = '/api/getDoctorData';
        this.saveRecordUrl = '/api/saveNewRecord';
        /* console.log(options); */
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
            /* <div class="container m-3"><!--dev-console remove it in prod --> \
            <h4>Dev-Console: data</h4>\
                <blockquote id="dev-console"></blockquote>\
            </div>\ */

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
            for (var i = 1; i < 9; i++) {
                posValue = containerNumber.toLocaleString() + i.toLocaleString();
                $(lineTemplate).append('\
                        <div class="tooth-double-item" \
                            data-position="' + posValue + '"\
                            data-active-state="inactive">\
                            <svg height="60px" width="50px" \
                                height="70px"\
                                width="50px"\
                                viewBox="0 0 320 480"\
                                xmlns="http://www.w3.org/2000/svg"\
                                xlink="http://www.w3.org/1999/xlink"\
                            >\
                                <image xlink: href="Content/svg/bbz-dental-icons/t-'+ posValue + '.svg" />\
                            </svg>\
                            <span class="position-text badge badge-pill lighten-3 blue text-center">' + posValue + "</span>\
                        </div>");
                /*
                 < div class = "tooth-double-item"\
                 data - position = "' + posValue + '"\
                 data - active - state = "inactive" > \
                     <
                     svg height = "60px"
                 width = "50px"\
                 xmlns = "http://www.w3.org/2000/svg"\
                 xmlns: xlink = "http://www.w3.org/1999/xlink"\
                 stroke = "#000"\
                 stroke - width = "8"\
                 fill = "none"\ >
                     \
                     <
                     image x = "0"
                 y = "0"
                 height = "50"
                 width = "40"
                 xlink: href = "Content/svg/bbz-dental-icons/t-'+posValue+'.svg" / > \
                     <
                     /svg>\ <
                     span class = "position-text badge badge-pill lighten-3 blue text-center" > ' + posValue + "</span>\
                    </div>");

                <svg id="circle" height="70px" width="40px" \
                            xmlns="http://www.w3.org/2000/svg"  \
                            xmlns: xlink="http://www.w3.org/1999/xlink">\
                                    <image x="-15" y="-5" height="70" width="60" xlink: href="Content/svg/oldtooths/t-' + posValue + '.svg" />\
                            </svg>\
                <img src="Content/svg/t-'+posValue+'.svg"></img>\ <img src="Content/svg/oldtooths/t-' + posValue + '.svg"></img>\
                            <span class="position-text badge badge-pill lighten-3 blue text-center">' + posValue + "</span>\ 
                            */
            }
            return lineTemplate;
        }
        /*  , focusTooth: function () {
             var template=$('<div class="card">\
                                     <div class="card-block p-2">\\
                                     <div class="badge badge-pill light-blue lighten-2">Фокус на зуб:</div>\
                                       <h4 class="card-title"></h4>\
                                       <h6 class="card-subtitle mb-2 text-muted"></h6>\
                                       <p class="card-content">Ничего не выбрано</p>\
                                     </div>\
                                   </div>\
                                     </div>\
                                 </div>');
             return template;
         } */
        ,
        actionList: function (proceduresData) {
            var template = $('<div></div>');
            var $stateChangeBtnsTemplate = $('<div class="state-change-btns card">\
            <div class="card-block"><h4 class="card-title badge badge-pill light-blue lighten-2">\
                <i class="bbz-i i_repair"></i> Состояние:\
            </div>\
            <div class="d-flex flex-column card-block" data-toggle="buttons">\
                <button class="btn btn-outline-light-green" data-state="heal" data-legendabbr=" " data-color="light-green">Здоров</button>\
                <button class="btn  btn-outline-blue-grey" data-state="removed" data-legendabbr="О" data-color="light-grey">Отсутствует</button>\
                <button class="btn  btn-outline-light-grey" data-state="plomb" data-legendabbr="П" data-color="light-gray">Пломбирован</button>\
                <button class="btn  btn-outline-light-grey" data-state="koronka" data-legendabbr="K" data-color="light-gray">Коронка</button>\
                <button class="btn  btn-outline-light-blue" data-state="implant" data-legendabbr="Им" data-color="light-blue">Имплант</button>\
                <button class="btn  btn-outline-light-blue" data-state="shtift" data-legendabbr="Ш" data-color="light-blue">Штифт</button>\
                <button class="btn  btn-outline-red" data-state="disease" data-legendabbr="К" data-color="red"> Кариес</button>\
                <button class="btn  btn-outline-red" data-state="disease" data-legendabbr="Pt" data-color="red"> Периодонтит</button>\
                <button class="btn  btn-outline-red" data-state="disease" data-legendabbr="A" data-color="red"> Парадантоз</button>\
                <button class="btn  btn-outline-red" data-state="disease" data-legendabbr="Г" data-color="red"> Гранулема</button>\
                <button class="btn  btn-outline-red" data-state="disease" data-legendabbr="Гк" data-color="red"> Кистогранулема</button>\
                <button class="btn  btn-outline-red" data-state="disease" data-legendabbr="Ки" data-color="red"> Киста</button>\
                <button class="btn  btn-outline-red" data-state="disease" data-legendabbr="R" data-color="red"> Корень</button>\
                <button class="btn  btn-outline-red" data-state="disease" data-legendabbr="Гп" data-color="red"> Гипоплазия</button>\
                <button class="btn  btn-outline-red" data-state="disease" data-legendabbr="Кл" data-color="red"> Клиновидный дефект</button>\
            </div>');
            var $mobilityRateTemplate = $('<div class="card mobrate-container"  data-visible-state="removed">\
            <div class="card-block">\
            <h4 class="card-title badge badge-pill light-blue lighten-2">\
                <i class="bbz-i i_repair"></i> Подвижность:\
                </h4>\
                <div class="form-group" >\
                    <input class="with-gap form-control radio-1" disabled name="group1" data-mobilityrate="1" type="radio" id="radio1" >\
                    <label for="radio1">I</label>\
                    <input class="with-gap radio-2" name="group1" disabled type="radio" id="radio2" data-mobilityrate="2">\
                    <label for="radio2">II</label>\
                     <input class="with-gap radio-3" name="group1" disabled type="radio" id="radio3" data-mobilityrate="3">\
                    <label for="radio3">III</label>\
                </div>\
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
                                                <button type="submit" class="btn btn-outline-info col-md-12 mt-2" data-add-procedures> Применить процедуры</button>');
            $(template)
                .append($stateChangeBtnsTemplate)
                .append($mobilityRateTemplate)
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
            var $legendTemplate = $('<div id="dental-legend-container" role="tablist" data-children=".legend-item">\
                <div class="card legend-item">\
                <div class="card-header" role="tab">\
                        <h4><a data-toggle="collapse" href="#collapse-legend-container" data-parent="#dental-legend-container"> Легенда:</a></h4>\
                    </div>\
                    <div id="collapse-legend-container" class="collapse" role="tabpanel" aria-labelledby="headingOne" data-parent="#accordion">\
                    <div class="row">\
                        <div class="col-md-12 d-flex flex-row justify-content-around">\
                        <div  class="d-flex flex-column">\
                        <p class="dental-legend-item" >\
                            <span data-state="heal" data-legendabbr=" " data-color="white"> </span> - Здоров</p>\
                        <p class="dental-legend-item" >\
                            <span data-state="removed" data-legendabbr="О" data-color="light-gray">О</span> - Отсутствующий зуб</p>\
                        <p class="dental-legend-item">\
                            <span data-state="disease" data-legendabbr="К" data-color="red">Pt</span> - кариес</p>\
                        <p class="dental-legend-item">\
                            <span data-state="disease" data-legendabbr="Pt" data-color="red">Pt</span> - периодонтит</p>\
                        <p class="dental-legend-item">\
                            <span data-state="plomb" data-legendabbr="П" data-color="lighter-blue">П</span> - Пломбирован</p>\
                        <p class="dental-legend-item">\
                            <span data-state="disease" data-legendabbr="A" data-color="red">A</span> - Парадантоз</p>\
                        <p class="dental-legend-item">\
                            <span data-state="koronka" data-legendabbr="К" data-color="lighter-blue">K</span> - Коронка</p>\
                        <p class="dental-legend-item">\
                            <span data-state="implant" data-legendabbr="И" data-color="light-blue">И</span> - Имплант</p>\
                        <p class="dental-legend-item">\
                            <span data-state="implant" data-legendabbr="Им" data-color="light-blue">Им</span> - Искусственный зуб</p>\
                        </div>\
                        <div  class="d-flex flex-column">\
                        <p class="dental-legend-item">\
                            <span data-state="shtift" data-legendabbr="Ш" data-color="lighter-blue">A</span> - Штифт</p>\
                        <p class="dental-legend-item">\
                            <span data-state="disease" data-legendabbr="Г" data-color="red">Г</span> - Гранулема</p>\
                        <p class="dental-legend-item">\
                            <span data-state="disease" data-legendabbr="Гк" data-color="red">Гк</span> - Кистогранулема</p>\
                        <p class="dental-legend-item">\
                            <span data-state="disease" data-legendabbr="Ки" data-color="red">Ки</span> - Киста</p>\
                        <p class="dental-legend-item">\
                            <span data-state="disease" data-legendabbr="К" data-color="red">R</span> - Корень</p>\
                        <p class="dental-legend-item">\
                            <span data-state="disease" data-legendabbr="Гп" data-color="red">Гп</span> - Гипоплазия</p>\
                        <p class="dental-legend-item">\
                            <span data-state="disease" data-legendabbr="Кл" data-color="red">Кл</span> - Клиновидный дефект</p> \
                           <p class="dental-legend-item">\
                            <span data-state="disease" data-legendabbr="Гп" data-color="red">Гп</span> - Гипоплазия</p>\
                        <p class="dental-legend-item">\
                            <span data-state="implant" data-legendabbr="И" data-color=""> -2</span> - Подвижность зуба (1,2,3)</p> \
                        </div>\
                    </div>\
                </div>\
                </div>\
                </div>');
            var $dentalTable = $('<table></table>').addClass('dental-card-table table table-striped table-bordered table-hover table-responsive');
            $dentalTable.data('table-data', data); //var $thead = $('<thead></thead>'); //Шапка таблицы находиться в середине таблицы
            var $tbody = $('<tbody></tbody>'); //$tr = $('<tr>');
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
            $tbody.append(tRow); //$thead.append(tRow);
            /* 3 и 4 ряды зубов */
            for (var index = 4; index > 3; index--) {
                var tr = "<tr>";
                for (var i = 8; i > 0; i--) {
                    var cell = '<td data-group="' + index + '" data-pos="' + i + '"><span class="abbr-text">' + i + "</span></td>";
                    tr += cell;
                }
                for (var i = 1; i <= 8; i++) {
                    var cell = "<td data-group=" + (index - 1) + ' data-pos="' + i + '"><span class="abbr-text">' + i + "</span></td>";
                    tr += cell;
                }
                tr += "</tr>";
                $tbody.append(tr);
            } //$dentalTable.append($thead);
            $dentalTable.append($tbody);
            $tableLegend = $("<div></div>").addClass("card").append($legendTemplate);
            var $itemsList = $('<ul class="list-group d-flex" data-dental-card></ul>');
            $(".heading", template).html($heading);
            var _getPos = function (elem) {
                return $(elem).data("position");
            }; //template.find(".user-inform").html($userInfoCardBlockTemplate);
            template.find(".item-table").html($itemsList);
            template.append($tableGrid);
            template.append($dentalTable);
            template.append($tableLegend);
            return template;
        },
        historyList: function (widget) {
            var template = $('<div class="card"></div>');
            var d = new Date();
            var curr_date = d.getDate();
            var curr_month = d.getMonth() + 1;
            var curr_year = d.getFullYear();

            var $navPanel = $('<nav class="nav nav-tabs mb-3 nav-fill" role="tablist">\
                <a class="nav-item nav-link active main-hist-link active disabled" data-toggle="tab" href="#' + widget.id + '-main-hist-tab" role="tab">Процесс Лечения:</a>\
                <a class="nav-item nav-link focus-hist-link active disabled" data-toggle="tab" href="#' + widget.id + '-focus-hist-tab" role="tab">История изменений</a>\
                </nav>');
            var $histTabsPanel = $('<div class="tab-content row" id="' + widget.id + '-hist-tabs"></div>');

            var $mainHistTab = $('<div class="col-md-6 main-hist-tab tab-pane fade show active" id="' + widget.id + '-main-hist-tab">\
                                    <h4 class= "card-title text-center">Зуб № <span data-position></span></h4 >\
                                    <div class="card-body">\
                                    <h6 class="doctor-name">Врач: <span class="doctor-name_fullname" data-record-value></span></h6>\
                                    <span class="h6"><b>Дата:</b> <span class="hist-date" data-record-value>' + curr_date + "-" + curr_month + "-" + curr_year + '</span></span>\
                                    <span class="h6"><b>Номер зуба:</b> <span class="hist-active-tooth-number" data-position="" data-record-value>Зуб не выбран...</span></span>\
                                    <span class="h6"><b>Состояние:</b> <span class="abbr-text" data-record-value data-legendabbr>Зуб не выбран...</span></span>\
                                    <span class="h6"><b>Процедуры:</b> <ul data-procedures data-record-value>Процедуры не определены...</ul></span>\
                                    <textarea data-record-value data-comment="" class="form-control comment-text invisible" rows="4" placeholder="Новый комментарий"></textarea>\
                                    <button type="button" class="btn btn-outline-primary m-5 invisible" data-toggle="modal" data-target="#' + widget.$modal[0].id + '" data-call-type="new-record"> Сохранить запись в историю</button>\
                                </div>');

            var $focusHistTab = $('<div class="col-md-6 focus-hist-tab tab-pane fade show active" id="' + widget.id + '-focus-hist-tab" data-tab>\
                <div class="card-body">\
                    <div class="card-text content">В истории еще не было записей...</div>\
                </div>\
            </div>');
            $histTabsPanel.append($mainHistTab).append($focusHistTab);
            $(template).append($navPanel).append($histTabsPanel);
            return template;
        },
        modalCont: function (widget, btId) {
            var modalContent = function () {
                var previewMarkup = '<h6>Just a modal</h6>\
                        <span><b>Дата</b>: </span>\
                        <span><b>Процедуры</b>:</span>\
                        <span><b>Комментарии</b>: </span>';
                return previewMarkup;
            }
            var stateMarkups = {
                'new-record': function () {
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
                '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>' +
                '</div>' +
                '<div class="modal-body">' + modalContent() +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>').appendTo('body');

            widget.$modal = $(modal);
        }
        /* Comment devConsole component in prod. 
        devConsole: function(){
            let template = $('<ul class="dev-console"></ul>');
            return template;
        }*/
    },
    getToothData: function (url) {
        var $this = this;
        var data = 'Нет данных';
        $.ajax({
            type: "get",
            url: url,
            data: JSON.stringify({
                "btid": this.id,
                "docId": this.docId
            }),
            contentType: 'application/json',
            dataType: "json",
            success: function (response) {
                $this.dentalData = response;
                $this.$control.trigger('initialUpdatedData', response);
            }
        });
        return data;
    },
    getDoctorData: function (doctorDataUrl) {
        var that = this;
        this.doctorData = '';
        $.ajax({
            type: "get",
            url: doctorDataUrl,
            data: JSON.stringify({
                "btid": that.id,
                "docId": that.docId
            }),
            contentType: 'application/json',
            dataType: "json",
            success: function (response) {
                that.doctorData = response;
                that.$control.trigger('initialUpdateDoctorData', response);
            }
        });
        return this.doctorData;
    },
    getProcedures: function (proceduresUrl) {
        var $this = this;
        var data = 'Нет данных';
        $.ajax({
            type: "get",
            url: proceduresUrl,
            data: JSON.stringify({
                "btid": this.id,
                "docId": this.docId
            }),
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
        this.getDoctorData(this.doctorDataUrl);
        this.render(this.components, this.dentalData, this.proceduresData); //И привяжем DOM события к нужным элементам модуля
        this.event();
        return this;
    },
    render: function (components, dentalData, proceduresData) {
        var that = this;
        this.$control.append(this.components.layoutGrid).find('.tooth-grid').append(this.components.toothGrid());
        this.$control.find('.color-section').each(function (ind, elem) {
            var containerNumber = $(elem).data('partValue');
            $(elem).append(that.components.toothGridItem(ind, containerNumber, dentalData));
        }); //this.$control.find('.focus-tooth').append(this.components.focusTooth());
        this.components.modalCont(this, this.options.btid); //this = widget
        this.$control.find('.action-list').append(this.components.actionList(proceduresData));
        this.$control.find('.anamnesis').append(this.components.anamnesis(dentalData));
        this.$control.find('.history-list').append(this.components.historyList(this));
        //this.$control.find('.focus-tooth').append(this.components.focusTooth())    
        //this.$control.find('#dev-console').append(this.components.devConsole(dentalData));
        
        setTimeout(function(){
            that.dentalToPrint();
         } , 1000);
    },
    dentalToPrint: function(){
         var $printClone = $('<div class="BSDentalGrid print-view"></div>');
         printTable = this.$control.find('.dental-card-table').clone();
         //this.$control.find('.history-list').clone().appendTo($printClone);
         $printClone.append(printTable);
         var $histPrintList = $('<div class="hist-print"></div>');
         var servicesHistData = this.dentalData.customer.serviceHistory;
         for (var serviceString in servicesHistData) {
             var $histBlock = $('<div></div>').css('display', 'inline-block');

             for (var item in servicesHistData[serviceString]) {
                 $histBlock.append('<div><b>' + item + ': <span>' + servicesHistData[serviceString][item]+ '</span></div>');
             }
             $histPrintList.append($histBlock);
         }
         $printClone.append($histPrintList);
         $('body').append($printClone);
    },
    event: function () {
        var that = this; //Toothgrid actions
        var deactivate = function (elements) {
            $(elements).data('active-state', 'inactive');
            $(elements).attr('data-active-state', 'inactive');
        };
        /* State - ui а не состояние модели */
        var toggleState = function (element) {
            $(element).data('active-state', ($(element).data('active-state') == 'active' ? 'inactive' : 'active'));
            $(element).attr('data-active-state', ($(element).attr('data-active-state') == 'active' ? 'inactive' : 'active'));
        };

        var applyVisibilityStateByData = function (collection, args) {
            
            if (args.state === 'removed') args.mobilityrate = "0";
            if(args.mobilityrate == ""){$(collection).find('input').prop('checked', false)};
            
            $(collection).each(function (e) {
                stateToHide = $(this).data('visible-state');
                if (args.state == stateToHide) {
                    $(this).hide().find('input').prop({
                        'disabled': 'disabled',
                        'checked': false
                    });
                } else {
                    $(this).show().find('input')
                        .prop('disabled', false)
                        .data('position', args.position)
                        .filter('.radio-' + args.mobilityrate)
                        .prop('checked', true);
                }

            });
        }

        this.$control.find('.tooth-grid').on('click', '.tooth-double-item', function (e) {
            var $item = $(e.currentTarget);
            var data = $(this).data();
            deactivate('.tooth-double-item');
            toggleState($item); //global
            $(that.$control).trigger('changeActiveTooth', {
                data
            });
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
                if (typeof data.mobilityrate == 'undefined') data.mobilityrate = that.dentalData.customer.tooth_map[itemPosition]['mobilityrate'];
                $(that.$control).trigger('changeToothState', {data});
            }
        });
        //подвижность зуба
        $('[data-mobilityrate]', this.$control).on('change', function (e) {
            var currentRate = $(e.currentTarget).data('mobilityrate');
            /* consoconsole.table(that);
            console.table(that.dentalData); */
            var position = $(this).data('position');
            var data = that.dentalData.customer.tooth_map[position];
            data.mobilityrate = currentRate;
            that.$control.trigger('changeToothState', {
                data
            });

        })
        //add current procedures to HistProcess list
        this.$control.find('button[data-add-procedures]').on('click', function (e) {
            var activeStateElement = $('.state-change-btns [data-active-state="active"]', this.$control);

            if (activeStateElement.length !== 0) {
                var activeData = $(activeStateElement).data();
                var proceduresMap = $(this).parent().find('input[type="checkbox"]:checked');

                var proceduresList = [];
                $(proceduresMap).each(function (index, element) {
                    // element == this
                    proceduresList.push($(element).data('procedure'));
                });
                that.$control.trigger('currentProceduresAccepted', {
                    proceduresList,
                    activeData
                } );

            } else {
                alert('Выберите зуб!');
            }
        });

        //hist update
        this.$control.on('currentProceduresAccepted', function (e, data) {
            var $histProcList = $('<ul class="current-procedures"></ul>');
            $.each(data.proceduresList, function (indexInArray, valueOfElement) {
                $histProcList.append('<li>' + valueOfElement + '</li>');
            });
            $('.main-hist-tab [data-procedures]', this.$control)
                .html($histProcList.html());

        });

        this.$control.on('changeToothState', function (e, args) {
            var itemPosition = args.data.position;
            var $updatingItems = $('[data-position="' + itemPosition + '"]', this.$control).not('button');

            for (var prop in args.data) {
                if (args.data['bs.button']) {
                    delete args.data['bs.button'];
                } else if (args.data[prop]) {
                    that.dentalData.customer.tooth_map[itemPosition][prop] = args.data[prop];
                    $updatingItems.data(prop, args.data[prop]);
                    $updatingItems.attr('data-' + prop, args.data[prop]);
                    if (prop == 'legendabbr') {
                        if (args.data['mobilityrate'] !== '0') {
                            $updatingItems.find('.abbr-text').text(args.data[prop] + '-' + args.data['mobilityrate']);
                        } else {
                            $updatingItems.find('.abbr-text').text(args.data[prop]);
                        }
                    }
                };
            }
            var collection = $('[data-visible-state]', this);
            applyVisibilityStateByData(collection, args.data);
        });

        $(this.$control).on('updateContent', function (e, args) {
            var $activityBtns = $('.state-change-btns button', this.$control);
            if (args !== 'null' && args.data.hasOwnProperty('position')) {
                if (args.data.state === 'removed') args.data.mobilityrate = "0";
                $activityBtns.data('position', args.data['position']);
                $activityBtns.attr('data-position', args.data['position']);
                var collection = $('[data-visible-state]', this);
                applyVisibilityStateByData(collection, args.data);
            }

        });

        this.$control.on('initialUpdateDoctorData', function (e, args) {
            //console.log('doctorGeted data');
            var fullName = args.doctor['full_name'];
            if (fullName) {
                $(e.currentTarget).find('.doctor-name_fullname').text(fullName);
            } else {
                //console.log(fullName)
            }
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

        this.$control.on('initialUpdatedProceduresData', function (e, args) {
            var procedures = args;
            //console.table(procedures);
            var $itemsList = $('<ul class="list-group"></ul>');
            for (var key in procedures) {
                if (procedures.hasOwnProperty(key)) {
                    $itemsList.append('<li>\
                        <form class="form-inline">\
                            <div class="form-group">\
                                <input type="checkbox" id="checkbox' + key + '" data-procedure="' + key + '">\
                                <label for="checkbox' + key + '">' + key + '\
                                    &nbsp;<i class="bbz-i i_' + procedures[key]["icon-name"] + '"></i>\
                                </label>\
                            </div>\
                        </form>\
                    </li>');
                } else {
                    $itemsList.html('<ul class="list-group"><li>Ничего не выбрано...</li></ul>');
                }
            }
            $('.treat-types-list .card-content', this).html($itemsList)
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
                var legendAbbr = $(element).data('legendabbr');
                var stateColor = $(element).data('color');
                if (dataMap[pos]['mobilityrate'] != 0) {
                    $(element).find('.abbr-text').text(legendAbbr + '-' + dataMap[pos]['mobilityrate']);
                } else {
                    $(element).find('.abbr-text').text(legendAbbr);
                }
            });
        });


        $(this.$control).on('changeActiveTooth', {
            oldStateData: $(this).data()
        }, function (e, args) {
            $(this).data('old-state', args);
            $('.focus-tooth .card-content', this).trigger('updateContent', args);
            $('.state-change-btns', this).trigger('updateContent', args);
            $('.history-list .card-text', this).trigger('updateContent', args);
            var collection = $('[data-visible-state]', this);
            applyVisibilityStateByData(collection, args.data);
        });

        $('.state-change-btns', this.$control).on('updateContent', function (e, args) {
            var $toggledButton = $('.state-change-btns button[data-state="' + args.data.state + '"]', this.$control);
            deactivate($(this).find('button'));
            toggleState($toggledButton);

        });



        /*  $('[data-visible-state]', this.$control).on('updateContent', function(e,args){
             stateToHide = $(e.currentTargegt).data('visible-state');
            if (args.data.state == stateToHide) {
                $(e.currentTarget).hide().find('input').prop({
                    'disabled': 'disabled',
                    'checked': false
                });
            } else {
                $(e.currentTarget).show().find('input').prop({
                    'disabled': 'disabled',
                    'checked': false
                });
            }
         }); */

        // dev console --> updateContent

        /*  this.$control.on('initialUpdatedData', function (e, args) {
             var $consoleList = $('<ul class="alert alert-info"></ul>');
             // data atributes output 
             for (var key in args.customer.serviceHistory) {
                 if (args.customer.serviceHistory.hasOwnProperty(key)) {
                     let histStringObject = args.customer.serviceHistory[key];
                     let $histItemBlock = $('<ul class="hist-block"></ul>');
                     for(let item in histStringObject ){
                         $histItemBlock.append('<li><b>' + item + '</b>: ' + histStringObject[item] + '</li>');
                     }
                     $consoleList.append($histItemBlock);
                 }
                 else {
                     $consoleList.html('Ничего не выбрано');
                 }
             }
             $('#dev-console', this).html($consoleList);
         
         }); */

        /* <-- dev console */

        $('.focus-tooth .card-content', this.$control).on('updateContent', function (e, args) {
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
                dependedPanelList = $('<div data-position="' + $(element).data('position') + '">' + [index] + 'Info block</div>').appendTo(canalList);
            });
            stateContent.append(canalList);
            stateContent.on('click', function (e) {
                toggleState(e.target);
                var currentPosition = $(e.target).data('position') || 'null'; //Сменить стейт canalList ..-> пробросить data-props
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

        //history list initial update from data
        this.$control.on('initialUpdatedData', function (e, args) {
            var $mainHistTab = $('.main-hist-tab', this);
            var $focusHistTab = $('.focus-hist-tab', this);

            if (!args.customer || args.customer.serviceHistory === 'null') {
                $('.content', $mainHistTab).html('<span class="text-center">Не выбран зуб...</span>');
            } else {
                var historyData = args.customer.serviceHistory;
                var $histList = $('<ul class="list-group"></ul>');
                for (var key in historyData) {
                    var $itemContainer = $('<li data-toggle="list"><h6>Запись №<span data-history-id="' + key + '">' + key + '</span></h6></li>');
                    for (var prop in historyData[key]) {
                        $itemContainer.append('<span><b>' + prop + '</b>: ' + historyData[key][prop] + '</span>')
                    }
                    $itemContainer.addClass('d-flex flex-column list-group-item list-group-item-action align-items-start');
                    var $changeBtns = $('<div class="btn-group redact-btns" style="display:none;" role="group">\
                    <button type="button" class="btn btn-info" data-toggle="modal" data-target="#' + that.$modal[0].id + '" data-call-type="edit-record" data-edit-btn data-history-id="' + key + '"><i class="fa fa-pencil-square-o" /></i> Изменить </button>\
                    <button type = "button" class = "btn btn-danger" data-remove-btn data-history-id="' + key + '"><i class="fa fa-remove"/></i> Удалить</button > \
                    </div>');
                    $itemContainer.append($changeBtns);
                    $histList.append($itemContainer);
                }
                //$focusHistTab.children('.card-title').text('Зуб №'+args.customer.position);
                $focusHistTab.find('.content').html($histList);
                $mainHistTab.find('.focus-hist-link');
            }
        });
        /* History list events on widget state change was triggered */
        this.$control.on('changeActiveTooth', function (e, args) {
            //console.log(args);
            var $mainHistTab = $('.main-hist-tab', this);
            $('[data-legendabbr]', $mainHistTab).text(args.data['legendabbr']);
            $('[data-position]', $mainHistTab).text(args.data['position']);
            $('[data-call-type]', $mainHistTab).data('position', args.data['position']);
            $('[data-call-type], .comment-text', $mainHistTab).removeClass('invisible');
        });
        /* history on state change */

        this.$control.on('changeToothState', function (e, args) {
            //console.log(args);
            var $mainHistTab = $('.main-hist-tab', this);
            $('[data-legendabbr]', $mainHistTab)
                .data('legendabbr', args.data['legendabbr'])
                .text(args.data['legendabbr']);
        });

        this.$modal.on('show.bs.modal', function (e) {
            if ($(e.relatedTarget, that.$control).length !== 0) {
                //console.log('modal from dental widget');
            }
            var $button = $(event.target) // Button that triggered the modal
            var callType = $button.data('call-type'); // Extract info from data-* attributes
            // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
            // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
            var currentElementData = $button.data()
            var serviceRecord = that.dentalData.customer.tooth_map[currentElementData.position];
            var data = {
                serviceRecord
            };
            modalCall(e, callType, $button, data);
        });

        /* Сохранение новой записи */
        this.$modal.on('shown.bs.modal', function (e) {
            $('[data-save-new-record]').on('click', function (e, serviceRecord) {
                var $elemsCollection = $('[data-record-value]', that.$control);
                var serviceRecord = [];

                $elemsCollection.each(function (index, elem) {
                    var recData = ''
                    if (typeof $(elem)[0].type == 'undefined' && !$(elem).data('procedures')) {
                        recData = elem.innerText;
                    } else if ($(elem).data('procedures') == '') {
                        $(elem).find('li').each(function (index, element) {
                            recData += ' ' + element.innerText;
                        });
                    } else {
                        recData = elem.value;
                    }
                    serviceRecord.push(recData);
                });
                that.$control.trigger('saveNewRecord', {
                    serviceRecord
                });
            });
        });

        //Сохранение новой записи в журнал
        this.$control.on('saveNewRecord', function (e, data) {
            //console.log(data.serviceRecord);
            var keysArray = ['Врач', 'Дата', 'Номер зуба', 'Состояние', 'Процедуры', 'Комментарии'];
            var oldServiceRecord = that.dentalData.customer.serviceHistory;
            var maxIndex = 0;
            for (var index in that.dentalData.customer.serviceHistory) {
                maxIndex = index;
            }
            var oldSRMap = oldServiceRecord[parseInt(maxIndex) + 1] = {};

            for (var key in keysArray) {
                oldSRMap[keysArray[key]] = data.serviceRecord[key];
            }

            /*//FOR POSTS у меня не работает на моем локал серваке - залипуха
             $.ajax({
                type: "post", 
                url: that.saveRecordUrl, 
                data: JSON.stringify({
                    "btid": this.id, 
                    "docId": this.docId,
                    "serviceHistory": that.dentalData.customer.serviceHistory
                }),
                contentType: 'application/json',
                dataType: "json", 
                success: function (response) {
                    //обновить компоненты читающие данные из объекта tooth_map(!)
                    that.$control.trigger('refreshAfterSave');
                }
            }); */
            that.$control.trigger('refreshHistory');
        });

        //обновить компонеенты History List после добавления\редактирования или удаления записи истории
        this.$control.on('refreshHistory', function (e) {
            var historyData = that.dentalData.customer.serviceHistory;
            var $focusHistTab = $('.focus-hist-tab', this);
            var $histList = $('<ul class="list-group"></ul>');
            for (var key in historyData) {
                var $itemContainer = $('<li data-toggle="list"><h6>Запись №<span data-history-id="' + key + '">' + key + '</span></h6></li>');
                for (var prop in historyData[key]) {
                    $itemContainer.append('<span><b>' + prop + '</b>: ' + historyData[key][prop] + '</span>')
                }
                $itemContainer.addClass('d-flex flex-column list-group-item list-group-item-action align-items-start');
                var $changeBtns = $('<div class="btn-group redact-btns" style="display:none" role="group">\
                <button type="button" class="btn btn-info" data-toggle="modal" data-target="#' + that.$modal[0].id + '" data-call-type="edit-record" data-edit-btn data-history-id="' + key + '"><i class="fa fa-pencil-square-o" /></i> Изменить </button>\
                <button type="button" class="btn btn-danger" data-remove-btn data-history-id="' + key + '"><i class="fa fa-remove"/></i> Удалить</button > \
                </div>');
                $itemContainer.append($changeBtns);
                $histList.append($itemContainer);
            }
            $focusHistTab.find('.content').html($histList);
            that.$modal.modal('hide');
            alert('Сохранено!');
        });
        //Удалить запись в Истории изменений
        this.$control.on('click', '[data-remove-btn]', function (e) {
            var id = $(e.currentTarget).data('historyId');
            areUShure = confirm("Вы уверены что хотите удалить запись?");
            if (areUShure) {
                that.$control.trigger('removeHistoryRecord', {
                    id
                });
            }
        })
        this.$control.on('removeHistoryRecord', function (e, data) {
            var serviceHistory = that.dentalData.customer.serviceHistory;
            delete serviceHistory[data.id];
            that.$control.trigger('refreshHistory');
            alert('Запись удалена!');
        });


        var modalCall = function (e, callType, fromElement, data) {
            $(e.currentTarget).data('modal-type', callType);
            switch (callType) {
                case 'new-record':
                    $(e.currentTarget).find('.modal-title').text('Новая запись в журнал');
                    $elementsCont = $(fromElement).parent();
                    var comment = $elementsCont.find('[data-comment]').val();
                    var doctorName = $elementsCont.find('.doctor-name_fullname').text();
                    var date = $elementsCont.find('.hist-date').text();
                    var procedures = $elementsCont.find('[data-procedures]').parent().html()
                    var proceduresArr = [];
                    $elementsCont.find('[data-procedures] *').each(function (index, element) {
                        proceduresArr.push($(element).text());
                    });
                    var $newCommentMarkup = $('<div class="form-controls">\
                                                   <div class="col-auto" >\
                                                   <p>Ответственный врач: ' + doctorName + '</p>\
                                                   <p>Дата: ' + date + '</p>\
                                                   <p>Номер зуба: ' + data.serviceRecord.position + '</p>\
                                                   <p>Состояние: ' + data.serviceRecord.legendabbr + '</p>\
                                                   <p class="comments">Комментарий: ' + comment + '</p>\
                                                   <p>' + procedures + '</p>\
                                                    <button class="btn btn-success" data-save-new-record >\
                                                    Сохранить</button>\
                                                        </div>\
                                                    </div>\
                                                </div>');
                    $(e.currentTarget).find('.modal-body').html($newCommentMarkup);

                    break;
                case 'edit-record':
                    $(e.currentTarget).find('.modal-title').text('Редактировать запись журнала');
                    $elementsCont = $(fromElement).parent();
                    var comment = $elementsCont.find('[data-comment]').val();
                    var doctorName = $elementsCont.find('.doctor-name_fullname').text();
                    var date = $elementsCont.find('.hist-date').text();
                    var procedures = $elementsCont.find('[data-procedures]').parent().html()
                    var proceduresArr = [];
                    $elementsCont.find('[data-procedures] *').each(function (index, element) {
                        proceduresArr.push($(element).text());
                    });
                    var $newCommentMarkup = $('<div class="form-controls">\
                                                   <div class="col-auto" >\
                                                   <p>Ответственный врач: ' + doctorName + '</p>\
                                                   <p>Дата: ' + date + '</p>\
                                                   <p>Номер зуба: ' + data.serviceRecord.position + '</p>\
                                                   <p>Состояние: ' + data.serviceRecord.legendabbr + '</p>\
                                                   <p class="comments">Комментарий: ' + comment + '</p>\
                                                   <p>' + procedures + '</p>\
                                                    <button class="btn btn-success" data-save-new-record >\
                                                    Сохранить</button>\
                                                        </div>\
                                                    </div>\
                                                </div>');
                    $(e.currentTarget).find('.modal-body').html($newCommentMarkup);
                default:
                    break;
            }
        }

    }
});