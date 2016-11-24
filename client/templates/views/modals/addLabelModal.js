Template.addLabelModal.events({
    'submit #newAddLabelForm': function(event, template) {
        event.preventDefault();
        var form = event.target;
        var name = $('#inpNewLabel').val();
        var labelData = {
            labelName:name,
            isVisible:true
        }
        Meteor.call('createorupdatelabels', labelData, function(err, result) {
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
                    text: 'You successfully created label.',
                    allowEscapeKey:false,
                    closeOnCancel:false,
                    closeOnConfirm: true,
                    type:'info'
                });
                Modal.hide();
            }
        });
    },
    'click button.delete':function(event,template){
          var labelData = {
            id: $(event.currentTarget).data('id')
        }        
        console.log(labelData.id);        
        Meteor.call('removeLabels', labelData, function(err, data) {
            if (!data || !data.status) {
                Command: toastr["error"]("Remove labels failed", data.err)
                toastr.options = {
                "closeButton": false,
                "debug": false,
                "newestOnTop": false,
                "progressBar": false,
                "positionClass": "toast-top-center",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
                };
                return false;
            }
            else{
                Command: toastr["success"]("Remove labels succeeded","")
                toastr.options = {
                "closeButton": false,
                "debug": false,
                "newestOnTop": false,
                "progressBar": false,
                "positionClass": "toast-top-center",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
                };
                return true;  
            }            
        });
     }
});