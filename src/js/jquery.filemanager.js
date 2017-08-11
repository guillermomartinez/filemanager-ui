(function ( $ ) {
    $.fn.filemanager = function( options ) {
        var defaults = {
            url: "../conector.php",
            languaje: "ES",
            upload_max: 5,
            view: "thumbs",
            ext: ["jpeg","gif","jpg","png","svg","txt","pdf","odp","ods","odt","rtf","doc","docx","xls","xlsx","ppt","pptx","csv","ogv","mp4","webm","m4v","ogg","mp3","wav","zip","rar"],
            insertButton: false,
            token: null,
            tokenName: "_token",
            typeFile: null,
            datetimeFormat: "DD/MM/YYYY",
            tokenHeadersEnabled: false,
            tokenHeadersName: "X-CSRF-TOKEN",
            headers: null
        };
        var settings = $.extend({}, defaults, options );
        var headersCustom = {};
        if(settings.tokenHeadersEnabled){
            headersCustom[settings.tokenHeadersName] = settings.token;
        }
        if (settings.headers) {
            $.each(settings.headers, function(index, val) {
                headersCustom[index] = val;
            });
        }
        var getParameter = function( param ) {
            if(!param) param = '';
            var regex = /[?&]([^=#]+)=([^&#]*)/g, url = window.location.href, params = {},match;
            while(match = regex.exec(url)) {
                if(match[2]!=='undefined')
                    params[match[1]] = match[2];
            }
            return (params[param] || '');
        };
        var lang = getParameter('lang');
        if(lang!="") settings.languaje = (lang=='en_GB') ? 'us' : lang;
        var type = getParameter('type');
        if(type!="") settings.typeFile = type;
        var LANG = {};
        $.each(LANGS, function(index, val) {
            if(settings.languaje.toUpperCase() == index){
                LANG = val;
                return false;
            }
        });
        settings.getModalTemplate = function(options){
            var defaults = {
                type:"",
                modal_id : '',
                header : {
                    title:'Title'
                },
                body : '',
                footer : {
                    ok:'Ok',
                    close:'Close'
                }
            };
            var config = $.extend({}, defaults, options );
            var modal_class ='';
            if(config.type=="lg") modal_class= 'modal-lg';
            var template = '<div class="modal fade" id="'+config.modal_id+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog '+modal_class+'"><form id="form_popup" action="" method="post"><div class="modal-content">';
            if(config.header)
                template = template + '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="myModalLabel">'+config.header.title+'</h4></div>';
            template = template + '<div class="modal-body">'+config.body+'</div>';
            if(config.footer)
                template = template + '<div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">'+config.footer.close+'</button><button type="submit" class="btn btn-primary">'+config.footer.ok+'</button></div>';
            template = template + '</div></form></div></div>';
            return template;
        };
        function substr_replace(str, replace, start, length) {
            //  discuss at: http://phpjs.org/functions/substr_replace/
            if (start < 0) {
                start = start + str.length;
            }
            length = length !== undefined ? length : str.length;
            if (length < 0) {
                length = length + str.length - start;
            }
            return str.slice(0, start) + replace.substr(0, length) + replace.slice(length) + str.slice(start + length);
        }
        function str_replace(search, replace, subject, count) {
            //  discuss at: http://phpjs.org/functions/str_replace/
            var i = 0,j = 0,temp = '',repl = '',sl = 0,fl = 0,f = [].concat(search),r = [].concat(replace),s = subject,ra = Object.prototype.toString.call(r) === '[object Array]',sa = Object.prototype.toString.call(s) === '[object Array]';
            s = [].concat(s);
            if(typeof(search) === 'object' && typeof(replace) === 'string' ) {
                temp = replace;
                replace = [];
                for (i=0; i < search.length; i+=1) {
                    replace[i] = temp;
                }
                temp = '';
                r = [].concat(replace);
                ra = Object.prototype.toString.call(r) === '[object Array]';
            }
            if (count) {
                this.window[count] = 0;
            }
            for (i = 0, sl = s.length; i < sl; i++) {
                if (s[i] === '') {
                    continue;
                }
                for (j = 0, fl = f.length; j < fl; j++) {
                    temp = s[i] + '';
                    repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
                    s[i] = (temp)
                    .split(f[j])
                    .join(repl);
                    if (count) {
                        this.window[count] += ((temp.split(f[j])).length - 1);
                    }
                }
            }
            return sa ? s : s[0];
        }
        function removeExtension(filename){
            var lastPosition = filename.lastIndexOf(".");
            if (lastPosition === -1) return filename;
            else return filename.substr(0, lastPosition);
        }
        function translate(text){
            var r = false;
            var t1 = '';
            var t2 = '';
            $.each(LANG, function(index2, valor) {
                if(text==index2){
                    r = true;
                    t1 = index2;
                    t2 = valor;
                    return false;
                }
            });
            if (r) return text.replace(t1,t2);
        }
        var filemanager = $(this);
        filemanager.token = Math.floor((1 + Math.random()) * 0x10000);
        filemanager.config = {
            new_folder: "newfolder_popup_"+filemanager.token,
            upload_popup: "upload_popup_"+filemanager.token,
            delete_popup: "delete_popup_"+filemanager.token,
            rename_popup: "rename_popup_"+filemanager.token,
            move_popup: "move_popup_"+filemanager.token,
        };
        var html_init = '<div class="navbar">';
        html_init = html_init+'<div class="navbar-inner"><div class="container-fluid">';
        html_init = html_init+'<div class="row tooolbar"><div class="col-xs-7 col-sm-5 col-md-4"><button data-target="#'+filemanager.config.upload_popup+'" data-tooltip="tooltip" data-toggle="modal" title="FE_UPLOAD" data-placement="bottom" class="btn btn-default btn-sm "><span aria-hidden="true" class="glyphicon glyphicon-upload"></span><span aria-hidden="true" class="glyphicon glyphicon-file"></span></button><button data-target="#'+filemanager.config.new_folder+'" data-tooltip="tooltip" data-toggle="modal" title="FE_CREATE_DIRECTORY" data-placement="bottom" class="btn btn-default btn-sm "><span aria-hidden="true" class="glyphicon glyphicon-plus"></span><span aria-hidden="true" class="glyphicon glyphicon-folder-open"></span></button><button id="select_delete_popup" data-tooltip="tooltip" title="FE_DELETE_SELECTED" data-placement="bottom" class="btn btn-default btn-sm disabled"><span aria-hidden="true" class="glyphicon glyphicon-duplicate"></span><span aria-hidden="true" class="glyphicon glyphicon-remove"></span></button><button id="select_insert" data-tooltip="tooltip" title="FE_INSERT_SELECTED" data-placement="bottom" class="btn btn-default btn-sm disabled"><span aria-hidden="true" class="glyphicon glyphicon-file"></span><span aria-hidden="true" class="glyphicon glyphicon-ok"></span></button></div><div class="col-xs-5 col-sm-3 col-md-2"><span>FE_VIEWS</span><button id="view_thumbs" data-tooltip="tooltip" title="FE_VIEW_MINIATURE" data-placement="bottom" class="btn btn-default btn-sm active"><span aria-hidden="true" class="glyphicon glyphicon-th"></span></button><button id="view_details" data-tooltip="tooltip" title="FE_VIEW_DETAILS" data-placement="bottom" class="btn btn-default btn-sm"><span aria-hidden="true" class="glyphicon glyphicon-align-justify"></span></button></div><div class="col-xs-12 col-sm-4 col-md-3 col_top_right"><div class="btn-group" role="group" aria-label="First group"><div class="btn-group grupo1" role="group" aria-label=""><div class="input-group search_content"><input id="search" name="search" type="text" class="form-control input-sm" placeholder="FE_SEARCH_NAME_FILES" autocomplete="off" ><span class="input-group-btn"><button class="btn btn-default input-sm" type="button" id="search_" data-tooltip="tooltip" data-placement="bottom" title="FE_SEARCH_NAME_FILES"><span aria-hidden="true" class="glyphicon glyphicon-search"></span></button></span></div></div><div class="btn-group grupo2" role="group" aria-label=""><button class="btn btn-default input-sm" type="button" id="search_clear" data-tooltip="tooltip" data-placement="bottom" title="FE_CLEAR"><span aria-hidden="true" class="glyphicon glyphicon-remove-sign"></span></button></div></div></div></div>';
        html_init = html_init+'<div class="row"><div class="col-md-12"><ol id="ruta" class="breadcrumb"><li><a rel="/" href="#"><span aria-hidden="true" class="glyphicon glyphicon-home"></span></a></li></ol></div></div>';
        html_init = html_init+'</div></div></div>';
        html_init = html_init+'<div class="container-fluid">';
        html_init = html_init+'<input type="hidden" id="path" name="path" value=""><div class="hidden"><div id="preview_file"><span aria-hidden="true" class="glyphicon glyphicon-file txt"></span></div></div>';
        html_init = html_init+'<div id="content_list" class="row"><div class="col-md-12" id="row_header_content"><div class="row_header"><div class="col name">FE_NOMBRE</div><div class="col type">FE_TIPO</div><div class="col size">FE_TAMANO</div><div class="col date">FE_DATE</div><div class="col actions">FE_ACTIONS</div></div></div><div class="col-md-12 list"><ul id="list" class="scroll"></ul></div></div>';
        html_init = html_init+'<div id="context-menu"><ul class="dropdown-menu menu_contextual" role="menu"><li class="view"><a href="#">FE_VIEW</a></li><li class="rename"><a href="#">FE_RENAME</a></li><li class="move"><a href="#">FE_MOVE</a></li><li class="download"><a href="#">FE_DOWNLOAD</a></li><li class="delete"><a href="#">FE_DELETE</a></li></ul></div>';
        html_init = html_init+'</div>';
        filemanager.append(html_init);
        var $this = filemanager.find("#list");
        filemanager.getSettings = function() {
            return settings;
        }
        filemanager.validExtension = function (filename){
            var r = false;
            var ext ='';
            var lastPosition = filename.lastIndexOf(".");
            if (lastPosition > 0) ext = filename.substr(lastPosition+1);
            for (var i = 0; i < settings.ext.length; i++) {
                if(settings.ext[i] === ext){
                    r = true;
                    break;
                }
            }
            return r;
        }
        filemanager.parseMsg = function(obj){
            if(typeof obj == 'object'){
                var text = obj.query;
                var params = obj.params;
                // Loading languaje
                $.each(LANG, function(index2, valor) {
                    text = str_replace(index2,valor,text);
                });
                // Replace params
                var n = text.indexOf('%s');
                var i = 0;
                var r = false;
                do{
                    r = false;
                    n = text.indexOf('%s');
                    if(n !== -1){
                        if(params.length > i){
                            var res = params[i].toString();
                            if(res !==''){
                                text = substr_replace(text,res,n,2);
                                i++;
                                r = true;
                            }
                        }
                    }
                }
                while(r);
                text = str_replace('%s','',text);
                return text;
            }
        }
        filemanager.formatBytes = function(bytes) {
            if(bytes < 1024)
                return bytes + " Bytes";
            else if(bytes < 1048576)
                return(bytes / 1024).toFixed(3) + " KB";
            else if(bytes < 1073741824)
                return(bytes / 1048576).toFixed(3) + " MB";
            else
                return(bytes / 1073741824).toFixed(3) + " GB";
        }
        filemanager.loadFiles = function(data,path){
            var items = $this;
            items.html('');
            var context_menu = $("#context-menu",filemanager).clone().html();
            var item = '<li><div class="item context" ><div class="check"><label><input type="checkbox" name="check"></label></div><a class="image" href="#"><img></a><div class="col name"><h3><span class="texto"></span></h3></div><div class="col type"></div><div class="col size"></div><div class="col date"></div><div class="col actions"><div class="btn-group menu_options" data-tooltip="tooltip" data-placement="left" title="'+translate('FE_ACTIONS')+'"><button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ><span aria-hidden="true" class="glyphicon glyphicon-tasks" ></button>'+context_menu+'</div></div></div></li>';
            var el = null;
            if(path!="/" ){
                var path2 = path.replace(/\//ig,' ').trim().split(' ');
                if(path2.length==1){
                    path2 = '/';
                }else{
                    path2 = path2.slice(0,path2.length-1).join('/');
                    path2 = '/'+path2+'/';
                }
                el = $(item);
                el.find('.image').html('<div class="content_icon"><span aria-hidden="true" class="glyphicon glyphicon-level-up"></span></div>');
                el.find('.image').addClass('dir').attr('rel',path2);
                el.find('.texto').text(translate('FE_BACK'));
                el.find('.type').text('');
                el.find('.size').text('');
                el.find('.actions').html('');
                el.addClass('parentup back');
                el.find('.item').removeClass('context');
                el.find('.check').remove();
                items.append(el);
            }
            $.each(data,function(index,element){
                if(element.isdir==true || (element.isdir==false && filemanager.validExtension(element.filename))){
                    el = $(item);
                    var filename = element.filename;
                    var filenameshort = filename;
                    var filetype = element.filetype;
                    var filesize = filemanager.formatBytes(element.size);
                    var filedate = moment.unix(element.lastmodified).format(settings.datetimeFormat);
                    var id = element.id;
                    if(id != undefined)
                        el.find('div.check input[name=check]').attr('data-id',id);
                    if(element.isdir==true){
                        el.find('.image').html('<div class="content_icon"><span aria-hidden="true" class="glyphicon glyphicon-folder-close"></span></div>');
                        el.find('.image').addClass('dir').attr('rel',element.urlfolder);
                        el.find('.name').attr('data-name-original',filename).attr('data-name',filename).attr('data-isdir',element.isdir);
                        el.find('.texto').text(filenameshort);
                        filetype = translate('FE_FILE_TYPE');
                        el.find('.type').text(filetype === undefined ? 'dir' : filetype);
                        el.find('.size').text('');
                        el.find('.date').text(filedate);
                    }else if(element.filetype==="jpg" || element.filetype==="png" || element.filetype=="jpeg" || element.filetype=="gif"){
                        el.find('.image img').addClass('lazy').attr('data-src',element.preview+'?t='+Math.floor(Date.now() /1000));
                        el.find('.image').addClass('fancybox').attr('data-url',element.previewfull).attr('rel',element.previewfull+'?t='+Math.floor(Date.now() /1000)).attr('title',translate('FE_FILENAME') + element.filename+' | '+ translate('FE_SIZE') +' '+filemanager.formatBytes(element.size)+' | '+ translate('FE_LAST_MODIFIED') +moment.unix(element.lastmodified).format(settings.datetimeFormat));
                        el.find('.name').attr('data-name-original',filename).attr('data-name',filename).attr('data-isdir',element.isdir);
                        el.find('.texto').text(filenameshort);
                        el.find('.type').text(filetype);
                        el.find('.size').text(filesize);
                        el.find('.date').text(filedate);
                    }
                    else{
                        el.find('.image').html('<div class="content_icon"><span aria-hidden="true" class="glyphicon glyphicon-file '+ element.filetype +'" ></span></div>');
                        el.find('.image').addClass('fancybox').attr('data-url',element.previewfull).attr('rel','#preview_file').attr('title',translate('FE_FILENAME')+element.filename+' | '+ translate('FE_SIZE')+filemanager.formatBytes(element.size)+' | '+translate('FE_LAST_MODIFIED')+moment.unix(element.lastmodified).format(settings.datetimeFormat));
                        el.find('.name').attr('data-name-original',filename).attr('data-name',filename).attr('data-isdir',element.isdir);
                        el.find('.texto').text(filenameshort);
                        el.find('.type').text(filetype);
                        el.find('.size').text(filesize);
                        el.find('.date').text(filedate);
                    }
                    items.append(el);
                }
            });
        }
        filemanager.preview = function(item){
            $.fancybox( {
                href : item.find('a').attr('rel'),
                title : item.find('a').attr('title')
            },
            {
                openEffect  : 'elastic',
                closeEffect : 'elastic',
                minWidth : 300,
                minHeight : 200,
                beforeShow:function(){
                    var a = this.title.split('|');
                    var t ='';
                    if(a.length>0){
                        for (var i = 0; i < a.length; i++) {
                            var t2 ='';
                            var t3 =[];
                            t2 = a[i];
                            t3 = t2.split(':');
                            if(t3.length==1){
                                t = t + '<p><strong>'+t3[0]+'</strong>:</p>';
                            }else if(t3.length==2){
                                t = t + '<p><strong>'+t3[0]+'</strong>:'+t3[1]+'</p>';
                            }
                        }
                    }
                    this.title = '<h3>'+ translate('FE_INFORMATION') +'</h3><div>'+t+'</div';
                },
                helpers : {
                    title : {
                        type : 'inside'
                    }
                }
            }
            );
        };
        filemanager.viewMove = function(item){
            var path = $("#path",filemanager).val();
            $("#"+filemanager.config.move_popup,filemanager).modal('show');
            $("#"+filemanager.config.move_popup,filemanager).find('#nameold').val(item.find('.name').data('name-original'));
            $("#"+filemanager.config.move_popup,filemanager).find('.label_namefile').text("Archivo");
            $("#"+filemanager.config.move_popup,filemanager).find('.namefile').text(path+item.find('.name').data('name-original'));
            // $("#"+filemanager.config.move_popup,filemanager).find('.label_name').text(item.find('.name').data('name-original'));
            // $("#"+filemanager.config.move_popup,filemanager).find('#name').val(removeExtension(item.find('.name').data('name-original')));
        };
        filemanager.viewRename = function(item){
            $("#"+filemanager.config.rename_popup,filemanager).modal('show');
            $("#"+filemanager.config.rename_popup,filemanager).find('#nameold').val(item.find('.name').data('name-original'));
            $("#"+filemanager.config.rename_popup,filemanager).find('#name').val(removeExtension(item.find('.name').data('name-original')));
        };
        filemanager.download = function(item){
            var name = item.find('.name').data('name-original');
            var path = $("#path",filemanager).val();
            var datos = settings.url+'?action=download&path='+ path + '&name=' + name;
            if(settings.token!==null) datos = datos + '&' + settings.tokenName + '=' + settings.token;
            window.document.location.href = datos;
        };
        filemanager.viewDelete = function(item){
            var name = item.find('.name').data('name-original');
            var modal = $('#'+filemanager.config.delete_popup,filemanager);
            modal.find('.modal-body .content').html('<p class="filename_delete">'+ name +'</p><input type="hidden" name="name" value="'+ name +'" />');
            modal.find('.modal-body .result').html('');
            $('#'+filemanager.config.delete_popup,filemanager).modal('show');
        };
        filemanager.insert = function(){
            var ic = $this.find('.item.active');
            if(ic.length>0){
                var res = [];
                $.each(ic, function(index, val) {
                    var obj = {};
                    obj.url = $(val).find(".image").attr("data-url");
                    obj.thumbs = $(val).find(".image img").attr("src");
                    obj.filename = $(val).find(".name").attr("data-name-original");
                    obj.filetype = $(val).find(".type").text();
                    obj.filesize = $(val).find(".size").text();
                    obj.lastmodified = $(val).find(".date").text();
                    res.push(obj);
                });
                return res;
            }else{
                return false;
            }
        };
        filemanager.getFolder = function(path){
            if(!path) path = '/';
            var datos2 = {action:"getfolder",path:path};
            if(settings.token!==null) datos2[settings.tokenName] = settings.token;
            if(settings.typeFile!==null) datos2.typeFile = settings.typeFile;
            $.ajax({
                headers: headersCustom,
                type: "POST",
                url: settings.url,
                data :  datos2,
                beforeSend: function(objeto){
                    $this.html('<div id="loading"></div>');
                },
                success: function(datos){
                    if (typeof datos === 'string')
                        datos = $.parseJSON(datos);
                    if(datos.status==1){
                        filemanager.loadFiles(datos.data,path);
                        $('.context',filemanager).contextmenu({
                            target: '#'+filemanager.attr('id')+' #context-menu',
                            before: function(e,context) {
                                this.getMenu().find("li").css('display','block');
                                if(context.find('.image.dir').length>0){
                                    this.getMenu().find("li.view").css('display','none');
                                    this.getMenu().find("li.download").css('display','none');
                                }
                                return true;
                            },
                            onItem: function(context,e) {
                                if($(e.target).parent().is('.view')){
                                    filemanager.preview(context);
                                }
                                if($(e.target).parent().is('.move')){
                                    filemanager.viewMove(context);
                                }
                                if($(e.target).parent().is('.rename')){
                                    filemanager.viewRename(context);
                                }
                                if($(e.target).parent().is('.download')){
                                    filemanager.download(context);
                                }
                                if($(e.target).parent().is('.delete')){
                                    filemanager.viewDelete(context);
                                }
                            }
                        });
                        $('.menu_options',filemanager).on('show.bs.dropdown', function (e) {
                            var context = $(this).parents('.item');
                            $(this).find('li').css('display','block');
                            if(context.find('.image.dir').length>0){
                                $(this).find('li.view').css('display','none');
                                $(this).find('li.download').css('display','none');
                            }
                        }).bind('contextmenu', function(event) {
                            return false;
                        });
                        $('.menu_options',filemanager).on('click', 'li > a', function(event) {
                            event.preventDefault();
                            if($(this).parent().is('.view')){
                                filemanager.preview($(this).parents('.item'));
                            }
                            if($(this).parent().is('.move')){
                                filemanager.viewMove($(this).parents('.item'));
                            }
                            if($(this).parent().is('.rename')){
                                filemanager.viewRename($(this).parents('.item'));
                            }
                            if($(this).parent().is('.download')){
                                filemanager.download($(this).parents('.item'));
                            }
                            if($(this).parent().is('.delete')){
                                filemanager.viewDelete($(this).parents('.item'));
                            }
                        });
                        // BEGIN VIEWS
                        if($("#view_thumbs",filemanager).is('.active')){
                            $(".item .col.name",filemanager).each(function(index, el) {
                                var ori = $(el).attr('data-name');
                                var des = $(el).find('.texto').text();
                                $(el).attr('data-name',ori).find('.texto').text(des);
                            });
                        }else if($("#view_details",filemanager).is('.active')){
                            $(".item .col.name",filemanager).each(function(index, el) {
                                var ori = $(el).attr('data-name');
                                var des = $(el).find('.texto').text();
                                $(el).attr('data-name',des).find('.texto').text(ori);
                            });
                        }
                        // END VIEWS
                        $("#path",filemanager).val(path);
                        var ruta = path.split('/');
                        var temp = [];
                        var n = ruta.length;
                        for (var i = 0; i < n; i++) {
                            if(ruta[i]!==""){
                                temp.push(ruta[i]);
                            }
                        }
                        var rutacontent = $("#ruta",filemanager);
                        rutacontent.html('<li><a href="#" rel="/"><span class="glyphicon glyphicon-home" aria-hidden="true"></span></a></li>');
                        var url ='/';
                        $.each(temp,function(index,element){
                            var el = null;
                            if( index < temp.length-1 ){
                                url = url + element + '/';
                                el = $('<li><a href="#" rel="'+ url +'">'+element+'</a></li>');
                                rutacontent.append(el);
                            }else{
                                el = $('<li>'+element+'</li>');
                                rutacontent.append(el);
                            }
                        });
                        filemanager.searchFiles();
                        filemanager.find('.lazy').lazy({placeholder: "data:image/gif;base64,R0lGODlhEALAPQAPzl5uLr9Nrl8e7..."});
                    }
                },
                error: function(request, textStatus, errorThrown){
                    if (request.status === 0) {
                        $this.html('<div class="alert alert-info text-center">Not connect: Verify Network.</div>');
                    } else if (request.status == 404) {
                        $this.html('<div class="alert alert-info text-center">Requested page not found [404]</div>');
                    } else if (request.status == 500) {
                        $this.html('<div class="alert alert-info text-center">Internal Server Error [500].</div>');
                    } else if (textStatus === 'parsererror') {
                        $this.html('<div class="alert alert-info text-center">Requested JSON parse failed.</div>');
                    } else if (textStatus === 'timeout') {
                        $this.html('<div class="alert alert-info text-center">Time out error.</div>');
                    } else if (textStatus === 'abort') {
                        $this.html('<div class="alert alert-info text-center">Ajax request aborted.</div>');
                    } else {
                        console.log('Uncaught Error: ' + request.responseText);
                    }
                }
            });
        }
        filemanager.searchFiles = function(){
            var text = $("#search",filemanager).val();
            if(text===""){
                $("li",$this).not('.parentup').removeClass('hidden');
            }else{
                $("li",$this).not('.parentup').find('div.item').each(function(index,element){
                    if($(element).find('.name').data('name').toLowerCase().indexOf(text.toLowerCase()) === -1 ){
                        $(element).parent().addClass('hidden');
                    }else{
                        $(element).parent().removeClass('hidden');
                    }
                });
            }
        }
        filemanager.init = function(){
            $(filemanager).append(settings.getModalTemplate({
                modal_id:filemanager.config.new_folder,
                header:{
                    title:translate('FE_CREATE_DIRECTORY')
                },
                body:'<div class="form-group"><label for="exampleInputEmail1">'+translate('FE_NAME')+'</label><input type="text" class="form-control" id="name" name="name" placeholder="'+translate('FE_ENTER_NAME')+'"></div><div id="newfolder_popup_result"></div>',
                footer:{
                    ok:translate('FE_SAVE'),
                    close:translate('FE_CANCEL')
                }
            }));
            $(filemanager).append(settings.getModalTemplate({
                type:'lg',
                modal_id:filemanager.config.upload_popup,
                header:{
                    title:translate('FE_UPLOAD')
                },
                body:'<div id="actions" class="row"><input type="hidden" id="reloadfiles" name="reloadfiles" value="0"><div class="col-lg-7"><span class="btn btn-success fileinput-button dz-clickable"><i class="glyphicon glyphicon-plus"></i><span>'+translate('FE_ADD_FILES')+'</span></span><button type="submit" class="btn btn-primary start"><i class="glyphicon glyphicon-upload"></i><span>'+translate('FE_START_UPLOAD')+'</span></button><button type="reset" class="btn btn-warning cancel"><i class="glyphicon glyphicon-ban-circle"></i><span>'+translate('FE_CANCEL_UPLOAD')+'</span></button></div><div class="col-lg-5"><span class="fileupload-process"><div id="total-progress" class="progress progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" style="opacity: 0;"><div class="progress-bar progress-bar-success" style="width: 100%;" data-dz-uploadprogress=""></div></div></span></div></div><div class="row"><div class="col-lg-12"><div class="col-lg-12"><div id="error-all"></div></div></div></div><div class="table table-striped" class="files" id="previews"><div class="row"><div class="col-lg-12"><div class="col-lg-12"><small id="upload_max" class="text-info">FE_MAX_FILES_UPLOAD</small></div></div></div></div>',
                footer:false
            }));
            $(filemanager).append(settings.getModalTemplate({
                modal_id:filemanager.config.delete_popup,
                header:{
                    title:translate('FE_DELETE')
                },
                body:'<div class="content"><div class="form-group"><label for="exampleInputEmail1">'+translate('FE_NAME')+'</label><input type="hidden" name="nameold" id="nameold"><input type="text" class="form-control" id="name" name="name" placeholder="'+translate('FE_ENTER_NAME')+'"></div></div><div class="result"></div>',
                footer:{
                    ok:translate('FE_DELETE'),
                    close:translate('FE_CLOSE')
                }
            }));
            $(filemanager).append(settings.getModalTemplate({
                modal_id:filemanager.config.rename_popup,
                header:{
                    title:translate('FE_RENAME')
                },
                body:'<div class="content"><div class="form-group"><label for="exampleInputEmail1">'+translate('FE_NAME')+'</label><input type="hidden" name="nameold" id="nameold"><input type="text" class="form-control" id="name" name="name" placeholder="'+translate('FE_ENTER_NAME')+'"></div></div><div class="result"></div>',
                footer:{
                    ok:translate('FE_RENAME'),
                    close:translate('FE_CLOSE')
                } }));
            $(filemanager).append(settings.getModalTemplate({
                modal_id:filemanager.config.move_popup,
                header:{
                    title:translate('FE_MOVE')
                },
                body:'<div class="content"><div class="form-group"><label class="label_namefile">'+translate('FE_FILENAME')+'</label><p class="namefile"></p><label class="label_name" for="exampleInputEmail1">'+translate('FE_FOLDER')+'</label><input type="hidden" name="nameold" id="nameold"><input type="text" class="form-control" id="name" name="name" placeholder="/"></div></div><div class="result"></div>',
                footer:{
                    ok:translate('FE_MOVE'),
                    close:translate('FE_CLOSE')
                }
            }));
            // BEGIN DROPZONE
            // var previewNode = $("#template");
            // previewNode.attr('id','');
            // var previewTemplate = previewNode.parent().html();
            // previewNode.remove();
            var previewTemplate = '<div class="file-row"><div><span class="preview"><img data-dz-thumbnail /></span></div><div><p class="name" data-dz-name></p><strong class="error text-info" data-dz-errormessage></strong></div><div><p class="size" data-dz-size></p><div class="progress progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="progress-bar progress-bar-success" style="width:0%;" data-dz-uploadprogress></div></div></div><div><button data-dz-remove class="btn btn-warning cancel"><i class="glyphicon glyphicon-ban-circle"></i><span>'+translate("FE_CANCEL")+'</span></button><button data-dz-remove class="btn btn-danger delete"><i class="glyphicon glyphicon-trash"></i><span>'+translate("FE_DELETE")+'</span></button></div></div>';
            Dropzone.autoDiscover = false;
            var myDropzone = new Dropzone("#"+ filemanager.attr("id"), {
                headers: headersCustom,
                url: settings.url, // Set the url
                thumbnailWidth: 80,
                thumbnailHeight: 80,
                // parallelUploads: 20,
                previewTemplate: previewTemplate,
                autoQueue: false,
                previewsContainer: "#"+ filemanager.attr("id") +" #previews",
                clickable: "#"+ filemanager.attr("id") +" .fileinput-button",
                maxFiles: settings.upload_max,
                // maxFilesize: 2
                parallelUploads: settings.upload_max,
                uploadMultiple: true,
                acceptedFiles: settings.ext.join(",."),
                dictInvalidFileType: translate("BE_GETFILEALL_NOT_PERMITIDO"),
            });
            myDropzone.on("addedfile", function(file) {
                $("#error-all",filemanager).html('');
            });
            myDropzone.on("maxfilesexceeded", function(file) { this.removeFile(file); });
            myDropzone.on("totaluploadprogress", function(progress) {
                $("#total-progress .progress-bar",filemanager).width(progress + "%");
            });
            myDropzone.on("sending", function(file) {
                $("#total-progress",filemanager).css('opacity',1);
            });
            myDropzone.on("queuecomplete", function(progress) {
                $("#total-progress",filemanager).css('opacity',0);
            });
            myDropzone.on("processing", function(file) {
            });
            myDropzone.on("processingmultiple", function(file) {
                var datos = {action:"uploadfile", path : $("#path",filemanager).val()};
                if(settings.token!==null) datos[settings.tokenName] = settings.token;
                if(settings.typeFile!==null) datos.typeFile = settings.typeFile;
                this.options.params = datos;
            });
            myDropzone.on("success", function(file, responseText, e) {
                var datos = responseText;
                if (typeof datos === 'string')
                    datos = $.parseJSON(responseText);
                if(datos.status==1){
                    $("#reloadfiles",filemanager).val(1);
                }
            });
            myDropzone.on("successmultiple", function(file, responseText, e) {
                var datos = responseText;
                if (typeof datos === 'string')
                    datos = $.parseJSON(responseText);
                var msg = filemanager.parseMsg(datos.msg);
                if(datos.status==0)
                    $("#error-all",filemanager).html('<div class="alert alert-info">'+msg+'</div>');
                else
                    $("#error-all",filemanager).html('<div class="alert alert-success">'+msg+'</div>');
            });
            $("#actions .start",filemanager).on('click', function(event) {
                event.preventDefault();
                myDropzone.enqueueFiles(myDropzone.getFilesWithStatus(Dropzone.ADDED));
            });
            $("#actions .cancel",filemanager).on('click', function(event) {
                event.preventDefault();
                myDropzone.removeAllFiles(true);
                $("#error-all",filemanager).html('');
            });
            // END DROPZONE
            // $("body").append(settings.getModalTemplate({modal_id:"new",header:false,footer:false}));
            // BEGIN TRADUCIR
            _html = $(".panel-heading, button, span, label, h4, h3, #row_header_content .col, #context-menu a",filemanager);
            _html.text(function(index,text){
                return translate(text);
            });
            _html = $("input[type='text'], button",filemanager);
            _html.attr({
                "placeholder" : function(index,text){return translate(text);},
                "title" : function(index,text){return translate(text);}
            });
            $("#upload_max",filemanager).text(function(index,text){
                return translate(text) + settings.upload_max;
            });
            // END TRADUCIR
            // BEGIN TOKEN
            if(settings.token){
                $(filemanager).append('<input type="hidden" id="token" name="'+settings.tokenName+'" value="'+settings.token+'" />');
            }
            // END TOKEN
            // BEGIN SEARCH
            $("#search",filemanager).on('keyup click', function(){
                filemanager.searchFiles();
            });
            $("#search_clear",filemanager).on('click', function(event) {
                $("#search",filemanager).val('');
                filemanager.searchFiles();
            });
            // END SEARCH
            // BEGIN VIEWS
            if(settings.views=='thumbs'){
                $("#view_thumbs",filemanager).addClass('active');
                $("#view_details",filemanager).removeClass('active');
                $("#content_list",filemanager).removeClass('view_detalles');
            }else if(settings.views=='details'){
                $("#view_thumbs",filemanager).removeClass('active');
                $("#view_details",filemanager).addClass('active');
                $("#content_list",filemanager).addClass('view_detalles');
            }
            $("#view_thumbs",filemanager).on('click',  function(event) {
                $("#view_thumbs",filemanager).addClass('active');
                $("#view_details",filemanager).removeClass('active');
                $("#content_list",filemanager).removeClass('view_detalles');
                $(".item .col.name",filemanager).each(function(index, el) {
                    var ori = $(el).attr('data-name');
                    var des = $(el).find('.texto').text();
                    $(el).attr('data-name',des).find('.texto').text(ori);
                });
            });
            $("#view_details",filemanager).on('click',  function(event) {
                $("#view_thumbs",filemanager).removeClass('active');
                $("#view_details",filemanager).addClass('active');
                $("#content_list",filemanager).addClass('view_detalles');
                $(".item .col.name",filemanager).each(function(index, el) {
                    var ori = $(el).attr('data-name');
                    var des = $(el).find('.texto').text();
                    $(el).attr('data-name',des).find('.texto').text(ori);
                });
            });
            // END VIEWS
            // BEGIN ADD EVENT TO UI
            $("#ruta",filemanager).on('click', 'a', function(event) {
                event.preventDefault();
                filemanager.getFolder($(this).attr('rel'));
            });
            $('[data-tooltip="tooltip"]',filemanager).tooltip();
            $("#"+filemanager.config.move_popup,filemanager).on('show.bs.modal', function (e) {
                $("#"+filemanager.config.move_popup+" #name",filemanager).val('');
                $("#"+filemanager.config.move_popup+" .result",filemanager).html('');
                var button = $(e.relatedTarget);
                var name = button.data('name');
                var modal = $(this);
                modal.find('.modal-body .content input[name="name"]').val(name);
                modal.find('.modal-body .content input[name="nameold"]').val(name);
                modal.find('.modal-body .result').html('');
            });
            $("#"+filemanager.config.move_popup+" form",filemanager).validate({
                rules:{
                    name:{
                        required:true,
                        minlength:1
                    }
                },
                submitHandler: function(form) {
                    var path = $("#path",filemanager).val();
                    var datos = {action:"movefile",path:path};
                    if(settings.token!==null) datos[settings.tokenName] = settings.token;
                    if(settings.typeFile!==null) datos.typeFile = settings.typeFile;
                    datos = $.param(datos) +'&'+ $(form).serialize();
                    $.ajax({
                        headers: headersCustom,
                        type: "POST",
                        url: settings.url,
                        data :  datos,
                        beforeSend: function(objeto){
                            $("#"+filemanager.config.move_popup+" form .result",filemanager).html('<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div></div>');
                        },
                        success: function(datos){
                            if (typeof datos === 'string')
                                datos = $.parseJSON(datos);
                            var msg = filemanager.parseMsg(datos.msg);
                            if(datos.status==1){
                                filemanager.getFolder(path);
                                $("#"+filemanager.config.move_popup+" form .result",filemanager).html('<div class="alert alert-success">'+ msg +'<br>'+datos.data.namefile+'</div>');
                                $("#"+filemanager.config.move_popup+" form input[name='nameold']",filemanager).val(datos.data.namefile);
                            }else{
                                $("#"+filemanager.config.move_popup+" form .result",filemanager).html('<div class="alert alert-info">'+ msg +'</div>');
                            }
                        }
                    });
                }
            });

            $("#"+filemanager.config.rename_popup,filemanager).on('show.bs.modal', function (e) {
                $("#"+filemanager.config.rename_popup+" #name",filemanager).val('');
                $("#"+filemanager.config.rename_popup+" .result",filemanager).html('');
                var button = $(e.relatedTarget);
                var name = button.data('name');
                var modal = $(this);
                modal.find('.modal-body .content input[name="name"]').val(name);
                modal.find('.modal-body .content input[name="nameold"]').val(name);
                modal.find('.modal-body .result').html('');
            });
            $("#"+filemanager.config.rename_popup+" form",filemanager).validate({
                rules:{
                    name:{
                        required:true,
                        minlength:1
                    }
                },
                submitHandler: function(form) {
                    var path = $("#path",filemanager).val();
                    var datos = {action:"renamefile",path:path};
                    if(settings.token!==null) datos[settings.tokenName] = settings.token;
                    if(settings.typeFile!==null) datos.typeFile = settings.typeFile;
                    datos = $.param(datos) +'&'+ $(form).serialize();
                    $.ajax({
                        headers: headersCustom,
                        type: "POST",
                        url: settings.url,
                        data :  datos,
                        beforeSend: function(objeto){
                            $("#"+filemanager.config.rename_popup+" form .result",filemanager).html('<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div></div>');
                        },
                        success: function(datos){
                            if (typeof datos === 'string')
                                datos = $.parseJSON(datos);
                            var msg = filemanager.parseMsg(datos.msg);
                            if(datos.status==1){
                                filemanager.getFolder(path);
                                $("#"+filemanager.config.rename_popup+" form .result",filemanager).html('<div class="alert alert-success">'+ msg +'</div>');
                                $("#"+filemanager.config.rename_popup+" form input[name='nameold']",filemanager).val(datos.data.namefile);
                                $("#"+filemanager.config.rename_popup+" form input[name='name']",filemanager).val(removeExtension(datos.data.namefile));
                            }else{
                                $("#"+filemanager.config.rename_popup+" form .result",filemanager).html('<div class="alert alert-info">'+ msg +'</div>');
                            }
                        }
                    });
                }
            });
            $("#select_delete_popup",filemanager).on('click', function(event) {
                $("#"+filemanager.config.delete_popup+" form .result",filemanager).html('');
                var ic = $this.find('.item.active');
                if(ic.length>0){
                    var modal = $('#'+filemanager.config.delete_popup,filemanager);
                    var r = '';
                    $.each(ic, function(index, val) {
                        r = r + '<p class="filename_delete">'+ $(val).find('.name').data('name-original') +'</p><input type="hidden" name="name[]" value="'+ $(val).find('.name').data('name-original') +'" />';
                    });
                    modal.find('.modal-body .content').html(r);
                    $('#'+filemanager.config.delete_popup,filemanager).modal('show');
                }else{
                    return false;
                }
            });
            $("#"+filemanager.config.delete_popup+" form",filemanager).validate({
                submitHandler: function(form) {
                    var path = $("#path",filemanager).val();
                    var datos = {action:"deletefile",path:path};
                    if(settings.token!==null) datos[settings.tokenName] = settings.token;
                    if(settings.typeFile!==null) datos.typeFile = settings.typeFile;
                    datos = $.param(datos) +'&'+ $(form).serialize();
                    $.ajax({
                        headers: headersCustom,
                        type: "POST",
                        url: settings.url,
                        data :  datos,
                        beforeSend: function(objeto){
                            $("#"+filemanager.config.delete_popup+" form .result",filemanager).html('<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div></div>');
                        },
                        success: function(datos){
                            if (typeof datos === 'string')
                                datos = $.parseJSON(datos);
                            var msg = filemanager.parseMsg(datos.msg);
                            if(datos.status==1){
                                $("#"+filemanager.config.delete_popup+" form .result",filemanager).html('');
                                var data = datos.data;
                                if(data.length>0){
                                    $.each(data, function(index, val) {
                                        $("#"+filemanager.config.delete_popup+" form .content p",filemanager).each(function(index2, val2) {
                                            var t = $(val2).clone().children().remove().end().text().trim();
                                            if(t==val.namefile){
                                                $(val2).find('span').remove();
                                                if(val.status==1){
                                                    $(val2).append(' <span class="text-success"><span aria-hidden="true" class="glyphicon glyphicon-ok"></span>'+ filemanager.parseMsg(val)+'</span>');
                                                }
                                                else if(val.status==0){
                                                    $(val2).append(' <span class="text-info"><span aria-hidden="true" class="glyphicon glyphicon-alert"></span>'+ filemanager.parseMsg(val)+'</span>');
                                                }
                                                return false;
                                            }
                                        });
                                    });
                                }else{
                                    $("#"+filemanager.config.delete_popup+" form .result",filemanager).html('<div class="alert alert-success">'+ msg +'</div>');
                                }
                                filemanager.getFolder(path);
                            }else{
                                $("#"+filemanager.config.delete_popup+" form .result",filemanager).html('<div class="alert alert-info">'+ msg +'</div>');
                            }
                        }
                    });
                }
            });
            $('#'+filemanager.config.new_folder,filemanager).on('show.bs.modal', function (e) {
                $("#name",filemanager).val('');
                $("#newfolder_popup_result",filemanager).html('');
            });
            $('#'+filemanager.config.new_folder,filemanager).on('shown.bs.modal', function (e) {
                $("#name",filemanager).focus();
            });
            $('#'+filemanager.config.upload_popup,filemanager).on('hide.bs.modal', function (e) {
                $("#error-all",filemanager).html('');
                myDropzone.removeAllFiles(true);
                if($("#reloadfiles",filemanager).val()==1){
                    $("#reloadfiles",filemanager).val(0);
                    filemanager.getFolder($("#path",filemanager).val());
                }
            });
            $("#"+filemanager.config.new_folder+" form",filemanager).validate({
                rules:{
                    name:{
                        required:true,
                        minlength:1
                    }
                },
                submitHandler: function(form) {
                    var path = $("#path",filemanager).val();
                    var datos = {action:"newfolder",path:path};
                    if(settings.token!==null) datos[settings.tokenName] = settings.token;
                    if(settings.typeFile!==null) datos.typeFile = settings.typeFile;
                    datos = $.param(datos) +'&'+ $(form).serialize();
                    $.ajax({
                        headers: headersCustom,
                        type: "POST",
                        url: settings.url,
                        data :  datos,
                        beforeSend: function(objeto){
                            $("#newfolder_popup_result",filemanager).html('<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div></div>');
                        },
                        success: function(datos){
                            if (typeof datos === 'string')
                                datos = $.parseJSON(datos);
                            var msg = filemanager.parseMsg(datos.msg);
                            if(datos.status==1){
                                filemanager.getFolder(path);
                                $("#newfolder_popup_result",filemanager).html('<div class="alert alert-success">'+ msg +'</div>');
                            }else{
                                $("#newfolder_popup_result",filemanager).html('<div class="alert alert-info">'+ msg +'</div>');
                            }
                        }
                    });
            }
            });
            if(settings.insertButton===false) $("#select_insert",filemanager).remove();
            $("#select_insert",filemanager).on('click', function(event) {
                var items = filemanager.insert();
                if(window.parent.$('.filemanager-modal').length>0 && window.parent.$('.filemanager-modal').is('.in') ){
                    window.parent.setData(items);
                    window.parent.closeModal();
                }else if(window.parent.tinymce && window.parent.tinymce.activeEditor !== null && window.parent.tinymce.activeEditor.windowManager && window.parent.tinymce.activeEditor.windowManager.windows.length == 2){
                    var field_name = getParameter('field_name');
                    window.parent.document.getElementById(field_name).value = items[0].url;
                    window.parent.tinymce.activeEditor.windowManager.close();
                }else if (window.opener) {
                    window.opener.setData(items);
                    window.close();
                }
            });
            // END ADD EVENT TO UI
            // BEGIN ADD EVENT TO ITEMS
            $this.on('click',".item .image, .item .col:not(.actions)", function(event) {
                event.preventDefault();
                if($(this).parents('.item').find('a.image').is('.dir')){
                    filemanager.getFolder($(this).parents('.item').find('a.image').attr('rel'));
                }else{
                    filemanager.preview($(this).parents('.item'));
                }
            });
            $this.on('click',".check input", function(event) {
                var instance = $this;
                var checkbox = $(event.target);
                if (event.shiftKey && instance.last) {
                    var checkboxes = instance.find(':checkbox');
                    var from = checkboxes.index(instance.last);
                    var to = checkboxes.index(checkbox);
                    var start = Math.min(from, to);
                    var end = Math.max(from, to) + 1;
                    checkboxes.slice(start, end).filter(':not(:disabled)').prop('checked', checkbox.prop('checked')).trigger('change');
                }
                instance.last = checkbox;
                if($(this).is(':checked'))
                    $(this).parents('.item').addClass('active');
                else
                    $(this).parents('.item').removeClass('active');
                if($this.find('.item.active').length>0){
                    $("#select_delete_popup",filemanager).removeClass('disabled');
                    if($this.find('.item.active').find('a.dir').length ===0 )
                        $("#select_insert",filemanager).removeClass('disabled');
                }else{
                    $("#select_delete_popup",filemanager).addClass('disabled');
                    $("#select_insert",filemanager).addClass('disabled');
                }
            });
            $this.on('change',".check input", function(event) {
                if($(this).is(':checked'))
                    $(this).parents('.item').addClass('active');
                else
                    $(this).parents('.item').removeClass('active');
                if($this.find('.item.active').length>0){
                    $("#select_delete_popup",filemanager).removeClass('disabled');
                    if($this.find('.item.active').find('a.dir').length ===0 )
                        $("#select_insert",filemanager).removeClass('disabled');
                }else{
                    $("#select_delete_popup",filemanager).addClass('disabled');
                    $("#select_insert",filemanager).addClass('disabled');
                }
            });
            // END ADD EVENT TO ITEMS
            // BEGIN LIST OF ITEMS
            filemanager.getFolder();
            // END LIST OF ITEMS
        };
        filemanager.init();
        return filemanager;
    };
}( jQuery ));