
/***
 * User Messaging
 * Mailbox between doctor and patients
 * Create, Modify, Visualize
 *
 * Messages are stored in db: { _id, userId, previousMessageId, type, date, from, to, subject, message, attachments:[] }
 * type = {email, chat}
 * attachments = [fileId, ...]
 */

Meteor.methods({
    sendRequest: function(docId) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'You must be loged in!');
        }
        check(docId, String);
        var currUser = Meteor.users.findOne({_id: this.userId}),
            doctor = Meteor.users.findOne({_id: docId}),
            from = currUser.persodata.lname + ', ' + currUser.persodata.fname,
            to = doctor.persodata.lname + ', ' + doctor.persodata.fname,
            subject = 'Patient requested you to be his/her doctor',
            message = '<p>There was an error with this request.</p>' +

        UserMessages.insert({
            userId: this.userId,
            type: 'email',
            from: from,
            to: to,
            date: new Date(),
            subject: subject,
            revicerId: docId,
            message: message,
            isRead: false,
            isSent: false,
            isDeleted: false,
            previousMessageId: null
        }, function(err, _id) {

            if (err) throw new Meteor.Error(err);

            var data = {_id: _id},
                acceptButton = '<a role="button" href="/request/'+_id+'#accept" class="btn btn-success">Accept</a>',
                rejectButton = '<a role="button" href="/request/'+_id+'#reject" class="btn btn-danger">Reject</a>',
                messageWithLinks = '<p>Hello. Patient ' + from + ' has choosen you to be his doctor. Please respond to his request.</p>' +
                    '<p>Do you accept request?</p>' +
                    acceptButton +
                    rejectButton;

            UserMessages.update({
                _id: _id
            }, {
                $set: {
                    message: messageWithLinks
                }
            });

            DoctorRequests.insert({
                _id: _id,
                patient: currUser._id,
                doctor: docId,
                date: new Date(),
                status: 'pending'
            });
        });
        Email.send({
         to: doctor.persodata.email,
         from: currUser.persodata.email,
         subject: subject,
         text: message
       });

    },
    updateDoctorRequest: function(data) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'You must be loged in!');
        }

        check(data, Object);
        var currRequest = DoctorRequests.findOne({_id: data.id});
        var doctor = Meteor.users.findOne({_id: currRequest.doctor});
        var patient = Meteor.users.findOne({_id: currRequest.patient});
        if (currRequest.status != 'pending') {
            throw new Meteor.Error('not-pending-status', 'Status is already processed');
        } else {
            if (data.hash == 'accept') {
                DoctorRequests.update({
                    _id: data.id
                }, {
                    $set: {
                        status: 'accepted',
                        acceptedAt: new Date()
                    }
                });
                UserMessages.insert({
                    userId: currRequest.patient,
                    type: 'request',
                    from: doctor.persodata.lname + ', ' + doctor.persodata.fname,
                    to: patient.persodata.lname + ', ' + patient.persodata.fname,
                    date: new Date(),
                    subject: 'Respond to your doctor request',
                    message: 'Doctor ' + doctor.persodata.lname + ', ' + doctor.persodata.fname +
                        ' has accepted your request.',
                    isRead: false,
                    isSent: false,
                    isDeleted: false,
                    previousMessageId: null
                });
                Meteor.users.update({
                    _id: currRequest.patient
                }, {
                    $set: {
                        'doctor.doctorId': currRequest.doctor,
                        'doctor.registrationDate': new Date()
                    }
                });
                return '<p class="text-success">You have accepted request<p>';
            } else if (data.hash == 'reject') {
                DoctorRequests.update({
                    _id: data.id
                }, {
                    $set: {
                        status: 'rejected',
                        rejectedAt: new Date()
                    }
                });
                UserMessages.insert({
                    userId: currRequest.patient,
                    type: 'request',
                    from: doctor.persodata.lname + ', ' + doctor.persodata.fname,
                    to: patient.persodata.lname + ', ' + patient.persodata.fname,
                    date: new Date(),
                    subject: 'Respond to your doctor request',
                    message: 'Doctor ' + doctor.persodata.lname + ', ' + doctor.persodata.fname +
                        ' can\'t accept you request now.',
                    isRead: false,
                    isSent: false,
                    isDeleted: false,
                    previousMessageId: null
                });
                return '<p class="text-danger">Request has beed rejected<p>';
            }
        }
    },
    sendMessage: function(message,uploadfile) {
        console.log(message)
        if (!Meteor.userId())
        {
            return {err:'The user must be logged in!', status:false};
        }
        var user = Meteor.user();

        message.from = user.persodata.lname + ' ' + user.persodata.fname;
        // create a sent message for the current user
        UserMessages.update (
            {
                _id: message.id
            },
            {
                userId: Meteor.userId(),
                type: message.type,
                from: message.from,
                to: message.to,
                revicerId: message.userToId,
                date: new Date(),
                subject: message.subject,
                message: message.message,
                isRead: false,
                isSent: true,
                isDeleted: false,
                previousMessageId: message.previousMessageId,
                uploadedfiles:uploadfile
            },
            { upsert: true }
        );

        // create a received message for the
        UserMessages.update(
            {
                _id: message._id
            },
            {
                userId: message.userToId,
                type: message.type,
                from: message.from,
                to: message.to,
                date: new Date(),
                subject: message.subject,
                message: message.message,
                isRead: false,
                isSent: false,
                isDeleted: false,
                previousMessageId: message.previousMessageId,
                uploadedfiles:uploadfile
            },
            { upsert: true }
        );
    },
    deleteMessage: function(message) {
        if (!Meteor.userId())
        {
            return {err:'The user must be logged in!', status:false};
        }

        UserMessages.update(
            {
                _id: message._id
            },
            {
                isDeleted: true,
            },
            { upsert: true }
        );
    },
    readMessage: function(ID) {
        if (!Meteor.userId())
        {
            return {err:'The user must be logged in!', status:false};
        }else {
          UserMessages.update(
              {
                  _id: ID
              },
              {
                $set:{
                  "isRead": true
                }
              }
          );
        }


    },
    // get statistics for current user: inbox, sent, draft, trash
    getMailStatisticts: function() {
        if (!Meteor.userId())
        {
            return {err:'User must be logged in.', status:false};
        }

        var statistics = {
            inbox:0,
            sent:0,
            draft:0,
            trash:0
        }

        var messages = UserMessages.find({'userId':this.userId});
        var inbox = messages.length;
        var sent = messages.find({"isSent": true}).length;
        var draft = messages.find({"isDraft": false}).length;
        var trash = messages.find({"isDeleted": false}).length;
        statistics.inbox = inbox;
        statistics.sent = sent;
        statistics.draft = draft;
        statistics.trash = trash;

        return statistics;
    }
});
