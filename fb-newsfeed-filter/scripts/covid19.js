$(document).ready(function() {
    var IS_FACEBOOK = false;

    var facebook_link_post_container_text_wrapper = '._6m2._1zpr.clearfix._dcs';
    var facebook_link_post_container = '._5jmm._5pat';
    var facebook_link_post_container_link = 'a._52c6';
    var facebook_link_post_container_text = '._6m7._3bt9';
    var facebook_link_post_container_title = '.mbs._6m6._2cnj._5s6c';
    var facebook_link_post_container_base_url_div = '._59tj._2iau';
    var misinfo_marker_container_fb = '._5pbx.userContent';

    var checked_link_tag = 'misinfo_checker_checked';
    var checked_link_tag_is_misinfo = 'checked_link_tag_is_misinfo';
    var checked_link_tag_not_misinfo = 'checked_link_tag_not_misinfo';
    var misinfoCount = 0;

    var misinfo_feedback_button_class = 'misinfo-checker-feedback-button';
    var facbook_shared_post_container_class = '.mtm._5pco';


    var _handleClickbairReport = function(postData) {
      alert("Feedback received. Thanks!!");
      //will handle this API call later. Currently only alert.
        // postData.feedback = 'dislike';
        // console.log(postData);
        // $.post(API_FEEDBACK, postData)
        //     .done(function onSuccess(result) {
        //         // result = dummyData;
        //         alert("Thanks for your feedback");
        //         console.log('Feedback posted successfully');
        //     })
        //     .fail(function onError(xhr, status, error) {
        //         console.log(error);
        //     })
    };
    //
    var _getmisinfoLabelId = function(count) {
        return 'misinfoLabel_' + count;
    };
    var _getmisinfoPopupId = function(count) {
        return 'misinfoPopup_' + count;
    };
    var _getmisinfoWrapperId = function(count) {
        return 'misinfoMarkerWrapper_' + count;
    };
    //
    var _handlefeedbackButtonClick = function(postData) {
      alert("Feedback received. Thanks!!");
        // console.log(postData);
        // $.post(API_FEEDBACK, postData)
        //     .done(function onSuccess(result) {
        //         // result = dummyData;
        //         alert("Thanks for your feedback");
        //         console.log('Feedback posted successfully');
        //     })
        //     .fail(function onError(xhr, status, error) {
        //         console.log(error);
        //     })
    };
    //
    //
    var _getmisinfoInfoElement = function(data, id, postData) {
        var element = $("<div class='misinfo-marker-info-wrapper' style='font-size: 15px;'></div>");
        element.attr('id', _getmisinfoPopupId(id));

        var str = '';
        // if (data.matched_ngram && data.matched_ngram.length > 0) {
        //     str += '<b>misinfoy Language Pattern:</b>&nbsp;' + data.matched_ngram.join(", ") + "<br/>";
        // }

        str += '<b>Decision Confidence:</b>&nbsp;' + data.confidence + "<br/>";

        // if (data.similarity && data.similarity.length > 0){
        //     str += '<b>Similarity:</b>&nbsp;' + data.similarity + "<br/>" + "<hr/>"
        // }

        str += '<b>Explanation:</b><br/>' + data.explanation + "<br/>";

        str += '<b>Verified By:</b><br/>' + data.verified_by + "<br/>";

        str += '<b>Verification Link:</b><br/>' + data.verification_link;

        var info = $('<div></div>').html(str);

        // reportButtonWrapper.find('a').html('Report misinfo');
        // reportButtonWrapper.find('a').css('color', '#ff9022');

        var feedbackButton = $('<a></a>');
        feedbackButton.attr('misinfoId', id)
        feedbackButton.html('This should not be a Misinfo')
        feedbackButton.css('color', '#ff9022')

        feedbackButton.click(function(e) {
            _handlefeedbackButtonClick(postData);
        });


        var feedBackTile = $('<p>Provide Feedback</p>').addClass('provide_feedback_title');


        var likeDislikeButtons = $("<div class='light-padding-top' style='text-align: center'> </div>");


        likeDislikeButtons.append(feedBackTile);
        likeDislikeButtons.append(feedbackButton);

        info.append('<hr/>');
        info.append(likeDislikeButtons);
        element.append(info);

        return element;
    }
    //
    //
    var _handlemisinfoApiSuccess = function(result, node, postData) {
        misinfoCount = misinfoCount + 1;


        var ismisinfo = result.decision === 'misinfo';
        var misinfoMarker = $("<div class='misinfo-marker-span'></div>");
        misinfoMarker.attr('id', _getmisinfoLabelId(misinfoCount));

        if (ismisinfo) {
            misinfoMarker.addClass('misinfo-marker-is-misinfo');
            misinfoMarker.text('Potential Misinfo! - Click here to read more');
            var misinfoMarkerWrapper = $("<div class='misinfo-marker-wrapper'></div>");
            misinfoMarkerWrapper.attr('id', _getmisinfoWrapperId(misinfoCount));
            misinfoMarkerWrapper.append(misinfoMarker);

            var infoElement = _getmisinfoInfoElement(result, misinfoCount, postData);
            console.log("info", infoElement);

            var closeButton = $("<div class='misinfo-marker-info-close-btn'>Close</div>");
            infoElement.append(closeButton);

            closeButton.click(function(e) {
                infoElement.fadeOut('medium');
            });

            infoElement.hide();
            misinfoMarkerWrapper.append(infoElement);
            var nodeToFind = $("div[class='mtm']"); // look for div with only class = mtm; other posts had two classes --> mtm _5pco or mtm xxxx which caused multiple addition of the wrapper
            node.find(nodeToFind).before(misinfoMarkerWrapper);

            misinfoMarker.click(function(e) {
                infoElement.fadeIn('medium');
            });
        } else {
            var reportButtonWrapper = node.find('._42nr ._1mto').first().clone();
            reportButtonWrapper.attr('id', 'misinfoReportBtn');
            reportButtonWrapper.find('a').removeClass('UFILikeLink _4x9- _4x9_ _48-k');
            reportButtonWrapper.find('a').html('Report Misinfo');
            reportButtonWrapper.find('a').css('color', '#ff9022');
            reportButtonWrapper.click(function(e) {
                _handleClickbairReport(postData);
            });
            node.find('._42nr').append(reportButtonWrapper);
        }
    };


    // Function to prepare API call to the server and handle response
    var _callmisinfoApi = function(title, text, linkUrl, post, shared_post, node) {
        var postData = {
            title: title,
            text: text,
            url: linkUrl,
            post: post,
            sharedPost: shared_post
        };

        var misinfo_result = {
          "data": {
            "decision": "misinfo",
            "confidence": "0.90",
            "explanation": "Why it is misinfo?",
            "verified_by": "snoops.com",
            "verification_link": "www.verified.com"
          }
        };

        var non_misinfo_result = {
          "data": {
            "decision": "non_misinfo",
            "confidence": "0.90",
            "explanation": "Why it is misinfo?",
            "verified_by": "snoops.com",
            "verification_link": "www.verified.com"
          }
        };

        // will handle the API call later. Currently working with some dummy data.
        var random_boolean = Math.random() >= 0.7;
        _handlemisinfoApiSuccess(misinfo_result.data, node, postData);

        // if (random_boolean) {
        //   _handlemisinfoApiSuccess(misinfo_result.data, node, postData);
        // }
        // else {
        //   _handlemisinfoApiSuccess(non_misinfo_result.data, node, postData);
        // }


        // $.post(API_URL, postData)
        //     .done(function onSuccess(result) {
        //         // result = dummyData;
        //         _handlemisinfoApiSuccess(result.data, node, postData);
        //     })
        //     .fail(function onError(xhr, status, error) {
        //         console.log(error);
        //     })
    };
    //
    // var _getOriginalLinkFromFacebookLink = function(link) {
    //     var matchBegin = "php?u=";
    //     return link.substring(link.lastIndexOf(matchBegin) + matchBegin.length, link.lastIndexOf("&h="));
    // }
    //
    // Function to search Facebook and find all the links
    var loop = function() {
        $(facebook_link_post_container).each(function(obj) {
            var nodeObj = $(this);

            // if node has already been checked
            if (nodeObj.hasClass(checked_link_tag)) return;

            // add node checked class
            nodeObj.addClass(checked_link_tag);

            //post is the status posted by a user

            var post = nodeObj.find(misinfo_marker_container_fb).text();
            // if (post) console.log('Post', post);

            //shared post is the status user shared from another user

            var shared_post = nodeObj.find(facbook_shared_post_container_class).find('p').text();
            // if (shared_post) console.log('Shared Post', shared_post);

            var linkObj = nodeObj.find(facebook_link_post_container_link);
            linkObj.mouseenter();

            // link is the url of the shared content (news article, video etc.)
            var link = linkObj.attr('href');



            // title is the headline of a news article or video
            // text is the subtitle or thumbnail text
            var text = nodeObj.find(facebook_link_post_container_text).text();
            var title = nodeObj.find(facebook_link_post_container_title).text();


            // if (link) console.log('link', link);
            // if (text) console.log('text', text);
            // if (title) console.log('title', title);
            linkObj.mouseleave();
            _callmisinfoApi(title, text, link, post, shared_post, nodeObj);
        });
    };

    (function init() {
        if (document.URL.match("http(s|):\/\/(www.|)facebook")) {
            IS_FACEBOOK = true;
        }

        if (IS_FACEBOOK) {
            console.log("Covid19 Misinfo Tracker Active on Facebook");
            document.onscroll = loop;
            loop();
        }
    })();
});
