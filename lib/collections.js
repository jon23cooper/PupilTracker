/*

  Collections: Collections

  Files: collections.js (/)

  Collection: Classes

  Mongo Name:
    classes

  Data Source:
  Populated automatically by data imported into the <PupilSubjects> collection
  using the <import> template.

  Purpose:
  Used as a lookup for information about the subject a class belongs to

  Todo:
  Consider using upsert instead of insert to populate this collection

  Documents:

    Document: class

    Fields:
      _id - the class name
      subject - the subject the class belongs to

    Index:
      _id - ascending
      subject - ascending

  Collection: ExtraCurricSessions

    Mongo Name:

      extra_curric

  Data Source:

  Populated by user information from <home> template combined with information
  from the <PupilSubject> collection. Also uses the <Classes> collection to
  supplement missing information such as yearGrp and Subject.

  Purpose:

    Contains the details of extra-curricular classes and who attended them.

  Documents:

    Document: register

  Fields:
    _id - generated _id field
    date - date of classes
    session - session time one of reg, lunch, pm
    yearGrp - NCYear for extra-curricular class
    subject - subject of extra-curricular classes
    className - name of extra-curricular class
    marks - array of <mark> subdocuments

  Subdocument: mark

    Fields:
        Adno - admission number of pupils
        StudentName - name of pupils
        present - true/false representing whether present in class

Collection: PupilSubjects

    Mongo Name:

      pupil_subjects

  Data Source:

    Data is imported into the PupilSubjects collection from a csv file using the
    <import> template.

  Purpose:

    Stores data about the pupils and their classes. Each document contains information
    about the pupil, a class and it's associated subject. The information in this
    collection is volatile and is replaced when new data is imported.

  Documents:

    Document: pupil-subject

  Fields:
    _id - generated primary id
    Adno - pupil's admission number, unique identifier for each pupil
    StudentName - pupil's name in form Lastname Firstname
    NCYear - pupil's NCYear integer from 7 to 13
    Gender - F/M
    SEN - N/K/S
    Disadvantaged - F/T
    EAL - Yes/No
    Subject - subject name
    ClassName - class name

  Indexes:
    Adno: ascending
    NCYear: ascending
    Subject: ascending
    ClasNames: ascending

Collection: Subjects

    Mongo Name:

      subjects

  Data Source:

  Populated automatically when data is imported using the <import> template

  Purpose:

  Contains a list of all the subjects

  Documents:

    Document: subject

  Fields:

    _id - subject's name

*/

Classes = new Mongo.Collection("classes");

ExtraCurricSessions = new Mongo.Collection("extra_curric");

PupilSubjects = new Mongo.Collection("pupil_subjects");

Subjects = new Mongo.Collection("subjects");
