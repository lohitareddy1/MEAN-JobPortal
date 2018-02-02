var app = angular.module('myapp', ['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/views/login.html',
            controller: 'loginController'
        }).when('/register', {
            templateUrl: 'views/register.html',
            controller: 'registerController'
        }).when('/edit', {
            templateUrl: 'views/home.html',
            controller: 'searchController',
            resolve: {
                isLogged: function ($http, $q, $location) {
                    $http.get('http://localhost:3000/loggedUser').then(function (data) {
                        if (!data.data.isLoggedIn) {
                            $location.path('/');
                            window.location.reload();
                        }

                    })

                }
            }


        }).when('/search', {
            templateUrl: 'views/search.html',
            controller: 'searchController',
            resolve: {
                isLogged: function ($http, $q, $location) {
                    $http.get('http://localhost:3000/loggedUser').then(function (data) {
                        if (!data.data.isLoggedIn) {
                            $location.path('/');
                            window.location.reload();
                        }

                    })

                }
            }

        })
        .when('/post', {
            templateUrl: 'views/post.html',
            controller: 'postController',
            resolve: {
                isLogged: function ($http, $q, $location) {
                    $http.get('http://localhost:3000/loggedUser').then(function (data) {
                        if (!data.data.isLoggedIn) {
                            $location.path('/');
                            window.location.reload();
                        }

                    })

                }
            }

        })
        .when('/logout', {
            templateUrl: 'views/login.html',
            conntroller: 'logoutController'
        }).otherwise({
            template : "<h1>Page Not Found!!!!</h1>"
        });

});

app.factory('loggedUser', ['$http', '$rootScope', function ($http, $rootScope) {
    var service = {};
    service.getuser = function () {
        $http.get('http://localhost:3000/loggedUser').then(function (data) {
            console.log(data.data.username);
            console.log(data.data.usertype)
            $rootScope.username = data.data.username;
            $rootScope.usertype = data.data.usertype;

        })
    }
    return service;
}])




app.controller('postController', function ($scope, $rootScope, $http, $location, loggedUser, isLogged) {
    loggedUser.getuser();
    $rootScope.logout = function () {
        console.log('I am being called');
        $http.put('/logout/' + $rootScope.username).then(function () {
            $location.path('/');
            $rootScope.usename = '';
            $rootScope.usertype = '';

        })
    }
    $scope.postJob = function () {
        $http.post('http://localhost:3000/createjob', $scope.job)
            .then(function (data) {
                if (data.data.flg == 'success') {
                    alert("Job Posting Successful");
                    $location.path('/edit');
                    console.log($scope.job);
                }
            }).catch(function () {
                console.log("Error");
            });
    }
});

app.controller('logoutController', function ($scope, $rootScope, $http, $location, loggedUser) {
    loggedUser.getuser();


});


app.controller('registerController', function ($scope, $http, $location) {
    $scope.clickFn = function () {
        console.log($scope.user);
        $http.post('http://localhost:3000/createuser', $scope.user)
            .then(function (data) {
                if (data.data.flg == 'success') {
                    alert("Registration Successful");
                    $location.path('/');
                }
            }).catch(function () {
                console.log("Error");
            });
    }
})

app.controller('loginController', function ($scope, $http, $location, $rootScope, loggedUser) {
    $rootScope.username = '';
    $rootScope.usertype = '';
    //to get the user name
    console.log($rootScope.username);
    console.log($rootScope.usertype);

    $scope.loginFn = function (user) {
        $scope.user = user;
        console.log($scope.user);
        $http.post('http://localhost:3000/validateuser', $scope.user)
            .then(function (data) {
                if (data.data.flg == 'success') {
                    console.log("Data", data);

                    alert("Login Successful");
                    loggedUser.getuser();
                    console.log($rootScope.username);
                    console.log($rootScope.usertype);
                    $location.path('/edit');
                    $http.put('http://localhost:3000/authenticate/' + user.username).then(function (data) {
                        if (data.data.flg == 'success')
                            $location.path('/edit');


                        console.log($rootScope.usertype);
                    });

                }
                else {
                    alert("Wrong Credntials");
                }

            }).catch(function () {
                console.log("Error");
            });
    }

    $rootScope.logout = function () {
        console.log('I am being called');
        $http.put('/logout/' + $rootScope.username).then(function () {
            $location.path('/');
            $rootScope.usename = '';
            $rootScope.usertype = '';


        })
    }


})

app.controller('searchController', function ($scope, $http, $location, loggedUser, $rootScope, isLogged) {

    $scope.searchterm;
    $rootScope.logout = function () {
        console.log('I am being called');
        $http.put('/logout/' + $rootScope.username).then(function () {
            $location.path('/');
            $rootScope.usename = '';
            $rootScope.usertype = '';

        })
    }
    $scope.checkuser = function () {
        loggedUser.getuser();
    }

    $scope.search = function () {
        console.log('tetsts');
        // $scope.searchTerm ;
        const obj = {
            title:$scope.searchterm.title ||'' ,
            keyword: $scope.searchterm.keyword || '',
            location: $scope.searchterm.location || ''
        }
        console.log(obj);
        $http.post('http://localhost:3000/api/search', obj).then(function (response) {

            $scope.results = response.data;
            console.log("Results are:", $scope.results);
            //your code
        });

    }


    $scope.reset = function () {
        console.log('I am called');
        $scope.results = ' ';
    }
})