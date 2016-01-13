/*
    Template: import

    Allows the user to import pupil-subject documents from a csv file

    File: import.js (/client/admin/js/)

    Session Variables:

      importCount - keeps a count of the number of pupil-subject documents which have been imported

      lineCount - the total number of pupil-subject documents to be imported


*/

  Session.setDefault("importCount", 0);
  Session.setDefault("lineCount", 1);

  Template.import.helpers({

    /*
      Template Helper: progress

      Calculates the percentage of documents which have been imported into the
      <PupilSubjects> collection

      Attributes: values

        The percentage of documents which have been imported, given as x%

    */

    progress: function(){

      var result = Session.get("importCount")/Session.get("lineCount")
      //console.log(result);
      return {value: (result*100 | 0) + "%"};
    }
  });


  Template.import.events({

    /*
      Section: Template Events

      Template Event: change #fileImport

      Fired when the file-input is changed, that is the user has chosen a file to import.
      Parses the chosen file producing an array of pupil-subject documents which are then
      imported into the <PupilSubjects> collection.

      ToDo:

      The <PupilSubjects> collection should be emptied prior to importation.
      The progress bar should be hidden until the import process starts.
      A list of pupil-subjects which have not been imported should be given along with the error message

      Variables:

        file - the file chosen by the user
        reader - a FileReader object
        contents - the file contents
        lines - an array of file lines
        line_array - an array to hold the parsed lines as pupil-subject documents
        keys - the pupil-subject document's keys
        importCount - the number of documents imported
        subjectObj - the current pupil-subject document


    */

    "change #fileImport": function(event){
      var file = event.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function(event){
        //console.log("reading file");
        var contents = event.target.result;
        // split into lines
        //console.log("splitting contents");
        var lines = contents.split("\r\n");
        // split each line into it's fields
        var line_array = [];
        Session.set("lineCount", lines.length-1);
        for (let line of lines){
          let lineDetails = line.split(",");
          _.each(lineDetails, function(field, idx, lineDetails){
            //remove quotes around each field value
            lineDetails[idx]=field[0]=='"'?field.slice(1, field.length-1):field;
          });
          line_array.push(lineDetails);
        };
        var keys = line_array.shift();
        var importCount = 0;
        _.each(line_array, function(values){
          let subjectObj = _.object(keys, values);
          //import document into collection
          Meteor.call("addPupilSubject",
            subjectObj,
            function(error, result){
              if (error){
                console.log("Error importing pupil-subject object: " + error);
                console.log(subjectObj);
                console.log(" not imported!");
              } else {
                //update progress
                importCount++;
                Session.set("importCount", importCount);

              }
            }
          );
        });

      };
      reader.onerror = function(event){
        console.error("Oops someting went wrong reading the file. " +
        event.target.error.code);
      }
      reader.readAsText(file);
    }
  });
