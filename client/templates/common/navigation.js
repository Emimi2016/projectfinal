Template.navigation.onCreated(function() {
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

Template.navigation.onRendered(function() {

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

Template.navigation.events({

    // Colapse menu in mobile mode after click on element
    'click #side-menu a:not([href$="\\#"])': function(){
        if ($(window).width() < 769) {
            $("body").toggleClass("show-sidebar");
        }
    },
    
    'click .logout': function(event){
        event.preventDefault();
       if (!Meteor.userId())
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
    },
    'change .set-profile-picture': function(event, template) {
      var files = event.target.files;
      for (var i = 0, ln = files.length; i < ln; i++) {
        Images.insert(files[i], function (err, fileObj) {
          // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
          Meteor.users.update({'_id': Meteor.userId()}, {
            $set: {
                'persodata.avatar': fileObj._id
            }
          });

        });
      }
    }

});

Template.navigation.helpers({
  user: function() {
     var user = Meteor.user();
    //var puser = Meteor.users.findOne({username: user.username});
    /*console.log('navigation login token puser ' + user.persodata.token);
    console.log('navigation id puser ' + user.persodata.id);
    console.log('navigation _id puser ' + user._id);
    console.log('navigation identity puser ' + user.persodata.identity);
    */
    return user;
},
profilePicture: function () {
  var image =  Images.findOne({'_id': Meteor.user().persodata.avatar});
  if(image)
    return image.url();
  return false;
}
/*,
  ispUser: function(user) {
      return user.persodata.identity == 1;
  }*/
});
