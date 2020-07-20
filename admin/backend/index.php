<?php

    include './connection.php';


    class DefaultController {

        private $conn;

        function __construct()
        {

            $this->conn = connection();
            
        }

        function getWeekdays() {

            $sql = "SELECT weekday, count(id) as records FROM schedule GROUP BY weekday ORDER BY sortOrder";
            $stmt = $this->conn->query($sql);
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        }

        function addSchedule() {

            $weekday_names = array(
                'mon' => 'Domingo',
                'mon' => 'Segunda',
                'tue' => 'Terça',
                'wed' => 'Quarta',
                'thu' => 'Quinta',
                'fri' => 'Sexta',
                'sat' => 'Sábado'
            );
            
            $weekday = $_POST['weekday'];
            $timeAt = $_POST['timeAt'];
            $capacity = $_POST['capacity'];
            $exceptDays = $_POST['exceptDays'];

            $this->conn->beginTransaction();

            $exceptDaysString = array_map(function($day) { return $day['day'];}, $exceptDays);
            $exceptDaysString = implode(',', $exceptDaysString);

            $sql = "INSERT INTO schedule(weekday, timeAt, capacity, except_days) VALUES(?, ?, ?, ?)";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([ $weekday, $timeAt, $capacity, $exceptDaysString ]);
            if($stmt->errorCode() !== '00000') {
                $this->conn->rollBack();
                throw new \Exception($stmt->errorInfo()[2]);
            }                

            $sql = "INSERT INTO lead_lists(schedule_id, is_published, date_added, created_by, created_out_by_user, date_modified, modified_by_user, checked_by_user, name, alias,  is_global, is_preference_center)
                VALUES(:schedule_id, 1, NOW(), 1, :created_by_user, NOW(), :modified_by_user, :checked_by_user, :name, :alias,  1, 0)";
        
            $date = new DateTime($timeAt);
            $hour = $date->format("H\hi");

            $lead_list_name = strtolower($weekday_names[$weekday]) . "-" . $hour;
            $username = 'iasd admin';
            $schedule_id = $this->conn->lastInsertId();
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([ 
                'schedule_id' => $schedule_id, 
                'created_by_user' => $username, 
                'modified_by_user' => $username, 
                'checked_by_user' => $username, 
                'name' => $lead_list_name, 
                'alias' => $lead_list_name
            ]);

            if($stmt->errorCode() !== '00000') {
                $this->conn->rollBack();
                throw new \Exception($stmt->errorInfo()[2]);
            }

            $this->conn->commit();

            return 'OK';

        }

        function getSchedule() {

            $weekday = $_GET['weekday'];

            $sql = "SELECT a2.id, a2.weekday, a2.timeAt, a2.capacity, a2.exceptDays FROM lead_lists as a1 
                LEFT JOIN schedule as a2 ON a1.schedule_id = a2.id
                WHERE weekday = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$weekday]);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $result;

        }

    }

    try {

        $action = $_GET['action'];
        $method = strtolower($_SERVER['REQUEST_METHOD']);
        
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, X-Token-Auth, Authorization, x-store-code, x-xsrf-token");

        if($method === 'options' )
            exit;
        
        $resources = array(
            'weekday' => array(
                'get' => 'getWeekdays'
            ),
            'schedule' => array(
                'post' => 'addSchedule',
                'get' => 'getSchedule'
            )
        );

        if(!array_key_exists($action, $resources))
            throw new \Exception('Recurso não encontrado');

        $actions = $resources[$action];

        if(!array_key_exists($method, $actions))
            throw new \Exception('Ação não encontrada');

        $controller = new DefaultController();
        $function = $actions[$method];
        $result = $controller->$function();

        header("content-type: application/json");
        echo json_encode($result);

    } catch(\Exception $err) {
        http_response_code(500);
        echo $err->getMessage();
    }