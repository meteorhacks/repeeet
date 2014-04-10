Defaults = {};

Defaults.Tweets = function (_userId) {
  var userId = _userId || null;
  return {
    userId: userId,
    defaultText: '',
    hasVariations: false,
    variations: Repeeet.recalculateVariations(4, 8, 'Hours')
  };
};

Defaults.Settings = function (_userId) {
  var userId = _userId || null;
  return {
    profile: {
      repeatCount: 4,
      repeatCountOptions: range(1, 5),
      intervalValue: 8,
      intervalValueOptions: range(1, 60),
      intervalUnit: 'Hours',
      intervalUnitOptions: [
        {title: 'Seconds', millis: 1000},
        {title: 'Minutes', millis: 1000*60},
        {title: 'Hours', millis: 1000*60*60},
        {title: 'Days', millis: 1000*60*60*24},
        {title: 'Weeks', millis: 1000*60*60*24*7}
      ],
    },
    tweetId: null,
    buffer: Defaults.Tweets(_userId)
  };
};

function range (start, end) {
  var array = new Array(end-start);
  for( var i=0; i<array.length; ++i)
    array[i] = start + i;
  return array;
}
