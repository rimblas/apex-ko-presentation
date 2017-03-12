function emp() {
  this.empno = 7839;
  this.ename = ko.observable('KING');
  this.job   = ko.observable('PRESIDENT');
  this.sal   = ko.observable(5000);
}

var viewModel = new emp();

ko.applyBindings(viewModel);