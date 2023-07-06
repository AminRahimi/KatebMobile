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
                        

                        var canvas = new fabric.Canvas('fabric-canvas', {
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

                        fabric.Image.fromURL($scope.imageSrc, function(img) {
                            var scale = (200 / img.width);
                            // init signiture
                            img.scale(scale).set({
                                left: 300,
                                top: (containerHeight - 400),
                                angle: 0,
                            });
                            var position = findePosition((img.top) + (img.height * img.scaleY), img.left);
                            $scope.controlFn.signCoords.y = position.y;
                            $scope.controlFn.signCoords.x = position.x;
                            $scope.controlFn.signCoords.pageNum = position.pageNumber;
                            $scope.controlFn.signCoords.width = (img.width * img.scaleX);
                            $scope.controlFn.signCoords.height = (img.height * img.scaleY);
                            //$scope.controlFn.signCoords.rotate = Math.round(img.angle);

                            canvas.add(img).setActiveObject(img);

                            // init under signiture
                            if(document.getElementById('underSign')){
                                document.getElementById('underSign').style.top = ((img.top) + (img.height * img.scaleY)) + 'px';
                                document.getElementById('underSign').style.left = (img.left) + 'px';
                                document.getElementById('underSign').style.width = (img.width * img.scaleX) + 'px';
                            }

                            // handle event signiture
                            img.on('moved', function(options) {
                                var position = findePosition((options.target.top) + (options.target.height * options.target.scaleY), options.target.left);
                                $scope.controlFn.signCoords.y = position.y < 1 ? 1 : position.y;
                                $scope.controlFn.signCoords.x = position.x < 1 ? 1 : position.x;
                                $scope.controlFn.signCoords.pageNum = position.pageNumber;
                                if(document.getElementById('underSign')){
                                    document.getElementById('underSign').style.top = ((options.target.top) + (options.target.height * options.target.scaleY)) + 'px';
                                    document.getElementById('underSign').style.left = (options.target.left) + 'px';
                                    document.getElementById('underSign').style.width = (options.target.width * options.target.scaleX) + 'px';
                                }
                            });
                            img.on('scaled', function(options) {
                                var position = findePosition((options.target.top) + (options.target.height * options.target.scaleY), options.target.left);
                                $scope.controlFn.signCoords.y = position.y < 1 ? 1 : position.y;
                                $scope.controlFn.signCoords.x = position.x < 1 ? 1 : position.x;
                                $scope.controlFn.signCoords.pageNum = position.pageNumber;
                                $scope.controlFn.signCoords.width = (options.target.width * options.target.scaleX);
                                $scope.controlFn.signCoords.height = (options.target.height * options.target.scaleY);
                                var underSignElement =   document.getElementById('underSign');
                                if(underSignElement){
                                    underSignElement.style.top = ((options.target.top) + (options.target.height * options.target.scaleY)) + 'px';
                                    underSignElement.style.left = (options.target.left) + 'px';
                                    underSignElement.style.width = (options.target.width * options.target.scaleX) + 'px';
                                    //resize font size relative to the sign size
                                    //max font size
                                    var signFontSize = Math.floor(Math.min($scope.controlFn.signCoords.width *6/100,MAX_FONT_SIZE));
                                    //min font size
                                    signFontSize = Math.floor(Math.max(signFontSize,MIN_FONT_SIZE));
                                    angular.forEach(document.querySelectorAll("#underSign span"),function(element){

                                        element.style.fontSize = $scope.controlFn.signFontSize = signFontSize+'px';
                                        $scope.controlFn.signFontSizeFloat = signFontSize;
                                    });
                                    // if(document.querySelector("#underSign .underSign-paraph")){
                                    //
                                    //     document.querySelector("#underSign .underSign-paraph").style.fontSize = signFontSize +'px';
                                    // }

                                }
                            });
                            // img.on('rotated', function(options) {
                            //     $scope.controlFn.signCoords.rotate = Math.round(options.target.angle);
                            // });
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
