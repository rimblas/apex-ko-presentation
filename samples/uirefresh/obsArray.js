var viewModel = {
    items: ko.observableArray(["one"]),
    addItem: function() {
        this.items.push("new");
    }
};

viewModel.count = ko.computed(function() {
    return this.items().length;
}, viewModel);

viewModel.canAddItems = ko.computed(function() {
    return this.items().length < 5;
}, viewModel);


ko.applyBindings(viewModel);