define(["knockout", "sample"], function(ko, Sample) {

    return  new Sample("UI Refresh", "uirefresh", [
        new Sample.State("computed","computed", { forceLoad: true }),
        new Sample.State("Work Week","workWeek", { forceLoad: true }),
        new Sample.State("observableArray","obsArray1", { forceLoad: true }),
        new Sample.State("observableArray","obsArray", { forceLoad: true })
    ]);

});