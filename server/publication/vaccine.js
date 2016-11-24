Meteor.publish('vaccines', function() {
    return Vaccines.find({}, {
        fields: {
            cvxCode: 1,
            name: 1
        }
    });
});
