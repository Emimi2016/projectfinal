Appointments = new Mongo.Collection("appointments");

Appointments.before.insert(function (doc){
	doc.createAt = Date.now();
	doc.rating = 0;
});