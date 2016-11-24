Template.leftMailPanel.onRendered(function() {
  // console.log('left panel ' + this.parent);
});

Template.leftMailPanel.helpers({
  nbInbox: function() {
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
  },
  nbSent: function() {
    var usermessages = UserMessages.find({
      userId: Meteor.userId(),
      isRead: false
    }, {
      limit: 50,
      sort: {
        date: -1
      }
    }).fetch();
    return usermessages.length;
  },
  inboxClass: function() {
    return this.parent == "mailbox" ? "active" : "";
  },
  sentClass: function() {
    return this.parent == "mailsent" ? "active" : "";
  },
  draftClass: function() {
    return this.parent == "maildraft" ? "active" : "";
  },
  trashClass: function() {
    return this.parent == "mailtrash" ? "active" : "";
  },
  folders: function() {
    return Labels.find({ "userid" : Meteor.userId() });
  }
});


Template.leftMailPanel.events({
  'click #linkAddFolder': function(event) {
    event.preventDefault();
    bootbox.prompt("Add Label", function(result) {                
  if (result === null) {                                             
    alert('Label cannot be null.');                              
  } else {
var dateadded = new Date();
Labels.insert({ userid: Meteor.userId(), name: result , dateadded:dateadded });    
alert('Your label was added.')
  }
});
  },
  'click #linkEditFolder': function(event) {
    event.preventDefault();
    alert('editLabelModal');
  }
});
