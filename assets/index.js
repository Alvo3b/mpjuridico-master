$(function () {
    function r(b, d) {
        var a = "https://api.instagram.com/v1/" + b + "?",
            c;
        for (c in d) a += "&" + c + "=" + d[c];
        return a
    }

    function m(b, d) {
        var a = $.Deferred(),
            c = [],
            h = function (b, d) {
                $.ajax({
                    url: r(b, d),
                    type: "GET",
                    dataType: "jsonp"
                }).done(function (g) {
                    g.data && g.data.length ? (c = c.concat(g.data), g.data.length < e ? (e -= g.data.length, g.pagination.next_max_id ? h(b, $.extend(d, {
                        count: e,
                        max_id: g.pagination.next_max_id
                    })) : a.resolve(c)) : g.pagination.next_max_id ? a.resolve(c, g.pagination.next_max_id) : a.resolve(c)) : a.reject()
                }).fail(function () {
                    a.reject()
                })
            },
            e = d.count;
        h(b, d);
        return a.promise()
    }

    function n(b, d) {
        return ['<div class="inst-card slide" style="padding: ' + d + 'px">', '   <a class="inst-card__link" href="' + b.link + '" target="_blank" style="background-image: url(' + b.images.standard_resolution.url + ')"></a>', '   <a class="inst-card__info" href="' + b.link + '" target="_blank">', '       <div class="inst-card__info-inner">', '           <span class="inst-card__likes"><span class="mbri-like"></span>&nbsp;' + b.likes.count + "</span>&nbsp;&nbsp;", '           <span class="inst-card__comments"><span class="mbri-cust-feedback"></span>&nbsp;' +
            b.comments.count + "</span>", "       </div>\n   </a>\n</div>"
        ].join("\n")
    }
    $(document).on("add.cards change.cards", function (b) {
        if ($(b.target).hasClass("mbr-instagram-feed")) {
            var d = function () {
                    c.$content.empty();
                    c.$content.append('<div class="inst__error">Error download Instagram data!</div>');
                    c.hideLoader()
                },
                a = $(b.target),
                c = {
                    $loader: $('<div class="inst__loader-wrapper">\n   <div class="inst__loader">\n      <span></span>\n      <span></span>\n      <span></span>\n   </div>\n</div>'),
                    $content: a.find(".inst__content"),
                    $moreButton: a.find(".inst__more a"),
                    showLoader: function () {
                        $(".inst__loader-wrapper").length || a.append(this.$loader)
                    },
                    hideLoader: function () {
                        this.$loader.remove()
                    }
                },
                h = a.attr("data-token"),
                e = a.attr("data-per-row-grid"),
                p = a.attr("data-rows"),
                f = a.attr("data-per-row-slider"),
                g = a.attr("data-spacing");
            b = a.attr("data-full-width");
            var k;
            if (h && (e ? k = "grid" : f && (k = "slider"), k)) switch (b ? a.find(".container_toggle").addClass("container-fluid").removeClass("container") : a.find(".container_toggle").addClass("container").removeClass("container-fluid"),
                k) {
                case "grid":
                    c.showLoader();
                    m("users/self/media/recent", {
                        access_token: h,
                        count: e * p
                    }).then(function (a, b) {
                        function f() {
                            var a = c.$content.find(".inst-card"),
                                b;
                            b = 500 > $(window).width() ? 100 : 800 > $(window).width() ? 50 : 100 / e;
                            a.css({
                                width: b + "%",
                                "float": "left"
                            });
                            a.css({
                                height: c.$content.find(".inst-card").outerWidth()
                            })
                        }

                        function q(a, b) {
                            for (var d = 0, e = a.length; d < e; d++) c.$content.find(".inst__images").append(n(a[d], g));
                            $(window).on("resize", function (c) {
                                f()
                            });
                            f();
                            b ? c.$moreButton.attr("data-max-id", b) : c.$moreButton.remove()
                        }
                        c.hideLoader();
                        c.$content.empty();
                        c.$content.append('<div class="inst__images clearfix"></div>');
                        q(a, b);
                        c.$moreButton.on("click", function (a) {
                            var b = $(this).attr("data-max-id");
                            window.mbrAppCore || (a.preventDefault(), c.showLoader(), m("users/self/media/recent", {
                                access_token: h,
                                count: e * p,
                                max_id: b
                            }).done(function (a, b) {
                                q(a, b);
                                c.hideLoader()
                            }).fail(d))
                        })
                    }).fail(d);
                    break;
                case "slider":
                    c.showLoader(), m("users/self/media/recent", {
                        access_token: h,
                        count: 3 * f
                    }).then(function (a, b) {
                        var d = b ? b : null;
                        c.hideLoader();
                        c.$content.empty();
                        c.$content.append('<div class="inst__images"></div>');
                        for (var e = 0, k = a.length; e < k; e++) c.$content.find(".inst__images").append(n(a[e], g));
                        var l = c.$content.find(".inst__images");
                        l.on("init, setPosition", function (a) {
                            a = $(this).find(".inst-card");
                            var c = a.css("width");
                            a.css("height", c);
                            return !0
                        });
                        l.slick({
                            infinite: !1,
                            slidesToShow: Number.parseInt(f),
                            slidesToScroll: Number.parseInt(f),
                            arrows: !0,
                            slide: ".slide",
                            responsive: [{
                                breakpoint: 800,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 2,
                                    arrows: !1
                                }
                            }, {
                                breakpoint: 500,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1,
                                    arrows: !1
                                }
                            }]
                        });
                        l.on("afterChange", function (a, b, e) {
                            e + +f >= b.slideCount && d && (c.showLoader(), m("users/self/media/recent", {
                                access_token: h,
                                count: 2 * f,
                                max_id: d
                            }).then(function (a, b) {
                                var e = [];
                                c.hideLoader();
                                for (var f = 0, h = a.length; f < h; f++) e.push(n(a[f], g));
                                l.slick("slickAdd", e.join("\n"));
                                l.find(".slick-arrow").remove();
                                l.slick("reinit");
                                d = b ? b : null
                            }))
                        })
                    }).fail(d)
            }
        }
    })
});
