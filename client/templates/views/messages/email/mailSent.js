Template.mailsent.onCreated(function() {
  var self = this;
  this.autorun(function() {
    self.subscribe("usermessages");
  });
});

Template.mailsent.helpers({
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
      isSent: true
    }, {
      limit: 50,
      sort: {
        date: -1
      }
    }).fetch() || [];
    return usermessages;
  },
  caller: function() {
    return _.extend({
      caller: "sent"
    }, this);
  }
});

Template.mailsent.events({
  'click .table-mailbox tr': function(event, template) {
    event.preventDefault();
    var id = $(event.currentTarget).data('id');
    Router.go('emailView', {
      _id: id
    });
  }
});
