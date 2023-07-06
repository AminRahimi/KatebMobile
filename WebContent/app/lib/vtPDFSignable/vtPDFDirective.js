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

                    // $("#viewerContainer").prepend($compile(
                    //     "<style>.underSign{position: absolute; top: 35%; text-align: center;width: 900px;transform: translate(-50%, -50%);left: 50%;}</style>" +
                    //     "<style>.underSign span{text-shadow:0px 0px 1px #000;font-size: 20px;font-weight:bold;font-family:\"b nazanin\",\"2 nazanin\",\"B Nazanin\",\"2 Nazanin\";}</style>" +
                    //     "<style>.signText{font-size: 18px;font-weight:normal;font-family:\"b Yagut\",\"2 Yagut\",\"B Yagut\",\"2 Yagut\";}</style>" +
                    //     "<span id=\"imageToDrag\" class=\"draggable drag-drop\">" +
                    //     "<i class='fa fa-angle-down fa-5x' id='imageToDown' style='position: absolute; bottom: -70px; right: 50%; transform: translateX(50%); '></i>" +
                    //     "<i class='fa fa-angle-up fa-5x' id='imageToUp' style='position: absolute; top: -70px; right: 50%; transform: translateX(50%); '></i>" +
                    //     "<i class='fa fa-angle-right fa-5x' id='imageToRight' style='position: absolute; right: -70px; top: 50%; transform: translateY(-50%); '></i>" +
                    //     "<i class='fa fa-angle-left fa-5x' id='imageToLeft' style='position: absolute; left: -70px; top: 50%; transform: translateY(-50%); '></i>" +
                    //     "<img style='width: 100%;' src=\"{{imageSrc}}\">" +
                    //     "<div class='underSign' ng-show='signerInfo.conferment || signerInfo.user'><span ng-show='signerInfo.conferment'>&nbsp از طرف </span><span ng-bind='signerInfo.user'></span><br><span ng-bind='signerInfo.position'></span><br><span ng-bind='signerInfo.realUser' ng-show='signerInfo.conferment'></span></div>" +
                    //     "<div class=\"input-group \"><textarea type=\"text\" ng-show=\"signerInfo.reqParams.type != 'sign' \" class=\"form-control signText \" id=\"signText\" name=\"nowrap\" rows=\"2\" wrap=\"soft\" style=\"text-align:center;background:transparent;padding:0;width:200px;resize:none; white-space: pre;overflow-wrap: normal;\" placeholder=\" توضیحات ...\" ng-model=\"signText\"></textarea></div></span>")($scope));
                    //
                }

                // target elements with the "draggable" class
                // interact('.draggable').draggable({
                //     // enable inertial throwing
                //     inertia: true,
                //     // keep the element within the area of it's parent
                //     restrict: {
                //         restriction: "parent",
                //         endOnly: true,
                //         elementRect: {top: 0, left: 0, bottom: 1, right: 1}
                //     },
                //     // enable autoScroll
                //     autoScroll: false,
                //
                //     // call this function on every dragmove event
                //     onmove: dragMoveListener,
                //     // call this function on every dragend event
                //     onend: function (event) {
                //         var textEl = event.target.querySelector('p');
                //         textEl && (textEl.textContent =
                //             'moved a distance of '
                //             + (Math.sqrt(event.dx * event.dx +
                //             event.dy * event.dy) | 0) + 'px');
                //     }
                // });

                //function dragMoveListener(event, default_x, default_y) {
                    // var x, y, target;
                    // if(event) {
                    //     event.stopPropagation();
                    //     event.preventDefault();
                    //     target = event.target;
                    //     // keep the dragged position in the data-x/data-y attributes
                    //     x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    //     y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                    // } else {
                    //     target = document.getElementById('imageToDrag');
                    //     x = default_x;
                    //     y = default_y;
                    // }
                    //
                    // // translate the element
                    // target.style.setProperty('transform', 'translate(' + x + 'px, ' + y + 'px)');
                    // target.style.setProperty('-moz-transform ', 'translate(' + x + 'px, ' + y + 'px)');
                    // target.style.setProperty('-ms-transform', 'translate(' + x + 'px, ' + y + 'px)');
                    // target.style.setProperty('-o-transform', 'translate(' + x + 'px, ' + y + 'px)');
                    // signitureCorrds.x = Math.abs(x);
                    // signitureCorrds.y = Math.abs(y);
                    // signitureCorrds.x = parseInt(signitureCorrds.x.toFixed());
                    // signitureCorrds.y = parseInt(signitureCorrds.y.toFixed());

                    // update the posiion attributes
                    // target.setAttribute('data-x', x);
                    // target.setAttribute('data-y', y);
                //}

                // this is used later in the resizing and gesture demos
                //window.dragMoveListener = dragMoveListener;

                /* The dragging code for '.draggable' from the demo above
                 * applies to this demo as well so it doesn't have to be repeated. */

                // enable draggables to be dropped into this
                // interact('.page').dropzone({
                //     // only accept elements matching this CSS selector
                //     accept: '#imageToDrag',
                //     // Require a 75% element overlap for a drop to be possible
                //     overlap: 0.75,
                //
                //     // listen for drop related events:
                //
                //     ondropactivate: function (event) {
                //         // add active dropzone feedback
                //         event.target.classList.add('drop-active');
                //     },
                //     ondragenter: function (event) {
                //         var draggableElement = event.relatedTarget,
                //             dropzoneElement = event.target;
                //
                //         // feedback the possibility of a drop
                //         dropzoneElement.classList.add('drop-target');
                //         event.target.classList.remove('imageToDragDrop');
                //         draggableElement.classList.add('can-drop');
                //         // draggableElement.textContent = 'تعیین امضا';
                //     },
                //     ondragleave: function (event) {
                //         // remove the drop feedback style
                //         event.target.classList.remove('drop-target');
                //         event.target.classList.remove('imageToDragDrop');
                //         event.relatedTarget.classList.remove('can-drop');
                //         // event.relatedTarget.textContent = 'خارج از محدوده امضا';
                //     },
                //     ondrop: function (event) {
                //         var draggableElement = event.relatedTarget,
                //             dropzoneElement = event.target;
                //         // feedback the possibility of a drop
                //         var signitureSize = $("#imageToDrag").width();
                //         var signitureSizeDiv2 = signitureSize / 2;
                //         dropzoneElement.classList.add('imageToDragDrop');
                //         // event.relatedTarget.textContent = 'امضا شد';
                //         var page = $(event.target)[0];
                //         var allPagesHeight = parseInt($(event.target).parent().outerHeight());
                //         pageNum = page.id.replace('pageContainer', '');
                //         selectedPage.width = parseInt(page.style.width);
                //         selectedPage.height = parseInt(page.style.height);
                //         var parent = $($element)[0];
                //         container.width = parseInt(parent.style.width);
                //         container.height = parseInt(parent.style.height);
                //         signCoord.x = ((signitureCorrds.x - ((container.width - selectedPage.width) / 2)) + signitureSizeDiv2).toFixed();
                //         signCoord.y = (Math.abs(allPagesHeight - ((pageNum - 1) * selectedPage.height) - signitureCorrds.y - signitureSizeDiv2)).toFixed();
                //         signCoord.x = ((parseInt(signCoord.x) * 100) / selectedPage.width).toFixed();
                //         signCoord.y = ((parseInt(signCoord.y) * 100) / selectedPage.height).toFixed();
                //         //signCoord.y = ((parseInt(selectedPage.height - signCoord.y - (signitureSizeDiv2 / 2)) * 100) / selectedPage.height).toFixed();
                //         signCoord.pageNum = pageNum;
                //         $scope.controlFn.signCoords = signCoord;
                //     },
                //     ondropdeactivate: function (event) {
                //         // remove active dropzone feedback
                //         event.target.classList.remove('drop-active');
                //         event.target.classList.remove('drop-target');
                //     }
                // });

                // document.getElementById('imageToDown').onclick = function (event) {
                //     event.stopPropagation();
                //     event.preventDefault();
                //     var target = document.getElementById('imageToDrag'),
                //         // keep the dragged position in the data-x/data-y attributes
                //         x = (parseFloat(target.getAttribute('data-x')) || 0),
                //         y = (parseFloat(target.getAttribute('data-y')) || 0) + 50;
                //
                //     // translate the element
                //     target.style.setProperty('transform', 'translate(' + x + 'px, ' + y + 'px)');
                //     target.style.setProperty('-moz-transform ', 'translate(' + x + 'px, ' + y + 'px)');
                //     target.style.setProperty('-ms-transform', 'translate(' + x + 'px, ' + y + 'px)');
                //     target.style.setProperty('-o-transform', 'translate(' + x + 'px, ' + y + 'px)');
                //     signitureCorrds.x = Math.abs(x);
                //     signitureCorrds.y = Math.abs(y);
                //     signitureCorrds.x = parseInt(signitureCorrds.x.toFixed());
                //     signitureCorrds.y = parseInt(signitureCorrds.y.toFixed());
                //
                //     // update the posiion attributes
                //     target.setAttribute('data-x', x);
                //     target.setAttribute('data-y', y);
                // };
                // document.getElementById('imageToUp').onclick = function (event) {
                //     event.stopPropagation();
                //     event.preventDefault();
                //     var target = document.getElementById('imageToDrag'),
                //         // keep the dragged position in the data-x/data-y attributes
                //         x = (parseFloat(target.getAttribute('data-x')) || 0),
                //         y = (parseFloat(target.getAttribute('data-y')) || 0) - 50;
                //
                //     // translate the element
                //     target.style.setProperty('transform', 'translate(' + x + 'px, ' + y + 'px)');
                //     target.style.setProperty('-moz-transform ', 'translate(' + x + 'px, ' + y + 'px)');
                //     target.style.setProperty('-ms-transform', 'translate(' + x + 'px, ' + y + 'px)');
                //     target.style.setProperty('-o-transform', 'translate(' + x + 'px, ' + y + 'px)');
                //     signitureCorrds.x = Math.abs(x);
                //     signitureCorrds.y = Math.abs(y);
                //     signitureCorrds.x = parseInt(signitureCorrds.x.toFixed());
                //     signitureCorrds.y = parseInt(signitureCorrds.y.toFixed());
                //
                //     // update the posiion attributes
                //     target.setAttribute('data-x', x);
                //     target.setAttribute('data-y', y);
                // };
                // document.getElementById('imageToRight').onclick = function (event) {
                //     event.stopPropagation();
                //     event.preventDefault();
                //     var target = document.getElementById('imageToDrag'),
                //         // keep the dragged position in the data-x/data-y attributes
                //         x = (parseFloat(target.getAttribute('data-x')) || 0) + 50,
                //         y = (parseFloat(target.getAttribute('data-y')) || 0);
                //
                //     // translate the element
                //     target.style.setProperty('transform', 'translate(' + x + 'px, ' + y + 'px)');
                //     target.style.setProperty('-moz-transform ', 'translate(' + x + 'px, ' + y + 'px)');
                //     target.style.setProperty('-ms-transform', 'translate(' + x + 'px, ' + y + 'px)');
                //     target.style.setProperty('-o-transform', 'translate(' + x + 'px, ' + y + 'px)');
                //     signitureCorrds.x = Math.abs(x);
                //     signitureCorrds.y = Math.abs(y);
                //     signitureCorrds.x = parseInt(signitureCorrds.x.toFixed());
                //     signitureCorrds.y = parseInt(signitureCorrds.y.toFixed());
                //
                //     // update the posiion attributes
                //     target.setAttribute('data-x', x);
                //     target.setAttribute('data-y', y);
                // };
                // document.getElementById('imageToLeft').onclick = function (event) {
                //     event.stopPropagation();
                //     event.preventDefault();
                //     var target = document.getElementById('imageToDrag'),
                //         // keep the dragged position in the data-x/data-y attributes
                //         x = (parseFloat(target.getAttribute('data-x')) || 0) - 50,
                //         y = (parseFloat(target.getAttribute('data-y')) || 0);
                //
                //     // translate the element
                //     target.style.setProperty('transform', 'translate(' + x + 'px, ' + y + 'px)');
                //     target.style.setProperty('-moz-transform ', 'translate(' + x + 'px, ' + y + 'px)');
                //     target.style.setProperty('-ms-transform', 'translate(' + x + 'px, ' + y + 'px)');
                //     target.style.setProperty('-o-transform', 'translate(' + x + 'px, ' + y + 'px)');
                //     signitureCorrds.x = Math.abs(x);
                //     signitureCorrds.y = Math.abs(y);
                //     signitureCorrds.x = parseInt(signitureCorrds.x.toFixed());
                //     signitureCorrds.y = parseInt(signitureCorrds.y.toFixed());
                //
                //     // update the posiion attributes
                //     target.setAttribute('data-x', x);
                //     target.setAttribute('data-y', y);
                // };

                //dragMoveListener(null,150, -150);
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
