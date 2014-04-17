Template.dashboard.helpers({
  userEmail: getUserEmail
});

function getUserEmail () {
  return Meteor.user().profile.email;
}