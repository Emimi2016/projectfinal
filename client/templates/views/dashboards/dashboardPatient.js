Template.dashboardPatient.onCreated(function() {
    var self = this;
    self.subscribe('usermessages');
    self.subscribe('bill');
    self.subscribe('appointments');
    self.subscribe('doctor');
    self.subscribe('medicalRecords');

});

Template.dashboardPatient.onRendered(function() {
    Meteor.setTimeout(function() {
        $('#appointments').dataTable({"dom": '<"top">t<"bottom"><"clear">'});
        $('#prescriptions').dataTable({
            "dom": '<"top">t<"bottom"><"clear">',
            'pageLength': 5
        });

        if (Bill.findOne().bill.length < 12) {
            var chartData = Bill.findOne().vitals;
        } else {
            var chartData = Bill.findOne().vitals.slice(-12);
        }

        var vitalData = {
            labels: labels,
            datasets: [
                {
                    label: "Bills",
                    fillColor: "rgba(95, 198, 221, 0.3)",
                    strokeColor: "rgba(95, 198, 221, 1)",
                    pointColor: "rgba(95, 198, 221, 1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(95, 198, 221, 1)",
                    data: billData
                }
            ]
        };
        var billOptions = {
            scaleShowGridLines: true,
            scaleGridLineColor: "rgba(0,0,0,.05)",
            scaleGridLineWidth: 1,
            bezierCurve: true,
            bezierCurveTension: 0.4,
            pointDot: true,
            pointDotRadius: 4,
            pointDotStrokeWidth: 1,
            pointHitDetectionRadius: 20,
            datasetStroke: true,
            datasetStrokeWidth: 1,
            datasetFill: true,
            responsive: true
        };

        var ctx = document.getElementById("billOptions").getContext("2d");
        var amountChart = new Chart(ctx).Line(billlData, billOptions);
    }, 300);
});

Template.dashboardPatient.helpers({
    messages: function() {
        return UserMessages.find();
    },
    formatedMessageDate: function() {
        return moment(this.date).format('LLLL');
    },
    formatedStartDate: function() {
        return moment(this.startDate).format('MMM Do YYYY');
    },
    formatedAppointmentTime: function() {
        return moment(this.startDate).format('h:mm A') + ' - ' + moment(this.endDate).format('h:mm A');
    },
    formatedAppointmentDay: function() {
        return moment(this.startDate).format('D');
    },
    formatedAppointmentDayName: function() {
        return moment(this.startDate).format('dddd');
    },
    medicalRecord: function() {
        return MedicalRecords.findOne();
    },
    nextAppointment: function() {
        return Appointments.findOne({
            startDate: {$gte: new Date()}
        }, {sort:{startDate: 1}, limit: 1});
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
    unreadCount: function() {
        var count = UserMessages.find({$and: [{isRead: false}, {isSent: false}]}).count();
        return count ? count : "";
    },
    doctor: function(){
        return Meteor.users.findOne({_id: Meteor.user().doctor.doctorId});
    },
    chartObj: function(){
        return {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: 'Bill',
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
