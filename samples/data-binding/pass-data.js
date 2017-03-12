var dataJson = {
  empno: 7839,
  ename: 'KING',
  job: 'PRESIDENT',
  sal: 5000
};

function empModel(data) {
  this.empno = data.empno;
  this.ename = ko.observable(data.ename);
  this.job   = ko.observable(data.job);
  this.sal   = ko.observable(data.sal);
}
var viewModel = new empModel(dataJson);
ko.applyBindings(viewModel);