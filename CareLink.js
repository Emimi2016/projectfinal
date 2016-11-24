if (Meteor.isClient) {
    Meteor.startup(function() {
       $('html').attr('lang', 'en'); 
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
