sap.ui.define(['jquery.sap.global',
    "sap/ui/model/json/JSONModel",
		'./../library',
		"sap/m/Input",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/layout/form/SimpleForm",
		"sap/ui/model/resource/ResourceModel",
    'sap/ui/core/Fragment'
	],
	function(jQuery, JSONModel,library, Input, Filter, FilterOperator, SimpleForm, ResourceModel, Fragment) {
		"use strict";

    const MODEL_ENTITY = "EntityModel";
    var oInputZnumero = Input.extend("custZnumeroNI.zNumeroNILibrary.controls.InputZnumero", {
			metadata: {
				library: "custZnumeroNI.zNumeroNILibrary",
				properties: {
					placeholder: {
						type: "string",
						defaultValue: ""
					},
          bukrs: { type: "string", defaultValue: "" },
          esercizio: { type: "string", defaultValue: "" },
          amministrazione: { type: "string", defaultValue: "" },
          ragioneria: { type: "string", defaultValue: "" },
          value: { type: "string", defaultValue: "" }, // progressivo ZID_NI 
          identificativo: { type: "string", defaultValue: "" },
          progressivoNI: { type: "string", defaultValue: "" },
          role: { type: "string", defaultValue: "" },
          fikrs:{ type: "string", defaultValue: "" },
          prctr:{ type: "string", defaultValue: "" },
          semanticObject:{type: "string", defaultValue: ""},
          key:{ type: "string", defaultValue:"" },
          showValueHelp:{ type:"string", defaultValue:"true" },
          maxLength:{ type:"string", defaultValue:"24" }
				},
				aggregations: {},
				events: {},
				renderer: {
					writeInnerAttributes: function(oRm, oInput) {
						sap.m.InputRenderer.writeInnerAttributes.apply(this, arguments);
					}
				}
			},

      init: function() {
        var self=this;
				// this.bRendering = false;
				Input.prototype.init.call(this);  
        self.attachValueHelpRequest(self._libOnShowDialog);  
        self.attachSubmit(self._libOnSubmitNumero);  
			},

      _libOnSubmitNumero:function(oEvent){
        var self =this;
        if(!self.getValue() || self.getValue() === null || self.getValue()===""){
          self.setValue(null);
          self.setKey(null);  
        }
      },

			renderer: function(oRm, oInput) {
				sap.m.InputRenderer.render(oRm, oInput);
			},

      onAfterRendering: function() {
        var self =this;
      },

      _libOnShowDialog:function(oEvent){
        var self =this;
        var oModelJson = new JSONModel({
          PanelFilterVisible:true,
          PanelContentVisible:false,
          Bukrs:self.getBukrs() && self.getBukrs() !=="" ? self.getBukrs() : null,
          Esercizio:self.getEsercizio() && self.getEsercizio() !=="" ? self.getEsercizio() : null,
          Amministrazione: self.getAmministrazione() && self.getAmministrazione() !=="" ? self.getAmministrazione() : null,
          Ragioneria:self.getRagioneria() && self.getRagioneria() !=="" ? self.getRagioneria() : null,
          Progressivo:self.getValue() && self.getValue() !=="" ? self.getValue() : null, 
          Identificativo:self.getIdentificativo() && self.getIdentificativo() !=="" ? self.getIdentificativo() : null,          
          ProgressivoNI: self.getProgressivoNI() && self.getProgressivoNI() !=="" ? self.getProgressivoNI() : null,

          Role: self.getRole() && self.getRole() !=="" ? self.getRole() : null,
          Fikrs: self.getFikrs() && self.getFikrs() !=="" ? self.getFikrs() : null,
          Prctr: self.getPrctr() && self.getPrctr() !=="" ? self.getPrctr() : null,


          Results:[]
        });

        self._libGetViewId(self,function(callback) {
          if(!self._libNumeroDialog){
            self._libNumeroDialog = Fragment.load({
              id: callback.Id,
              name: "custZnumeroNI.zNumeroNILibrary._libNumDialog",
              controller: self
            }).then(function(oDialog){
              return oDialog;
            }.bind(this));
          }  
          self._libNumeroDialog.then(function(oDialog){
            oDialog.setModel(oModelJson, MODEL_ENTITY);
            oDialog.open();
          });
        });
      },

      _libOnCloseNumeroDialog:function(oEvent){
        var self = this;
        self._libNumeroDialog.then(function(oDialog){
          oDialog.close();
          oDialog.destroy();
          self._libNumeroDialog=null;
        });
      },

      _libOnSearchNumeroDialog:function(oEvent){
        var self = this,
          filters = [],  
          entity = oEvent.getSource().getParent().getModel(MODEL_ENTITY),
          model = oEvent.getSource().getParent().getModel(MODEL_ENTITY).getData();

          self._globalModelHelperHelper = new sap.ui.model.odata.v2.ODataModel({
            // serviceUrl: "/sap/opu/odata/sap/ZS4_NOTEIMPUTAZIONI_SRV/"
            serviceUrl: "/sap/opu/odata/sap/ZSS4_MATCHCODE_SRV/"
          });

          if(model.Bukrs && model.Bukrs !== "")
            filters.push(new Filter({path: "Bukrs",operator: FilterOperator.EQ,value1: model.Bukrs}));

          if(model.Esercizio && model.Esercizio !== "")
            filters.push(new Filter({path: "Gjahr",operator: FilterOperator.EQ,value1: model.Esercizio}));  
          
          if(model.Amministrazione && model.Amministrazione !== "")
            filters.push(new Filter({path: "Zamministr",operator: FilterOperator.EQ,value1: model.Amministrazione}));  

          if(model.Ragioneria && model.Ragioneria !== "")
            filters.push(new Filter({path: "ZRagioCompe",operator: FilterOperator.EQ,value1: model.Ragioneria}));  

          if(model.Progressivo && model.Progressivo !== "")
            filters.push(new Filter({path: "ZidNi",operator: FilterOperator.EQ,value1: model.Progressivo}));
          
          if(model.Identificativo && model.Identificativo !== "")
            filters.push(new Filter({path: "ZidSubni",operator: FilterOperator.EQ,value1: model.Identificativo}));

          if(model.ProgressivoNI && model.ProgressivoNI !== "")
            filters.push(new Filter({path: "ZchiaveNi",operator: FilterOperator.EQ,value1: model.ProgressivoNI}));
          
          // console.log(self._globalModelHelperHelper);
          var oDataModel = self._globalModelHelperHelper;

          if(self._libNumeroDialog){
            self._libNumeroDialog.then(function(oDialog){
              
            oDialog.setBusy(true);
            self._globalModelHelperHelper.metadataLoaded().then(function() {
              oDataModel.read("/ZhfNotaimpSet" , {
                  filters: filters,   
                  urlParameters: { 
                    AuthorityRole: self.getRole(),
                    AuthorityFikrs: self.getFikrs(),
                    AuthorityPrctr: self.getPrctr(),
                    SemanticObject: self.getSemanticObject()
                  }, 
                  success: function(data, oResponse){
                    // console.log(data);
                    entity.setProperty("/Results",data.results);
                    entity.setProperty("/PanelFilterVisible",false);
                    entity.setProperty("/PanelContentVisible",true);
                    oDialog.setBusy(false);
                },
                error: function(error){
                  oDialog.setBusy(false);
                  console.log(error);
                }
              });
            });
          });
        }          
      },

      _libOnConfirmNumeroDialog:function(oEvent){
        var self =this;
        self._libGetViewId(self,function(callback) {
          var oView = callback.oView;
          var table = oView.byId("_libTableNumero");
          var selectedItem = table.getSelectedItem();
          
          if(selectedItem){
            var key = selectedItem.data("ZchiaveSubni");
            var text = selectedItem.data("ZchiaveSubni");
            self.setKey(key);  
            self.setValue(text);
          }
          else{
            self.setKey(null);  
            self.setValue(null);
          }
          
          if(self._libNumeroDialog){
            self._libNumeroDialog.then(function(oDialog){
              oDialog.close();
              oDialog.destroy();
              self._libNumeroDialog=null;
            });
          }
        });
      },

      _libOnBackNumeroDialog:function(oEvent){
        var self = this,
          entity = oEvent.getSource().getParent().getModel(MODEL_ENTITY);
        entity.setProperty("/Results",[]);
        entity.setProperty("/PanelFilterVisible",true);
        entity.setProperty("/PanelContentVisible",false);
      },

      _libGetViewId:function(context,callback){
        var self =this;
        while (context && context.getParent) {
          var oParentControl = context.getParent();
          if (oParentControl instanceof sap.ui.core.mvc.View) {
            var viewId = oParentControl.getId();
            var oView = sap.ui.getCore().byId(viewId);
            // console.log(oView);//TODO:da canc
            callback({Id : viewId, oView: oView});
            break;
          }
          context = oParentControl;
        }
      }
    });   

    return oInputZnumero;
  });