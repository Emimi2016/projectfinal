MedicalRecords = new Mongo.Collection("medicalRecords");

MedicalRecords.before.insert(function (doc){
	doc.createAt = Date.now();
	doc.rating = 0;
});
