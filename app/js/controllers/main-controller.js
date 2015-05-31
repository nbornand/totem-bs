var app = angular.module("totems",[]);

app.controller("main", function($scope, $http){

    $scope.test = "working";

    $http.get('http://nbornand.ch/totems/data/animals.php').success(function(data){
        console.log(data);
    })

});