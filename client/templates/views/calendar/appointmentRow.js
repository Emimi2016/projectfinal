Template.appointmentRow.helpers({
    formatedStartDate: function() {
        return moment(this.startDate).format('LLLL');
    },
    formatedEndDate: function() {
        return moment(this.endDate).format('LLLL');
    },
    
});    

Template.appointmentRow.onRendered(function() {
    this.$('#appointmentRowTable').dataTable({
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
            title: 'appointmentRow',
            className: 'btn-sm',
            exportOptions: {
                modifier: {
                    selected: true
                }
            }
        }, {
            extend: 'pdf',
            title: 'appointmentRow',
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
