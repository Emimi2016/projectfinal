Meteor.publish('diaries', function() {
    return Diaries.find();
});