Router.configure({
  loadingTemplate: 'loading',
  waitOn: function () {
    return [
      Meteor.subscribe('currentUser'),
      Meteor.subscribe('tweets')
    ];
  }
})

Router.map(function () {
  this.route('index', {path: '/'});
});
