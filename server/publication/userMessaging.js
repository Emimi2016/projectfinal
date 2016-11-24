Meteor.publish('usermessages', function() {
    var messages = UserMessages.find();
    //var messages =  UserMessages.find({$or: [{'userId':this.userId}, {'revicerId': this.userId}]}, { limit: 50, sort: {"date": 1}});
    return messages;
});


//Meteor.publish("attachments", function(){ return AttachmentStore.find(); });
