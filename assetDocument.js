function AssetDocument() {
	
};

AssetDocument.prototype.init = function (source) {
	this.sourceUrl = source;
	this.fileExtension = fileExtensionRegularExpression.exec(source);
	this.type = this.DetermineType(this.fileExtension);
	this.currentDocument = {};
};

AssetDocument.prototype.DetermineType = function (fileExtension) {	
	return new AssetType(fileExtension);
};

AssetDocument.prototype.buildDocumentHook = function (args) {

};

AssetDocument.prototype.buildDocument = function (args) {
	this.buildDocumentHook(args);
};

function AssetType() {

};

AssetType.prototype.init = function(type) {
	this.DocumentType = type;
};

AssetType.prototype.LoadDisplayMethod = function() {
	if(DocumentType === 'pdf'){
		// load PDF context
	}
	else {
		// load image context
	};
};

function PdfAssetDocument() {
	this.init.apply(this,arguments);
};

PdfAssetDocument.prototype = new AssetDocument();
PdfAssetDocument.prototype.buildDocumentHook = function () {
   /**
   * Asynchronously downloads PDF.
   */
  PDFJS.getDocument(this.sourceUrl).then(function (pdfDoc_) {
    pdfDoc = pdfDoc_;
    document.getElementById('page_count').textContent = pdfDoc.numPages;

    // Initial/first page rendering
    renderPage(pageNum);
  });
};

function ImageAssetDocument() {
	this.init.apply(this,arguments);
};

ImageAssetDocument.prototype = new AssetDocument();
ImageAssetDocument.prototype.buildDocumentHook = function(context) {
	var imageObj = new Image();

      imageObj.onload = function() {
        context.drawImage(imageObj, 0, 0);
      };
      imageObj.src = this.sourceUrl;
}

var fileExtensionRegularExpression = /(?:\.([^.]+))?$/;

