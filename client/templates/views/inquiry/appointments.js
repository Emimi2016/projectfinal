Template.appointments.onCreated(function() {
    var self = this;
    self.minor = new ReactiveVar(false);

});

Template.appointments.onDestroyed(function() {

});

Template.appointments.onRendered(function() {

});

Template.appointments.helpers({
    minor: function() {
        return Template.instance().minor.get();
    }
});

Template.appointments.events({
    'change #minor': function(event, template) {
        (event.target.checked) ? template.minor.set(true) : template.minor.set(false);
    }
});
