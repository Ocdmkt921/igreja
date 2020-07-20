<?php    

    function connection() {

        include './config.php';

        $hostname = $config['hostname'];
        $username = $config['username'];
        $password = $config['password'];
        $database = $config['database'];

        $options = array(
            PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',
        ); 
        $conn = new PDO("mysql:host=$hostname;dbname=$database", $username, $password, $options);
        return $conn;

    }