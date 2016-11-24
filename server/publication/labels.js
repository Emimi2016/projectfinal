Meteor.publish('labels', function() {
    return Labels.find();
});
