define(["knockout", "ko2", "codemirror", "ext/mode/css/css", "ext/mode/xml/xml", "ext/mode/javascript/javascript", "ext/mode/htmlmixed/htmlmixed"], function(ko, ko2) {
    var initEditor;

    //display the output of HTML and JavaScript from strings
    ko.bindingHandlers.sample = {
        init: function(element) {
            return { controlsDescendantBindings: true };
        },
        update: function(element, valueAccessor) {
            var sample = valueAccessor(),
                realApply = ko.applyBindings,
                realApply2 = ko2.applyBindings,
                getBindingHandler = ko.getBindingHandler,
                preprocess = ko.bindingProvider.instance.preprocessNode,
                container = document.createElement("div"),
                html = sample.html(),
                js = sample.js();

            if (element.firstChild) {
                ko.removeNode(element.firstChild);
            }

            element.appendChild(container);

            ko.applyBindings = function(vm, overrideContainer) {
                realApply(vm, overrideContainer || container);
            };


            ko2.applyBindings = function(vm, overrideContainer) {
                realApply2(vm, overrideContainer || container);
            };

            ko.utils.setHtml(container, html);

            //hack to add some bootstrap style to our elements, without polluting examples
            $(container).find("button").addClass("btn");
            $(container).find("input").addClass("input");

            try {
                //avoid extra dependencies
                ko.computed(function() {
                    eval(js);
                }).dispose();

                sample.error("");
            } catch (ex) {
                sample.error(ex.toString());
            }

            ko.applyBindings = realApply;
            ko.getBindingHandler = getBindingHandler;
            ko.bindingProvider.instance.preprocessNode = preprocess;
            ko2.applyBindings = realApply2;
        },

        theme: "rubyblue"
        //theme: "eclipse"
    };

    //initiailze a CodeMirror editor
    initEditor = function(element, code, mode, highlight) {
        var editor = CodeMirror(element, {
            value: ko.utils.unwrapObservable(code),
            mode: mode,
            theme: ko.bindingHandlers.sample.theme,
            onChange: function() {
                if (ko.isWriteableObservable(code)) {
                    code(editor.getValue());
                }
            },
            onCursorActivity: function() {
                if (highlight) {
                    if (window.currentLine) {
                        window.currentEditor.setLineClass(window.currentLine, null, null);
                    }

                    window.currentLine = editor.setLineClass(editor.getCursor().line, null, "currentline");
                    window.currentEditor = editor;
                }
            },
            lineWrapping: true,
            indentUnit: 4,
            //lineNumbers: true,
            matchBrackets: true
        });

        ko.computed({
            read: function() {
                var value = ko.utils.unwrapObservable(code);
                if (code.update) {
                    editor.setValue(value || "");
                    code.update = false;
                }
            },
            disposeWhenNodeIsRemoved: element
        });
    };

    //load a sample from remote and populate editor
    ko.bindingHandlers.remoteEditor = {
        init: function(element, valueAccessor) {
            var value = ko.observable(),
                options = valueAccessor(),
                editor = options.type + "Editor",
                binding = {};

            if (options.path) {
                binding[editor] = value;

                require(["text!../samples/" + options.path], value);

                ko.applyBindingsToNode(element, binding);

                value.update = true;
            }
        }
    };

    //initialize a JavaScript CodeMirror editor
    ko.bindingHandlers.jsEditor = {
        init: function(element, valueAccessor) {
            initEditor(element, valueAccessor(), "javascript", true);
        }
    };

    //initialize a HTML CodeMirror editor
    ko.bindingHandlers.htmlEditor = {
        init: function(element, valueAccessor) {
            initEditor(element, valueAccessor(), "htmlmixed", true);
        }
    };

    ko.bindingHandlers.jsonEditor = {
        init: function(element, valueAccessor) {
            initEditor(element, valueAccessor(), { name: "javascript", json: true }, false);
        }
    };

    /*
    State constructor function
    arguments:
    -description: a description that can be displayed in the UI
    -key: the unique key that is used to load the template/code
    -options:
        -hideHtml - hide the HTML box
        -hideJs - hide the JavaScript box
        -hideResult - hide the result box
        -forceLoad -load the HTML/JS code immediately when accessing this state
        -loadAsSection - rather than treatHTML/JS as strings that go in the editors, actually render it as view model and template
    */
    var State = function(description, key, options) {
        options = options || {};
        this.description = description;
        this.key = key;

        this.html = null;
        this.js = null;
        //this.css = null;

        this.showHtml = !options.hideHtml;
        this.showJs = !options.hideJs;
        this.showResult = !options.hideResult;
        this.showTitle = !options.hideTitle;

        this.forceLoad = options.forceLoad;
        this.loadAsSection = options.loadAsSection;
        this.sectionData = ko.observable();

        this.shrinkHtmlEditor = ko.observable(false);

        this.toggleHtml = function() {
            this.shrinkHtmlEditor(!this.shrinkHtmlEditor());
        }.bind(this);
    };

    var Sample = function(title, key, states, loadImmediately) {
        var self = this;
        this.title = title;
        this.key = key;

        //a list of possible states
        this.states = ko.observableArray(states);

        //the index of the current state
        this.index = ko.observable(0);

        //the current state
        this.currentState = ko.computed(function() {
            return self.states()[self.index()];
        });

        //the current JavaScript and HTML in the editors
        this.html = ko.observable();
        this.js = ko.observable();
        this.error = ko.observable();

        //when navigating between states, should the code be loaded immeidately
        this.loadCodeImmediately = ko.observable(loadImmediately);

        //retrieve the code from the server
        this.getCode = function() {
            var current = self.currentState(),
                path = "../",
                key = "samples/" + self.key + "/" + current.key;

            require(["text!" + path + key + ".html", (current.loadAsSection ? "" : "text!" + path) + key + ".js"], function(html, js) {
                current.html = html;
                current.js = (js || "").toString();

                self.updateCode();

                if (current.loadAsSection) {
                    ko.templates[self.key + "-" + current.key] = html;
                    current.sectionData(typeof js === "function" ? new js() : js);
                }
            });
        };

        //update the current code to match the state's code
        this.updateCode = function() {
            var current = self.currentState();

            if (!current.html && !current.js) {
                self.getCode();
            } else {
                self.js.update = true;
                self.js(current.js);
                self.html.update = true;
                self.html(current.html);
            }

            return false;
        };

        //initialize code
        this.updateCode();

        //move to the next state
        this.next = function() {
            var index, data;

            index = self.index();
            data = self.currentState().sectionData();

            if (data && data.next && data.next()) {
                return;
            }

            if (index < self.states().length - 1) {
                self.index(index + 1);
                if (self.loadCodeImmediately() || self.currentState().forceLoad) {
                    self.updateCode();
                }
            }
        };

        //move to the previous state
        this.previous = function() {
            var index = self.index(),
                data = self.currentState().sectionData();

            if (data && data.previous && data.previous()) {
                return;
            }

            if (index > 0) {
                self.index(index - 1);
                if (self.loadCodeImmediately() || self.currentState().forceLoad) {
                    self.updateCode();
                }
            }
        };
    };

    //put State constructor under Sample
    Sample.State = State;

    return Sample;
});
