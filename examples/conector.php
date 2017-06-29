<?php
include("../../filemanager-php/vendor/autoload.php");
use GuillermoMartinez\Filemanager\Filemanager;

// Add your own authentication method
//if(!isset($_SESSION['username']) || $_SESSION['username']!="")
//  exit();
$extra = array(
    // path after of root folder
    // if /var/www/public_html is your document root web server
    // then source= usefiles o filemanager/usefiles
    "source" => "github/filemanager-php/userfiles",
    // url domain
    // so that the files and show well http://php-filemanager.rhcloud.com/userfiles/imagen.jpg
    // o http://php-filemanager.rhcloud.com/filemanager/userfiles/imagen.jpg
    "url" => "http://localhost/",
    "debug" => true,
    "images" => [
        'resize'=>[
            'medium' => array(500,500,true,null),
            'other' => array(500,500,null,true),
            'large' => array(1024,768,true,true),
        ]
    ]
    );
if(isset($_POST['typeFile']) && $_POST['typeFile']=='images'){
    $extra['type_file'] = 'images';
}
$f = new Filemanager($extra);
$f->run();
?>