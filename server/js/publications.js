/*
    Section: Publications


    Contains the methods which publish collections and queries to the client

    Files: publications.js

    Path:
      ./server/javascript/

 */


if (Meteor.isServer) {

    //new Meteor.Pagination(ExtraCurricSessions);
    /*
     Method: startup

     Adds and maintains indexes to <Collections> on startup

     Parameters:
     None


     */
    Meteor.startup(function () {
        // code to run on server at startup
        PupilSubjects._ensureIndex({"Subject": 1});
        PupilSubjects._ensureIndex({"Adno": 1});
        PupilSubjects._ensureIndex({"NCYear": 1});
        PupilSubjects._ensureIndex({"ClassName": 1});
        Classes._ensureIndex({"subject": 1});

    });

    /*
     Publication: pupils

     Returns a cursor of pupil-class documents matching the parameter criteria.
     "All Years", "All Subjects", "All Classes" are converted to regex for any value.

     Parameters:

     yearGroup - NCYear criterion
     subject - Subject criterion
     className - ClassName criterion

     Local Variables:

     filter - the filter to be used by the find method

     Returns:

     A cursor of the filtered pupils-class documents or *this.ready()* if none are found

     Usage:

     Meteor.publish("pupils", 10, "Biology", "11C\Bi2")
     */

    Meteor.publish("pupils", function (yearGroup, subject, className) {
        console.log("Year Group is " + yearGroup);
        console.log("Subject is " + subject);
        console.log("Class name is " + className);
        var filter = {
            NCYear: {$regex: '.'},
            Subject: "Reg",
            ClassName: {$regex: '.'}
        };
        if (yearGroup != "All Years") {
            filter.NCYear = yearGroup;
        }
        if (subject != "All Subjects") {
            filter.Subject = subject;
        }
        if (className != "All Classes") {
            filter.ClassName = className;
            filter.Subject = {$regex: '.'};
        }
        // console.log(filter);
        var results = PupilSubjects.find(filter);

        if (results) {
            return results
        } else {
            return this.ready()
        }
    }),

        /*
         Publication: subjects

         Returns a cursor containing all of the subjects documents from the <Subjects> collection.

         Parameters:

         None

         Returns:

         A cursor of all subjects documents in the <Subjects> collection or *this.ready()* if none are found.

         Usage:

         Meteor.publish("subjects")
         */
        Meteor.publish("subjects", function () {
            var results = Subjects.find({});

            if (results) {
                return results;
            } else {
                return this.ready();
            }
        }),

        /*
         Publication: classes

         Returns a cursor containing all of the classes documents from the <Classes> collection.

         Parameters:

         None

         Returns:

         A cursor of all classes documents in the <Classes> collection or *this.ready()* if none are found.

         Usage:

         Meteor.publish("classes")
         */

        Meteor.publish("classes", function () {
            var results = Classes.find({}, {sort: {subject: 1, _id: 1}});

            if (results) {
                return results;
            } else {
                return this.ready();
            }
        }),
        /*
         /*
         Publication: register

         Returns an extra_curric document with the matching _id.

         Parameters:

         _id - the _id of the extra_curric document to be found and returned

         Returns:

         The document in the <ExtraCurricSessions> collection with an _id equal to the provided parameter or
         *this.ready()* if no matching document is found.

         Usage:

         Meteor.publish("register", "345rty778829201")

         */

    Meteor.publish("register", function (sessionId) {
        var register = ExtraCurricSessions.find({_id: sessionId});

        if (register) {
            console.log("Register found ... returning data");
            return register;
        } else {
            console.log("no register exists ... returning");
            return this.ready();
        }

    });

    Meteor.publish("registers", function(){
       var registers = ExtraCurricSessions.find({});
        if (registers){
            return registers;
        } else {
            return this.ready();
        }
    });

    Meteor.publish("registerPages", function(){
      results = ExtraCurricSessions.find({_id: 'am'});
      if (results){
        return results;
      } else {
        return this.ready();
      }

    });



    /*
        Meteor Methods:

        Functions which allow CRUD operations on Collections

     */

    Meteor.methods({

        /*
         Method: addPupilSubject

         Inserts a pupil_subject document into the <PupilSubjects> collection
         Reg classes are assigned to the subject " " in SIMS so " " is
         replaced by Reg when adding the document.
         Inserts subjects into the <Subjects> table if they do not exist.
         Inserts class documents into the <Classes> table if they do not exist.

         Parameters:

          pupil-subject: an object containing the details of a pupil and a class
          and subject

          Returns:

            if *error* returns *error* else returns *id* of inserted document

          Usage:

            meteor.call("addPupilSubject", {.....});


         **/
        addPupilSubject: function (pupil_subject) {
            //console.log(pupil_subject);
            if (pupil_subject.Subject != undefined) {
                if (pupil_subject.Subject === " ") {
                    pupil_subject.Subject = "Reg";
                }
                if (Subjects.find({_id: pupil_subject.Subject}).count() == 0) {
                    //console.log("inserting " + pupil_subject.Subject);
                    Subjects.insert(
                        {
                            _id: pupil_subject.Subject
                        }
                    );
                }
                if (Classes.find({_id: pupil_subject.ClassName}).count() === 0) {
                    //console.log("inserting " + pupil_subject.ClassName);
                    Classes.insert(
                        {
                            _id: pupil_subject.ClassName,
                            subject: pupil_subject.Subject
                        }
                    );
                }
                return PupilSubjects.insert(
                  pupil_subject,
                  function(error, id){
                    if (error){
                      return error;
                    } else {
                      return id;
                    }
                });
            }
        },

        /*
          Method: addSubject

          inserts a subject document into the <Subjects> collection

          Parameters:

            subjectsName - the subject document to be inserted

          Returns:
            if *error* returns *error* else returns *id* of inserted document

          Usage:
            Meteor.call("addSubject", { ... });


        */
        addSubject: function (subjectName) {
            return Subjects.insert(
              {_id: subjectName},
              function(error, id){
                if (error){
                  return error;
                } else {
                  return id;
                }
              }
            );
        },

        /*
          Method: addClass

          inserts a class document into the <Classes> collection

          Parameters:

            className - the name of the class
            subjectsName - the name of the associated subject

          Returns:
            if *error* returns *error* else returns *id* of inserted document

          Usage:
            Meteor.call("addClass", { ... });


        */

        addClass: function (className, subjectName) {
            return Classes.insert(
              {_id: className, subject: subjectName},
              function(error, id){
                if (error){
                  return error;
                } else {
                  return id;
                }
              }
            );
        },

        /*
          Method: addExtraCurric

          inserts an extra-curric document into the <ExtraCurricSessions> collection
          Adds missing information, such as subject or year if necessary.

          Parameters:

            sessionDetails - the extra-curric document to be inserted

          Returns:
            if *error* returns *error* else returns *id* of inserted document

          Usage:
            Meteor.call("addExtraCurric", { ... });

          Todo:
            remove duplicated pupils from the sessionDetails.marks array.
            This only needs to be done if no class has been specified.
        */

        addExtraCurric: function (sessionDetails) {

            //assign subject and yeargroup details to identified classes
            if (sessionDetails.className != "All Classes"){
                sessionDetails.subject = Classes.findOne(
                    {_id: sessionDetails.className},
                    {fields: {_id:0, subject:1}}).subject;
                sessionDetails.yearGrp =
                    (sessionDetails.subject === 'Reg')?
                        sessionDetails.className.slice(4, sessionDetails.className.indexOf('.')):
                        sessionDetails.className.slice(0, sessionDetails.className.indexOf('/')-1);
            }
            var sessionExists = ExtraCurricSessions.findOne({
                date: sessionDetails.date,
                session: sessionDetails.session,
                yearGrp: sessionDetails.yearGrp,
                subject: sessionDetails.subject,
                className: sessionDetails.className
            });
            if (sessionExists) {
                return sessionExists._id;
            } else {
                console.log(sessionDetails.subject);
                var classFilter =
                    (sessionDetails.className === "All Classes")
                        ? {$regex: "."}
                        : sessionDetails.className;
                var subjectFilter =
                    (sessionDetails.subject === "All Subjects")
                        ? {$regex: "."}
                        : sessionDetails.subject;
                var yearFilter =
                    (sessionDetails.yearGrp === "All Years")
                        ? {$regex: "."}
                        : sessionDetails.yearGrp;
                if (classFilter === subjectFilter) {
                    //we can assume this means they are both {$regex:"."}
                    //so set subject to Reg to get rid of duplicates
                    subjectFilter = "Reg";
                }

                sessionDetails.marks = PupilSubjects.find(
                    {
                        NCYear: yearFilter,
                        Subject: subjectFilter,
                        ClassName: classFilter
                    }
                ).fetch();

                return ExtraCurricSessions.insert(
                    sessionDetails,
                    function (error, id) {
                        if (error) {
                            return error;
                        } else {
                            return id;
                        }
                    }
                );
            }
        },

        /*
          Method: setPresent

          updates an extra-curric document marks array attendance subdocument
          present value

          Parameters:

            sessionId - the _id of the extra-curric document to be updated
            pupil_adno - the Adno of the pupil to be updated
            value - the value to be assigned to the present attribute (true or false)

          Returns:
            if *error* returns *error* else returns *id* of inserted document

          Usage:
            Meteor.call("addPresent", sessionId value, pupil_adno value, true);


        */

        setPresent: function (sessionId, pupil_adno, value) {
            console.log(sessionId);
            console.log(pupil_adno);
            return ExtraCurricSessions.update(
                {
                    "_id": sessionId,
                    "marks.Adno": pupil_adno
                },
                {
                    $set: {
                        "marks.$.present": value
                    }
                },
                function(error, id){
                  if (error){
                    return error;
                  } else {
                    return id;
                  }
                }
            );
        },
    });
}
