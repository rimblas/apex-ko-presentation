var viewModel = {
    items: ko.observableArray(["one"]),
    addItem: function() {
        this.items.push("new");
    }
};

viewModel.canAddItems = ko.computed(function() {
    return this.items().length < 5;
}, viewModel);

viewModel.count = ko.computed(function() {
    return this.items().length;
}, viewModel);


ko.applyBindings(viewModel);