Template.billModal.onRendered(function() {
    this.$('#addNewBillForm').validate();
});

Template.billModal.events({
    'submit #addNewBillForm': function(event, template) {
        event.preventDefault();
        var form = event.target;
        var patientId = Router.current().params._id;
        
        var billData = {
            givenDate: form.givenDate.value,
            consultationType: form.consultationType.value,
            amount: form.amount.value,
            patient: patientId
        };
        /**
        var givenDate = form.givenDate.value;
        var consultationType = form.consultationType.value;
        var amount = form.amount.value;
        var patient = patientId;
        Meteor.call('createBill', givenDate,consultationType,amount,patient);
        */
        Meteor.call('createBill', billData, patientId, function(err, result) {
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
                    text: 'You successfully modified bills',
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
