
Timer = function (opt) {
  var self = this;
  opt = opt || {};

  this.clock = opt.clock || null;
  this.interval = opt.interval || 1000*60*60;
  this.lastRun = opt.lastRun || null;
  this.run = opt.run || function(){};

  this.start = function () {
    Meteor.clearInterval(this.clock);
    this.clock = Meteor.setInterval(this.tick, this.interval);
    this.tick();
    return this;
  }
  
  this.tick = function () {
    console.log('<== Timer: tick ', new Date().toLocaleTimeString(), '==>');
    self.lastRun = new Date().getTime();
    self.run();
    return self;
  }

  this.stop = function () {
    Meteor.clearInterval(this.clock);
    return this;
  }
  
  this.timeLimit = function () {
    if (this.lastRun)
      return this.lastRun + this.interval;
  }
  
  return this;
}
