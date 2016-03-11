(function (app) {

    if (!app) {
        return;
    }

    app.service('dataLoader', ['$http', '$q', function ($http, $q) {

        var _this = this;

        this.data = {
            organizers: null,
            persons: null
        };

        function loadOrganizers() {

            return $http.get('data/organizers.json').success(function (response) {
                _this.data.organizers = response;
            });

        }

        function loadPersons() {

            return $http.get('data/persons.json').success(function (response) {
                _this.data.persons = response;
            });

        }

        this.loadPromise = $q.all([
            loadOrganizers(),
            loadPersons()
        ]);

    }]);

})(guucApp);