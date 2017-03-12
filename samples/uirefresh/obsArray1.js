var viewModel = {
    items: ko.observableArray(["one"]),
    addItem: function() {
        this.items.push("new");
    }
};

viewModel.count = ko.computed(function() {
    return this.items().length;
}, viewModel);

ko.applyBindings(viewModel);