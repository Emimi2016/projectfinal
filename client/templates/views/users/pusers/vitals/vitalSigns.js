Template.vitalSigns.onCreated(function() {
    var self = this;
});

Template.vitalSigns.onRendered(function() {
    this.$('#vitalsignsTable').dataTable({
        dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp",
        "lengthMenu": [
            [10, 25, 50, -1],
            [10, 25, 50, "All"]
        ],
        buttons: [{
            extend: 'copy',
            className: 'btn-sm',
            exportOptions: {
                modifier: {
                    selected: true
                }
            }
        }, {
            extend: 'csv',
            title: 'Vital Signs',
            className: 'btn-sm',
            exportOptions: {
                modifier: {
                    selected: true
                }
            }
        }, {
            extend: 'pdf',
            title: 'Vital Signs',
            className: 'btn-sm',
            exportOptions: {
                modifier: {
                    selected: true
                }
            }
        }, {
            extend: 'selectAll',
            className: 'btn-sm'
        }, {
            extend: 'selectNone',
            className: 'btn-sm'
        }],
        select: true
    });
});

Template.vitalSigns.helpers({

});
