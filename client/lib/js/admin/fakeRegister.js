if (Meteor.isClient) {
    Meteor.subscribe("classes");
    Meteor.subscribe("registers");

    var fakeAttendance = function(id){
      //console.log(ExtraCurricSessions.findOne());
      var lesson = ExtraCurricSessions.findOne({_id: id});
      lesson.marks.forEach(function(pupil){
        if (Math.random() < 0.5){
          Meteor.call("setPresent", id, pupil.Adno, true);
        } else {
          Meteor.call("setPresent", id, pupil.Adno, false);
        }
      });
    }

    Template.fakeRegister.events({

        /*

         Event: click #fake

         creates fake extra-curric docs

         Trigger:

         #fake button click

         */

    "click #fakeReg": function (event) {
        var sessions = ["reg", "lunch", "pm"];
        var classes = Classes.find({_id: {$regex: "^11"}}).fetch();

        for (let i = 0; i < 10; i++) {
          let chosenClass = classes[Math.floor(Math.random() * classes.length)];
          //console.log(chosenClass._id)
          Meteor.call(
              "addExtraCurric",
              {
                  date: "01/01/2016",
                  session: sessions[Math.floor(Math.random()*3)],
                  yearGrp: "All Years",
                  subject: chosenClass.subject,
                  className: chosenClass._id
              },
              function(error, id){
                  if (error){
                      console.log("Error: " + error);
                  } else {
                      fakeAttendance(id);
                  }
              }
          );

        }
      },

      "click #fakeAttend": function(event){
        var lessons = ExtraCurricSessions.find({});
        lessons.forEach(function(lesson){
          fakeAttendance(lesson._id);
        });

      }
    });
}
