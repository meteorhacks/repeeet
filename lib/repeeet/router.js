Router.configure({
  loadingTemplate: 'loading',
  waitOn: function () {
    return [
      Meteor.subscribe('tweets')
    ];
  }
})

Router.map(function () {
  this.route('index', {path: '/'});
});
