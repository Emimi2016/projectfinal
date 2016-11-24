
Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound'
});

// More info: https://github.com/EventedMind/iron-router/issues/3
AccountController = RouteController.extend({
    verifyEmail: function() {
        Accounts.verifyEmail(this.params.token, function() {
            Router.go('/verified');
        });
    }
});

var requireLogin = function() {

    /* Returns true if
        1. user login
        2. user session not expired
        3. user email verified
    */
    if (!Meteor.userId()) {
        console.log('accessDenied ');
        this.render('accessDenied');
        this.layout('landingLayout');
    } else {
        var user = Meteor.user();
        var dt = moment();
        var isOK = true;


        if (user !== null && user !== undefined) {
            /*if(user.emails !== undefined && !user.emails[0].verified)
            {
                isOK = false;
            }
              else */
            if (user.persodata !== null && user.persodata !== undefined) {
                var lastlogin = moment(user.persodata.lastlogin);
                //console.log('lastlogin ' + lastlogin);
                var diffDt = dt.diff(lastlogin, 'minutes');
                //console.log('requireLogin ' + diffDt);
                if (diffDt > 60) {
                    isOK = false;
                }
            }
        }

        if (isOK) {
            setTimeout(function() {
                $('.splash').css('display', 'none')
            }, 500);
            //console.log('requireLogin function OK ');
            this.next();
        } else {
            swal({
                    title: 'Session expired',
                    text: 'Sorry ' + user.username + ', your session has expired. Please log in.',
                    allowEscapeKey: false,
                    closeOnCancel: false,
                    closeOnConfirm: true,
                    type: 'info'
                },
                function() {

                    Meteor.logout();
                    Router.go('login');
                }
            );
        }
    }
};

Router.route('/categories', { name: 'categoriesList' });

//Ipn


Router.route('/ipn', function (req, res) {
            var ipn = Meteor.npmRequire("paypal-ipn");
            var wrappedVerify = Async.wrap(ipn, "verify");

            var request = this.request;
            var verified;

            var payment = request.body;
            Orders.insert({payment: payment});
  console.log('successful payment, return info, ', req);
  this.render('paypal-trans-complete');
  
}, {name: 'ipn', where: 'server'});

Router.route(function() {

    this.route('verifyEmail', {
        controller: 'AccountController',
        path: '/verify-email/:token',
        action: 'verifyEmail'
    });
    /*
        this.route('verified', {
            path: '/verified',
            template: 'verified'
        });

        this.route('checkemail', {
            path: '/checkemail',
            template: 'checkemail'
        });*/
    /*
     this.route('resetpassword', {
        path: '/reset-password/:resetPasswordToken',
        onBeforeAction: function() {
            Accounts._resetPasswordToken = this.params.resetPasswordToken;
            this.next();
        },
        template: 'blankLayout'
     });*/
});


Router.route('/checkemail', function() {

    this.render('checkemail');
    this.layout('blankLayout');
});

Router.route('/verified', function() {

    this.render('verified');
    this.layout('blankLayout');
});


//
// Home route
//

Router.route('/', function() {
    var dt = moment();
    if (!Meteor.userId()) {
        //Router.go('login');
        this.render('home');
        this.layout('homelayout');
    } else {
        console.log("router to dashboard");
        var user = Meteor.user();
        // user must have the email verified
        // if not verified: give limit access
        $('html').addClass('user-interface');
        if (!user.emails[0].verified) {
            Router.go('profile');
        } else {
            Router.go('dashboard');
        }
        this.layout('layout');
    }
}, {
    name: "home"
});

Router.route('/learn-more', function() {
    var dt = moment();
    if (!Meteor.userId()) {
        //Router.go('login');
        this.render('learnMore');
        this.layout('homelayout');
    } else {
        console.log("router to dashboard");
        var user = Meteor.user();
        // user must have the email verified
        // if not verified: give limit access
        if (!user.emails[0].verified) {
            Router.go('profile');
        } else {
            Router.go('dashboard');
        }
        this.layout('layout');
    }
}, {
    name: "learnMore"
});

//
// Dashboard route
//
Router.route('/dashboard', function() {
    $('html').addClass('user-interface');
    this.render('dashboard');
    this.layout('layout');
});

Router.route('/forgotpassword', function() {

    this.render('ForgotPassword');
    this.layout('blankLayout');
}, { name: 'forgotpassword' });

Router.route('/reset-password/:token', {
    name: 'resetpassword',
    layoutTemplate: 'blankLayout',
    onBeforeAction: function() {
        console.log('/reset-password/:resetPasswordToken ' + this.params.token);
        Accounts._resetPasswordToken = this.params.token;
        Session.set('resetPassword', Accounts._resetPasswordToken);
        this.next();
    }
});

Router.route('/enroll-account/:token', {
    name: 'enrollAccount',
    layoutTemplate: 'blankLayout',
    onBeforeAction: function() {
        Session.set('passwordToken', this.params.token);
        console.log(Session.get('passwordToken'));
        this.next();
    }
});

//paypal
Router.route('/paypalCallback', function (req, res) {
  Meteor.call('callBackendCode', this.params, function(err, res) {
    console.log('got the response');
    console.log(res);
  });
}, {name: 'paypal-callback', where: 'server'});

Router.route('/paypal-trans-complete', function (req, res) {
  // your return url direct your customer after the successful payment with some return information.
  console.log('successful payment, return info, ', req);
  this.render('paypal-trans-complete');
});


//
// Messages
//


Router.route('/mailbox', function() {
    this.render('mailbox');
});
/*
Router.route('/emailCompose', function () {
    this.render('emailCompose');
});
*/
Router.route('/emailCompose/:_id?', {
    /* waitOn: function () {
     return Meteor.subscribe("attachments")
     },*/
    template: 'emailCompose',
    data: function() {
        return UserMessages.findOne({ _id: this.params._id });
    },
    name: 'emailCompose'
});

Router.route('/emailView/:_id', {
    /* waitOn: function () {
     return Meteor.subscribe("attachments")
     },*/
    template: 'emailView',
    data: function() {
        return UserMessages.findOne({ _id: this.params._id });
    },
    name: 'emailView'
});

Router.route('/mailsent', function() {
    this.render('mailsent');
});

Router.route('/mailtrash', function() {
    this.render('mailtrash');
});

Router.route('/maildraft', function() {
    this.render('maildraft');
});

Router.route('/mailfolder', function() {
    this.render('mailfolder');
});
//
// Patients
//

Router.route('/patients', function() {
    var user = Meteor.user();
    // user should be a doctor to access the patients list
    if (user.persodata.identity == 2) {
        this.render('patients');
    } else {
        this.render('dashboard');
        this.next();
    }

});

Router.route('/patient/:_id', function() {
    if (Meteor.user().persodata.identity == 2) {
        this.render('patient', {
            data: function() {
                return Meteor.users.findOne({ _id: this.params._id });
            }
        })
    } else {
        this.render('dashboard');
        this.next();
    }
}, { name: 'patient' });

Router.route('/doctor', function() {
    var user = Meteor.user();
    // user should be a doctor to access the patients list
    if (user.persodata.identity == 1) {
        this.render('doctor');
    } else {
        this.render('dashboard');
        this.next();
    }

});

Router.route('/request/:_id', function() {
    this.render('doctorRequest');
}, { name: 'request' });

//
// Settings
//

Router.route('/settings', function() {
    this.render('settings');
});

Router.route('/profile', function() {
    this.render('profile');
});

//
// Records
//
Router.route('/records', function() {
    this.render('records');
});

//
// Apointments
//
Router.route('appointments/:_id?', {
    /* waitOn: function () {
     return Meteor.subscribe("attachments")
     },*/
    template: 'appointments',
    data: function() {
        return UserMessages.findOne({ _id: this.params._id });
    },
    name: 'appointments'
});


//
// Telemedicine
//
Router.route('/telemedicine', function() { 
this.render('telemedicine');
});


//
// Paiement
//
Router.route('/paiement', function() {
    this.render('paiement');
});

//
// Time
//
Router.route('/time', function() {
    this.render('time');
});


//
// Treatments
//
Router.route('/medical-record', function() {
    this.render('medicalRecord');
}, { name: 'medicalRecord' });

//
// Calendar
//
Router.route('/calendar', {
    template: 'calendar',
    name: 'calendar',
    onBeforeAction: function() {
        var user = Meteor.user();
        if (user != null && user != undefined && user.persodata != null && user.persodata != undefined && user.persodata.identity == 1) {
            if (user.doctor == undefined || user.doctor == null) {
                Router.go('/doctor');
            }
        }
        this.next();
    }
});

//
// Common views route
//

Router.route('/login', function() {
    $('html').removeClass('user-interface');
    this.render('login');
    this.layout('blankLayout');
}, {
    name: 'login'
});

Router.route('/termsOfUse', function() {
    this.render('termsOfUse');
    this.layout('blankLayout');
}, {
    name: 'termsOfUse'
});
Router.route('/register', function() {
    this.render('register');
    this.layout('blankLayout');
}, {
    name: 'register'
});
Router.route('/errorOne', function() {
    this.render('errorOne');
    this.layout('blankLayout');
});
Router.route('/errorTwo', function() {
    this.render('errorTwo');
    this.layout('blankLayout');
});

//pa
// Widgets route
//

Router.route('/widgets', function() {
    this.render('widgets');
});

//
// Global - Remove splash screen after after rendered layout
//

Router.onBeforeAction(requireLogin, {
    except: [
        'resetpassword',
        'enrollAccount',
        'forgotpassword',
        'ipn',
        'paypal-trans-complete',
        'home',
        'learnMore',
        'verified',
        'checkemail',
        'login',
        'register',
        'verifyEmail',
        'termsOfUse'
    ]
});
