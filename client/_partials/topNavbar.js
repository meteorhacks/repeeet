Template.topNavbar.helpers({
  rootUrl: getRootUrl
});

function getRootUrl () {
  return Meteor.absoluteUrl();
}
