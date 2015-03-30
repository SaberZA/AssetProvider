// angular.module('assetApp').service('$assetDocumentService',function() {

// });

var fileExtensionRegularExpression = /(?:\.([^.]+))?$/;
function AssetDocument() {
	
};

function BlankAssetDocument() {
	this.init.apply(this, arguments);
};

BlankAssetDocument.prototype = new AssetDocument();
BlankAssetDocument.prototype.transformAssetDocumentType = function() {
	var format = this.GetFileExtension();
	var assetDocument = {};
	if (format == 'pdf') {
 		assetDocument = new PdfAssetDocument(this.options);
 	}
 	else if (format.toLowerCase() == 'tif' || format.toLowerCase() == 'tiff') {
		assetDocument = new TiffAssetDocument(this.options);
 	}
 	else {
 		assetDocument = new ImageAssetDocument(this.options);
 	};

 	return assetDocument;
}

AssetDocument.prototype.init = function (args) {
	this.options = args;
	this.sourceUrl = this.options.source;
	this.canvas = this.options.canvas;
	if (this.canvas) {
		this.context = this.canvas.getContext('2d');
	};	
	this.SetFileExtension(fileExtensionRegularExpression.exec(this.sourceUrl));
	this.type = this.DetermineType(this.fileExtension);
	this.currentDocument = {};
};

AssetDocument.prototype.DetermineType = function (fileExtension) {	
	return new AssetType(fileExtension);
};

AssetDocument.prototype.buildDocumentHook = function (args) {

};

AssetDocument.prototype.FileExtension = '';
AssetDocument.prototype.SetFileExtension = function(fileExtension) {
	this.FileExtension = fileExtension[1];
};
AssetDocument.prototype.GetFileExtension = function() {
	return this.FileExtension;
}

AssetDocument.prototype.buildDocument = function (args) {
	this.buildDocumentHook(args);
};

function AssetType() {

};

AssetType.prototype.init = function(type) {
	this.documentType = type;
};

AssetType.prototype.LoadDisplayMethod = function() {
	if(this.documentType === 'pdf'){
		// load PDF context
	}
	else {
		// load image context
	};
};

AssetType.prototype.DocumentType = function() {
	return this.documentType;
}

function PdfAssetDocument() {
	this.init.apply(this, arguments);
	this.pageNum = 1;
	this.pageNumPending = null;
	this.scale = 1.1;
};

PdfAssetDocument.prototype = new AssetDocument();
PdfAssetDocument.prototype.buildDocumentHook = function () {
	var pageNum = this.pageNum;
	var doc = this;

    PDFJS.getDocument(this.sourceUrl).then(function (pdfDoc_) {    
    doc.pdfDoc = pdfDoc_;

    document.getElementById('page_count').textContent = doc.pdfDoc.numPages;
    doc.renderPage(pageNum);
  });
};

PdfAssetDocument.prototype.renderPage = function (num) {
	pageRendering = true;
	var canvas = this.canvas;
	var doc = this;
	// Using promise to fetch the page
	this.pdfDoc.getPage(num).then(function(page) {
	  var viewport = page.getViewport(doc.scale);
	  canvas.height = viewport.height;
	  canvas.width = viewport.width;

	  // Render PDF page into canvas context
	  var renderContext = {
	    canvasContext: canvas.getContext('2d'),
	    viewport: viewport
	  };
	  var renderTask = page.render(renderContext);

	  // Wait for rendering to finish
	  renderTask.promise.then(function () {
	    pageRendering = false;
	    if (doc.pageNumPending !== null) {
	      // New page rendering is pending
	      renderPage(doc.pageNumPending);
	      doc.pageNumPending = null;
	    }
	  });
	});

	// Update page counters
	document.getElementById('page_num').textContent = num;
};

/**
* If another page rendering in progress, waits until the rendering is
* finised. Otherwise, executes rendering immediately.
*/
PdfAssetDocument.prototype.queueRenderPage = function(num) {
	if (this.pageRendering) {
	  this.pageNumPending = num;
	} else {
	  this.renderPage(num);
	}
};

PdfAssetDocument.prototype.onNextPage = function (assetDocument) {
	if (assetDocument.pageNum >= assetDocument.numPages) {
      return;
    }
    assetDocument.pageNum++;
    assetDocument.queueRenderPage(assetDocument.pageNum);
};

/**
* Displays previous page.
*/
PdfAssetDocument.prototype.onPrevPage = function(assetDocument) {
	if (assetDocument.pageNum <= 1) {
	  return;
	}
	assetDocument.pageNum--;
	assetDocument.queueRenderPage(assetDocument.pageNum);
};

function ImageAssetDocument() {
	this.init.apply(this, arguments);
};

ImageAssetDocument.prototype = new AssetDocument();
ImageAssetDocument.prototype.buildDocumentHook = function() {
	var imageObj = new Image();
	var doc = this;
	imageObj.onload = function() {
		doc.context.drawImage(imageObj, 0, 0);
	};
  	imageObj.src = this.sourceUrl;
};

function TiffAssetDocument() {
	this.init.apply(this, arguments);
};

TiffAssetDocument.prototype = new AssetDocument();
TiffAssetDocument.prototype.buildDocumentHook = function() {
	var doc = this;
	var xhr = new XMLHttpRequest();
	xhr.open('GET', doc.sourceUrl, true);
	xhr.responseType = 'blob';
	xhr.onload = function(e) {
	  if (this.status == 200) {
	    var blob = this.response;

	    doc.loadBlobAsTiff(blob);
	  }
	};
	xhr.send();
};

TiffAssetDocument.prototype.loadBlobAsTiff = function(blob) {
	var reader = new FileReader();
	var doc = this;
	reader.onload = function(e) {
		var canvasParent = doc.canvas.parentNode;
		var tiffParser = new TIFFParser();

		var tiffCanvas = tiffParser.parseTIFF(e.target.result, doc.canvas);		
	};
	reader.readAsArrayBuffer( blob );
};