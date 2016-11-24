Template.mail.onCreated(function() {
  var self = this;
  this.autorun(function() {
    self.subscribe("usermessages");
  });
});


Template.mail.helpers({
  status: function() {
    return this.isRead ? "" : "unread";
  },
  formatdate: function() {
    return moment(this.date).format("llll");
  },
  from: function() {
    return this.caller != undefined && this.caller == "sent" ? this.to :
      this.from;
  },
});
