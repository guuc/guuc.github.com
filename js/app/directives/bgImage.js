(function (app) {

    if (!app) {
        return;
    }

    app.directive('bgImage', function () {
        return {
            restrict: 'A',
            scope: {
                bgImage: '='
            },
            replace: true,
            link: function ($scope, $element) {

                $element.css({
                    'background-image': 'url(' + $scope.bgImage +')'
                });
            }
        };
    });

})(guucApp);
