Template.healthProblemRow.onRendered(function() {

Template.healthProblemRow.events({
    'click .edit-healthProblem-detail': function(event, template) {
        var healthProblemData = this;
        var recordId = Template.parentData(1)._id
        var _id = $(event.currentTarget).data('id');
        var healthProblem = {
            id: _id,
            cvxCode: $('#diagnostic'+_id).val() != ''? $('#diagnostic'+_id).val() : healthProblemData.diagnostic,
            symptoms: $('#symptoms'+_id).val() != ''? $('#symptoms'+_id).val() : healthProblemData.symptoms,
            medObservation: $('#medObservation'+_id).val() != ''? $('#medObservation'+_id).val() : healthProblemData.medObservation,
            diseaseName: $('#diseaseName'+_id).val() != ''? $('#diseaseName'+_id).val() : healthProblemData.diseaseName,
            date: $('#formatedDate'+_id).val() != ''? new Date($('#formatedDate'+_id).val()) : new Date(healthProblemData.date)
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
            Meteor.call('edithealthProblem', healthProblem, recordId, function(err, result) {
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
                        text: 'You successfully modified healthProblem',
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
});
