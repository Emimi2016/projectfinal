var uploadfile=[];
Template.emailCompose.onCreated(function() {
  var self = this;
  this.autorun(function() {
    self.subscribe("images");
  });
});

Template.emailCompose.onRendered(function() {
  $('#filedialog').hide();
  // Initialize summernote plugin
  $('.summernote').summernote({
    toolbar: [
      ['headline', ['style']],
      ['style', ['bold', 'italic', 'underline', 'superscript',
        'subscript', 'strikethrough', 'clear'
      ]],
      ['textsize', ['fontsize']],
      ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
    ]
  });
  /**
     'click #msg': function(event){
        event.preventDefault();
        swal({
          title: 'Kind Reminder',
          text: 'Kindly pay to message doctor.',
          allowEscapeKey: false,
          closeOnCancel: false,
          closeOnConfirm: true,
          showConfirmButton: true,
          type: 'warning'
        },function(isConfirm) {
      Router.go('paiement');
     });
    }
    */
//});

    
  Meteor.typeahead.inject();
});

Template.emailCompose.onCreated(function() {
  var self = this;
  var user = Meteor.user();
  if (user) {
    if (user.persodata.identity == 1) {
      self.subscribe('doctor');
    } else {
      self.subscribe('patients');
    }
  }
});

Template.emailCompose.events({
  'click #sendMail': function(event, template) {

    console.log(template);

    var userToId = $('#userTo').data('id');
    var message = {
      to: $('#userTo').val(),
      userToId: userToId,
      subject: $('#subject').val(),
      //message: $('div.note-editable[contenteditable="true"]').code(),
      message: $('.note-editable').html(), // May be a new api to get content
      type: 'email'
    };
    Meteor.call('sendMessage', message,uploadfile, function(err, result) {
      if (result) {
        swal({
          title: 'Some error occured',
          text: error.reason,
          allowEscapeKey: false,
          closeOnCancel: false,
          closeOnConfirm: true,
          type: 'error'
        });
      } else {
        
        Router.go("mailbox");
      }
    });
  },
  'click #saveDraft': function(event) {

    var userToId = $('#userTo').data('id');
    var message = {
      to: $('#userTo').val(),
      userToId: userToId,
      subject: $('#subject').val(),
      //message: $('div.note-editable[contenteditable="true"]').code(),
      message: $('.note-editable').html(), // May be a new api to get content
      type: 'email'
    };
    Meteor.call('saveMessage', message, function(err, result) {
      if (result) {
        swal({
          title: 'Some error occured',
          text: error.reason,
          allowEscapeKey: false,
          closeOnCancel: false,
          closeOnConfirm: true,
          type: 'error'
        });
      } else {
        
        swal({
          title: 'Your mail was saved',
          text: 'Mail saved',
          allowEscapeKey: false,
          closeOnCancel: false,
          closeOnConfirm: true,
          type: 'success'
        });
        //Router.go("mailbox");
      }
    });
  },
  'click #discard': function(event) {
    Router.go("mailbox");
  },
      'click #msg': function(event){
        event.preventDefault();
        swal({
          title: 'Kind Reminder',
          text: 'Kindly pay to message doctor.',
          allowEscapeKey: false,
          closeOnCancel: false,
          closeOnConfirm: true,
          showConfirmButton: true,
          type: 'warning'
        },function(isConfirm) {
      Router.go('paiement');
     });
    },
   'click #markurgent': function(event) {
    swal({
          title: 'Your mail was marked as urgent.',
          text: 'Your mail was marked as urgent.',
          allowEscapeKey: false,
          closeOnCancel: false,
          closeOnConfirm: true,
          type: 'success'
        });
  },
  'click #fileatt': function(event) {
    $('#filedialog').click();
  },
  'change input#filedialog': function(event, template) {

    // insert the file into the Collection

    FS.Utility.eachFile(event, function(file) {
      console.log(file);

      Images.insert(file, function(err, fileObj) {
        if (err) {
          console.log(err);
        } else {
          // handle success depending what you need to do
          var userId = Meteor.userId();
          var imagesURL = '/cfs/files/images/' + fileObj._id;
uploadfile.push(fileObj._id);
          Session.set('attachment', imagesURL);
        }
      });
    });

    // use the values for insertion into the email collection
    var vals = $('input#filedialog').val();
    // template.attachments.set(vals);
    var fileExt = vals.split('.').pop();
    var filename = vals.split('\\').pop();
    // render image into the template
    $('#attachments').append('<div class="row">' +
      '<div class="col-sm-3">' +
      '<div class="hpanel">' +
      '<div class="panel-body file-body">' +
      '<i class="fa fa-file-pdf-o text-info"></i>' +
      '</div>' +
      '<div class="panel-footer">' +
      '<a href="#">' + filename + '</a>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>');
  }
});

Template.emailCompose.helpers({
  listofdoctors: function(){
    Meteor.users.find().fetch().map(function (doc) {
       return {
          id: doc._id,
          value: doc.persodata.fname
        };
    });
 },
 
  users: function() {
    var user = Meteor.user();
    if (user.doctor) {
      return Meteor.users.find({
        '_id': user['doctor']['doctorId']
      }).fetch().map(function(userTo) {
        return {
          id: userTo._id,
          value: userTo.persodata.lname + ' ' + userTo.persodata.fname
        };
      });
    } else {
      return Meteor.users.find({
        'doctor.doctorId': Meteor.userId()
      }).map(function(userTo) {
        return {
          id: userTo._id,
          value: userTo.persodata.lname + ' ' + userTo.persodata.fname
        }
      });
    }

  },
  isDoctor: function() {
    var user = Meteor.user();

    if (user.persodata.identity === "2") {
      return true
    };
  },
  to: function() {
    //Return a list of doctors or patients based on the user.
    return this != null && this.from != undefined ? this.from : "";
  },
  from: function() {
    return this != null && this.to != undefined ? this.to : "";
  },
  subject: function() {
    return this != null && this.subject != undefined ? "RE: " + this.subject :
      "";
  },
  mailTitle: function() {
    return this != null && this.subject != undefined ? "Reply message" :
      "New message";
  },
  /*
      history: function() {
         return this != null && this.message != undefined ? $('<div/>').text("<br/><br/><br/>--------------" + this.message).html()  : "";
      },*/
  attachments: function() {
    return Template.instance().attachments.get();
  },
  selected: function(event, suggestion, datasetName) {
    $('#userTo').data('id', suggestion.id);
    console.log(suggestion.id, 'suggestion id')
  }
});
