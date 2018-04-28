var app=angular.module('App', []);
baseUrl = 'http://www.omdbapi.com/?i=tt3896198&apikey=278d2ff3';
app.controller("controller", function($scope, $http, $window, sharedProperties){
    
   // recentSearch = {}
    recentSearch = localStorage.getItem("recentSearchList");
    if(recentSearch)
        $scope.userData = JSON.parse(recentSearch).reverse();
    //$window.alert($scope.users);
    
    $scope.generate = function(Title,Year)
    {
    //localstorage implementataion for recent searches
      //recentSearch = localStorage.getItem("recentSearchList");
      //$window.alert(recentSearch);
      searchItem = {};
      searchItem["Title"] = Title;
        searchItem["Year"] = Year;
      //similarly the url can be given as a key to search item, i.e searchItem["url"], 
      //this value can be used as href while displaying the recent searches
      if(recentSearch==null || recentSearch == "")
          {
              searchItemsArray = [];
             // $window.alert(JSON.stringify(searchItem));
              searchItemsArray.push((searchItem));
              //$window.alert(searchItemsArray);
          }
        else{
            //if the searchItem has more than one element
            searchItemsArray = [];
            searchItemsArray= (JSON.parse(recentSearch));
            delIndex = -1;
            for(i in searchItemsArray)
            {   //This is done in order to check if the search is already present
                if(searchItemsArray[i].Title == Title && searchItemsArray[i].Year == Year)
                {   //if present then remove it from the searcList
                    delIndex = i;
                    searchItemsArray.splice(delIndex,1);
                    break;
                }
            }
            //Take only the last five recent searches
            if(searchItemsArray.length == 5)
                searchItemsArray.shift();
            searchItemsArray.push(searchItem);
        }
        localStorage.setItem("recentSearchList",JSON.stringify(searchItemsArray));
        if(Title!=null && Year!=null)
        {
            //Check if Both title and year are not entered by the user
            $http.get('http://www.omdbapi.com/?i=tt3896198&apikey=278d2ff3&t='+Title+'&y='+Year)
                .then(function mySucces(response)
                      {
                $scope.error = "";
                sharedProperties.setData(response.data);
                $window.location.href = 'file:///Users/bhuvana/Desktop/Homeworks/Webclass/Fyle_assignment/result.html';
            }, function myError(){
                $scope.error = "Wrong Username";
            });
        }
        if(Year!=null && Title==null)
        {
            //Check if both values are entered by the user
            $http.get('http://www.omdbapi.com/?i=tt3896198&apikey=278d2ff3&y='+Year)
                .then(function mySucces(response){
                $scope.error = "";
                sharedProperties.setData(response.data);
                $window.location.href = 'file:///Users/bhuvana/Desktop/Homeworks/Webclass/Fyle_assignment/result.html';
            }, function myError() {
                $scope.error = "Wrong Username";
            });
        }
        if(Title!=null && Year==null)
        {
            $http.get('http://www.omdbapi.com/?i=tt3896198&apikey=278d2ff3&t='+Title)
                .then(function mySucces(response) {
                $scope.error = "";
                sharedProperties.setData(response.data);
                $window.location.href = 'file:///Users/bhuvana/Desktop/Homeworks/Webclass/Fyle_assignment/result.html';
            }, function myError() {
                $scope.error = "Wrong Username";
            });
        }
    }
});



app.controller("resultController", function($scope, $window,sharedProperties){
    //Controller used to redirect search results to new page
   $scope.checked=false;
    $scope.Movie = sharedProperties.getData();
    //Display table only if search result is valid
    if($scope.Movie.Response=="False")
        $scope.checked=true;
    $scope.home = function() {
        $window.location.href = 'file:///Users/bhuvana/Desktop/Homeworks/Webclass/Fyle_assignment/index.html';
    }
});



app.service('sharedProperties', function() {
    //Service used to share vaiables between controllers. One controller gets input from user and the other Controller displays result.
    return {
        getData: function() {
            return angular.fromJson(sessionStorage.sharedProperties);
        },
        setData: function(value) {
           sessionStorage.sharedProperties = angular.toJson(value);
        },
    }
});
