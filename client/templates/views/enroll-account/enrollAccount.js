Template.enrollAccount.onDestroyed(function() {
    Session.set('passwordToken', undefined);
});

Template.enrollAccount.onRendered(function() {
    console.log('enroll rendered');
    $('#enrollAccForm').validate({
        rules: {
            password: {
                required: true,
                minlength: 8
            },
            passwordRepeat: {
                required: true,
                minlength: 8,
                equalTo: "#password"
            }
        }
    });
});

Template.enrollAccount.helpers({
    passwordToken: function() {
        return Session.get('passwordToken');
    }
});

Template.enrollAccount.events({
    'submit #enrollAccForm': function(event, template) {
        event.preventDefault();
        console.log('enroll acc submited');
        var password = event.target.password.value,
            passwordRepeat = event.target.passwordRepeat.value;

        Accounts.resetPassword(Session.get('passwordToken'), password, function(err) {
            if (err && err.error) {
                swal({
                    title: 'Error occured',
                    text: err.reason,
                    allowEscapeKey: false,
                    closeOnCancel: false,
                    closeOnConfirm: true,
                    type: 'error'
                });
            } else {
                swal({
                    title: 'Create succeeded',
                    text: 'You successifully activated you account.',
                    allowEscapeKey: false,
                    closeOnCancel: false,
                    closeOnConfirm: true,
                    type: 'info'
                });
                Router.go('/login');
            }
        });
    }
});
