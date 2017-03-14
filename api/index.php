<?php
use Api\Test;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use MrMe\Web\Router as Router;
use Api\Controller\Block as Block;
use Api\Controller\User as User;

require_once "CONFIG.php";
$loader = require './vendor/autoload.php';
// $log = new Logger('name');
// $log->pushHandler(new StreamHandler('app.log', Logger::WARNING));
// $log->addWarning('Foo');

//  $x = new Test();

//  echo $x->getText();
//  $x->start();
date_default_timezone_set("Asia/Bangkok");
define("DOMPDF_ENABLE_REMOTE", true);
ini_set('display_startup_errors', $_CONFIG['COMMON']['DEBUG']);
ini_set('display_errors', $_CONFIG['COMMON']['DEBUG']); // set to 0 when not debugging
error_reporting(E_ALL | ~E_NOTICE);


$router = new Router($_CONFIG);
$router->route("block/{F}", new Block());
$router->route("user/{F}", new User());
// $router->route("order/{F}", new Order());
// $router->route("package/{F}", new Package());
// $router->route("setting/booking/disable/{F}", new Setting());
// $router->route("subscribe/{F}", new Subscribe());
//$router->begin();

$router->start();
?>
