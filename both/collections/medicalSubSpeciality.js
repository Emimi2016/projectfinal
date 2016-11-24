MedicalSubSpeciality = new Mongo.Collection("medicalSubSpeciality");

MedicalSubSpeciality.before.insert(function (doc){
	doc.createAt = Date.now();
	doc.rating = 0;
});

MedicalSubSpeciality.helpers({
    speciality:function(){
        return MedicalSpeciality.findOne({_id:this.specialityId});
    }
});