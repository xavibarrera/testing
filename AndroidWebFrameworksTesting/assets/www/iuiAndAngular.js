var app = angular.module('ngPersons', ['ng'])
app.controller("personsController", function($scope, $http){
 
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

function disableButton() {
	var grayButton = document.getElementById('iuiGrayBtn');
	grayButton.disabled = true;
}

setTimeout(function(){
	var bodyDom = document.getElementById('iuiBody');
	var scope = angular.element(bodyDom).scope();
    scope.$apply(function(){
        scope.persons.push({age:30,name:'Xavi1'});
    })

},5000)
