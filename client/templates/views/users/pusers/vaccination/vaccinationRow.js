Template.vaccinationRow.onRendered(function() {
    /*this.$('#formDateAdministered'+this.data.id).datetimepicker();
    this.$('#formGivenDate'+this.data.id).datetimepicker();
    this.$('#formExpiryDate'+this.data.id).datetimepicker();*/
});

Template.vaccinationRow.helpers({
    formDateAdministered: function() {
        return moment(this.dateAdministered).format('LLLL');
    },
    formGivenDate: function() {
        return moment(this.givenDate).format('LLLL');
    },
    formExpiryDate: function() {
        return moment(this.expiryDate).format('LLLL');
    }
});

Template.vaccinationRow.events({
    'click .edit-vaccination-detail': function(event, template) {
        var vaccinationData = this;
        var recordId = Template.parentData(1)._id
        var _id = $(event.currentTarget).data('id');
        var vaccination = {
            id: _id,
            dateAdministered: $('#formDateAdministered'+_id).val() != ''? new Date($('#formDateAdministered'+_id).val()) : new Date(vaccinationData.dateAdministered),
            givenDate: $('#formGivenDate'+_id).val() != ''? new Date($('#formGivenDate'+_id).val()) : new Date(vaccinationData.givenDate),
            expiryDate: $('#formExpiryDate'+_id).val() != ''? new Date($('#formExpiryDate'+_id).val()) : new Date(vaccinationData.expiryDate),
            drugRoute: $('#drugRoute'+_id).val() != ''? $('#drugRoute'+_id).val() : vaccinationData.drugRoute
        }
        swal({
            title: 'Are you sure?',
            text: 'Please confirm editing this record',
            showCancelButton: true,
            allowEscapeKey: false,
            closeOnCancel: true,
            confirmButtonColor: "#DD6B55",
            closeOnConfirm: true,
            type: 'warning'
        }, function() {
            Meteor.call('editVaccination', vaccination, recordId, function(err, result) {
                if (err && err.error || !result.status) {
                    swal({
                        title: 'Error occured',
                        text: err.reason,
                        allowEscapeKey: false,
                        closeOnCancel: false,
                        closeOnConfirm: true,
                        type: 'error'
                    });
                } 
                else{
                    swal({
                        title: 'Edit succeeded',
                        text: 'You successfully modified vaccination',
                        allowEscapeKey:false,
                        closeOnCancel:false,
                        closeOnConfirm: true,
                        type:'info'
                    });
                }
            });
        });
    }
});
