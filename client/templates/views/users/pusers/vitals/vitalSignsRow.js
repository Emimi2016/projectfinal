Template.vitalSignsRow.onRendered(function() {
    //this.$('#formatedDate'+this.data.id).datetimepicker();
});

Template.vitalSignsRow.helpers({
    formatedDate: function() {
        return moment(this.date).format('LLLL');
    }
});

Template.vitalSignsRow.events({
  'click .remove-vital-sign': function(event, template) {
    var patientId = Template.parentData(2)._id;
    var vitalSign = this;
    swal({
            title: 'Are you sure?',
            text: 'Please confirm deleting this record',
            showCancelButton: true,
            allowEscapeKey: false,
            closeOnCancel: true,
            confirmButtonColor: "#DD6B55",
            closeOnConfirm: true,
            type: 'warning'
        }, function() {
            Meteor.call('removeVitalSign', vitalSign, patientId, function(err, result) {
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
            });
        });
    }
});
Template.vitalSignsRow.events({
  'click .edit-vital-sign': function(event, template) {
    //var patientId = Template.parentData(2)._id;
    var recordId = Template.parentData(1)._id
    var _id = $(event.currentTarget).data('id');
    var vitalSignData = this;
    var vitalSign = {
        id: _id,
        weight: $('#weight'+_id).val() != ''? $('#weight'+_id).val() : vitalSignData.weight,
        height: $('#height'+_id).val() != ''? $('#height'+_id).val() : vitalSignData.height,
        bmi: $('#bmi'+_id).val() != ''? $('#bmi'+_id).val() : vitalSignData.bmi,
        bp: $('#bp'+_id).val() != ''? $('#bp'+_id).val() : vitalSignData.bp,
        pulse: $('#pulse'+_id).val() != ''? $('#pulse'+_id).val() : vitalSignData.pulse,
        respiration: $('#respiration'+_id).val() != ''? $('#respiration'+_id).val() : vitalSignData.respiration,
        temperature: $('#temperature'+_id).val() != ''? $('#temperature'+_id).val() : vitalSignData.temperature,
        date: $('#formatedDate'+_id).val() != ''? new Date($('#formatedDate'+_id).val()) : new Date(vitalSignData.date)
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
            Meteor.call('editVitalSign', vitalSign, recordId, function(err, result) {
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
                        text: 'You successfully modified vitals sign',
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
