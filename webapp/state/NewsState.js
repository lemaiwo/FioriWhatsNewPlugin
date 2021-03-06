sap.ui.define([
	"../model/BaseObject",
	"sap/ui/model/json/JSONModel",
	"../model/Folder",
	"sap/ui/Device"
], function (BaseObject, JSONModel, Folder, Device) {
	"use strict";
	var NewsState = BaseObject.extend("be.wl.fiori.news.NewsState", {
		FolderSet: [],
		Folder: {},
		VideoObject: {},
		videosAreLoading: false,
		browser: "",

		constructor: function (oService) {
			BaseObject.call(this, {
				isState: true
			});
			this.browser = Device.browser.name;
			this.NewsService = oService;
			this.getFolders();

		},
		setShowNoMore: function (sFolderName) {
			return this.NewsService.setShowNoMore(sFolderName).then(function () {
				return this.getFolders();
			}.bind(this));
		},
		getFolders: function () {
			return this.NewsService.getFolders().then(function (FoldersResult) {
				this.FolderSet = FoldersResult.data.results.map(function (oJsonFolder) {
					return new Folder(oJsonFolder);
				}.bind(this));
				this.updateModel();
				return this.FolderSet;
			}.bind(this));
		},

		getFolder: function (name) {
			this.videoLoadingPercentage = 0;

			// if (sap.ui.Device.browser.name == "sf") {
			if (Device.os.name == "iOs" || Device.browser.name == "sf") {
				//get video as blob on safari.
				this.Folder = {};
				this.videosAreLoading = true;
				this.updateModel();
				this.NewsService.getFolder(name).then(function (result) {
					this.Folder = new Folder(result.data);
					this.updateModel();
					return Promise.all(this.Folder.FileInfo.map(function (info) {
						return this.NewsService.getVideoSafari(info.videoUrl);
					}.bind(this)));
				}.bind(this)).then(function (aResult) {
					aResult.forEach(function (blobUrl, index) {
						this.Folder.FileInfo[index].videoUrl = blobUrl;
						this.videosAreLoading = false;
					}.bind(this));
					this.updateModel(true);
					return aResult;
				}.bind(this));
			} else {
				this.NewsService.getFolder(name).then(function (result) {
					this.Folder = new Folder(result.data);
					this.updateModel();
				}.bind(this));
			}

		},

		videoURL: function (fileName) {
			// //check browser version
			// return this.formatter.Service.getVideo().then(function (result) {
			// 	return result;
			// });
			// var fileName = "/sap/opu/odata/sap/ZBC_FIORI_WHATS_NEW_SRV/FileSet('" + fileName + "')/$value";
			// // return fileName;
		},

		getSingleObject: function (Type, Seqnr, Dep) {
			//load data for a single object if the State was not initialized (direct navigation to object)

			// if (!this.Right) {
			// 	this.getRights();
			// }

			// this.CanevasService.getCanevas(Type, Seqnr, Dep).then(function (CanevasResult) {
			// 	this.Canevas = new Canevas(CanevasResult.data, this.Right);
			// 	this.updateModel();

			// }.bind(this));
		}

	});
	return NewsState;
});