Template.emailView.onRendered(function() {
    Meteor.call("readMessage", this.data._id, function(error, result) {
        if (error) {
            console.log("error", error);
        }
        if (result) {}
    });
});

Template.emailView.helpers({
    maildate: function() {
        return moment(this.date).format('DD.MM.YYYY');
    },
    mailsince: function() {
        var diffD = moment().diff(this.date, 'days');
        if (diffD == 0) {
            return moment(this.date).format('LTS').concat(" (", moment().diff(this.date, 'hours').toString(), " hours)");
        } else {
            return moment(this.date).format('LTS').concat(" (", moment().diff(this.date, 'days').toString(), " days)");
        }
    },
    mailmessage: function() {
        var mailmessage = this.message;
        return mailmessage;
    },
    uploadedfile: function() {
        var attacedFiles = [];
        this.uploadedfiles.forEach(function(d, i) {
            var attaced = {};
            attaced['name'] = Images.findOne({
                '_id': d
            }).original.name;
            attaced['value'] = d;
            attacedFiles.push(attaced)
        });
        return attacedFiles;
    }
});

Template.emailView.events({
    'click #reply': function(event) {
        Router.go("emailCompose", {
            _id: this._id
        });
    },
    'click #print': function(event) {
        //$.print('#mailmessage');
        $('#mailmessage').print();
    }
});
