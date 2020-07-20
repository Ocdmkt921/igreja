<?php

    include './map.php';

    function getPlaces() {
        return 90;
    }

    function connection() {

        $conn = new PDO('mysql:dbname=tsmai587_igreja;host=localhost', 'tsmai587_webuser', 'webuser9009');
        return $conn;

    }

    function getCheckIn() {

        ini_set('display_errors', 1);
        $conn = connection();
        /*$maps = getSegments();
        $schedules = getSchedule();*/
        $days = array(
            'domingo',
            'segunda',
            'terça',
            'quarta',
            'quinta',
            'sexta',
            'sabado'
        );

        $date_now = new \DateTime();
        $weekday = (int) $date_now->format("w");
        $now = (int) $date_now->format("H");

        $next_days = array_slice($days, $weekday);

        foreach($next_days as $index=>$day) {

            $sql = "SELECT id, name FROM lead_lists WHERE name like '%$day%' AND is_published = 1";
            $stmt = $conn->query($sql);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($stmt->rowCount() > 0) {

                $matches = array();
                preg_match('/(\d{2})h(\d{2})/', $result['name'], $matches);
                $hour = (int) $matches[1];
                
                //if(($index * $hour) > ($weekday * $now)) {

                    $lead_id = $result['id'];
                    $email = $_GET['email'];
                    $sql = "SELECT count(*) as records FROM lead_lists_leads as a1
                        LEFT JOIN leads as a2 ON lead_id = a2.id
                        WHERE leadlist_id = ? AND a2.email = ?";
                    $stmt = $conn->prepare($sql);
                    $stmt->execute([ $lead_id, $email ]);
                    
                    $result = $stmt->fetch(PDO::FETCH_ASSOC);
                    
                    $records = (int) $result['records'];
                    $places = 0;

                    if($records === 0) {

                        $sql = "SELECT count(*) as places FROM lead_lists_leads WHERE leadlist_id = ?";
                        $stmt = $conn->prepare($sql);
                        $stmt->execute([ $lead_id ]);
                        $result = $stmt->fetch(PDO::FETCH_ASSOC);
                        $places = (int) $result['places'];

                    }

                    return array(
                        'records' => $records, 
                        'places' => $places, 
                        'total_places' => getPlaces()
                    );

                //}
                
            }

        }

        return false;       

    }

    function getUserByEmail() {

        $conn = connection();
        $maps = getSegments();

        $email = $_GET['email'];
        $form_id = $_GET['formId'];
        $leadlist_id = $maps[$form_id];

        $sql = "SELECT count(*) as records FROM lead_lists_leads as a1 
            LEFT JOIN leads as a2 ON a1.lead_id = a2.id
        WHERE a2.email = ? AND leadlist_id = ?";
        
        $stmt = $conn->prepare($sql);        
        $stmt->execute([ $email, $leadlist_id ]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result;
    }

    function getTotalUser() {

        $conn = connection();       
        $maps = getSegments();
        $results = [];
        
        foreach($maps as $segment_id)  {

            $sql = "SELECT count(*) as records FROM lead_lists_leads WHERE leadlist_id = ?";
        
            $stmt = $conn->prepare($sql);
            $stmt->execute([$segment_id]);
            $results[] = $stmt->fetch(PDO::FETCH_ASSOC);
             
        }
        
        return $results;

    }

    function deleteUserByEmail() {        

        $conn = connection();       
        //$maps = getSegments();

        $email = $_GET['email'];
        $segment_id = $_GET['segment_id'];

        $sql = "SELECT id FROM leads WHERE email = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([ $email ]);
        
        if($stmt->rowCount() === 0)
            return array('message' => 'Nenhuma usuário encontrado com email informado', 'type' => 'FAIL');
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $lead_id = $result['id'];

        $sql = "DELETE FROM lead_lists_leads WHERE leadlist_id = ? AND lead_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([ $segment_id, $lead_id ]);

        if($stmt->rowCount() === 0)
            return array('message' => 'Nenhuma reserva encontrara para o email fornecido', 'type' => 'FAIL');
                
        return array('type' => 'OK');

    }

    try {

        $action = $_GET['action'];
        $method = $_SERVER['REQUEST_METHOD'];
        //var_dump($method); exit;
        
        $resources = array(
            'segment' => array(
                'GET' => 'getUserByEmail',
                'DELETE' => 'deleteUserByEmail'
            ),
            'total-segment' => array(
                'GET' => 'getTotalUser'
            ),
            'check-in' => array(
                'GET' => 'getCheckIn'
            )
        );

        if(!array_key_exists($action, $resources))
            throw new \Exception('Recurso não encontrado');

        $actions = $resources[$action];

        if(!array_key_exists($method, $actions))
            throw new \Exception('Ação não encontrada');

        $function = $actions[$method];

        $result = $function();

        header("content-type: application/json");
        echo json_encode($result);

    } catch(\Exception $err) {
        http_response_code(500);
        echo $err->getMessage();
    }