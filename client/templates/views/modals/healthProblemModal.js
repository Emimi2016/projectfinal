Template.healthProblemModal.onCreated(function() {
    var self = this;
    this.subscribe('diseasesNames');
});

Template.healthProblemModal.onRendered(function() {
    this.$('#newHealthProblemForm').validate();
    Meteor.typeahead.inject();
});

Template.healthProblemModal.helpers({
    diseases: function() {
        return Diseases.find().fetch().map(function(disease) {
            return disease.name;
        });

    }
});

Template.healthProblemModal.events({
    'submit #newHealthProblemForm': function(event, template) {
        event.preventDefault();
        var form = event.target;
        var patientId = Router.current().params._id;
        var hpData = {
            id: form.healthProblemID.value,
            diagnostic: form.hpDiagnostic.value,
            symptoms: form.hpSymptoms.value,
            medObservation: form.hpMedObs.value,
            diseaseName: form.hpDiseaseName ? form.hpDiseaseName.value : '',
            notes: form.hpNotes ? form.hpNotes.value : '',
        };
        Meteor.call('createHealthProblem', hpData, patientId, function(err, result) {
            if (err && err.error) {
                swal({
                    title: 'Error occured',
                    text: err.reason,
                    allowEscapeKey: false,
                    closeOnCancel: false,
                    closeOnConfirm: true,
                    type: 'error'
                });
            } else {
                swal({
                    title: 'Create succeeded',
                    text: 'You successifully modified health problems',
                    allowEscapeKey:false,
                    closeOnCancel:false,
                    closeOnConfirm: true,
                    type:'info'
                });
                Modal.hide();
            }
        });
    }
});
