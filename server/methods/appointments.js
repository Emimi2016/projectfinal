Meteor.methods({
    saveAppointment: function(appointmentData) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'You must be loged in!');
        }
        check(appointmentData, Object);

        var currUser = Meteor.users.findOne({
            _id: this.userId
        });
        if (currUser.persodata.identity == 1) {
            var patient = {
                    patientId: this.userId,
                    confirmed: true,
                    response: true,
                }
                // var
            var doctor = {
                doctorId: currUser.doctor.doctorId,
                confirmed: false,
                response: false,
            }
        } else if (currUser.persodata.identity == 2) {
            var patient = {
                patientId: appointmentData.patientId,
                confirmed: false,
                response: false,
            }
            var doctor = {
                doctorId: this.userId,
                confirmed: true,
                response: true,
            }
        } else {
            throw new Meteor.Error('unknown-identity', 'You must be patient or doctor to start appointment.');
        }

        var healthIssues = appointmentData.healthIssues,
            comments = appointmentData.comments,
            status = 'pending',
            startDate = new Date(appointmentData.startDate),
            endDate = new Date(appointmentData.endDate),
            urgent = appointmentData.urgent,
            visitType = appointmentData.visitType;

        Appointments.insert({
            healthIssues: healthIssues,
            comments: comments,
            status: status,
            startDate: startDate,
            endDate: endDate,
            urgent: urgent,
            visitType: visitType,
            patient: patient,
            doctor: doctor,
            createdAt: new Date(),
        });
    },
    updateAppointment: function(appData, id) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'You must be loged in!');
        }

        check(appData, Object);
        var currUser = Meteor.users.findOne({
            _id: this.userId
        });
        if (appData.status && appData.status === 'confirmed') {
            if (currUser.persodata.identity == 1) {
                Appointments.update({
                    _id: id
                }, {
                    $set: {
                        status: appData.status,
                        'patient.confirmed': true,
                        'patient.response': true,
                    }
                });
            } else if (currUser.persodata.identity == 2) {
                Appointments.update({
                    _id: id
                }, {
                    $set: {
                        status: appData.status,
                        'doctor.confirmed': true,
                        'doctor.response': true,
                    }
                });
            }
        }

        if (appData.newDate1 && appData.status && appData.status === 'pending') {
            if (currUser.persodata.identity == 1) {
                Appointments.update({
                    _id: id
                }, {
                    $set: {
                        status: 'pending',
                        'patient.confirmed': true,
                        'doctor.confirmed': false,
                        newDate1: appData.newDate1 ? new Date(appData.newDate1) : null,
                        newDate2: appData.newDate2 ? new Date(appData.newDate2) : null,
                        newDate3: appData.newDate3 ? new Date(appData.newDate3) : null,
                    }
                });
            } else if (currUser.persodata.identity == 2) {
                Appointments.update({
                    _id: id
                }, {
                    $set: {
                        status: 'pending',
                        'patient.confirmed': false,
                        'doctor.confirmed': true,
                        newDate1: appData.newDate1 ? new Date(appData.newDate1) : null,
                        newDate2: appData.newDate2 ? new Date(appData.newDate2) : null,
                        newDate3: appData.newDate3 ? new Date(appData.newDate3) : null,
                    }
                });
            }
        }
        if (appData.status && appData.status === 'canceled') {
            if (currUser.persodata.identity == 1) {
                Appointments.update({
                    _id: id
                }, {
                    $set: {
                        status: 'canceled',
                        'patient.confirmed': false,
                        'doctor.confirmed': true,
                        newDate1: null,
                        newDate2: null,
                        newDate3: null,
                    }
                });
            } else if (currUser.persodata.identity == 2) {
                Appointments.update({
                    _id: id
                }, {
                    $set: {
                        status: 'canceled',
                        'patient.confirmed': true,
                        'doctor.confirmed': false,
                        newDate1: null,
                        newDate2: null,
                        newDate3: null,
                    }
                });
            }
        }
    }
});
