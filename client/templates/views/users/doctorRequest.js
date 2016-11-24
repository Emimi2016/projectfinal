Template.doctorRequest.onCreated(function() { 
    var self = this;
    self.subscribe("doctorRequest", Router.current().params._id);
    self.message = new ReactiveVar('<h3>default message</h3>');
    var hash = Router.current().params.hash; 
    if (hash) {
        var data = {};
        data.hash = hash;
        data.id = Router.current().params._id;
        Meteor.call('updateDoctorRequest', data, function(error, success) { 
            if (error) {
                self.message.set('Error with the request');
            }
            if (success) {
                self.message.set(success);
            }
        });
    }
});

Template.doctorRequest.onRendered(function() {
    
});

Template.doctorRequest.helpers({
    message: function() {
        return Template.instance().message.get();
    }
});