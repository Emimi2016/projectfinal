Template.personalInformation.onCreated(function() {
    var self = this;
    self.addingNewUser = new ReactiveVar(false);
    self.identity = new ReactiveVar(null);
    self.autorun(function() {
        if (Template.currentData()) {
            self.identity.set(Template.currentData().persodata.identity);
        } else {
            self.addingNewUser.set(true);
        }
    });
});

Template.personalInformation.onRendered(function(){
    // $('.i-checks').iCheck({
    //     checkboxClass: 'icheckbox_square-green',
    //     radioClass: 'iradio_square-green'
    // });
    var defaultDate = function() {
        if (Template.currentData()) {
            return Template.currentData().persodata.dob === null ? moment().format('YYYY-MM-DD') : Template.currentData().persodata.dob;
        } else {
            return moment().format('YYYY-MM-DD');
        }
    }
    this.$("#birthday").birthdayPicker({
        "defaultDate": defaultDate(),
        "placeholder": true,
    	"maxAge": 100,
        "dateFormat" : "bigEndian",
    	"monthFormat":"long",
    	"sizeClass": "span3"
    });
    this.$("#nhsNumber").mask("999-999-9999");
    this.$('input[name="workingDays"]').each(function(index) {
        var checked = $(this).prop('checked'),
            dayId = $(this).prop('id'),
            hoursRowId = ['#', dayId, '-workingHours'].join('');
        if (checked) {
            $(hoursRowId).removeClass('hidden');
        }
    });
    this.$('.clockpicker').clockpicker();
    function checkAge() {
        var year = $('[name="birthday_birth[year]"]').val(),
            month = $('[name="birthday_birth[month]"]').val() - 1,
            day = $('[name="birthday_birth[day]"]').val(),
            dateOfBirth = new Date(year, month, day),
            today = new Date(),
            age = today.getFullYear() - dateOfBirth.getFullYear(),
            m = today.getMonth() - dateOfBirth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dateOfBirth.getDate())) {
            age--;
        }
        $('#age').val(age);
        if (parseInt(age) < 18) {
            $('#minor').removeClass('hidden');
        } else {
            $('#minor').addClass('hidden');
        }
    }

    $('[name="birthday_birth[year]"]').on('change', checkAge);
    $('[name="birthday_birth[month]"]').on('change', checkAge);
    $('[name="birthday_birth[day]"]').on('change', checkAge);
    $('[name="birthday_birth[year]"]').trigger('change');

    $.validator.addMethod("nhsNumber", function(value, element) {
        return this.optional(element) || /^(\d\d\d)-(\d\d\d)-(\d\d\d\d)$/.test(value);
    }, "Please specify the correct NHS number");
    $("#perso-provider-form").validate({
        rules: {
            "birthday_birth[year]": {
                required: true,
                // notEqualTo: "0"
            },
            "birthday_birth[month]": {
                // notEqualTo: "0"
            },
            "birthday_birth[day]": {
                // notEqualTo: "0"
            },
            "nhsNumber": {
                nhsNumber: true
            }
       }
   });
});

Template.personalInformation.events({
    'submit #perso-provider-form': function(event, template) {
        event.preventDefault();
        var form = event.target;
        console.log(this._id);
        console.log('sunday ' + form.sunday);
        if (template.addingNewUser.get()) {
            console.log('adding new user');
            template.identity.set(1);
        }
        if (template.identity.get() == 1) {
            var year = form['birthday_birth[year]'].value,
            month = form['birthday_birth[month]'].value,
            day = form['birthday_birth[day]'].value;
            if (year != 0 && month != 0 && day != 0) {
                var dob = new Date([year, '-', month, '-', day,].join(''));
            }
            var workTime = '';
            var email = form.email ? form.email.value : '';
        } else {
            var email = Meteor.user().emails[0].address;
            var workTime = {
				sundays2: {
                    dayNumber: form.sundays2.value,
                    isWorkDay: form.sundays2.checked,
                    from: form.sundays2From.value,
                    to: form.sundays2To.value
                },
				sundays3: {
                    dayNumber: form.sundays3.value,
                    isWorkDay: form.sundays3.checked,
                    from: form.sundays3From.value,
                    to: form.sundays3To.value
                },
				sundays4: {
                    dayNumber: form.sundays4.value,
                    isWorkDay: form.sundays4.checked,
                    from: form.sundays4From.value,
                    to: form.sundays4To.value
                },
                sunday: {
                    dayNumber: form.sunday.value,
                    isWorkDay: form.sunday.checked,
                    from: form.sundayFrom.value,
                    to: form.sundayTo.value
                },
				mondays2: {
                    dayNumber: form.mondays2.value,
                    isWorkDay: form.mondays2.checked,
                    from: form.mondays2From.value,
                    to: form.mondays2To.value
                },
				mondays3: {
                    dayNumber: form.mondays3.value,
                    isWorkDay: form.mondays3.checked,
                    from: form.mondays3From.value,
                    to: form.mondays3To.value
                },
				mondays4: {
                    dayNumber: form.mondays4.value,
                    isWorkDay: form.mondays4.checked,
                    from: form.mondays4From.value,
                    to: form.mondays4To.value
                },
                monday: {
                    dayNumber: form.monday.value,
                    isWorkDay: form.monday.checked,
                    from: form.mondayFrom.value,
                    to: form.mondayTo.value
                },
				tuesdays2: {
                    dayNumber: form.tuesdays2.value,
                    isWorkDay: form.tuesdays2.checked,
                    from: form.tuesdays2From.value,
                    to: form.tuesdays2To.value
                },
				tuesdays3: {
                    dayNumber: form.tuesdays3.value,
                    isWorkDay: form.tuesdays3.checked,
                    from: form.tuesdays3From.value,
                    to: form.tuesdays3To.value
                },
				tuesdays4: {
                    dayNumber: form.tuesdays4.value,
                    isWorkDay: form.tuesdays4.checked,
                    from: form.tuesdays4From.value,
                    to: form.tuesdays4To.value
                },
                tuesday: {
                    dayNumber: form.tuesday.value,
                    isWorkDay: form.tuesday.checked,
                    from: form.tuesdayFrom.value,
                    to: form.tuesdayTo.value
                },
				wednesdays2: {
                    dayNumber: form.wednesdays2.value,
                    isWorkDay: form.wednesdays2.checked,
                    from: form.wednesdays2From.value,
                    to: form.wednesdays2To.value
                },
				wednesdays3: {
                    dayNumber: form.wednesdays3.value,
                    isWorkDay: form.wednesdays3.checked,
                    from: form.wednesdays3From.value,
                    to: form.wednesdays3To.value
                },
				wednesdays4: {
                    dayNumber: form.wednesdays4.value,
                    isWorkDay: form.wednesdays4.checked,
                    from: form.wednesdays4From.value,
                    to: form.wednesdays4To.value
                },
                wednesday: {
                    dayNumber: form.wednesday.value,
                    isWorkDay: form.wednesday.checked,
                    from: form.wednesdayFrom.value,
                    to: form.wednesdayTo.value
                },
				thursdays2: {
                    dayNumber: form.thursdays2.value,
                    isWorkDay: form.thursdays2.checked,
                    from: form.thursdays2From.value,
                    to: form.thursdays2To.value
                },
				thursdays3: {
                    dayNumber: form.thursdays3.value,
                    isWorkDay: form.thursdays3.checked,
                    from: form.thursdays3From.value,
                    to: form.thursdays3To.value
                },
				thursdays4: {
                    dayNumber: form.thursdays4.value,
                    isWorkDay: form.thursdays4.checked,
                    from: form.thursdays4From.value,
                    to: form.thursdays4To.value
                },
                thursday: {
                    dayNumber: form.thursday.value,
                    isWorkDay: form.thursday.checked,
                    from: form.thursdayFrom.value,
                    to: form.thursdayTo.value
                },
								fridays2: {
                    dayNumber: form.fridays2.value,
                    isWorkDay: form.fridays2.checked,
                    from: form.fridays2From.value,
                    to: form.fridays2To.value
                },
				fridays3: {
                    dayNumber: form.fridays3.value,
                    isWorkDay: form.fridays3.checked,
                    from: form.fridays3From.value,
                    to: form.fridays3To.value
                },
				fridays4: {
                    dayNumber: form.fridays4.value,
                    isWorkDay: form.fridays4.checked,
                    from: form.fridays4From.value,
                    to: form.fridays4To.value
                },
                friday: {
                    dayNumber: form.friday.value,
                    isWorkDay: form.friday.checked,
                    from: form.fridayFrom.value,
                    to: form.fridayTo.value
                },
								saturdays2: {
                    dayNumber: form.saturdays2.value,
                    isWorkDay: form.saturdays2.checked,
                    from: form.saturdays2From.value,
                    to: form.saturdays2To.value
                },
				saturdays3: {
                    dayNumber: form.saturdays3.value,
                    isWorkDay: form.saturdays3.checked,
                    from: form.saturdays3From.value,
                    to: form.saturdays3To.value
                },
				saturdays4: {
                    dayNumber: form.saturdays4.value,
                    isWorkDay: form.saturdays4.checked,
                    from: form.saturdays4From.value,
                    to: form.saturdays4To.value
                },
                saturday: {
                    dayNumber: form.saturday.value,
                    isWorkDay: form.saturday.checked,
                    from: form.saturdayFrom.value,
                    to: form.saturdayTo.value
                }
            }
        }
        var persodata = {
            fname: form.firstName ? form.firstName.value : '',
            lname: form.lastName ? form.lastName.value : '',
            maidenName: form.maidenName ? form.maidenName.value : '',
            jobTitle: form.jobTitle ? form.jobTitle.value : '',
            gender: form.gender ? $('input[name=gender]:radio:checked').val() : '', // fix for IE: use old jquery selector
            job: form.job ? $('input[name=job]:radio:checked').val() : '', // fix for IE: use old jquery selector
            dob: dob ? dob : '',
            mothersName: form.mothersName ? form.mothersName.value : '',
            fathersName: form.fathersName ? form.fathersName.value : '',
            speciality: form.speciality ? form.speciality.value : '',
            country: form.country ? form.country.value : '',
            language: form.language ? form.language.value : '',
            address: form.address ? form.address.value : '',
            postalCode: form.postalCode ? form.postalCode.value : '',
            city: form.city ? form.city.value : '',
            addressArea: form.addressArea ? form.addressArea.value : '',
            mobileNumber: form.mobileNumber ? form.mobileNumber.value : '',
            homeNumber: form.homeNumber ? form.homeNumber.value : '',
            nhsNumber: form.nhsNumber ? form.nhsNumber.value : '',
            emergencyName: form.emergencyName ? form.emergencyName.value : '',
            emergencyNumber: form.emergencyNumber ? form.emergencyNumber.value : '',
            weight: form.weight ? form.weight.value : '',
            height: form.height ? form.height.value : '',
            email: email,
            skype: form.skype ? form.skype.value : '',
            workTime: workTime,
        }
        if (Meteor.userId() != this._id) {
            persodata['patientId'] = this._id;
        }
        if (template.addingNewUser.get()) {
            persodata['newUser'] = true;
            persodata['identity'] = 1;
        } else {
            persodata['newUser'] = false;
        }
        console.log(persodata.newUser);
        Meteor.call('createOrUpdateProviderProfile', persodata, function(err, result) {
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
                    text: 'Your personal data has been modified.',
                    allowEscapeKey:false,
                    closeOnCancel:false,
                    closeOnConfirm: true,
                    type:'info'
                });
                $('#newPatient').trigger('click');
            }
        });
    },
    'change input[name="workingDays"]': function(event, template) {
        var dayId = event.currentTarget.id;
        var hoursRowId = ['#', dayId, '-workingHours'].join('');
        $(hoursRowId).toggleClass('hidden');
    },
    'click .checkbox label': function(event, template) {
        console.log('click .checkbox label');
        console.log(event.currentTarget);
        console.log($(event.currentTarget).closest('checkbox').find("input"));
        console.log($(event.currentTarget).siblings());
        var input = $(event.currentTarget).siblings()[0];
        if (input!==undefined) {
            var hoursRowId = ['#', input.id, '-workingHours'].join('');
            $(hoursRowId).toggleClass('hidden');
        }
    }
});

Template.personalInformation.helpers({
    //TODO: throw and error in console
    checkWorkDay: function(day) {
        var isWorkDay = 'Meteor.user().persodata.workTime.' + day + '.isWorkDay';
        if (eval(isWorkDay)) {
            return 'checked';
        }
        return;
    },
    patient: function() {
        if (Template.currentData()) {
            return Template.instance().identity.get() == 1;
        } else {
            return true;
        }
    },
    checkGender: function(value) {
        var sex = Meteor.user().persodata.gender;
        if (sex == value) {
            return 'checked';
        }
        return;
    },
     checkJob: function(value) {
        var job = Meteor.user().persodata.job;
        if (job == value) {
            return 'checked';
        }
        return;
     },
    countrySelected: function(value) {
        var country = Meteor.user().persodata.country;
        if (country == value) {
            return 'selected'
        }
        return;
    }
});
