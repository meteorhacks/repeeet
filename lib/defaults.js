Defaults = {};

Defaults.Tweets = function () {
  return {
    userId: null,
    defaultText: '',
    variations: Repeeet.getVariations(null, Defaults.Settings())
  };
};

Defaults.Variations = function () {
  return {
    text: null,
    time: null,
    enabled: true
  }
}

Defaults.Settings = function () {
  return {
    repeatCount: 4,
    repeatCountOptions: range(1, 5),
    intervalValue: 8,
    intervalValueOptions: range(1, 60),
    intervalUnit: 'Hours',
    hasVariations: false,
    intervalUnitOptions: [
      {title: 'Seconds', millis: 1000},
      {title: 'Minutes', millis: 1000*60},
      {title: 'Hours', millis: 1000*60*60},
      {title: 'Days', millis: 1000*60*60*24},
      {title: 'Weeks', millis: 1000*60*60*24*7}
    ]
  };
};

function range (start, end) {
  var array = new Array(end-start);
  for( var i=0; i<array.length; ++i)
    array[i] = start + i;
  return array;
}
