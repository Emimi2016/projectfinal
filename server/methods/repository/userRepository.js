
/***
 * User Repository management
 */

Meteor.methods({
  createOrUpdatePatientDischarges: function(patientDischarge) {
      this.unblock();
      try {
          var id = Meteor.userId();
         if (!id) {
             return {err:'The user must be logged in!', status:false};
         }

         var existingPatientDischarge = Meteor.users.findOne({patientDischarges:{$elemMatch: {
                   medication: patientDischarge.medication,
                   dosage: patientDischarge.dosage,
                   amt: patientDischarge.amt,
                   frequency: patientDischarge.frequency
              }}});

          if (existingPatientDischarge)
          {
              console.log('patientDischarge already exists ');
              return  {err:"patientDischarge already exists", status:false, code:1};
          }

          if (!patientDischarge.id)
          {
              // add the new patientDischarge
              Meteor.users.update(
              { _id:id},
              { $push: {
                          patientDischarges:{
                              id: Random.id(),
                              medication: patientDischarge.medication,
                              dosage: patientDischarge.dosage,
                              amt: patientDischarge.amt,
                              frequency :patientDischarge.frequency
                          }
                      }
                  }
              );
          }
          else
          {
              // add the new patientDischarge
              Meteor.users.update(
              { _id:id, 'patientDischarges.id': patientDischarge.id },
              { $set: {
                          "patientDischarges.$":{
                              id: patientDischarge.id,
                              medication:patientDischarge.medication,
                              dosage: patientDischarge.dosage,
                              amt: patientDischarge.amt,
                              frequency: patientDischarge.frequency
                          }
                      }
                  }
              );
          }

          return {err:"", status:true, code:0};
      } catch (e) {
          // Got a network error, time-out or HTTP error in the 400 or 500 range.
          return {err:e.message, status:false, code:-1};
      }
  },
  removePatientDischarge: function(patientDischarge) {
      this.unblock();
      try {

          var id = Meteor.userId();
          if (!id) {
              return {err:'The user must be logged in!', status:false};
          }
          var id = Meteor.user()._id;
          // add the new patientDischarge
          Meteor.users.update(
          { _id:id, 'patientDischarges.id': patientDischarge.id },
          { $pull: {
                      patientDischarges:{
                          id: patientDischarge.id
                      }
                  }
              }
          );
          return {err:"", status:true, code:0};
      } catch (e) {
          // Got a network error, time-out or HTTP error in the 400 or 500 range.
          return {err:e.message, status:false, code:-1};
      }
  },

    "userExists": function(username){
            return !!Meteor.users.findOne({username: username});
        },
    register: function (user) {
        this.unblock();
            console.log('register server ' + user.username + ' ' + user.password + ' ' + user.identity + ' ' + user.fname + ' ' + user.lname);
            //console.log('register identity 0 '+ user.identity);
        try {

            check(user.username, String);

            // make sure the username not exits!
            if (Meteor.users.findOne({username: user.username}))
            {
                return {err:'Username already exists!', status:false};
            }
            console.log('register server 1');

            var userId = Accounts.createUser({
                email: user.email,
                username: user.username,
                password: user.password,
                persodata: {
                            //'identity': user.identity !== undefined ? user.identity : null,
                            'lastlogin': new Date(),
                            fname:user.fname,
                            lname:user.lname,
                            mobile:user.mobile,
                            identity:user.identity
                        }
            });
            console.log('register server 2');

            return {err:'', status:true, id:userId};
        } catch (e) {
            console.log('error ' + e);
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            return {err:e.message, status:false};
        }
    },

    SendVerifyEmail:function(email, userId) {
        this.unblock();
console.log('SendVerifyEmail server ' + email + ' - ' + userId);
        var user = Meteor.users.findOne({_id: userId});
        if (!user)
        {
            console.log('Username does not exists!');
            return {err:'Username does not exists!', status:false};
        }

        if(user.emails[0].verified)
        {
            console.log('User email already verified!');
            return {err:'User email already verified!', status:false};
        }

        //var result = serverVerifyEmail(email, userId);

        var result = Meteor.call('serverVerifyEmail', email, userId);
            console.log('result:' + result);


        return result;
    },
    confirmEmail: function(userId) {
        Meteor.users.update({
            _id: userId
        },
        {
            $set: {
                    //'persodata.identity': new Date()
                    persodata: {
                        'identity': user.identity,
                        'lastlogin': new Date()
                    }
                }
        });
    },
    checkPassword: function(password) {
        check(password, String);

        if (this.userId) {
            var user = Meteor.user();
            var result = Accounts._checkPassword(user, password);
            return result.error == null;
        } else {
        return false;
        }
    },
    loginWithSocial: function() {
        console.log('loginWithSocial');
        if (!Meteor.userId)
        {
            return;
        }
        var user = Meteor.user();
        console.log('loginWithSocial 1 ' + user._id);
        Meteor.users.update({
            _id: user._id
        },
        {
            $set: {
                    'persodata.lastlogin': new Date()
                }
        });
        console.log('loginWithSocial 2');

    },
    loginuser: function(user) {
        console.log('login user function: ' + user.username + ' ' + user.password + ' ' + user.identity+ ' ' + user.email);

      try {
            this.unblock();

            var dtCurrent = new Date();
            var puser = Meteor.users.findOne({username: user.username});

            if(!puser) {
                console.log('login failed');
                return {err:'Login has failed.', status:false};
            }

            var l_persodata = puser.persodata;
            l_persodata.lastlogin = dtCurrent;
            console.log("l_persodata.lastlogin " + l_persodata.lastlogin);

            //creating the token and adding to the user
            var stampedToken = Accounts._generateStampedLoginToken();
            //hashing is something added with Meteor 0.7.x,
            //you don't need to do hashing in previous versions
            var hashStampedToken = Accounts._hashStampedToken(stampedToken);

            Meteor.users.update(
                { _id: puser._id },
                { $set:{
                    //persodata: l_persodata
                    "persodata.lastlogin": l_persodata.lastlogin
                   /* persodata: {
                    'identity': l_persodata.identity,
                     lastlogin: l_persodata.lastlogin
                    }*/
                }}/*,
                { multi:true }*/
               );

            console.log('update ok ');
            return {status:true, token:hashStampedToken,identity: l_persodata.identity};
      }  catch (e) {
          console.log('login catch error ' + e);
          return {err:e.message, status:false};
      }
    },
    logoutuser: function(user) {
      this.unblock();

      try {
          console.log('logout puser ' + user);
          var puser = Meteor.users.findOne({username: user.username});


            return {status:true};
      }  catch (e) {
          console.log('logout catch error ' + e);
            var error = {message:e.message, status:false};
            console.log('server error message '+ error.message);
            console.log('server status '+ error.status);
            return error;
      }
    },
    changeUserPassword: function(user, password) {
      check(password, String);
      try {

            // make sure the username not exits!
            if (!Meteor.userId)
            {
                return {err:'You must be logged in!', status:false};
            }
            console.log('user._id ' + user._id);
            console.log('user.password ' + user.password);
            console.log('user.password ' + password);
          Accounts.changePassword(user.password, password);

            return {status:true, err:''};
      }  catch (e) {
            var error = {err:e.message, status:false};
            return error;
      }
    },
    getUserToken: function(user) {
         var puser = Meteor.users.findOne({username: user.username});
         var token = puser.services.resume.loginTokens[0].hashedToken;
         return token;
    },
    getVerificationCode: function (vcode, user) {
        console.log('register server ' + vcode.type + ' ' + vcode.data);
        this.unblock();

        try {
            var puser = Meteor.users.findOne({username: user.username});
            var result = HTTP.call("POST", "https://api.dejianwang.com/v1/vcode.json", {data: {'type':vcode.type, 'data':vcode.data}, headers:{"content-type":"application/json", "Authorization": "token " + puser.token}});
            return result;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            return false;
        }
    },
    getContacts: function()
    {
        if (!Meteor.userId())
        {
            return null;
        }
        var id = Meteor.userId();
        var user = Meteor.users.findOne({_id:id});
        var contacts = null;
        if (user.persodata.identity === 1)
        {
            console.log('contacts ' + user.doctor.doctorId);
            contacts = Meteor.users.find({ $and: [{_id: {$ne: Meteor.userId}}, {_id: user.doctor.doctorId} ] }, {fields: {'persodata.lname': 1, 'persodata.fname': 1, 'persodata.email': 1}});
        }
        else if (user.persodata.identity === 2)
        {
            contacts = Meteor.users.find({ $and: [{_id: {$ne: Meteor.userId}}, {'doctor.doctorId': Meteor.userId}] }, {fields: {'persodata.lname': 1, 'persodata.fname': 1, 'persodata.email': 1}});
        }
        return contacts;
    },
    getProfile: function() {

        this.unblock();
        try {
            var id = Meteor.userId();
            var puser = Meteor.users.findOne( {_id:id});

            var username = "";
            var email = "";
            var gender = "";
            var lname = "";
            var fname = "";
            if (puser.emails) {
                email = puser.emails[0].address;
                username = puser.username;
            }
            else if (puser.services) {
                if (puser.services.facebook) {
                    email = puser.services.facebook.email;
                    gender = puser.services.facebook.gender;
                }
                else if (puser.services.google) {
                    email = puser.services.google.email;
                }
                else if (puser.services.twitter) {
                    email = puser.services.twitter.email;
                }
            }

            if (puser.persodata) {
                if (!gender) {
                    gender = puser.persodata.gender;
                }
                if (!email) {
                    email = puser.persodata.email;
                }
                if (!lname) {
                    lname = puser.persodata.lname;
                    fname = puser.persodata.fname;
                }
                if (!fname) {
                    fname = puser.persodata.fname;
                }
            }

            var profile = {
              username: username,
              fname: fname,
              lname: lname,
              gender: gender,
              email: email,
              dob: puser.persodata.dob,
              weight: puser.persodata.weight,
              height: puser.persodata.height,
              language: puser.persodata.language,
              speciality: puser.persodata.speciality,
              workhours: puser.persodata.workhours,
              mobileNumber: puser.persodata.mobileNumber,
              homeNumber: puser.persodata.homeNumber,
              address: puser.persodata.address,
              city: puser.persodata.city,
              country: puser.persodata.country,
              postalCode: puser.persodata.postalCode,
              nhsNumber: puser.persodata.nhsNumber,
              emergencyName: puser.persodata.emergencyPerson,
              emergencyNumber: puser.persodata.emergencyNumber,
              organizationName: puser.privHealthcareData !== undefined ? puser.privHealthcareData.organizationName : null,
              registrationNumber: puser.privHealthcareData !== undefined ? puser.privHealthcareData.registrationNumber :null,
              hcAddress: puser.privHealthcareData !== undefined ? puser.privHealthcareData.address : null,
              hcPhoneNumber: puser.privHealthcareData !== undefined ? puser.privHealthcareData.phoneNumber : null,
              hcFax: puser.privHealthcareData !== undefined ? puser.privHealthcareData.fax : null,
              hcEmail: puser.privHealthcareData !== undefined ? puser.privHealthcareData.email : null,
              /*country: puser.persodata.country,
              address2: puser.persodata.address2,
              province: puser.persodata.province,
              phone: puser.persodata.phone,*/
            };

            return { status:true, profile: profile};
        }catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            console.log('server error message '+ e.message);
            console.log('server status '+ e.status);
            return { status:false, persodata:null, error:e.message};
        }
    },
    createOrUpdatePrivateHealthcare: function(privHealthcareData) {
        this.unblock();
        try {
            var id = Meteor.userId();
            if (!id) {
                return {err: 'The user must be logged in!', status: false}
            }
            Meteor.users.update({
                _id: id,
            }, {
                $set: {
                    privHealthcareData: {
                        organizationName: privHealthcareData.orgName,
                        registrationNumber: privHealthcareData.regNumber,
                        address: privHealthcareData.hcAddress,
                        phoneNumber: privHealthcareData.hcPhoneNumber,
                        fax: privHealthcareData.hcFax,
                        email: privHealthcareData.hcEmail,
                    }
                }
            });
            return {status:true};
        } catch(e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.v
            console.log('server error message '+ e.message);
            return {err:e.message, status:false};
        }
    },
    editVitalSign: function(vitalSign, recordId){
      this.unblock();
      try {
          var id = Meteor.userId();
          if (!id) {
              return {err: 'The user must be logged in!', status: false}
          }
          MedicalRecords.update(
            {_id:recordId, 'vitals.id':vitalSign.id},
            {
              $set:{
                'vitals.$.weight':vitalSign.weight,
                'vitals.$.height':vitalSign.height,
                'vitals.$.bmi':vitalSign.bmi,
                'vitals.$.bp':vitalSign.bp,
                'vitals.$.pulse':vitalSign.pulse,
                'vitals.$.respiration':vitalSign.respiration,
                'vitals.$.temperature':vitalSign.temperature,
                'vitals.$.date':vitalSign.date
              }
            }
          );
          return {status:true};
      } catch(e) {
          // Got a network error, time-out or HTTP error in the 400 or 500 range.v
          console.log('server error message '+ e.message);
          return {err:e.message, status:false};
      }
    },
    editAllergy: function(allergy, recordId){
      this.unblock();
      try {
          var id = Meteor.userId();
          if (!id) {
              return {err: 'The user must be logged in!', status: false}
          }
          MedicalRecords.update(
            {_id:recordId, 'allergies.id':allergy.id},
            {
              $set:{
                'allergies.$.description':allergy.description,
                'allergies.$.type':allergy.type,
                'allergies.$.allergen':allergy.allergen
              }
            }
          );
          return {status:true};
      } catch(e) {
          // Got a network error, time-out or HTTP error in the 400 or 500 range.v
          console.log('server error message '+ e.message);
          return {err:e.message, status:false};
      }
    },
    editVaccination: function(vaccination, recordId){
      this.unblock();
      try {
          var id = Meteor.userId();
          if (!id) {
              return {err: 'The user must be logged in!', status: false}
          }
          MedicalRecords.update(
            {_id:recordId, 'vaccinations.id':vaccination.id},
            {
              $set:{
                'vaccinations.$.cvxCode':vaccination.cvxCode,
                'vaccinations.$.dateAdministered':vaccination.dateAdministered,
                'vaccinations.$.givenDate':vaccination.givenDate,
                'vaccinations.$.expiryDate':vaccination.expiryDate,
                'vaccinations.$.drugRoute':vaccination.drugRoute
              }
            }
          );
          return {status:true};
      } catch(e) {
          // Got a network error, time-out or HTTP error in the 400 or 500 range.v
          console.log('server error message '+ e.message);
          return {err:e.message, status:false};
      }
    },
    createOrUpdateProviderProfile: function(persodata) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'You must be loged in!');
        }
        check(persodata, Object);

        if (Meteor.users.findOne({_id: this.userId}).persodata.identity == 2 && persodata.newUser) {
            // accounts create and send email
            var options = {};
            var doctor = {
                doctorId: this.userId,
                registrationDate: new Date()
            }
            options.email = persodata.email;
            options.persodata = persodata;
            options.doctor = doctor;
            var newUserId = Accounts.createUser(options);

            Accounts.sendEnrollmentEmail(newUserId, persodata.email);
        } else {
            if (persodata.patientId) {
                var id = persodata.patientId;
            } else {
                var id = this.userId;
            }

            _.each(persodata, function(value, key) {
                if (value === '') {
                    delete persodata[key];
                }
            });

            var persodataMerged = _.extend(Meteor.users.findOne({_id: id}).persodata, persodata);

            Meteor.users.update({
                _id: id,
            }, {
                $set: {
                    persodata: persodataMerged
                }
            });
        }
    },
    createOrUpdateWorkouts: function(workout) {
        this.unblock();
        try {
            var id = Meteor.userId();
           if (!id) {
               return {err:'The user must be logged in!', status:false};
           }

           var existingWorkout = Meteor.users.findOne({workouts:{$elemMatch: {
                     name: workout.name,
                     category: workout.category
                }}});

            if (existingWorkout)
            {
                console.log('workout already exists ');
                return  {err:"workout already exists", status:false, code:1};
            }

            if (!workout.id)
            {
                // add the new workout
                Meteor.users.update(
                { _id:id},
                { $push: {
                            workouts:{
                                id: Random.id(),
                                name:workout.name,
                                category: workout.category
                            }
                        }
                    }
                );
            }
            else
            {
                // add the new workout
                Meteor.users.update(
                { _id:id, 'workouts.id': workout.id },
                { $set: {
                            "workouts.$":{
                                id: workout.id,
                                name:workout.name,
                                category: workout.category
                            }
                        }
                    }
                );
            }

            return {err:"", status:true, code:0};
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            return {err:e.message, status:false, code:-1};
        }
    },
    removePatient: function(patientId) {
        check(patientId, String);
        console.log(patientId);
        Meteor.users.update({_id: patientId}, {$set: {
            'doctor.doctorId': null,
            'doctor.registrationDate': null
        }});
    },
    removeWorkout: function(workout) {
        this.unblock();
        try {

            var id = Meteor.userId();
            if (!id) {
                return {err:'The user must be logged in!', status:false};
            }
            var id = Meteor.user()._id;
            // add the new workout
            Meteor.users.update(
            { _id:id, 'workouts.id': workout.id },
            { $pull: {
                        workouts:{
                            id: workout.id
                        }
                    }
                }
            );
            return {err:"", status:true, code:0};
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            return {err:e.message, status:false, code:-1};
        }
    },
    createRecord:function(record) {
        this.unblock();
        try {
           var id = Meteor.userId();
           if (!id) {
               return {err:'The user must be logged in!', status:false};
           }

           return {err:"", status:true, code:0};
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            return {err:e.message, status:false, code:-1};
        }
    },
    deleteRecord: function(record) {
        this.unblock();
        try {
           var id = Meteor.userId();
           if (!id) {
               return {err:'The user must be logged in!', status:false};
           }

            var id = Meteor.user()._id;
            // remove the record
            Meteor.users.update(
            { _id:id, 'records.id': record.id },
            { $pull: {
                        records:{
                            id: record.id
                        }
                    }
                }
            );

           return {err:"", status:true, code:0};
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            return {err:e.message, status:false, code:-1};
        }

    },
    createOrUpdateAppointment: function(user) {
      // One to Many relationship with references array : one patient can have many appointments, one care provider can have many appointments and one appointment must link one patient and one care provider

    },
    createOrUpdateEducation: function(user) {
        this.unblock();
        try {
            var puser = Meteor.users.findOne({username: user.username});
            var education = user.persodata.education;

            var action = "";
            var url = "";
            if (education.edid == undefined)
            {
                action = "POST";
                url = "https://api.dejianwang.com/v1/provider/education.json";
            }
            else
            {
                action = "PUT";
                url = "https://api.dejianwang.com/v1/provider/education/"+ education.edid +".json";
            }

            var dataEducation = {'school':education.school,
                             'start_date':education.start_date,
                             'end_date':education.end_date,
                             'degree':education.degree,
                             'subject':education.subject,
                             'note':education.note,
                             'file':education.file};

            var result = HTTP.call(action, url, {data: dataEducation, headers:{"content-type":"application/json", "Authorization": "token " + puser.token}});
            console.log('edid ' + result.edid);
            education.edid = result.edid;
            console.log('edid ' + education.edid);
            Meteor.users.update({
                _id: user._id
                }, {
                $set: {
                    "persodata.education": { education }
                }
            });

            return result;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            return false;
        }
    },
    getEducation: function(user) {
        this.unblock();
        try {
            var puser = Meteor.users.findOne({username: user.username});

            var action = "GET";
            var url = "https://api.dejianwang.com/v1/provider/education.json";

            var result = HTTP.call(action, url, {data: education, headers:{"content-type":"application/json", "Authorization": "token " + puser.token}});

            var education = JSON.parse(result.content);

            Meteor.users.update({
                _id: user._id
                }, {
                $set: {
                    "persodata.education": { education }
                }
            });

            return result;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            return false;
        }
    },
    createOrUpdateQualification: function(user) {
        this.unblock();
        try {
            var puser = Meteor.users.findOne({username: user.username});
            var qualification = user.persodata.qualification;

            var action = "";
            var url = "";
            if (qualification.qid == undefined)
            {
                action = "POST";
                url = "https://api.dejianwang.com/v1/provider/q11n.json";
            }
            else
            {
                action = "PUT";
                url = "https://api.dejianwang.com/v1/provider/q11n/"+ qualification.q11n +".json";
            }

            var qualificationData = {'qid':qualification.qid,
                             'date':qualification.date,
                             'title':qualification.title,
                             'issuer':qualification.issuer,
                             'note':qualification.note,
                             'file':qualification.file};

            var result = HTTP.call(action, url, {data: qualificationData, headers:{"content-type":"application/json", "Authorization": "token " + puser.token}});
            console.log('qid ' + result.qid);
            if (action == "POST")
            {
                qualificationData.qid = result.qid;
            }

            console.log('qid ' + qualificationData.qid);
            Meteor.users.update({
                _id: user._id
                }, {
                $set: {
                    "persodata.qualification": { qualificationData }
                }
            });

            return result;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            return false;
        }
    },
    createorupdatelabels:function(labelData){
        this.unblock();
        try {
            var id = Meteor.userId();
            console.log(labelData)
           if (!id) {
               return {err:'The user must be logged in!', status:false};
           }

           var existingLabel = Meteor.users.findOne({labels:{$elemMatch: {
                     name: labelData.labelName
                }}});

            if (existingLabel)
            {
                console.log('Label already exists ');
                return  {err:"Label already exists", status:false, code:1};
            }

            if (!labelData.id)
            {
                // add the new label
                Meteor.users.update(
                { _id:id},
                { $push: {
                            labels:{
                                id: Random.id(),
                                name:labelData.labelName,
                                isVisible:labelData.isVisible
                            }
                        }
                    }
                );
            }
            else
            {
                // updated the label
                Meteor.users.update(
                { _id:id, 'labels.id': labelData.id },
                { $set: {
                            "labels.$":{
                                id: labelData.id,
                                name:labelData.labelName,
                                isVisible:labelData.isVisible
                            }
                        }
                    }
                );
            }

            return {err:"", status:true, code:0};
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            return {err:e.message, status:false, code:-1};
        }
    },
    removeLabels: function(labelData) {
        this.unblock();
        try {

            var id = Meteor.userId();
            if (!id) {
                return {err:'The user must be logged in!', status:false};
            }
            var id = Meteor.user()._id;
            // add the new workout
            Meteor.users.update(
            { _id:id, 'labels.id': labelData.id },
            { $pull: {
                        labels:{
                            id: labelData.id
                        }
                    }
                }
            );
            return {err:"", status:true, code:0};
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            return {err:e.message, status:false, code:-1};
        }
    },
    getQualification:function(user) {
        this.unblock();
        try {
            var puser = Meteor.users.findOne({username: user.username});

            var action = "GET";
            var url = "https://api.dejianwang.com/v1/provider/q11n.json";

            var result = HTTP.call(action, url, {headers:{"content-type":"application/json", "Authorization": "token " + puser.token}});

            var content = JSON.parse(result.content);
            var qualification = JSON.parse(content.results);

            Meteor.users.update({
                _id: user._id
                }, {
                $set: {
                    "persodata.qualification": { qualification }
                }
            });

            return result;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            return false;
        }
    },
    searchProdiders: function(user) {
         this.unblock();
        try {
            var puser = Meteor.users.findOne({username: user.username});
            var persodata = user.persodata
            var result = HTTP.call("POST", "https://api.dejianwang.com/v1/user/user/provider.json", {data: {'provider_id':persodata.id,
                                                                                                          'name':persodata.name,
                                                                                                          'gender':persodata.gender,
                                                                                                          'speciality':persodata.speciality,
                                                                                                          'language':persodata.language,
                                                                                                          'address':persodata.address,
                                                                                                          'country':persodata.country,
                                                                                                          'postcode':persodata.postcode,
                                                                                                          'workhours':persodata.workhours,
                                                                                                          'area':persodata.avatar,
                                                                                                          'postcode':persodata.id_file,
                                                                                                          'city':persodata.city,
                                                                                                          'province':persodata.province,
                                                                                                          'scat':persodata.scat,
                                                                                                          'subscat':persodata.subscat,
                                                                                                          'stype':persodata.stype}, headers:{"content-type":"application/json", "Authorization": "token " + puser.token}});
            return result;
        }catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            return false;
        }
    },
    getRefDoctorId: function() {
        var patientId = this.userId;
        var patient = Meteor.users.findOne({_id: patientId});
        return patient.refDoc.doctorId;
    },
    getMedicalCategories: function(user) {
        try {
            console.log('server getMedicalCategories')
            var result = HTTP.call("GET", "https://api.dejianwang.com/v1/scat.json", { headers:{"content-type":"application/json", "Authorization": "token " + user.token}});

               // console.log('result ' + result.content);
            //console.log('result ' + JSON.parse(result.content).results);
            //return JSON.parse(result.content);
            return JSON.parse(result.content).results;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            console.log(e);
            return false;
        }
}
});
