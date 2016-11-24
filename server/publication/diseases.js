Meteor.publish('diseasesNames', function() {
    return Diseases.find({}, {
        fields: {
            name: 1
        }
    });
});