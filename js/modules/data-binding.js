define(["knockout", "sample"], function(ko, Sample) {

    return  new Sample("Data Binding", "data-binding", [
        new Sample.State("One Way","data-binding", { forceLoad: true }),
        new Sample.State("Two Way","data-binding2", { forceLoad: true }),
        new Sample.State("Two Way Observable","data-binding3", { forceLoad: true }),
        new Sample.State("Two Way Observable All","data-binding-all", { forceLoad: true }),
        new Sample.State("Passing Data","pass-data", { forceLoad: true, hideHtml: true }),
        new Sample.State("Passing Data via APEX","pass-data-apex", { forceLoad: true, hideResult: true, hideHtml: true })
    ]);

});