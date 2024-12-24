sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    'sap/m/SearchField',
    "sap/m/Token",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
],
    function (Controller, UIComponent, Fragment, JSONModel, MessageBox, SearchField, Token, FilterOperator, Filter) {
        "use strict";

        return Controller.extend("zsalesprint.controller.FirstScreen", {
            onInit: function () {
                this.getView().byId("idNavContainer").to(this.getView().byId("idHomePage"));
                var fnValidator = function (args) {
                    var text = args.text;
                    return new Token({ key: text, text: text });
                };
                this.getView().byId("idSalesOrderMultiInput").addValidator(fnValidator);
                var fnValidator1 = function (args) {
                    var text = args.text;
                    return new Token({ key: text, text: text });
                };
                this.getView().byId("idDeliveryNumberMultiInput").addValidator(fnValidator1);
                var fnValidator2 = function (args) {
                    var text = args.text;
                    return new Token({ key: text, text: text });
                };
                this.getView().byId("idBillingDocumentMultiInput").addValidator(fnValidator2);
                var fnValidator3 = function (args) {
                    var text = args.text;
                    return new Token({ key: text, text: text });
                };
                this.getView().byId("idSalesReturnBillingDocumentMultiInput").addValidator(fnValidator3);
                var fnValidator4 = function (args) {
                    var text = args.text;
                    return new Token({ key: text, text: text });
                };
                this.getView().byId("id1200BillingDocumentMultiInput").addValidator(fnValidator4);
            },
            onSalesOrgnisationComboBoxChange: function () {
                if (this.getView().byId("idSalesOrgnisationComboBox").getValue() == "1100") {
                    this.getView().byId("idStorageLocationComboBox").setVisible(true);
                } else {
                    this.getView().byId("idStorageLocationComboBox").setVisible(false);
                }
            },

            onNextButtonPress: function (oEvent) {
                var that = this;
                var SalesOrgnisation = that.getView().byId("idSalesOrgnisationComboBox").getValue();
                var StorageLocation = [];
                that.getView().byId("idStorageLocationComboBox").getSelectedItems().map(function (item) {
                    StorageLocation.push(item.getText());
                })
                if (SalesOrgnisation == "1200") {
                    that.getView().byId("idSecondPageSecondSimpleForm").setVisible(true);
                    that.getView().byId("idSecondPageFirstSimpleForm").setVisible(false);
                    that.getView().byId("idSecondPage").setTitle("1200 Sale Organisations Prints");
                    that.getView().byId("idNavContainer").to(that.getView().byId("idSecondPage"), "flip");
                }
                else if (SalesOrgnisation == "1100" && StorageLocation.length != 0) {
                    that.getView().byId("idSecondPageSecondSimpleForm").setVisible(false);
                    that.getView().byId("idSecondPageFirstSimpleForm").setVisible(true);
                    that.getView().byId("idSecondPage").setTitle("1100 Sales Organisation Prints With " + (StorageLocation).toString() + " Location");
                    that.getView().byId("idNavContainer").to(that.getView().byId("idSecondPage"), "flip");
                }
                else {
                    if (SalesOrgnisation == "" && StorageLocation.length != 0) { sap.m.MessageBox.error("Please Select Sales Organisation First!!!"); }
                    else if (SalesOrgnisation != "" && StorageLocation.length == 0) { sap.m.MessageBox.error("Please Select Storage Location First!!!"); }
                    else if (SalesOrgnisation == "" && StorageLocation.length == 0) { sap.m.MessageBox.error("Please Select Sales Organisation and Storage Location First!!!"); }
                }
            },
            onBackButtonPress: function () {
                this.getView().byId("idNavContainer").to(this.getView().byId("idHomePage"));
            },
            onBackButtonforThirdPagePress: function () {
                this.getView().byId("idNavContainer").to(this.getView().byId("idSecondPage"));
            },
            onNextThirdButtonPress: function () {
                var that = this;
                that.getView().byId("idNavContainer").to(that.getView().byId("idThirdPage"), "flip");
                var SalesOrgnisation = that.getView().byId("idSalesOrgnisationComboBox").getValue();
                that.getView().byId("idThirdPageFirstSimpleForm").setVisible(false);
                that.getView().byId("idThirdPageSecondSimpleForm").setVisible(false);
                that.getView().byId("idThirdPageThirdSimpleForm").setVisible(false);
                that.getView().byId("idThirdPageForthSimpleForm").setVisible(false);
                that.getView().byId("idThirdPageFifthSimpleForm").setVisible(false);
                var PrintName = this.getView().byId("id1100RadioButtonGroup").getSelectedButton().getText();
                if (SalesOrgnisation == "1100") {
                    if (PrintName == "Sale Order Print") { that.getView().byId("idThirdPageFirstSimpleForm").setVisible(true); }
                    else if (PrintName == "Delivery Print") { that.getView().byId("idThirdPageSecondSimpleForm").setVisible(true); }
                    else if (PrintName == "Sales Return Print") { that.getView().byId("idThirdPageForthSimpleForm").setVisible(true); }
                    else if (PrintName == "Billing Document Print" || PrintName == "BOX Sticker Print" || PrintName == "Intra Billing Document Print") { that.getView().byId("idThirdPageThirdSimpleForm").setVisible(true); }
                    that.getView().byId("idThirdPage").setTitle("1100 - " + PrintName);

                }
                else if (SalesOrgnisation == "1200") {
                    var PrintName = this.getView().byId("id1200RadioButtonGroup").getSelectedButton().getText();
                    if (PrintName == "Billing Document Print") { that.getView().byId("idThirdPageFifthSimpleForm").setVisible(true); };
                    that.getView().byId("idThirdPage").setTitle("1200 - " + PrintName);
                }

            },


            onPrintButtonPress: function (oEvent) {
                var that = this,
                    SalesOrgnisation = that.getView().byId("idSalesOrgnisationComboBox").getValue(),
                    oBusy = new sap.m.BusyDialog({ title: "Loading", text: "Please wait" }),
                    FromDate = this.getView().byId("idFromSalesOrderDatePicker").getValue(),
                    ToDate = this.getView().byId("idTOSalesOrderDatePicker").getValue(),
                    FromSalesOrder = this.getView().byId("idFromSalesOrderInput").getValue(),
                    TOSalesOrder = this.getView().byId("idTOSalesOrderInput").getValue(),
                    url = "",
                    FromDeliveryNumber = this.getView().byId("idFromDeliveryNumberInput").getValue(),
                    TODeliveryNumber = this.getView().byId("idTODeliveryNumberInput").getValue(),
                    FromDeliveryDate = this.getView().byId("idFromDeliveryDatePicker").getValue(),
                    TODeliveryDate = this.getView().byId("idTODeliveryDatePicker").getValue(),

                    FromBillingDocument = this.getView().byId("idFromBillingDocumentInput").getValue(),
                    TOBillingDocument = this.getView().byId("idTOBillingDocumentInput").getValue(),
                    FromBillingDocumentDate = this.getView().byId("idFromBillingDocumentDatePicker").getValue(),
                    TOBillingDocumentDate = this.getView().byId("idTOBillingDocumentDatePicker").getValue(),

                    FromBillingDocument1200 = this.getView().byId("id1200FromBillingDocumentInput").getValue(),
                    TOBillingDocument1200 = this.getView().byId("id1200TOBillingDocumentInput").getValue(),
                    FromBillingDocumentDate1200 = this.getView().byId("id1200FromBillingDocumentDatePicker").getValue(),
                    TOBillingDocumentDate1200 = this.getView().byId("id1200TOBillingDocumentDatePicker").getValue(),

                    FromSalesReturnBillingDocument = this.getView().byId("idFromSalesReturnBillingDocumentInput").getValue(),
                    TOSalesReturnBillingDocument = this.getView().byId("idTOSalesReturnBillingDocumentInput").getValue(),
                    FromSalesReturnBillingDocumentDate = this.getView().byId("idFromSalesReturnBillingDocumentDatePicker").getValue(),
                    TOSalesReturnBillingDocumentDate = this.getView().byId("idTOSalesReturnBillingDocumentDatePicker").getValue();

                oBusy.open();

                function handleAjaxSuccess(response) {
                    oBusy.close();
                    if (response.slice(0, 5) === "ERROR") {
                        MessageBox.error(response);
                    } else {
                        var byteArray = new Uint8Array(atob(response).split("").map(char => char.charCodeAt(0)));
                        var blob = new Blob([byteArray.buffer], { type: 'application/pdf' });
                        var pdfUrl = URL.createObjectURL(blob);

                        if (!that._PDFViewer) {
                            that._PDFViewer = new sap.m.PDFViewer({ width: "auto", source: pdfUrl });
                            jQuery.sap.addUrlWhitelist("blob");
                        } else {
                            that._PDFViewer.setSource(pdfUrl);
                        }
                        that.getView().byId("idSalesReturnBillingDocumentCustomerCodeInput").setValue();
                        that.getView().byId("idSalesReturnBillingDocumentHasteInput").setValue();
                        that.getView().byId("idSalesReturnBillingDocumentExternalAgentInput").setValue();
                        that.getView().byId("id1200BillingDocumentCustomerCodeInput").setValue();
                        that.getView().byId("id1200BillingDocumentHasteInput").setValue();
                        that.getView().byId("id1200BillingDocumentExternalAgentInput").setValue();
                        that.getView().byId("idDeliveryCustomerCodeInput").setValue();
                        that.getView().byId("idDeliveryHasteInput").setValue();
                        that.getView().byId("idDeliveryExternalAgentInput").setValue();
                        that.getView().byId("idBillingDocumentCustomerCodeInput").setValue();
                        that.getView().byId("idBillingDocumentHasteInput").setValue();
                        that.getView().byId("idBillingDocumentExternalAgentInput").setValue();

                        that._PDFViewer.open();
                    }
                }

                function prepareAndSendAjax(url) {
                    $.ajax({ url: url, type: "GET", success: handleAjaxSuccess.bind(this), error: () => oBusy.close() });
                }

                if (SalesOrgnisation === "1100") {
                    var PrintName = this.getView().byId("id1100RadioButtonGroup").getSelectedButton().getText(),
                        aError = "",
                        MainUrl = "/sap/bc/http/sap/ZSD_ALL_PRINT?&PrintName=" + PrintName + "&SalesOrgnisation=" + SalesOrgnisation;

                    if (PrintName == "Sale Order Print") {
                        var PrintType = this.getView().byId("id1100SaleOrderFormsRadioButtonGroup").getSelectedButton().getText();
                        if (PrintType === "From - TO") {
                            url = `${MainUrl}&PrintType=FromTO&FromDate=${FromDate.replace(/-/g, '')}&ToDate=${ToDate.replace(/-/g, '')}&FromDocument=${FromSalesOrder}&TODocument=${TOSalesOrder}`;
                        } else if (PrintType === "Multiple") {
                            var SalesOrders = this.getView().byId("idSalesOrderMultiInput").getTokens().map(token => token.getText());
                            url = `${MainUrl}&PrintType=Multiple&SalesOrder=${SalesOrders}&FromDate=${FromDate.replace(/-/g, '')}&ToDate=${ToDate.replace(/-/g, '')}`;
                        }
                    }
                    else if (PrintName == "Delivery Print") {
                        var PrintType = this.getView().byId("id1100DeliveryNumberFormsRadioButtonGroup").getSelectedButton().getText(),
                            DeliveryCustomerCode = this.getView().byId("idDeliveryCustomerCodeInput").getValue(),
                            DeliveryHaste = this.getView().byId("idDeliveryHasteInput").getValue(),
                            DeliveryExternalAgent = this.getView().byId("idDeliveryExternalAgentInput").getValue();


                        // if (DeliveryCustomerCode == "" && DeliveryHaste == ""  && DeliveryExternalAgent == "" ) {
                        //     if (PrintType === "From - TO") {
                        //         url = `${MainUrl}&PrintType=FromTO&FromDate=${FromDeliveryDate.replace(/-/g, '')}&ToDate=${TODeliveryDate.replace(/-/g, '')}&FromDocument=${FromDeliveryNumber}&TODocument=${TODeliveryNumber}&DeliveryExternalAgent=${DeliveryExternalAgent}&DeliveryHaste=${DeliveryHaste}&DeliveryCustomerCode=${DeliveryCustomerCode}`;
                        //     } else if (PrintType === "Multiple") {
                        //         var DeliveryNumbers = this.getView().byId("idDeliveryNumberMultiInput").getTokens().map(token => token.getText());
                        //         url = `${MainUrl}&PrintType=Multiple&DeliveryNumber=${DeliveryNumbers}&FromDate=${FromDeliveryDate.replace(/-/g, '')}&ToDate=${TODeliveryDate.replace(/-/g, '')}&DeliveryExternalAgent=${DeliveryExternalAgent}&DeliveryHaste=${DeliveryHaste}&DeliveryCustomerCode=${DeliveryCustomerCode}`;
                        //     }
                        // }
                        if ((DeliveryCustomerCode == "" || DeliveryHaste == "" || DeliveryExternalAgent == "") && PrintType === "From - TO" && FromDeliveryDate == "" && FromDeliveryNumber == "") {
                            aError = "Please Enter Delivery Date First!!!";
                            oBusy.close();
                        } else {
                            if (PrintType === "From - TO") {
                                url = `${MainUrl}&PrintType=FromTO&FromDate=${FromDeliveryDate.replace(/-/g, '')}&ToDate=${TODeliveryDate.replace(/-/g, '')}&FromDocument=${FromDeliveryNumber}&TODocument=${TODeliveryNumber}&DeliveryExternalAgent=${DeliveryExternalAgent}&DeliveryHaste=${DeliveryHaste}&DeliveryCustomerCode=${DeliveryCustomerCode}`;
                            } else if (PrintType === "Multiple") {
                                var DeliveryNumbers = this.getView().byId("idDeliveryNumberMultiInput").getTokens().map(token => token.getText());
                                url = `${MainUrl}&PrintType=Multiple&DeliveryNumber=${DeliveryNumbers}&FromDate=${FromDeliveryDate.replace(/-/g, '')}&ToDate=${TODeliveryDate.replace(/-/g, '')}&DeliveryExternalAgent=${DeliveryExternalAgent}&DeliveryHaste=${DeliveryHaste}&DeliveryCustomerCode=${DeliveryCustomerCode}`;
                            }
                        }
                    }
                    else if (PrintName == "Billing Document Print" || PrintName == "Intra Billing Document Print" || PrintName == "BOX Sticker Print") {
                        var PrintType = this.getView().byId("id1100BillingDocumentFormsRadioButtonGroup").getSelectedButton().getText(),
                            BillingDocumentCustomerCode = this.getView().byId("idBillingDocumentCustomerCodeInput").getValue(),
                            BillingDocumentHaste = this.getView().byId("idBillingDocumentHasteInput").getValue(),
                            BillingDocumentExternalAgent = this.getView().byId("idBillingDocumentExternalAgentInput").getValue(),
                            PrintType2 = this.getView().byId("id1100sRadioButtonGroup").getSelectedButton().getText();
                            PrintType2 = "";
                        if (this.getView().byId("idBillingDocumentOriginalCheckBox").getSelected() == true) { PrintType2 = PrintType2 + " Original" }
                        if (this.getView().byId("idBillingDocumentOfficeCopyCheckBox").getSelected() == true) { PrintType2 = PrintType2 == "" ? "Office Copy" : PrintType2 + ",Office Copy"}
                        if (this.getView().byId("idBillingDocumentTransporterCopyCheckBox").getSelected() == true) { PrintType2 = PrintType2 == "" ? "Transporter Copy" : PrintType2 + ",Transporter Copy" }
                        if (this.getView().byId("idBillingDocumentExtraCopyCheckBox").getSelected() == true) { PrintType2 = PrintType2 == "" ? "Extra Copy" : PrintType2 + ",Extra Copy" }
                        
                        // if (PrintType === "From - TO") {
                        //     url = `${MainUrl}&PrintType=FromTO&PrintType2=${PrintType2}&FromDate=${FromBillingDocumentDate.replace(/-/g, '')}&ToDate=${TOBillingDocumentDate.replace(/-/g, '')}&FromDocument=${FromBillingDocument}&TODocument=${TOBillingDocument}&BillingDocumentCustomerCode=${BillingDocumentCustomerCode}&BillingDocumentHaste=${BillingDocumentHaste}&BillingDocumentExternalAgent=${BillingDocumentExternalAgent}`;
                        // } else if (PrintType === "Multiple") {
                        //     var BillingDocuments = this.getView().byId("idBillingDocumentMultiInput").getTokens().map(token => token.getText());
                        //     url = `${MainUrl}&PrintType=Multiple&PrintType2=${PrintType2}&BillingDocument=${BillingDocuments}&FromDate=${FromBillingDocumentDate.replace(/-/g, '')}&ToDate=${TOBillingDocumentDate.replace(/-/g, '')}&BillingDocumentCustomerCode=${BillingDocumentCustomerCode}&BillingDocumentHaste=${BillingDocumentHaste}&BillingDocumentExternalAgent=${BillingDocumentExternalAgent}`;
                        // }


                        if ((BillingDocumentCustomerCode == "" || BillingDocumentHaste == "" || BillingDocumentExternalAgent == "") && FromBillingDocumentDate == "" && PrintType === "From - TO" && PrintName == "Billing Document Print" && FromBillingDocument == "") {
                            aError = "Please Enter Billing Document Date First!!!";
                            oBusy.close();
                        } else {
                            if (PrintType === "From - TO") {
                                url = `${MainUrl}&PrintType=FromTO&PrintType2=${PrintType2}&FromDate=${FromBillingDocumentDate.replace(/-/g, '')}&ToDate=${TOBillingDocumentDate.replace(/-/g, '')}&FromDocument=${FromBillingDocument}&TODocument=${TOBillingDocument}&BillingDocumentCustomerCode=${BillingDocumentCustomerCode}&BillingDocumentHaste=${BillingDocumentHaste}&BillingDocumentExternalAgent=${BillingDocumentExternalAgent}`;
                            } else if (PrintType === "Multiple") {
                                var BillingDocuments = this.getView().byId("idBillingDocumentMultiInput").getTokens().map(token => token.getText());
                                url = `${MainUrl}&PrintType=Multiple&PrintType2=${PrintType2}&BillingDocument=${BillingDocuments}&FromDate=${FromBillingDocumentDate.replace(/-/g, '')}&ToDate=${TOBillingDocumentDate.replace(/-/g, '')}&BillingDocumentCustomerCode=${BillingDocumentCustomerCode}&BillingDocumentHaste=${BillingDocumentHaste}&BillingDocumentExternalAgent=${BillingDocumentExternalAgent}`;
                            }
                        }

                    }
                    else if (PrintName == "Sales Return Print") {
                        var PrintType = this.getView().byId("id1100SalesReturnBillingDocumentFormsRadioButtonGroup").getSelectedButton().getText(),
                            SalesReturnBillingDocumentCustomerCode = this.getView().byId("idSalesReturnBillingDocumentCustomerCodeInput").getValue(),
                            SalesReturnBillingDocumentHaste = this.getView().byId("idSalesReturnBillingDocumentHasteInput").getValue(),
                            SalesReturnBillingDocumentExternalAgent = this.getView().byId("idSalesReturnBillingDocumentExternalAgentInput").getValue(),
                            SalesReturnPrintType2 = "";
                        if (this.getView().byId("idSalesReturnOriginalCheckBox").getSelected() == true) { SalesReturnPrintType2 = SalesReturnPrintType2 + " Original" }
                        if (this.getView().byId("idSalesReturnOfficeCopyCheckBox").getSelected() == true) { SalesReturnPrintType2 = SalesReturnPrintType2 == "" ? "Office Copy" : SalesReturnPrintType2 + ",Office Copy"}
                        if (this.getView().byId("idSalesReturnTransporterCopyCheckBox").getSelected() == true) { SalesReturnPrintType2 = SalesReturnPrintType2 == "" ? "Transporter Copy" : SalesReturnPrintType2 + ",Transporter Copy" }
                        if (this.getView().byId("idSalesReturnExtraCopyCheckBox").getSelected() == true) { SalesReturnPrintType2 = SalesReturnPrintType2 == "" ? "Extra Copy" : SalesReturnPrintType2 + ",Extra Copy" }
                        
                        if ((SalesReturnBillingDocumentCustomerCode == "" || SalesReturnBillingDocumentHaste == "" || SalesReturnBillingDocumentExternalAgent == "") && FromSalesReturnBillingDocumentDate == "" && PrintType === "From - TO" && PrintName == "Sales Return Print" && FromSalesReturnBillingDocument == "") {
                            aError = "Please Enter Billing Document Date First!!!";
                            oBusy.close();
                        } else {
                            if (PrintType === "From - TO") {
                                url = `${MainUrl}&PrintType=FromTO&PrintType2=${SalesReturnPrintType2}&FromDate=${FromSalesReturnBillingDocumentDate.replace(/-/g, '')}&ToDate=${TOSalesReturnBillingDocumentDate.replace(/-/g, '')}&FromDocument=${FromSalesReturnBillingDocument}&TODocument=${TOSalesReturnBillingDocument}&BillingDocumentCustomerCode=${SalesReturnBillingDocumentCustomerCode}&BillingDocumentHaste=${SalesReturnBillingDocumentHaste}&BillingDocumentExternalAgent=${SalesReturnBillingDocumentExternalAgent}`;
                                // url = `${MainUrl}&PrintType=FromTO&PrintType2=${SalesReturnPrintType2}&FromDate=${FromSalesReturnBillingDocumentDate.replace(/-/g, '')}&ToDate=${TOSalesReturnBillingDocumentDate.replace(/-/g, '')}&FromDocument=${FromSalesReturnBillingDocument}&TODocument=${TOSalesReturnBillingDocument}&SalesReturnBillingDocumentCustomerCode=${SalesReturnBillingDocumentCustomerCode}&SalesReturnBillingDocumentHaste=${SalesReturnBillingDocumentHaste}&SalesReturnBillingDocumentExternalAgent=${SalesReturnBillingDocumentExternalAgent}`;
                            } else if (PrintType === "Multiple") {
                                var SalesReturBillingDocuments = this.getView().byId("idSalesReturnBillingDocumentMultiInput").getTokens().map(token => token.getText());
                                url = `${MainUrl}&PrintType=Multiple&PrintType2=${SalesReturnPrintType2}&BillingDocument=${SalesReturBillingDocuments}&FromDate=${FromSalesReturnBillingDocumentDate.replace(/-/g, '')}&ToDate=${TOSalesReturnBillingDocumentDate.replace(/-/g, '')}&BillingDocumentCustomerCode=${SalesReturnBillingDocumentCustomerCode}&BillingDocumentHaste=${SalesReturnBillingDocumentHaste}&BillingDocumentExternalAgent=${SalesReturnBillingDocumentExternalAgent}`;
                                // url = `${MainUrl}&PrintType=Multiple&PrintType2=${SalesReturnPrintType2}&BillingDocument=${SalesReturBillingDocuments}&FromDate=${FromSalesReturnBillingDocumentDate.replace(/-/g, '')}&ToDate=${TOSalesReturnBillingDocumentDate.replace(/-/g, '')}&SalesReturnBillingDocumentCustomerCode=${SalesReturnBillingDocumentCustomerCode}&SalesReturnBillingDocumentHaste=${SalesReturnBillingDocumentHaste}&SalesReturnBillingDocumentExternalAgent=${SalesReturnBillingDocumentExternalAgent}`;
                            }
                        }
                    }
                    if (aError == "") {
                        var StorageLocation = [];
                        that.getView().byId("idStorageLocationComboBox").getSelectedItems().map(function (item) {
                            StorageLocation.push(item.getText());
                        })
                        var url1 = url + "&StorageLocation=" + StorageLocation;
                        // var url1 = url + "&StorageLocation=" + that.getView().byId("idStorageLocationComboBox").getValue();
                        prepareAndSendAjax(url1);
                    } else {
                        MessageBox.error(aError);
                    }
                } else if (SalesOrgnisation === "1200") {
                    var PrintName = this.getView().byId("id1200RadioButtonGroup").getSelectedButton().getText(),
                        MainUrl = "/sap/bc/http/sap/ZSD_ALL_PRINT?&PrintName=" + PrintName + "&SalesOrgnisation=" + SalesOrgnisation;
                    if (PrintName == "Sale Order Print") {
                        var PrintType = this.getView().byId("id1200SaleOrderFormsRadioButtonGroup").getSelectedButton().getText();
                        if (PrintType === "From - TO") {
                            url = `${MainUrl}&PrintType=FromTO&FromDate=${FromDate.replace(/-/g, '')}&ToDate=${ToDate.replace(/-/g, '')}&FromDocument=${FromSalesOrder}&TODocument=${TOSalesOrder}`;
                        } else if (PrintType === "Multiple") {
                            var SalesOrders = this.getView().byId("idSalesOrderMultiInput").getTokens().map(token => token.getText());
                            url = `${MainUrl}&PrintType=Multiple&SalesOrder=${SalesOrders}&FromDate=${FromDate.replace(/-/g, '')}&ToDate=${ToDate.replace(/-/g, '')}`;
                        }
                    }
                    else if (PrintName == "Delivery Print") {
                        var PrintType = this.getView().byId("id1200DeliveryNumberFormsRadioButtonGroup").getSelectedButton().getText();
                        if (PrintType === "From - TO") {
                            url = `${MainUrl}&PrintType=FromTO&FromDate=${FromDeliveryDate.replace(/-/g, '')}&ToDate=${TODeliveryDate.replace(/-/g, '')}&FromDocument=${FromDeliveryNumber}&TODocument=${TODeliveryNumber}`;
                        } else if (PrintType === "Multiple") {
                            var DeliveryNumbers = this.getView().byId("idDeliveryNumberMultiInput").getTokens().map(token => token.getText());
                            url = `${MainUrl}&PrintType=Multiple&DeliveryNumber=${DeliveryNumbers}&FromDate=${FromDeliveryDate.replace(/-/g, '')}&ToDate=${TODeliveryDate.replace(/-/g, '')}`;
                        }
                    }
                    else if (PrintName == "Billing Document Print") {
                        var PrintType = this.getView().byId("id1200BillingDocumentFormsRadioButtonGroup").getSelectedButton().getText(),
                            BillingDocumentCustomerCode1200 = this.getView().byId("id1200BillingDocumentCustomerCodeInput").getValue(),
                            BillingDocumentHaste1200 = this.getView().byId("id1200BillingDocumentHasteInput").getValue(),
                            BillingDocumentExternalAgent1200 = this.getView().byId("id1200BillingDocumentExternalAgentInput").getValue(),
                            PrintType2 = this.getView().byId("id1200sRadioButtonGroup").getSelectedButton().getText();

                        if (PrintType === "From - TO") {
                            url = `${MainUrl}&PrintType=FromTO&PrintType2=${PrintType2}&FromDate=${FromBillingDocumentDate1200.replace(/-/g, '')}&ToDate=${TOBillingDocumentDate1200.replace(/-/g, '')}&FromDocument=${FromBillingDocument1200}&TODocument=${TOBillingDocument1200}&BillingDocumentCustomerCode=${BillingDocumentCustomerCode1200}&BillingDocumentHaste=${BillingDocumentHaste1200}&BillingDocumentExternalAgent=${BillingDocumentExternalAgent1200}`;
                        } else if (PrintType === "Multiple") {
                            var BillingDocuments1200 = this.getView().byId("id1200BillingDocumentMultiInput").getTokens().map(token => token.getText());
                            url = `${MainUrl}&PrintType=Multiple&PrintType2=${PrintType2}&BillingDocument=${BillingDocuments1200}&FromDate=${FromBillingDocumentDate1200.replace(/-/g, '')}&ToDate=${TOBillingDocumentDate1200.replace(/-/g, '')}&BillingDocumentCustomerCode=${BillingDocumentCustomerCode1200}&BillingDocumentHaste=${BillingDocumentHaste1200}&BillingDocumentExternalAgent=${BillingDocumentExternalAgent1200}`;
                        }

                    }
                    else if (PrintName == "Sales Return Print") {
                        var PrintType = this.getView().byId("id1100SalesReturnBillingDocumentFormsRadioButtonGroup").getSelectedButton().getText(),
                            SalesReturnBillingDocumentCustomerCode = this.getView().byId("idSalesReturnBillingDocumentCustomerCodeInput").getValue(),
                            SalesReturnBillingDocumentHaste = this.getView().byId("idSalesReturnBillingDocumentHasteInput").getValue(),
                            SalesReturnBillingDocumentExternalAgent = this.getView().byId("idSalesReturnBillingDocumentExternalAgentInput").getValue(),
                            SalesReturnPrintType2 = "";
                        if (this.getView().byId("idSalesReturnOriginalCheckBox").getSelected() == true) { SalesReturnPrintType2 = SalesReturnPrintType2 + "" }
                        if (this.getView().byId("idSalesReturnOfficeCopyCheckBox").getSelected() == true) { SalesReturnPrintType2 = SalesReturnPrintType2 + "" }
                        if (this.getView().byId("idSalesReturnTransporterCopyCheckBox").getSelected() == true) { SalesReturnPrintType2 = SalesReturnPrintType2 + "" }
                        if (this.getView().byId("idSalesReturnExtraCopyCheckBox").getSelected() == true) { SalesReturnPrintType2 = SalesReturnPrintType2 + "" }
                        if (PrintType === "From - TO") {
                            url = `${MainUrl}&PrintType=FromTO&PrintType2=${SalesReturnPrintType2}&FromDate=${FromSalesReturnBillingDocumentDate.replace(/-/g, '')}&ToDate=${TOSalesReturnBillingDocumentDate.replace(/-/g, '')}&FromDocument=${FromSalesReturnBillingDocument}&TODocument=${TOSalesReturnBillingDocument}&SalesReturnBillingDocumentCustomerCode=${SalesReturnBillingDocumentCustomerCode}&SalesReturnBillingDocumentHaste=${SalesReturnBillingDocumentHaste}&SalesReturnBillingDocumentExternalAgent=${SalesReturnBillingDocumentExternalAgent}`;
                        } else if (PrintType === "Multiple") {
                            var SalesReturBillingDocuments = this.getView().byId("idSalesReturnBillingDocumentMultiInput").getTokens().map(token => token.getText());
                            url = `${MainUrl}&PrintType=Multiple&PrintType2=${SalesReturnPrintType2}&BillingDocument=${SalesReturBillingDocuments}&FromDate=${FromSalesReturnBillingDocumentDate.replace(/-/g, '')}&ToDate=${TOSalesReturnBillingDocumentDate.replace(/-/g, '')}&SalesReturnBillingDocumentCustomerCode=${SalesReturnBillingDocumentCustomerCode}&SalesReturnBillingDocumentHaste=${SalesReturnBillingDocumentHaste}&SalesReturnBillingDocumentExternalAgent=${SalesReturnBillingDocumentExternalAgent}`;
                        }
                    }
                    var StorageLocation = [];
                    that.getView().byId("idStorageLocationComboBox").getSelectedItems().map(function (item) {
                        StorageLocation.push(item.getText());
                    })
                    var url1 = url + "&StorageLocation=" + StorageLocation;
                    // var url1 = url + "&StorageLocation=" + that.getView().byId("idStorageLocationComboBox").getValue();
                    prepareAndSendAjax(url1);
                } else {
                    oBusy.close();
                }
            },


            on1100SaleOrderFormsRadioButtonGroupSelect: function (oEvent) {
                var that = this;
                var radio = this.getView().byId("id1100SaleOrderFormsRadioButtonGroup").getSelectedButton().getText();
                if (radio == "From - TO") {
                    that.getView().byId("idSalesOrderLabel").setVisible(true);
                    that.getView().byId("idFromSalesOrderInput").setVisible(true);
                    that.getView().byId("idTOSalesOrderInput").setVisible(true);
                    that.getView().byId("idSalesOrderMultiLabel").setVisible(false);
                    that.getView().byId("idSalesOrderMultiInput").setVisible(false);
                    that.getView().byId("idSalesOrderMultiInput").setVisible(false);

                    that.getView().byId("idSalesOrderDateLabel").setVisible(true);
                    that.getView().byId("idFromSalesOrderDatePicker").setVisible(true);
                    that.getView().byId("idTOSalesOrderDatePicker").setVisible(true);
                } else if (radio == "Multiple") {
                    that.getView().byId("idSalesOrderLabel").setVisible(false);
                    that.getView().byId("idFromSalesOrderInput").setVisible(false);
                    that.getView().byId("idTOSalesOrderInput").setVisible(false);
                    that.getView().byId("idFromSalesOrderInput").setValue();
                    that.getView().byId("idTOSalesOrderInput").setValue();
                    that.getView().byId("idSalesOrderMultiLabel").setVisible(true);
                    that.getView().byId("idSalesOrderMultiInput").setVisible(true);

                    that.getView().byId("idSalesOrderDateLabel").setVisible(false);
                    that.getView().byId("idFromSalesOrderDatePicker").setVisible(false);
                    that.getView().byId("idTOSalesOrderDatePicker").setVisible(false);
                }
            },
            onSOvalueHelpRequest11: function (oEvent) {
                var that = this;
                var oSalesOrg = new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, SalesOrgnisation);

                this.sKey = oEvent.getSource().getCustomData()[0].getKey();
                var oView = this.getView();
                if (!this.pSalesOrderDialog) {
                    this.pSalesOrderDialog = Fragment.load({
                        id: oView.getId(),
                        name: "zsalesprint.view.Fragments.SalesOrderValueHelpDialog",
                        controller: this
                    }).then(function (oSalesOrderDialog) {
                        oSalesOrderDialog.setModel(oView.getModel());
                        return oSalesOrderDialog;
                    });
                }

                this.pSalesOrderDialog.then(function (oSalesOrderDialog) {
                    var aFilters = [];
                    var oSalesOrgFilter = new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, oSalesOrg);
                    aFilters.push(oSalesOrgFilter);
                    // Get the binding and apply the filter to the delivery dialog
                    var oBinding = oDeliveryDialog.getBinding("items"); // Assuming the dialog has an 'items' aggregation
                    if (oBinding) {
                        oBinding.filter(aFilters);
                    }
                    if (this.sKey == "FromSaleOrder" || this.sKey == "TOSaleOrder") {
                        oSalesOrderDialog.setMultiSelect(false);
                        // oSalesOrderDialog.setRememberSelections(true);
                        oSalesOrderDialog.open();
                    } else if (this.sKey == "SalesOrderMultiInput") {
                        oSalesOrderDialog.setMultiSelect(true);
                        // oSalesOrderDialog.setRememberSelections(true);
                        oSalesOrderDialog.open();
                    }
                }.bind(this));
            },

            onSOvalueHelpRequest: function (oEvent) {
                var that = this;
                var aFilters = [];
                var oSalesOrderDialog = this.byId("idSalesOrderTableSelectDialog");
                var oSalesOrgFilter = new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, "1100");
                aFilters.push(oSalesOrgFilter);
                // Get the binding and apply the filter to the delivery dialog
                var oBinding = oSalesOrderDialog.getBinding("items"); // Assuming the dialog has an 'items' aggregation
                if (oBinding) {
                    oBinding.filter(aFilters);
                }
                this.sKey = oEvent.getSource().getCustomData()[0].getKey();
                if (this.sKey == "FromSaleOrder" || this.sKey == "TOSaleOrder") {
                    oSalesOrderDialog.setMultiSelect(false);
                    // oSalesOrderDialog.setRememberSelections(true);
                    oSalesOrderDialog.open();
                } else if (this.sKey == "SalesOrderMultiInput") {
                    oSalesOrderDialog.setMultiSelect(true);
                    // oSalesOrderDialog.setRememberSelections(true);
                    oSalesOrderDialog.open();
                }
            },

            onSoSelectDialogSearch: function (oEvent) {
                // var sValue = oEvent.getParameter("value");
                // var oFilter1 = new Filter("SalesOrder", FilterOperator.Contains, sValue);
                // var oFilter2 = new Filter("Customer", FilterOperator.Contains, sValue);
                // var oFilter3 = new Filter("CustomerName", FilterOperator.Contains, sValue);
                // var oBinding = oEvent.getParameter("itemsBinding");
                // oBinding.filter([oFilter1, oFilter2, oFilter3]);









                var sValue = oEvent.getParameter("value");
                var oFilter1 = new sap.ui.model.Filter("SalesOrder", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter2 = new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter3 = new sap.ui.model.Filter("CustomerName", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter4 = new sap.ui.model.Filter("CityName", sap.ui.model.FilterOperator.Contains, sValue);
                var oCombinedFilter = new sap.ui.model.Filter({
                    filters: [oFilter1, oFilter2, oFilter3, oFilter4],
                    and: false // `false` means OR logic
                });
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter(oCombinedFilter);
            },
            onSOSelectDialogConfirm: function (oEvent) {
                var that = this;
                var oObject = oEvent.getParameter("selectedContexts")[0].getObject();
                if (this.sKey == "FromSaleOrder") {
                    this.getView().byId("idFromSalesOrderInput").setValue(oObject.SalesOrder);
                }
                else if (this.sKey == "TOSaleOrder") {
                    this.getView().byId("idTOSalesOrderInput").setValue(oObject.SalesOrder);
                }
                else if (this.sKey == "SalesOrderMultiInput") {
                    var aSelectedItems = oEvent.getParameter("selectedItems"),
                        oMultiInput = this.byId("idSalesOrderMultiInput");

                    // if (aSelectedItems && aSelectedItems.length > 0) {
                    // aSelectedItems.forEach(function (oItem) {
                    //     oMultiInput.addToken(new Token({
                    //         text: oItem.getInfo()
                    //     }));
                    // });
                    // }
                    var oObject1 = oEvent.getParameter("selectedContexts");
                    oObject1.forEach(function (oItem) {
                        oMultiInput.addToken(new Token({
                            text: oItem.getObject().SalesOrder
                        }));
                    });
                }
            },







            on1100DeliveryNumberFormsRadioButtonGroupSelect: function (oEvent) {
                var that = this;
                var radio = this.getView().byId("id1100DeliveryNumberFormsRadioButtonGroup").getSelectedButton().getText();
                if (radio == "From - TO") {
                    that.getView().byId("idDeliveryNumberLabel").setVisible(true);
                    that.getView().byId("idFromDeliveryNumberInput").setVisible(true);
                    that.getView().byId("idTODeliveryNumberInput").setVisible(true);
                    that.getView().byId("idDeliveryNumberMultiLabel").setVisible(false);
                    that.getView().byId("idDeliveryNumberMultiInput").setVisible(false);

                    that.getView().byId("idFromDeliveryDatePicker").setVisible(true);
                    that.getView().byId("idTODeliveryDatePicker").setVisible(true);
                    that.getView().byId("idDeliveryCustomerCodeInput").setVisible(true);
                    that.getView().byId("idDeliveryHasteInput").setVisible(true);
                    that.getView().byId("idDeliveryExternalAgentInput").setVisible(true);
                    that.getView().byId("idDeliveryDateLabel").setVisible(true);
                    that.getView().byId("idDeliveryCustomerCodeLabel").setVisible(true);
                    that.getView().byId("idDeliveryHasteLabel").setVisible(true);
                    that.getView().byId("idDeliveryExternalAgentLabel").setVisible(true);

                } else if (radio == "Multiple") {
                    that.getView().byId("idDeliveryNumberLabel").setVisible(false);
                    that.getView().byId("idFromDeliveryNumberInput").setVisible(false);
                    that.getView().byId("idTODeliveryNumberInput").setVisible(false);
                    that.getView().byId("idFromDeliveryNumberInput").setValue();
                    that.getView().byId("idTODeliveryNumberInput").setValue();
                    that.getView().byId("idDeliveryNumberMultiLabel").setVisible(true);
                    that.getView().byId("idDeliveryNumberMultiInput").setVisible(true);

                    that.getView().byId("idFromDeliveryDatePicker").setVisible(false);
                    that.getView().byId("idTODeliveryDatePicker").setVisible(false);
                    that.getView().byId("idDeliveryCustomerCodeInput").setVisible(false);
                    that.getView().byId("idDeliveryHasteInput").setVisible(false);
                    that.getView().byId("idDeliveryExternalAgentInput").setVisible(false);
                    that.getView().byId("idDeliveryDateLabel").setVisible(false);
                    that.getView().byId("idDeliveryCustomerCodeLabel").setVisible(false);
                    that.getView().byId("idDeliveryHasteLabel").setVisible(false);
                    that.getView().byId("idDeliveryExternalAgentLabel").setVisible(false);
                }
            },
            onDeliveryValueHelpRequest111: function (oEvent) {
                var that = this;
                var oSalesOrg = new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, SalesOrgnisation);

                this.sDeliveryKey = oEvent.getSource().getCustomData()[0].getKey();
                var oView = this.getView();
                if (!this._pDeliveryDialog) {
                    this._pDeliveryDialog = Fragment.load({
                        id: oView.getId(),
                        name: "zsalesprint.view.Fragments.DeliveryValueHelpDialog",
                        controller: this
                    }).then(function (oDeliveryDialog) {
                        oDeliveryDialog.setModel(oView.getModel());
                        return oDeliveryDialog;
                    });
                }
                this._pDeliveryDialog.then(function (oDeliveryDialog) {
                    var aFilters = [];
                    var oSalesOrgFilter = new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, oSalesOrg);
                    aFilters.push(oSalesOrgFilter);
                    // Get the binding and apply the filter to the delivery dialog
                    var oBinding = oDeliveryDialog.getBinding("items"); // Assuming the dialog has an 'items' aggregation
                    if (oBinding) {
                        oBinding.filter(aFilters);
                    }
                    if (this.sDeliveryKey == "FromDeliveryNumber" || this.sDeliveryKey == "TODeliveryNumber") {
                        oDeliveryDialog.setMultiSelect(false);
                        // oDeliveryDialog.setRememberSelections(true);
                        oDeliveryDialog.open();
                    } else if (this.sDeliveryKey == "DeliveryMultiInput") {
                        oDeliveryDialog.setMultiSelect(true);
                        // oDeliveryDialog.setRememberSelections(true);
                        oDeliveryDialog.open();
                    }
                }.bind(this));

            },
            onDeliveryValueHelpRequest: function (oEvent) {
                var that = this;
                var aFilters = [];
                var oDeliveryDialog = this.byId("idDeliveryTableSelectDialog");
                var oSalesOrgFilter = new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, "1100");
                aFilters.push(oSalesOrgFilter);
                var oBinding = oDeliveryDialog.getBinding("items");
                if (oBinding) {
                    oBinding.filter(aFilters);
                }
                this.sDeliveryKey = oEvent.getSource().getCustomData()[0].getKey();
                if (this.sDeliveryKey == "FromDeliveryNumber" || this.sDeliveryKey == "TODeliveryNumber") {
                    oDeliveryDialog.setMultiSelect(false);
                    oDeliveryDialog.open();
                } else if (this.sDeliveryKey == "DeliveryMultiInput") {
                    oDeliveryDialog.setMultiSelect(true);
                    oDeliveryDialog.open();
                }
            },
            onDeliverySelectDialogSearch: function (oEvent) {
                // var sValue = oEvent.getParameter("value");
                // var oFilter1 = new Filter("DeliveryDocument", FilterOperator.Contains, sValue);
                // var oFilter2 = new Filter("Customer", FilterOperator.Contains, sValue);
                // var oFilter3 = new Filter("CustomerName", FilterOperator.Contains, sValue);
                // var oBinding = oEvent.getParameter("itemsBinding");
                // oBinding.filter([oFilter1, oFilter2, oFilter3]);



                var sValue = oEvent.getParameter("value");
                var oFilter1 = new sap.ui.model.Filter("BillingDocument", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter2 = new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter4 = new sap.ui.model.Filter("CityName", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter3 = new sap.ui.model.Filter("CustomerName", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter5 = new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.Contains, "1100");
                var oCombinedFilter = new sap.ui.model.Filter({
                    filters: [oFilter1, oFilter2, oFilter3, oFilter4],
                    and: false // `false` means OR logic
                });
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter(oCombinedFilter);
            },
            onDeliverySelectDialogConfirm: function (oEvent) {
                var that = this;
                var oObject = oEvent.getParameter("selectedContexts")[0].getObject();
                if (this.sDeliveryKey == "FromDeliveryNumber") {
                    this.getView().byId("idFromDeliveryNumberInput").setValue(oObject.BillingDocument);
                }
                else if (this.sDeliveryKey == "TODeliveryNumber") {
                    this.getView().byId("idTODeliveryNumberInput").setValue(oObject.BillingDocument);
                }
                else if (this.sDeliveryKey == "DeliveryMultiInput") {
                    var aSelectedItems = oEvent.getParameter("selectedItems"),
                        oMultiInput = this.byId("idDeliveryNumberMultiInput");
                    // if (aSelectedItems && aSelectedItems.length > 0) {
                    //     aSelectedItems.forEach(function (oItem) {
                    //         oMultiInput.addToken(new Token({
                    //             text: oItem.getInfo()
                    //         }));
                    //     });
                    // }
                    var oObject1 = oEvent.getParameter("selectedContexts");
                    oObject1.forEach(function (oItem) {
                        oMultiInput.addToken(new Token({
                            text: oItem.getObject().BillingDocument
                        }));
                    });
                }
            },





            on1100BillingDocumentFormsRadioButtonGroupSelect: function (oEvent) {
                var that = this;
                var radio = this.getView().byId("id1100BillingDocumentFormsRadioButtonGroup").getSelectedButton().getText();
                if (radio == "From - TO") {
                    that.getView().byId("idBillingDocumentLabel").setVisible(true);
                    that.getView().byId("idFromBillingDocumentInput").setVisible(true);
                    that.getView().byId("idTOBillingDocumentInput").setVisible(true);
                    that.getView().byId("idBillingDocumentMultiLabel").setVisible(false);
                    that.getView().byId("idBillingDocumentMultiInput").setVisible(false);




                    that.getView().byId("idFromBillingDocumentDatePicker").setVisible(true);
                    that.getView().byId("idTOBillingDocumentDatePicker").setVisible(true);
                    that.getView().byId("idBillingDocumentCustomerCodeInput").setVisible(true);
                    that.getView().byId("idBillingDocumentHasteInput").setVisible(true);
                    that.getView().byId("idBillingDocumentExternalAgentInput").setVisible(true);
                    that.getView().byId("idBillingDocumentDateLabel").setVisible(true);
                    that.getView().byId("idBillingDocumentCustomerCodeLabel").setVisible(true);
                    that.getView().byId("idBillingDocumentHasteLabel").setVisible(true);
                    that.getView().byId("idBillingDocumentExternalAgentLabel").setVisible(true);
                } else if (radio == "Multiple") {
                    that.getView().byId("idBillingDocumentLabel").setVisible(false);
                    that.getView().byId("idFromBillingDocumentInput").setVisible(false);
                    that.getView().byId("idTOBillingDocumentInput").setVisible(false);
                    that.getView().byId("idFromBillingDocumentInput").setValue();
                    that.getView().byId("idTOBillingDocumentInput").setValue();
                    that.getView().byId("idBillingDocumentMultiLabel").setVisible(true);
                    that.getView().byId("idBillingDocumentMultiInput").setVisible(true);

                    that.getView().byId("idFromBillingDocumentDatePicker").setVisible(false);
                    that.getView().byId("idTOBillingDocumentDatePicker").setVisible(false);
                    that.getView().byId("idBillingDocumentCustomerCodeInput").setVisible(false);
                    that.getView().byId("idBillingDocumentHasteInput").setVisible(false);
                    that.getView().byId("idBillingDocumentExternalAgentInput").setVisible(false);
                    that.getView().byId("idBillingDocumentDateLabel").setVisible(false);
                    that.getView().byId("idBillingDocumentCustomerCodeLabel").setVisible(false);
                    that.getView().byId("idBillingDocumentHasteLabel").setVisible(false);
                    that.getView().byId("idBillingDocumentExternalAgentLabel").setVisible(false);
                }
            },

            on1100BillingDocumentFormsRadioButtonGroupSelect: function (oEvent) {
                var that = this;
                var radio = this.getView().byId("id1100BillingDocumentFormsRadioButtonGroup").getSelectedButton().getText();
                if (radio == "From - TO") {
                    that.getView().byId("idBillingDocumentLabel").setVisible(true);
                    that.getView().byId("idFromBillingDocumentInput").setVisible(true);
                    that.getView().byId("idTOBillingDocumentInput").setVisible(true);
                    that.getView().byId("idBillingDocumentMultiLabel").setVisible(false);
                    that.getView().byId("idBillingDocumentMultiInput").setVisible(false);




                    that.getView().byId("idFromBillingDocumentDatePicker").setVisible(true);
                    that.getView().byId("idTOBillingDocumentDatePicker").setVisible(true);
                    that.getView().byId("idBillingDocumentCustomerCodeInput").setVisible(true);
                    that.getView().byId("idBillingDocumentHasteInput").setVisible(true);
                    that.getView().byId("idBillingDocumentExternalAgentInput").setVisible(true);
                    that.getView().byId("idBillingDocumentDateLabel").setVisible(true);
                    that.getView().byId("idBillingDocumentCustomerCodeLabel").setVisible(true);
                    that.getView().byId("idBillingDocumentHasteLabel").setVisible(true);
                    that.getView().byId("idBillingDocumentExternalAgentLabel").setVisible(true);
                } else if (radio == "Multiple") {
                    that.getView().byId("idBillingDocumentLabel").setVisible(false);
                    that.getView().byId("idFromBillingDocumentInput").setVisible(false);
                    that.getView().byId("idTOBillingDocumentInput").setVisible(false);
                    that.getView().byId("idFromBillingDocumentInput").setValue();
                    that.getView().byId("idTOBillingDocumentInput").setValue();
                    that.getView().byId("idBillingDocumentMultiLabel").setVisible(true);
                    that.getView().byId("idBillingDocumentMultiInput").setVisible(true);

                    that.getView().byId("idFromBillingDocumentDatePicker").setVisible(false);
                    that.getView().byId("idTOBillingDocumentDatePicker").setVisible(false);
                    that.getView().byId("idBillingDocumentCustomerCodeInput").setVisible(false);
                    that.getView().byId("idBillingDocumentHasteInput").setVisible(false);
                    that.getView().byId("idBillingDocumentExternalAgentInput").setVisible(false);
                    that.getView().byId("idBillingDocumentDateLabel").setVisible(false);
                    that.getView().byId("idBillingDocumentCustomerCodeLabel").setVisible(false);
                    that.getView().byId("idBillingDocumentHasteLabel").setVisible(false);
                    that.getView().byId("idBillingDocumentExternalAgentLabel").setVisible(false);
                }
            },
            onBillingDocumentValueHelpRequest111: function (oEvent) {
                var that = this;
                var SalesOrgnisation = that.getView().byId("idSalesOrgnisationComboBox").getValue();
                this.sBillingDocumentKey = oEvent.getSource().getCustomData()[0].getKey();
                var oView = this.getView();
                if (!this._pBillingDocumentDialog) {
                    this._pBillingDocumentDialog = Fragment.load({
                        id: oView.getId(),
                        name: "zsalesprint.view.Fragments.BillingDocumentValueHelpDialog",
                        controller: this
                    }).then(function (oBillingDocumentDialog) {
                        oBillingDocumentDialog.setModel(oView.getModel());
                        return oBillingDocumentDialog;
                    });
                }
                this._pBillingDocumentDialog.then(function (oBillingDocumentDialog) {
                    var oSalesOrgFilter = new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, SalesOrgnisation);
                    var oBinding = oBillingDocumentDialog.getBinding("items"); // Ensure that this matches the aggregation name in the fragment (like "items")
                    if (oBinding) {
                        // oBinding.filter([oSalesOrgFilter]);
                    }
                    if (this.sBillingDocumentKey == "FromBillingDocument" || this.sBillingDocumentKey == "TOBillingDocument" || this.sBillingDocumentKey == "1200FromBillingDocument" || this.sBillingDocumentKey == "1200TOBillingDocument") {
                        oBillingDocumentDialog.setMultiSelect(false);
                        // oBillingDocumentDialog.setRememberSelections(true);
                        // oBillingDocumentDialog.open();
                    } else if (this.sBillingDocumentKey == "BillingDocumentMultiInput" || this.sBillingDocumentKey == "1200BillingDocumentMultiInput") {
                        oBillingDocumentDialog.setMultiSelect(true);
                        // oBillingDocumentDialog.setRememberSelections(true);
                        // oBillingDocumentDialog.open();
                    }
                    oBillingDocumentDialog.open();

                }.bind(this));

            },


            onBillingDocumentValueHelpRequest: function (oEvent) {
                var that = this;
                var aFilters = [];
                var SalesOrgnisation = that.getView().byId("idSalesOrgnisationComboBox").getValue();
                var oBillingDocumentDialog = this.byId("idBillingDocumentTableSelectDialog");
                var oSalesOrgFilter = new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, SalesOrgnisation);
                var oBinding = oBillingDocumentDialog.getBinding("items"); // Ensure that this matches the aggregation name in the fragment (like "items")
                if (oBinding) {
                    // oBinding.filter([oSalesOrgFilter]);
                }
                this.sBillingDocumentKey = oEvent.getSource().getCustomData()[0].getKey();
                if (this.sBillingDocumentKey == "FromBillingDocument" || this.sBillingDocumentKey == "TOBillingDocument" || this.sBillingDocumentKey == "1200FromBillingDocument" || this.sBillingDocumentKey == "1200TOBillingDocument") {
                    oBillingDocumentDialog.setMultiSelect(false);
                } else if (this.sBillingDocumentKey == "BillingDocumentMultiInput" || this.sBillingDocumentKey == "1200BillingDocumentMultiInput") {
                    oBillingDocumentDialog.setMultiSelect(true);
                }
                oBillingDocumentDialog.open();
            },
            onBillingDocumentSelectDialogSearch: function (oEvent) {
                // var sValue = oEvent.getParameter("value");
                // var oFilter1 = new Filter("BillingDocument", FilterOperator.Contains, sValue);
                // var oFilter2 = new Filter("Customer", FilterOperator.Contains, sValue);
                // var oFilter3 = new Filter("CustomerName", FilterOperator.Contains, sValue);
                // var oBinding = oEvent.getParameter("itemsBinding");
                // oBinding.filter([oFilter1, oFilter2, oFilter3]);




                var sValue = oEvent.getParameter("value");
                var oFilter1 = new sap.ui.model.Filter("BillingDocument", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter2 = new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter3 = new sap.ui.model.Filter("CustomerName", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter4 = new sap.ui.model.Filter("CityName", sap.ui.model.FilterOperator.Contains, sValue);
                // var oFilter5 = new sap.ui.model.Filter("SalesOrganization", "EQ", "1100");
                var oCombinedFilter = new sap.ui.model.Filter({
                    filters: [oFilter1, oFilter2, oFilter3, oFilter4],
                    and: false // `false` means OR logic
                });
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter(oCombinedFilter);


            },
            onBillingDocumentSelectDialogConfirm: function (oEvent) {
                var that = this;
                var oObject = oEvent.getParameter("selectedContexts")[0].getObject();
                if (this.sBillingDocumentKey == "FromBillingDocument") {
                    this.getView().byId("idFromBillingDocumentInput").setValue(oObject.BillingDocument);
                }
                else if (this.sBillingDocumentKey == "TOBillingDocument") {
                    this.getView().byId("idTOBillingDocumentInput").setValue(oObject.BillingDocument);
                }
                else if (this.sBillingDocumentKey == "BillingDocumentMultiInput") {
                    var aSelectedItems = oEvent.getParameter("selectedItems"),
                        oMultiInput = this.byId("idBillingDocumentMultiInput");
                    // if (aSelectedItems && aSelectedItems.length > 0) {
                    //     aSelectedItems.forEach(function (oItem) {
                    //         oMultiInput.addToken(new Token({
                    //             text: oItem.getInfo()
                    //         }));
                    //     });
                    // }

                    var oObject1 = oEvent.getParameter("selectedContexts");
                    oObject1.forEach(function (oItem) {
                        oMultiInput.addToken(new Token({
                            text: oItem.getObject().BillingDocument
                        }));
                    });

                }

                else if (this.sBillingDocumentKey == "1200FromBillingDocument") {
                    this.getView().byId("id1200FromBillingDocumentInput").setValue(oObject.BillingDocument);
                }
                else if (this.sBillingDocumentKey == "1200TOBillingDocument") {
                    this.getView().byId("id1200TOBillingDocumentInput").setValue(oObject.BillingDocument);
                }
                else if (this.sBillingDocumentKey == "1200BillingDocumentMultiInput") {
                    var aSelectedItems = oEvent.getParameter("selectedItems"),
                        oMultiInput = this.byId("id1200BillingDocumentMultiInput");
                    var oObject1 = oEvent.getParameter("selectedContexts");
                    oObject1.forEach(function (oItem) {
                        oMultiInput.addToken(new Token({
                            text: oItem.getObject().BillingDocument
                        }));
                    });
                }
            },




            on1200BillingDocumentFormsRadioButtonGroupSelect: function (oEvent) {
                var that = this;
                var radio = this.getView().byId("id1200BillingDocumentFormsRadioButtonGroup").getSelectedButton().getText();
                if (radio == "From - TO") {
                    that.getView().byId("id1200BillingDocumentLabel").setVisible(true);
                    that.getView().byId("id1200FromBillingDocumentInput").setVisible(true);
                    that.getView().byId("id1200TOBillingDocumentInput").setVisible(true);
                    that.getView().byId("id1200BillingDocumentMultiLabel").setVisible(false);
                    that.getView().byId("id1200BillingDocumentMultiInput").setVisible(false);
                    that.getView().byId("id1200BillingDocumentMultiInput").setToken([]);
                } else if (radio == "Multiple") {
                    that.getView().byId("id1200BillingDocumentLabel").setVisible(false);
                    that.getView().byId("id1200FromBillingDocumentInput").setVisible(false);
                    that.getView().byId("id1200TOBillingDocumentInput").setVisible(false);
                    that.getView().byId("id1200FromBillingDocumentInput").setValue();
                    that.getView().byId("id1200TOBillingDocumentInput").setValue();
                    that.getView().byId("id1200BillingDocumentMultiLabel").setVisible(true);
                    that.getView().byId("id1200BillingDocumentMultiInput").setVisible(true);
                }
            },
            on1200sBillingDocumentValueHelpRequest: function (oEvent) {
                var that = this;
                var aFilters = [];
                var SalesOrgnisation = that.getView().byId("idSalesOrgnisationComboBox").getValue();
                var oBillingDocumentDialog = this.byId("id1200sBillingDocumentTableSelectDialog");
                var oSalesOrgFilter = new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, SalesOrgnisation);
                var oBinding = oBillingDocumentDialog.getBinding("items"); // Ensure that this matches the aggregation name in the fragment (like "items")
                if (oBinding) {
                    // oBinding.filter([oSalesOrgFilter]);
                }
                this.sBillingDocumentKey = oEvent.getSource().getCustomData()[0].getKey();
                if (this.sBillingDocumentKey == "FromBillingDocument" || this.sBillingDocumentKey == "TOBillingDocument" || this.sBillingDocumentKey == "1200FromBillingDocument" || this.sBillingDocumentKey == "1200TOBillingDocument") {
                    oBillingDocumentDialog.setMultiSelect(false);
                } else if (this.sBillingDocumentKey == "BillingDocumentMultiInput" || this.sBillingDocumentKey == "1200BillingDocumentMultiInput") {
                    oBillingDocumentDialog.setMultiSelect(true);
                }
                oBillingDocumentDialog.open();
            },
            on1200sBillingDocumentSelectDialogSearch: function (oEvent) {
                // var sValue = oEvent.getParameter("value");
                // var oFilter1 = new Filter("BillingDocument", FilterOperator.Contains, sValue);
                // var oFilter2 = new Filter("Customer", FilterOperator.Contains, sValue);
                // var oFilter3 = new Filter("CustomerName", FilterOperator.Contains, sValue);
                // var oBinding = oEvent.getParameter("itemsBinding");
                // oBinding.filter([oFilter1, oFilter2, oFilter3]);




                var sValue = oEvent.getParameter("value");
                var oFilter1 = new sap.ui.model.Filter("BillingDocument", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter2 = new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter3 = new sap.ui.model.Filter("CustomerName", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter4 = new sap.ui.model.Filter("CityName", sap.ui.model.FilterOperator.Contains, sValue);
                // var oFilter5 = new sap.ui.model.Filter("SalesOrganization", "EQ", "1100");
                var oCombinedFilter = new sap.ui.model.Filter({
                    filters: [oFilter1, oFilter2, oFilter3, oFilter4],
                    and: false // `false` means OR logic
                });
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter(oCombinedFilter);


            },
            on1200sBillingDocumentSelectDialogConfirm: function (oEvent) {
                var that = this;
                var oObject = oEvent.getParameter("selectedContexts")[0].getObject();
                if (this.sBillingDocumentKey == "FromBillingDocument") {
                    this.getView().byId("idFromBillingDocumentInput").setValue(oObject.BillingDocument);
                }
                else if (this.sBillingDocumentKey == "TOBillingDocument") {
                    this.getView().byId("idTOBillingDocumentInput").setValue(oObject.BillingDocument);
                }
                else if (this.sBillingDocumentKey == "BillingDocumentMultiInput") {
                    var aSelectedItems = oEvent.getParameter("selectedItems"),
                        oMultiInput = this.byId("idBillingDocumentMultiInput");
                    // if (aSelectedItems && aSelectedItems.length > 0) {
                    //     aSelectedItems.forEach(function (oItem) {
                    //         oMultiInput.addToken(new Token({
                    //             text: oItem.getInfo()
                    //         }));
                    //     });
                    // }

                    var oObject1 = oEvent.getParameter("selectedContexts");
                    oObject1.forEach(function (oItem) {
                        oMultiInput.addToken(new Token({
                            text: oItem.getObject().BillingDocument
                        }));
                    });

                }

                else if (this.sBillingDocumentKey == "1200FromBillingDocument") {
                    this.getView().byId("id1200FromBillingDocumentInput").setValue(oObject.BillingDocument);
                }
                else if (this.sBillingDocumentKey == "1200TOBillingDocument") {
                    this.getView().byId("id1200TOBillingDocumentInput").setValue(oObject.BillingDocument);
                }
                else if (this.sBillingDocumentKey == "1200BillingDocumentMultiInput") {
                    var aSelectedItems = oEvent.getParameter("selectedItems"),
                        oMultiInput = this.byId("id1200BillingDocumentMultiInput");
                    var oObject1 = oEvent.getParameter("selectedContexts");
                    oObject1.forEach(function (oItem) {
                        oMultiInput.addToken(new Token({
                            text: oItem.getObject().BillingDocument
                        }));
                    });
                }
            },



            on1100SalesReturnBillingDocumentFormsRadioButtonGroupSelect: function (oEvent) {
                var that = this;
                var radio = this.getView().byId("id1100SalesReturnBillingDocumentFormsRadioButtonGroup").getSelectedButton().getText();
                if (radio == "From - TO") {
                    that.getView().byId("idSalesReturnBillingDocumentLabel").setVisible(true);
                    that.getView().byId("idFromSalesReturnBillingDocumentInput").setVisible(true);
                    that.getView().byId("idTOSalesReturnBillingDocumentInput").setVisible(true);
                    that.getView().byId("idSalesReturnBillingDocumentMultiLabel").setVisible(false);
                    that.getView().byId("idSalesReturnBillingDocumentMultiInput").setVisible(false);
                    that.getView().byId("idSalesReturnBillingDocumentDateLabel").setVisible(true);
                    that.getView().byId("idFromSalesReturnBillingDocumentDatePicker").setVisible(true);
                    that.getView().byId("idTOSalesReturnBillingDocumentDatePicker").setVisible(true);

                    that.getView().byId("idSalesReturnBillingDocumentCustomerCodeLabel").setVisible(true);
                    that.getView().byId("idSalesReturnBillingDocumentCustomerCodeInput").setVisible(true);
                    that.getView().byId("idSalesReturnBillingDocumentHasteLabel").setVisible(false);
                    that.getView().byId("idSalesReturnBillingDocumentHasteInput").setVisible(false);
                    that.getView().byId("idSalesReturnBillingDocumentExternalAgentLabel").setVisible(false);
                    that.getView().byId("idSalesReturnBillingDocumentExternalAgentInput").setVisible(false);
                } else if (radio == "Multiple") {
                    that.getView().byId("idSalesReturnBillingDocumentLabel").setVisible(false);
                    that.getView().byId("idFromSalesReturnBillingDocumentInput").setVisible(false);
                    that.getView().byId("idTOSalesReturnBillingDocumentInput").setVisible(false);
                    that.getView().byId("idFromSalesReturnBillingDocumentInput").setValue();
                    that.getView().byId("idTOSalesReturnBillingDocumentInput").setValue();
                    that.getView().byId("idSalesReturnBillingDocumentMultiLabel").setVisible(true);
                    that.getView().byId("idSalesReturnBillingDocumentMultiInput").setVisible(true);

                    that.getView().byId("idSalesReturnBillingDocumentDateLabel").setVisible(false);
                    that.getView().byId("idFromSalesReturnBillingDocumentDatePicker").setVisible(false);
                    that.getView().byId("idTOSalesReturnBillingDocumentDatePicker").setVisible(false);

                    that.getView().byId("idSalesReturnBillingDocumentCustomerCodeLabel").setVisible(false);
                    that.getView().byId("idSalesReturnBillingDocumentCustomerCodeInput").setVisible(false);
                    that.getView().byId("idSalesReturnBillingDocumentHasteLabel").setVisible(false);
                    that.getView().byId("idSalesReturnBillingDocumentHasteInput").setVisible(false);
                    that.getView().byId("idSalesReturnBillingDocumentExternalAgentLabel").setVisible(false);
                    that.getView().byId("idSalesReturnBillingDocumentExternalAgentInput").setVisible(false);

                }
            },
            onSalesReturnBillingDocumentValueHelpRequest: function (oEvent) {
                var that = this;
                this.sSalesReturnBillingDocumentKey = oEvent.getSource().getCustomData()[0].getKey();
                var oView = this.getView();
                if (!this._pSalesReturnBillingDocumentDialog) {
                    this._pSalesReturnBillingDocumentDialog = Fragment.load({
                        id: oView.getId(),
                        name: "zsalesprint.view.Fragments.SalesReturnBillingDocumentValueHelpDialog",
                        controller: this
                    }).then(function (oSalesReturnBillingDocumentDialog) {
                        oSalesReturnBillingDocumentDialog.setModel(oView.getModel());
                        return oSalesReturnBillingDocumentDialog;
                    });
                }
                this._pSalesReturnBillingDocumentDialog.then(function (oSalesReturnBillingDocumentDialog) {
                    if (this.sSalesReturnBillingDocumentKey == "FromSalesReturnBillingDocument" || this.sSalesReturnBillingDocumentKey == "TOSalesReturnBillingDocument") {
                        oSalesReturnBillingDocumentDialog.setMultiSelect(false);
                        // oSalesReturnBillingDocumentDialog.setRememberSelections(true);
                        oSalesReturnBillingDocumentDialog.open();
                    } else if (this.sSalesReturnBillingDocumentKey == "SalesReturnBillingDocumentMultiInput") {
                        oSalesReturnBillingDocumentDialog.setMultiSelect(true);
                        // oSalesReturnBillingDocumentDialog.setRememberSelections(true);
                        oSalesReturnBillingDocumentDialog.open();
                    }
                }.bind(this));

            },
            onSalesReturnBillingDocumentSelectDialogSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter1 = new Filter("BillingDocument", FilterOperator.Contains, sValue);
                var oFilter2 = new Filter("Customer", FilterOperator.Contains, sValue);
                var oFilter3 = new Filter("CustomerName", FilterOperator.Contains, sValue);
                var oFilter4 = new sap.ui.model.Filter("CityName", sap.ui.model.FilterOperator.Contains, sValue);

                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter1, oFilter2, oFilter3, oFilter4]);
            },
            onSalesReturnBillingDocumentSelectDialogConfirm: function (oEvent) {
                var that = this;
                var oObject = oEvent.getParameter("selectedContexts")[0].getObject();
                if (this.sSalesReturnBillingDocumentKey == "FromSalesReturnBillingDocument") {
                    this.getView().byId("idFromSalesReturnBillingDocumentInput").setValue(oObject.BillingDocument);
                }
                else if (this.sSalesReturnBillingDocumentKey == "TOSalesReturnBillingDocument") {
                    this.getView().byId("idTOSalesReturnBillingDocumentInput").setValue(oObject.BillingDocument);
                }
                else if (this.sSalesReturnBillingDocumentKey == "SalesReturnBillingDocumentMultiInput") {
                    var aSelectedItems = oEvent.getParameter("selectedItems"),
                        oMultiInput = this.byId("idSalesReturnBillingDocumentMultiInput");
                    // if (aSelectedItems && aSelectedItems.length > 0) {
                    //     aSelectedItems.forEach(function (oItem) {
                    //         oMultiInput.addToken(new Token({
                    //             text: oItem.getInfo()
                    //         }));
                    //     });
                    // }
                    var oObject1 = oEvent.getParameter("selectedContexts");
                    oObject1.forEach(function (oItem) {
                        oMultiInput.addToken(new Token({
                            text: oItem.getObject().BillingDocument
                        }));
                    });
                }
            },












            onBillingDocumentCustomerCodeValueHelpRequest: function (oEvent) {
                // var oDialog = this.byId("idBillingDocumentCustomerCodeSelectDialog");
                var oDialog = this.byId("idBillingDocumentCustomerCodeTableSelectDialog");
                oDialog.open();
            },
            onBillingDocumentHasteValueHelpRequest: function (oEvent) {
                // var oDialog = this.byId("idBillingDocumentHasteSelectDialog");
                var oDialog = this.byId("idBillingDocumentHasteTableSelectDialog");
                oDialog.open();
            },
            onBillingDocumentExternalAgenValueHelpRequest: function (oEvent) {
                // var oDialog = this.byId("idBillingDocumentExternalAgentSelectDialog");
                var oDialog = this.byId("idBillingDocumentExternalAgentTableSelectDialog");
                oDialog.open();
            },
            onBillingDocumentExternalAgentSelectDialogSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter2 = new sap.ui.model.Filter("Supplier", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter3 = new sap.ui.model.Filter("SupplierName", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter4 = new sap.ui.model.Filter("CityName", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter5 = new sap.ui.model.Filter("SalesOrganization", "EQ", "1100");
                if (sValue.length < 9) {
                    var oCombinedFilter = new sap.ui.model.Filter({
                        filters: [oFilter2, oFilter3, oFilter4],
                        and: false
                    });
                    var oBinding = oEvent.getSource().getBinding("items");
                    oBinding.filter(oCombinedFilter);
                } else {
                    var oCombinedFilter = new sap.ui.model.Filter({
                        filters: [oFilter3, oFilter4],
                        and: false
                    });
                    var oBinding = oEvent.getSource().getBinding("items");
                    oBinding.filter(oCombinedFilter);
                }
            },
            onBillingDocumentHasteSelectDialogSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter2 = new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter3 = new sap.ui.model.Filter("CustomerName", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter4 = new sap.ui.model.Filter("CityName", sap.ui.model.FilterOperator.Contains, sValue);
                if (sValue.length < 11) {
                    var oCombinedFilter = new sap.ui.model.Filter({ filters: [oFilter2, oFilter3, oFilter4], and: false });
                    var oBinding = oEvent.getSource().getBinding("items");
                    oBinding.filter(oCombinedFilter);
                } else {
                    var oCombinedFilter = new sap.ui.model.Filter({ filters: [oFilter3, oFilter4], and: false });
                    var oBinding = oEvent.getSource().getBinding("items");
                    oBinding.filter(oCombinedFilter);
                }
            },
            onBillingDocumentCustomerCodeSelectDialogSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter2 = new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter3 = new sap.ui.model.Filter("CustomerName", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter4 = new sap.ui.model.Filter("CityName", sap.ui.model.FilterOperator.Contains, sValue);
                if (sValue.length < 11) {
                    var oCombinedFilter = new sap.ui.model.Filter({
                        filters: [oFilter2, oFilter3, oFilter4],
                        and: false
                    });
                    var oBinding = oEvent.getSource().getBinding("items");
                    oBinding.filter(oCombinedFilter);
                } else {
                    var oCombinedFilter = new sap.ui.model.Filter({
                        filters: [oFilter3, oFilter4],
                        and: false
                    });
                    var oBinding = oEvent.getSource().getBinding("items");
                    oBinding.filter(oCombinedFilter);
                }
            },
            onBillingDocumentExternalAgentSelectDialogConfirm: function (oEvent) {
                var oDialog = this.byId("idBillingDocumentExternalAgentInput");
                var oObject = oEvent.getParameter("selectedContexts")[0].getObject();
                this.getView().byId("").setValue(oObject.Supplier);
                this.getView().byId("idFromBillingDocumentDatePicker").setRequired(true);
                this.getView().byId("idTOBillingDocumentDatePicker").setRequired(true);
            },
            onBillingDocumentHasteSelectDialogConfirm: function (oEvent) {
                var oDialog = this.byId("idBillingDocumentHasteSelectDialog");
                var oObject = oEvent.getParameter("selectedContexts")[0].getObject();
                this.getView().byId("idBillingDocumentHasteInput").setValue(oObject.Customer);
                this.getView().byId("idFromBillingDocumentDatePicker").setRequired(true);
                this.getView().byId("idTOBillingDocumentDatePicker").setRequired(true);
            },
            onBillingDocumentCustomerCodeSelectDialogConfirm: function (oEvent) {
                var oDialog = this.byId("idBillingDocumentCustomerCodeSelectDialog");
                var oObject = oEvent.getParameter("selectedContexts")[0].getObject();
                this.getView().byId("idBillingDocumentCustomerCodeInput").setValue(oObject.Customer);
                this.getView().byId("idFromBillingDocumentDatePicker").setRequired(true);
                this.getView().byId("idTOBillingDocumentDatePicker").setRequired(true);
            },









            onDeliveryCustomerCodeValueHelpRequest: function (oEvent) {
                var oDialog = this.byId("idDeliveryCustomerCodeTableSelectDialog");
                // var oDialog = this.byId("idDeliveryCustomerCodeSelectDialog");
                oDialog.open();
            },
            onDeliveryHasteValueHelpRequest: function (oEvent) {
                var oDialog = this.byId("idDeliveryHasteTableSelectDialog");
                // var oDialog = this.byId("idDeliveryHasteSelectDialog");
                oDialog.open();
            },
            onDeliveryExternalAgentValueHelpRequest: function (oEvent) {
                var oDialog = this.byId("idDeliveryExternalAgentTableSelectDialog");
                // var oDialog = this.byId("idDeliveryExternalAgentSelectDialog");
                oDialog.open();
            },
            onDeliveryExternalAgentSelectDialogSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter2 = new sap.ui.model.Filter("Supplier", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter3 = new sap.ui.model.Filter("SupplierName", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter4 = new sap.ui.model.Filter("CityName", sap.ui.model.FilterOperator.Contains, sValue);
                if (sValue.length < 11) {
                    var oCombinedFilter = new sap.ui.model.Filter({
                        filters: [oFilter2, oFilter3, oFilter4],
                        and: false
                    });
                    var oBinding = oEvent.getSource().getBinding("items");
                    oBinding.filter(oCombinedFilter);
                } else {
                    var oCombinedFilter = new sap.ui.model.Filter({
                        filters: [oFilter3, oFilter4],
                        and: false
                    });
                    var oBinding = oEvent.getSource().getBinding("items");
                    oBinding.filter(oCombinedFilter);
                }
            },
            onDeliveryHasteSelectDialogSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter2 = new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter3 = new sap.ui.model.Filter("CustomerName", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter4 = new sap.ui.model.Filter("CityName", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter5 = new sap.ui.model.Filter("SalesOrganization", "EQ", "1100");
                if (sValue.length < 11) {
                    var oCombinedFilter = new sap.ui.model.Filter({
                        filters: [oFilter2, oFilter3, oFilter4],
                        and: false
                    });
                    var oBinding = oEvent.getSource().getBinding("items");
                    oBinding.filter(oCombinedFilter);
                } else {
                    var oCombinedFilter = new sap.ui.model.Filter({
                        filters: [oFilter3, oFilter4],
                        and: false
                    });
                    var oBinding = oEvent.getSource().getBinding("items");
                    oBinding.filter(oCombinedFilter);
                }
            },
            onDeliveryCustomerCodeSelectDialogSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter2 = new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter3 = new sap.ui.model.Filter("CustomerName", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter4 = new sap.ui.model.Filter("CityName", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter5 = new sap.ui.model.Filter("SalesOrganization", "EQ", "1100");
                if (sValue.length < 11) {
                    var oCombinedFilter = new sap.ui.model.Filter({
                        filters: [oFilter2, oFilter3, oFilter4],
                        and: false
                    });
                    var oBinding = oEvent.getSource().getBinding("items");
                    oBinding.filter(oCombinedFilter);
                } else {
                    var oCombinedFilter = new sap.ui.model.Filter({
                        filters: [oFilter3, oFilter4],
                        and: false
                    });
                    var oBinding = oEvent.getSource().getBinding("items");
                    oBinding.filter(oCombinedFilter);
                }
            },
            onDeliveryExternalAgentSelectDialogConfirm: function (oEvent) {
                var oDialog = this.byId("idDeliveryExternalAgentSelectDialog");
                var oObject = oEvent.getParameter("selectedContexts")[0].getObject();
                this.getView().byId("idDeliveryExternalAgentInput").setValue(oObject.Supplier);
                this.getView().byId("idFromDeliveryDatePicker").setRequired(true);
                this.getView().byId("idTODeliveryDatePicker").setRequired(true);
            },
            onDeliveryHasteSelectDialogConfirm: function (oEvent) {
                var oDialog = this.byId("idDeliveryHasteSelectDialog");
                var oObject = oEvent.getParameter("selectedContexts")[0].getObject();
                this.getView().byId("idDeliveryHasteInput").setValue(oObject.Customer);
                this.getView().byId("idFromDeliveryDatePicker").setRequired(true);
                this.getView().byId("idTODeliveryDatePicker").setRequired(true);
            },
            onDeliveryCustomerCodeSelectDialogConfirm: function (oEvent) {
                var oDialog = this.byId("idDeliveryCustomerCodeSelectDialog");
                var oObject = oEvent.getParameter("selectedContexts")[0].getObject();
                this.getView().byId("idDeliveryCustomerCodeInput").setValue(oObject.Customer);
                this.getView().byId("idFromDeliveryDatePicker").setRequired(true);
                this.getView().byId("idTODeliveryDatePicker").setRequired(true);
            },



















            onSalesReturnBillingDocumentCustomerCodeValueHelpRequest: function (oEvent) {
                var oDialog = this.byId("idSalesReturnBillingDocumentCustomerCodeTableSelectDialog");
                oDialog.open();
            },
            onSalesReturnBillingDocumentHasteValueHelpRequest: function (oEvent) {
                var oDialog = this.byId("idSalesReturnBillingDocumentHasteTableSelectDialog");
                oDialog.open();
            },
            onSalesReturnBillingDocumentExternalAgenValueHelpRequest: function (oEvent) {
                var oDialog = this.byId("idSalesReturnBillingDocumentExternalAgentTableSelectDialog");
                oDialog.open();
            },

            onSalesReturnBillingDocumentExternalAgentSelectDialogSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter2 = new sap.ui.model.Filter("Supplier", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter3 = new sap.ui.model.Filter("SupplierName", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter4 = new sap.ui.model.Filter("CityName", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter5 = new sap.ui.model.Filter("SalesOrganization", "EQ", "1100");
                if (sValue.length < 9) {
                    var oCombinedFilter = new sap.ui.model.Filter({ filters: [oFilter2, oFilter3, oFilter4], and: false });
                    var oBinding = oEvent.getSource().getBinding("items");
                    oBinding.filter(oCombinedFilter);
                } else {
                    var oCombinedFilter = new sap.ui.model.Filter({ filters: [oFilter3, oFilter4], and: false });
                    var oBinding = oEvent.getSource().getBinding("items");
                    oBinding.filter(oCombinedFilter);
                }
            },
            onSalesReturnBillingDocumentHasteSelectDialogSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter2 = new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter3 = new sap.ui.model.Filter("CustomerName", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter4 = new sap.ui.model.Filter("CityName", sap.ui.model.FilterOperator.Contains, sValue);
                if (sValue.length < 11) {
                    var oCombinedFilter = new sap.ui.model.Filter({
                        filters: [oFilter2, oFilter3, oFilter4],
                        and: false
                    });
                    var oBinding = oEvent.getSource().getBinding("items");
                    oBinding.filter(oCombinedFilter);
                } else {
                    var oCombinedFilter = new sap.ui.model.Filter({
                        filters: [oFilter3, oFilter4],
                        and: false
                    });
                    var oBinding = oEvent.getSource().getBinding("items");
                    oBinding.filter(oCombinedFilter);
                }
            },


            onSalesReturnBillingDocumentCustomerCodeSelectDialogSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter2 = new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter3 = new sap.ui.model.Filter("CustomerName", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter4 = new sap.ui.model.Filter("CityName", sap.ui.model.FilterOperator.Contains, sValue);
                if (sValue.length < 11) {
                    var oCombinedFilter = new sap.ui.model.Filter({ filters: [oFilter2, oFilter3, oFilter4], and: false });
                    var oBinding = oEvent.getSource().getBinding("items");
                    oBinding.filter(oCombinedFilter);
                } else {
                    var oCombinedFilter = new sap.ui.model.Filter({ filters: [oFilter3, oFilter4], and: false });
                    var oBinding = oEvent.getSource().getBinding("items");
                    oBinding.filter(oCombinedFilter);
                }
            },

            onSalesReturnBillingDocumentExternalAgentSelectDialogConfirm: function (oEvent) {
                var oObject = oEvent.getParameter("selectedContexts")[0].getObject();
                this.getView().byId("idSalesReturnBillingDocumentExternalAgentInput").setValue(oObject.Supplier);
                this.getView().byId("idFromSalesReturnBillingDocumentDatePicker").setRequired(true);
                this.getView().byId("idTOSalesReturnBillingDocumentDatePicker").setRequired(true);
            },
            onSalesReturnBillingDocumentHasteSelectDialogConfirm: function (oEvent) {
                var oObject = oEvent.getParameter("selectedContexts")[0].getObject();
                this.getView().byId("idSalesReturnBillingDocumentHasteInput").setValue(oObject.Customer);
                this.getView().byId("idFromSalesReturnBillingDocumentDatePicker").setRequired(true);
                this.getView().byId("idTOSalesReturnBillingDocumentDatePicker").setRequired(true);
            },

            onSalesReturnBillingDocumentCustomerCodeSelectDialogConfirm: function (oEvent) {
                var oObject = oEvent.getParameter("selectedContexts")[0].getObject();
                this.getView().byId("idSalesReturnBillingDocumentCustomerCodeInput").setValue(oObject.Customer);
                this.getView().byId("idFromSalesReturnBillingDocumentDatePicker").setRequired(true);
                this.getView().byId("idTOSalesReturnBillingDocumentDatePicker").setRequired(true);
            },

        });
    });
