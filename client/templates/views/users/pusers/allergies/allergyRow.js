Template.allergyRow.events({
    'click .remove-allergy': function(event, template) {
        var patientId = Template.parentData(2)._id;
        var allergy = this;
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
            Meteor.call('removeAllergy', allergy, patientId, function(err, result) {
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
    },
    'click .edit-allergy-detail': function(event, template) {
        //var patientId = Template.parentData(2)._id;
        var allergyData = this;
        var recordId = Template.parentData(1)._id
        var _id = $(event.currentTarget).data('id');
        var allergy = {
            id: _id,
            description: $('#description'+_id).val() != ''? $('#description'+_id).val() : allergyData.description,
            type: $('#type'+_id).val() != ''? $('#type'+_id).val() : allergyData.type,
            allergen: $('#allergen'+_id).val() != ''? $('#allergen'+_id).val() : allergyData.allergen
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
            Meteor.call('editAllergy', allergy, recordId, function(err, result) {
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
                        text: 'You successfully modified allergy',
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
