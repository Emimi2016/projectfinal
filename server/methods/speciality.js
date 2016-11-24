Meteor.methods({
	addSpeciality:function(speciality){
        check(Meteor.userId(), String);
        check(speciality, {
        name: String
        });
        
        var specialityWithSameLink = MedicalSpeciality.findOne({name: speciality.name});
        if (specialityWithSameLink) {
            return {
                specialityExists: true,
                _id: specialityWithSameLink._id
            }
        }
        
        var specialityId = MedicalSpeciality.insert(speciality);
        return {
        _id: specialityId
        };
	}
});
