(function($) {
    $.fn.scheduleview = function(options) {
        // Establish our default settings
        var settings = $.extend({
            schedules: [],
            selected: "",
            onlySelected: false,
            hidestars: false,
            src_prefix: '',
        toggle: function(elementId, imgStarId) {
            var src;
            var rnd = new Date().getTime();
            if ($('#' + imgStarId).hasClass('selected')) {
                $('#' + imgStarId).removeClass('selected')
                src = 'js/jquery-scheduleview/images/gray-star.png?' + rnd;
                $('#' + imgStarId).attr('src', src)
            } else {
                $('#' + imgStarId).addClass('selected')
                src = 'js/jquery-scheduleview/images/yellow-star.png?' + rnd;
                $('#' + imgStarId).attr('src', src)
            }
        }
        }, options);

        String.prototype.repeat = function(num) {
            return new Array(num + 1).join(this);
        }

        return this.each(function() {
            window['scheduleViewSelect'] = settings.toggle;

            var items = settings.schedules;
            var itemSelected = false;

            items.sort(function(a, b) {
                var blank = ' '
                var str1 = (a.where + blank.repeat(1024)).substr(0, 1024) + a.date + a.hour;
                var str2 = (b.where + blank.repeat(1024)).substr(0, 1024) + b.date + b.hour + b.where;
                if (str1 == str2)
                    return 0;
                else if (str1 < str2)
                    return -1;
                else if (str1 > str2)
                    return 1;
            });

            var where_images = {}
            var counters = [];
            counters['where'] = [];
            counters['dates'] = [];
            for (var k in items) {
                var el = items[k]
                
                itemSelected = false;
                if ((',' + settings.selected + ',').indexOf(',' + el.id + ',') > -1) {
                    itemSelected = true;
                }
                
                
                if ( el.image != '') {
                    where_images[el.where] = settings.src_prefix + el.image;
                }
                
                
                if ( settings.onlySelected == true && itemSelected == true) {
                    if ( counters['where'][el.where]) {
                        counters['where'][el.where] += 1;
                    } else {
                        counters['where'][el.where] = 1;
                    }
                     if ( counters['dates'][el.date]) {
                        counters['dates'][el.date] += 1;
                    } else {
                        counters['dates'][el.date] = 1;
                    }
                }
                
                
            }

            var lastDate = ''
            var lastWhere = ''
            for (var k in items) {
                var el = items[k]
                var hour = el.hour;

                if (lastWhere != el.where && el.where != '') {
                    var bgstyle = ''
                    if (where_images[el.where]!=undefined) bgstyle ='style="height: 128px; background: transparent url('+ where_images[el.where] +') no-repeat center center ;-webkit-background-size: cover; -moz-background-size: cover;-o-background-size: cover; background-size: cover;"';
                    var item = '<div id="where-' + k + '" class="schedule-where" '+bgstyle+'><div style="background-color: #333333; opacity: 0.7;color: #ffffff; top: 0px; height: 40px; font-size: large; vertical-align: middle;">' + el.where + '</div></div>'
                    if ( settings.onlySelected != true || settings.onlySelected == true&& counters['where'][el.where] > 0) {
                        $(this).append(item)
                    }
                    lastWhere = el.where;
                    lastDate = '';
                }

                if (lastDate != el.date) {
                    var item = '<div id="date-' + k + '" class="schedule-date"><strong>' + el.date + '</strong></div>'
                    if ( settings.onlySelected != true || settings.onlySelected == true && counters['dates'][el.date] > 0) {
                        $(this).append(item)
                    }
                    lastDate = el.date;
                }

                var rnd = new Date().getTime();
                var src = 'js/jquery-scheduleview/images/gray-star.png?' + rnd;
                var starClass = ''
                itemSelected = false;
                if ((',' + settings.selected + ',').indexOf(',' + el.id + ',') > -1) {
                    src = 'js/jquery-scheduleview/images/yellow-star.png?' + rnd;
                    starClass = 'class="selected"';
                    itemSelected = true;
                }

                item = '<table class="schedule-table">';
                item += '<tr>';
                item += '<td class="first"><strong>' + hour + '</strong></td>';
                item += '<td># ' + +el.id + ' - ' + el.html + '</td>';
                if ( !settings.hidestars) {
                    item += '<td class="star"><img id="schedule-star-' + el.id + '" src="' + src + '"  ' + starClass + '/></td>';
                }
                item += '</tr>';
                item += '</table>';
                
                if (settings.onlySelected != true || itemSelected == true && settings.onlySelected == true) {
                    $(this).append(item);
                }
                if ( !settings.hidestars) {
                    $('#schedule-star-' + el.id).click(function() {
                        var imgStarId = this.id;
                        var elementId = imgStarId.replace('schedule-star-', '')
                        scheduleViewSelect(elementId, imgStarId)
                    });
                }
                

            } // fin boucle for


        });
    };
}(jQuery));

