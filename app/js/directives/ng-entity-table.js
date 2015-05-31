/**
 * Define global properties of the grid and inject them in the current scope.
 * 
 */
app.directive('ngEntityTable', [function() {
    return {
        restrict: 'EA',
        scope: true,
        replace: true,
        transclude:true,
        template:'<div><table class="table table-striped">' +
            '<thead><tr><th ng-repeat="property in schema" ng-if="property.type !== \'list\'">{{property.label||property.name}}</th></tr></thead>' +
            '<tbody><tr class="handOnHover" ng-repeat="entity in tableData" ng-click="setSelected(entity)">' +
            '<td ng-repeat="property in schema" ng-if="property.type !== \'list\'">' +
                '<a ng-if="innerLinks[property.label]" ng-click="innerLinks[property.label]()">#</a>{{formatedValue(entity, property)}}</td>' +
            '<td ng-transclude></td></tr></tbody></table></div>',
        link: function($scope, $element, $attr, $ctrl, $transclude) {

            var die = function(text){throw text;};
            var entityName = $attr.ngEntityTable || die('The entity type has to be provided');
            $scope.state = 'nodata';

            //get the schema for the entity
            $scope.schema = [];
            RemoteData.getSchemaFor(entityName).then(function(schema){
                $scope.schema = schema;
            });

            //entity selection
            var onEntitySelected = $scope.$eval($attr.onSelection);
            if(!angular.isFunction(onEntitySelected))  throw 'onSelection is exepected to be a function';
            $scope.setSelected = function(entity){
                $scope.state = 'entitySelected';
                onEntitySelected(entity);
            }
            $scope.unselect = function(){
                $scope.state = 'ongoingSelection';
                $scope.$emit(entityName+'Selected', null);
            }
            $scope.formatedValue = function(entity, property){
                var value = entity[property.name];
                var link = property.name.match(/^(\w+)_id$/) || property.name.match(/^(\w+?)\d*_option$/);
                if(link){
                    var potentialSchema = link[1];
                    var table = AppState.loadedLocally[potentialSchema];
                    if(table){
                        var row = table(value);
                        value = row && (row['name'] || row['first']);
                    }
                }
                if(property.type === 'date'){
                    return TimeUtils.toEuFormat(value);
                } else if(property.type === 'money'){
                    return parseFloat(value).toFixed(2);
                }
                return value;
            }

            $scope.innerLinks = {
                client_id:function(client){
                    console.log('link to client');
                }
            };

            //retrieve the entities  to display
            var dataLocation = $attr.data || die('The entity type has to be provided');
            $scope.tableData = $scope[dataLocation];
        }
    };
}]);
