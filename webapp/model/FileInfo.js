sap.ui.define([
	"./BaseObject",
	"../service/NewsService",
], function (BaseObject, NewsService) {
	"use strict";
	return BaseObject.extend("be.wl.fiori.news.model.FileInfo", {
		videoUrl: "",

		constructor: function (data) {
			BaseObject.call(this, data);
			if (data) {
				//extra stuff
				// var baseUrl = "/sap/opu/odata/sap/ZODATA_WHATS_NEW_SRV/FileSet";
				// this.videoUrl = baseUrl + "('" + data.Name + "')" + "/$value";
				this.videoUrl = data.Name;
			}
		},

		getJSON: function () {
			return {};
		}
	});
});