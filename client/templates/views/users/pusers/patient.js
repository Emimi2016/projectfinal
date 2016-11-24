Template.patient.onCreated(function() {
    var self = this;
    self.autorun(function() {
        self.currPatient = {};
        self.currPatientFullname = "";
        var patientId = Router.current().params._id;
        self.currPatient = new ReactiveVar(Meteor.users.findOne({
            _id: patientId
        }));
        self.currPatientData = self.currPatient.get();
        if (self.currPatientData && self.currPatientData.persodata) {
            self.currPatientFullname = ReactiveVar("Patient: " + self.currPatientData.persodata.fname + " " + self.currPatientData.persodata.lname);
        } else {
            self.currPatientFullname = ReactiveVar("Patient");
        }
        self.subscribe('patients');
        self.subscribe('medicalRecords');
    });
});

Template.patient.onRendered(function() {

    Meteor.setTimeout(function() {
        $('#patientdiary').dataTable({
            dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp",
            "lengthMenu": [
                [10, 25, 50, -1],
                [10, 25, 50, "All"]
            ],
            buttons: [{
                extend: 'copy',
                className: 'btn-sm'
            }, {
                extend: 'csv',
                title: 'Patient Summary',
                className: 'btn-sm'
            }, {
                extend: 'pdf',
                title: 'Patient Summary',
                className: 'btn-sm'
            }, {
                extend: 'print',
                className: 'btn-sm'
            }],
            "autoWidth": false
        });
    });
});

Template.patient.events({
    'click #newVitalRecord': function(event, template) {
        Modal.show('vitalSignsModal');
        setTimeout(function() {            
         $('#vitalRecordID').val('null');
        }, 300);
    },
    'click .edit-vital-record': function(event, template) {
        var vitalRecordID = $(event.currentTarget).data('id');
        Modal.show('vitalSignsModal');
        setTimeout(function() {
         $('#vitalRecordID').val(vitalRecordID);
        }, 300);
    },
    'click #newAllergy': function(event, template) {
        Modal.show('allergyModal');
        setTimeout(function() {
         $('#allergyID').val('null');
        }, 300);
    },
    'click .edit-allergy': function(event, template) {
        var allergyID = $(event.currentTarget).data('id');
        Modal.show('allergyModal');
        setTimeout(function() {
         $('#allergyID').val(allergyID);
        }, 300);
    },
    'click #newVaccination': function(event, template) {
        Modal.show('vaccinationModal');
        setTimeout(function() {
         $('#vaccinationID').val('null');
        }, 300);
    },
    'click .edit-vaccination': function(event, template) {
        var vaccinationID = $(event.currentTarget).data('id');
        Modal.show('vaccinationModal');
        setTimeout(function() {
         $('#vaccinationID').val(vaccinationID);
        }, 300);
    },
    'click #newPrescription': function(event, template) {
        Modal.show('prescriptionModal');
    },
    'click #newHealthProblem': function(event, template) {
        Modal.show('healthProblemModal');
        setTimeout(function() {
         $('#healthProblemID').val('null');
        }, 300);
    },
    'click .edit-health-problem': function(event, template) {
        var HealthProblemID = $(event.currentTarget).data('id');
        Modal.show('healthProblemModal');
        setTimeout(function() {
         $('#healthProblemID').val(healthProblemID);
        }, 300);
    },
    'click #newBill': function(event, template) {
        Modal.show('billModal');
        setTimeout(function() {
         $('#billID').val('null');
        }, 300);
    },
    'click .edit-bill': function(event, template) {
        var BillID = $(event.currentTarget).data('id');
        Modal.show('billModal');
        setTimeout(function() {
         $('#billID').val(billID);
        }, 300);
    }
});

Template.patient.helpers({
   settings: function () {
        return {
            collection: Bills,
            rowsPerPage: 10,
            showFilter: true
        };
    },
    'currPatient': function() {
        // var patientId = Router.current().params._id;
        // return Meteor.users.findOne({_id: patientId});
        return Template.instance().currPatient.get();
    },
    'currPatientFullname': function() {
        return Template.instance().currPatientFullname.get();
    },
    'medicalRecord': function() {
        return MedicalRecords.findOne({
            'patient.patientId': Router.current().params._id
        });
    }
});
