
var lunarCalendar = (function () {

    /**
     * @1900-2100区间内的公历、农历互转
     * @charset  UTF-8
     * @Author  Jea杨(JJonline@JJonline.Cn)
     * @Time    2014-7-21
     * @Time    2016-8-13 Fixed 2033hex、Attribution Annals
     * @Version 1.0.1
     * @公历转农历：calendar.solar2lunar(1987,11,01); //[you can ignore params of prefix 0]
     * @农历转公历：calendar.lunar2solar(1987,09,10); //[you can ignore params of prefix 0]
     */
    var calendar = {

        /**
         * 农历1900-2100的润大小信息表
         * @Array Of Property
         * @return Hex
         */
        lunarInfo: [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,//1900-1909
            0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,//1910-1919
            0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,//1920-1929
            0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,//1930-1939
            0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,//1940-1949
            0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,//1950-1959
            0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,//1960-1969
            0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,//1970-1979
            0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,//1980-1989
            0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,//1990-1999
            0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,//2000-2009
            0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,//2010-2019
            0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,//2020-2029
            0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,//2030-2039
            0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,//2040-2049
            /**Add By JJonline@JJonline.Cn**/
            0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,//2050-2059
            0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,//2060-2069
            0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,//2070-2079
            0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,//2080-2089
            0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,//2090-2099
            0x0d520],//2100


        /**
         * 公历每个月份的天数普通表
         * @Array Of Property
         * @return Number
         */
        solarMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],


        /**
         * 天干地支之天干速查表
         * @Array Of Property trans["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"]
         * @return Cn string
         */
        Gan: ["\u7532", "\u4e59", "\u4e19", "\u4e01", "\u620a", "\u5df1", "\u5e9a", "\u8f9b", "\u58ec", "\u7678"],


        /**
         * 天干地支之地支速查表
         * @Array Of Property
         * @trans["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"]
         * @return Cn string
         */
        Zhi: ["\u5b50", "\u4e11", "\u5bc5", "\u536f", "\u8fb0", "\u5df3", "\u5348", "\u672a", "\u7533", "\u9149", "\u620c", "\u4ea5"],


        /**
         * 天干地支之地支速查表<=>生肖
         * @Array Of Property
         * @trans["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"]
         * @return Cn string
         */
        Animals: ["\u9f20", "\u725b", "\u864e", "\u5154", "\u9f99", "\u86c7", "\u9a6c", "\u7f8a", "\u7334", "\u9e21", "\u72d7", "\u732a"],


        /**
         * 24节气速查表
         * @Array Of Property
         * @trans["小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"]
         * @return Cn string
         */
        solarTerm: ["\u5c0f\u5bd2", "\u5927\u5bd2", "\u7acb\u6625", "\u96e8\u6c34", "\u60ca\u86f0", "\u6625\u5206", "\u6e05\u660e", "\u8c37\u96e8", "\u7acb\u590f", "\u5c0f\u6ee1", "\u8292\u79cd", "\u590f\u81f3", "\u5c0f\u6691", "\u5927\u6691", "\u7acb\u79cb", "\u5904\u6691", "\u767d\u9732", "\u79cb\u5206", "\u5bd2\u9732", "\u971c\u964d", "\u7acb\u51ac", "\u5c0f\u96ea", "\u5927\u96ea", "\u51ac\u81f3"],


        /**
         * 1900-2100各年的24节气日期速查表
         * @Array Of Property
         * @return 0x string For splice
         */
        sTermInfo: ['9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c3598082c95f8c965cc920f',
            '97bd0b06bdb0722c965ce1cfcc920f', 'b027097bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
            '97bcf97c359801ec95f8c965cc920f', '97bd0b06bdb0722c965ce1cfcc920f', 'b027097bd097c36b0b6fc9274c91aa',
            '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f', '97bd0b06bdb0722c965ce1cfcc920f',
            'b027097bd097c36b0b6fc9274c91aa', '9778397bd19801ec9210c965cc920e', '97b6b97bd19801ec95f8c965cc920f',
            '97bd09801d98082c95f8e1cfcc920f', '97bd097bd097c36b0b6fc9210c8dc2', '9778397bd197c36c9210c9274c91aa',
            '97b6b97bd19801ec95f8c965cc920e', '97bd09801d98082c95f8e1cfcc920f', '97bd097bd097c36b0b6fc9210c8dc2',
            '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec95f8c965cc920e', '97bcf97c3598082c95f8e1cfcc920f',
            '97bd097bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec9210c965cc920e',
            '97bcf97c3598082c95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
            '97b6b97bd19801ec9210c965cc920e', '97bcf97c3598082c95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722',
            '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f',
            '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
            '97bcf97c359801ec95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
            '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f', '97bd097bd07f595b0b6fc920fb0722',
            '9778397bd097c36b0b6fc9210c8dc2', '9778397bd19801ec9210c9274c920e', '97b6b97bd19801ec95f8c965cc920f',
            '97bd07f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c920e',
            '97b6b97bd19801ec95f8c965cc920f', '97bd07f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2',
            '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bd07f1487f595b0b0bc920fb0722',
            '7f0e397bd097c36b0b6fc9210c8dc2', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
            '97bcf7f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
            '97b6b97bd19801ec9210c965cc920e', '97bcf7f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722',
            '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf7f1487f531b0b0bb0b6fb0722',
            '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
            '97bcf7f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
            '97b6b97bd19801ec9210c9274c920e', '97bcf7f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
            '9778397bd097c36b0b6fc9210c91aa', '97b6b97bd197c36c9210c9274c920e', '97bcf7f0e47f531b0b0bb0b6fb0722',
            '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c920e',
            '97b6b7f0e47f531b0723b0b6fb0722', '7f0e37f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2',
            '9778397bd097c36b0b70c9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721', '7f0e37f1487f595b0b0bb0b6fb0722',
            '7f0e397bd097c35b0b6fc9210c8dc2', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721',
            '7f0e27f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
            '97b6b7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722',
            '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
            '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721',
            '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
            '97b6b7f0e47f531b0723b0787b0721', '7f0e27f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
            '9778397bd097c36b0b6fc9210c91aa', '97b6b7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
            '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9210c8dc2', '977837f0e37f149b0723b0787b0721',
            '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f5307f595b0b0bc920fb0722', '7f0e397bd097c35b0b6fc9210c8dc2',
            '977837f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e37f1487f595b0b0bb0b6fb0722',
            '7f0e397bd097c35b0b6fc9210c8dc2', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
            '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '977837f0e37f14998082b0787b06bd',
            '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722',
            '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
            '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
            '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14998082b0787b06bd',
            '7f07e7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
            '977837f0e37f14998082b0723b06bd', '7f07e7f0e37f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
            '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b0721',
            '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f1487f595b0b0bb0b6fb0722', '7f0e37f0e37f14898082b0723b02d5',
            '7ec967f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f1487f531b0b0bb0b6fb0722',
            '7f0e37f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
            '7f0e37f1487f531b0b0bb0b6fb0722', '7f0e37f0e37f14898082b072297c35', '7ec967f0e37f14998082b0787b06bd',
            '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e37f0e37f14898082b072297c35',
            '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
            '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f149b0723b0787b0721',
            '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14998082b0723b06bd',
            '7f07e7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722', '7f0e37f0e366aa89801eb072297c35',
            '7ec967f0e37f14998082b0723b06bd', '7f07e7f0e37f14998083b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
            '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14898082b0723b02d5', '7f07e7f0e37f14998082b0787b0721',
            '7f07e7f0e47f531b0723b0b6fb0722', '7f0e36665b66aa89801e9808297c35', '665f67f0e37f14898082b0723b02d5',
            '7ec967f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e36665b66a449801e9808297c35',
            '665f67f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
            '7f0e36665b66a449801e9808297c35', '665f67f0e37f14898082b072297c35', '7ec967f0e37f14998082b0787b06bd',
            '7f07e7f0e47f531b0723b0b6fb0721', '7f0e26665b66a449801e9808297c35', '665f67f0e37f1489801eb072297c35',
            '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722'],


        /**
         * 数字转中文速查表
         * @Array Of Property
         * @trans ['日','一','二','三','四','五','六','七','八','九','十']
         * @return Cn string
         */
        nStr1: ["\u65e5", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d", "\u4e03", "\u516b", "\u4e5d", "\u5341"],


        /**
         * 日期转农历称呼速查表
         * @Array Of Property
         * @trans ['初','十','廿','卅']
         * @return Cn string
         */
        nStr2: ["\u521d", "\u5341", "\u5eff", "\u5345"],


        /**
         * 月份转农历称呼速查表
         * @Array Of Property
         * @trans ['正','一','二','三','四','五','六','七','八','九','十','冬','腊']
         * @return Cn string
         */
        nStr3: ["\u6b63", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d", "\u4e03", "\u516b", "\u4e5d", "\u5341", "\u51ac", "\u814a"],


        /**
         * 返回农历y年一整年的总天数
         * @param lunar Year
         * @return Number
         * @eg:var count = calendar.lYearDays(1987) ;//count=387
         */
        lYearDays: function (y) {
            var i, sum = 348;
            for (i = 0x8000; i > 0x8; i >>= 1) { sum += (calendar.lunarInfo[y - 1900] & i) ? 1 : 0; }
            return (sum + calendar.leapDays(y));
        },


        /**
         * 返回农历y年闰月是哪个月；若y年没有闰月 则返回0
         * @param lunar Year
         * @return Number (0-12)
         * @eg:var leapMonth = calendar.leapMonth(1987) ;//leapMonth=6
         */
        leapMonth: function (y) { //闰字编码 \u95f0
            return (calendar.lunarInfo[y - 1900] & 0xf);
        },


        /**
         * 返回农历y年闰月的天数 若该年没有闰月则返回0
         * @param lunar Year
         * @return Number (0、29、30)
         * @eg:var leapMonthDay = calendar.leapDays(1987) ;//leapMonthDay=29
         */
        leapDays: function (y) {
            if (calendar.leapMonth(y)) {
                return ((calendar.lunarInfo[y - 1900] & 0x10000) ? 30 : 29);
            }
            return (0);
        },


        /**
         * 返回农历y年m月（非闰月）的总天数，计算m为闰月时的天数请使用leapDays方法
         * @param lunar Year
         * @return Number (-1、29、30)
         * @eg:var MonthDay = calendar.monthDays(1987,9) ;//MonthDay=29
         */
        monthDays: function (y, m) {
            if (m > 12 || m < 1) { return -1 }//月份参数从1至12，参数错误返回-1
            return ((calendar.lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29);
        },


        /**
         * 返回公历(!)y年m月的天数
         * @param solar Year
         * @return Number (-1、28、29、30、31)
         * @eg:var solarMonthDay = calendar.leapDays(1987) ;//solarMonthDay=30
         */
        solarDays: function (y, m) {
            if (m > 12 || m < 1) { return -1 } //若参数错误 返回-1
            var ms = m - 1;
            if (ms == 1) { //2月份的闰平规律测算后确认返回28或29
                return (((y % 4 == 0) && (y % 100 != 0) || (y % 400 == 0)) ? 29 : 28);
            } else {
                return (calendar.solarMonth[ms]);
            }
        },

        /**
         * 农历年份转换为干支纪年
         * @param  lYear 农历年的年份数
         * @return Cn string
         */
        toGanZhiYear: function (lYear) {
            var ganKey = (lYear - 3) % 10;
            var zhiKey = (lYear - 3) % 12;
            if (ganKey == 0) ganKey = 10;//如果余数为0则为最后一个天干
            if (zhiKey == 0) zhiKey = 12;//如果余数为0则为最后一个地支
            return calendar.Gan[ganKey - 1] + calendar.Zhi[zhiKey - 1];

        },

        /**
         * 公历月、日判断所属星座
         * @param  cMonth [description]
         * @param  cDay [description]
         * @return Cn string
         */
        toAstro: function (cMonth, cDay) {
            var s = "\u9b54\u7faf\u6c34\u74f6\u53cc\u9c7c\u767d\u7f8a\u91d1\u725b\u53cc\u5b50\u5de8\u87f9\u72ee\u5b50\u5904\u5973\u5929\u79e4\u5929\u874e\u5c04\u624b\u9b54\u7faf";
            var arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
            return s.substr(cMonth * 2 - (cDay < arr[cMonth - 1] ? 2 : 0), 2) + "\u5ea7";//座
        },


        /**
         * 传入offset偏移量返回干支
         * @param offset 相对甲子的偏移量
         * @return Cn string
         */
        toGanZhi: function (offset) {
            return calendar.Gan[offset % 10] + calendar.Zhi[offset % 12];
        },


        /**
         * 传入公历(!)y年获得该年第n个节气的公历日期
         * @param y公历年(1900-2100)；n二十四节气中的第几个节气(1~24)；从n=1(小寒)算起
         * @return day Number
         * @eg:var _24 = calendar.getTerm(1987,3) ;//_24=4;意即1987年2月4日立春
         */
        getTerm: function (y, n) {
            if (y < 1900 || y > 2100) { return -1; }
            if (n < 1 || n > 24) { return -1; }
            var _table = calendar.sTermInfo[y - 1900];
            var _info = [
                parseInt('0x' + _table.substr(0, 5)).toString(),
                parseInt('0x' + _table.substr(5, 5)).toString(),
                parseInt('0x' + _table.substr(10, 5)).toString(),
                parseInt('0x' + _table.substr(15, 5)).toString(),
                parseInt('0x' + _table.substr(20, 5)).toString(),
                parseInt('0x' + _table.substr(25, 5)).toString()
            ];
            var _calday = [
                _info[0].substr(0, 1),
                _info[0].substr(1, 2),
                _info[0].substr(3, 1),
                _info[0].substr(4, 2),

                _info[1].substr(0, 1),
                _info[1].substr(1, 2),
                _info[1].substr(3, 1),
                _info[1].substr(4, 2),

                _info[2].substr(0, 1),
                _info[2].substr(1, 2),
                _info[2].substr(3, 1),
                _info[2].substr(4, 2),

                _info[3].substr(0, 1),
                _info[3].substr(1, 2),
                _info[3].substr(3, 1),
                _info[3].substr(4, 2),

                _info[4].substr(0, 1),
                _info[4].substr(1, 2),
                _info[4].substr(3, 1),
                _info[4].substr(4, 2),

                _info[5].substr(0, 1),
                _info[5].substr(1, 2),
                _info[5].substr(3, 1),
                _info[5].substr(4, 2),
            ];
            return parseInt(_calday[n - 1]);
        },


        /**
         * 传入农历数字月份返回汉语通俗表示法
         * @param lunar month
         * @return Cn string
         * @eg:var cnMonth = calendar.toChinaMonth(12) ;//cnMonth='腊月'
         */
        toChinaMonth: function (m) { // 月 => \u6708
            if (m > 12 || m < 1) { return -1 } //若参数错误 返回-1
            var s = calendar.nStr3[m - 1];
            s += "\u6708";//加上月字
            return s;
        },


        /**
         * 传入农历日期数字返回汉字表示法
         * @param lunar day
         * @return Cn string
         * @eg:var cnDay = calendar.toChinaDay(21) ;//cnMonth='廿一'
         */
        toChinaDay: function (d) { //日 => \u65e5
            var s;
            switch (d) {
                case 10:
                    s = '\u521d\u5341'; break;
                case 20:
                    s = '\u4e8c\u5341'; break;
                    break;
                case 30:
                    s = '\u4e09\u5341'; break;
                    break;
                default:
                    s = calendar.nStr2[Math.floor(d / 10)];
                    s += calendar.nStr1[d % 10];
            }
            return (s);
        },


        /**
         * 年份转生肖[!仅能大致转换] => 精确划分生肖分界线是“立春”
         * @param y year
         * @return Cn string
         * @eg:var animal = calendar.getAnimal(1987) ;//animal='兔'
         */
        getAnimal: function (y) {
            return calendar.Animals[(y - 4) % 12]
        },


        /**
         * 传入公历年月日获得详细的公历、农历object信息 <=>JSON
         * @param y  solar year
         * @param m solar month
         * @param d  solar day
         * @return JSON object
         * @eg:console.log(calendar.solar2lunar(1987,11,01));
         */
        solar2lunar: function (y, m, d) { //参数区间1900.1.31~2100.12.31
            if (y < 1900 || y > 2100) { return -1; }//年份限定、上限
            if (y == 1900 && m == 1 && d < 31) { return -1; }//下限
            if (!y) { //未传参  获得当天
                var objDate = new Date();
            } else {
                var objDate = new Date(y, parseInt(m) - 1, d)
            }
            var i, leap = 0, temp = 0;
            //修正ymd参数
            var y = objDate.getFullYear(), m = objDate.getMonth() + 1, d = objDate.getDate();
            var offset = (Date.UTC(objDate.getFullYear(), objDate.getMonth(), objDate.getDate()) - Date.UTC(1900, 0, 31)) / 86400000;
            for (i = 1900; i < 2101 && offset > 0; i++) { temp = calendar.lYearDays(i); offset -= temp; }
            if (offset < 0) { offset += temp; i--; }

            //是否今天
            var isTodayObj = new Date(), isToday = false;
            if (isTodayObj.getFullYear() == y && isTodayObj.getMonth() + 1 == m && isTodayObj.getDate() == d) {
                isToday = true;
            }
            //星期几
            var nWeek = objDate.getDay(), cWeek = calendar.nStr1[nWeek];
            if (nWeek == 0) { nWeek = 7; }//数字表示周几顺应天朝周一开始的惯例
            //农历年
            var year = i;

            var leap = calendar.leapMonth(i); //闰哪个月
            var isLeap = false;

            //效验闰月
            for (i = 1; i < 13 && offset > 0; i++) {
                //闰月
                if (leap > 0 && i == (leap + 1) && isLeap == false) {
                    --i;
                    isLeap = true; temp = calendar.leapDays(year); //计算农历闰月天数
                }
                else {
                    temp = calendar.monthDays(year, i);//计算农历普通月天数
                }
                //解除闰月
                if (isLeap == true && i == (leap + 1)) { isLeap = false; }
                offset -= temp;
            }

            if (offset == 0 && leap > 0 && i == leap + 1)
                if (isLeap) {
                    isLeap = false;
                } else {
                    isLeap = true; --i;
                }
            if (offset < 0) { offset += temp; --i; }
            //农历月
            var month = i;
            //农历日
            var day = offset + 1;

            //天干地支处理
            var sm = m - 1;
            var gzY = calendar.toGanZhiYear(year);

            //月柱 1900年1月小寒以前为 丙子月(60进制12)
            var firstNode = calendar.getTerm(year, (m * 2 - 1));//返回当月「节」为几日开始
            var secondNode = calendar.getTerm(year, (m * 2));//返回当月「节」为几日开始

            //依据12节气修正干支月
            var gzM = calendar.toGanZhi((y - 1900) * 12 + m + 11);
            if (d >= firstNode) {
                gzM = calendar.toGanZhi((y - 1900) * 12 + m + 12);
            }

            //传入的日期的节气与否
            var isTerm = false;
            var Term = null;
            if (firstNode == d) {
                isTerm = true;
                Term = calendar.solarTerm[m * 2 - 2];
            }
            if (secondNode == d) {
                isTerm = true;
                Term = calendar.solarTerm[m * 2 - 1];
            }
            //日柱 当月一日与 1900/1/1 相差天数
            var dayCyclical = Date.UTC(y, sm, 1, 0, 0, 0, 0) / 86400000 + 25567 + 10;
            var gzD = calendar.toGanZhi(dayCyclical + d - 1);
            //该日期所属的星座
            var astro = calendar.toAstro(m, d);

            return { 'lYear': year, 'lMonth': month, 'lDay': day, 'Animal': calendar.getAnimal(year), 'IMonthCn': (isLeap ? "\u95f0" : '') + calendar.toChinaMonth(month), 'IDayCn': calendar.toChinaDay(day), 'cYear': y, 'cMonth': m, 'cDay': d, 'gzYear': gzY, 'gzMonth': gzM, 'gzDay': gzD, 'isToday': isToday, 'isLeap': isLeap, 'nWeek': nWeek, 'ncWeek': "\u661f\u671f" + cWeek, 'isTerm': isTerm, 'Term': Term, 'astro': astro };
        },


        /**
         * 传入公历年月日以及传入的月份是否闰月获得详细的公历、农历object信息 <=>JSON
         * @param y  lunar year
         * @param m lunar month
         * @param d  lunar day
         * @param isLeapMonth  lunar month is leap or not.
         * @return JSON object
         * @eg:console.log(calendar.lunar2solar(1987,9,10));
         */
        lunar2solar: function (y, m, d, isLeapMonth) {   //参数区间1900.1.31~2100.12.1
            var leapOffset = 0;
            var leapMonth = calendar.leapMonth(y);
            var leapDay = calendar.leapDays(y);
            if (isLeapMonth && (leapMonth != m)) { return -1; }//传参要求计算该闰月公历 但该年得出的闰月与传参的月份并不同
            if (y == 2100 && m == 12 && d > 1 || y == 1900 && m == 1 && d < 31) { return -1; }//超出了最大极限值
            var day = calendar.monthDays(y, m);
            if (y < 1900 || y > 2100 || d > day) { return -1; }//参数合法性效验

            //计算农历的时间差
            var offset = 0;
            for (var i = 1900; i < y; i++) {
                offset += calendar.lYearDays(i);
            }
            var leap = 0, isAdd = false;
            for (var i = 1; i < m; i++) {
                leap = calendar.leapMonth(y);
                if (!isAdd) {//处理闰月
                    if (leap <= i && leap > 0) {
                        offset += calendar.leapDays(y); isAdd = true;
                    }
                }
                offset += calendar.monthDays(y, i);
            }
            //转换闰月农历 需补充该年闰月的前一个月的时差
            if (isLeapMonth) { offset += day; }
            //1900年农历正月一日的公历时间为1900年1月30日0时0分0秒(该时间也是本农历的最开始起始点)
            var stmap = Date.UTC(1900, 1, 30, 0, 0, 0);
            var calObj = new Date((offset + d - 31) * 86400000 + stmap);
            var cY = calObj.getUTCFullYear();
            var cM = calObj.getUTCMonth() + 1;
            var cD = calObj.getUTCDate();

            return calendar.solar2lunar(cY, cM, cD);
        }
    };

    return calendar;
})();


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
            '# if(data.weekday && data.weekday !==0){ #' +
            '<button data-value="0" class="btn-cancel btn btn-default btn-xs">撤销设置</button>' +
            '# } #' +
            '# if(data.weekday !==1){ #' +
            '<button data-value="1" class="btn-cancel btn btn-default btn-xs">设为工作日</button>' +
            '# } #' +
            '# if(data.weekday !==2){ #' +
            '<button data-value="2" class="btn-cancel btn btn-default btn-xs">设为休息日</button>' +
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
