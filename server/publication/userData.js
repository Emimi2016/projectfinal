Meteor.publish("userData", function(userId){
    return Meteor.users.find({"_id": userId});
});