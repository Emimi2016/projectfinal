Template.doctorRow.onCreated(function() {
    var self = this;
    self.subscribe('images');
    self.subscribe('userData', Meteor.userId());

    Avatar.options = {
     defaultImageUrl: "images/male-avatar.jpg",
     imageSizes: {
      'large': 80,
      'careLKSize': 320
      }
    };
});

Template.doctorRow.onRendered(function(){
       // Initialize metsiMenu plugin to sidebar menu
    $('#side-menu').metisMenu();
    var user = Meteor.user();
    if (user != undefined && user != null)
    {
        if (user.persodata !== undefined && user.persodata.identity === "1")
        {
            $('.profile-picture').addClass('profile-patient');
        }
        else{
            $('.profile-picture').addClass('profile-doctor');
        }
    }

    // Sparkline bar chart data and options used under Profile image on navigation
    $("#sparkline1").sparkline([5, 6, 7, 2, 0, 4, 2, 4, 5, 7, 2, 4, 12, 11, 4], {
        type: 'bar',
        barWidth: 7,
        height: '30px',
        barColor: '#62cb31',
        negBarColor: '#53ac2a'
    });

});

Template.doctorRow.events({
    'click .sendRequest': function(event, template) {
        console.log('request has been sent');
        var docId = $(event.currentTarget).data('id');
        Meteor.call('sendRequest', docId, function(err, success) {
            if (err && err.error) {
                console.log(err);
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
                    title: 'Request is sent',
                    text: 'Your request is sent to the doctor.',
                    allowEscapeKey:false,
                    closeOnCancel:false,
                    closeOnConfirm: true,
                    type:'info'
                });
            }
        });
    }
});
