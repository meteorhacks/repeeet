// Template.newTweet.helpers({
//   settings: getSettings,
//   getVariations: getVariations,
//   toDay: Repeeet.getDay
// });

// Template.newTweet.events({
//   'click .variations-button': toggleVariations,
//   'keydown .newtweet-text': updatePostText,
//   'keydown .newtweet-variation': updateVariationText,
//   'click .newtweet-post': postNewTweet,
//   'click .newtweet-repeat-count li': updateRepeatCount,
//   'click .newtweet-interval-value li': updateIntervalValue,
//   'click .newtweet-interval-unit li': updateIntervalUnit,
// });

// function getSettings () {
//   if (Meteor.userId()) {
//     return Settings.findOne({_id: Meteor.userId()});
//   } else {
//     return Defaults.Settings();
//   };
// }

// function getVariations () {
//   if (Meteor.userId()) {
//     var settings = Settings.findOne({_id: Meteor.userId()});
//     if (settings) {
//       var variations = settings.buffer.variations;
//       if (settings.buffer.hasVariations && variations.length > 1) {
//         for(var i=variations.length; i-->0;){
//           variations[i].__index = i;
//         }
//         return variations;
//       };
//     };
//   };
//   return null;
// }

// function toggleVariations () {
//   if (Meteor.userId()) {
//     var settings = Settings.findOne({_id: Meteor.userId()});
//     settings.buffer.hasVariations = !settings.buffer.hasVariations;
//     Settings.update({_id: Meteor.userId()}, {$set: {buffer: settings.buffer}});
//   };
// }

// function updatePostText (e) {
//   if (Meteor.userId()) {
//     Meteor.defer(function () {
//       var settings = Settings.findOne({_id: Meteor.userId()});
//       settings.buffer.variations = Repeeet.recalculateVariations();
//       settings.buffer.defaultText = e.target.value;
//       Settings.update({_id: Meteor.userId()}, {$set: {buffer: settings.buffer}});
//     });
//   };
// }

// function updateVariationText (e) {
//   if (Meteor.userId()) {
//     var self = this;
//     Meteor.defer(function () {
//       var idx = parseInt(e.target.classList[0]);
//       console.log(self);
//       var settings = Settings.findOne({_id: Meteor.userId()});
//       settings.buffer.variations[idx].text = e.target.value;
//       Settings.update({_id: Meteor.userId()}, {$set: {buffer: settings.buffer}});
//     });
//   };
// }

// function resetVariationText (e) {
//   var idx = parseInt(e.target.classList[0]);
//   console.log(idx);
//   var settings = Settings.findOne({_id: Meteor.userId()});
//   settings.buffer.variations[idx].text = e.target.value;
//   Settings.update({_id: Meteor.userId()}, {$set: {buffer: settings.buffer}});
// }

// function postNewTweet () {
//   if (Meteor.userId()) {
//     var settings = Settings.findOne({_id: Meteor.userId()});
//     settings.buffer.variations = Repeeet.recalculateVariations();
//     settings.buffer.userId = Meteor.userId();
//     Settings.update({_id: Meteor.userId()}, {$set: {buffer: settings.buffer}});
//     Tweets.insert(settings.buffer);
//   };
// }

// function updateRepeatCount (e) {
//   if (Meteor.userId()) {
//     var count = parseInt(e.target.innerText);
//     var settings = Settings.findOne({_id: Meteor.userId()});
//     settings.profile.repeatCount = count;
//     settings.buffer.variations = Repeeet.recalculateVariations(count);
//     Settings.update({_id: Meteor.userId()}, {$set: {buffer: settings.buffer, profile: settings.profile}});
//   };
// }

// function updateIntervalValue (e) {
//   if (Meteor.userId()) {
//     var interval = parseInt(e.target.innerText);
//     var settings = Settings.findOne({_id: Meteor.userId()});
//     settings.profile.intervalValue = interval;
//     settings.buffer.variations = Repeeet.recalculateVariations(null, interval);
//     Settings.update({_id: Meteor.userId()}, {$set: {buffer: settings.buffer, profile: settings.profile}});
//   };
// }

// function updateIntervalUnit (e) {
//   if (Meteor.userId()) {
//     var unit = e.target.innerText;
//     var settings = Settings.findOne({_id: Meteor.userId()});
//     settings.profile.intervalUnit = unit;
//     settings.buffer.variations = Repeeet.recalculateVariations(null, null, unit);
//     Settings.update({_id: Meteor.userId()}, {$set: {buffer: settings.buffer, profile: settings.profile}});
//   };
// }
