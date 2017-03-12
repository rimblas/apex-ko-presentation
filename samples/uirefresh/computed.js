function workWeek() {
  var self = this;
  self.val1 = ko.observable(0);
  self.val2 = ko.observable(0);

  self.total = ko.computed(function() {
    return parseInt(self.val1()) +
           parseInt(self.val2());
  }, self);
}
var viewModel = new workWeek();
ko.applyBindings(viewModel);
