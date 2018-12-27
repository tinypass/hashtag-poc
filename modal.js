class modal {
    constructor(type) {
        this._createModal(type)
    }

    _createModal(type) {
        var self = this;
        jQuery(function ($) {
            let base = $(`<div class="modal"><div class="modal-content" id="rec-modal">
    <div class="pn-header">
        <button class="pn-modal__close unbutton" id="close">
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M1.38464 0L0 1.38477L7.6153 9L0 16.6152L1.38464 18L9 10.3848L16.6154 18L18 16.6157L10.3846 9L18.0001 1.38477L16.6154 0L8.99988 7.61523L1.38464 0Z"/>
            </svg>
        </button>
        <img class="pn-header__background"
             src="https://i.piano.io/managedservices/the-washington-times/theChive_Logo.svg" width="173" height="36.18"
             alt="">
    </div>
    <div class="content">
        <h1 class="h1">Don't miss our most popular &#x1F600;Humor, &#x1F525;Hotness and &#x1F397;Humanity posts!</h1>
    </div>
    <div id="li_recommended_content">
    </div>
</div></div>`);
            var extra = $('<div></div>');

            self._parseLiftIgnite(base);

            $('#close', base).click(function () {
                base.remove()
            });

            $('body').append(base);

            switch (type) {
                case 'ad':
                    extra = $(`<div id="ad-container">
                                </div>
                                <p class="ad_text">ADVERTISEMENT</p>`);
                    self._createAds();
                    break;
                case 'subscribe':
                    extra = $(`<div class="join-now">
                                  <p class="CTA_text">Get your chive on. Join now.</p>
                                  <button class="pn-modal__join" type="button" id="subscribe" external-event="offer-join-now" data-link="${self.subscribeLink}">BECOME A MEMBER</button>
                                  </div>
                                  <div class="pn-modal__footer">
                                  </div>
                                </div>`);
                    $('.pn-modal__join', extra).click(function () {
                        location.href = $(this).attr('data-link');
                    });
                    break;
            }

            $('.modal-content',base).append(extra);
        });
    }

    _initAdServer() {
        // if (pbjs_piano.initAdserverSet) return;
        pbjs_piano.initAdserverSet = true;
        googletag.cmd.push(function () {
            pbjs_piano.que.push(function () {
                var slots = googletag
                    .pubads()
                    .getSlots()
                    .filter(function (slot) {
                        return slot.getSlotElementId() == "ppb-ad-1";
                    });
                pbjs_piano.setTargetingForGPTAsync();
                googletag.pubads().refresh(slots);
            });
        });
    }

    _createAds(base) {
        var self = this;
        jQuery(function ($) {
            // place our ad after the given selector
            let div = $('<div id="ppb-ad-1"></div>');
            $('#ad-container', base).append(div);

            // configureable timeout
            let PREBID_TIMEOUT = 1000;
            let FAILSAFE_TIMEOUT = 3000;

            // initiates the header bidding request to
            // each ad network asking for their best bid
            pbjs_piano.que.push(function () {
                pbjs_piano.requestBids({
                    bidsBackHandler: self._initAdServer,
                    timeout: PREBID_TIMEOUT
                });
            });

            // catchall timeout, to make sure we show an ad, even
            // if header bidding fails or hits an error
            setTimeout(function () {
                self._initAdServer();
            }, FAILSAFE_TIMEOUT);
        })


    }

    _createArticleCard(base, article) {
        jQuery(function ($) {
            var card = $(`<div class="card"><a href="${article.url}"> <img class="img" src="${article.image}" alt="Avatar" style="width:100%">
                                <h4><b>${article.title}</b></h4></a></div>`);
            $('#li_recommended_content', base).append(card)
        });
    }

    _parseLiftIgnite(base) {
        var self = this;
        var li_num_posts = 0;
        var li_tag = document.getElementById('liftigniter-received-json');
        var li_timer = setInterval(function () {
            var li_json = JSON.parse(li_tag.innerText);
            if (li_num_posts !== li_json.length) {
                li_json.forEach((article) => {
                    self._createArticleCard(base, article)
                })
            }

            li_num_posts = li_json.length;
        }, 1000);
    }

    static loadPB(pbjsSrc, adUnits, adService, interestsTargeting, segmentsTargeting, urlTargeting) {
        var s = document.createElement("script");
        s.src = pbjsSrc;
        s.type = "text/javascript";
        s.async = true;
        document.getElementsByTagName("head")[0].appendChild(s);

        // this initiates PrebidJS
        window.pbjs_piano = window.pbjs_piano || {};
        pbjs_piano.que = pbjs_piano.que || [];
        pbjs_piano.que.push(function () {
            pbjs_piano.addAdUnits(adUnits);
        });

        // this initiates the Google Ad library called "GPT"
        window.googletag = window.googletag || {};
        googletag.cmd = googletag.cmd || [];

        // GPT setup


        googletag.cmd.push(function () {

            var mapping = googletag.sizeMapping().addSize([1290, 0], [970, 250]).addSize([0, 0], [300, 250]).build();
            googletag.defineSlot(adService, mapping, 'ppb-ad-1').defineSizeMapping(mapping).addService(googletag.pubads())
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

    static addCss() {
        var styleNode = document.createElement("style");
        styleNode.innerText = `.modal {display: block;position: fixed;z-index: 20001;left: 0;top: 0;width: 100%;height: 100%;overflow: auto;background-color: rgb(0,0,0);background-color: rgba(0,0,0,0.4);}.modal-content {background-color: #fefefe;margin: 0 auto;border: 1px solid #888;padding-bottom: 20px;width: 75%;}/*font*/@font-face {font-family: 'Helvetica Neue';font-weight: bold;font-style: normal;}@font-face {font-family: 'Helvetica Neue';font-weight: 300;font-style: normal;}body{background-color: #ffffff;color: #000000;}.content{width: 970px;margin: 15px auto 10px auto;display: block;text-align: center;}.visually-hidden {position: absolute;width: 1px;height: 1px;margin: -1px;border: 0;padding: 0;white-space: nowrap;-webkit-clip-path: inset(100%);clip-path: inset(100%);clip: rect(0 0 0 0);overflow: hidden;}.pn-modal__close {float: right;margin-top: 15px;margin-right: 25px;width: 18px;height: 18px;}.pn-modal__close svg {fill: #00C300;-webkit-transition: fill 0.2s linear;transition: fill 0.2s linear;}.pn-modal__close:hover svg,.pn-modal__close:focus svg {fill: #00C300;}h1 {font-size: 25px;font-weight: bold;line-height: 38px;font-family: 'Helvetica Neue', sans-serif;margin: 0;}.pn-header {width: 100%;height: 77px;background-color: #000000;border-bottom: 3px solid #00C300;}.pn-header__background {width: 173px;height: 36.18px;float: left;margin: 20px 35px;}.unbutton {color: inherit;text-decoration: none;background-color: rgba(0, 0, 0, 0);-webkit-box-shadow: none;box-shadow: none;text-shadow: none;border: 0;}#li_recommended_content{width: 100%;display: flex;flex-wrap: wrap;flex-direction: row;justify-content: center;margin-bottom: 20px;}.card {transition: 0.3s;width: 20%;position: relative;margin-right: 25px;margin-left: 25px;margin-top: 15px;}.card:hover{box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);}.container{width: 100%;}.card h4 {font-size: 12px;position: absolute;z-index: 20002;bottom: 30px;margin: 0 10px;background-color: #000000;line-height: 20px;color: #ffffff;}a{color: #ffffff;text-decoration: none;font-family: 'Helvetica Neue';font-style: normal;}.img{width: 100%;height: 100%;border: 1px solid #00C300;}.ad{margin: auto;display: block;padding: 25px;width: 100%;}.ad_text{text-align: center;font-size: 11px;color: #00C300;font-family: 'Helvetica Neue';font-style: normal;}.CTA_text{font-family: 'Helvetica Neue', sans-serif;text-align: center;font-size: 29px;margin: 40px;}.pn-modal__join {width: 250px;margin: 0 auto;display: block;padding: 10px 5px;font-family: 'Helvetica', sans-serif;font-weight: 900;font-size: 16px;line-height: 20px;color: #ffffff;background-color: #00C300;transition: background-color 0.2s linear;}.pn-modal__join:hover,.pn-modal__join:focus {background-color: #00C300;color: #ffffff;border: 2px solid #00c300;}.pn-modal__join:active {opacity: 0.8;}.pn-modal__join:visited{color: #ffffff;background-color: #00c300;}@media only screen and (max-width: 1448px) {.content{width: 480px;}}`;
        document.getElementsByTagName("head")[0].appendChild(styleNode);
    }

    static init(pbjsSrc, adUnits, adService, interestsTargeting, segmentsTargeting, urlTargeting, subscribeLink) {
        this.loadPB(pbjsSrc, adUnits, adService, interestsTargeting, segmentsTargeting, urlTargeting);
        this.prototype.subscribeLink = subscribeLink;
        this.addCss();
    }
}