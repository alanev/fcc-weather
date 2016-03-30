'use strict';

const app = angular.module('LocalWeather', []);
const ipAPI = 'http://ipinfo.io/json?callback=JSON_CALLBACK';

// var city = 'Pinsk';
// 
app.factory('GET', ($http) => {
    return {
        location () {
            return $http.jsonp(ipAPI);
        },
        weather (location) {
            var weatherAPI = `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&APPID=b9b885e4e9d0b8a0dce85e447aaa51e7&callback=JSON_CALLBACK`;
            return $http.jsonp(weatherAPI);
        },
        icon (type) {
            return $http.get(`icons/${type}.svg`);
        }
    }
});
app.controller('WeatherCtrl', ($scope, $sce, GET) => {
    
    let tempC, tempF;
    
    $scope.icon = '';
    $scope.city = '';
    $scope.toggleTemp = function () {
        if ($scope.temp === tempC) {
            $scope.temp = tempF;
        } else {
            $scope.temp = tempC;
        }
    }
    GET.location().success(({city, country}) => {
        
        // location
        let location = `${city},${country}`;
        $scope.location = city;
        
        GET.weather($scope.location).success(data => {
            
            // temp
            tempC = data.main.temp.toFixed(0);
            tempF = (tempC * 1.8 + 32).toFixed(0) + '°F';
            tempC += '°C';
            $scope.temp = tempC;
            
            // icon
            var type = data.weather[0].main.toLowerCase();
            switch (type) {
                case 'mist':
                    type = 'fog';
                    break;
                case 'haze':
                    type = 'fog';
                    break;
                case 'clear':
                    type = 'sun';
                    break;
                case 'clouds':
                    type = 'cloud';
                    break;
            }
            $scope.type = type;
            
            GET.icon(type).success(icon => {
                $scope.icon = $sce.trustAsHtml(icon);
            });
        })
    });
})