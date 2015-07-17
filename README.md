# Filemanager UI
It is the graphical user interface File Manager, https://github.com/guillermomartinez/filemanager-php It is the connector for php.
##Examples
* [Basic](http://php-filemanager.rhcloud.com/examples/basic.html)
* [Multiple](http://php-filemanager.rhcloud.com/examples/multiple.html)
* [Popup](http://php-filemanager.rhcloud.com/examples/popup.html)
* [Popup advanced](http://php-filemanager.rhcloud.com/examples/popup_advanced.html)
* [Tinymce](http://php-filemanager.rhcloud.com/examples/tinymce.html)


##Installation of Filemanager UI
Create a folder of name filemanager within your public_html folder
Download https://github.com/guillermomartinez/filemanager-ui/archive/master.zip
o
```
bower install --save filemanager-ui
```

Create file index.html
```
<!DOCTYPE html>
<html lang="es">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Filemanager ui</title>
	<link rel="stylesheet" type="text/css" href="/js/filemanager-ui/dist/css/filemanager-ui.min.css">
</head>
<body>
	<div id="filemanager1" class="filemanager"></div>	
	
	<script type="text/javascript" src="/js/filemanager-ui/dist/js/filemanager-ui.min.js"></script>	
	<script type="text/javascript">
		$(function() {
			$("#filemanager1").filemanager({
				// Url absolute of file conector,
				url:'http://php-filemanager.rhcloud.com/conector.php',
				languaje: "ES",
				upload_max: 5,
				views:'thumbs',
				insertButton:true,
				token:'jashd4a5sd4sa'
			});
		});
	</script>
</body>
</html>
```

##Installation of Filemanager for PHP

```
composer require guillermomartinez/filemanager-php:0.1.*
```

Create file conector.php

:exclamation: **Please add your method of authentication.**
```
<?php
include("vendor/autoload.php");
use GuillermoMartinez\Filemanager\Filemanager;

// Add your own authentication method
//if(!isset($_SESSION['username']) || $_SESSION['username']!="")
//	exit();
$extra = array(
	// path after of root folder
	// if /var/www/public_html is your document root web server
	// then source= usefiles o filemanager/usefiles
	"source" => "userfiles",
	// url domain
	// so that the files and show well http://php-filemanager.rhcloud.com/userfiles/imagen.jpg
	// o http://php-filemanager.rhcloud.com/filemanager/userfiles/imagen.jpg
	"url" => "http://php-filemanager.rhcloud.com/"
	);
if(isset($_POST['typeFile']) && $_POST['typeFile']=='images'){
	$extra['type_file'] = 'images';
}
$f = new Filemanager($extra);
$f->run();
?>
```

##Integration with laravel
```
composer require guillermomartinez/filemanager-php:0.1.*
```

Create Controller FilemanagerController.php
```
<?php namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use GuillermoMartinez\Filemanager\Filemanager;

class FilemanagerController extends Controller {
	public function __construct(){
		// $this->middleware('auth');
	}
	public function getIndex()
	{
		return view('filemanager');
	}
	public function getConnection()
	{
		$extra = array(
		    // path after of root folder
		    // if /var/www/public_html is your document root web server
		    // then source= usefiles o filemanager/usefiles
		    "source" => "github/filemanagertest/laravel/public/userfiles",
		    // url domain
		    // so that the files and show well http://php-filemanager.rhcloud.com/userfiles/imagen.jpg
		    // o http://php-filemanager.rhcloud.com/filemanager/userfiles/imagen.jpg
		    "url" => "http://localhost/",
		    );						
		$f = new Filemanager($extra);
		$f->run();
	}
	public function postConnection()
	{
		$extra = array(
		    // path after of root folder
		    // if /var/www/public_html is your document root web server
		    // then source= usefiles o filemanager/usefiles
		    "source" => "github/filemanagertest/laravel/public/userfiles",
		    // url domain
		    // so that the files and show well http://php-filemanager.rhcloud.com/userfiles/imagen.jpg
		    // o http://php-filemanager.rhcloud.com/filemanager/userfiles/imagen.jpg
		    "url" => "http://localhost/",
		    );
		if(isset($_POST['typeFile']) && $_POST['typeFile']=='images'){
		    $extra['type_file'] = 'images';
		}
		$f = new Filemanager($extra);
		$f->run();
	}
}
```
Create view filemanager.blade.php
```
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Filemanager ui</title>
    <link rel="stylesheet" type="text/css" href="{{url('/')}}/bower_components/filemanager-ui/dist/css/filemanager-ui.min.css">
</head>
<body>
    <div id="filemanager1" class="filemanager"></div>   

    <script type="text/javascript" src="{{url('/')}}/bower_components/filemanager-ui/dist/js/filemanager-ui.min.js"></script>   
    <script type="text/javascript">
        $(function() {
            $("#filemanager1").filemanager({
                url:'{{url("/")}}/filemanager/connection',
                languaje: "ES",
                upload_max: 5,
                views:'thumbs',
                insertButton:true,
                token:"{{csrf_token()}}"
            });
        });
    </script>
</body>
</html>
```

routes.php
```
Route::controller('/filemanager','FilemanagerController');
```

##Demo
http://php-filemanager.rhcloud.com/

![demo2](https://cloud.githubusercontent.com/assets/5642429/8630887/aec46114-2731-11e5-9a7b-907127d77891.jpg)
![demo1](https://cloud.githubusercontent.com/assets/5642429/8630885/ae7e7122-2731-11e5-88bb-b8fd2f5ae9a5.jpg)
![demo3](https://cloud.githubusercontent.com/assets/5642429/8630886/aeaa1b7e-2731-11e5-9097-cafeefba1aea.jpg)
