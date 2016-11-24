Template.vaccinationModal.onCreated(function() {
    var self = this;
    self.subscribe('vaccines');
});

Template.vaccinationModal.onRendered(function() {
    this.$('#vaccDateAdminGroup').datetimepicker();
    this.$('#giveDateGroup').datetimepicker();
    this.$('#expiryDateGroup').datetimepicker();
    this.$('#vaccinationForm').validate();
    });
    this.$('#vaccName').on('keyup', function() {
        var value = $('#vaccName').val();
        var selVacc = Vaccines.findOne({name: value});
    });
    Meteor.typeahead.inject();
    
Template.vaccinationModal.events({
    'submit #vaccinationForm': function(event, template) {
        event.preventDefault();
        var form = event.target;
        var patientId = Router.current().params._id;
        var vaccinationData = {
            id: form.vaccinationID.value,
            name: form.vaccName.value,
            lotNumber: form.vaccLotNumber.value,
            manufacturer: form.vaccManufacturer.value,
            dateAdministered: form.vaccDateAdmin.value,
            givenDate: form.givenDate.value,
            expiryDate: form.expiryDate.value,
            drugRoute: form.vaccDrugRoute.value,
        };
        Meteor.call('createVaccination', vaccinationData, patientId, function(err, result) {
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
                    text: 'You successfully modified vaccination',
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

Template.vaccinationModal.helpers({
    cvxCodes: function() {
        return Vaccines.find().fetch().map(function(vaccine) {
            return {value: vaccine.cvxCode, id: vaccine._id}
        });
    },
    vaccineName: function() {
        return Vaccines.find().fetch().map(function(vaccine) {
            return {value: vaccine.name, id: vaccine._id}
        });
    },
});
