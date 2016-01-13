/*
  Template: menu

  File: menu.js (/Client/javascript/)

  Subscriptions:

    subjects - retrieves all subject objects from the <Subjects> collection

    classes - retrieves all classes objects from the <Classes> collection

    Session Variables:

      yearGroup - the selected value from the #yearGroup select

      subject - the selected value from the #subject select

      class - the selected value from the #class select

      registerDate - the selected date from #datetimepicker

      sessionTime - the selected value from the #session select
      
*/

if (Meteor.isClient) {

    Meteor.subscribe("subjects");
    Meteor.subscribe("classes");



    Session.setDefault("yearGroup", "All Years");
    Session.setDefault("subject", "All Subjects");
    Session.setDefault("class", "All Classes");
    //holds date information about pupil_session
    Session.setDefault("registerDate", "");
    //holds session information about pupil_session
    Session.setDefault("sessionTime", "");

    /*
      Event: onRendered

      o Sets #datetimepicker to the current date
      o Sets #session select to the appropriate session value
    */

    Template.menu.onRendered(function(){
       $('.datetimepicker').datetimepicker({
         defaultDate: new Date(),
         format: 'DD MMMM YYYY HH:mm',
       });
        //let t=new Date().getHours();
        let t = $('.datetimepicker').data("DateTimePicker").viewDate().format('HH');
        //console.log("time = " + t);
        if (t<13){
            $('#session').val('reg');
        } else {
            if (t<15){
                $("#session").val('lunch');
            } else {
                console.log("setting val to pm");
                $("#session").val('pm');
            }
        }
    });

    Template.menu.helpers({

        /*
          Helper: yearGroup

          returns an array of yearGroup objects

        */
        yearGroup: function () {
            return [
              {_id: 7},
              {_id: 8},
              {_id: 9},
              {_id: 10},
              {_id: 11},
              {_id: 12},
              {_id: 13}
            ];
        },

        /*
          Helper: subjects

          returns a cursor to the <Subjects> collection. A complete list of subjects
          is returned in alphabetical order.

        */

        subjects: function () {
            return Subjects.find({}, {sort: {_id: 1}});
        },

        /*
          Helper: classes

          Returns a list of classes, filtered by #subject and #yearGroup, in alphabetical order.
        */

        classes: function(){
          var filter = {};

          if (Session.get("subject") != "All Subjects"){
            filter.subject = Session.get("subject");
          }

          if (Session.get("yearGroup") != "All Years"){
            if (filter.subject === "Reg"){
              filter._id ={$regex: 'CLS ' + Session.get("yearGroup")}
            } else {
              filter._id = {$regex: '^' + Session.get("yearGroup")}
            }
          }
          return Classes.find(filter, {sort:{_id: 1}});
        },

        /*
          Helper: chosenYearGroup

          returns the value of <yearGroup> session variable

        */
        chosenYearGroup: function(){
          return Session.get("yearGroup");
        },

        /*
          Helper: chosenSubject

          returns the value of <subject> session variable

        */
        chosenSubject: function(){
          return Session.get("subject");
        },

    });



    Template.menu.events({

      /*

        Event: change #yeargroup

        sets the value of the <yearGroup> session variable when
          the value of the #yearGroup select changes

      */

      "change #yeargroup": function(event){
        //console.log("Year group changed");
        //console.log(event.target.value);
        Session.set("yearGroup", event.target.value);
      },

      /*
        Event: change #subject

        sets the value of the <subject> session variable when the value of the
        #subject select changes

      */

      "change #subject": function(event){
        console.log("Subject changed");
        console.log(event.target.value);
        Session.set("subject", event.target.value);
      },

      /*
        Event: change #class

        sets the value of the <class> session variable when the value of the
        #class select changes

      */

      "change #class": function(event){
        console.log("Class changed");
        console.log(event.target.value);
        Session.set("class", event.target.value);
        console.log("Class changed to " + Session.get("class"));
      },

      /*
        Event: click #registerBtn

        When the #registerBtn is clicked

          o sets the value of the <sessionTime> session variable
          o inserts the details of the extra-curricular class into the <ExtraCurricSessions>
          collection as necessary
          o redirects to the <takeRegister> page
      */

      "click #registerBtn": function(event){
        Session.set(
            "sessionTime",
            $("#session").val()
        );

        // create extra curric object in extraCurric table

        Meteor.call(
          "addExtraCurric",
          {
            date: $("#datetimepicker").data("DateTimePicker")
              .viewDate().format('DD/MM/YYYY'),
            session: $("#session").val(),
            yearGrp: $("#yeargroup").val(),
            subject: $("#subject").val(),
            className: $("#classname").val()
          },
          function(error, result){
            if (error){
              console.log(error);
            } else {
              console.log(result);
              Router.go('takeRegister', {_id: result});
            }
          }
      );
      }
    });

}
