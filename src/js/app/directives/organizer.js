(function (app) {

    if (!app) {
        return;
    }

    app.directive('organizers', ['dataLoader', function (dataLoader) {
        return {
            restrict: 'A',
            scope: true,
            replace: true,
            controller: function ($scope) {

                $scope.data = null;

                dataLoader.loadPromise.then(function () {
                    $scope.data = dataLoader.data;
                });
            },
            templateUrl: "templates/organizers.tmpl.html"
        };
    }]);

})(guucApp);
