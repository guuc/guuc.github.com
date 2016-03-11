(function (app, componentHandler) {

    if (!app) {
        return;
    }

    app.directive('mdlButton', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            scope: true,
            link: function ($scope, $element) {
                $timeout(function() {
                    componentHandler.upgradeElement($element[0], 'MaterialButton');
                    componentHandler.upgradeElement($element[0], 'MaterialRipple');
                });

            }
        };
    }]);

})(guucApp, componentHandler);
