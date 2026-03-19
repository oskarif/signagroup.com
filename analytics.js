!function(t,e){var o,n,p,r;e.__SV||(window.posthog&&window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init ir nr Bi rr ar Ze er capture calculateEventProperties dr register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey cancelPendingSurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty cr hr createPersonProfile setInternalOrTestUser pr Xe gr opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing lr debug At vr getPageViewId captureTraceFeedback captureTraceMetric Je".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

posthog.init("phc_nIkISpycn4SQoijnu6Nbi8XBV2Vk2LCxkwBGUSKyGZF",{
    api_host:"https://eu.i.posthog.com",
    defaults:"2026-01-30",
    person_profiles:"identified_only"
});

(function() {
    function getPageName() {
        var path = window.location.pathname || "";
        var filename = path.split("/").pop() || "";
        if (!filename || filename === "index.html") return "index";
        if (filename === "signature.html") return "signature";
        return filename.replace(".html", "") || "unknown";
    }

    function capturePosthogEvent(eventName, properties) {
        if (!window.posthog || typeof window.posthog.capture !== "function") return;
        posthog.capture(eventName, properties || {});
    }

    function getLinkLocation(link) {
        if (link.closest("#contact-modal")) return "modal";
        if (link.closest("header") || link.closest("#nav-links")) return "nav";
        if (link.closest("#hero")) return "hero";
        if (link.closest("#contact") || link.closest(".cta-section")) return "cta_section";
        if (link.closest("footer")) return "footer";
        return "page";
    }

    function trackLinkClick(link, pageName) {
        var href = link.getAttribute("href") || "";
        capturePosthogEvent("link_clicked", {
            page: pageName,
            link_text: (link.textContent || "").trim().slice(0, 100),
            href: href,
            link_location: getLinkLocation(link),
            in_modal: !!link.closest("#contact-modal"),
            opens_modal: href === "#" && (link.getAttribute("onclick") || "").indexOf("openContactModal") !== -1
        });
    }

    function trackButtonClick(button, pageName) {
        capturePosthogEvent("button_clicked", {
            page: pageName,
            button_text: (button.textContent || "").trim().slice(0, 100),
            button_type: button.getAttribute("type") || "button",
            button_id: button.id || "",
            button_class: button.className || "",
            link_location: button.closest("#contact-modal") ? "modal" : "page",
            in_modal: !!button.closest("#contact-modal")
        });
    }

    function attachClickListeners(pageName) {
        document.querySelectorAll("a").forEach(function(link) {
            link.addEventListener("click", function() {
                trackLinkClick(link, pageName);
            });
        });
        document.querySelectorAll("button").forEach(function(button) {
            button.addEventListener("click", function() {
                trackButtonClick(button, pageName);
            });
        });
    }

    function trackSignatureSectionViews(pageName) {
        if (pageName !== "signature" || typeof IntersectionObserver === "undefined") return;
        var sectionConfig = [
            { id: "hero", name: "Hero" },
            { id: "features", name: "Features" },
            { id: "problem", name: "Problem" },
            { id: "benefits", name: "Benefits" },
            { id: "contact", name: "Contact CTA" },
            { id: "footer", name: "Footer" }
        ];
        var seen = {};
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                var id = entry.target && entry.target.id;
                if (!entry.isIntersecting || !id || seen[id]) return;
                seen[id] = true;
                var config = sectionConfig.find(function(c) { return c.id === id; });
                capturePosthogEvent("section_viewed", {
                    page: pageName,
                    section_id: id,
                    section_name: config ? config.name : id
                });
            });
        }, { threshold: 0.2, rootMargin: "0px" });

        sectionConfig.forEach(function(c) {
            var sectionEl = document.getElementById(c.id);
            if (sectionEl) observer.observe(sectionEl);
        });
    }

    document.addEventListener("DOMContentLoaded", function() {
        var pageName = getPageName();
        capturePosthogEvent("landing_page_loaded", {
            page: pageName,
            url: window.location.href
        });
        attachClickListeners(pageName);
        trackSignatureSectionViews(pageName);
    });
})();
