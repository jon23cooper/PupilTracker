/*

Routes: Routes

File: routes.js (/)

 Route: /

  Landing page for application allowing user to choose details of extra-curricular class

    Template:
      <home>

    Name:
      home

  Route: /takeRegister

    Displays register for extra-curricular class

    Template:
      <takeRegister>

    Name:
      takeRegister

  Route: /admin/import

    Allows importation of PupilSubjects documents

    Html Template:

      <import>

  Route: /admin/fake

  Fakes attendance registers

  Html Template:

  <fakeRegister>

*/

Router.route('/', {
    name: 'home',
    template: 'home',
});

Router.route('/takeRegister/:_id', {
  name: 'takeRegister',
  template: 'take_register',
});

Router.route('/admin/browseLessons', {
  name: 'lessons',
  template: 'lessons'
});

Router.route('/admin/import', function () {
    this.render('import');
});

Router.route('/admin/fake', function (){
    this.render('fakeRegister');
});
