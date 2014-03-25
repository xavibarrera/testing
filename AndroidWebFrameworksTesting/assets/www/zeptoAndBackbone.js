// Model definition
var Person = Backbone.Model.extend({
	defaults: {
		name:'Unknown',
		age:0
	}
});

// Collection of model instances
Persons = Backbone.Collection.extend({
	model: Person
});
var persons = new Persons();


function initData() {
	var jsonPersons = Android.getData();
	persons.add(jsonPersons);
}