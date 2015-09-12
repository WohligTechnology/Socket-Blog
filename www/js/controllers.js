angular.module('starter.controllers', ['myservices'])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeLogin();
        }, 1000);
    };
})

.controller('SearchCtrl', function ($scope, MyServices, $ionicLoading) {
    var socketFunc = {};
    $ionicLoading.show({
        template: 'Loading...'
    });

    $scope.error = {
        "value": false,
        comment: "Loading"
    };

    $scope.sendToastr = function (msg) {
        $scope.error.comment = msg;
        $scope.error.value = true;
        $scope.$apply();
        setTimeout(function () {
            $scope.error.value = false;
            $scope.$apply();
        }, 3000);
    };


    var postsComplete = function (err, data) {
        if (err) {
            $ionicLoading.hide();
            $scope.sendToastr("Error getting Posts");
        } else {
            _.each(data, function (n) {
                n.animate = "create"
            });
            $scope.posts = data;
            $ionicLoading.hide();
            console.log(data);
            $scope.sendToastr("Posts Received Successfully");

        }
    }
    MyServices.getBlogPosts(postsComplete);


    var createPost = function (err, data) {
        if (err) {
            console.log(err);
        } else {
            data.animate = "create";
            $scope.posts.unshift(data);
            $scope.sendToastr("New Post Added");
        }
    }



    var editPost = function (err, data) {
        if (err) {
            console.log(err);
        } else {
            _.each($scope.posts, function (n, key) {
                if (data.id == n.id) {
                    data.animate = "edit";
                    $scope.posts[key] = data;

                }
            });

            $scope.sendToastr("Post Edited");
        }
    }

    var deletePost = function (err, data) {
        if (err) {
            console.log(err);
        } else {

            _.each($scope.posts, function (n, key) {
                if (data.id == n.id) {
                    data.animate = "delete";
                    $scope.posts[key] = data;

                }
            });
            setTimeout(function () {
                $scope.posts = _.filter($scope.posts, function (n) {
                    return data.id != n.id;
                });
                $scope.$apply();
            }, 2000);

            $scope.sendToastr("Post Deleted");
        }
    }

    io.socket.on("create", function (msg) {
        createPost(null, msg);
    });

    io.socket.on("edit", function (msg) {
        editPost(null, msg);
    });

    io.socket.on("delete", function (msg) {
        deletePost(null, msg);
    });





})

.controller('PlaylistCtrl', function ($scope, $stateParams) {});