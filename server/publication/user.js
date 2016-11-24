Meteor.publish('users', function() {
return Meteor.Users.find();
});

Meteor.publish('usermessages', function() {
return UserMessages.find();
});


Meteor.publish("userData", function() {
    // current user
    if (this.userId) {
        return Meteor.users.find({
            _id: this.userId
        }, {
            fields: {
                'persodata': 1,
                'doctor': 1,
                'patientDischarges': 1

            }
        });
    } else {
        this.ready();
    }
});

Meteor.publish('patients', function() {
    if (this.userId)
    {
    return Meteor.users.find({$and: [
        {doctor: {$exists: true}},
        {doctor: {$ne: null}},
        {'doctor.doctorId': this.userId}
    ]}, {fields: {'persodata': 1, 'doctor': 1}});
    }
});

Meteor.publish('doctor', function() {
    if (this.userId)
    {
        if (Meteor.users.findOne({_id: this.userId}).doctor) {
            return Meteor.users.find({_id: Meteor.users.findOne({_id: this.userId}).doctor.doctorId}, {
                fields: {'persodata': 1}
            })
        } else {
            this.ready();
        }
    }
});

Meteor.publish('doctors', function() {
    return Meteor.users.find({'persodata.identity': '2'});
});

Meteor.publish("labels", function() {
    // current user
    if (this.userId) {
        return Meteor.users.find({
            _id: this.userId
        }, {
            fields: {
                'labels': 1
            }
        });
    } else {
        this.ready();
    }
});
