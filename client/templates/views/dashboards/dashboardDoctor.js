Template.dashboardDoctor.onCreated(function() {
    var self = this;
    self.subscribe('usermessages');
    self.subscribe('bill');
    self.subscribe('appointments');
    self.subscribe('patients');
});

Template.dashboardDoctor.onRendered(function(){

    $('#clinicaldocuments').dataTable({"dom": '<"top">t<"bottom"><"clear">'});
    $('#messages').DataTable({
        "dom": '<"top">t<"bottom"><"clear">',
        'pageLength': 5
    });


    Meteor.setTimeout(function() {
        $('#appointments').dataTable({"dom": '<"top">t<"bottom"><"clear">'});
        $('#prescriptions').dataTable({
            "dom": '<"top">t<"bottom"><"clear">',
            'pageLength': 5
        });
    }, 0);
});

Template.dashboardDoctor.helpers({
    doctorPatients: function() {
        var patients = Meteor.users.find({doctor: {$ne: null}});
        return patients;
    },
    messages: function() {
            return UserMessages.find();
    },
    formatedMessageDate: function() {
        return moment(this.date).format('LLLL');
    },
    formatedStartDate: function() {
        return moment(this.startDate).format('MMM Do YYYY');
    },
    formatedAppointmentDate: function() {
        return moment(this.startDate).format('LLLL');
    },
    bills: function() {
        return Bills.find();
    },
    patientName: function() {
        var patient = Meteor.users.findOne({_id: Template.parentData().patient.patientId});
        return patient.persodata.lname + ', ' + patient.persodata.fname;
    },
    unreadMail: function() {
        return UserMessages.findOne({
            $and: [
                {userId: Meteor.userId()},
                {isRead: false},
                {isSent: false}
            ]
        }, {limit: 1});
    },
    nextAppointment: function() {
        return Appointments.findOne({
            startDate: {$gte: new Date()}
        }, {sort:{startDate: 1}, limit: 1});
    },
    unreadCount: function() {
        var count = UserMessages.find({$and: [{isRead: false}, {isSent: false}]}).count();
        return count ? count : "";
    },
    chartObj: function(){
        return {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: 'Bills',
                x: -20 //center
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            legend: {
              layout: 'vertical',
              align: 'right',
              verticalAlign: 'middle',
              borderWidth: 0
            },
            series: [{
                name: 'Bills',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }]
        };
    }
});
