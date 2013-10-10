var app = angular.module('ngPersons', ['ng'])
console.log('ueeeeeee');
app.controller("personsController", function($scope, $http){
 
	console.log('ueeeeeee');
   $scope.persons = [{age:30,name:'Xavi1'},{age:32,name:'Xavi3'}];
   $scope.init = function() {
	   
	    var sjsonPersons = Android.getJSONPersons();
	    var jsonPersons = JSON.parse(sjsonPersons);
	    if (jsonPersons !== undefined) {
	    	 $scope.persons = jsonPersons;
	    } 
    };
    $scope.addPlayer = function() {
    	$scope.persons.unshift({age:0,name:'New PLayer'}); 
    };
 
});

setTimeout(function(){
	var bodyDom = document.getElementById('myBody');
	var scope = angular.element(bodyDom).scope();
    scope.$apply(function(){
        scope.persons.push({age:30,name:'Xavi1'});
    })

},5000)
