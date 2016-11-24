
Meteor.startup(function () {
    MedicalSubSpeciality._ensureIndex({ "specialityId": 1});
});

Meteor.methods({
	'MedicalSpecialities.insert':function(speciality){
		return MedicalSubSpeciality.insert(speciality);
	},
	'MedicalSpecialities.remove':function(id){
		return MedicalSubSpeciality.remove({_id:id});
	}
});