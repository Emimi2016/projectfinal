Template.editAppointmentModal.onCreated(function() {
    var self = this;
    self.propose = new ReactiveVar(false);
});

Template.editAppointmentModal.helpers({
    formatedStartDate: function() {
        return moment(this.startDate).format('LLLL');
    },
    formatedEndDate: function() {
        return moment(this.endDate).format('LLLL');
    },
    formatedNewDate1: function() {
        return moment(this.newDate1).format('LLLL');
    },
    formatedNewDate2: function() {
        return moment(this.newDate2).format('LLLL');
    },
    formatedNewDate3: function() {
        return moment(this.newDate3).format('LLLL');
    },
    modification: function() {
        if (!this.newDate1) {
            if (Meteor.user().persodata.identity == 1) {
                return this.patient.confirmed
            } else if (Meteor.user().persodata.identity == 2) {
                return this.doctor.confirmed
            }
        }
        return;
    },
    propose: function() {
        return Template.instance().propose.get();
    },
    confirmed: function() {
        return this.status === 'confirmed' ? true : false;
    },
    noNewDates: function() {
        if (!this.newDate1) {
            if (Meteor.user().persodata.identity == 1) {
                return !this.patient.confirmed
            } else if (Meteor.user().persodata.identity == 2) {
                return !this.doctor.confirmed
            }
        }
    },
    noResponse: function() {
        if (!this.newDate1) {
            if (Meteor.user().persodata.identity == 1) {
                return !this.doctor.response
            } else if (Meteor.user().persodata.identity == 2) {
                return !this.patient.response
            }
        }
    }
});

Template.editAppointmentModal.events({
    'change input[name=modification], change input[name=confirmation], change input[name=newDates]': function(event, template) {
        return $('input[name=confirmation]:radio:checked').val() == 'no' ||
        $('input[name=modification]:radio:checked').val() == 'edit' ||
        $('input[name=newDates]:radio:checked').val() == 'edit' ?
        template.propose.set(true) : template.propose.set(false)
    },
    'submit #modForm': function(event, template) {
        event.preventDefault();
        var id = this._id;
        var appData = {};
        if ($('input[name=cancelation]:radio:checked').val() == 'yes') {
            appData.status = 'canceled';
        }
        if ($('input[name=confirmation]:radio:checked').val() == 'yes') {
            appData.status = 'confirmed';
        } else if($('input[name=confirmation]:radio:checked').val() == 'no') {
            appData.status = 'pending';
            appData.newDate1 = event.target.proposedDate1 ? event.target.proposedDate1.value : '';
            appData.newDate2 = event.target.proposedDate2 ? event.target.proposedDate2.value : '';
            appData.newDate3 = event.target.proposedDate3 ? event.target.proposedDate3.value : '';
        }

        if (this.newDate1) {
            if ($('input[name=newDates]:radio:checked').val() == 'edit') {
                appData.status = 'pending';
                appData.newDate1 = event.target.proposedDate1 ? event.target.proposedDate1.value : '';
                appData.newDate2 = event.target.proposedDate2 ? event.target.proposedDate2.value : '';
                appData.newDate3 = event.target.proposedDate3 ? event.target.proposedDate3.value : '';
            } else if ($('input[name=newDates]:radio:checked').val() == 'cancel') {
                appData.status = 'canceled';
            } else {
                // save appointment with new date
            }
        }

        if (this.status === 'confirmed' || this.status === 'pending') {
            if ($('input[name=modification]:radio:checked').val() == 'edit') {
                appData.status = 'pending';
                appData.newDate1 = event.target.proposedDate1 ? event.target.proposedDate1.value : '';
                appData.newDate2 = event.target.proposedDate2 ? event.target.proposedDate2.value : '';
                appData.newDate3 = event.target.proposedDate3 ? event.target.proposedDate3.value : '';
            } else if ($('input[name=modification]:radio:checked').val() == 'cancel') {
                appData.status = 'canceled';
            }
        }

        Meteor.call('updateAppointment', appData, id, function(err, result) {
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
        })
    }
});
