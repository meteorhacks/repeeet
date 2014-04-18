Template.dashboard.helpers({
  userEmail: getUserEmail
});

function getUserEmail () {
  var user = Meteor.user();
  if(user && user.profile && user.profile.email) {
    return user.profile.email;
  }
}