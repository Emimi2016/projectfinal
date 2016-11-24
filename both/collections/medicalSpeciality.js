MedicalSpeciality = new Mongo.Collection("medicalSpeciality");

MedicalSpeciality.before.insert(function (doc){
	doc.createAt = Date.now();
	doc.rating = 0;
});
