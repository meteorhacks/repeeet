Template.emailForm.events({
  'click #emailForm .saveEmail': saveEmail,
});

function saveEmail () {
  var email = validEmail(document.querySelector('#emailForm .userEmail').value);
  if(email)
    Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.email': email}});
  else
    alert('Invalid Email');
}

function validEmail (email) {
  var regex = /[^@ ]+@[^@ ]+/;
  var clean = regex.exec(email)[0];
  if(clean === email) return email;
}
