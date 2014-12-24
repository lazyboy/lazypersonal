/* @constructor */
function Droid(id, name, dob, type, tags, rate) {
  this.id = id;
  this.name = name;
  this.dob = dob;
  this.type = type;
  this.tags = tags;
  this.rate = rate;
}

/* @constructor */
function ContactDetail(id, name, droids, runLength, fileSize, tags) {
  this.id = id;
  this.name = name;
  this.droids = droids;
  this.runLength = runLength;
  this.fileSize = fileSize;
  this.tags = tags;
}

ContactDetail.getDummyData = function(callback) {
  var data = [];
  var droids = [
    new Droid(1, 'Ahmed Istiaque', 'UW', 1, ['X', 'Y', 'Z'], 7),
    new Droid(2, 'John Doe', '1990', 1, ['X'], 5),
    new Droid(3, 'Jason Jack', 'UW', 1, ['Horror'], 10)
  ];

  var droids1 = [];
  var droids2 = [droids[0], droids[1]];
  var droids3 = [droids[0], droids[2]];

  var tags1 = ['Aw', 'Snap', 'Doh'];
  var tags2 = ['Test tag1', 'Test tag2', 'Doh'];
  var tags3 = ['Zest', 'Xest'];

  data.push(new ContactDetail(1, 'One', droids1, 123, 321, tags1));
  data.push(new ContactDetail(2, 'Two', droids2, 1, 31, tags2));
  data.push(new ContactDetail(3, 'Three', droids3, 1, 101, tags3));
  window.setTimeout(function() {
    callback(data);
  });
};

ContactDetail.READ = function() {
  window.console.warn('NOTIMPLEMENTED');
};
