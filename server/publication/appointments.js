Meteor.publish('appointments', function() {
    if (this.userId)
    {
        var currUser = Meteor.users.findOne({_id: this.userId});

        if (currUser.persodata != null && currUser.persodata != undefined && currUser.persodata.identity == 1) {
            // patients appointments
            if (currUser.doctor) {
                var docId = currUser.doctor.doctorId;
                return Appointments.find({'patient.patientId': this.userId})
            }
        } else if (currUser.persodata != null && currUser.persodata != undefined && currUser.persodata.identity == 2) {
            // doctors appointments
            return Appointments.find({'doctor.doctorId': this.userId});
        } else {
            throw new Meteor.Error('unknown-identity',
                'You must be patient or doctor to view your appointments.');
        }
    }
});

Meteor.publish('doctors-appointments', function() {
    if (this.userId)
    {
        var currUser = Meteor.users.findOne({_id: this.userId});
        if (currUser.persodata != null && currUser.persodata != undefined && currUser.persodata.identity == 1) {
            // doctor appointments of other patients
            if (currUser.doctor) {
                var docId = currUser.doctor.doctorId;
                return Appointments.find({'doctor.doctorId': docId}, {fields: {startDate: 1, endDate: 1}})
            }
        }
    }
});
