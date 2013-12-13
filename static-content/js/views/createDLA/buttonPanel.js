define([
        'constants'
    ],

    function(
        constants
    ) {

        var View = Backbone.View.extend({
            
            el: '#buttonPanel',

            initialize: function(options) {
                this.$deleteBtnId = $('#btn_delete');
                this.$cancelBtnId = $('#btn_cancel');
                this.$saveBtnId = $('#btn_save');
                this.$backToDraftId = $('#btn_backToDraft');
                this.$readyToReviewId = $('#btn_readyForReview');
                this.$readyToPublishBtn = $('#btn_readyToPuclish');
                this.$publishBtnId = $('#btn_publish');
                this.$unPublishBtnId = $('#btn_unpublishedDisqualified');
                this.$draft = $('#draft');
                this.$disableStandards = $('.disableStandards');
                this.$upLoadImageDisable = $('#upLoadImageDisable');
                this.$upLoadImage = $('#upLoadImage');
                this.$sliderRange = $('#slider-range');
            },

            setButtons: function(role, status) {
                this.role = role;
                this.dlaStatus = status;
                this.$draft.removeClass();
                this.$saveBtnId.show().removeAttr('disabled');
                this.$readyToReviewId.show().removeAttr('disabled');
                this.$backToDraftId.removeAttr('disabled').show();
                this.$readyToPublishBtn.removeAttr('disabled').show();
                this.$publishBtnId.removeAttr('disabled').show();
                this.$unPublishBtnId.removeAttr('disabled').show();
                this.$deleteBtnId.removeAttr('disabled');
                //IF DLA IN DRAFT MODE
                if (this.dlaStatus == constants.draft.toUpperCase()) {
                    this.$draft.text('Draft').addClass('draft');
                    this.$backToDraftId.hide();
                    this.$readyToPublishBtn.hide();
                    this.$publishBtnId.hide();
                    this.$unPublishBtnId.hide();
                    this.$deleteBtnId.show();
                } else if (this.dlaStatus == constants.readyToReview.toUpperCase()) {
                    this.$draft.text('Ready for Review').addClass('readytoPreview');
                    this.$readyToReviewId.hide();
                    this.$publishBtnId.hide();
                    this.$deleteBtnId.hide();
                } else if (this.dlaStatus == constants.readyToPublish.toUpperCase()) {
                    this.$draft.text('Ready To Publish').addClass('publish');
                    this.$readyToReviewId.hide();
                    this.$readyToPublishBtn.hide();
                    this.$deleteBtnId.hide();
                } else if (this.dlaStatus == constants.error.toUpperCase()) {
                    this.$draft.text('ERROR').addClass('edit_Error');
                    this.$readyToReviewId.hide();
                    this.$readyToPublishBtn.hide();
                    this.$deleteBtnId.hide();
                } else if (this.dlaStatus == constants.publish.toUpperCase()) {
                    this.$draft.text('Published').addClass('publish');
                    this.$readyToReviewId.hide();
                    this.$readyToPublishBtn.hide();
                    this.$publishBtnId.hide();
                    this.$deleteBtnId.hide();
                } else if (this.dlaStatus == constants.unpublishedDisqualified.toUpperCase()) {
                    this.$draft.text('Unpublished/Disqualified').addClass('unPublished-Disqualified');
                    this.$readyToReviewId.hide();
                    this.$readyToPublishBtn.hide();
                    this.$unPublishBtnId.hide();
                    this.$deleteBtnId.show();
                }

                if (this.role == constants.author.toUpperCase() && this.dlaStatus != constants.draft.toUpperCase()) {
                    this.$saveBtnId.attr("disabled", "disabled").addClass("disabledSave");
                    this.$deleteBtnId.attr("disabled", "disabled").addClass("disable-delete");
                    this.$backToDraftId.attr("disabled", "disabled").addClass('disable-backto-draft');
                    this.$readyToReviewId.attr("disabled", "disabled");
                    this.$readyToPublishBtn.attr('disabled','disabled');
                    this.$publishBtnId.addClass("disabled_Publish dsableDisqualifyBtn").attr("disabled", "disabled");
                    this.$unPublishBtnId.attr("disabled", "disabled");
                    this.$disableStandards.show();
                    this.$upLoadImageDisable.show();
                    this.$upLoadImage.hide();
                    this.$sliderRange.slider({
                        disabled: true
                    });
                } else {
                    this.$upLoadImageDisable.hide();
                    this.$upLoadImage.show();
                    this.$sliderRange.slider({
                        disabled: false
                    });
                }
            },

        });

        return View;

    });