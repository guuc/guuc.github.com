(function (app) {

    if (!app) {
        return;
    }

    app.directive('persons', function () {
        return {
            restrict: 'A',
            scope: {
                items: '='
            },
            replace: true,
            require: '^organizers',
            link: function(scope) {
                scope.persons = scope.items;
            },
            templateUrl: "templates/persons.tmpl.html"
        };
    });

})(guucApp);

