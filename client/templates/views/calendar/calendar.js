Template.calendar.onCreated(function() {
    var self = this;
    self.subscribe('appointments');
    self.subscribe('doctor');
    self.autorun(function() {
        if (Meteor.user().persodata.identity == 1) {
            self.subscribe('doctors-appointments');
        }
    });
});

Template.calendar.onRendered(function() {
    var self = this;
    Meteor.setTimeout(function() {
        $('#calendar').fullCalendar('refetchEvents');

         $('#appointmentsTable').dataTable({
        dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp",
        "lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
        buttons: [
            {extend: 'copy',className: 'btn-sm'},
            {extend: 'csv',title: 'Appointments', className: 'btn-sm'},
            {extend: 'pdf', title: 'Appointments', className: 'btn-sm'}
        ]
    });
    }, 0);
});

Template.calendar.helpers({
    calOptions: function() {
        return {
            id: 'calendar',
            defaultView: 'agendaWeek',
            timezone: 'local',
            editable: false,
            selectable: true,
            allDaySlot: false,
            events: function(start, end, timezone, callback) {
                var getAppointments = Appointments.find(),
                    eventsArray = [];
                eventsArray = getAppointments.fetch().map(function(appObj) {
                    var event = {};
                    event['id'] = appObj._id;
                    event['title'] = appObj.healthIssues ? appObj.healthIssues : 'doctor busy';
                    event['start'] = appObj.startDate;
                    event['end'] = appObj.endDate;
                    event['status'] = appObj.status;
                    event['pay'] = appObj.pay;
                    return event;
                });
                callback(eventsArray);
            },
            select: function(start, end, allDay) {
                Modal.show('reqNewAppointmentModal');
                $('#dateInfo').html('You requested your appointment on: ' +
                start.format('MMMM Do YYYY, h:mm:ss a') + '-' +
                end.format('h:mm:ss a'));
                $('#appStartDate').val(start);
                $('#appEndDate').val(end);
            },
            eventClick: function(event, jsEvent, view) {
                if (event.status && event.status != 'canceled') {
                    Modal.show('editAppointmentModal', function() {
                        return Appointments.findOne({_id: event.id});
                    })
                } else if (event.status && event.status === 'canceled') {
                    swal({
                        title: 'Appointment canceled!',
                        text: 'This appointment has been canceled.',
                        allowEscapeKey: false,
                        closeOnCancel: false,
                        closeOnConfirm: true,
                        type: 'warning'
                    });
                } else {
                    swal({
                        title: 'Doctor is busy',
                        text: 'Someone has already scheduled appointment.',
                        allowEscapeKey: false,
                        closeOnCancel: false,
                        closeOnConfirm: true,
                        type: 'info'
                    });
                }
            },
            eventRender: function(event, element, view) {
                if (event.status === 'pending') {
                    element.css('background', '#ff9800');
                } else if (event.status === 'confirmed') {
                    element.css('background', '#388e3c')
                }
            },
            eventBackgroundColor: '#d32f2f',
        }
    },
    appointments: function() {
        if (Meteor.user().persodata.identity == 1) {
            return Appointments.find({'patient.patientId': Meteor.userId()});
        }
    }
});

Template.calendar.events({
    'click #monthView': function(event, template) {
        $('#calendar').fullCalendar('changeView', 'month');
    },
    'click #weekAgenda': function(event, template) {
        $('#calendar').fullCalendar('changeView', 'agendaWeek');
    }
});

// Template.calendar.onDestroyed( function() {
//   console.log("the calendar template was destroyed");
//   var self = this;
//   self.clear();

// });
