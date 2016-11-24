Template.allergyModal.onRendered(function() {
    this.$('#addNewAllergyForm').validate();
});

Template.allergyModal.events({
    'submit #addNewAllergyForm': function(event, template) {
        event.preventDefault();
        var form = event.target;
        var patientId = Router.current().params._id;
        var allergyData = {
            id: form.allergyID.value,
            description: form.allergyDesc.value,
            type: form.allergyType.value,
            allergen: form.allergen.value,
        };
        Meteor.call('createAllergy', allergyData, patientId, function(err, result) {
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
                    text: 'You successifully modified allergies',
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
