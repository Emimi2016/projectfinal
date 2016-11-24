Template.editLabelModal.events({
    'click #labelRemove':function(event,template){
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

Template.editLabelModal.helpers({
    labels: function() {
      var user = Meteor.user();
      if (user)
      {
          var labels = Meteor.user().labels;
          return labels;      
      }
      
      return undefined;
  }
  });