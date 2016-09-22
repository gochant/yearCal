/**
 * widget: YearCal
 */
(function () {

    var kendo = window.kendo;
    var ui = kendo.ui;
    var Widget = ui.Widget;
    var progress = kendo.ui.progress;
    var NS = '.kendoYearCal';
    var CHANGE = "change";
    var PROGRESS = "progress";
    var ERROR = "error";
    var DataSource = kendo.data.DataSource;

    var dataProvider = {
        solarMonthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        weeks: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        solarFestivals: {
            'd0101': '元旦节',
            'd0202': '世界湿地日',
            'd0210': '国际气象节',
            'd0214': '情人节',
            'd0301': '国际海豹日',
            'd0303': '全国爱耳日',
            'd0305': '学雷锋纪念日',
            'd0308': '妇女节',
            'd0312': '植树节,孙中山逝世纪念日',
            'd0314': '国际警察日',
            'd0315': '消费者权益日',
            'd0317': '中国国医节,国际航海日',
            'd0321': '世界森林日,消除种族歧视国际日,世界儿歌日',
            'd0322': '世界水日',
            'd0323': '世界气象日',
            'd0324': '世界防治结核病日',
            'd0325': '全国中小学生安全教育日',
            'd0330': '巴勒斯坦国土日',
            'd0401': '愚人节,全国爱国卫生运动月(四月),税收宣传月(四月)',
            'd0407': '世界卫生日',
            'd0422': '世界地球日',
            'd0423': '世界图书和版权日',
            'd0424': '亚非新闻工作者日',
            'd0501': '劳动节',
            'd0504': '青年节',
            'd0505': '碘缺乏病防治日',
            'd0508': '世界红十字日',
            'd0512': '国际护士节',
            'd0515': '国际家庭日',
            'd0517': '世界电信日',
            'd0518': '国际博物馆日',
            'd0520': '全国学生营养日',
            'd0522': '国际生物多样性日',
            'd0523': '国际牛奶日',
            'd0531': '世界无烟日',
            'd0601': '国际儿童节',
            'd0605': '世界环境日',
            'd0606': '全国爱眼日',
            'd0617': '防治荒漠化和干旱日',
            'd0623': '国际奥林匹克日',
            'd0625': '全国土地日',
            'd0626': '国际禁毒日',
            'd0701': '香港回归纪念日,中共诞辰,世界建筑日',
            'd0702': '国际体育记者日',
            'd0707': '抗日战争纪念日',
            'd0711': '世界人口日',
            'd0730': '非洲妇女日',
            'd0801': '建军节',
            'd0808': '中国男子节(爸爸节)',
            'd0815': '抗日战争胜利纪念',
            'd0908': '国际扫盲日,国际新闻工作者日',
            'd0909': '毛泽东逝世纪念',
            'd0910': '中国教师节',
            'd0914': '世界清洁地球日',
            'd0916': '国际臭氧层保护日',
            'd0918': '九一八事变纪念日',
            'd0920': '国际爱牙日',
            'd0927': '世界旅游日',
            'd0928': '孔子诞辰',
            'd1001': '国庆节,世界音乐日,国际老人节',
            'd1002': '国际和平与民主自由斗争日',
            'd1004': '世界动物日',
            'd1006': '老人节',
            'd1008': '全国高血压日,世界视觉日',
            'd1009': '世界邮政日,万国邮联日',
            'd1010': '辛亥革命纪念日,世界精神卫生日',
            'd1013': '世界保健日,国际教师节',
            'd1014': '世界标准日',
            'd1015': '国际盲人节(白手杖节)',
            'd1016': '世界粮食日',
            'd1017': '世界消除贫困日',
            'd1022': '世界传统医药日',
            'd1024': '联合国日,世界发展信息日',
            'd1031': '世界勤俭日',
            'd1107': '十月社会主义革命纪念日',
            'd1108': '中国记者日',
            'd1109': '全国消防安全宣传教育日',
            'd1110': '世界青年节',
            'd1111': '国际科学与和平周(本日所属的一周)',
            'd1112': '孙中山诞辰纪念日',
            'd1114': '世界糖尿病日',
            'd1117': '国际大学生节,世界学生节',
            'd1121': '世界问候日,世界电视日',
            'd1129': '国际声援巴勒斯坦人民国际日',
            'd1201': '世界艾滋病日',
            'd1203': '世界残疾人日',
            'd1205': '国际经济和社会发展志愿人员日',
            'd1208': '国际儿童电视日',
            'd1209': '世界足球日',
            'd1210': '世界人权日',
            'd1212': '西安事变纪念日',
            'd1213': '南京大屠杀(1937年)纪念日',
            'd1220': '澳门回归纪念',
            'd1221': '国际篮球日',
            'd1224': '平安夜',
            'd1225': '圣诞节',
            'd1226': '毛泽东诞辰纪念'
        },
        lunarFestivals: {
            'd0101': '春节',
            'd0115': '元宵节',
            'd0202': '龙抬头节',
            'd0323': '妈祖生辰',
            'd0505': '端午节',
            'd0707': '七夕情人节',
            'd0715': '中元节',
            'd0815': '中秋节',
            'd0909': '重阳节',
            'd1015': '下元节',
            'd1208': '腊八节',
            'd1223': '小年',
            'd0100': '除夕'
        },
        _data: {},
        /**
         * 判断公历年是否是闰年
         * @param {number} year 公历年
         */
        _isSolarLeapYear: function (year) {
            return ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0));
        },
        /**
         * 获取公历月份的天数
         * @param {number} year 公历年
         * @param {number} month 公历月
         */
        _getSolarMonthDayCount: function (year, month) {
            var monthDays = [31, this._isSolarLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            return monthDays[month - 1];
            // 另一种方法
            // return new Date(year, month + 1, 0).getDate();
        },
        _getD4String: function (month, day) {
            month = month < 10 ? '0' + month : month;
            day = day < 10 ? '0' + day : day;
            return 'd' + month + day;
        },
        _getSolarFestival: function (month, day) {
            var me = this;
            return me.solarFestivals[me._getD4String(month, day)];
        },
        _getLunarFestival: function (lmonth, lday) {
            var me = this;
            return me.lunarFestivals[me._getD4String(lmonth, lday)];
        },
        _getSolarMonthName: function (month) {
            return this.solarMonthNames[month - 1];
        },
        _getCombineFestival: function (data) {
            var me = this;
            var r = [];
            var sf = me.festival;
            if (sf != null) {
                r = r.concat(sf.split(','));
            }
            var lf = data.lunar.festival;
            if (lf != null) {
                r = r.concat(lf.split(','));
            }
            var term = data.lunar.term;
            if (term != null) {
                r.push(term);
            }
            return r;
        },
        _getDayName: function (week) {
            return this.weeks[week];
        },
        getSolarData: function (year, month, day) {
            var me = this;
            var date = new Date(year, month - 1, day);
            var week = date.getDay();
            var day = date.getDate();
            var data = {
                id: me._getD4String(month, day),
                day: day,
                year: year,
                month: month,
                date: date,
                week: week,
                dayName: this._getDayName(week),
                festival: this._getSolarFestival(month, day),
                isWeekend: week === 0 || week === 6
            };
            return data;
        },
        getLunarData: function (year, month, day) {
            var d = lunarCalendar.solar2lunar(year, month, day);
            var lmonth = d.lMonth;
            var lday = d.lDay;
            var data = {
                year: d.lYear,
                month: lmonth,
                day: lday,
                monthName: d.IMonthCn,
                dayName: d.IDayCn,
                term: d.Term,
                festival: this._getLunarFestival(lmonth, lday)
            }

            return data;
        },
        getFullData: function (year, month, day) {
            var data = this.getSolarData(year, month, day);
            data.lunar = this.getLunarData(year, month, day);
            data.festival = this._getCombineFestival(data);
            return data;
        },
        getMonthOfData: function (year, month) {
            var me = this;
            var days = [[]];
            var dayCount = this._getSolarMonthDayCount(year, month);

            for (var i = 0; i < dayCount; i++) {
                var data = me.getFullData(year, month, i + 1);

                me._data[data.id] = data;

                var weekIdx = data.week === 0 ? 6 : data.week - 1;
                if (weekIdx === 0 && i !== 0) {
                    days.push([]);
                }
                var currWeek = days[days.length - 1];
                currWeek[weekIdx] = data;

                // 后补空
                if (i === dayCount - 1 && weekIdx < 6) {
                    currWeek[6] = undefined;
                }
            }

            if (days.length < 6) {
                var idx = days.length;
                while (idx < 6) {
                    var blank = [];
                    blank[6] = undefined;
                    days.push(blank);
                    idx++;
                }
            }

            var result = {
                title: this._getSolarMonthName(month),
                days: days
            };

            return result;
        },
        findData: function (id) {
            return this._data[id];
        }
    };

    var YearCal = Widget.extend({
        options: {
            name: 'YearCal',
            year: '',
            dataSource: null,
            autoBind: true,
            template: '<div class="cal">' +
            '<div class="cal__header">' +
            '<span class="cal__info_month_year" id="label"> #: data.title # </span>' +
            '</div> ' +
            '<table class="cal__frame cal__frame-head"> ' +
            '<tr>' +
            '<td class="cal__cell cal__cell-head">一</td>' +
            '<td class="cal__cell cal__cell-head">二</td> ' +
            '<td class="cal__cell cal__cell-head">三</td>' +
            '<td class="cal__cell cal__cell-head">四</td>' +
            '<td class="cal__cell cal__cell-head">五</td>' +
            '<td class="cal__cell cal__cell-head cal__cell-weekend">六</td>' +
            '<td class="cal__cell cal__cell-head cal__cell-weekend">日</td>' +
            '</tr>' +
            '</table>' +
            '<table class="cal__frame cal__frame-day">' +
            '<tbody>' +
            '# for(var i=0; i < data.days.length; i++){ #' +
            '# var line=data.days[i]; #' +
            '<tr> ' +
            '# for(var j=0; j < line.length; j++){ #' +
            '<td class="cal__cell cal__cell-day">' +
            '# var item=line[j]; #' +
            '# if(item !=null){ #' +
            '<div data-id="#: item.id #" class="cal__day">' +
            '<span class="cal__info_day_number">#: item.day #</span> ' +
            '# if(item.festival.length===0){ # ' +
            '<span class="cal__info_lunar_day_name">#: item.lunar.dayName #</span>' +
            ' # } else { # ' +
            '<span title="#: item.festival[0] #" class="cal__info_festival">#: item.festival[0] #</span>' +
            ' # } # ' +
            '</div>' +
            '# }else{ } # ' +
            '</td>' +
            '# } #' +
            '</tr>' +
            '# } #' +
            '</tbody>' +
            '</table>' +
            '</div>',
            popupTemplate: '<div data-id="#: data.id #">' +
            '<div> #: data.lunar.monthName # #: data.lunar.dayName # #: data.dayName #</div>' +
            '<hr class="hr-sm" />' +
            '<div>' +
            '# if(data.dayState && data.dayState !==0){ #' +
            '<button data-value="0" class="btn-cancel btn btn-default btn-xs">撤销设置</button> ' +
            '# } #' +
            '# if(data.dayState !==1){ #' +
            '<button data-value="1" class="btn-cancel btn btn-default btn-xs">设为工作日</button> ' +
            '# } #' +
            '# if(data.dayState !==2){ #' +
            '<button data-value="2" class="btn-cancel btn btn-default btn-xs">设为休息日</button> ' +
            '# } #' +
            '</div>' +
            '</div>'
        },
        events: [
            'change',
            'edit'
        ],
        dataProvider: dataProvider,
        init: function (element, options) {
            var me = this;
            Widget.fn.init.call(me, element, options);
            options = me.options;
            this.year = this.options.year;
            this._templates();
            this._initPopup();
            this._html();
            this._bindEvents();
            this._bindDomEvents();
            this._dataSource();
            if (options.autoBind) {
                me.dataSource.fetch();
            }
            kendo.notify(me);
        },
        _renderMonth: function (year, month) {
            var data = this.dataProvider.getMonthOfData(year, month);
            return this.template(data);
        },
        _html: function () {
            var year = this.year;
            if (year == false) {
                return;
            }
            var html = '';

            var month = 1;
            while (month <= 12) {
                html += this._renderMonth(year, month);
                month++;
            }

            this.element.html(html);
        },
        changeYear: function (year) {
            this.year = year;
            this._html();
            this.trigger('changeYear', this.year);
        },
        setDataSource: function(dataSource){
            this.options.dataSource = dataSource;
            this._dataSource();

            if (this.options.autoBind) {
                dataSource.fetch();
            }
        },
        _dataSource: function () {
            var me = this;

            if (me.dataSource && me._refreshHandler) {
                me._unbindDataSource();
            } else {
                me._refreshHandler = $.proxy(me.refresh, me);
                me._progressHandler = $.proxy(me._progress, me);
                me._errorHandler = $.proxy(me._error, me);
            }

            me.dataSource = DataSource.create(me.options.dataSource)
                .bind(CHANGE, me._refreshHandler)
                .bind(PROGRESS, me._progressHandler)
                .bind(ERROR, me._errorHandler);
        },
        _unbindDataSource: function () {
            var me = this;

            me.dataSource.unbind(CHANGE, me._refreshHandler)
                .unbind(PROGRESS, me._progressHandler)
                .unbind(ERROR, me._errorHandler);
        },
        _progress: function () {
            progress(this.element, true);
        },
        _error: function () {
            progress(this.element, false);
        },
        _templates: function () {
            var options = this.options;
            this.template = kendo.template(options.template, {useWithBlock: false});
            this.popupTemplate = kendo.template(options.popupTemplate, {useWithBlock: false});
        },
        refresh: function () {
            var me = this;
            var view = me.dataSource.view();
            for (var idx = 0, length = view.length; idx < length; idx++) {
                var item = view[idx];
                // 设置数据的状态
                var state = item.state;
                var id = item.id;

                if (state === 1 || state === 2) {
                    var cls = 'cal__day-record';
                    var statCls = state === 2 ? 'off_day' : 'work_day';
                    me.element.find('.cal__day[data-id=' + id + ']').addClass(cls + ' ' + statCls);
                }

                var data = me.dataProvider.findData(item.id);
                if (data != null) {
                    data.dayState = state;
                }
            }

            progress(this.element, false);
        },
        select: function ($el) {
            this.element.find('.active').removeClass('active');
            $el.addClass('active');
            var id = $el.data('id');
            this.trigger('change', {
                target: $el,
                id: id
            });
        },
        _initPopup: function () {
            this.popup = this.element.qtip({
                id: 'cal',
                content: {
                    text: '加载中...'
                },
                position: {
                    my: 'bottom center',
                    at: 'top center',
                    target: 'body'
                },
                style: {
                    classes: 'qtip-light qtip-shadow'
                },
                show: {
                    delay: '5',
                    event: 'click'
                },
                hide: {
                    event: 'unfocus'
                }
            }).qtip('api').show().hide();
        },
        _bindEvents: function () {
            var me = this;
            this.bind('change', function (e) {
                var data = me.dataProvider.findData(e.id);
                if (data != null) {
                    me._openPopup(e.target, data);
                }
            });
        },
        _openPopup: function ($target, data) {
            var me = this;
            // me.element.find('.cal__day[data-id='+ data.id +']')
            me.popup.set({
                'content.title': data.date.toLocaleDateString('zh'),
                'content.text': me.popupTemplate(data),
                'position.target': $target
            });
            me.popup.show();
        },
        _bindDomEvents: function () {
            var clickNS = 'click' + NS;
            var me = this;
            this.element.on(clickNS, '.cal__day', function (e) {
                var $target = $(e.currentTarget);
                var id = $target.data('id');
                me.select($target);
            });
            this.popup.elements.tooltip.on(clickNS, '.btn', function(e){
                me.trigger('edit', {
                    target: e.currentTarget
                })
            })
        },
        destroy: function () {
            Widget.fn.destroy.call(this);
            this._unbindDataSource();
            this.element.off(NS);
            if (this.popup) {
                this.popup.elements.tooltip.off(NS);
                this.popup.destroy(true);
            }
            kendo.destroy(this.element);
        }
    });

    kendo.ui.plugin(YearCal);

})();
