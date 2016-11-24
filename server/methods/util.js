

Accounts.onCreateUser(function(options, user) {

   // console.log('onCreateUser ' + options.persodata.identity);

    var dtCurrent = new Date();

    Meteor.users.update({
        _id: user._id
    }, {
            $set: {
                'createdAt': dtCurrent
            }
        }
    );

    // set our user information
    // user.persodata = {
    //     'identity': options.persodata != undefined ? options.persodata.identity : null,
    //     'lastlogin': new Date(),
    // };
    if (options.persodata)
    {
        console.log('onCreateUser ' + options.persodata.fname + ' ' + options.persodata.lname);

        user.persodata = options.persodata;
        if (options.doctor) user.doctor = options.doctor;
        // if (options.persodata.lname !== undefined){
        //     user.persodata.lname = options.persodata.lname;
        // }
        // if (options.persodata.fname !== undefined){
        //     user.persodata.fname = options.persodata.fname;
        // }
        // if (options.persodata.mobile !== undefined){
        //     user.persodata.mobile = options.persodata.mobile;
        // }
    }


    if (user.services) {
        if (options.profile) {
            user.profile = options.profile
        }
        var service = _.keys(user.services)[0];
        if (service != undefined) {
            var email = user.services[service].email;
            var gender = user.services[service].gender;
            var lname = user.services[service].last_name;
            var fname = user.services[service].first_name;
        }
        if (!email) {
            if (user.emails) {
                email = user.emails.address;
            }
        }
        if (!email) {
            email = options.email;
        }
        if (!email) {
            // if email is not set, there is no way to link it with other accounts
            return user;
        }
        // Set personal data
        if (!user.persodata.email) {
            user.persodata.email = email;
        }
        if (!user.persodata.gender) {
            user.persodata.gender = gender;
        }
        if (!user.persodata.lname) {
            user.persodata.lname = lname;
        }
        if (!user.persodata.fname) {
            user.persodata.fname = fname;
        }

        // see if any existing user has this email address, otherwise create new
        var existingUser = Meteor.users.findOne({'emails.address': email});
        if (!existingUser) {
            // check for email also in other services
            var existingGitHubUser = Meteor.users.findOne({'services.github.email': email});
            var existingGoogleUser = Meteor.users.findOne({'services.google.email': email});
            var existingTwitterUser = Meteor.users.findOne({'services.twitter.email': email});
            var existingFacebookUser = Meteor.users.findOne({'services.facebook.email': email});

            // set gender
            if (existingFacebookUser)
            {

            }

            var doesntExist = !existingGitHubUser && !existingGoogleUser && !existingTwitterUser && !existingFacebookUser;
            if (doesntExist) {
                // return the user as it came, because there he doesn't exist in the DB yet
                return user;
            } else {
                existingUser = existingGitHubUser || existingGoogleUser || existingTwitterUser || existingFacebookUser;
                if (existingUser) {
                    if (user.emails) {
                        // user is signing in by email, we need to set it to the existing user
                        existingUser.emails = user.emails;
                    }
                }
            }
        }
        // precaution, these will exist from accounts-password if used
        if (!existingUser.services) {
            existingUser.services = { resume: { loginTokens: [] }};
        }
        // copy accross new service info
        existingUser.services[service] = user.services[service];
        if (existingUser.services.resume != undefined)
        {
            existingUser.services.resume.loginTokens = {};
        }
         if (user.services.resume != undefined)
         {
            if (user.services.resume.loginTokens != undefined)
            {
                existingUser.services.resume.loginTokens.push(
                    user.services.resume.loginTokens[0]
                );
            }
         }

        // even worse hackery
        Meteor.users.remove({_id: existingUser._id}); // remove existing record
        return existingUser;    		      // record is re-inserted
    }

    return user;
});
