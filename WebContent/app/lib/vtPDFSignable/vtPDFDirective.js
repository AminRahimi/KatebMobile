angular.module('vtPDFSignable', []).directive("vtPdfSignable",
    /**
     * @memberOf vtPDFModule
     * @ngdoc directive
     * @name vtPdf
     * @description
     *  PDF viewer build on top of PDFJS with signing feature
     * @param {service} vtPDFSrvc
     * @attr {function} control-fn {canSign: boolean, pdfUrl: ''}
     * @example
     *  Usage:
     *      <vt-pdf control-fn=""></vt-pdf>
     */
    function () {
        return {
            restrict: 'AE',
            templateUrl: "app/lib/vtPDFSignable/vtPDFDirectiveTemplate.html",
            scope: {
                controlFn: '=',
                signText: '=',
                signerInfo: "="
            },
            controller: function ($timeout, $scope, $element, $compile, $rootScope, vtPDFSrvc, $document) {
                $scope.controlFn.signText = $scope.signText;
                $scope.controlFn.textAreaChange = function(){
                    if($document[0].getElementById('texarea').scrollHeight > $document[0].getElementById('texarea').clientHeight || $document[0].getElementById('texarea').value.length > 200){
                        $scope.controlFn.maxCharError = true;
                    }
                    else{
                        $scope.controlFn.maxCharError = false;
                    }
                };
                const MAX_FONT_SIZE=14;
                const MIN_FONT_SIZE=10;


                var setSigniture = function () {
                    $timeout(function () {
                        if(!$scope.controlFn.signCoords){
                            $scope.controlFn.signCoords = {};
                        }
                        var containerWidth = document.getElementById('pageContainer1').offsetWidth;
                        var containerHeight = document.getElementById('viewerContainer').clientHeight;
                        

                        var canvas = window.cc= new fabric.Canvas('fabric-canvas', {
                            width: containerWidth,
                            height: containerHeight,
                            selection: false,
                            allowTouchScrolling: true
                        });
                        fabric.Object.prototype.transparentCorners = false;

                        // Prevent Fabric js Objects from scaling out of the canvas boundary
                        canvas.on('object:moving', function (e) {
                            var obj = e.target;
                            // if object is too big ignore
                            if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
                                return;
                            }
                            obj.setCoords();
                            // top-left  corner
                            if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
                                obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
                                obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
                            }
                            // bot-right corner
                            if(obj.getBoundingRect().top+obj.getBoundingRect().height+document.getElementById('underSign').offsetHeight  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width){
                                obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top-document.getElementById('underSign').offsetHeight);
                                obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
                            }

                            //prevent event from propagate and touch scroll working
                            e.e.preventDefault();
                            e.e.stopPropagation();

                        });
                        canvas.on('object:modified ', function (e) {
                            e.e.preventDefault();
                            e.e.stopPropagation();
                        });



                        // hide rotate
                        var controls = fabric.Object.prototype.controls;
                        var rotateControls = controls.mtr;
                        rotateControls.visible = false;


                        const updateDimensionsBySingSize=(fabricImg)=>{
                            const POSITION = findePosition((fabricImg.top) + (fabricImg.height * fabricImg.scaleY), fabricImg.left);
                            const PDF_VIEWER_CURRENT_SCALE =  PDFViewerApplication.pdfViewer.currentScale;
                            $scope.controlFn.signCoords.y = POSITION.y < 1 ? 1 : POSITION.y;
                            $scope.controlFn.signCoords.x = POSITION.x < 1 ? 1 : POSITION.x;
                            $scope.controlFn.signCoords.pageNum = POSITION.pageNumber;

                            $scope.controlFn.signCoords.width = (fabricImg.width * fabricImg.scaleX);
                            $scope.controlFn.signCoords.height = (fabricImg.height * fabricImg.scaleY);
                            $scope.controlFn.signCoords.widthRelatedToPdfViewerScale = $scope.controlFn.signCoords.width / PDF_VIEWER_CURRENT_SCALE;
                            $scope.controlFn.signCoords.heightRelatedToPdfViewerScale = $scope.controlFn.signCoords.height / PDF_VIEWER_CURRENT_SCALE;

                            var underSignElement =   document.getElementById('underSign');
                            if(underSignElement){
                                underSignElement.style.top = ((fabricImg.top) + (fabricImg.height * fabricImg.scaleY)) + 'px';
                                underSignElement.style.left = (fabricImg.left) + 'px';
                                underSignElement.style.width = ($scope.controlFn.signCoords.width) + 'px';
                                
                                // scaled calculated size by pdfViewer currentScale
                                var maxFontSizeRelatedToPdfViewer = MAX_FONT_SIZE * PDF_VIEWER_CURRENT_SCALE;
                                var minFontSizeRelatedToPdfViewer = MIN_FONT_SIZE * PDF_VIEWER_CURRENT_SCALE;
                                var signFontSize = ($scope.controlFn.signCoords.width *6/100);
                                signFontSize = Math.floor(Math.min(signFontSize,maxFontSizeRelatedToPdfViewer));
                                signFontSize = Math.floor(Math.max(signFontSize,minFontSizeRelatedToPdfViewer));

                                var signFontSizeRelatedToPdfViewer = signFontSize /PDF_VIEWER_CURRENT_SCALE
                                
                                angular.forEach(document.querySelectorAll("#underSign span"),function(element){

                                    element.style.fontSize = signFontSize+'px';
                                });
                                $scope.controlFn.signFontSizeFloat = signFontSizeRelatedToPdfViewer;

                            }
                        }

                        fabric.Image.fromURL($scope.imageSrc, function(img) {
                            var scale = ((containerWidth/4) / img.width);
                            // init signiture
                            img.scale(scale).set({
                                left: containerWidth/2,
                                top: (containerHeight - 400),
                                angle: 0,
                            });

                            updateDimensionsBySingSize(img);
                            

                            canvas.add(img).setActiveObject(img);

                            
                            // handle event signiture
                            img.on('moved', function(options) {
                                updateDimensionsBySingSize(options.target);
                                
                            });

                            
                            img.on('scaled', function(options) {
                                updateDimensionsBySingSize(options.target)
                            });
                        });
                    }, 1);
                };

                var findePosition = function (top, left) {
                    var pageNumber = 1;
                    var y = 0;
                    var x = 0;
                    if(document.getElementById("viewer")) {
                        var pages = document.querySelector('#viewer');
                        var sumPageHeight = 0;
                        for(var i = 0; i < pages.children.length; i++) {
                            sumPageHeight = sumPageHeight + pages.children[i].offsetHeight;
                            if(sumPageHeight >= top){
                                pageNumber = (i + 1);
                                // calc position by percent
                                y = (((sumPageHeight - top) * 100) / pages.children[i].offsetHeight);
                                x = (left * 100) / pages.children[i].offsetWidth;
                                break;
                            }
                        }
                    }
                    return {
                        pageNumber: pageNumber,
                        y: y,
                        x: x,
                    };
                };

                if ($scope.controlFn.pdfUrl.indexOf("?") > 0) {
                    $scope.controlFn.pdfUrl = $scope.controlFn.pdfUrl + "&contentType=text/html";
                } else {
                    $scope.controlFn.pdfUrl = $scope.controlFn.pdfUrl + "?contentType=text/html";
                }
                vtPDFSrvc.setPDFUrl($scope.controlFn.pdfUrl);
                $timeout(function () {
                    webViewerLoad();
                    vtPDFSrvc.initVtPDF();
                }, 800);

                //************* signiture ***************//
                if ($scope.controlFn && $scope.controlFn.canSign) {
                    // $scope.callBackApi = function () {
                    //     setSigniture();
                    // };
                    // vtPDFSrvc.registerCB($scope.callBackApi);
                    $scope.imageSrc = "files/?mode=view&fcode=" + $rootScope.currentUserSignature.hash;

                    // check every 500mss for loading pdf element
                    var checkExist = setInterval(function() {
                        var element1 = document.getElementById('viewerContainer');
                        var element2 = document.getElementById('pageContainer1');
                        if (typeof(element1) != 'undefined' && element1 != null && typeof(element2) != 'undefined' && element2 != null) {
                            setSigniture();
                            clearInterval(checkExist);
                        }
                    }, 500);

                   
                }

                
            },
            link: function (scope, element, attrs, ctrls) {

            }
        };
    });

angular.module('vtPDFSignable').factory('vtPDFSrvc', function () {
    return {
        setPDFUrl: function (pdfUrl) {
            this.pdfUrl = pdfUrl;
        },
        getPDFUrl: function () {
            return this.pdfUrl;
        },
        registerCB: function (cb) {
            this.cb = cb;
        },
        PDFZoomIn: function () {
            this.cb('zoomIn');
        },
        PDFZoomOut: function () {
            this.cb('zoomOut');
        }
    }
});
