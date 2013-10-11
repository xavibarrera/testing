// init lungo
Lungo.init({});

// data model
var ViewModel = function(jsonPersons,jsonLocation) {
    var self = this;
	self.persons = ko.observableArray(jsonPersons);
    self.showMessage = function() {
    	Lungo.Notification.show("ok-sign", "Please wait...",2);
    }
    self.startLocationUpdates = function() {
    	Android.startLocationUpdates();
    }
    self.stopLocationUpdates = function() {
    	Android.stopLocationUpdates();
    }
    self.location = ko.observable(jsonLocation);
};
var myModel;

//Init knockout
function initApp() {
	var sjsonPersons = Android.getJSONPersons();
    var jsonPersons = JSON.parse(sjsonPersons);
    if (jsonPersons !== undefined) {
    	var jsonLocation = {lat:'-',
    						lng:'-',
    						acc:'-',
    						date:'-'
    						};
    	myModel = new ViewModel(jsonPersons,jsonLocation);
    	ko.applyBindings(myModel);
    } 
}
initApp();

// Pull 
var pull_example = new Lungo.Element.Pull('#artList', {
    onPull: "Pull down to refresh",      //Text on pulling
    onRelease: "Release to get new data",//Text on releasing
    onRefresh: "Refreshing...",          //Text on refreshing
    callback: function() {               //Action on refresh
        //alert("Pull & Refresh completed!");
        pull_example.hide();
    }
});

function updateLocation(sjsonLocation) {
	var jsonLocation = JSON.parse(sjsonLocation);
	myModel.location(jsonLocation);
}