
/*

  Template: takeRegister

  Allows the user to take a register for a class

  File: takeRegister.js (/Client/javascript/)

*/

if (Meteor.isClient) {

    /*

      Event: onCreated

      creates subscription to ExtraCurricSessions collection filtering on id given by route parameter

    */

    Template.takeRegister.onCreated(function(){
        var self = this;
        self.autorun(function(){
            console.log("sessionID = " + Router.current().params._id);
            self.subscribe(
                'register',
                Router.current().params._id
            );
            // console.log("autorun completed");
        });


    });

    Template.takeRegister.helpers({

      /*

        Helper: register

        returns an extra-curric document as per the subscription if data is not
        available returns an empty document.

      */

        register: function(){
          //console.log("fetching register");
          var registerDetails = ExtraCurricSessions.findOne({});
            if (registerDetails) {
                let sortedMarks = _.sortBy(registerDetails.marks, function(mark){ return mark.StudentName});
                registerDetails.marks = sortedMarks;
                return registerDetails;
            } else {
                return {};
            }
        },

    });



    Template.takeRegister.events({

      /*

        Event: click .register

        adds or deletes pupil from register

        Trigger:

        .register checkbox click

      */

        "click .register": function (event, template) {
            // console.log("Present");
            // console.log(event.target.checked);
            // console.log(this);
            Meteor.call("setPresent",
                        Router.current().params._id,
                        this.Adno,
                        event.target.checked
            )
        }
    });
}
