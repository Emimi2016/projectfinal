Template.patientSummary.onCreated(function() {

});

Template.patientSummary.onRendered(function(){

});

Template.patientSummary.helpers({
    formatedDob: function() {
        return moment(this.persodata.dob).format('YYYY-MM-DD');
    }
});

Template.patientSummary.events({
    'click .edit-patient': function(event, template) {
        console.log('edit patient clicked');
        console.log(event.currentTarget.getAttribute('data-id'));
        Router.go('patient', {_id: event.currentTarget.getAttribute('data-id')});
    }
});
