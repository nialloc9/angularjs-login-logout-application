var app = angular.module('app', ['ngRoute', 'ngCookies']);

//app configuration.. routes
app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'templates/loginTemplate.html'
        })
        .when('/loggedin', {
            resolve: { //check if user is authenticated
                "check": function($location, $rootScope){
                    if(!$rootScope.loggedIn){ //If the $rootScope.loggedIn = false then change path to /.
                        $location.path('/');
                    }
                }
            },
            templateUrl: 'templates/loggedinTemplate.html' //user is loggedin
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

//login in directive.. sets scope and adds a template.. only available as an attribute
app.directive('appUserLogin', function(){
    return {
        scope: {
            username: '=',
            password: '=',
            login: '&'
        },
        template: [
            '<div class="main">',
                '<form action="/" id="myLogin">',
                    'Username: <input type="text" id="username" ng-model="username"/><br>',
                    'Password: <input type="password" id="password" ng-model="password"/><br>',
                    '<button type="button" data-ng-click="login()">Login</button>',
                '</form>',
            '</div>'
        ],
        restrict: 'A'
    }
});

//logout directive sets scope and adds a template.. only available as an element
app.directive('appUserLogout', function(){
    return{
        scope: {
            logout: '&'
        },
        restrict: 'E',
        template: [
            '<div class="main">',
                '<form action="/" id="myLogout">',
                    'Super simple super awesome logout<br>',
                    '<button type="button" data-ng-click="logout()">Logout</button>',
                '</form>',
            '</div>'
        ]
    }
});

//logout controller
app.controller('logoutCtrl', ['$scope', '$location', '$rootScope', '$cookies', function($scope, $location, $rootScope, $cookies){

    //check if user is not autheticated
    if($cookies.get('authenticated') != 1){
        $rootScope.loggedIn = false;
        $location.path('/');
    }

    //change loggedin to false, remove cookie, redirect
    $scope.logout = function(){
        $rootScope.loggedIn = false;
        $cookies.remove('authenticated');
        $location.path('/');
    };
}]);

//login controller
app.controller('loginCtrl', ['$scope', '$location', '$rootScope', '$cookies', function($scope, $location, $rootScope, $cookies){

    //in production site this would be in a database
    $cookies.put('username', 'niall');
    $cookies.put('password', 'pass');

    //check if user is already loggedin
    if($cookies.get('authenticated') == 1){
        $rootScope.loggedIn = true;
        $location.path('/loggedin');
    }

    $scope.login = function(){
        //check if user provided data matches cookie data
        if($scope.username == $cookies.get('username') && $scope.password == $cookies.get('password')){

            //change user authentication to true, create login cookie and redirect
            $rootScope.loggedIn = true;
            $cookies.put('authenticated', 1);
            $location.path('/loggedin');
        }
    }
}]);
