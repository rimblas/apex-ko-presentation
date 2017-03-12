function workWeek() {
  var self = this;
  self.day1 = ko.observable(0);
  self.day2 = ko.observable(0);
  self.day3 = ko.observable(0);
  self.day4 = ko.observable(0);
  self.day5 = ko.observable(0);

  self.total = ko.computed(function() {
    return parseInt(self.day1()) +
           parseInt(self.day2()); // + day3 + 4 + ...
  });
}
var viewModel = new workWeek();
ko.applyBindings(viewModel);
