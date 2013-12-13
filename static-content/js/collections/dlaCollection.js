define(
	['underscore',
		'backbone',
		'models/dla',
		'constants'
	],

	function(
		_,
		Backbone,
		DLA,
		constants) {


		var DLACollection = Backbone.Collection.extend({

			initialize: function(options) {
				if (options) {
					this.subnavModel = options.subnavModel;
					this.subnavModel.on('bulkupload', this.fetch, this);
				}

				this.pageIndex = 0;
				this.maxCount = 30;
				this.sortBy = "created-time";
				this.sortOrder = false;
				this.url = constants.getConetnts + "filter-status=all&page-index=" + this.pageIndex + "&max-count=" + this.maxCount;
				this.sortFilter = "&sort-by=" + this.sortBy + "&is-asc=" + this.sortOrder;
			},

			parse: function(data) {
				var self = this;
				// BASED ON THIS MODEL SUBNAV WILL SHOW LOADER ICOON AND SEARCH RESULTS
				if (this.subnavModel) {
					this.subnavModel.set({
						'num-results': data.response['num-results'],
						'searchVal': this.searchValue,
						'filterVal': this.filterValue,
						'isLoading': false
					});
				}

				var responseArr = data.response["content-list"];
				if (responseArr) {
					$.each(responseArr, function(i, val) {
						if (val['meta-attribute-list'] && val['meta-attribute-list'].length > 0) {
							$.each(val['meta-attribute-list'], function(i, obj) {
								if (obj.name === 'subtopic') {
									$.each(obj['value-list'], function(i, subtopic) {
										if (subtopic != null)
											obj['value-list'][i] = subtopic.substring(subtopic.indexOf('|') + 1)
									})
									//SORT
									if (self.sortBy == 'subtopic') {
										obj['value-list'].sort();
										if (!self.sortOrder)
											obj['value-list'].reverse();

									}
								}
								if (self.sortBy == 'subject') {
									if (obj.name === 'subject') {
										obj['value-list'].sort();
										if (!self.sortOrder) {
											obj['value-list'].reverse();
										}
									}
								}
							}) //iterating on each meta attribute    
						} //check if object conains meta data		 
					}) //ietrating on list of content
				}
				return responseArr;
			},

			getCheckedCount: function() {
				return this.filter(function(DLA) {
					return DLA.get('checked');
				});
			},

			sort: function(value, oredr) {
				if (this.sortBy != value || this.sortOrder != oredr) {
					this.sortBy = value;
					this.sortOrder = oredr;
					this.pageIndex = 0;
					this.sortFilter = "&sort-by=" + this.sortBy + "&is-asc=" + this.sortOrder;
					this.each(function(dla) {
						dla.trigger('remove');
					});
					//THIS IS TO CLEAR THE COLLECTION , SILENT:TRUE OPTION TO PREVENT TRIGGERING OF RENDER
					this.reset(undefined, {
						silent: true
					});
					this.fetch();
				}

			},

			filterAndSearch: function(filter, search) {
				this.pageIndex = 0;
				var queryfilter = ''
				this.filterValue = filter;
				if (filter == 'bookmarked') {
					queryfilter = constants.filterBookmarked + "=" + constants.userId;
				} else if (filter == 'ownedbyme') {
					queryfilter = constants.filterOwnedByme + "=" + constants.userId;
				} else if (filter == 'dla') {
					queryfilter = constants.filterContentType + "=" + filter;
				} else if (filter == 'teacherplan') {
					queryfilter = constants.filterContentType + "=" + filter;
				} else if (filter == 'playlist') {
					queryfilter = constants.filterContentType + "=" + filter;
				} else if (filter == 'draft') {
					queryfilter = constants.filterStatus + "=" + constants.draft;
				} else if (filter == constants.readyToReview) {
					queryfilter = constants.filterStatus + "=" + constants.readyToReview;
				} else if (filter == constants.readyToPublish) {
					queryfilter = constants.filterStatus + "=" + constants.readyToPublish;
				} else if (filter == 'published') {
					queryfilter = constants.filterStatus + "=" + constants.publish;
				} else if (filter == 'error') {
					queryfilter = constants.filterStatus + "=" + constants.error;
				} else if (filter == constants.unpublishedDisqualified) {
					queryfilter = constants.filterStatus + "=" + constants.unpublishedDisqualified;
				} else {
					queryfilter = constants.filterStatus + "=" + "all";
				}

				if (search != null && search.length > 0) {
					this.searchValue = search.substr(String(search).indexOf(':') + 1, search.length).trim();
					this.searchValue = encodeURIComponent(this.searchValue);
					if (this.searchValue.trim().length > 0) {
						searchField = search.substr(0, search.indexOf(':')).trim();
						if (searchField == 'title') {
							queryfilter = queryfilter + '&' + constants.searchTitle + "=" + this.searchValue;
						} else if (searchField == 'description') {
							queryfilter = queryfilter + '&' + constants.searchDesc + "=" + this.searchValue;
						} else if (searchField == 'source-site') {
							queryfilter = queryfilter + '&' + constants.searchSourcesite + "=" + this.searchValue
						} else if (searchField == 'keywords') {
							queryfilter = queryfilter + '&' + constants.searchKeyword + "=" + this.searchValue
						} else if (searchField == 'standard') {
							queryfilter = queryfilter + '&' + constants.searchStandaed + "=" + this.searchValue
						} else if (searchField == 'author') {
							queryfilter = queryfilter + '&' + constants.searchAuthor + "=" + this.searchValue
						}
					}
				}
				this.queryfilter = queryfilter;
				this.each(function(dla) {
					dla.trigger('remove');
				});
				//THIS IS TO CLEAR THE COLLECTION , SILENT:TRUE OPTION TO PREVENT TRIGGERING OF RENDER
				this.reset(undefined, {
					silent: true
				});
				this.fetch();
			},

			formURL: function() {
				if (!this.pageCount) {
					this.url = constants.getConetnts + this.queryfilter + "&page-index=" + this.pageIndex + "&max-count=" + this.maxCount + this.sortFilter;
				} else {
					this.url = constants.getConetnts + this.queryfilter + "&page-index=" + this.pageCount + "&max-count=" + this.maxCount + this.sortFilter;
				}
			},

			sync: function(method, model, options) {
				// BASED ON THIS MODEL SUBNAV WILL SHOW LOADER ICOON AND SEARCH RESULTS
				if (this.subnavModel && this.pageIndex < 1) {
					this.subnavModel.set({
						'num-results': null,
						'searchVal': this.searchValue,
						'filterVal': this.filterValue,
						'isLoading': true
					});
				}	
				this.formURL();
				return Backbone.sync(method, model, options);
			},

			clear: function() {
				this.each(function(dla) {
					dla.trigger('remove');
				});
				this.reset(undefined, {
					silent: true
				});
				this.pageIndex = 0;
				this.maxCount = 30;
			},

			resetToDefault: function() {
				this.clear();
				this.sortBy = "created-time";
				this.sortOrder = false;
				this.url = constants.getConetnts + "filter-status=all&page-index=" + this.pageIndex + "&max-count=" + this.maxCount;
				this.sortFilter = "&sort-by=" + this.sortBy + "&is-asc=" + this.sortOrder;
			}

		});

		return DLACollection;

	});