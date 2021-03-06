sap.ui.define([
	"sap/ui/core/Component",
	"sap/m/Button",
	"sap/m/Bar",
	"sap/m/MessageToast",
	"./service/NewsService",
	"./state/NewsState"
], function (Component, Button, Bar, MessageToast, NewsService, NewsState) {

	return Component.extend("be.wl.fiori.news.Component", {

		metadata: {
			"manifest": "json"
		},

		init: function () {
			this.getModel("files").attachMetadataFailed(function () {
				var oNewsService = new NewsService();
				this.oNewsState = new NewsState(oNewsService);

				var rendererPromise = this._getRenderer();
				rendererPromise.then(function (oRenderer) {
					this.openWhatsNewNow();
					this._headerItem = oRenderer.addHeaderItem({
						icon: "sap-icon://newspaper",
						tooltip: "News!",
						press: this.openOverview.bind(this)
					}, true, false, ["home"]);
				}.bind(this));
			}, this);
			this.getModel("files").metadataLoaded().then(function () {
				var oNewsService = new NewsService(this.getModel("files"));
				this.oNewsState = new NewsState(oNewsService);

				var rendererPromise = this._getRenderer();
				rendererPromise.then(function (oRenderer) {
					this.openWhatsNewNow();
					this._headerItem = oRenderer.addHeaderItem({
						icon: "sap-icon://newspaper",
						tooltip: "News!",
						press: this.openOverview.bind(this)
					}, true, false, ["home"]);
				}.bind(this));
			});

		},

		openWhatsNewNow: function () {
			this.oNewsState.NewsService.getInfo().then(this.openWhatsNew.bind(this, "LATEST"));
		},
		onOpenSpecificWhatsNew: function (oEvent) {
			this._closeDialog("Overview");
			var sName = oEvent.getSource().getBindingContext("state").getProperty("Name");
			this.openWhatsNew(sName);
			this.oNewsState.setShowNoMore(sName);

		},
		openOverview: function (oEvent) {
			this._openDialog("Overview", oEvent.getSource());
		},
		openWhatsNew: function (sFolder, bHasSeen) {
			if (!bHasSeen) {
				this.oNewsState.getFolder(sFolder);
				this._openDialog({
					Name: "WhatsNew",
					// Binding: "files>/FolderSet('" + sFolder + "')"
					Binding: "state>/Folder"
				});
			}
		},
		onCloseOptions: function (oEvent) {
			if (oEvent.getSource().getBindingContext("state").getProperty("Name") === "LATEST") {
				this._openDialog("Close", oEvent.getSource());
			} else {
				this._closeDialog("WhatsNew");
			}
		},
		onClose: function () {
			this._closeDialog("Close");
			this._closeDialog("WhatsNew");
		},
		onDontShowAgain: function (oEvent) {
			if (this._getDialog("WhatsNew")) {
				this.oNewsState.setShowNoMore(this._getDialog("WhatsNew").getBindingContext("state").getProperty("Name"));
			}
			this.onClose();
		},
		_getDialog: function (sName) {
			if (this["_oDialog" + sName]) {
				return this["_oDialog" + sName];
			}
			return false;
		},
		_openDialog: function (sName, oFromSource, sBinding, oParams) {
			if (sName instanceof Object) {
				oParams = sName;
			}
			if (oParams) {
				sName = oParams.Name;
				oFromSource = oParams.FromSource || null;
				sBinding = oParams.Binding || "";
			}
			if (!this["_oDialog" + sName]) {
				this["_oDialog" + sName] = sap.ui.xmlfragment("be.wl.fiori.news.fragment." + sName, this);
				this["_oDialog" + sName].setModel(this.getModel("files"), "files");
				this["_oDialog" + sName].setModel(this.getModel("i18n"), "i18n");
				this["_oDialog" + sName].setModel(this.oNewsState.getModel(), "state");
			}
			if (sBinding) {
				this["_oDialog" + sName].bindElement(sBinding);
			}
			if (oFromSource) {
				this["_oDialog" + sName].openBy(oFromSource);
			} else {
				this["_oDialog" + sName].open();
			}
		},
		_closeDialog: function (sName) {
			this["_oDialog" + sName].close();
		},
		/**
		 * Returns the shell renderer instance in a reliable way,
		 * i.e. independent from the initialization time of the plug-in.
		 * This means that the current renderer is returned immediately, if it
		 * is already created (plug-in is loaded after renderer creation) or it
		 * listens to the &quot;rendererCreated&quot; event (plug-in is loaded
		 * before the renderer is created).
		 *
		 *  @returns {object}
		 *      a jQuery promise, resolved with the renderer instance, or
		 *      rejected with an error message.
		 */
		_getRenderer: function () {
			var that = this,
				oDeferred = new jQuery.Deferred(),
				oRenderer;

			that._oShellContainer = jQuery.sap.getObject("sap.ushell.Container");
			if (!that._oShellContainer) {
				oDeferred.reject(
					"Illegal state: shell container not available; this component must be executed in a unified shell runtime context.");
			} else {
				oRenderer = that._oShellContainer.getRenderer();
				if (oRenderer) {
					oDeferred.resolve(oRenderer);
				} else {
					// renderer not initialized yet, listen to rendererCreated event
					that._onRendererCreated = function (oEvent) {
						oRenderer = oEvent.getParameter("renderer");
						if (oRenderer) {
							oDeferred.resolve(oRenderer);
						} else {
							oDeferred.reject("Illegal state: shell renderer not available after recieving 'rendererLoaded' event.");
						}
					};
					that._oShellContainer.attachRendererCreatedEvent(that._onRendererCreated);
				}
			}
			return oDeferred.promise();
		},
		destroy: function(){
			//remove the header item you added
			
			var rendererPromise = this._getRenderer();
			rendererPromise.then(function (oRenderer) {
				oRenderer.hideHeaderItem([this._headerItem.getId()]);
				this._headerItem.destroy();
			}.bind(this));

            Component.prototype.destroy.apply(this,arguments);
        }

	});
});