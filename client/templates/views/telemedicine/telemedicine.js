Template.telemedicine.onCreated(function() { 
   //this.subscribe('users');
    var self = this;
    self.subscribe('patients');
    self.subscribe('doctor');
    
});
//  I need to make participants reactive not just skype name
Template.telemedicine.onRendered(function() {
    
    Meteor.setTimeout(function() { 
        if (Meteor.user().persodata.identity == 1) {
            var participants = [];
            var doctor = Meteor.users.findOne({_id: Meteor.user().doctor.doctorId});
            if (doctor.persodata.skypeName) {
                participants[0] = doctor.persodata.skypeName;
            } else {
                participants[0] = patient.persodata.skypeName;
            }
            $('#call_32').append('<a href="skype:+25?call">Click</a>');
             Skype.ui({
                name: "call",
                element: "call_32",
                participants: participants,
                listParticipants: true,
                imageSize: 32,
                imageColor: "white"
            });
            
        }
    }, 50);
    Meteor.typeahead.inject();
    
});

Template.telemedicine.helpers({
    
    settings: function () {
        return {
            collection: Meteor.users,
            rowsPerPage: 10,
            showFilter: true,
            fields: [
                    { key: 'persodata.fname', label: 'FirstName' },
                    { key: 'persodata.lname', label: 'Lastname' },
                    { key: 'persodata.skype', label: 'Skype Username' },
{ key: 'edit', label: 'Skype', fn: function () { return new Spacebars.SafeString('<button type="button" class="skypebtn btn-info"> <i class="fa fa-skype" aria-hidden="true"> Skype Call</i></button>') } }
                    ]
          };
          },
    
    patients: function() {
        return Meteor.users.find({_id: {$ne: Meteor.userId()}}).fetch().map(function(patient) {
            return {value: patient.persodata.lname + ', ' + patient.persodata.fname, skypeName: patient.persodata.skypeName}
        });
    },
    skypeName: function(event, suggestion) {
        var participants = [];
        if (suggestion.skypeName) {
            participants[0] = suggestion.skypeName;
        } else {
            participants[0] = 'echo123';
        }
        document.getElementById('call_32').innerHTML = '';
        Skype.ui({
            name: "call",
            element: "call_32",
            participants: participants,
            listParticipants: true,
            imageSize: 32,
            imageColor: "white"
        });
    }
});
