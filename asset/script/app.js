/* global _gaq */
(function (doc, host) {
    'use strict';

    // Mouse button constants
    var MOUSE_BUTTON_LEFT = 0;

    // Get clicked button from event (nasty, not super reliable)
    function getClickedButton (evt) {
        if (evt.button) {
            return evt.button;
        }
        return MOUSE_BUTTON_LEFT;
    }

    // Is a link external?
    function isLinkExternal (link) {
        return (link.indexOf(host) === -1 && link.match(/^https?:\/\//i));
    }

    // Bind a click tracking event
    function bindClickTrackingEvent (link) {
        if (link.href && isLinkExternal(link.href)) {
            link.onclick = function (evt) {
                evt = evt || window.event;
                var button = getClickedButton(evt);
                if (window._gaq && _gaq.push) {
                    _gaq.push(['_trackEvent', 'External Links', 'Click', link.href]);
                    if (button === MOUSE_BUTTON_LEFT && !evt.metaKey) {
                        setTimeout(function() {
                            doc.location = link.href;
                        }, 100);
                        return false;
                    }
                }
            };
        }
    }

    // Get links
    var links = document.getElementsByTagName('a');

    // Outbound link click tracking
    var i, len = links.length;
    for (i = 0; i < len; i += 1) {
        bindClickTrackingEvent(links[i]);
    }

} (document, document.location.host));