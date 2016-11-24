Template.prescriptions.onRendered(function() {
    this.$('#prescriptionsTable').dataTable({
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
                },
                columns: [0, 1, 2, 3, 4, 5, 6]
            }
        }, {
            extend: 'csv',
            title: 'Prescriptions',
            className: 'btn-sm',
            exportOptions: {
                modifier: {
                    selected: true
                },
                columns: [0, 1, 2, 3, 4, 5, 6]
            }
        }, {
            extend: 'pdf',
            title: 'Prescriptions',
            className: 'btn-sm',
            exportOptions: {
                modifier: {
                    selected: true
                },
                columns: [0, 1, 2, 3, 4, 5, 6]
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
