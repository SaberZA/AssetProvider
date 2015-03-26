
// Code goes here
var myApp = angular.module('myApp',[]);

myApp.controller('pdf-controller', ['$scope', function($scope) {
  $scope.sourceUrl = 'test.pdf';
}]).directive('pdfViewer',function() {
  return {
    restrict: 'E',
    link: function(scope, element, attrs) {	      

		  var url = 'test.pdf';
		  var imageUrl = 'sahl.jpg';

		  var canvas = document.getElementById('the-canvas'),
		      canvas2 = document.getElementById('the-canvas2');

	    	scope.pdfDocument = new PdfAssetDocument({source: url, canvas: canvas});
		    scope.pdfDocument.buildDocument();

		  var imageDocument = new ImageAssetDocument({source: imageUrl, canvas: canvas2});
		  imageDocument.buildDocument();
    },
    templateUrl: 'viewer.tpl.html'
  };
});