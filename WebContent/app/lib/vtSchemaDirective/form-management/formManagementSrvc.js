angular.module('schemaForm').factory('formManagementSrvc', [ 'Restangular', '$modal', function(restangularService, $modal) {
	var registerComponent = [ {
		type : 'string',
		typePersianName : "متن",
		widgets : [ {
			widget : "textBox",
			persianName : "متن یک خطی",
			multiple : false,
			isHidden : false,
			picPath : "app/lib/vtSchemaDirective/img/component_pics/textBox.png",
			htmlPath : "app/lib/vtSchemaDirective/schema-form-template/stringtextBox.html"
		}, {
			widget : "textBox",
			persianName : "متن چند تایی",
			multiple : true,
			isHidden : true,
			picPath : "app/lib/vtSchemaDirective/img/component_pics/textBox.png",
			htmlPath : "app/lib/vtSchemaDirective/schema-form-template/stringtextBoxmultiple.html"
		}, {
			widget : "textarea",
			persianName : "متن چند خطی",
			multiple : false,
			isHidden : false,
			picPath : "app/lib/vtSchemaDirective/img/component_pics/textarea.png",
			htmlPath : "app/lib/vtSchemaDirective/schema-form-template/stringtextarea.html"
		}, {
			widget : "textarea",
			persianName : "متن چند خطی چندتایی",
			multiple : true,
			isHidden : true,
			picPath : "app/lib/vtSchemaDirective/img/component_pics/textarea.png",
			htmlPath : "app/lib/vtSchemaDirective/schema-form-template/stringtextareamultiple.html"
		}, {
			widget : "bigText",
			persianName : "متن بزرگ",
			multiple : false,
			isHidden : false,
			picPath : "app/lib/vtSchemaDirective/img/component_pics/bigText.png",
			htmlPath : "app/lib/vtSchemaDirective/schema-form-template/stringbigText.html"
		}, {
			widget : "",
			persianName : "پیش فرض",
			multiple : false,
			isHidden : true,
			picPath : "",
			htmlPath : "app/lib/vtSchemaDirective/schema-form-template/stringtextBox.html"
		/*
		 * htmlPath :
		 * "app/lib/vtSchemaDirective/schema-form-template/stringtextBoxmultiple.html"
		 */
		} ]
	}, {
		type : 'integer',
		typePersianName : "عدد",
		widgets : [ {
			widget : "",
			persianName : "عدد",
			multiple : false,
			isHidden : false,
			picPath : "app/lib/vtSchemaDirective/img/component_pics/integer.png",
			htmlPath : "app/lib/vtSchemaDirective/schema-form-template/integerintBox.html",
			typeParamsSchema : {
				"title" : "",
				"properties" : {
					"min" : {
						"label" : "کمترین",
						"type" : "integer",
						"widget" : "",
						"multiple" : false,
						"enumType" : "",
						"showEditButton" : false
					},
					"max" : {
						"label" : "بیشترین",
						"type" : "integer",
						"widget" : "",
						"multiple" : false,
						"enumType" : "",
						"showEditButton" : false
					}
				},
				"viewGroups" : [ {
					"id" : "aa",
					"name" : "اا",
					"members" : [ "min" ,"max"]
				} ]
			}
		} ]
	}, {
		type : 'double',
		typePersianName : "عدد",
		widgets : [ {
			widget : "",
			persianName : "عدد",
			multiple : false,
			isHidden : false,
			picPath : "app/lib/vtSchemaDirective/img/component_pics/integer.png",
			htmlPath : "app/lib/vtSchemaDirective/schema-form-template/doubleBox.html"
		} ]
	}, {
		type : 'file',
		typePersianName : "فایل",
		widgets : [ {
			widget : "",
			persianName : "انتخابگر فایل",
			multiple : false,
			isHidden : false,
			picPath : "app/lib/vtSchemaDirective/img/component_pics/file.png",
			htmlPath : "app/lib/vtSchemaDirective/schema-form-template/filefileSelector.html"
		},{
			widget : "fileSelector",
			persianName : "انتخابگر فایل",
			multiple : false,
			isHidden : true,
			picPath : "app/lib/vtSchemaDirective/img/component_pics/file.png",
			htmlPath : "app/lib/vtSchemaDirective/schema-form-template/filefileSelector.html"
		},{
			widget : "fileSelector",
			persianName : "انتخابگر فایل چندتایی",
			multiple : true,
			isHidden : true,
			picPath : "app/lib/vtSchemaDirective/img/component_pics/file.png",
			htmlPath : "app/lib/vtSchemaDirective/schema-form-template/filefileSelectormultiple.html"
		}, {
			widget : "imageSelector",
			persianName : "انتخابگر تصویر",
			multiple : false,
			isHidden : true,
			picPath : "app/lib/vtSchemaDirective/img/component_pics/file.png",
			htmlPath : "app/lib/vtSchemaDirective/schema-form-template/fileimageSelector.html"
		} ]
	}, {
		type : 'attachment',
		typePersianName : "ضمیمه فایل",
		widgets : [ {
			widget : "attachFile",
			persianName : "ضمیمه",
			multiple : true,
			isHidden : false,
			picPath : "app/lib/vtSchemaDirective/img/component_pics/attach.png",
			htmlPath : "app/lib/vtSchemaDirective/schema-form-template/attachmentattachFilemultiple.html"
		}, {
			widget : "attachFile",
			persianName : "ضمیمه",
			multiple : false,
			isHidden : true,
			picPath : "app/lib/vtSchemaDirective/img/component_pics/attach.png",
			htmlPath : "app/lib/vtSchemaDirective/schema-form-template/attachmentattachFile.html"
		}, {
			widget : "",
			persianName : "پیش فرض",
			multiple : false,
			isHidden : true,
			picPath : "",
			htmlPath : "app/lib/vtSchemaDirective/schema-form-template/attachmentattachFile.html"
		} ]
	}, {
		type : 'enum',
		typePersianName : "انتخابگر پایه",
		widgets : [ {
			widget : "",
			persianName : "لیست کشویی",
			multiple : false,
			isHidden : false,
			picPath : "app/lib/vtSchemaDirective/img/component_pics/enum.png",
			htmlPath : "app/lib/vtSchemaDirective/schema-form-template/enumoptionSelector.html"
		}, {
			widget : "",
			persianName : "لیست کشویی",
			multiple : true,
			isHidden : true,
			picPath : "app/lib/vtSchemaDirective/img/component_pics/enum.png",
			htmlPath : "app/lib/vtSchemaDirective/schema-form-template/enumoptionSelectormultiple.html"
		} ]
	}, {
		type : 'inner_enum',
		typePersianName : "انتخابگر پایه",
		widgets : [ {
			widget : "",
			persianName : "لیست کشویی",
			multiple : false,
			isHidden : false,
			picPath : "app/lib/vtSchemaDirective/img/component_pics/enum.png",
			htmlPath : "app/lib/vtSchemaDirective/schema-form-template/enumoptionSelectorInnerEnum.html"
		} ]
	}, {
		type : 'date',
		typePersianName : "تاریخ",
		widgets : [ {
			widget : "jalali",
			persianName : "تاریخ شمسی",
			multiple : false,
			isHidden : false,
			picPath : "app/lib/vtSchemaDirective/img/component_pics/datePicker.png",
			htmlPath : "app/lib/vtSchemaDirective/schema-form-template/datejalali.html"
		}, {
			widget : "gregorian",
			persianName : "تاریخ میلادی",
			multiple : false,
			isHidden : false,
			picPath : "app/lib/vtSchemaDirective/img/component_pics/datePicker.png",
			htmlPath : "app/lib/vtSchemaDirective/schema-form-template/dategregorian.html"
		} ]
	}, {
		type : 'tag',
		typePersianName : "برچسب",
		widgets : [ {
			widget : "",
			picName : "textBox",
			persianName : "برچسب یک خطی",
			multiple : true,
			isHidden : false,
			picPath : "app/lib/vtSchemaDirective/img/component_pics/tag.png",
			htmlPath : "app/lib/vtSchemaDirective/schema-form-template/tagtextBoxmultiple.html"
		} ]
	}, {
		type : 'entitySelector',
		typePersianName : "انتخابگر موجودیت",
		widgets : [ {
			widget : "popupSelector",
			picName : "",
			persianName : "انتخابگر موجودیت",
			multiple : false,
			isHidden : false,
			picPath : "app/lib/vtSchemaDirective/img/component_pics/entitySelector.png",
			htmlPath : "app/lib/vtSchemaDirective/schema-form-template/popupSelector.html"
		}, {
			widget : "popupSelector",
			picName : "",
			persianName : "انتخابگر موجودیت چندتایی",
			multiple : true,
			isHidden : true,
			picPath : "app/lib/vtSchemaDirective/img/component_pics/entitySelector.png",
			htmlPath : "app/lib/vtSchemaDirective/schema-form-template/popupSelectormultiple.html"
		}, {
			widget : "tableSelector",
			picName : "",
			persianName : "جدولی",
			multiple : true,
			isHidden : false,
			picPath : "app/lib/vtSchemaDirective/img/component_pics/entitySelector.png",
			htmlPath : "app/lib/vtSchemaDirective/schema-form-template/tableSelectormultiple.html"
		}]
	}, {
		type : 'boolean',
		typePersianName : "بله/خیر",
		widgets : [ {
			widget : "",
			picName : "boolean",
			persianName : "بله/خیر",
			multiple : false,
			isHidden : false,
			picPath : "app/lib/vtSchemaDirective/img/component_pics/boolean.png",
			htmlPath : "app/lib/vtSchemaDirective/schema-form-template/boolean.html"
		} ]
	},{
		type : 'relation',
		typePersianName : "ارتباط",
		widgets : [ {
			widget : "",
			picName : "relation",
			persianName : "ارتباط",
			multiple : true,
			isHidden : false,
			picPath : "app/lib/vtSchemaDirective/img/component_pics/relation.png",
			htmlPath : "app/lib/vtSchemaDirective/schema-form-template/relationmultiple.html"
		} ]
	}, {
		type : 'html',
		typePersianName : "محتوای استاتیک",
		widgets : [ {
			widget : "",
			picName : "html",
			persianName : "html",
			isStatic : true,
			multiple : false,
			isHidden : false,
			picPath : "app/lib/vtSchemaDirective/img/component_pics/html.png",
			htmlPath : "app/lib/vtSchemaDirective/schema-form-template/html.html",
			widgetParamSchema : {
				"title" : "",
				"properties" : {
					"html" : {
						"label" : "محتویات",
						"type" : "string",
						"widget" : "textBox",
						"multiple" : false,
						"enumType" : "",
						"showEditButton" : false
					}
				},
				"viewGroups" : [ {
					"id" : "aa",
					"name" : "اا",
					"members" : [ "html" ]
				} ]
			}
		} ]
	} ];
	return {
		onOpenFormViewPopup : function(schema) {
			$modal.open({
				template : function() {
					var strVar = "";
					strVar += "<div class=\"modal-header\">";
					strVar += "   <h3 class=\"modal-title\">پیش‌نمایش فرم<\/h3>";
					strVar += "<\/div>";
					strVar += "<div class=\"modal-body  haveFormRows clearfix\">";
					strVar += "   <div class=\"col-md-12 row\">";
					strVar += "      <form name=\"example\" class=\"form-horizontal\" role=\"form\">";
					strVar += "         <schema-form-fields ng-init=\"isEditMode=true\"  is-edit-mode=\"isEditMode\"  api=\"schemaFormViewModalApi\" ";
					strVar += "            schema=\"jsonSchema\" model=\"model\" is-col-7=\"isCol7\" simple-view=\"true\"><\/schema-form-fields>";
					strVar += "      <\/form>";
					strVar += "   <\/div>";
					strVar += "<\/div>";
					strVar += "<div class=\"modal-footer\">";
					strVar += "   <button class=\"btn btn-sm btn-sm btn-success\" ng-show=\"isEditMode\" ng-click=\"isEditMode=false;\">حالت عادی<\/button>";
					strVar += "   <button class=\"btn btn-sm btn-sm btn-success\" ng-hide=\"isEditMode\" ng-click=\"isEditMode='true';\">حالت ویرایش<\/button>";
					strVar += "   <button class=\"btn btn-sm btn-sm btn-warning pull-left\" ng-click=\"onReturnClick()\">بازگشت<\/button>";
					strVar += "<\/div>";
					strVar += "";
					return strVar;
				}(),
				controller : 'formViewCtrl',
				size : 'lg',
				resolve : {
					jsonSchema : function() {
						return schema;
					}
				}
			});
		},
		setComponent : function(_registerComponent) {
			var index = -1;
			for (var int = 0; int < registerComponent.length; int++) {
				if (registerComponent[int].type == _registerComponent.type) {

					index = int;
					break;
				}
			}
			if (index != -1) {
				for (var int2 = 0; int2 < _registerComponent.widgets.length; int2++) {
					var findWidget = _.find(registerComponent[index].widgets, function(_widget) {
						return _widget.widget == _registerComponent.widgets[int2].widget
					});
					if (!findWidget) {
						registerComponent[index].widgets.push(_registerComponent.widgets[int2]);
					}
				}
			} else {
				registerComponent.push(_registerComponent);
			}
		},
		getComponent : function() {
			return registerComponent;
		},
		getHtmlPath : function(type, widget, schema) {
			if (widget == "popupSelector" || widget == "tableSelector") {
				type = "entitySelector"
			}

			var path = "app/lib/vtSchemaDirective/schema-form-template/default.html";
			if (type == "date" && !!!widget) {
				path = "app/lib/vtSchemaDirective/schema-form-template/datejalali.html";
				return path;
			}
			for (var int = 0; int < registerComponent.length; int++) {
				if (registerComponent[int].type == type) {
					if (widget) {
						var foundWidget = _.find(registerComponent[int].widgets, function(_widget) {
							return (_widget.multiple == !!schema.multiple && _widget.widget == widget)
						});
						if (foundWidget) {
							path = foundWidget.htmlPath;
						}
						// for (var int2 = 0; int2 <
						// registerComponent[int].widgets.length; int2++) {
						// if (registerComponent[int].widgets[int2].widget ==
						// widget) {
						// path = registerComponent[int].widgets[int2].htmlPath;
						// }
						// }
					} else {
						var foundWidget = _.find(registerComponent[int].widgets, function(_widget) {
							return _widget.multiple == !!schema.multiple
						});
						if (foundWidget) {
							path = foundWidget.htmlPath;
						} else {
							for (var int2 = 0; int2 < registerComponent[int].widgets.length; int2++) {
								if (registerComponent[int].widgets[int2].widget == "") {
									path = registerComponent[int].widgets[int2].htmlPath;
								}
							}
						}

					}
					break;
				}
			}
            return path;
		},
		
		getDerichData: function(form, schema){
			var newForm = angular.copy(form);
			angular.forEach(schema.properties, function(value, key) {
				if(value.widget == 'popupSelector' && form[key]){
					if(value.multiple){
						newForm[key] = [];
						angular.forEach(form[key], function(obj){
							newForm[key].push(obj._uid);
						});
					}else{
						newForm[key] = form[key]._uid;
					}
				}
				if(value.type == 'date' && form[key]){
					newForm[key] = form[key].getTime();
				}
				if(value.type == 'file' && form[key]){
					if(value.multiple){
						newForm[key] = [];
						angular.forEach(form[key], function(obj){
							newForm[key].push(obj.hash);
						});
					}else{
						newForm[key] = form[key].hash;
					}
				}
			});
			return newForm;
		}
	};
} ]);