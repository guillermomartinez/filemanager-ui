(function ( $ ) {
 
    $.fn.filemanager = function( options ) {
        var defaults = {
            url: "../conector.php",
            languaje: "ES",
            upload_max: 5,
            view: 'thumbs',
            ext: ".jpg,.jpeg,.gif,.png,.svg,.txt,.pdf,.odp,.ods,.odt,.rtf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.ogv,.mp4,.webm,.m4v,.ogg,.mp3,.wav,.zip,.rar",
            insertButton: false
        };
        var settings = $.extend({}, defaults, options );
        var LANG = {};        
        $.each(LANGS, function(index, val) {
            if(settings.languaje.toUpperCase() == index){
                LANG = val;
                return false;
            }
        });

        var $this = this;

        function parseMsg(obj){
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

        function formatBytes(bytes) {
            if(bytes < 1024) 
                return bytes + " Bytes";
            else if(bytes < 1048576) 
                return(bytes / 1024).toFixed(3) + " KB";
            else if(bytes < 1073741824) 
                return(bytes / 1048576).toFixed(3) + " MB";
            else 
                return(bytes / 1073741824).toFixed(3) + " GB";
        }
        function substr_replace(str, replace, start, length) {
          //  discuss at: http://phpjs.org/functions/substr_replace/
          // original by: Brett Zamir (http://brett-zamir.me)
          //   example 1: substr_replace('ABCDEFGH:/MNRPQR/', 'bob', 0);
          //   returns 1: 'bob'
          //   example 2: $var = 'ABCDEFGH:/MNRPQR/';
          //   example 2: substr_replace($var, 'bob', 0, $var.length);
          //   returns 2: 'bob'
          //   example 3: substr_replace('ABCDEFGH:/MNRPQR/', 'bob', 0, 0);
          //   returns 3: 'bobABCDEFGH:/MNRPQR/'
          //   example 4: substr_replace('ABCDEFGH:/MNRPQR/', 'bob', 10, -1);
          //   returns 4: 'ABCDEFGH:/bob/'
          //   example 5: substr_replace('ABCDEFGH:/MNRPQR/', 'bob', -7, -1);
          //   returns 5: 'ABCDEFGH:/bob/'
          //   example 6: substr_replace('ABCDEFGH:/MNRPQR/', '', 10, -1)
          //   returns 6: 'ABCDEFGH://'

          if (start < 0) { // start position in str
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
            // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            // improved by: Gabriel Paderni
            // improved by: Philip Peterson
            // improved by: Simon Willison (http://simonwillison.net)
            // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            // improved by: Onno Marsman
            // improved by: Brett Zamir (http://brett-zamir.me)
            //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
            // bugfixed by: Anton Ongson
            // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            // bugfixed by: Oleg Eremeev
            //    input by: Onno Marsman
            //    input by: Brett Zamir (http://brett-zamir.me)
            //    input by: Oleg Eremeev
            //        note: The count parameter must be passed as a string in order
            //        note: to find a global variable in which the result will be given
            //   example 1: str_replace(' ', '.', 'Kevin van Zonneveld');
            //   returns 1: 'Kevin.van.Zonneveld'
            //   example 2: str_replace(['{name}', 'l'], ['hello', 'm'], '{name}, lars');
            //   returns 2: 'hemmo, mars'
            // bugfixed by: Glen Arason (http://CanadianDomainRegistry.ca)
            //   example 3: str_replace(Array('S','F'),'x','ASDFASDF');
            //   returns 3: 'AxDxAxDx'
            // bugfixed by: Glen Arason (http://CanadianDomainRegistry.ca) Corrected count
            //   example 4: str_replace(['A','D'], ['x','y'] , 'ASDFASDF' , 'cnt');
            //   returns 4: 'xSyFxSyF' // cnt = 0 (incorrect before fix)
            //   returns 4: 'xSyFxSyF' // cnt = 4 (correct after fix)

            var i = 0,
            j = 0,
            temp = '',
            repl = '',
            sl = 0,
            fl = 0,
            f = [].concat(search),
            r = [].concat(replace),
            s = subject,
            ra = Object.prototype.toString.call(r) === '[object Array]',
            sa = Object.prototype.toString.call(s) === '[object Array]';
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
        function validExt(filename){
            var ext = removeExtension(filename);
            var r = false;
            for (var i = 0; i < settings.ext.length; i++) {
                if(settings.ext[i] === ext){
                    r = true;
                    return false;
                }
            }
            return r;
            
        }
        function removeExtension(filename){
            var lastDotPosition = filename.lastIndexOf(".");
            if (lastDotPosition === -1) return filename;
            else return filename.substr(0, lastDotPosition);
        }
        function traductor(text){
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
        $this.loadFiles = function(data){
            var items = $this;
            items.html('');
            var context_menu = $("#context-menu").clone().html();
            var item = '<li><div class="item context" ><div class="check"><label><input type="checkbox" name="check"></label></div><a class="image" href="#"><img src=""></a><div class="col name"><h3><span class="texto"></span></h3></div><div class="col type"></div><div class="col size"></div><div class="col date"></div><div class="col actions"><div class="btn-group menu_options" data-tooltip="tooltip" data-placement="left" title="Acciones"><button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ><span aria-hidden="true" class="glyphicon glyphicon-tasks" ></button>'+context_menu+'</div></div></div></li>';
            $.each(data,function(index,element){
                el = $(item);                  
                var filename = element.filename;
                var filenameshort = filename;
                var filetype = element.filetype;
                var filesize = formatBytes(element.size);
                var filedate = moment.unix(element.lastmodified).format("DD/MM/YYYY");
                if(element.filename==="" && element.filetype===""){
                    el.find('.image').html('<div class="content_icon"><span aria-hidden="true" class="glyphicon glyphicon-level-up"></span></div>');
                    el.find('.image').addClass('dir').attr('rel',element.urlfolder);
                    el.find('.texto').text(traductor('FE_BACK'));
                    el.find('.type').text('');
                    el.find('.size').text('');
                    el.find('.actions').html('');
                    el.addClass('parentup back');
                    el.find('.item').removeClass('context');
                    el.find('.check').remove();
                }else if(element.filetype===""){
                    el.find('.image').html('<div class="content_icon"><span aria-hidden="true" class="glyphicon glyphicon-folder-close"></span></div>');
                    el.find('.image').addClass('dir').attr('rel',element.urlfolder);
                    el.find('.name').attr('data-name-original',filename).attr('data-name',filename);
                     el.find('.texto').text(filenameshort);
                    el.find('.type').text('dir');
                    el.find('.size').text('');
                    el.find('.date').text(filedate);

                }else if(element.filetype==="jpg" || element.filetype==="png" || element.filetype=="jpeg" || element.filetype=="gif"){
                    el.find('.image img').attr('src',element.preview);
                    el.find('.image').addClass('fancybox').attr('rel',element.previewfull).attr('title',traductor('FE_FILENAME') + element.filename+' | '+ traductor('FE_SIZE') +' '+formatBytes(element.size)+' | '+ traductor('FE_LAST_MODIFIED') +moment.unix(element.lastmodified).format("DD/MM/YYYY"));
                    el.find('.name').attr('data-name-original',filename).attr('data-name',filename);
                     el.find('.texto').text(filenameshort);
                    el.find('.type').text(filetype);
                    el.find('.size').text(filesize);
                    el.find('.date').text(filedate);
                }else{
                    el.find('.image').html('<div class="content_icon"><span aria-hidden="true" class="glyphicon glyphicon-file '+ element.filetype +'" ></span></div>');
                    el.find('.image').addClass('fancybox').attr('rel','#preview_file').attr('title',traductor('FE_FILENAME')+element.filename+' | '+ traductor('FE_SIZE')+formatBytes(element.size)+' | '+traductor('FE_LAST_MODIFIED')+moment.unix(element.lastmodified).format("DD/MM/YYYY"));
                    el.find('.name').attr('data-name-original',filename).attr('data-name',filename);
                     el.find('.texto').text(filenameshort);
                    el.find('.type').text(filetype);
                    el.find('.size').text(filesize);
                    el.find('.date').text(filedate);
                }
                items.append(el);
            });            
        };
        $this.preview = function(item){
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
                    this.title = '<h3>'+ traductor('FE_INFORMATION') +'</h3><div>'+t+'</div';
                },
                helpers : {
                    title : {
                        type : 'inside'
                    }
                }
            }
            );                
        };
         $this.viewRename = function(item){
            $('#rename_popup').modal('show');
            $('#rename_popup').find('#nameold').val(item.find('.name').data('name-original'));
            $('#rename_popup').find('#name').val(removeExtension(item.find('.name').data('name-original')));
        };
         $this.download = function(item){
            var name = item.find('.name').data('name-original');
            var path = $("#path").val();
            window.document.location.href = settings.url+'?accion=download&path='+ path + '&name=' + name;            
        };
         $this.viewDelete = function(item){
            var name = item.find('.name').data('name-original');
            var modal = $('#delete_popup');
            modal.find('.modal-body .content').html('<p>'+ name +'</p><input type="hidden" name="name" value="'+ name +'" />');
            modal.find('.modal-body .result').html('');
            $('#delete_popup').modal('show');            
        };       
        function getFolder(path){
            if(!path) path = '/';
            var datos2 = {accion:"getfolder",path:path};
            $.ajax({
                type: "POST",
                url: settings.url,
                data :  datos2,                          
                beforeSend: function(objeto){
                    $this.html('<div id="loading"></div>');
                },
                success: function(datos){
                    datos = $.parseJSON(datos);
                    if(datos.status){
                        $this.loadFiles(datos.data);

                        $('.context').contextmenu({
                          target:'#context-menu', 
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
                            $this.preview(context);                                
                            }
                            if($(e.target).parent().is('.rename')){
                            $this.viewRename(context);                                
                            }
                            if($(e.target).parent().is('.download')){
                            $this.download(context);                                
                            }
                            if($(e.target).parent().is('.delete')){
                            $this.viewDelete(context);                                
                            }
                          }
                        });
                        $('.menu_options').on('show.bs.dropdown', function (e) {
                          var context = $(this).parents('.item');
                          $(this).find('li').css('display','block');
                          if(context.find('.image.dir').length>0){
                                $(this).find('li.view').css('display','none');
                                $(this).find('li.download').css('display','none');
                            }
                        }).bind('contextmenu', function(event) {
                            return false;
                        });
                        $('.menu_options').on('click', 'li > a', function(event) {
                            event.preventDefault();
                            if($(this).parent().is('.view')){
                            $this.preview($(this).parents('.item'));                                
                            }
                            if($(this).parent().is('.rename')){
                            $this.viewRename($(this).parents('.item'));                                
                            }
                            if($(this).parent().is('.download')){
                            $this.download($(this).parents('.item'));                                
                            }
                            if($(this).parent().is('.delete')){
                            $this.viewDelete($(this).parents('.item'));                                
                            }
                        });
                        // BEGIN VIEWS
                        if($("#view_thumbs").is('.active')){                           
                            $(".item .col.name").each(function(index, el) {
                                var ori = $(el).attr('data-name');
                                var des = $(el).find('.texto').text();
                                $(el).attr('data-name',ori).find('.texto').text(des);
                            });
                        }else if($("#view_details").is('.active')){                           
                            $(".item .col.name").each(function(index, el) {
                                var ori = $(el).attr('data-name');
                                var des = $(el).find('.texto').text();                                
                                $(el).attr('data-name',des).find('.texto').text(ori);
                            });
                        }
                        // END VIEWS
                        $("#path").val(path);
                        var ruta = path.split('/');
                        var temp = [];
                        var n = ruta.length;
                        for (var i = 0; i < n; i++) {
                            if(ruta[i]!==""){
                                temp.push(ruta[i]);
                            }
                        }
                        
                        var rutacontent = $("#ruta");
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
                        searchFiles();
                         
                    }
                },
                error: function(request, textStatus, errorThrown){
                    if (request.status === 0) {
                        $this.html('<div class="alert alert-danger text-center">Not connect: Verify Network.</div>');
                    } else if (request.status == 404) {
                        $this.html('<div class="alert alert-danger text-center">Requested page not found [404]</div>');
                    } else if (request.status == 500) {
                        $this.html('<div class="alert alert-danger text-center">Internal Server Error [500].</div>');
                    } else if (textStatus === 'parsererror') {
                        $this.html('<div class="alert alert-danger text-center">Requested JSON parse failed.</div>');
                    } else if (textStatus === 'timeout') {
                        $this.html('<div class="alert alert-danger text-center">Time out error.</div>');
                    } else if (textStatus === 'abort') {
                        $this.html('<div class="alert alert-danger text-center">Ajax request aborted.</div>');
                    } else {
                        alert('Uncaught Error: ' + request.responseText);
                    }
                }
            });
        } 
        function searchFiles(){
            var text = $("#search").val();
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
        $this.init = function(){
            // BEGIN TRADUCIR
            _html = $(".panel-heading, button, span, label, h4, h3, #row_header_content .col, #context-menu a");
            _html.text(function(index,text){
                return traductor(text);
            });

            _html = $("input[type='text'], button");
            _html.attr({
               "placeholder" : function(index,text){return traductor(text);},
               "title" : function(index,text){return traductor(text);}
            });        

            $("#upload_max").text(function(index,text){
               return traductor(text) + settings.upload_max; 
            });
            // END TRADUCIR
            // BEGIN SEARCH
            $("#search").on('keyup click', function(){
                searchFiles();                  
            });
            $("#search_clear").on('click', function(event) {        
                $("#search").val('');
                searchFiles();                  
            });            
            // END SEARCH 
            // BEGIN DROPZONE
            var previewNode = $("#template");
            previewNode.attr('id','');
            var previewTemplate = previewNode.parent().html();
            previewNode.remove();

            var myDropzone = new Dropzone(document.body, { 
                url: settings.url, // Set the url
                thumbnailWidth: 80,
                thumbnailHeight: 80,
                // parallelUploads: 20,
                previewTemplate: previewTemplate,
                autoQueue: false, 
                previewsContainer: "#previews", 
                clickable: ".fileinput-button", 
                maxFiles: settings.upload_max,
                // maxFilesize: 2
                parallelUploads: settings.upload_max,
                uploadMultiple: true,
                acceptedFiles: settings.ext,
                dictInvalidFileType: traductor("BE_GETFILEALL_NOT_PERMITIDO"),
            });
            
            myDropzone.on("addedfile", function(file) {
                $("#error-all").html('');
            });
            myDropzone.on("maxfilesexceeded", function(file) { this.removeFile(file); });
            myDropzone.on("totaluploadprogress", function(progress) {
                $("#total-progress .progress-bar").width(progress + "%");
            });
            myDropzone.on("sending", function(file) {
                $("#total-progress").css('opacity',1);
            });
            myDropzone.on("queuecomplete", function(progress) {
                $("#total-progress").css('opacity',0);    
            });
            myDropzone.on("processing", function(file) {
            });
            myDropzone.on("processingmultiple", function(file) {
                this.options.params = {accion:"uploadfile", path : $("#path").val()};
            });
            myDropzone.on("success", function(file, responseText, e) {
                var datos = $.parseJSON(responseText);
                if(datos.status){
                $("#reloadfiles").val(1);       
                }
            });
            myDropzone.on("successmultiple", function(file, responseText, e) {
                var datos = $.parseJSON(responseText);
                var msg = parseMsg(datos.msg);
                if(datos.status===false)     
                $("#error-all").html('<div class="alert alert-danger">'+msg+'</div>');
                else
                $("#error-all").html('<div class="alert alert-success">'+msg+'</div>');
            });
            $("#actions .start").on('click', function(event) {
                event.preventDefault();
                myDropzone.enqueueFiles(myDropzone.getFilesWithStatus(Dropzone.ADDED));
            });
            
            $("#actions .cancel").on('click', function(event) {
                event.preventDefault();
                myDropzone.removeAllFiles(true);
                $("#error-all").html('');
            }); 
            // END DROPZONE
            // BEGIN VIEWS
            if(settings.views=='thumbs'){
                $("#view_thumbs").addClass('active');
                $("#view_details").removeClass('active');
                $("#content_list").removeClass('view_detalles');
            }else if(settings.views=='details'){
                $("#view_thumbs").removeClass('active');
                $("#view_details").addClass('active');
                $("#content_list").addClass('view_detalles');       
            }
            $("#view_thumbs").on('click',  function(event) {        
                $("#view_thumbs").addClass('active');
                $("#view_details").removeClass('active');
                $("#content_list").removeClass('view_detalles');
                $(".item .col.name").each(function(index, el) {
                    var ori = $(el).attr('data-name');
                    var des = $(el).find('.texto').text();
                    $(el).attr('data-name',des).find('.texto').text(ori);
                });
            });
            $("#view_details").on('click',  function(event) {        
                $("#view_thumbs").removeClass('active');
                $("#view_details").addClass('active');
                $("#content_list").addClass('view_detalles');
                $(".item .col.name").each(function(index, el) {
                    var ori = $(el).attr('data-name');
                    var des = $(el).find('.texto').text();
                    $(el).attr('data-name',des).find('.texto').text(ori);
                });
            });    
            // END VIEWS
            // BEGIN ADD EVENT TO UI
            $("#ruta").on('click', 'a', function(event) {
                event.preventDefault();
                getFolder($(this).attr('rel'));
            });

            $('[data-tooltip="tooltip"]').tooltip();

            $('#rename_popup').on('show.bs.modal', function (e) {
                $("#rename_popup #name").val('');
                $("#rename_popup .result").html('');
                var button = $(e.relatedTarget);
                var name = button.data('name');
                var modal = $(this);
                modal.find('.modal-body .content input[name="name"]').val(name);     

                modal.find('.modal-body .content input[name="nameold"]').val(name);
                modal.find('.modal-body .result').html('');
            });
            $("#rename_popup_form").validate({
                rules:{
                    name:{
                        required:true,
                        minlength:1
                    }
                },
                submitHandler: function(form) {
                    var path = $("#path").val();
                    var datos = {accion:"renamefile",path:path};            
                    datos = $.param(datos) +'&'+ $(form).serialize();
                    $.ajax({
                        type: "POST",
                        url: settings.url,
                        data :  datos,                          
                        beforeSend: function(objeto){
                            $("#rename_popup_form .result").html('<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div></div>');
                        },
                        success: function(datos){
                            datos = $.parseJSON(datos);
                            var msg = parseMsg(datos.msg);
                            if(datos.status){
                                getFolder(path);
                                $("#rename_popup_form .result").html('<div class="alert alert-success">'+ msg +'</div>');
                                $("#rename_popup_form input[name='nameold']").val(datos.data.namefile);
                                $("#rename_popup_form input[name='name']").val(removeExtension(datos.data.namefile));
                            }else{                                  
                                $("#rename_popup_form .result").html('<div class="alert alert-danger">'+ msg +'</div>');
                            }                               
                        }
                    });
                }
            });
            
            $("#select_delete_popup").on('click', function(event) {
                $("#delete_popup_form .result").html('');                
                var ic = $this.find('.item.active');
                if(ic.length>0){
                    var modal = $('#delete_popup');
                    var r = '';
                    $.each(ic, function(index, val) {
                        r = r + '<p>'+ $(val).find('.name').data('name-original') +'</p><input type="hidden" name="name[]" value="'+ $(val).find('.name').data('name-original') +'" />';
                    });
                    modal.find('.modal-body .content').html(r);
                    $('#delete_popup').modal('show');            
                }else{
                    return false;
                }
            });

            $("#delete_popup_form").validate({
                submitHandler: function(form) {
                    var path = $("#path").val();
                    var datos = {accion:"deletefile",path:path};
                    datos = $.param(datos) +'&'+ $(form).serialize();
                    $.ajax({
                        type: "POST",
                        url: settings.url,
                        data :  datos,                          
                        beforeSend: function(objeto){
                            $("#delete_popup_form .result").html('<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div></div>');
                        },
                        success: function(datos){
                            datos = $.parseJSON(datos);
                            var msg = parseMsg(datos.msg);
                            if(datos.status){
                                $("#delete_popup_form .result").html('');
                                var data = datos.data;
                                if(data.length>0){
                                    $.each(data, function(index, val) {                                        
                                        $("#delete_popup_form .content p").each(function(index2, val2) {
                                            if($(val2).text()===val.namefile){
                                                if(val.status)
                                                    $(val2).append(' <span class="text-success"><span aria-hidden="true" class="glyphicon glyphicon-ok"></span>'+ parseMsg(val)+'</span>');                                                    
                                                else
                                                    $(val2).append(' <span class="text-danger"><span aria-hidden="true" class="glyphicon glyphicon-alert"></span>'+ parseMsg(val)+'</span>');                                                    
                                                return false;
                                            }
                                        });                                        
                                    });
                                }else{
                                    $("#delete_popup_form .result").html('<div class="alert alert-success">'+ msg +'</div>');
                                }                                    
                                getFolder(path);
                            }else{                                  
                                $("#delete_popup_form .result").html('<div class="alert alert-danger">'+ msg +'</div>');
                            }                               
                        }
                    });
                }
            });            

            $('#newfolder_popup').on('show.bs.modal', function (e) {
                $("#name").val('');
                $("#newfolder_popup_result").html('');
            });
            $('#upload_popup').on('hide.bs.modal', function (e) {
                $("#error-all").html('');
                myDropzone.removeAllFiles(true);
              if($("#reloadfiles").val()==1){                                       
                $("#reloadfiles").val(0);
                getFolder($("#path").val());
              }
            });
            $("#form_popup").validate({
                rules:{
                    name:{
                        required:true,
                        minlength:1
                    }
                },
                submitHandler: function(form) {
                    var path = $("#path").val();
                    var datos = {accion:"newfolder",path:path};
                    datos = $.param(datos) +'&'+ $(form).serialize();
                    $.ajax({
                        type: "POST",
                        url: settings.url,
                        data :  datos,                          
                        beforeSend: function(objeto){
                            $("#newfolder_popup_result").html('<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div></div>');
                        },
                        success: function(datos){
                            datos = $.parseJSON(datos);
                            var msg = parseMsg(datos.msg);
                            if(datos.status){
                                getFolder(path);                                 
                                $("#newfolder_popup_result").html('<div class="alert alert-success">'+ msg +'</div>');
                            }else{                                  
                                $("#newfolder_popup_result").html('<div class="alert alert-danger">'+ msg +'</div>');
                            }                   
                        }
                    });
                }
            });
            if(settings.insertButton===false) $("#select_insert").remove();
            $("#select_insert").on('click', function(event) {
                var ic = $this.find('.item.active');
                if(ic.length>0){
                    return ic;
                }else{
                    return false;
                }
            });
            // END ADD EVENT TO UI
            // BEGIN ADD EVENT TO ITEMS
            $this.on('click',".item .image, .item .col:not(.actions)", function(event) {
                event.preventDefault();
                if($(this).parents('.item').find('a.image').is('.dir')){
                    getFolder($(this).parents('.item').find('a.image').attr('rel'));
                }else{
                    $this.preview($(this).parents('.item'));
                }
            });
            $this.on('click',".check input", function(event) {
                // event.preventDefault();                
                if($(this).is(':checked'))
                    $(this).parents('.item').addClass('active');
                else
                    $(this).parents('.item').removeClass('active');
                if($this.find('.item.active').length>0){
                    $("#select_delete_popup").removeClass('disabled');
                    $("#select_insert").removeClass('disabled');
                }
                else{
                    $("#select_delete_popup").addClass('disabled');
                    $("#select_insert").addClass('disabled');
                }
            });
            // END ADD EVENT TO ITEMS
            // BEGIN LIST OF ITEMS
            getFolder();
            // END LIST OF ITEMS
        };
        $this.init();
    };
 
}( jQuery ));