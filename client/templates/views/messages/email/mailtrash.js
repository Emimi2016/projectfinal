Template.mailtrash.onCreated(function() {
  var self = this;
  this.autorun(function() {
    self.subscribe("usermessages");
  });
});

Template.mailtrash.helpers({
  mails: function() {
    var usermessages = UserMessages.find({
      revicerId: Meteor.userId()
    }, {
      limit: 50,
      sort: {
        date: -1
      }
    }).fetch();
    return usermessages;
  },
  loldata: function() {
    var usermessages = {
      _id: 0
    };
    return usermessages;
  },
  sents: function() {
    var usermessages = UserMessages.find({
      userId: Meteor.userId()
    }, {
      limit: 50,
      sort: {
        date: -1
      }
    }).fetch();
    return usermessages;
  },
  nbMessagesNotRead: function() {
    var usermessages = UserMessages.find({
      revicerId: Meteor.userId(),
      isRead: false
    }, {
      limit: 50,
      sort: {
        date: -1
      }
    }).fetch();
    return usermessages.length;
  }
});

Template.mailtrash.events({
  'click .table-mailtrash tr': function(event, template) {
    event.preventDefault();
    var id = $(event.currentTarget).data('id');
    Router.go('emailView', {
      _id: id
    });
  }
});
