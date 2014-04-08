Defaults = {};

Defaults.Tweets = function (_userId) {
  var userId = _userId || null;
  return {
    userId: userId,
    defaultText: '',
    hasVariations: false,
    variations: calcVariations(4, 8)
  };
  function calcVariations (_count, _interval) {
    var array = [];
    var count = _count || 4;
    var interval = _interval || 8;
    var date = new Date();
    for (var idx=count; idx-->0;)
      array[idx] = {
        text: false,
        time: date.getTime() + 1000*60*60*interval*idx,
        enabled: true
      };
    return array;
  }
};

Defaults.Settings = function (_userId) {
  var userId = _userId || null;
  return {
    profile: {
      repeatCount: 4,
      repeatCountOptions: [1, 2, 3, 4, 5],
      intervalValue: 8,
      intervalValueOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      intervalUnit: 'Hours',
      intervalUnitOptions: [
        {title: 'Hours', minutes: 1000*60*60},
        {title: 'Days', minutes: 1000*60*60*24},
        {title: 'Weeks', minutes: 1000*60*60*24*7}
      ],
    },
    tweetId: null,
    buffer: Defaults.Tweets(_userId)
  };
};
