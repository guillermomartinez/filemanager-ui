# Filemanager UI
Es la interfaz del Administrador de archivos, https://github.com/guillermomartinez/filemanager-php es el conector de php.
##Ejemplos
* [Basic](http://php-filemanager.rhcloud.com/examples/basic.html)
* [Multiple](http://php-filemanager.rhcloud.com/examples/basic.html)
* [Popup](http://php-filemanager.rhcloud.com/examples/popup.html)
* [Popup advanced](http://php-filemanager.rhcloud.com/examples/popup_advanced.html)
* [Tinymce](http://php-filemanager.rhcloud.com/examples/tinymce.html)


##Instalación
Descarga https://github.com/guillermomartinez/filemanager-ui/archive/master.zip
```
composer require guillermomartinez/filemanager-php:0.1.*
```

Crear un archivo conector.php

:exclamation: **No olvides agregar tu metodo de autenticación.**
```
<?php
include("vendor/autoload.php");
use GuillermoMartinez\Filemanager\Filemanager;

// Add your own authentication method

$extra = array(
	// path after of root folder
	"source" => "userfiles",
	// url domain
	"url" => "http://php-filemanager.rhcloud.com/",
	"debug" => false,
	);
if(isset($_POST['typeFile']) && $_POST['typeFile']=='images'){
	$extra['type_file'] = 'images';
}
$f = new Filemanager($extra);
$f->run();
?>
```

Crear un archivo index.html
```
<!DOCTYPE html>
<html lang="es">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Filemanager ui</title>
	<link rel="stylesheet" type="text/css" href="../js/filemanager-ui/dist/css/filemanager-ui.min.css">
</head>
<body>
	<div id="filemanager1" class="filemanager"></div>	
	
	<script type="text/javascript" src="../js/filemanager-ui/dist/js/filemanager-ui.min.js"></script>	
	<script type="text/javascript">
		$(function() {
			$("#filemanager1").filemanager({
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

## Demo
http://php-filemanager.rhcloud.com/

![demo2](https://cloud.githubusercontent.com/assets/5642429/8630887/aec46114-2731-11e5-9a7b-907127d77891.jpg)
![demo1](https://cloud.githubusercontent.com/assets/5642429/8630885/ae7e7122-2731-11e5-88bb-b8fd2f5ae9a5.jpg)
![demo3](https://cloud.githubusercontent.com/assets/5642429/8630886/aeaa1b7e-2731-11e5-9097-cafeefba1aea.jpg)
