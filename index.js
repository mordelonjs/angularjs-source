// import angular from 'angular';
// const Mordelon = require("mordelon-js");

let app = angular.module("mordelon", []);

app.factory("Mordelon", ["$window", ($window) => {
    return $window.Mordelon;
}]);

app.directive("mordelon", () => {
    let $ctrl = function (Mordelon, $rootScope) {
        console.log(this);
        this.$data = [];
        this.$loading = true;
        this.$error = undefined;
        //observar cambios para
        this.$prune = { start:0, limit: 20 };
        this.$filters = [];
        this.$sorter = { field: undefined, direction: 'ASC' };

        this.$onInit = function () {
            const map = Object.entries(this).map((value) => {
                let key = value[0].substr(1);
                return [ key, value[1] ];
            });
            const config = Object.fromEntries(map);
            this._source = new Mordelon.Source(config);

            this._source.handleLoading = (loading) => {
                this.$loading = loading;
            };

            this._source.handleDataChange = (wrapper) => {
                Object.keys(wrapper).forEach((key) => {
                    this[`$${key}`] = wrapper[key];
                });
                this.$keys = Object.keys(wrapper.data[0] || {});
            };

            this._source.handleError = (reason) => {
                this.$error = reason;
            };

            $rootScope.$apply();
        };

        this.$filtersChange = () => {
            this._source.filters = this.$filters;
        };

        this.$pruneChange = () => {
            this._source.prune = this.$prune;
        };

        this.$sorterChange = () => {
            console.log("cambiando orden ", this.$sorter);
            this._source.sorter = this.$sorter;
        };

        this.$forceLoad = () => {
            Mordelon.ProxyPool.loadAll();
        }

    };

    $ctrl.$inject = ["Mordelon", "$rootScope" ];

    return {
        restrict: 'EA',
        controller: $ctrl,
        controllerAs: '$m',
        bindToController: {
            $url: '@url',
            $type: '@type',
            $paginate: '@paginate',
            $load: '@load',
        }
    }
});
