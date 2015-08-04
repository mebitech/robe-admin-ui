var requirejs, require, define;
(function (global) {
    function isFunction(e) {
        return ostring.call(e) === "[object Function]"
    }

    function isArray(e) {
        return ostring.call(e) === "[object Array]"
    }

    function each(e, t) {
        if (e) {
            var n;
            for (n = 0; n < e.length; n += 1) {
                if (e[n] && t(e[n], n, e)) {
                    break
                }
            }
        }
    }

    function eachReverse(e, t) {
        if (e) {
            var n;
            for (n = e.length - 1; n > -1; n -= 1) {
                if (e[n] && t(e[n], n, e)) {
                    break
                }
            }
        }
    }

    function hasProp(e, t) {
        return hasOwn.call(e, t)
    }

    function getOwn(e, t) {
        return hasProp(e, t) && e[t]
    }

    function eachProp(e, t) {
        var n;
        for (n in e) {
            if (hasProp(e, n)) {
                if (t(e[n], n)) {
                    break
                }
            }
        }
    }

    function mixin(e, t, n, r) {
        if (t) {
            eachProp(t, function (t, i) {
                if (n || !hasProp(e, i)) {
                    if (r && typeof t === "object" && t && !isArray(t) && !isFunction(t) && !(t instanceof RegExp)) {
                        if (!e[i]) {
                            e[i] = {}
                        }
                        mixin(e[i], t, n, r)
                    } else {
                        e[i] = t
                    }
                }
            })
        }
        return e
    }

    function bind(e, t) {
        return function () {
            return t.apply(e, arguments)
        }
    }

    function scripts() {
        return document.getElementsByTagName("script")
    }

    function defaultOnError(e) {
        throw e
    }

    function getGlobal(e) {
        if (!e) {
            return e
        }
        var t = global;
        each(e.split("."), function (e) {
            t = t[e]
        });
        return t
    }

    function makeError(e, t, n, r) {
        var i = new Error(t + "\nhttp://requirejs.org/docs/errors.html#" + e);
        i.requireType = e;
        i.requireModules = r;
        if (n) {
            i.originalError = n
        }
        return i
    }

    function newContext(e) {
        function m(e) {
            var t, n, r = e.length;
            for (t = 0; t < r; t++) {
                n = e[t];
                if (n === ".") {
                    e.splice(t, 1);
                    t -= 1
                } else if (n === "..") {
                    if (t === 1 && (e[2] === ".." || e[0] === "..")) {
                        break
                    } else if (t > 0) {
                        e.splice(t - 1, 2);
                        t -= 2
                    }
                }
            }
        }

        function g(e, t, n) {
            var r, i, s, u, a, f, l, c, h, p, d, v = t && t.split("/"), g = v, y = o.map, b = y && y["*"];
            if (e && e.charAt(0) === ".") {
                if (t) {
                    g = v.slice(0, v.length - 1);
                    e = e.split("/");
                    l = e.length - 1;
                    if (o.nodeIdCompat && jsSuffixRegExp.test(e[l])) {
                        e[l] = e[l].replace(jsSuffixRegExp, "")
                    }
                    e = g.concat(e);
                    m(e);
                    e = e.join("/")
                } else if (e.indexOf("./") === 0) {
                    e = e.substring(2)
                }
            }
            if (n && y && (v || b)) {
                s = e.split("/");
                e:for (u = s.length; u > 0; u -= 1) {
                    f = s.slice(0, u).join("/");
                    if (v) {
                        for (a = v.length; a > 0; a -= 1) {
                            i = getOwn(y, v.slice(0, a).join("/"));
                            if (i) {
                                i = getOwn(i, f);
                                if (i) {
                                    c = i;
                                    h = u;
                                    break e
                                }
                            }
                        }
                    }
                    if (!p && b && getOwn(b, f)) {
                        p = getOwn(b, f);
                        d = u
                    }
                }
                if (!c && p) {
                    c = p;
                    h = d
                }
                if (c) {
                    s.splice(0, h, c);
                    e = s.join("/")
                }
            }
            r = getOwn(o.pkgs, e);
            return r ? r : e
        }

        function y(e) {
            if (isBrowser) {
                each(scripts(), function (t) {
                    if (t.getAttribute("data-requiremodule") === e && t.getAttribute("data-requirecontext") === r.contextName) {
                        t.parentNode.removeChild(t);
                        return true
                    }
                })
            }
        }

        function b(e) {
            var t = getOwn(o.paths, e);
            if (t && isArray(t) && t.length > 1) {
                t.shift();
                r.require.undef(e);
                r.require([e]);
                return true
            }
        }

        function w(e) {
            var t, n = e ? e.indexOf("!") : -1;
            if (n > -1) {
                t = e.substring(0, n);
                e = e.substring(n + 1, e.length)
            }
            return [t, e]
        }

        function E(e, t, n, i) {
            var s, o, u, a, f = null, l = t ? t.name : null, h = e, p = true, m = "";
            if (!e) {
                p = false;
                e = "_@r" + (d += 1)
            }
            a = w(e);
            f = a[0];
            e = a[1];
            if (f) {
                f = g(f, l, i);
                o = getOwn(c, f)
            }
            if (e) {
                if (f) {
                    if (o && o.normalize) {
                        m = o.normalize(e, function (e) {
                            return g(e, l, i)
                        })
                    } else {
                        m = g(e, l, i)
                    }
                } else {
                    m = g(e, l, i);
                    a = w(m);
                    f = a[0];
                    m = a[1];
                    n = true;
                    s = r.nameToUrl(m)
                }
            }
            u = f && !o && !n ? "_unnormalized" + (v += 1) : "";
            return {
                prefix: f,
                name: m,
                parentMap: t,
                unnormalized: !!u,
                url: s,
                originalName: h,
                isDefine: p,
                id: (f ? f + "!" + m : m) + u
            }
        }

        function S(e) {
            var t = e.id, n = getOwn(u, t);
            if (!n) {
                n = u[t] = new r.Module(e)
            }
            return n
        }

        function x(e, t, n) {
            var r = e.id, i = getOwn(u, r);
            if (hasProp(c, r) && (!i || i.defineEmitComplete)) {
                if (t === "defined") {
                    n(c[r])
                }
            } else {
                i = S(e);
                if (i.error && t === "error") {
                    n(i.error)
                } else {
                    i.on(t, n)
                }
            }
        }

        function T(e, t) {
            var n = e.requireModules, r = false;
            if (t) {
                t(e)
            } else {
                each(n, function (t) {
                    var n = getOwn(u, t);
                    if (n) {
                        n.error = e;
                        if (n.events.error) {
                            r = true;
                            n.emit("error", e)
                        }
                    }
                });
                if (!r) {
                    req.onError(e)
                }
            }
        }

        function N() {
            if (globalDefQueue.length) {
                apsp.apply(l, [l.length, 0].concat(globalDefQueue));
                globalDefQueue = []
            }
        }

        function C(e) {
            delete u[e];
            delete a[e]
        }

        function k(e, t, n) {
            var r = e.map.id;
            if (e.error) {
                e.emit("error", e.error)
            } else {
                t[r] = true;
                each(e.depMaps, function (r, i) {
                    var s = r.id, o = getOwn(u, s);
                    if (o && !e.depMatched[i] && !n[s]) {
                        if (getOwn(t, s)) {
                            e.defineDep(i, c[s]);
                            e.check()
                        } else {
                            k(o, t, n)
                        }
                    }
                });
                n[r] = true
            }
        }

        function L() {
            var e, n, i = o.waitSeconds * 1e3, u = i && r.startTime + i < (new Date).getTime(), f = [], l = [], c = false, h = true;
            if (t) {
                return
            }
            t = true;
            eachProp(a, function (e) {
                var t = e.map, r = t.id;
                if (!e.enabled) {
                    return
                }
                if (!t.isDefine) {
                    l.push(e)
                }
                if (!e.error) {
                    if (!e.inited && u) {
                        if (b(r)) {
                            n = true;
                            c = true
                        } else {
                            f.push(r);
                            y(r)
                        }
                    } else if (!e.inited && e.fetched && t.isDefine) {
                        c = true;
                        if (!t.prefix) {
                            return h = false
                        }
                    }
                }
            });
            if (u && f.length) {
                e = makeError("timeout", "Load timeout for modules: " + f, null, f);
                e.contextName = r.contextName;
                return T(e)
            }
            if (h) {
                each(l, function (e) {
                    k(e, {}, {})
                })
            }
            if ((!u || n) && c) {
                if ((isBrowser || isWebWorker) && !s) {
                    s = setTimeout(function () {
                        s = 0;
                        L()
                    }, 50)
                }
            }
            t = false
        }

        function A(e) {
            if (!hasProp(c, e[0])) {
                S(E(e[0], null, true)).init(e[1], e[2])
            }
        }

        function O(e, t, n, r) {
            if (e.detachEvent && !isOpera) {
                if (r) {
                    e.detachEvent(r, t)
                }
            } else {
                e.removeEventListener(n, t, false)
            }
        }

        function M(e) {
            var t = e.currentTarget || e.srcElement;
            O(t, r.onScriptLoad, "load", "onreadystatechange");
            O(t, r.onScriptError, "error");
            return {node: t, id: t && t.getAttribute("data-requiremodule")}
        }

        function _() {
            var e;
            N();
            while (l.length) {
                e = l.shift();
                if (e[0] === null) {
                    return T(makeError("mismatch", "Mismatched anonymous define() module: " + e[e.length - 1]))
                } else {
                    A(e)
                }
            }
        }

        var t, n, r, i, s, o = {
            waitSeconds: 7,
            baseUrl: "./",
            paths: {},
            bundles: {},
            pkgs: {},
            shim: {},
            config: {}
        }, u = {}, a = {}, f = {}, l = [], c = {}, h = {}, p = {}, d = 1, v = 1;
        i = {
            require: function (e) {
                if (e.require) {
                    return e.require
                } else {
                    return e.require = r.makeRequire(e.map)
                }
            }, exports: function (e) {
                e.usingExports = true;
                if (e.map.isDefine) {
                    if (e.exports) {
                        return c[e.map.id] = e.exports
                    } else {
                        return e.exports = c[e.map.id] = {}
                    }
                }
            }, module: function (e) {
                if (e.module) {
                    return e.module
                } else {
                    return e.module = {
                        id: e.map.id, uri: e.map.url, config: function () {
                            return getOwn(o.config, e.map.id) || {}
                        }, exports: e.exports || (e.exports = {})
                    }
                }
            }
        };
        n = function (e) {
            this.events = getOwn(f, e.id) || {};
            this.map = e;
            this.shim = getOwn(o.shim, e.id);
            this.depExports = [];
            this.depMaps = [];
            this.depMatched = [];
            this.pluginMaps = {};
            this.depCount = 0
        };
        n.prototype = {
            init: function (e, t, n, r) {
                r = r || {};
                if (this.inited) {
                    return
                }
                this.factory = t;
                if (n) {
                    this.on("error", n)
                } else if (this.events.error) {
                    n = bind(this, function (e) {
                        this.emit("error", e)
                    })
                }
                this.depMaps = e && e.slice(0);
                this.errback = n;
                this.inited = true;
                this.ignore = r.ignore;
                if (r.enabled || this.enabled) {
                    this.enable()
                } else {
                    this.check()
                }
            }, defineDep: function (e, t) {
                if (!this.depMatched[e]) {
                    this.depMatched[e] = true;
                    this.depCount -= 1;
                    this.depExports[e] = t
                }
            }, fetch: function () {
                if (this.fetched) {
                    return
                }
                this.fetched = true;
                r.startTime = (new Date).getTime();
                var e = this.map;
                if (this.shim) {
                    r.makeRequire(this.map, {enableBuildCallback: true})(this.shim.deps || [], bind(this, function () {
                        return e.prefix ? this.callPlugin() : this.load()
                    }))
                } else {
                    return e.prefix ? this.callPlugin() : this.load()
                }
            }, load: function () {
                var e = this.map.url;
                if (!h[e]) {
                    h[e] = true;
                    r.load(this.map.id, e)
                }
            }, check: function () {
                if (!this.enabled || this.enabling) {
                    return
                }
                var e, t, n = this.map.id, i = this.depExports, s = this.exports, o = this.factory;
                if (!this.inited) {
                    this.fetch()
                } else if (this.error) {
                    this.emit("error", this.error)
                } else if (!this.defining) {
                    this.defining = true;
                    if (this.depCount < 1 && !this.defined) {
                        if (isFunction(o)) {
                            if (this.events.error && this.map.isDefine || req.onError !== defaultOnError) {
                                try {
                                    s = r.execCb(n, o, i, s)
                                } catch (u) {
                                    e = u
                                }
                            } else {
                                s = r.execCb(n, o, i, s)
                            }
                            if (this.map.isDefine && s === undefined) {
                                t = this.module;
                                if (t) {
                                    s = t.exports
                                } else if (this.usingExports) {
                                    s = this.exports
                                }
                            }
                            if (e) {
                                e.requireMap = this.map;
                                e.requireModules = this.map.isDefine ? [this.map.id] : null;
                                e.requireType = this.map.isDefine ? "define" : "require";
                                return T(this.error = e)
                            }
                        } else {
                            s = o
                        }
                        this.exports = s;
                        if (this.map.isDefine && !this.ignore) {
                            c[n] = s;
                            if (req.onResourceLoad) {
                                req.onResourceLoad(r, this.map, this.depMaps)
                            }
                        }
                        C(n);
                        this.defined = true
                    }
                    this.defining = false;
                    if (this.defined && !this.defineEmitted) {
                        this.defineEmitted = true;
                        this.emit("defined", this.exports);
                        this.defineEmitComplete = true
                    }
                }
            }, callPlugin: function () {
                var e = this.map, t = e.id, n = E(e.prefix);
                this.depMaps.push(n);
                x(n, "defined", bind(this, function (n) {
                    var i, s, a, f = getOwn(p, this.map.id), l = this.map.name, c = this.map.parentMap ? this.map.parentMap.name : null, h = r.makeRequire(e.parentMap, {enableBuildCallback: true});
                    if (this.map.unnormalized) {
                        if (n.normalize) {
                            l = n.normalize(l, function (e) {
                                    return g(e, c, true)
                                }) || ""
                        }
                        s = E(e.prefix + "!" + l, this.map.parentMap);
                        x(s, "defined", bind(this, function (e) {
                            this.init([], function () {
                                return e
                            }, null, {enabled: true, ignore: true})
                        }));
                        a = getOwn(u, s.id);
                        if (a) {
                            this.depMaps.push(s);
                            if (this.events.error) {
                                a.on("error", bind(this, function (e) {
                                    this.emit("error", e)
                                }))
                            }
                            a.enable()
                        }
                        return
                    }
                    if (f) {
                        this.map.url = r.nameToUrl(f);
                        this.load();
                        return
                    }
                    i = bind(this, function (e) {
                        this.init([], function () {
                            return e
                        }, null, {enabled: true})
                    });
                    i.error = bind(this, function (e) {
                        this.inited = true;
                        this.error = e;
                        e.requireModules = [t];
                        eachProp(u, function (e) {
                            if (e.map.id.indexOf(t + "_unnormalized") === 0) {
                                C(e.map.id)
                            }
                        });
                        T(e)
                    });
                    i.fromText = bind(this, function (n, s) {
                        var u = e.name, a = E(u), f = useInteractive;
                        if (s) {
                            n = s
                        }
                        if (f) {
                            useInteractive = false
                        }
                        S(a);
                        if (hasProp(o.config, t)) {
                            o.config[u] = o.config[t]
                        }
                        try {
                            req.exec(n)
                        } catch (l) {
                            return T(makeError("fromtexteval", "fromText eval for " + t + " failed: " + l, l, [t]))
                        }
                        if (f) {
                            useInteractive = true
                        }
                        this.depMaps.push(a);
                        r.completeLoad(u);
                        h([u], i)
                    });
                    n.load(e.name, h, i, o)
                }));
                r.enable(n, this);
                this.pluginMaps[n.id] = n
            }, enable: function () {
                a[this.map.id] = this;
                this.enabled = true;
                this.enabling = true;
                each(this.depMaps, bind(this, function (e, t) {
                    var n, s, o;
                    if (typeof e === "string") {
                        e = E(e, this.map.isDefine ? this.map : this.map.parentMap, false, !this.skipMap);
                        this.depMaps[t] = e;
                        o = getOwn(i, e.id);
                        if (o) {
                            this.depExports[t] = o(this);
                            return
                        }
                        this.depCount += 1;
                        x(e, "defined", bind(this, function (e) {
                            this.defineDep(t, e);
                            this.check()
                        }));
                        if (this.errback) {
                            x(e, "error", bind(this, this.errback))
                        }
                    }
                    n = e.id;
                    s = u[n];
                    if (!hasProp(i, n) && s && !s.enabled) {
                        r.enable(e, this)
                    }
                }));
                eachProp(this.pluginMaps, bind(this, function (e) {
                    var t = getOwn(u, e.id);
                    if (t && !t.enabled) {
                        r.enable(e, this)
                    }
                }));
                this.enabling = false;
                this.check()
            }, on: function (e, t) {
                var n = this.events[e];
                if (!n) {
                    n = this.events[e] = []
                }
                n.push(t)
            }, emit: function (e, t) {
                each(this.events[e], function (e) {
                    e(t)
                });
                if (e === "error") {
                    delete this.events[e]
                }
            }
        };
        r = {
            config: o,
            contextName: e,
            registry: u,
            defined: c,
            urlFetched: h,
            defQueue: l,
            Module: n,
            makeModuleMap: E,
            nextTick: req.nextTick,
            onError: T,
            configure: function (e) {
                if (e.baseUrl) {
                    if (e.baseUrl.charAt(e.baseUrl.length - 1) !== "/") {
                        e.baseUrl += "/"
                    }
                }
                var t = o.shim, n = {paths: true, bundles: true, config: true, map: true};
                eachProp(e, function (e, t) {
                    if (n[t]) {
                        if (!o[t]) {
                            o[t] = {}
                        }
                        mixin(o[t], e, true, true)
                    } else {
                        o[t] = e
                    }
                });
                if (e.bundles) {
                    eachProp(e.bundles, function (e, t) {
                        each(e, function (e) {
                            if (e !== t) {
                                p[e] = t
                            }
                        })
                    })
                }
                if (e.shim) {
                    eachProp(e.shim, function (e, n) {
                        if (isArray(e)) {
                            e = {deps: e}
                        }
                        if ((e.exports || e.init) && !e.exportsFn) {
                            e.exportsFn = r.makeShimExports(e)
                        }
                        t[n] = e
                    });
                    o.shim = t
                }
                if (e.packages) {
                    each(e.packages, function (e) {
                        var t, n;
                        e = typeof e === "string" ? {name: e} : e;
                        n = e.name;
                        t = e.location;
                        if (t) {
                            o.paths[n] = e.location
                        }
                        o.pkgs[n] = e.name + "/" + (e.main || "main").replace(currDirRegExp, "").replace(jsSuffixRegExp, "")
                    })
                }
                eachProp(u, function (e, t) {
                    if (!e.inited && !e.map.unnormalized) {
                        e.map = E(t)
                    }
                });
                if (e.deps || e.callback) {
                    r.require(e.deps || [], e.callback)
                }
            },
            makeShimExports: function (e) {
                function t() {
                    var t;
                    if (e.init) {
                        t = e.init.apply(global, arguments)
                    }
                    return t || e.exports && getGlobal(e.exports)
                }

                return t
            },
            makeRequire: function (t, n) {
                function s(o, a, f) {
                    var l, h, p;
                    if (n.enableBuildCallback && a && isFunction(a)) {
                        a.__requireJsBuild = true
                    }
                    if (typeof o === "string") {
                        if (isFunction(a)) {
                            return T(makeError("requireargs", "Invalid require call"), f)
                        }
                        if (t && hasProp(i, o)) {
                            return i[o](u[t.id])
                        }
                        if (req.get) {
                            return req.get(r, o, t, s)
                        }
                        h = E(o, t, false, true);
                        l = h.id;
                        if (!hasProp(c, l)) {
                            return T(makeError("notloaded", 'Module name "' + l + '" has not been loaded yet for context: ' + e + (t ? "" : ". Use require([])")))
                        }
                        return c[l]
                    }
                    _();
                    r.nextTick(function () {
                        _();
                        p = S(E(null, t));
                        p.skipMap = n.skipMap;
                        p.init(o, a, f, {enabled: true});
                        L()
                    });
                    return s
                }

                n = n || {};
                mixin(s, {
                    isBrowser: isBrowser, toUrl: function (e) {
                        var n, i = e.lastIndexOf("."), s = e.split("/")[0], o = s === "." || s === "..";
                        if (i !== -1 && (!o || i > 1)) {
                            n = e.substring(i, e.length);
                            e = e.substring(0, i)
                        }
                        return r.nameToUrl(g(e, t && t.id, true), n, true)
                    }, defined: function (e) {
                        return hasProp(c, E(e, t, false, true).id)
                    }, specified: function (e) {
                        e = E(e, t, false, true).id;
                        return hasProp(c, e) || hasProp(u, e)
                    }
                });
                if (!t) {
                    s.undef = function (e) {
                        N();
                        var n = E(e, t, true), r = getOwn(u, e);
                        y(e);
                        delete c[e];
                        delete h[n.url];
                        delete f[e];
                        eachReverse(l, function (t, n) {
                            if (t[0] === e) {
                                l.splice(n, 1)
                            }
                        });
                        if (r) {
                            if (r.events.defined) {
                                f[e] = r.events
                            }
                            C(e)
                        }
                    }
                }
                return s
            },
            enable: function (e) {
                var t = getOwn(u, e.id);
                if (t) {
                    S(e).enable()
                }
            },
            completeLoad: function (e) {
                var t, n, r, i = getOwn(o.shim, e) || {}, s = i.exports;
                N();
                while (l.length) {
                    n = l.shift();
                    if (n[0] === null) {
                        n[0] = e;
                        if (t) {
                            break
                        }
                        t = true
                    } else if (n[0] === e) {
                        t = true
                    }
                    A(n)
                }
                r = getOwn(u, e);
                if (!t && !hasProp(c, e) && r && !r.inited) {
                    if (o.enforceDefine && (!s || !getGlobal(s))) {
                        if (b(e)) {
                            return
                        } else {
                            return T(makeError("nodefine", "No define call for " + e, null, [e]))
                        }
                    } else {
                        A([e, i.deps || [], i.exportsFn])
                    }
                }
                L()
            },
            nameToUrl: function (e, t, n) {
                var i, s, u, a, f, l, c, h = getOwn(o.pkgs, e);
                if (h) {
                    e = h
                }
                c = getOwn(p, e);
                if (c) {
                    return r.nameToUrl(c, t, n)
                }
                if (req.jsExtRegExp.test(e)) {
                    f = e + (t || "")
                } else {
                    i = o.paths;
                    s = e.split("/");
                    for (u = s.length; u > 0; u -= 1) {
                        a = s.slice(0, u).join("/");
                        l = getOwn(i, a);
                        if (l) {
                            if (isArray(l)) {
                                l = l[0]
                            }
                            s.splice(0, u, l);
                            break
                        }
                    }
                    f = s.join("/");
                    f += t || (/^data\:|\?/.test(f) || n ? "" : ".js");
                    f = (f.charAt(0) === "/" || f.match(/^[\w\+\.\-]+:/) ? "" : o.baseUrl) + f
                }
                return o.urlArgs ? f + ((f.indexOf("?") === -1 ? "?" : "&") + o.urlArgs) : f
            },
            load: function (e, t) {
                req.load(r, e, t)
            },
            execCb: function (e, t, n, r) {
                return t.apply(r, n)
            },
            onScriptLoad: function (e) {
                if (e.type === "load" || readyRegExp.test((e.currentTarget || e.srcElement).readyState)) {
                    interactiveScript = null;
                    var t = M(e);
                    r.completeLoad(t.id)
                }
            },
            onScriptError: function (e) {
                var t = M(e);
                if (!b(t.id)) {
                    return T(makeError("scripterror", "Script error for: " + t.id, e, [t.id]))
                }
            }
        };
        r.require = r.makeRequire();
        return r
    }

    function getInteractiveScript() {
        if (interactiveScript && interactiveScript.readyState === "interactive") {
            return interactiveScript
        }
        eachReverse(scripts(), function (e) {
            if (e.readyState === "interactive") {
                return interactiveScript = e
            }
        });
        return interactiveScript
    }

    var req, s, head, baseElement, dataMain, src, interactiveScript, currentlyAddingScript, mainScript, subPath, version = "2.1.11", commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg, cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g, jsSuffixRegExp = /\.js$/, currDirRegExp = /^\.\//, op = Object.prototype, ostring = op.toString, hasOwn = op.hasOwnProperty, ap = Array.prototype, apsp = ap.splice, isBrowser = !!(typeof window !== "undefined" && typeof navigator !== "undefined" && window.document), isWebWorker = !isBrowser && typeof importScripts !== "undefined", readyRegExp = isBrowser && navigator.platform === "PLAYSTATION 3" ? /^complete$/ : /^(complete|loaded)$/, defContextName = "_", isOpera = typeof opera !== "undefined" && opera.toString() === "[object Opera]", contexts = {}, cfg = {}, globalDefQueue = [], useInteractive = false;
    if (typeof define !== "undefined") {
        return
    }
    if (typeof requirejs !== "undefined") {
        if (isFunction(requirejs)) {
            return
        }
        cfg = requirejs;
        requirejs = undefined
    }
    if (typeof require !== "undefined" && !isFunction(require)) {
        cfg = require;
        require = undefined
    }
    req = requirejs = function (e, t, n, r) {
        var i, s, o = defContextName;
        if (!isArray(e) && typeof e !== "string") {
            s = e;
            if (isArray(t)) {
                e = t;
                t = n;
                n = r
            } else {
                e = []
            }
        }
        if (s && s.context) {
            o = s.context
        }
        i = getOwn(contexts, o);
        if (!i) {
            i = contexts[o] = req.s.newContext(o)
        }
        if (s) {
            i.configure(s)
        }
        return i.require(e, t, n)
    };
    req.config = function (e) {
        return req(e)
    };
    req.nextTick = typeof setTimeout !== "undefined" ? function (e) {
        setTimeout(e, 4)
    } : function (e) {
        e()
    };
    if (!require) {
        require = req
    }
    req.version = version;
    req.jsExtRegExp = /^\/|:|\?|\.js$/;
    req.isBrowser = isBrowser;
    s = req.s = {contexts: contexts, newContext: newContext};
    req({});
    each(["toUrl", "undef", "defined", "specified"], function (e) {
        req[e] = function () {
            var t = contexts[defContextName];
            return t.require[e].apply(t, arguments)
        }
    });
    if (isBrowser) {
        head = s.head = document.getElementsByTagName("head")[0];
        baseElement = document.getElementsByTagName("base")[0];
        if (baseElement) {
            head = s.head = baseElement.parentNode
        }
    }
    req.onError = defaultOnError;
    req.createNode = function (e, t, n) {
        var r = e.xhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "html:script") : document.createElement("script");
        r.type = e.scriptType || "text/javascript";
        r.charset = "utf-8";
        r.async = true;
        return r
    };
    req.load = function (e, t, n) {
        var r = e && e.config || {}, i;
        if (isBrowser) {
            i = req.createNode(r, t, n);
            i.setAttribute("data-requirecontext", e.contextName);
            i.setAttribute("data-requiremodule", t);
            if (i.attachEvent && !(i.attachEvent.toString && i.attachEvent.toString().indexOf("[native code") < 0) && !isOpera) {
                useInteractive = true;
                i.attachEvent("onreadystatechange", e.onScriptLoad)
            } else {
                i.addEventListener("load", e.onScriptLoad, false);
                i.addEventListener("error", e.onScriptError, false)
            }
            i.src = n;
            currentlyAddingScript = i;
            if (baseElement) {
                head.insertBefore(i, baseElement)
            } else {
                head.appendChild(i)
            }
            currentlyAddingScript = null;
            return i
        } else if (isWebWorker) {
            try {
                importScripts(n);
                e.completeLoad(t)
            } catch (s) {
                e.onError(makeError("importscripts", "importScripts failed for " + t + " at " + n, s, [t]))
            }
        }
    };
    if (isBrowser && !cfg.skipDataMain) {
        eachReverse(scripts(), function (e) {
            if (!head) {
                head = e.parentNode
            }
            dataMain = e.getAttribute("data-main");
            if (dataMain) {
                mainScript = dataMain;
                if (!cfg.baseUrl) {
                    src = mainScript.split("/");
                    mainScript = src.pop();
                    subPath = src.length ? src.join("/") + "/" : "./";
                    cfg.baseUrl = subPath
                }
                mainScript = mainScript.replace(jsSuffixRegExp, "");
                if (req.jsExtRegExp.test(mainScript)) {
                    mainScript = dataMain
                }
                cfg.deps = cfg.deps ? cfg.deps.concat(mainScript) : [mainScript];
                return true
            }
        })
    }
    define = function (e, t, n) {
        var r, i;
        if (typeof e !== "string") {
            n = t;
            t = e;
            e = null
        }
        if (!isArray(t)) {
            n = t;
            t = null
        }
        if (!t && isFunction(n)) {
            t = [];
            if (n.length) {
                n.toString().replace(commentRegExp, "").replace(cjsRequireRegExp, function (e, n) {
                    t.push(n)
                });
                t = (n.length === 1 ? ["require"] : ["require", "exports", "module"]).concat(t)
            }
        }
        if (useInteractive) {
            r = currentlyAddingScript || getInteractiveScript();
            if (r) {
                if (!e) {
                    e = r.getAttribute("data-requiremodule")
                }
                i = contexts[r.getAttribute("data-requirecontext")]
            }
        }
        (i ? i.defQueue : globalDefQueue).push([e, t, n])
    };
    define.amd = {jQuery: true};
    req.exec = function (text) {
        return eval(text)
    };
    req(cfg)
})(this)