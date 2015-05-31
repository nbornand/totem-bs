app.service("RemoteData", ['$http', '$q', function($http, $q){
    return new (function(){

        var baseUrl = "/data/";

        this.getAll = function(entityName){
            return $http({method: 'GET', url: baseUrl+entityName});
        }

        this.saveEntity = function(entityName, entity){
            if(entity.id === undefined){
                return $http({method: 'POST', url: baseUrl+entityName, data:entity});
            }
            return $http({method: 'PUT', url: baseUrl+entityName, data:entity});
        }
        this.deleteEntity = function(entityName, entity){
            return $http({method: 'DELETE', url: baseUrl+entityName+'/id='+entity.id});
        }

        var schemasPromise = $http.get(baseUrl+'schemas');

        this.getSchemaFor = function(entityName){
            var q = $q.defer();
            schemasPromise.then(function(resolved){
                var schemas = resolved.data;
                if(schemas[entityName] == undefined){
                    q.reject('No such schema name : '+entityName);
                }
                q.resolve(schemas[entityName]);
            })
            return q.promise;
        }

        var buffer = {};
        this.getAllUnique = function(entityName){
            var q = $q.defer();
            if(buffer[entityName] === undefined){
                this.getAll(entityName).success(function(data){
                    buffer[entityName] = data;
                    q.resolve({data:data});
                });
            } else {
                q.resolve({data:buffer[entityName]});
            }
            return q.promise;
        }
    })()
}])