function emp() {
  this.empno = 7839;
  this.ename = 'KING';
  this.job   = 'PRESIDENT';
  this.sal   = 5000;
}

var viewModel = new emp();

ko.applyBindings(viewModel);