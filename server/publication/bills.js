Meteor.publish('bills', function() {
    return Bills.find();
});
