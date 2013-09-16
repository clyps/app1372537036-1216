var _appStorageID = 'clyps.storage'
var _appConfig = {}
var _currentPage = 'homepage'
var _pageTitles = []
var _homepageLayoutInfos = []
var _modulesConfig = [{}]
var _appModuleCount = 0;
var _zoomLevelMin = 1;
var _zoomLevelMax = 5;
var _zoomLevel = _zoomLevelMin;

var _gaPlugin;


/*
 var _modulesNames = ['myselection','sponsors','infos','exhibitors','conferences'
 ,'lastminute','news','plans','search','settings','speakers','specials'
 ,'stats','vipzone']
 */
var _modulesNames = ['myselection', 'infos', 'sponsors', 'exhibitors', 'conferences'
            , 'news', 'plans', 'settings', 'speakers', 'schedule']

var _myselectionModules = "sponsors,conferences,speakers,lastminute,news,exhibitors,specials,vipzone,schedule"

var _modulesHeaders = [[]]

_modulesHeaders['conferences'] = ['id', 'category', 'title', 'description', 'date_begin', 'date_end', 'country', 'city', 'state_province', 'address', 'code_postal', 'image', 'category_image']
_modulesHeaders['exhibitors'] = _modulesHeaders['conferences']
_modulesHeaders['speakers'] = _modulesHeaders['conferences']
_modulesHeaders['news'] = _modulesHeaders['conferences']
_modulesHeaders['sponsors'] = _modulesHeaders['sponsors']
_modulesHeaders['schedule'] = ['id', 'where', 'date', 'hour', 'html', 'image']

_pageTitles['myselection'] = 'My selection'
_pageTitles['infos'] = 'General infos'
_pageTitles['sponsors'] = 'Sponsors'
_pageTitles['exhibitors'] = 'Exhibitors'
_pageTitles['conferences'] = 'Conferences'
_pageTitles['lastminute'] = 'last minute !'
_pageTitles['news'] = 'News'
_pageTitles['plans'] = 'Plans'
_pageTitles['search'] = 'Search'
_pageTitles['settings'] = 'Settings'
_pageTitles['speakers'] = 'Speakers'
_pageTitles['specials'] = 'Specials'
_pageTitles['stats'] = 'Stats'
_pageTitles['vipzone'] = 'VIP zone'
_pageTitles['schedule'] = 'Program'

if (!window.console)
    window.console = {};
if (!window.console.log)
    window.console.log = function() {
    };

window.onLoad = function() {

    $(function() {
        document.addEventListener("deviceready", onDeviceReady, false);
        
        if ( true) {
            _gaPlugin = window.plugins.gaPlugin;
            _gaPlugin.init(function(){
                alert('GA SUCCESS')
            }, function(){
                alert('GA Error')
            }, "UA-44050486-1", 10);
        }
        

        $.ajaxSetup({
            error: function(jqXHR, exception) {
                if (jqXHR.status === 0) {
                    alert('Not connect.\n Verify Network.');
                } else if (jqXHR.status == 404) {
                    //console.log('Requested page not found. [404]');
                } else if (jqXHR.status == 500) {
                    alert('Internal Server Error [500].');
                } else if (exception === 'parsererror') {
                    alert('Requested JSON parse failed.');
                } else if (exception === 'timeout') {
                    alert('Time out error.');
                } else if (exception === 'abort') {
                    alert('Ajax request aborted.');
                } else {
                    alert('Uncaught Error.\n' + jqXHR.responseText);
                }
            }
        });

        for (var k in _modulesNames) {
            var moduleid = _modulesNames[k]
            getModuleInfos(moduleid)
        }

        showPage('homepage')
        updateStyles(true)
    });
}


function showActions() {
    // console.log('showActions *** height = ', $('#actions').height(), ' | is visible *** ', $('#actions').is(':visible'))
    var height = 50 * _appModuleCount;
    
    if ($('#actions').height() < height || !$('#actions').is(':visible')) {
        var items = []
        var list = []
        list = _appConfig.modules.split(',')
        var j = 0;
        for (var k in list) {
            var moduleid = list[k]
            if (moduleid.length > 0 && _modulesNames.indexOf(moduleid) > -1) {
                var obj = {
                    "id": moduleid,
                    "title": _pageTitles[moduleid],
                    "image": "images/modules/" + moduleid + ".png"
                }
                items.push(obj)
                j++;
            }
        }
        _appModuleCount = j;

        var options = {
            items: items,
            "type": '',
            itemCallback: function(item, index) {
                var rnd = new Date().getTime();

                var html = ''
                html += '<img src="' + item.image + '?' + rnd + '" class="icon"/> ' + item.title;
                return html
            },
            "click": 'showPage',
            "selectedKey": "",
            "pagination": true,
            "cols3": true,
            "pgPosition": 'top',
            "txtcolor": _appConfig.txtcolor,
            "txtbgcolor": _appConfig.txtbgcolor,
            "bgcolor": _appConfig.bgcolor,
            "titlecolor": _appConfig.titlecolor,
            "count": _appModuleCount
        };
        height = 50 * _appModuleCount;
        $('#actions').listview(options).show().animate({
            height: height
        })
    } else {
        $('#actions').animate({
            height: 0
        }).hide(500)
    }
}

function homepageModule() {
    var rnd = new Date().getTime();
    $.ajax({
        url: "app-config.json?" + rnd,
        cache: false,
        dataType: "json",
        async: true,
        success: function(data) {
            _appConfig = data
            debugLocalStorage()

            $('#footer').css('color', _appConfig.txtcolor)
            $('#footer').css('background-color', 'transparent')
            $('#appTitle').css('color', _appConfig.txtcolor).html(_appConfig.title)
            $('#appDates').html('from ' + _appConfig.event_date_begin + '<br/>to ' + _appConfig.event_date_end).css('color', _appConfig.txtcolor)
            $('#appTitle').css('text-align', _appConfig.eventtitlealign)
            $('#appDates').css('text-align', _appConfig.eventtitlealign)

            var items = []
            var list = []
            list = _appConfig.modules.split(',')
            var j = 0;
            for (var k in list) {
                var moduleid = list[k]
                if (moduleid.length > 0 && _modulesNames.indexOf(moduleid) > -1) {
                    var obj = {
                        "id": moduleid,
                        "title": _pageTitles[moduleid],
                        "image": "images/modules/" + moduleid + ".png"
                    }
                    items.push(obj)
                    j++;
                }
            }
            _appModuleCount = j;

            var options = {
                items: items,
                "type": '',
                itemCallback: function(item, index) {
                    var rnd = new Date().getTime();

                    var html = ''
                    html += '<img src="' + item.image + '?' + rnd + '" class="icon"/> '+ item.title;
                    return html
                },
                "click": 'showPage',
                "selectedKey": "",
                "pagination": true,
                "cols3": true,
                "pgPosition": 'top',
                "txtcolor": _appConfig.txtcolor,
                "txtbgcolor": _appConfig.txtbgcolor,
                "bgcolor": _appConfig.bgcolor,
                "titlecolor": _appConfig.titlecolor,
                "count": _appModuleCount
            };
            $('#actions').listview(options);
        }
    });


}
function myselectionModule() {
    var html = ''
    var list = _appConfig.modules.split(/,/)
    var settings = appstoage()
    var mysel = {}
    $('#myselectionModule').html('<div id="myselection-content" class="panel"></div>')
    for (var k in list) {
        var module = list[k]
        if (_myselectionModules.indexOf(module) > -1) {
            html = ''
            html += '<h2 onclick="jQuery(\'#myselection_' + module + '\').toggle()" style="cursor: pointer;"><img src="images/modules/' + module + '.png" width="24" height="24"/>&nbsp;'
            html += _pageTitles[module]
            html += '</h2>'
            html += '<div id="myselection_' + module + '" class="hide">'
            html += 'No selection'
            html += '</div>'
            $('#myselection-content').append(html)

            if (settings) {
                mysel = settings.myselection
                if (mysel && module != 'schedule') {
                    if (mysel[module]) {
                        if (Object.keys(mysel[module]).length > 0) {
                            var options = {
                                items: mysel[module],
                                "type": $.listview.SIMPLE,
                                "click": 'detailsModule',
                                "clickParams": ['category', module, 'myselection'],
                                "selectedKey": "",
                                "category": '',
                                "pagination": false,
                                "pgPosition": 'top'
                            };
                            $('#myselection_' + module).listview(options);
                        }
                    }
                } else if ( module == 'schedule') {
                    $('#myselection_' + module).empty();
                    scheduleModule('#myselection_' + module, {
                        hidestars: true,
                        onlyselected: true
                    });
                }
            }
        }
    }

}
function infosModule() {
    $('#infos-content').html(_appConfig.evntinfos)
    updateStyles(true)
}

function scheduleModule(selector,paramOpts) {
    var opts = {
        onlySelected: false,
        hidestars: false
    }
    opts = $.extend({},opts,paramOpts);
    var target = '#schedule-content';
    if (selector) target =selector;
    var moduleid = 'schedule'
    var rnd = new Date().getTime();
    $.ajax({
        url: "data/" + moduleid + ".csv?"+rnd,
        cache: false,
        dataType: "text",
        async: true,
        success: function(data) {
            var settings = appstoage()
            var selected_list = ''
            if (settings) {
                var scheddule = settings.scheddules
                if ( scheddule) {
                    selected_list = scheddule.join(',');
                }
            }

            var items = CSVToArrayOfObjects(data, _modulesHeaders[moduleid], '|');
            var options = {
                schedules: items,
                selected: selected_list,
                onlySelected: opts.onlySelected,
                hidestars: opts.hidestars,
                src_prefix: 'data/',
                toggle: function(elementId, imgStarId) {
                    var src;
                    var rnd = new Date().getTime();
                    var settings = appstoage()
                    
                    if ($('#' + imgStarId).hasClass('selected')) {
                        $('#' + imgStarId).removeClass('selected')
                        src = 'js/jquery-scheduleview/images/gray-star.png?' + rnd;
                        $('#' + imgStarId).attr('src', src)
                         
                        if ( settings.scheddules) {
                            var index = settings.scheddules.indexOf(elementId);
                            settings.scheddules.splice(index, 1);
                            appstoage(settings,true);
                        }
                    } else {
                        $('#' + imgStarId).addClass('selected')
                        src = 'js/jquery-scheduleview/images/yellow-star.png?' + rnd;
                        $('#' + imgStarId).attr('src', src)
                        
                        if ( settings.scheddules) {
                            settings.scheddules.push(elementId)
                        } else {
                            settings.scheddules = [elementId]
                        }
                        appstoage(settings,true);
                    }
                }
            }
            $(target).scheduleview(options)
        }
    });
}

function listView(moduleid, categoryid, category) {
    $('#' + moduleid + 'Module').show()
    $('#' + moduleid + 'Module .subpage').addClass('hide')
    $('#listIcon,#detailsModule').hide()

    if (_modulesConfig[moduleid] == undefined) {
        return
    }

    if (category == undefined && _modulesConfig[moduleid].categories_count > 1) {
        $.ajax({
            url: "data/" + moduleid + "-config.json",
            cache: false,
            dataType: "text",
            async: true,
            success: function(data) {
                var categories = $.evalJSON(data).categories

                var options = {
                    items: categories,
                    "type": $.listview.TILES,
                    /*"click": function() {
                     alert('category')
                     }, */
                    click: window[moduleid + 'Module'],
                    "clickParams": ['title'],
                    "selectedKey": "",
                    "pagination": true,
                    "pgPosition": 'bottom',
                    "txtcolor": _appConfig.listtxtcolor,
                    "txtbgcolor": _appConfig.listtxtbgcolor,
                    "bgcolor": _appConfig.bgcolor,
                    "titlecolor": _appConfig.titlecolor,
                    /*"sort":"title asc",
                     "listPosition": 'top', */
                    "count": 6
                };
                $('#' + moduleid + '-categories').listview(options)
                $('#' + moduleid + '-subpage-categories').removeClass('hide')
            }
        });
    } else if (_modulesConfig[moduleid].count > 0) {
        if (_modulesConfig[moduleid].categories_count == 1) {
            for (var i in _modulesConfig[moduleid].categories) {
                category = _modulesConfig[moduleid].categories[i].title;
                break;
            }
        }
        $.ajax({
            url: "data/" + moduleid + ".csv",
            cache: false,
            dataType: "text",
            async: true,
            success: function(data) {
                var items = CSVToArrayOfObjects(data, _modulesHeaders[moduleid], '|')
                var options = {
                    items: items,
                    "type": $.listview.SIMPLE,
                    itemCallback: function(item, index) {
                        var rnd = new Date().getTime();
                        var classFav = ''
                        classFav = getFavClass(moduleid, item.id)
                        var html = ''
                        html += '<table width="100%" border="0"><tr>'
                        html += '<td width="1%"><img class="picto" src="' + item.image + '?' + rnd + '" /></td>'
                        html += '<td>'
                        html += '<a title="App ID: ' + item.id + '" ><strong>' + $.listview.truncateString(item.title) + '</strong></a></br>'
                        html += '<a title="App ID: ' + item.id + '" >' + $.listview.truncateString(item.description, 40) + '</a>'
                        html += '</td>'
                        html += '<td width="16">'
                        html += '<div id="addmysel-' + moduleid + '-' + item.id + '" class="addmysel ' + (classFav != 'addmysel' ? 'hide' : '') + '" onclick="addToMyselection(\'' + moduleid + '\',\'' + item.id + '\')"><img class="" width="24" height="24" border="0" src="images/icons/gray-star.png"/></div>'
                        html += '<div id="delmysel-' + moduleid + '-' + item.id + '" class="delmysel ' + (classFav != 'delmysel' ? 'hide' : '') + '" onclick="addToMyselection(\'' + moduleid + '\',\'' + item.id + '\',true)"><img class="" width="24" height="24" border="0" src="images/icons/yellow-star.png"/></div>'
                        html += '</td>'
                        html += '</tr></table>'
                        return html
                    },
                    "click": 'detailsModule',
                    "clickParams": ['category', moduleid],
                    "selectedKey": "",
                    "category": category,
                    "pagination": false,
                    "txtcolor": _appConfig.listtxtcolor,
                    "txtbgcolor": _appConfig.listtxtbgcolor,
                    "bgcolor": _appConfig.bgcolor,
                    "titlecolor": _appConfig.titlecolor,
                    "sort": "title asc",
                    "search": true,
                    "searchSelector": '#' + moduleid + 'Module .search-container'
                };
                $('#' + moduleid + '-items').listview(options)
                $('#' + moduleid + '-category').html(category)
                if (categoryid != undefined)
                    $('#listIcon').show()
                $('#listIcon').attr('onclick', moduleid + 'Module()')
                $('#' + moduleid + '-subpage-items').removeClass('hide')
            }
        });
    } else {
        alert('No data found')
    }
}


function detailsModule(id, category, moduleid, origin) {
    var rnd = new Date().getTime();
    $('#detailsModule').load('templates/' + moduleid + '-details.html?' + rnd, function() {
        if (origin == 'myselection') {
            $('#' + moduleid + 'Module,#myselectionModule').hide()
            $('#listIcon').show()
            $('#listIcon').attr('onclick', 'backToPage(\'myselection\')')
        } else {
            $('#' + moduleid + 'Module').hide()
            $('#listIcon').show() // moduleid, categoryid, category
            $('#listIcon').attr('onclick', moduleid + 'Module( \'' + moduleid + '\', \'' + category.replace("'", "\\'") + '\');')
        }
        $.ajax({
            url: "data/" + moduleid + ".csv",
            cache: false,
            dataType: "text",
            async: true,
            success: function(data) {
                var items = CSVToArrayOfObjects(data, _modulesHeaders[moduleid], '|')
                for (var k in items) {
                    var item = items[k]
                    if (item.id == id) {
                        $.populate({
                            prefix: '#' + moduleid + '-',
                            item: item
                        })
                        updateStyles(true)
                        $('.addmysel.details').each(function(item, index) {
                            $(this).attr('id', 'details-addmysel-' + moduleid + '-' + id)
                        })
                        $('.delmysel.details').each(function(item, index) {
                            $(this).attr('id', 'details-delmysel-' + moduleid + '-' + id)
                        })
                        toggleFavLink(moduleid, id)
                        break;
                    }
                }
            }
        });

        $(this).show()
    });
}

function toggleFavLink(moduleid, id) {
    var mysel = appstoage() //.myselection
    if (mysel) {
        if (mysel.myselection) {
            mysel = mysel.myselection
            if (mysel[moduleid]) {
                if (mysel[moduleid][id]) {
                    $('#addmysel-' + moduleid + '-' + id).hide()
                    $('#delmysel-' + moduleid + '-' + id).show()
                    $('#details-addmysel-' + moduleid + '-' + id).hide()
                    $('#details-delmysel-' + moduleid + '-' + id).show()
                    return
                }
            }
        }
    }
    $('#addmysel-' + moduleid + '-' + id).show()
    $('#delmysel-' + moduleid + '-' + id).hide()
    $('#details-addmysel-' + moduleid + '-' + id).show()
    $('#details-delmysel-' + moduleid + '-' + id).hide()
}

function getFavClass(moduleid, id) {
    var mysel = appstoage()
    if (mysel) {
        if (mysel.myselection) {
            mysel = mysel.myselection
            if (mysel[moduleid]) {
                if (mysel[moduleid][id]) {
                    return 'delmysel'
                } else {
                    return 'addmysel'
                }
            }
        }
    }
    return 'addmysel'
}


function conferencesModule(categoryid, category) {
    listView('conferences', categoryid, category)
}

function exhibitorsModule(categoryid, category) {
    listView('exhibitors', categoryid, category)
}
function speakersModule(categoryid, category) {
    listView('speakers', categoryid, category)
}
function lastminuteModule() {

}
function newsModule(categoryid, category) {
    listView('news', categoryid, category)
}
function sponsorsModule(categoryid, category) {
    listView('sponsors', categoryid, category)
}
function plansModule() {
    var list = _appConfig.plans.split(/,/)
    var rnd = new Date().getTime();
    var html = ''
    var str = 'check_planImg'
    var n = str.length

    $('#listIcon').hide()
    for (var k in list) {
        var planid = list[k]
        var src = 'data/thumb_img_plan' + planid.substr(n) + '.png' + '?' + rnd
        html += '<div style="padding: 4px; width: 128px; min-height: 150px; float: left; text-align: center;">'
        html += '<h3>Level #' + planid.substr(n) + '</h3>'
        html += '<img border="0" onclick="planDetails( ' + planid.substr(n) + ' )" src="' + src + '" width="128" />'
        html += '</div>'
    }
    $('#plans-container').html(html)
}
function searchModule() {

}
function ratingsModule() {

}
function specialsModule() {

}
function vipzoneModule() {

}
function statsModule() {

}
function settingsModule() {

}

function CSVToArrayOfObjects(strData, fieldsNames, delimiter) {
    var strDelimiter = (delimiter || ",");
    var allTextLines = strData.split(/\r\n|\n/);
    var headers = fieldsNames; //allTextLines[0].split(',');
    var lines = [];

    if (headers == undefined) {
        console.log('NO_HEADERS_FOR_CSV_FILE')
        return '';
    }

    for (var i = 0; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(strDelimiter);
        if (data.length == headers.length) {

            var tarr = [];
            tarr["id"] = i
            for (var j = 0; j < headers.length; j++) {
                tarr[headers[j]] = data[j]
            }
            lines.push(tarr);
        }
    }
    return(lines);
}

function getModuleInfos(moduleid) {
    $.ajax({
        url: 'data/' + moduleid + '-config.json',
        cache: false,
        dataType: "text",
        async: true,
        success: function(data) {
            _modulesConfig[moduleid] = $.evalJSON(data)
        }
    });
}

function backToPage(pageName) {
    $('.page,#header,#footer,#homepageModule,#actions,#listIcon').hide()
    $('#pageTitle').html(_pageTitles[pageName])
    $('#' + pageName + 'Module').show()
    if (pageName != 'homepage') {
        $('#header').show();
    } else {
        $('#footer,#header').show();
    }
    _currentPage = pageName
}

function showPage(pageName, param1, param2) {
    $(function() {
        //allowZoom(false)
        //touchScroll(pageName)
        
        if ( true) {
            _gaPlugin.trackEvent( function(){
                // alert('GA SUCCESS')
            }, function(){
                // alert('GA SUCCESS')
            }, pageName+"Page", "showPage", _pageTitles[pageName], 1);
        }
        

        $('#' + _currentPage + 'Module').hide() //fadeOut(2000)

        if (typeof window[pageName + 'Module'] == 'function') {
            $('.page,#header,#footer,#homepage,#actions').hide()
            window[pageName + 'Module'](param1, param2)
            $('#pageTitle').html(_pageTitles[pageName])

            $('#' + pageName + 'Module').fadeIn(800)

            if (pageName != 'homepage') {
                $('#header').show();
            } else {
                //$('#homepage').hide();
                $('#footer,#header').show();
            }
            _currentPage = pageName
            updateStyles(true)
        } else {
            console.log(pageName + ' module does not exist.')
        }
    });
}

function loadItem(moduleid, id, callback) {
    $.ajax({
        url: "data/" + moduleid + ".csv",
        cache: false,
        dataType: "text",
        async: true,
        success: function(data) {
            var items = CSVToArrayOfObjects(data, _modulesHeaders[moduleid], '|')
            for (var k in items) {
                var item = $.extend({}, items[k])
                if (item.id == id) {
                    item.moduleid = moduleid
                    if (typeof callback == 'function') {
                        callback(item, id)
                    } else if (typeof window[callback] == 'function') {
                        window[callback](item, id)
                    }
                    break;
                }
            }
        }
    });
}
function stopEventPropagation() {
    if (event.stopPropagation) {
        event.stopPropagation()
    } else if (window.event) {
        window.event.cancelBubble = true
    }
}
function addToMyselection(moduleid, itemid, removeFlag) {
    var data = {}
    stopEventPropagation()
    if (removeFlag) {
        data = appstoage()
        if (data) {
            delete data.myselection[moduleid][itemid]
            appstoage(data, true)
            toggleFavLink(moduleid, itemid)
        }
        return
    }
    loadItem(moduleid, itemid, function(item, id) {
        data = {
            myselection: {}
        }
        data.myselection[moduleid] = {}
        data.myselection[moduleid][id] = item
        data = appstoage(data)
        toggleFavLink(moduleid, id)
    })

}

function clearStorage() {
    // window.localStorage.clear()
    localStorage.removeItem(_appConfig.id + '.' + _appStorageID);
}

function appstoage(data, force) {
    var results = {};
    if (typeof(data) == 'object') {
        if (force == true) {
            results = data
            window.localStorage.setItem(_appConfig.id + '.' + _appStorageID, escape($.toJSON(results)));
        } else {
            results = $.evalJSON(unescape(window.localStorage.getItem(_appConfig.id + '.' + _appStorageID)));
            if (results == null || results == undefined) {
                results = {}
            }
            results = $.deepextend(results, data)
            window.localStorage.setItem(_appConfig.id + '.' + _appStorageID, escape($.toJSON(results)));
        }
    } else {
        results = $.evalJSON(unescape(localStorage.getItem(_appConfig.id + '.' + _appStorageID)));
    }
    return results;
}

function updateStyles(homepageNoRefresh) {
    var rnd = new Date().getTime();
    $('body').attr('style', 'background-image: url(images/bg.png?' + rnd + ');')
    $('#mainIcon').attr('src', 'icon.png?' + rnd)
    $('ul li.selected *').css('color', _appConfig.listtxtbgcolor);
    $('ul li.selected *').css('background-color', _appConfig.listtxtcolor);
    $('.page').css('color', _appConfig.txtcolor)
    $('.page .panel').css('background-color', _appConfig.panelbgcolor)
    $('.page a').css('color', _appConfig.linkcolor)
    $('.page h2').css('color', _appConfig.titlecolor)
    if (homepageNoRefresh != true) {
        homepageModule()
    }
}


function reloadPage(key, value) {
    if (key && typeof(key) == 'string') {
        console.log("reloadPage() : key = ", key, " | value = ", value)
        _appConfig[key] = value
        showPage(_currentPage)
    } else {
        console.log("RELOAD APPCONF -> reloadPage() : key = ", key, " | value = ", value)
        var rnd = new Date().getTime();
        $.ajax({
            url: "app-config.json?" + rnd,
            cache: false,
            dataType: "json",
            async: true,
            success: function(data) {
                _appConfig = data
                showPage(_currentPage)
            }
        })
    }
}

function debugLocalStorage() {
    console.log('APP - debugLocalStorage()')
    console.log('_appConfig - id = ', _appConfig.id, ' | ', _appConfig)
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i)
        var val = ''
        try {
            val = $.evalJSON(unescape(localStorage.getItem(key)))
        } catch (e) {
            val = localStorage.getItem(key)
        }
        console.log('key = ', key, ' | value = ', val)
    }
    console.log('APP - End - debugLocalStorage()')
}

function allowZoom(flag) {
    if (flag == true) {
        $('head meta[name=viewport]').remove();
        $('head').prepend('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=10.0, minimum-scale=1, user-scalable=1" />');
    } else {
        $('head meta[name=viewport]').remove();
        $('head').prepend('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=0" />');
    }
}

function zoomIn() {
    if (_zoomLevelMin <= _zoomLevel && _zoomLevel < _zoomLevelMax) {
        _zoomLevel += 1
        $('#zoomablePlan').animate({
            'zoom': _zoomLevel
        }, 400);
    } else {
        $('#zoomablePlan').animate({
            'zoom': _zoomLevelMin
        }, 400);
        _zoomLevel = _zoomLevelMin
    }

}
function zoomOut() {
    if (_zoomLevelMin < _zoomLevel && _zoomLevel <= _zoomLevelMax) {
        _zoomLevel -= 1
        $('#zoomablePlan').animate({
            'zoom': _zoomLevel
        }, 400);
    } else {
        $('#zoomablePlan').animate({
            'zoom': _zoomLevelMin
        }, 400);
        _zoomLevel = _zoomLevelMin
    }

}

function planDetails(planid) {
    _zoomLevel = 1
    var rnd = new Date().getTime();
    var moduleid = 'plans'
    var sWidth = $(document).width();
    var sHeight = $(document).height();
    var style = 'width: ' + (sWidth - 24) + 'px; height: ' + (sHeight - 110) + 'px; '
    var html = '<div style="text-align: center; width: 100%;"><img onclick="zoomOut()" src="images/icons/zoomout.png" width="48" height="48"/>&nbsp;&nbsp;';
    html += '<img onclick="zoomIn()" src="images/icons/zoomin.png" width="48" height="48"/></div>';
    html += '<div class="zoomPlan" style="' + style + '"><img id="zoomablePlan" src="data/img_plan' + planid + '.png"  width="' + (sWidth - 24) + '" /></div>'

    $('#listIcon').show() // moduleid, categoryid, category
    $('#listIcon').attr('onclick', 'showPage(\'' + moduleid + '\')')

    $('#' + moduleid + '-container').html(html)
    allowZoom(true)
    //$('#zoomablePlan').bind('dblclick doubletap dbltouch doubletouch', zoomIn);


}


function isTouchDevice() {
    try {
        document.createEvent("TouchEvent");

        var invalidOS = ['Android 1.', 'Android 2.', 'Android 3.', 'iPhone OS 4', 'iPhone OS 3']
        for (var k in invalidOS) {
            if (navigator.userAgent.indexOf(invalidOS[k]) > -1) {
                return true;
            }
        }
        return false
    } catch (e) {
        return false;
    }
}

function touchScroll(id) {
    if (isTouchDevice()) { //if touch events exist...
        var scrollStartPosY = 0;
        var scrollStartPosX = 0;

        document.getElementById(id).addEventListener("touchstart", function(event) {
            scrollStartPosY = this.scrollTop + event.touches[0].pageY;
            scrollStartPosX = this.scrollLeft + event.touches[0].pageX;
            // event.preventDefault();
        }, false);

        document.getElementById(id).addEventListener("touchmove", function(event) {
            this.scrollTop = scrollStartPosY - event.touches[0].pageY;
            this.scrollLeft = scrollStartPosX + event.touches[0].pageX;
            event.preventDefault();
        }, false);
    }
}

function onDeviceReady() {
    return;
    console.log("device is ready");
    directoryListing()
}

function storeIntelligrapeLogo() {
    var url = encodeURI("http://www.clyps.com/manager-dev/accounts/demo@eventvisit.com/app1354791649-7985/app/data/category1.png"); // image url
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
        var imagePath = fs.root.fullPath + "/logo.png"; // full file path
        var fileTransfer = new FileTransfer();
        fileTransfer.download(url, imagePath, function(entry) {
            console.log(entry.fullPath); // entry is fileEntry object
        }, function(error) {
            console.log("Some error");
        });
    })
}

function directoryListing() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
        console.log("Root = " + fs.root.fullPath);
        var directoryReader = fs.root.createReader();
        directoryReader.readEntries(function(entries) {
            var i;
            for (i = 0; i < entries.length; i++) {
                console.log(entries[i].name);
                entries[i].getMetadata(function(metadata) {
                    var name = entries[i].name
                    var lastupdate = metadata.modificationTime
                })
            }
        }, function(error) {
            alert(error.code);
        })
    }, function(error) {
        alert(error.code);
    });
}


function touchScroll(id){
    if(isTouchDevice()){ //if touch events exist...
        var scrollStartPosY=0;
        var scrollStartPosX=0;

        document.getElementById(id).addEventListener("touchstart", function(event) {
            scrollStartPosY=this.scrollTop+event.touches[0].pageY;
            scrollStartPosX=this.scrollLeft+event.touches[0].pageX;
        // event.preventDefault();
        },false);

        document.getElementById(id).addEventListener("touchmove", function(event) {
            this.scrollTop=scrollStartPosY-event.touches[0].pageY;
            this.scrollLeft=scrollStartPosX+event.touches[0].pageX;
            event.preventDefault();
        },false);
    }
}

function goToByScroll(selector){
    $('html,body').animate({
        scrollTop: $(selector).first().offset().top
    },'slow');
}

