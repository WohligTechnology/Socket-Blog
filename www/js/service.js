var adminurl = "http://192.168.2.17:1337/"
var myservices = angular.module('myservices', []);

myservices.factory('MyServices', function ($http) {
    var returnval = {};
    returnval.getBlogPosts = function (callback) {
        $http.get(adminurl + "posts/getallposts").success(function (data) {
            callback(null, data);
        }).error(function (err) {
            callback(err);
        });
    }
    return returnval;
});