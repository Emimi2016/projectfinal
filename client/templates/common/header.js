Template.header.events({

    'click .hide-menu': function (event) {

        event.preventDefault();

        if ($(window).width() < 769) {
            $("body").toggleClass("show-sidebar");
        } else {
            $("body").toggleClass("hide-sidebar");
        }
    },

    'click .right-sidebar-toggle': function (event) {
        event.preventDefault();
        $('#right-sidebar').toggleClass('sidebar-open');
    },

    'click .logout': function(event){
        event.preventDefault();
       if (Meteor.user() == undefined)
       {
           return;
       }

        var puser = Meteor.users.findOne({username: Meteor.user().username});

        Meteor.call('logoutuser', puser, function(err, data) {
                if(data.status == false) {
                    console.log('logout KO ' + data.message);
                     $( '#form-error' ).append( 'Wrong login or password.' );
                     swal({ title: 'Some error occured',
                            text: data.message,
                            allowEscapeKey:false,
                            closeOnCancel:false,
                            closeOnConfirm: true,
                            type:'error'
                          }
                     );
                }
                else {
                        Meteor.logout();
                        Router.go('login');
                }
                 $(this).css({'cursor' : 'default'});
            });
    }
});

Template.header.helpers({
  isPatient: function() {
      var user = Meteor.user();
      if (user && user.persodata) {
        return user.persodata.identity == 1;
      }
      return false;
  },
  pageTitle: function() {
    var user = Meteor.user();
    if (user && user.persodata) {
        return user.persodata.identity == 1 ? "Patient" : "Doctor";
    }
    return false;
  }
});