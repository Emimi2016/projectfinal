Template.reqNewAppointmentModal.onCreated(function() { 
    var self = this;
    self.patientId = new ReactiveVar(false); 
});

Template.reqNewAppointmentModal.onRendered(function() {
    this.$("#reqAppointmentForm").validate({
        rules: {
        },
        messages: {
        },
        cancelSubmit: function() {
            alert('cancel submit');
        }
    });
    Meteor.typeahead.inject();
});

Template.reqNewAppointmentModal.helpers({
    patients: function() {
        return Meteor.users.find({_id: {$ne: Meteor.userId()}}).fetch().map(function(patient) {
            return {value: patient.persodata.lname + ', ' + patient.persodata.fname, id: patient._id}
        });
    },
    suggestionId: function(event, suggestion) {
        Template.instance().patientId.set(suggestion.id);
    }
});

Template.reqNewAppointmentModal.events({
    'submit #reqAppointmentForm': function(event, template) {
        event.preventDefault();
        var appointmentData = {
            healthIssues: event.target.appHealthIssues.value,
            comments: event.target.appComments.value,
            startDate: event.target.appStartDate.value,
            endDate: event.target.appEndDate.value,
            urgent: event.target.appUrgent.checked,
            visitType: $('input[name=visitType]:radio:checked').val(),
        }
        if (template.patientId) {
            appointmentData['patientId'] = template.patientId.get();
        }
        Meteor.call('saveAppointment', appointmentData, function(err, result) {
            if (err && err.error) {
                swal({
                    title: 'Error occured',
                    text: err.reason,
                    allowEscapeKey: false,
                    closeOnCancel: false,
                    closeOnConfirm: true,
                    type: 'error'
                });
            }
            $('#calendar').fullCalendar('refetchEvents');
            Modal.hide();
        });
    }
});
