
// Code goes here
var myApp = angular.module('assetApp',[]);

myApp.controller('asset-controller', ['$scope', function($scope) {
    $scope.sourceUrl = 'test.pdf';
    $scope.options = {source: $scope.sourceUrl, canvas: null};  
    $scope.scaleOptions = [];
    $scope.assetDocument = new BlankAssetDocument($scope.options);

    $scope.setSourceUrl = function(sourceUrl) {
        $scope.sourceUrl = sourceUrl;
    };

    $scope.loadAssetDocument = function (options) {
        $scope.assetDocument = new BlankAssetDocument(options);
        
        $scope.assetDocument = $scope.assetDocument.transformAssetDocumentType();
        $scope.assetDocument.buildDocument();
    };

}]).directive('assetViewer',function() {
  return {
    restrict: 'E',
    link: function(scope, element, attrs) { 
        var canvas = document.getElementById('the-canvas');
        scope.options = {source: scope.sourceUrl, canvas: canvas};

        scope.loadAssetDocument(scope.options);
    },
    templateUrl: 'viewer.tpl.html'
  };
});