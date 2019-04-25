"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var modal =
/*#__PURE__*/
function () {
  function modal(type, trackingId) {
    _classCallCheck(this, modal);

    this._createModal(type, trackingId);
  }

  _createClass(modal, [{
    key: "_createModal",
    value: function _createModal(type, trackingId) {
      var self = this;
      jQuery(function ($) {
        var base = $("<div class=\"pn-modal\"><div class=\"pn-modal-content\" id=\"rec-modal\">\n    <div class=\"pn-header\">\n        <button class=\"pn-modal__close unbutton\" id=\"close\">\n            <svg width=\"18\" height=\"18\" viewBox=\"0 0 18 18\" xmlns=\"http://www.w3.org/2000/svg\">\n                <path fill-rule=\"evenodd\" clip-rule=\"evenodd\"\n                      d=\"M1.38464 0L0 1.38477L7.6153 9L0 16.6152L1.38464 18L9 10.3848L16.6154 18L18 16.6157L10.3846 9L18.0001 1.38477L16.6154 0L8.99988 7.61523L1.38464 0Z\"/>\n            </svg>\n        </button>\n        <img class=\"pn-header__background\"\n             src=\"https://i.piano.io/managedservices/the-washington-times/theChive_Logo.svg\" width=\"173\" height=\"36.18\"\n             alt=\"\">\n    </div>\n    <div class=\"content\">\n        <h1 class=\"h1\">Don't miss our most popular &#x1F600;Humor, &#x1F525;Hotness and &#x1F397;Humanity posts!</h1>\n    </div>\n    <div id=\"li_recommended_content\">\n    </div>\n</div></div>");
        var extra = $('<div></div>');

        self._parseLiftIgnite(base);

        $('#close', base).click(function () {
          base.remove();
        });
        $('body').append(base);
        var oldSize = $(document).width();
        $(window).resize(function () {
          var newWidth = $("#rec-modal", base).width(); // if we crossed a threshold, call refresh() to get a new ad

          if (oldSize < 970 && newWidth >= 970) {
            oldSize = newWidth;
            googletag.pubads().refresh();
          } else if (oldSize >= 970 && newWidth < 970) {
            oldSize = newWidth;
            googletag.pubads().refresh();
          }
        });

        switch (type) {
          case 'ad':
            extra = $("<div id=\"ad-container\">\n                                </div>\n                                <p class=\"ad_text\">ADVERTISEMENT</p>");

            self._createAds();

            break;

          case 'subscribe':
            extra = $("<div class=\"join-now\">\n                                  <p class=\"CTA_text\">Get your chive on. Join now.</p>\n                                  <button class=\"pn-modal__join\" type=\"button\" id=\"subscribe\" data-link=\"".concat(self.subscribeLink, "\">BECOME A MEMBER</button>\n                                  </div>\n                                  <div class=\"pn-modal__footer\">\n                                  </div>\n                                </div>"));
            $('.pn-modal__join', extra).click(function () {
              if (trackingId) {
                try {
                  tp.log.logMicroConversion(trackingId, self.externalEventId, {});
                } catch (e) {// Suppress
                }
              }

              location.href = $(this).attr('data-link');
            });
            break;
        }

        $('.pn-modal-content', base).append(extra);
      });
    }
  }, {
    key: "_initAdServer",
    value: function _initAdServer() {
      var self = this; // if (pbjs_piano.initAdserverSet) return;

      pbjs_piano.initAdserverSet = true;
      googletag.cmd.push(function () {
        pbjs_piano.que.push(function () {
          var slots = googletag.pubads().getSlots().filter(function (slot) {
            return slot.getSlotElementId() === 'ppb-ad-1';
          });
          pbjs_piano.setTargetingForGPTAsync();
          googletag.pubads().refresh(slots);
        });
      });
    }
  }, {
    key: "_createAds",
    value: function _createAds(base) {
      var self = this;
      jQuery(function ($) {
        // place our ad after the given selector
        var div = $('<div id="ppb-ad-1"></div>');
        $('#ad-container', base).append(div); // configureable timeout

        var PREBID_TIMEOUT = 1000;
        var FAILSAFE_TIMEOUT = 3000; // initiates the header bidding request to
        // each ad network asking for their best bid

        pbjs_piano.que.push(function () {
          pbjs_piano.requestBids({
            bidsBackHandler: self._initAdServer,
            timeout: PREBID_TIMEOUT
          });
        }); // catchall timeout, to make sure we show an ad, even
        // if header bidding fails or hits an error

        setTimeout(function () {
          self._initAdServer();
        }, FAILSAFE_TIMEOUT);
      });
    }
  }, {
    key: "_createArticleCard",
    value: function _createArticleCard(base, article) {
      jQuery(function ($) {
        var card = $("<div class=\"pn-card\"><a href=\"".concat(article.url, "\"> <img class=\"img\" src=\"").concat(article.image, "\" alt=\"Avatar\" style=\"width:100%\">\n                                <h4><b>").concat(article.title, "</b></h4></a></div>"));
        $('#li_recommended_content', base).append(card);
      });
    }
  }, {
    key: "_parseLiftIgnite",
    value: function _parseLiftIgnite(base) {
      var self = this;
      var li_num_posts = 0;
      var li_tag = document.getElementById('liftigniter-received-json');
      var li_timer = setInterval(function () {
        var li_json = JSON.parse(li_tag.innerText);

        if (li_num_posts !== li_json.length) {
          li_json.forEach(function (article) {
            self._createArticleCard(base, article);

            clearInterval(li_timer);
          });
        }

        li_num_posts = li_json.length;
      }, 1000);
    }
  }], [{
    key: "init",
    value: function init(interestsTargeting, segmentsTargeting, urlTargeting, subscribeLink) {
      this.prototype.externalEventId = 'offer-join-now';
      this.prototype.subscribeLink = subscribeLink;
      var pbjsSrc = '//s3.amazonaws.com/piano-prebid/piano/pbjs_piano.js';
      var adUnits = [{
        code: "ppb-ad-1",
        mediaTypes: {
          banner: {
            sizes: [[300, 250], [970, 250]]
          }
        },
        bids: [{
          bidder: "appnexus",
          params: {
            placementId: 14849878
          }
        }, {
          bidder: 'rubicon',
          params: {
            accountId: '13322',
            siteId: '239774',
            zoneId: '1183570'
          }
        }]
      }];
      var adService = '/33049290/PIANO';
      this.loadPB(pbjsSrc, adUnits, adService, interestsTargeting, segmentsTargeting, urlTargeting);
      this.addCss();
    }
  }, {
    key: "createAdModal",
    value: function createAdModal(trackingId) {
      new modal('ad', trackingId);
    }
  }, {
    key: "createSubscribeModal",
    value: function createSubscribeModal(trackingId) {
      new modal('subscribe', trackingId);
    }
  }, {
    key: "loadPB",
    value: function loadPB(pbjsSrc, adUnits, adService, interestsTargeting, segmentsTargeting, urlTargeting) {
      var self = this;
      var s = document.createElement("script");
      s.src = pbjsSrc;
      s.type = "text/javascript";
      s.async = true;
      document.getElementsByTagName("head")[0].appendChild(s); // this initiates PrebidJS

      window.pbjs_piano = window.pbjs_piano || {};
      pbjs_piano.que = pbjs_piano.que || [];
      pbjs_piano.que.push(function () {
        pbjs_piano.setConfig({
          sizeConfig: [{
            mediaQuery: '(min-width: 1290px)',
            sizesSupported: [[970, 250]],
            labels: ["desktop"]
          }, {
            mediaQuery: '(min-width: 0px) and (max-width: 1289px)',
            sizesSupported: [[300, 250]],
            labels: ["mobile"]
          }]
        });
        pbjs_piano.addAdUnits(adUnits);
      }); // this initiates the Google Ad library called "GPT"

      window.googletag = window.googletag || {};
      googletag.cmd = googletag.cmd || []; // GPT setup

      googletag.cmd.push(function () {
        var mapping = googletag.sizeMapping().addSize([1290, 0], [970, 250]).addSize([0, 0], [300, 250]).build();
        googletag.defineSlot(adService, mapping, 'ppb-ad-1').defineSizeMapping(mapping).addService(googletag.pubads());
        googletag.pubads().setCentering(true);
        googletag.pubads().collapseEmptyDivs();
        googletag.pubads().enableSingleRequest();
        googletag.pubads().disableInitialLoad();
        googletag.pubads().setTargeting("interests", interestsTargeting);
        googletag.pubads().setTargeting("segments", segmentsTargeting);
        googletag.pubads().setTargeting("url", urlTargeting);
        googletag.enableServices();
      });
    }
  }, {
    key: "addCss",
    value: function addCss() {
      var styleNode = document.createElement("style");
      styleNode.innerText = ".pn-modal {display: block;position: fixed;z-index: 20001;left: 0;top: 130px;width: 100%;height: 100%;overflow: auto;background-color: rgb(0, 0, 0);background-color: rgba(0, 0, 0, 0.4);}.pn-modal-content {background-color: #fefefe;margin: 0 auto;border: 1px solid #888;padding-bottom: 20px;width: 75%;}/*font*/@font-face {font-family: 'Helvetica Neue';font-weight: bold;font-style: normal;}@font-face {font-family: 'Helvetica Neue';font-weight: 300;font-style: normal;}.content {width: 970px;margin: 15px auto 10px auto;display: block;text-align: center;}.visually-hidden {position: absolute;width: 1px;height: 1px;margin: -1px;border: 0;padding: 0;white-space: nowrap;-webkit-clip-path: inset(100%);clip-path: inset(100%);clip: rect(0 0 0 0);overflow: hidden;}.pn-modal__close {float: right;margin-top: 15px;margin-right: 25px;width: 18px;height: 18px;}.pn-modal__close svg {fill: #00C300;-webkit-transition: fill 0.2s linear;transition: fill 0.2s linear;}.pn-modal__close:hover svg, .pn-modal__close:focus svg {fill: #00C300;}.pn-modal h1 {font-size: 25px;font-weight: bold;line-height: 38px;font-family: 'Helvetica Neue', sans-serif;margin: 0;}.pn-header {width: 100%;height: 77px;background-color: #000000;border-bottom: 3px solid #00C300;}.pn-header__background {width: 173px;height: 36.18px;float: left;margin: 20px 35px;}.unbutton {color: inherit;text-decoration: none;background-color: rgba(0, 0, 0, 0);-webkit-box-shadow: none;box-shadow: none;text-shadow: none;border: 0;}#li_recommended_content {width: 100%;display: flex;flex-wrap: wrap;flex-direction: row;justify-content: center;margin-bottom: 20px;}.pn-card {transition: 0.3s;width: 20%;position: relative;margin-right: 25px;margin-left: 25px;margin-top: 15px;}.pn-card:hover {box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);}/*.container {*//*width: 100%;*//*}*/.pn-card h4 {font-size: 12px;position: absolute;z-index: 20002;bottom: 30px;margin: 0 10px;background-color: #000000;line-height: 20px;color: #ffffff;}.pn-modal a {color: #ffffff;text-decoration: none;font-family: 'Helvetica Neue';font-style: normal;}.pn-modal .img {width: 100%;height: 100%;border: 1px solid #00C300;}.pn-modal .ad {margin: auto;display: block;padding: 25px;width: 100%;}.pn-modal .ad_text {text-align: center;font-size: 11px;color: #00C300;font-family: 'Helvetica Neue';font-style: normal;}.pn-modal .CTA_text {font-family: 'Helvetica Neue', sans-serif;text-align: center;font-size: 29px;margin: 40px;}.pn-modal .pn-modal__join {width: 250px;margin: 0 auto;display: block;padding: 10px 5px;font-family: 'Helvetica', sans-serif;font-weight: 900;font-size: 16px;line-height: 20px;color: #ffffff;background-color: #00C300;transition: background-color 0.2s linear;}.pn-modal__join:hover, .pn-modal__join:focus {background-color: #00C300;color: #ffffff;border: 2px solid #00c300;}.pn-modal__join:active {opacity: 0.8;}.pn-modal__join:visited {color: #ffffff;background-color: #00c300;}@media only screen and (max-width: 1448px) {.pn-modal .content {width: 480px;}}";
      document.getElementsByTagName("head")[0].appendChild(styleNode);
    }
  }]);

  return modal;
}();