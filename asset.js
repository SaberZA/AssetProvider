
// Code goes here
var myApp = angular.module('myApp',[]);

myApp.controller('pdf-controller', ['$scope', function($scope) {
  $scope.sourceUrl = 'test.pdf';
}]).directive('pdfViewer',function() {
  return {
    restrict: 'E',
    link: function(scope, element, attrs) {	      

		// var url = 'test.pdf';		
		// var url = 'sahl.jpg';
		var url = 'CCITT_1.TIF';
		scope.scaleOptions = [
			{id: "pageAutoOption", title: "", value: "auto", selected: "selected", 'data-l10n-id': "page_scale_auto", content: "Automatic Zoom"},
			{id: "pageActualOption", title: "", value: "page-actual", 'data-l10n-id': "page_scale_actual", content: "Actual Size"},
			{id: "pageFitOption", title: "", value: "page-fit", 'data-l10n-id': "page_scale_fit", content: "Fit Page"},
			{id: "pageWidthOption", title: "", value: "page-width", 'data-l10n-id': "page_scale_width", content: "Full Width"},
			{id: "customScaleOption", title: "", value: "custom", 'data-l10n-id': "", content: ""},
			{id: "", title: "", value: "0.5", 'data-l10n-id':"page_scale_percent", 'data-l10n-args':'{ "scale": 50 }', content: "50%"},
			{id: "", title: "", value: "0.75", 'data-l10n-id':"page_scale_percent", 'data-l10n-args':'{ "scale": 75 }', content: "75%"},
			{id: "", title: "", value: "1", 'data-l10n-id':"page_scale_percent", 'data-l10n-args':'{ "scale": 100 }', content: "100%"},
			{id: "", title: "", value: "1.5", 'data-l10n-id':"page_scale_percent", 'data-l10n-args':'{ "scale": 150 }', content: "150%"},
			{id: "", title: "", value: "2", 'data-l10n-id':"page_scale_percent", 'data-l10n-args':'{ "scale": 200 }', content: "200%"},
			{id: "", title: "", value: "3", 'data-l10n-id':"page_scale_percent", 'data-l10n-args':'{ "scale": 300 }', content: "300%"},
			{id: "", title: "", value: "4", 'data-l10n-id':"page_scale_percent", 'data-l10n-args':'{ "scale": 400 }', content: "400%"}		
		];

		var canvas = document.getElementById('the-canvas'),
	  		canvas2 = document.getElementById('the-canvas2');

     	var options = {source: url, canvas: canvas};	  		

        scope.assetDocument = new BlankAssetDocument(options);
        var format = scope.assetDocument.GetFileExtension();
     	if (format == 'pdf') {
     		scope.assetDocument = new PdfAssetDocument(options);
     	}
     	else if (format.toLowerCase() == 'tif') {
			scope.assetDocument = new TiffAssetDocument(options);
     	}
     	else {
     		scope.assetDocument = new ImageAssetDocument(options);
     	};

		scope.assetDocument.buildDocument();
    },
    templateUrl: 'viewer.tpl.html'
  };
});