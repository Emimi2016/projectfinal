Meteor.publish('doctorRequest', function(id) {
    return DoctorRequests.find({_id: id});
});