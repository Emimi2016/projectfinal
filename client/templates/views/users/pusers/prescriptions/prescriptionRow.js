Template.prescriptionRow.helpers({
    formstartDate: function() {
        return moment(this.startDate).format('LLLL');
    },
    disabled: function() {
        if (moment().diff(moment(this.startDate), 'days') < 21 || this.askForRenewal) {
            return 'disabled';
        }
        return;
    },
    askForRenewal: function() {
        return this.askForRenewal;
    }
});

Template.prescriptionRow.events({
    'click .renewal': function(event, template) {
        Meteor.call('updatePrescription', this, Meteor.userId(), function(err, result) {
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
                    title: 'Info',
                    text: 'Your request is sent to your doctor.',
                    allowEscapeKey: false,
                    closeOnCancel: false,
                    closeOnConfirm: true,
                    type: 'info'
                });
            }
        });
    },
    'click .confirm': function(event, template) {
        var currPrescription = this;
        swal({
            title: "Respond to patient request",
            text: "Please confirm or reject prescription renewal",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Confirm",
            cancelButtonText: "Reject",
            closeOnConfirm: false,
            closeOnCancel: false
        }, function(isConfirm) {
            if (isConfirm) {
                currPrescription.confirmed = true;
                Meteor.call('updatePrescription', currPrescription, Router.current().params._id, function(err, result) {
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
                        swal("Confirmed!", "Prescription renewal is confirmed!", "success");
                    }
                });
            } else {
                currPrescription.confirmed = false;
                Meteor.call('updatePrescription', currPrescription, Router.current().params._id, function(err, result) {
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
                        swal("Rejected", "You rejected prescription renewal", "error");
                    }
                });
            }
        });
    }
});