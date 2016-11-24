Template.vitalSignsModal.onRendered(function() {
    this.$('#vitalDateGroup').datetimepicker();
    this.$('#vitalForm').validate();
    function calculateBMI() {
        var weight = parseFloat($('#vitalWeight').val());
        var height = parseFloat($('#vitalHeight').val() / 100);
        var bmiValue = parseFloat(weight / Math.pow(height, 2)).toFixed(2);
        if (!isNaN(bmiValue) && isFinite(bmiValue)) {
            $('#vitalBMI').val(bmiValue);
        }
    }
    $('#vitalWeight').on('keyup', calculateBMI);
    $('#vitalHeight').on('keyup', calculateBMI);
});

Template.vitalSignsModal.events({
    'submit #vitalForm': function(event, template) {
        event.preventDefault();
        var form = event.target;
        var patientId = Router.current().params._id;        
        var vitalData = {
            id: form.vitalRecordID.value,
            weight: form.vitalWeight.value,
            height: form.vitalHeight.value,
            bmi: form.vitalBMI.value,
            bp: form.vitalBP.value,
            pulse: form.vitalPulse.value,
            respiration: form.vitalRespiration.value,
            temperature: form.vitalTemperature.value,
            date: form.vitalDate.value,
        }
        Meteor.call('createVitalSigns', vitalData, patientId, function(err, result) {
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
                    text: 'You successfully modified vitals',
                    allowEscapeKey:false,
                    closeOnCancel:false,
                    closeOnConfirm: true,
                    type:'info'
                });
                Modal.hide();
            }
        });
    }
});
