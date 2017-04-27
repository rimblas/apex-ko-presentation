function empModel(data) {
  this.empno = data.empno;
  this.ename = ko.observable(data.ename);
  this.job   = ko.observable(data.job);
  this.sal   = ko.observable(data.sal);
}
apex.server.process("MY_DATA_JSON",
{x01: $v('P1_EMPNO')},
{
  success: function( pData )
  {
    empVM = new empModel(pData);
    ko.applyBindings(empVM, el);
  }
});
