Template.prescriptionModal.onRendered(function() {
    this.$('#newPrescriptionForm').validate();
    this.$('#preStartDateGroup').datetimepicker();
});

Template.prescriptionModal.events({
    'submit #newPrescriptionForm': function(event, template) {
        event.preventDefault();
        var form = event.target;
        var patientId = Router.current().params._id;
        var prescriptionData = {
            active: $('input[name=preActive]:checkbox:checked').val() ? true : false,
            startDate: form.preStartDate.value,
            drug: form.preDrug.value,
            quantity: form.preQuantity.value,
            medUnits: form.preMedUnits.value,
            description: form.preDesc.value,
            refills: form.preRefills.value,
            notes: form.preNotes.value,
            substitution: $('input[name=preSub]:checkbox:checked').val() ? true : false,
            toMedList: $('input[name=preMedList]:checkbox:checked').val() ? true : false,
        }
        Meteor.call('createPrescription', prescriptionData, patientId, function(err, result) {
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
                    text: 'You successifully modified prescriptions',
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
