(function($)
    {
        $.fn.notreSuperPlugIn=function(parametres)
        {
            return this.each(function()
            {
                //Code de notre plug-in ici
                });
        };
    })(jQuery);

(function($){
    

    $.listview = $.listview || {
        version: '1.0'
    };


    $.listview.SIMPLE = 'simple';
    $.listview.ARROW = 'arrow';
    $.listview.ICONS = 'icons';
    $.listview.TILES = 'tiles';
    $.listview.CUSTOM = 'custom';
    
    $.listview.defaultOptions = {
        "type": $.listview.SIMPLE,
        start: 0,
        count: 8,
        click: function(){},
        txtcolor: '#666666',
        cols3: true,
        search: true,
        searchSelector: '#search-container',
        searchFields: ['title','description']
    };


    $.listview.count = function (obj) {
        var count = 0;

        for(var prop in obj) {
            if(obj.hasOwnProperty(prop)) {
                var item = obj[prop]
                if ( $.listview.options.category == undefined || $.listview.options.category == '' || ( $.listview.options.category != undefined && item.category == $.listview.options.category)) {
                    ++count;
                }
            }
        }

        return count;
    }
    $.listview.truncateString = function(str,len){
        if ( typeof(str) != 'string') return ''
        var n = (len==undefined)?15:parseInt(len,10)
        return str.substr(0,n)+ ((n < str.length)?' ...':'')
    }
    $.listview.init = function(options){
        //$.listview.items = $.extend(true, {},$.listview.defaultItems, items)
            
        $.listview.options = $.extend({},$.listview.defaultOptions, options);
        if ( $.listview.options.txtcolor == '') {
            $.listview.options.txtcolor = 'transparent'
        }
        if ( $.listview.options.txtbgcolor == '') {
            $.listview.options.txtbgcolor = 'transparent'
        }
                        
    // Put your initialization code here
    };
        
    $.listview.pagination = function(items,id,selector) {
        var nb = this.count( items)
        var countperpage = this.options.count
        var nbpages = (countperpage)? (Math.floor(nb / countperpage) + ((nb % countperpage==0)?0:1)) : 1
            
        if ( nbpages < 2) {
            return ''
        }

        var html = '<div class="listView-pg-container">'
        //console.log(items,this.options,countperpage,nb,nbpages)
        for ( var k = 0; k < nbpages; k++) {
            html += '<button id="'+id+'-pg'+k+'" onmouseover="jQuery(\''+selector+'\').listview_changePage(\'pg'+k+'\');" src="" class="listView-pg-bullet '+(k==0?'selected':'')+'" ></button>'
        }
        html += '</div>'
        return html
    }
        
    // Sample Function, Uncomment to use
    // $.listview.functionName = function(paramaters){
    // 
    // };
    $.listview.beginList = function() {
        var html = ''
            
        if ( $.listview.options.type == $.listview.SIMPLE) {
            html += '<ul class="simpleList">'
        } else if ( $.listview.options.type == $.listview.ARROW) {
            html += '<ul class="listView">'
        } else if ( $.listview.options.type == $.listview.ICONS) {
            html += '<ul class="listIcons">'
        } else if ( $.listview.options.type == $.listview.TILES) {
            html += '<ul class="listTiles">'
        } else if ( $.listview.options.type == $.listview.CUSTOM) {
            html += '<ul class="listCustom">'
        } else {
            html += '<ul>'
        }
        return html
    }

    $.listview.endList = function() {
        if ( this.options.type == $.listview.SIMPLE) {
            return '</ul><span style="clear:both;"></span>'
        } else if ( this.options.type == $.listview.ARROW) {
            return '</ul><span style="clear:both;"></span>'
        } else if ( $.listview.options.type == $.listview.ICONS) {
            return '</ul><span style="clear:both;"></span>'
        } else if ( $.listview.options.type == $.listview.TILES) {
            return '</ul><span style="clear:both;"></span>'
        } else {
            return '</ul><span style="clear:both;"></span>'
        }
        return '' 
    }
    
    $.listview.beginListItem = function(item,hide,j) {
        var html = ''
        var pg = ($.listview.options.count>0)?( Math.floor(j / $.listview.options.count)):0
        var hideClass = (hide==true)?' hide pg'+pg:' pg'+pg
        var k = item.id
        var rnd = new Date().getTime();
        var strclick = ''
        if ( typeof window[this.options.click] == 'function') {
            strclick = this.options.click
        } else if ( typeof this.options.click == 'function') {
            strclick = 'jQuery.listview.options.click'
        }
        if (strclick!='') {
            strclick += '(\''+item.id+'\''
            if ( this.options.clickParams != undefined) {
                for( var p in this.options.clickParams) {
                    var param = this.options.clickParams[p]
                    if ( item[param] == undefined) {
                        strclick += ',\''+param.replace(/'/,"\\'")+'\''
                    } else {
                        strclick += ',\''+item[param].replace(/'/,"\\'")+'\''
                    }
                }
            }
            strclick += ')'
        }

        var searchString = ''
        if (item.title) {
            searchString = escape(item.title.toLowerCase())
        }
        
        if ( this.options.type == $.listview.SIMPLE) {
            html += '<li title="'+searchString+'" style="color: '+$.listview.options.txtcolor+'; background-color: '+$.listview.options.txtbgcolor+';" onclick="'+strclick+'" '+((k==$.listview.options.selectedKey)?'class="'+hideClass+' selected"':'class="arrow '+hideClass+' "')+' >'
            return html
        } else if ( this.options.type == $.listview.ARROW) {
            html += '<li title="'+searchString+'" style="color: '+$.listview.options.txtcolor+'; background-color: '+$.listview.options.txtbgcolor+';" onclick="'+strclick+'" '+((k==$.listview.options.selectedKey)?'class="arrow '+hideClass+' selected"':'class="arrow '+hideClass+' "')+' >'
            return html
        } else if ( $.listview.options.type == $.listview.ICONS) {
            var cols3 = ($.listview.options.cols3)?' cols3 ':''
            html += '<li title="'+searchString+'" onclick="'+strclick+'" class=" '+((k==$.listview.options.selectedKey)?hideClass + cols3+' selected"':hideClass+cols3) + '" >'
            return html
        } else if ( $.listview.options.type == $.listview.TILES) {
            html += '<li title="'+searchString+'" onclick="'+strclick+'" style="cursor: pointer; background: '+$.listview.options.txtbgcolor+' url('+item.image+'?'+rnd+') no-repeat; background-size: cover;" '+((k==$.listview.options.selectedKey)?'class=" '+hideClass+' selected"':'class=" '+hideClass+' "')+'>'
            return html
        } else if ( this.options.type == $.listview.CUSTOM) {
            html += '<li title="'+searchString+'" onclick="'+strclick+'" '+((k==$.listview.options.selectedKey)?'class="'+hideClass+' selected"':'class="arrow '+hideClass+' "')+' >'
            return html
        } else {
            html += '<li title="'+searchString+'" style="color: '+$.listview.options.txtcolor+'; background-color: '+$.listview.options.txtbgcolor+';" onclick="'+strclick+'" '+((k==$.listview.options.selectedKey)?'class="'+hideClass+' selected"':'class=" '+hideClass+' "')+' >'
            return html
        }
        return ''
    }
    
    $.listview.endListItem = function() {
        if ( this.options.type == $.listview.SIMPLE) {
            return '</li>'
        } else if ( this.options.type == $.listview.ARROW) {
            return '</li>'
        } else if ( $.listview.options.type == $.listview.ICONS) {
            return '</li>'
        } else if ( $.listview.options.type == $.listview.TILES) {
            return '</li>'
        } else if ( $.listview.options.type == $.listview.CUSTOM) {
            return '</li>'
        } else{
            return '</li>'
        }
        return ''
    }

    $.listview.listItem = function(item,ibdex) {
        var html = ''
        var k = item.id
        var rnd = new Date().getTime();
        if ( this.options.type == $.listview.SIMPLE || this.options.type == $.listview.ARROW) {
            html += '<table width="100%"><tr>'
            html += '<td width="32"><img src="'+item.image+'?'+rnd+'" width="32" height="32" /></td>'
            html += '<td>'
            html += '<a title="App ID: '+item.id+'" ><strong>'+$.listview.truncateString(item.title) + '</strong></a></br>'
            html += '<a title="App ID: '+item.id+'" >'+$.listview.truncateString(item.description,40) + '</a>'
            html += '</td>'
            html += '</tr></table>'
        } else if ( $.listview.options.type == $.listview.ICONS) {
            html += '<div class="icon-container">'
            html += '<img src="'+item.image+'?'+rnd+'" width="32" height="32"/><br/>'
            html += '<div class="iconText" style="color: '+$.listview.options.txtcolor+';">'+item.title+'</div>'
            html += '</div>'
        } else if ( $.listview.options.type == $.listview.TILES) {
            html += '<div style="color: '+$.listview.options.txtbgcolor+'; background-color: '+$.listview.options.txtcolor+'; opacity: 0.9; padding: 3px;">'
            html += item.title
            html += '</div>'
        } else if ( $.listview.options.type == $.listview.CUSTOM || $.listview.options.type == '' || $.listview.options.type == undefined) {
            if ( typeof window[$.listview.options.itemHTML] == 'function') {
                html = window[$.listview.options.itemHTML](item,ibdex)
            } else if ( typeof $.listview.options.itemHTML == 'function') {
                html = $.listview.options.itemHTML(item,ibdex)
            }
        }
        return html
    }

    $.fn.listview = function( options){
        var items = options.items;
        //var list_ = new $.listview(this, options);
        $.listview.init(options)
        var id = $(this).attr('id')
        var selector = $(this).selector
        return this.each(function(){
            var html = ''
            var sortField
            if ($.listview.options.sort != undefined && items) {  
                items.sort(function(a, b){
                    sortField = $.listview.options.sort
                    var k
                    var sortOrder = 1
                    if ( (k = sortField.indexOf(' asc')) > -1) {
                        sortField = sortField.substr(0, k)
                        sortOrder = 1
                    } else if ( (k = sortField.indexOf(' desc')) > -1) {
                        sortField = sortField.substr(0, k)
                        sortOrder = -1
                    }
                    
                    if ( a[sortField] > b[sortField]) {
                        return sortOrder;
                    } else if ( a[sortField] < b[sortField]) {
                        return -sortOrder;
                    } else {
                        return 0;
                    }
                })
            }

            if ( options.pagination == true && options.pgPosition == 'top') {
                html += $.listview.pagination(items,id,selector)
            }
            html += $.listview.beginList()
            
            var j = 0
            var hide
            var olf_firstChar = ''
            var old_pg = 0
            for( var k in items) {
                var item = items[k]
                if ( options.category == undefined || options.category == '' || ( options.category != undefined && item.category == options.category)) {
                    if ( options.pagination == true) {
                        if ( $.listview.options.start <= j && j < $.listview.options.start + $.listview.options.count) {
                            hide = false
                        } else {
                            hide = true
                        }
                    } else {
                        hide = false
                    }
                
                
                    
                    if ($.listview.options.sort != undefined) {
                        var firstChar = item[sortField].substr(0,1).toUpperCase()
                        var pg = (options.count>0)?( Math.floor(j / options.count)):0
                        if ( olf_firstChar != firstChar || ( old_pg != pg && options.paginatioin == true)) {
                            var hideClass = (hide==true)?' sort-title hide pg'+pg:' sort-title pg'+pg
                            html += '<li style="color: '+$.listview.options.txtbgcolor+'; background-color: '+$.listview.options.txtcolor+';" class="'+hideClass+'">'
                            html += firstChar
                            html += '</li>'
                            olf_firstChar = firstChar
                            old_pg = pg
                        }
                    }
                    html += $.listview.beginListItem(item,hide,j)
                    if (typeof ( $.listview.options.itemCallback) === 'function') {
                        html += $.listview.options.itemCallback(item,k)
                    } else {
                        html += $.listview.listItem(item,k) // item.title
                    }
                    html += $.listview.endListItem()
                
                    j++
                }
            }
            
            html += $.listview.endList()
            
            if ( options.pagination == true && options.pgPosition != 'top') {
                html += $.listview.pagination(items,id,selector)
            }
            
            $(this).html(html)
            
            if ( $.listview.options.search == true) {
                html = '<input onkeyup="if (this.value == \'\'){jQuery(\''+selector+' ul li\').show();}else{jQuery(\''+selector+' ul li\').hide();jQuery(\''+selector+' ul li[title*=\'+this.value+\']\').show();}" type="text" class="inputSearch" />'
               $($.listview.options.searchSelector).show().html(html)
            }
           
            

        });
    };
    $.fn.listview_search = function(searchText,containerId) {
        console.log('searchText = ',searchText, ' | containerId = ',containerId)
        var id = '#'+$(this).attr('id')
        var selector = $(this).selector
        var pg = ''
        return this.each(function()
        {
            $(selector+' li').addClass('hide')

            $(selector+' li.' + pg).removeClass('hide')
            $(' button#'+id+'-'+pg+'.listView-pg-bullet' ).addClass('selected')
        });
    }
    $.fn.listview_changePage = function(pg) {
        var id = '#'+$(this).attr('id')
        var selector = $(this).selector
        return this.each(function()
        {
            $(selector+' li').addClass('hide')
            $(' button.listView-pg-bullet').removeClass('selected')

            $(selector+' li.' + pg).removeClass('hide')
            $(' button#'+id+'-'+pg+'.listView-pg-bullet' ).addClass('selected')
        });
    }
    
})(jQuery);