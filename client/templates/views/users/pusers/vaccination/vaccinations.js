Template.vaccinations.onRendered(function() {
    this.$('#vaccinationsTable').dataTable({
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
            title: 'Vaccination',
            className: 'btn-sm',
            exportOptions: {
                modifier: {
                    selected: true
                }
            }
        }, {
            extend: 'pdf',
            title: 'Vaccination',
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
