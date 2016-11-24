Template.maildraft.onCreated(function() {
  var self = this;
  this.autorun(function() {
    self.subscribe("usermessages");
  });
});

Template.maildraft.helpers({
    maildate: function() {
        return moment(this.date).format('DD.MM.YYYY');
    },
    mailsince: function() {
        var diffD = moment().diff(this.date, 'days');
        if (diffD == 0) {
            return moment(this.date).format('LTS').concat(" (", moment().diff(this.date, 'hours').toString(), " hours)");
        } else {
            return moment(this.date).format('LTS').concat(" (", moment().diff(this.date, 'days').toString(), " days)");
        }
    },
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

Template.maildraft.events({
  'click .table-maildraft tr': function(event, template) {
    event.preventDefault();
    var id = $(event.currentTarget).data('id');
    Router.go('emailView', {
      _id: id
    });
  }
});
