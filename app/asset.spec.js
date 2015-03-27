describe('Asset Document Viewer', function() {
	var $scope, controller;

	beforeEach(module('assetApp'));

	beforeEach(inject(['$rootScope','$controller',function($rootScope, $controller) {
		$scope = $rootScope.$new();
		controller = $controller('asset-controller', {
			$scope: $scope			
		});
	}]));

	it('should have a asset-controller defined', function() {
		expect(controller).toBeDefined();
	});

	it('should be able to set a sourceUrl that can be loaded later', function() {
		$scope.setSourceUrl('test.pdf');
		expect($scope.sourceUrl).toEqual('test.pdf');
	});

	it('should have an assetDocument defined', function() {
		expect($scope.assetDocument).toBeDefined();
	});
});