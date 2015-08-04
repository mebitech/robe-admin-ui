var requirejs, require, define, xpcUtil;
(function (console, args, readFileFunc) {
    function showHelp() {
        console.log("See https://github.com/jrburke/r.js for usage.")
    }

    function loadLib() {
        (function () {
            var e = /(\/|^)env\/|\{env\}/, t = "unknown";
            if (typeof process !== "undefined" && process.versions && !!process.versions.node) {
                t = "node"
            } else if (typeof Packages !== "undefined") {
                t = "rhino"
            } else if (typeof navigator !== "undefined" && typeof document !== "undefined" || typeof importScripts !== "undefined" && typeof self !== "undefined") {
                t = "browser"
            } else if (typeof Components !== "undefined" && Components.classes && Components.interfaces) {
                t = "xpconnect"
            }
            define("env", {
                get: function () {
                    return t
                }, load: function (n, r, i, s) {
                    if (s.env) {
                        t = s.env
                    }
                    n = n.replace(e, function (e, n) {
                        if (e.indexOf("{") === -1) {
                            return n + t + "/"
                        } else {
                            return t
                        }
                    });
                    r([n], function (e) {
                        i(e)
                    })
                }
            })
        })();
        define("lang", function () {
            "use strict";
            function r(e, t) {
                return n.call(e, t)
            }

            var e, t, n = Object.prototype.hasOwnProperty;
            t = function () {
                return false
            };
            if (typeof java !== "undefined" && java.lang && java.lang.Object) {
                t = function (e) {
                    return e instanceof java.lang.Object
                }
            }
            e = {
                backSlashRegExp: /\\/g, ostring: Object.prototype.toString, isArray: Array.isArray || function (t) {
                    return e.ostring.call(t) === "[object Array]"
                }, isFunction: function (t) {
                    return e.ostring.call(t) === "[object Function]"
                }, isRegExp: function (e) {
                    return e && e instanceof RegExp
                }, hasProp: r, falseProp: function (e, t) {
                    return !r(e, t) || !e[t]
                }, getOwn: function (e, t) {
                    return r(e, t) && e[t]
                }, _mixin: function (e, t, n) {
                    var r;
                    for (r in t) {
                        if (t.hasOwnProperty(r) && (n || !e.hasOwnProperty(r))) {
                            e[r] = t[r]
                        }
                    }
                    return e
                }, mixin: function (t) {
                    var n = Array.prototype.slice.call(arguments), r, i, s;
                    if (!t) {
                        t = {}
                    }
                    if (n.length > 2 && typeof arguments[n.length - 1] === "boolean") {
                        r = n.pop()
                    }
                    for (i = 1, s = n.length; i < s; i++) {
                        e._mixin(t, n[i], r)
                    }
                    return t
                }, deepMix: function (t, n) {
                    e.eachProp(n, function (n, r) {
                        if (typeof n === "object" && n && !e.isArray(n) && !e.isFunction(n) && !(n instanceof RegExp)) {
                            if (!t[r]) {
                                t[r] = {}
                            }
                            e.deepMix(t[r], n)
                        } else {
                            t[r] = n
                        }
                    });
                    return t
                }, deeplikeCopy: function (n) {
                    var r, i;
                    if (e.isArray(n)) {
                        i = [];
                        n.forEach(function (t) {
                            i.push(e.deeplikeCopy(t))
                        });
                        return i
                    }
                    r = typeof n;
                    if (n === null || n === undefined || r === "boolean" || r === "string" || r === "number" || e.isFunction(n) || e.isRegExp(n) || t(n)) {
                        return n
                    }
                    i = {};
                    e.eachProp(n, function (t, n) {
                        i[n] = e.deeplikeCopy(t)
                    });
                    return i
                }, delegate: function () {
                    function t() {
                    }

                    return function (n, r) {
                        t.prototype = n;
                        var i = new t;
                        t.prototype = null;
                        if (r) {
                            e.mixin(i, r)
                        }
                        return i
                    }
                }(), each: function (t, n) {
                    if (t) {
                        var r;
                        for (r = 0; r < t.length; r += 1) {
                            if (n(t[r], r, t)) {
                                break
                            }
                        }
                    }
                }, eachProp: function (t, n) {
                    var i;
                    for (i in t) {
                        if (r(t, i)) {
                            if (n(t[i], i)) {
                                break
                            }
                        }
                    }
                }, bind: function (t, n) {
                    return function () {
                        return n.apply(t, arguments)
                    }
                }, jsEscape: function (e) {
                    return e.replace(/(["'\\])/g, "\\$1").replace(/[\f]/g, "\\f").replace(/[\b]/g, "\\b").replace(/[\n]/g, "\\n").replace(/[\t]/g, "\\t").replace(/[\r]/g, "\\r")
                }
            };
            return e
        });
        var prim;
        (function () {
            "use strict";
            function n(e, n) {
                return t.call(e, n)
            }

            function r(e, t) {
                if (e) {
                    var n;
                    for (n = 0; n < e.length; n += 1) {
                        if (e[n]) {
                            t(e[n], n, e)
                        }
                    }
                }
            }

            function i(e) {
                if (n(e, "e") || n(e, "v")) {
                    if (!prim.hideResolutionConflict) {
                        throw new Error("nope")
                    }
                    return false
                }
                return true
            }

            function s(e, t) {
                prim.nextTick(function () {
                    r(e, function (e) {
                        e(t)
                    })
                })
            }

            var e = Object.prototype, t = e.hasOwnProperty;
            prim = function o() {
                var e, t = [], r = [];
                return e = {
                    callback: function (r, i) {
                        if (i) {
                            e.errback(i)
                        }
                        if (n(e, "v")) {
                            o.nextTick(function () {
                                r(e.v)
                            })
                        } else {
                            t.push(r)
                        }
                    }, errback: function (t) {
                        if (n(e, "e")) {
                            o.nextTick(function () {
                                t(e.e)
                            })
                        } else {
                            r.push(t)
                        }
                    }, finished: function () {
                        return n(e, "e") || n(e, "v")
                    }, rejected: function () {
                        return n(e, "e")
                    }, resolve: function (n) {
                        if (i(e)) {
                            e.v = n;
                            s(t, n)
                        }
                        return e
                    }, reject: function (t) {
                        if (i(e)) {
                            e.e = t;
                            s(r, t)
                        }
                        return e
                    }, start: function (t) {
                        e.resolve();
                        return e.promise.then(t)
                    }, promise: {
                        then: function (t, n) {
                            var r = o();
                            e.callback(function (e) {
                                try {
                                    if (t && typeof t === "function") {
                                        e = t(e)
                                    }
                                    if (e && e.then) {
                                        e.then(r.resolve, r.reject)
                                    } else {
                                        r.resolve(e)
                                    }
                                } catch (n) {
                                    r.reject(n)
                                }
                            }, function (e) {
                                var t;
                                try {
                                    if (!n || typeof n !== "function") {
                                        r.reject(e)
                                    } else {
                                        t = n(e);
                                        if (t && t.then) {
                                            t.then(r.resolve, r.reject)
                                        } else {
                                            r.resolve(t)
                                        }
                                    }
                                } catch (i) {
                                    r.reject(i)
                                }
                            });
                            return r.promise
                        }, fail: function (t) {
                            return e.promise.then(null, t)
                        }, end: function () {
                            e.errback(function (e) {
                                throw e
                            })
                        }
                    }
                }
            };
            prim.serial = function (e) {
                var t = prim().resolve().promise;
                r(e, function (e) {
                    t = t.then(function () {
                        return e()
                    })
                });
                return t
            };
            prim.nextTick = typeof setImmediate === "function" ? setImmediate : typeof process !== "undefined" && process.nextTick ? process.nextTick : typeof setTimeout !== "undefined" ? function (e) {
                setTimeout(e, 0)
            } : function (e) {
                e()
            };
            if (typeof define === "function" && define.amd) {
                define("prim", function () {
                    return prim
                })
            } else if (typeof module !== "undefined" && module.exports) {
                module.exports = prim
            }
        })();
        if (env === "browser") {
            define("browser/assert", function () {
                return {}
            })
        }
        if (env === "node") {
            define("node/assert", ["assert"], function (e) {
                return e
            })
        }
        if (env === "rhino") {
            define("rhino/assert", function () {
                return {}
            })
        }
        if (env === "xpconnect") {
            define("xpconnect/assert", function () {
                return {}
            })
        }
        if (env === "browser") {
            define("browser/args", function () {
                return []
            })
        }
        if (env === "node") {
            define("node/args", function () {
                var e = process.argv.slice(2);
                if (e[0] && e[0].indexOf("-") === 0) {
                    e = e.slice(1)
                }
                return e
            })
        }
        if (env === "rhino") {
            var jsLibRhinoArgs = typeof rhinoArgs !== "undefined" && rhinoArgs || [].concat(Array.prototype.slice.call(arguments, 0));
            define("rhino/args", function () {
                var e = jsLibRhinoArgs;
                if (e[0] && e[0].indexOf("-") === 0) {
                    e = e.slice(1)
                }
                return e
            })
        }
        if (env === "xpconnect") {
            var jsLibXpConnectArgs = typeof xpconnectArgs !== "undefined" && xpconnectArgs || [].concat(Array.prototype.slice.call(arguments, 0));
            define("xpconnect/args", function () {
                var e = jsLibXpConnectArgs;
                if (e[0] && e[0].indexOf("-") === 0) {
                    e = e.slice(1)
                }
                return e
            })
        }
        if (env === "browser") {
            define("browser/load", ["./file"], function (file) {
                function load(fileName) {
                    eval(file.readFile(fileName))
                }

                return load
            })
        }
        if (env === "node") {
            define("node/load", ["fs"], function (e) {
                function t(t) {
                    var n = e.readFileSync(t, "utf8");
                    process.compile(n, t)
                }

                return t
            })
        }
        if (env === "rhino") {
            define("rhino/load", function () {
                return load
            })
        }
        if (env === "xpconnect") {
            define("xpconnect/load", function () {
                return load
            })
        }
        if (env === "browser") {
            define("browser/file", ["prim"], function (e) {
                function r(e) {
                    return e.replace(/\\/g, "/")
                }

                function i(e) {
                    var t, n = new XMLHttpRequest;
                    n.open("HEAD", e, false);
                    n.send();
                    t = n.status;
                    return t === 200 || t === 304
                }

                function s(e) {
                    console.log("mkDir is no-op in browser")
                }

                function o(e) {
                    console.log("mkFullDir is no-op in browser")
                }

                var t, n = /^\.(\/|$)/;
                t = {
                    backSlashRegExp: /\\/g, exclusionRegExp: /^\./, getLineSeparator: function () {
                        return "/"
                    }, exists: function (e) {
                        return i(e)
                    }, parent: function (e) {
                        var t = e.split("/");
                        t.pop();
                        return t.join("/")
                    }, absPath: function (e) {
                        var t;
                        if (n.test(e)) {
                            t = r(location.href);
                            if (t.indexOf("/") !== -1) {
                                t = t.split("/");
                                t.splice(0, 3);
                                t.pop();
                                t = "/" + t.join("/")
                            }
                            e = t + e.substring(1)
                        }
                        return e
                    }, normalize: function (e) {
                        return e
                    }, isFile: function (e) {
                        return true
                    }, isDirectory: function (e) {
                        return false
                    }, getFilteredFileList: function (e, t, n) {
                        console.log("file.getFilteredFileList is no-op in browser")
                    }, copyDir: function (e, t, n, r) {
                        console.log("file.copyDir is no-op in browser")
                    }, copyFile: function (e, t, n) {
                        console.log("file.copyFile is no-op in browser")
                    }, renameFile: function (e, t) {
                        console.log("file.renameFile is no-op in browser")
                    }, readFile: function (e, t) {
                        var n = new XMLHttpRequest;
                        n.open("GET", e, false);
                        n.send();
                        return n.responseText
                    }, readFileAsync: function (t, n) {
                        var r = new XMLHttpRequest, i = e();
                        r.open("GET", t, true);
                        r.send();
                        r.onreadystatechange = function () {
                            if (r.readyState === 4) {
                                if (r.status > 400) {
                                    i.reject(new Error("Status: " + r.status + ": " + r.statusText))
                                } else {
                                    i.resolve(r.responseText)
                                }
                            }
                        };
                        return i.promise
                    }, saveUtf8File: function (e, n) {
                        t.saveFile(e, n, "utf8")
                    }, saveFile: function (e, t, n) {
                        requirejs.browser.saveFile(e, t, n)
                    }, deleteFile: function (e) {
                        console.log("file.deleteFile is no-op in browser")
                    }, deleteEmptyDirs: function (e) {
                        console.log("file.deleteEmptyDirs is no-op in browser")
                    }
                };
                return t
            })
        }
        if (env === "node") {
            define("node/file", ["fs", "path", "prim"], function (e, t, n) {
                function o(e) {
                    return e.replace(/\\/g, "/")
                }

                function u(t) {
                    if (r && t.charAt(t.length - 1) === "/" && t.charAt(t.length - 2) !== ":") {
                        t = t.substring(0, t.length - 1)
                    }
                    try {
                        e.statSync(t);
                        return true
                    } catch (n) {
                        return false
                    }
                }

                function a(t) {
                    if (!u(t) && (!r || !i.test(t))) {
                        e.mkdirSync(t, 511)
                    }
                }

                function f(e) {
                    var t = e.split("/"), n = "", r = true;
                    t.forEach(function (e) {
                        n += e + "/";
                        r = false;
                        if (e) {
                            a(n)
                        }
                    })
                }

                var r = process.platform === "win32", i = /^[a-zA-Z]\:\/$/, s;
                s = {
                    backSlashRegExp: /\\/g, exclusionRegExp: /^\./, getLineSeparator: function () {
                        return "/"
                    }, exists: function (e) {
                        return u(e)
                    }, parent: function (e) {
                        var t = e.split("/");
                        t.pop();
                        return t.join("/")
                    }, absPath: function (n) {
                        return o(t.normalize(o(e.realpathSync(n))))
                    }, normalize: function (e) {
                        return o(t.normalize(e))
                    }, isFile: function (t) {
                        return e.statSync(t).isFile()
                    }, isDirectory: function (t) {
                        return e.statSync(t).isDirectory()
                    }, getFilteredFileList: function (n, r, i) {
                        var u = [], a, f, l, c, h, p, d, v, m, g;
                        a = n;
                        f = r.include || r;
                        l = r.exclude || null;
                        if (s.exists(a)) {
                            c = e.readdirSync(a);
                            for (h = 0; h < c.length; h++) {
                                g = c[h];
                                d = t.join(a, g);
                                p = e.statSync(d);
                                if (p.isFile()) {
                                    if (i) {
                                        if (d.indexOf("/") === -1) {
                                            d = o(d)
                                        }
                                    }
                                    v = true;
                                    if (f) {
                                        v = d.match(f)
                                    }
                                    if (v && l) {
                                        v = !d.match(l)
                                    }
                                    if (v && (!s.exclusionRegExp || !s.exclusionRegExp.test(g))) {
                                        u.push(d)
                                    }
                                } else if (p.isDirectory() && (!s.exclusionRegExp || !s.exclusionRegExp.test(g))) {
                                    m = this.getFilteredFileList(d, r, i);
                                    u.push.apply(u, m)
                                }
                            }
                        }
                        return u
                    }, copyDir: function (e, n, r, i) {
                        r = r || /\w/;
                        e = o(t.normalize(e));
                        n = o(t.normalize(n));
                        var u = s.getFilteredFileList(e, r, true), a = [], f, l, c;
                        for (f = 0; f < u.length; f++) {
                            l = u[f];
                            c = l.replace(e, n);
                            if (s.copyFile(l, c, i)) {
                                a.push(c)
                            }
                        }
                        return a.length ? a : null
                    }, copyFile: function (n, r, i) {
                        var o;
                        if (i) {
                            if (s.exists(r) && e.statSync(r).mtime.getTime() >= e.statSync(n).mtime.getTime()) {
                                return false
                            }
                        }
                        o = t.dirname(r);
                        if (!s.exists(o)) {
                            f(o)
                        }
                        e.writeFileSync(r, e.readFileSync(n, "binary"), "binary");
                        return true
                    }, renameFile: function (t, n) {
                        return e.renameSync(t, n)
                    }, readFile: function (t, n) {
                        if (n === "utf-8") {
                            n = "utf8"
                        }
                        if (!n) {
                            n = "utf8"
                        }
                        var r = e.readFileSync(t, n);
                        if (r.indexOf("﻿") === 0) {
                            r = r.substring(1, r.length)
                        }
                        return r
                    }, readFileAsync: function (e, t) {
                        var r = n();
                        try {
                            r.resolve(s.readFile(e, t))
                        } catch (i) {
                            r.reject(i)
                        }
                        return r.promise
                    }, saveUtf8File: function (e, t) {
                        s.saveFile(e, t, "utf8")
                    }, saveFile: function (n, r, i) {
                        var o;
                        if (i === "utf-8") {
                            i = "utf8"
                        }
                        if (!i) {
                            i = "utf8"
                        }
                        o = t.dirname(n);
                        if (!s.exists(o)) {
                            f(o)
                        }
                        e.writeFileSync(n, r, i)
                    }, deleteFile: function (n) {
                        var r, i, o;
                        if (s.exists(n)) {
                            o = e.lstatSync(n);
                            if (o.isDirectory()) {
                                r = e.readdirSync(n);
                                for (i = 0; i < r.length; i++) {
                                    this.deleteFile(t.join(n, r[i]))
                                }
                                e.rmdirSync(n)
                            } else {
                                e.unlinkSync(n)
                            }
                        }
                    }, deleteEmptyDirs: function (n) {
                        var r, i, o, u, a;
                        if (s.exists(n)) {
                            r = e.readdirSync(n);
                            for (i = 0; i < r.length; i++) {
                                o = r[i];
                                u = t.join(n, o);
                                a = e.lstatSync(u);
                                if (a.isDirectory()) {
                                    s.deleteEmptyDirs(u)
                                }
                            }
                            if (e.readdirSync(n).length === 0) {
                                s.deleteFile(n)
                            }
                        }
                    }
                };
                return s
            })
        }
        if (env === "rhino") {
            define("rhino/file", ["prim"], function (e) {
                var t = {
                    backSlashRegExp: /\\/g, exclusionRegExp: /^\./, getLineSeparator: function () {
                        return t.lineSeparator
                    }, lineSeparator: java.lang.System.getProperty("line.separator"), exists: function (e) {
                        return (new java.io.File(e)).exists()
                    }, parent: function (e) {
                        return t.absPath((new java.io.File(e)).getParentFile())
                    }, normalize: function (e) {
                        return t.absPath(e)
                    }, isFile: function (e) {
                        return (new java.io.File(e)).isFile()
                    }, isDirectory: function (e) {
                        return (new java.io.File(e)).isDirectory()
                    }, absPath: function (e) {
                        if (typeof e === "string") {
                            e = new java.io.File(e)
                        }
                        return (e.getCanonicalPath() + "").replace(t.backSlashRegExp, "/")
                    }, getFilteredFileList: function (e, n, r, i) {
                        var s = [], o, u, a, f, l, c, h, p, d;
                        o = e;
                        if (!i) {
                            o = new java.io.File(e)
                        }
                        u = n.include || n;
                        a = n.exclude || null;
                        if (o.exists()) {
                            f = o.listFiles();
                            for (l = 0; l < f.length; l++) {
                                c = f[l];
                                if (c.isFile()) {
                                    h = c.getPath();
                                    if (r) {
                                        h = String(h);
                                        if (h.indexOf("/") === -1) {
                                            h = h.replace(/\\/g, "/")
                                        }
                                    }
                                    p = true;
                                    if (u) {
                                        p = h.match(u)
                                    }
                                    if (p && a) {
                                        p = !h.match(a)
                                    }
                                    if (p && (!t.exclusionRegExp || !t.exclusionRegExp.test(c.getName()))) {
                                        s.push(h)
                                    }
                                } else if (c.isDirectory() && (!t.exclusionRegExp || !t.exclusionRegExp.test(c.getName()))) {
                                    d = this.getFilteredFileList(c, n, r, true);
                                    s.push.apply(s, d)
                                }
                            }
                        }
                        return s
                    }, copyDir: function (e, n, r, i) {
                        r = r || /\w/;
                        var s = t.getFilteredFileList(e, r, true), o = [], u, a, f;
                        for (u = 0; u < s.length; u++) {
                            a = s[u];
                            f = a.replace(e, n);
                            if (t.copyFile(a, f, i)) {
                                o.push(f)
                            }
                        }
                        return o.length ? o : null
                    }, copyFile: function (e, t, n) {
                        var r = new java.io.File(t), i, s, o, u;
                        if (n) {
                            i = new java.io.File(e);
                            if (r.exists() && r.lastModified() >= i.lastModified()) {
                                return false
                            }
                        }
                        s = r.getParentFile();
                        if (!s.exists()) {
                            if (!s.mkdirs()) {
                                throw"Could not create directory: " + s.getCanonicalPath()
                            }
                        }
                        o = (new java.io.FileInputStream(e)).getChannel();
                        u = (new java.io.FileOutputStream(t)).getChannel();
                        u.transferFrom(o, 0, o.size());
                        o.close();
                        u.close();
                        return true
                    }, renameFile: function (e, t) {
                        return (new java.io.File(e)).renameTo(new java.io.File(t))
                    }, readFile: function (e, n) {
                        n = n || "utf-8";
                        var r = new java.io.File(e), i = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(r), n)), s, o;
                        try {
                            s = new java.lang.StringBuffer;
                            o = i.readLine();
                            if (o && o.length() && o.charAt(0) === 65279) {
                                o = o.substring(1)
                            }
                            while (o !== null) {
                                s.append(o);
                                s.append(t.lineSeparator);
                                o = i.readLine()
                            }
                            return String(s.toString())
                        } finally {
                            i.close()
                        }
                    }, readFileAsync: function (n, r) {
                        var i = e();
                        try {
                            i.resolve(t.readFile(n, r))
                        } catch (s) {
                            i.reject(s)
                        }
                        return i.promise
                    }, saveUtf8File: function (e, n) {
                        t.saveFile(e, n, "utf-8")
                    }, saveFile: function (e, t, n) {
                        var r = new java.io.File(e), i, s, o;
                        s = r.getAbsoluteFile().getParentFile();
                        if (!s.exists()) {
                            if (!s.mkdirs()) {
                                throw"Could not create directory: " + s.getAbsolutePath()
                            }
                        }
                        if (n) {
                            i = new java.io.OutputStreamWriter(new java.io.FileOutputStream(r), n)
                        } else {
                            i = new java.io.OutputStreamWriter(new java.io.FileOutputStream(r))
                        }
                        o = new java.io.BufferedWriter(i);
                        try {
                            o.write(t)
                        } finally {
                            o.close()
                        }
                    }, deleteFile: function (e) {
                        var t = new java.io.File(e), n, r;
                        if (t.exists()) {
                            if (t.isDirectory()) {
                                n = t.listFiles();
                                for (r = 0; r < n.length; r++) {
                                    this.deleteFile(n[r])
                                }
                            }
                            t["delete"]()
                        }
                    }, deleteEmptyDirs: function (e, n) {
                        var r = e, i, s, o;
                        if (!n) {
                            r = new java.io.File(e)
                        }
                        if (r.exists()) {
                            i = r.listFiles();
                            for (s = 0; s < i.length; s++) {
                                o = i[s];
                                if (o.isDirectory()) {
                                    t.deleteEmptyDirs(o, true)
                                }
                            }
                            if (r.listFiles().length === 0) {
                                t.deleteFile(String(r.getPath()))
                            }
                        }
                    }
                };
                return t
            })
        }
        if (env === "xpconnect") {
            define("xpconnect/file", ["prim"], function (e) {
                function s(e) {
                    if (!e.exists()) {
                        e.create(1, 511)
                    }
                }

                var t, n = Components.classes, r = Components.interfaces, i = xpcUtil.xpfile;
                t = {
                    backSlashRegExp: /\\/g, exclusionRegExp: /^\./, getLineSeparator: function () {
                        return t.lineSeparator
                    }, lineSeparator: "@mozilla.org/windows-registry-key;1"in n ? "\r\n" : "\n", exists: function (e) {
                        return i(e).exists()
                    }, parent: function (e) {
                        return i(e).parent
                    }, normalize: function (e) {
                        return t.absPath(e)
                    }, isFile: function (e) {
                        return i(e).isFile()
                    }, isDirectory: function (e) {
                        return i(e).isDirectory()
                    }, absPath: function (e) {
                        if (typeof e === "string") {
                            e = i(e)
                        }
                        return e.path
                    }, getFilteredFileList: function (e, n, s, o) {
                        var u = [], a, f, l, c, h, p, d, v;
                        a = e;
                        if (!o) {
                            a = i(e)
                        }
                        f = n.include || n;
                        l = n.exclude || null;
                        if (a.exists()) {
                            c = a.directoryEntries;
                            while (c.hasMoreElements()) {
                                h = c.getNext().QueryInterface(r.nsILocalFile);
                                if (h.isFile()) {
                                    p = h.path;
                                    if (s) {
                                        if (p.indexOf("/") === -1) {
                                            p = p.replace(/\\/g, "/")
                                        }
                                    }
                                    d = true;
                                    if (f) {
                                        d = p.match(f)
                                    }
                                    if (d && l) {
                                        d = !p.match(l)
                                    }
                                    if (d && (!t.exclusionRegExp || !t.exclusionRegExp.test(h.leafName))) {
                                        u.push(p)
                                    }
                                } else if (h.isDirectory() && (!t.exclusionRegExp || !t.exclusionRegExp.test(h.leafName))) {
                                    v = this.getFilteredFileList(h, n, s, true);
                                    u.push.apply(u, v)
                                }
                            }
                        }
                        return u
                    }, copyDir: function (e, n, r, i) {
                        r = r || /\w/;
                        var s = t.getFilteredFileList(e, r, true), o = [], u, a, f;
                        for (u = 0; u < s.length; u += 1) {
                            a = s[u];
                            f = a.replace(e, n);
                            if (t.copyFile(a, f, i)) {
                                o.push(f)
                            }
                        }
                        return o.length ? o : null
                    }, copyFile: function (e, t, n) {
                        var r = i(t), s = i(e);
                        if (n) {
                            if (r.exists() && r.lastModifiedTime >= s.lastModifiedTime) {
                                return false
                            }
                        }
                        s.copyTo(r.parent, r.leafName);
                        return true
                    }, renameFile: function (e, t) {
                        var n = i(t);
                        return i(e).moveTo(n.parent, n.leafName)
                    }, readFile: xpcUtil.readFile, readFileAsync: function (n, r) {
                        var i = e();
                        try {
                            i.resolve(t.readFile(n, r))
                        } catch (s) {
                            i.reject(s)
                        }
                        return i.promise
                    }, saveUtf8File: function (e, n) {
                        t.saveFile(e, n, "utf-8")
                    }, saveFile: function (e, t, o) {
                        var u, a, f = i(e);
                        s(f.parent);
                        try {
                            u = n["@mozilla.org/network/file-output-stream;1"].createInstance(r.nsIFileOutputStream);
                            u.init(f, 2 | 8 | 32, 511, 0);
                            a = n["@mozilla.org/intl/converter-output-stream;1"].createInstance(r.nsIConverterOutputStream);
                            a.init(u, o, 0, 0);
                            a.writeString(t)
                        } catch (l) {
                            throw new Error((f && f.path || "") + ": " + l)
                        } finally {
                            if (a) {
                                a.close()
                            }
                            if (u) {
                                u.close()
                            }
                        }
                    }, deleteFile: function (e) {
                        var t = i(e);
                        if (t.exists()) {
                            t.remove(true)
                        }
                    }, deleteEmptyDirs: function (e, n) {
                        var s = e, o, u;
                        if (!n) {
                            s = i(e)
                        }
                        if (s.exists()) {
                            o = s.directoryEntries;
                            while (o.hasMoreElements()) {
                                u = o.getNext().QueryInterface(r.nsILocalFile);
                                if (u.isDirectory()) {
                                    t.deleteEmptyDirs(u, true)
                                }
                            }
                            o = s.directoryEntries;
                            if (!o.hasMoreElements()) {
                                t.deleteFile(s.path)
                            }
                        }
                    }
                };
                return t
            })
        }
        if (env === "browser") {
            define("browser/quit", function () {
                "use strict";
                return function (e) {
                }
            })
        }
        if (env === "node") {
            define("node/quit", function () {
                "use strict";
                return function (e) {
                    var t = 0;
                    var n = function () {
                        if (t === 0) {
                            process.exit(e)
                        } else {
                            t -= 1
                        }
                    };
                    if (process.stdout.bufferSize) {
                        t += 1;
                        process.stdout.once("drain", n)
                    }
                    if (process.stderr.bufferSize) {
                        t += 1;
                        process.stderr.once("drain", n)
                    }
                    n()
                }
            })
        }
        if (env === "rhino") {
            define("rhino/quit", function () {
                "use strict";
                return function (e) {
                    return quit(e)
                }
            })
        }
        if (env === "xpconnect") {
            define("xpconnect/quit", function () {
                "use strict";
                return function (e) {
                    return quit(e)
                }
            })
        }
        if (env === "browser") {
            define("browser/print", function () {
                function e(e) {
                    console.log(e)
                }

                return e
            })
        }
        if (env === "node") {
            define("node/print", function () {
                function e(e) {
                    console.log(e)
                }

                return e
            })
        }
        if (env === "rhino") {
            define("rhino/print", function () {
                return print
            })
        }
        if (env === "xpconnect") {
            define("xpconnect/print", function () {
                return print
            })
        }
        define("logger", ["env!env/print"], function (e) {
            var t = {
                TRACE: 0, INFO: 1, WARN: 2, ERROR: 3, SILENT: 4, level: 0, logPrefix: "", logLevel: function (e) {
                    this.level = e
                }, trace: function (e) {
                    if (this.level <= this.TRACE) {
                        this._print(e)
                    }
                }, info: function (e) {
                    if (this.level <= this.INFO) {
                        this._print(e)
                    }
                }, warn: function (e) {
                    if (this.level <= this.WARN) {
                        this._print(e)
                    }
                }, error: function (e) {
                    if (this.level <= this.ERROR) {
                        this._print(e)
                    }
                }, _print: function (e) {
                    this._sysPrint((this.logPrefix ? this.logPrefix + " " : "") + e)
                }, _sysPrint: function (t) {
                    e(t)
                }
            };
            return t
        });
        (function (e, t) {
            "use strict";
            if (typeof define === "function" && define.amd) {
                define("esprima", ["exports"], t)
            } else if (typeof exports !== "undefined") {
                t(exports)
            } else {
                t(e.esprima = {})
            }
        })(this, function (e) {
            "use strict";
            function b(e, t) {
                if (!e) {
                    throw new Error("ASSERT: " + t)
                }
            }

            function w(e) {
                return e >= 48 && e <= 57
            }

            function E(e) {
                return "0123456789abcdefABCDEF".indexOf(e) >= 0
            }

            function S(e) {
                return "01234567".indexOf(e) >= 0
            }

            function x(e) {
                return e === 32 || e === 9 || e === 11 || e === 12 || e === 160 || e >= 5760 && [5760, 6158, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8199, 8200, 8201, 8202, 8239, 8287, 12288, 65279].indexOf(e) >= 0
            }

            function T(e) {
                return e === 10 || e === 13 || e === 8232 || e === 8233
            }

            function N(e) {
                return e === 36 || e === 95 || e >= 65 && e <= 90 || e >= 97 && e <= 122 || e === 92 || e >= 128 && u.NonAsciiIdentifierStart.test(String.fromCharCode(e))
            }

            function C(e) {
                return e === 36 || e === 95 || e >= 65 && e <= 90 || e >= 97 && e <= 122 || e >= 48 && e <= 57 || e === 92 || e >= 128 && u.NonAsciiIdentifierPart.test(String.fromCharCode(e))
            }

            function k(e) {
                switch (e) {
                    case"class":
                    case"enum":
                    case"export":
                    case"extends":
                    case"import":
                    case"super":
                        return true;
                    default:
                        return false
                }
            }

            function L(e) {
                switch (e) {
                    case"implements":
                    case"interface":
                    case"package":
                    case"private":
                    case"protected":
                    case"public":
                    case"static":
                    case"yield":
                    case"let":
                        return true;
                    default:
                        return false
                }
            }

            function A(e) {
                return e === "eval" || e === "arguments"
            }

            function O(e) {
                if (l && L(e)) {
                    return true
                }
                switch (e.length) {
                    case 2:
                        return e === "if" || e === "in" || e === "do";
                    case 3:
                        return e === "var" || e === "for" || e === "new" || e === "try" || e === "let";
                    case 4:
                        return e === "this" || e === "else" || e === "case" || e === "void" || e === "with" || e === "enum";
                    case 5:
                        return e === "while" || e === "break" || e === "catch" || e === "throw" || e === "const" || e === "yield" || e === "class" || e === "super";
                    case 6:
                        return e === "return" || e === "typeof" || e === "delete" || e === "switch" || e === "export" || e === "import";
                    case 7:
                        return e === "default" || e === "finally" || e === "extends";
                    case 8:
                        return e === "function" || e === "continue" || e === "debugger";
                    case 10:
                        return e === "instanceof";
                    default:
                        return false
                }
            }

            function M(e, t, n, r, i) {
                var s, o;
                b(typeof n === "number", "Comment must have valid position");
                if (g.lastCommentStart >= n) {
                    return
                }
                g.lastCommentStart = n;
                s = {type: e, value: t};
                if (y.range) {
                    s.range = [n, r]
                }
                if (y.loc) {
                    s.loc = i
                }
                y.comments.push(s);
                if (y.attachComment) {
                    y.leadingComments.push(s);
                    y.trailingComments.push(s)
                }
            }

            function _(e) {
                var t, n, r, i;
                t = c - e;
                n = {start: {line: h, column: c - p - e}};
                while (c < d) {
                    r = f.charCodeAt(c);
                    ++c;
                    if (T(r)) {
                        if (y.comments) {
                            i = f.slice(t + e, c - 1);
                            n.end = {line: h, column: c - p - 1};
                            M("Line", i, t, c - 1, n)
                        }
                        if (r === 13 && f.charCodeAt(c) === 10) {
                            ++c
                        }
                        ++h;
                        p = c;
                        return
                    }
                }
                if (y.comments) {
                    i = f.slice(t + e, c);
                    n.end = {line: h, column: c - p};
                    M("Line", i, t, c, n)
                }
            }

            function D() {
                var e, t, n, r;
                if (y.comments) {
                    e = c - 2;
                    t = {start: {line: h, column: c - p - 2}}
                }
                while (c < d) {
                    n = f.charCodeAt(c);
                    if (T(n)) {
                        if (n === 13 && f.charCodeAt(c + 1) === 10) {
                            ++c
                        }
                        ++h;
                        ++c;
                        p = c;
                        if (c >= d) {
                            it({}, o.UnexpectedToken, "ILLEGAL")
                        }
                    } else if (n === 42) {
                        if (f.charCodeAt(c + 1) === 47) {
                            ++c;
                            ++c;
                            if (y.comments) {
                                r = f.slice(e + 2, c - 2);
                                t.end = {line: h, column: c - p};
                                M("Block", r, e, c, t)
                            }
                            return
                        }
                        ++c
                    } else {
                        ++c
                    }
                }
                it({}, o.UnexpectedToken, "ILLEGAL")
            }

            function P() {
                var e, t;
                t = c === 0;
                while (c < d) {
                    e = f.charCodeAt(c);
                    if (x(e)) {
                        ++c
                    } else if (T(e)) {
                        ++c;
                        if (e === 13 && f.charCodeAt(c) === 10) {
                            ++c
                        }
                        ++h;
                        p = c;
                        t = true
                    } else if (e === 47) {
                        e = f.charCodeAt(c + 1);
                        if (e === 47) {
                            ++c;
                            ++c;
                            _(2);
                            t = true
                        } else if (e === 42) {
                            ++c;
                            ++c;
                            D()
                        } else {
                            break
                        }
                    } else if (t && e === 45) {
                        if (f.charCodeAt(c + 1) === 45 && f.charCodeAt(c + 2) === 62) {
                            c += 3;
                            _(3)
                        } else {
                            break
                        }
                    } else if (e === 60) {
                        if (f.slice(c + 1, c + 4) === "!--") {
                            ++c;
                            ++c;
                            ++c;
                            ++c;
                            _(4)
                        } else {
                            break
                        }
                    } else {
                        break
                    }
                }
            }

            function H(e) {
                var t, n, r, i = 0;
                n = e === "u" ? 4 : 2;
                for (t = 0; t < n; ++t) {
                    if (c < d && E(f[c])) {
                        r = f[c++];
                        i = i * 16 + "0123456789abcdef".indexOf(r.toLowerCase())
                    } else {
                        return ""
                    }
                }
                return String.fromCharCode(i)
            }

            function B() {
                var e, t;
                e = f.charCodeAt(c++);
                t = String.fromCharCode(e);
                if (e === 92) {
                    if (f.charCodeAt(c) !== 117) {
                        it({}, o.UnexpectedToken, "ILLEGAL")
                    }
                    ++c;
                    e = H("u");
                    if (!e || e === "\\" || !N(e.charCodeAt(0))) {
                        it({}, o.UnexpectedToken, "ILLEGAL")
                    }
                    t = e
                }
                while (c < d) {
                    e = f.charCodeAt(c);
                    if (!C(e)) {
                        break
                    }
                    ++c;
                    t += String.fromCharCode(e);
                    if (e === 92) {
                        t = t.substr(0, t.length - 1);
                        if (f.charCodeAt(c) !== 117) {
                            it({}, o.UnexpectedToken, "ILLEGAL")
                        }
                        ++c;
                        e = H("u");
                        if (!e || e === "\\" || !C(e.charCodeAt(0))) {
                            it({}, o.UnexpectedToken, "ILLEGAL")
                        }
                        t += e
                    }
                }
                return t
            }

            function j() {
                var e, t;
                e = c++;
                while (c < d) {
                    t = f.charCodeAt(c);
                    if (t === 92) {
                        c = e;
                        return B()
                    }
                    if (C(t)) {
                        ++c
                    } else {
                        break
                    }
                }
                return f.slice(e, c)
            }

            function F() {
                var e, n, r;
                e = c;
                n = f.charCodeAt(c) === 92 ? B() : j();
                if (n.length === 1) {
                    r = t.Identifier
                } else if (O(n)) {
                    r = t.Keyword
                } else if (n === "null") {
                    r = t.NullLiteral
                } else if (n === "true" || n === "false") {
                    r = t.BooleanLiteral
                } else {
                    r = t.Identifier
                }
                return {type: r, value: n, lineNumber: h, lineStart: p, start: e, end: c}
            }

            function I() {
                var e = c, n = f.charCodeAt(c), r, i = f[c], s, u, a;
                switch (n) {
                    case 46:
                    case 40:
                    case 41:
                    case 59:
                    case 44:
                    case 123:
                    case 125:
                    case 91:
                    case 93:
                    case 58:
                    case 63:
                    case 126:
                        ++c;
                        if (y.tokenize) {
                            if (n === 40) {
                                y.openParenToken = y.tokens.length
                            } else if (n === 123) {
                                y.openCurlyToken = y.tokens.length
                            }
                        }
                        return {
                            type: t.Punctuator,
                            value: String.fromCharCode(n),
                            lineNumber: h,
                            lineStart: p,
                            start: e,
                            end: c
                        };
                    default:
                        r = f.charCodeAt(c + 1);
                        if (r === 61) {
                            switch (n) {
                                case 43:
                                case 45:
                                case 47:
                                case 60:
                                case 62:
                                case 94:
                                case 124:
                                case 37:
                                case 38:
                                case 42:
                                    c += 2;
                                    return {
                                        type: t.Punctuator,
                                        value: String.fromCharCode(n) + String.fromCharCode(r),
                                        lineNumber: h,
                                        lineStart: p,
                                        start: e,
                                        end: c
                                    };
                                case 33:
                                case 61:
                                    c += 2;
                                    if (f.charCodeAt(c) === 61) {
                                        ++c
                                    }
                                    return {
                                        type: t.Punctuator,
                                        value: f.slice(e, c),
                                        lineNumber: h,
                                        lineStart: p,
                                        start: e,
                                        end: c
                                    }
                            }
                        }
                }
                a = f.substr(c, 4);
                if (a === ">>>=") {
                    c += 4;
                    return {type: t.Punctuator, value: a, lineNumber: h, lineStart: p, start: e, end: c}
                }
                u = a.substr(0, 3);
                if (u === ">>>" || u === "<<=" || u === ">>=") {
                    c += 3;
                    return {type: t.Punctuator, value: u, lineNumber: h, lineStart: p, start: e, end: c}
                }
                s = u.substr(0, 2);
                if (i === s[1] && "+-<>&|".indexOf(i) >= 0 || s === "=>") {
                    c += 2;
                    return {type: t.Punctuator, value: s, lineNumber: h, lineStart: p, start: e, end: c}
                }
                if ("<>=!+-*%&|^/".indexOf(i) >= 0) {
                    ++c;
                    return {type: t.Punctuator, value: i, lineNumber: h, lineStart: p, start: e, end: c}
                }
                it({}, o.UnexpectedToken, "ILLEGAL")
            }

            function q(e) {
                var n = "";
                while (c < d) {
                    if (!E(f[c])) {
                        break
                    }
                    n += f[c++]
                }
                if (n.length === 0) {
                    it({}, o.UnexpectedToken, "ILLEGAL")
                }
                if (N(f.charCodeAt(c))) {
                    it({}, o.UnexpectedToken, "ILLEGAL")
                }
                return {
                    type: t.NumericLiteral,
                    value: parseInt("0x" + n, 16),
                    lineNumber: h,
                    lineStart: p,
                    start: e,
                    end: c
                }
            }

            function R(e) {
                var n = "0" + f[c++];
                while (c < d) {
                    if (!S(f[c])) {
                        break
                    }
                    n += f[c++]
                }
                if (N(f.charCodeAt(c)) || w(f.charCodeAt(c))) {
                    it({}, o.UnexpectedToken, "ILLEGAL")
                }
                return {
                    type: t.NumericLiteral,
                    value: parseInt(n, 8),
                    octal: true,
                    lineNumber: h,
                    lineStart: p,
                    start: e,
                    end: c
                }
            }

            function U() {
                var e, n, r;
                r = f[c];
                b(w(r.charCodeAt(0)) || r === ".", "Numeric literal must start with a decimal digit or a decimal point");
                n = c;
                e = "";
                if (r !== ".") {
                    e = f[c++];
                    r = f[c];
                    if (e === "0") {
                        if (r === "x" || r === "X") {
                            ++c;
                            return q(n)
                        }
                        if (S(r)) {
                            return R(n)
                        }
                        if (r && w(r.charCodeAt(0))) {
                            it({}, o.UnexpectedToken, "ILLEGAL")
                        }
                    }
                    while (w(f.charCodeAt(c))) {
                        e += f[c++]
                    }
                    r = f[c]
                }
                if (r === ".") {
                    e += f[c++];
                    while (w(f.charCodeAt(c))) {
                        e += f[c++]
                    }
                    r = f[c]
                }
                if (r === "e" || r === "E") {
                    e += f[c++];
                    r = f[c];
                    if (r === "+" || r === "-") {
                        e += f[c++]
                    }
                    if (w(f.charCodeAt(c))) {
                        while (w(f.charCodeAt(c))) {
                            e += f[c++]
                        }
                    } else {
                        it({}, o.UnexpectedToken, "ILLEGAL")
                    }
                }
                if (N(f.charCodeAt(c))) {
                    it({}, o.UnexpectedToken, "ILLEGAL")
                }
                return {type: t.NumericLiteral, value: parseFloat(e), lineNumber: h, lineStart: p, start: n, end: c}
            }

            function z() {
                var e = "", n, r, i, s, u, a, l = false, v, m;
                v = h;
                m = p;
                n = f[c];
                b(n === "'" || n === '"', "String literal must starts with a quote");
                r = c;
                ++c;
                while (c < d) {
                    i = f[c++];
                    if (i === n) {
                        n = "";
                        break
                    } else if (i === "\\") {
                        i = f[c++];
                        if (!i || !T(i.charCodeAt(0))) {
                            switch (i) {
                                case"u":
                                case"x":
                                    a = c;
                                    u = H(i);
                                    if (u) {
                                        e += u
                                    } else {
                                        c = a;
                                        e += i
                                    }
                                    break;
                                case"n":
                                    e += "\n";
                                    break;
                                case"r":
                                    e += "\r";
                                    break;
                                case"t":
                                    e += "	";
                                    break;
                                case"b":
                                    e += "\b";
                                    break;
                                case"f":
                                    e += "\f";
                                    break;
                                case"v":
                                    e += "";
                                    break;
                                default:
                                    if (S(i)) {
                                        s = "01234567".indexOf(i);
                                        if (s !== 0) {
                                            l = true
                                        }
                                        if (c < d && S(f[c])) {
                                            l = true;
                                            s = s * 8 + "01234567".indexOf(f[c++]);
                                            if ("0123".indexOf(i) >= 0 && c < d && S(f[c])) {
                                                s = s * 8 + "01234567".indexOf(f[c++])
                                            }
                                        }
                                        e += String.fromCharCode(s)
                                    } else {
                                        e += i
                                    }
                                    break
                            }
                        } else {
                            ++h;
                            if (i === "\r" && f[c] === "\n") {
                                ++c
                            }
                            p = c
                        }
                    } else if (T(i.charCodeAt(0))) {
                        break
                    } else {
                        e += i
                    }
                }
                if (n !== "") {
                    it({}, o.UnexpectedToken, "ILLEGAL")
                }
                return {
                    type: t.StringLiteral,
                    value: e,
                    octal: l,
                    startLineNumber: v,
                    startLineStart: m,
                    lineNumber: h,
                    lineStart: p,
                    start: r,
                    end: c
                }
            }

            function W(e, t) {
                var n;
                try {
                    n = new RegExp(e, t)
                } catch (r) {
                    it({}, o.InvalidRegExp)
                }
                return n
            }

            function X() {
                var e, t, n, r, i;
                e = f[c];
                b(e === "/", "Regular expression literal must start with a slash");
                t = f[c++];
                n = false;
                r = false;
                while (c < d) {
                    e = f[c++];
                    t += e;
                    if (e === "\\") {
                        e = f[c++];
                        if (T(e.charCodeAt(0))) {
                            it({}, o.UnterminatedRegExp)
                        }
                        t += e
                    } else if (T(e.charCodeAt(0))) {
                        it({}, o.UnterminatedRegExp)
                    } else if (n) {
                        if (e === "]") {
                            n = false
                        }
                    } else {
                        if (e === "/") {
                            r = true;
                            break
                        } else if (e === "[") {
                            n = true
                        }
                    }
                }
                if (!r) {
                    it({}, o.UnterminatedRegExp)
                }
                i = t.substr(1, t.length - 2);
                return {value: i, literal: t}
            }

            function V() {
                var e, t, n, r;
                t = "";
                n = "";
                while (c < d) {
                    e = f[c];
                    if (!C(e.charCodeAt(0))) {
                        break
                    }
                    ++c;
                    if (e === "\\" && c < d) {
                        e = f[c];
                        if (e === "u") {
                            ++c;
                            r = c;
                            e = H("u");
                            if (e) {
                                n += e;
                                for (t += "\\u"; r < c; ++r) {
                                    t += f[r]
                                }
                            } else {
                                c = r;
                                n += "u";
                                t += "\\u"
                            }
                            st({}, o.UnexpectedToken, "ILLEGAL")
                        } else {
                            t += "\\";
                            st({}, o.UnexpectedToken, "ILLEGAL")
                        }
                    } else {
                        n += e;
                        t += e
                    }
                }
                return {value: n, literal: t}
            }

            function $() {
                var e, n, r, i, s;
                m = null;
                P();
                e = c;
                n = X();
                r = V();
                s = W(n.value, r.value);
                if (y.tokenize) {
                    return {type: t.RegularExpression, value: s, lineNumber: h, lineStart: p, start: e, end: c}
                }
                return {literal: n.literal + r.literal, value: s, start: e, end: c}
            }

            function J() {
                var e, t, n, r;
                P();
                e = c;
                t = {start: {line: h, column: c - p}};
                n = $();
                t.end = {line: h, column: c - p};
                if (!y.tokenize) {
                    if (y.tokens.length > 0) {
                        r = y.tokens[y.tokens.length - 1];
                        if (r.range[0] === e && r.type === "Punctuator") {
                            if (r.value === "/" || r.value === "/=") {
                                y.tokens.pop()
                            }
                        }
                    }
                    y.tokens.push({type: "RegularExpression", value: n.literal, range: [e, c], loc: t})
                }
                return n
            }

            function K(e) {
                return e.type === t.Identifier || e.type === t.Keyword || e.type === t.BooleanLiteral || e.type === t.NullLiteral
            }

            function Q() {
                var e, t;
                e = y.tokens[y.tokens.length - 1];
                if (!e) {
                    return J()
                }
                if (e.type === "Punctuator") {
                    if (e.value === "]") {
                        return I()
                    }
                    if (e.value === ")") {
                        t = y.tokens[y.openParenToken - 1];
                        if (t && t.type === "Keyword" && (t.value === "if" || t.value === "while" || t.value === "for" || t.value === "with")) {
                            return J()
                        }
                        return I()
                    }
                    if (e.value === "}") {
                        if (y.tokens[y.openCurlyToken - 3] && y.tokens[y.openCurlyToken - 3].type === "Keyword") {
                            t = y.tokens[y.openCurlyToken - 4];
                            if (!t) {
                                return I()
                            }
                        } else if (y.tokens[y.openCurlyToken - 4] && y.tokens[y.openCurlyToken - 4].type === "Keyword") {
                            t = y.tokens[y.openCurlyToken - 5];
                            if (!t) {
                                return J()
                            }
                        } else {
                            return I()
                        }
                        if (r.indexOf(t.value) >= 0) {
                            return I()
                        }
                        return J()
                    }
                    return J()
                }
                if (e.type === "Keyword") {
                    return J()
                }
                return I()
            }

            function G() {
                var e;
                P();
                if (c >= d) {
                    return {type: t.EOF, lineNumber: h, lineStart: p, start: c, end: c}
                }
                e = f.charCodeAt(c);
                if (N(e)) {
                    return F()
                }
                if (e === 40 || e === 41 || e === 59) {
                    return I()
                }
                if (e === 39 || e === 34) {
                    return z()
                }
                if (e === 46) {
                    if (w(f.charCodeAt(c + 1))) {
                        return U()
                    }
                    return I()
                }
                if (w(e)) {
                    return U()
                }
                if (y.tokenize && e === 47) {
                    return Q()
                }
                return I()
            }

            function Y() {
                var e, r, i, s;
                P();
                e = {start: {line: h, column: c - p}};
                r = G();
                e.end = {line: h, column: c - p};
                if (r.type !== t.EOF) {
                    s = f.slice(r.start, r.end);
                    y.tokens.push({type: n[r.type], value: s, range: [r.start, r.end], loc: e})
                }
                return r
            }

            function Z() {
                var e;
                e = m;
                c = e.end;
                h = e.lineNumber;
                p = e.lineStart;
                m = typeof y.tokens !== "undefined" ? Y() : G();
                c = e.end;
                h = e.lineNumber;
                p = e.lineStart;
                return e
            }

            function et() {
                var e, t, n;
                e = c;
                t = h;
                n = p;
                m = typeof y.tokens !== "undefined" ? Y() : G();
                c = e;
                h = t;
                p = n
            }

            function tt(e, t) {
                this.line = e;
                this.column = t
            }

            function nt(e, t, n, r) {
                this.start = new tt(e, t);
                this.end = new tt(n, r)
            }

            function rt() {
                var e, t, n, r;
                e = c;
                t = h;
                n = p;
                P();
                r = h !== t;
                c = e;
                h = t;
                p = n;
                return r
            }

            function it(e, t) {
                var n, r = Array.prototype.slice.call(arguments, 2), i = t.replace(/%(\d)/g, function (e, t) {
                    b(t < r.length, "Message reference must be in range");
                    return r[t]
                });
                if (typeof e.lineNumber === "number") {
                    n = new Error("Line " + e.lineNumber + ": " + i);
                    n.index = e.start;
                    n.lineNumber = e.lineNumber;
                    n.column = e.start - p + 1
                } else {
                    n = new Error("Line " + h + ": " + i);
                    n.index = c;
                    n.lineNumber = h;
                    n.column = c - p + 1
                }
                n.description = i;
                throw n
            }

            function st() {
                try {
                    it.apply(null, arguments)
                } catch (e) {
                    if (y.errors) {
                        y.errors.push(e)
                    } else {
                        throw e
                    }
                }
            }

            function ot(e) {
                if (e.type === t.EOF) {
                    it(e, o.UnexpectedEOS)
                }
                if (e.type === t.NumericLiteral) {
                    it(e, o.UnexpectedNumber)
                }
                if (e.type === t.StringLiteral) {
                    it(e, o.UnexpectedString)
                }
                if (e.type === t.Identifier) {
                    it(e, o.UnexpectedIdentifier)
                }
                if (e.type === t.Keyword) {
                    if (k(e.value)) {
                        it(e, o.UnexpectedReserved)
                    } else if (l && L(e.value)) {
                        st(e, o.StrictReservedWord);
                        return
                    }
                    it(e, o.UnexpectedToken, e.value)
                }
                it(e, o.UnexpectedToken, e.value)
            }

            function ut(e) {
                var n = Z();
                if (n.type !== t.Punctuator || n.value !== e) {
                    ot(n)
                }
            }

            function at(e) {
                var n = Z();
                if (n.type !== t.Keyword || n.value !== e) {
                    ot(n)
                }
            }

            function ft(e) {
                return m.type === t.Punctuator && m.value === e
            }

            function lt(e) {
                return m.type === t.Keyword && m.value === e
            }

            function ct() {
                var e;
                if (m.type !== t.Punctuator) {
                    return false
                }
                e = m.value;
                return e === "=" || e === "*=" || e === "/=" || e === "%=" || e === "+=" || e === "-=" || e === "<<=" || e === ">>=" || e === ">>>=" || e === "&=" || e === "^=" || e === "|="
            }

            function ht() {
                var e;
                if (f.charCodeAt(c) === 59 || ft(";")) {
                    Z();
                    return
                }
                e = h;
                P();
                if (h !== e) {
                    return
                }
                if (m.type !== t.EOF && !ft("}")) {
                    ot(m)
                }
            }

            function pt(e) {
                return e.type === i.Identifier || e.type === i.MemberExpression
            }

            function dt() {
                var e = [], t;
                t = m;
                ut("[");
                while (!ft("]")) {
                    if (ft(",")) {
                        Z();
                        e.push(null)
                    } else {
                        e.push(Dt());
                        if (!ft("]")) {
                            ut(",")
                        }
                    }
                }
                Z();
                return v.markEnd(v.createArrayExpression(e), t)
            }

            function vt(e, t) {
                var n, r, i;
                n = l;
                i = m;
                r = un();
                if (t && l && A(e[0].name)) {
                    st(t, o.StrictParamName)
                }
                l = n;
                return v.markEnd(v.createFunctionExpression(null, e, [], r), i)
            }

            function mt() {
                var e, n;
                n = m;
                e = Z();
                if (e.type === t.StringLiteral || e.type === t.NumericLiteral) {
                    if (l && e.octal) {
                        st(e, o.StrictOctalLiteral)
                    }
                    return v.markEnd(v.createLiteral(e), n)
                }
                return v.markEnd(v.createIdentifier(e.value), n)
            }

            function gt() {
                var e, n, r, i, s, u;
                e = m;
                u = m;
                if (e.type === t.Identifier) {
                    r = mt();
                    if (e.value === "get" && !ft(":")) {
                        n = mt();
                        ut("(");
                        ut(")");
                        i = vt([]);
                        return v.markEnd(v.createProperty("get", n, i), u)
                    }
                    if (e.value === "set" && !ft(":")) {
                        n = mt();
                        ut("(");
                        e = m;
                        if (e.type !== t.Identifier) {
                            ut(")");
                            st(e, o.UnexpectedToken, e.value);
                            i = vt([])
                        } else {
                            s = [jt()];
                            ut(")");
                            i = vt(s, e)
                        }
                        return v.markEnd(v.createProperty("set", n, i), u)
                    }
                    ut(":");
                    i = Dt();
                    return v.markEnd(v.createProperty("init", r, i), u)
                }
                if (e.type === t.EOF || e.type === t.Punctuator) {
                    ot(e)
                } else {
                    n = mt();
                    ut(":");
                    i = Dt();
                    return v.markEnd(v.createProperty("init", n, i), u)
                }
            }

            function yt() {
                var e = [], t, n, r, u, a = {}, f = String, c;
                c = m;
                ut("{");
                while (!ft("}")) {
                    t = gt();
                    if (t.key.type === i.Identifier) {
                        n = t.key.name
                    } else {
                        n = f(t.key.value)
                    }
                    u = t.kind === "init" ? s.Data : t.kind === "get" ? s.Get : s.Set;
                    r = "$" + n;
                    if (Object.prototype.hasOwnProperty.call(a, r)) {
                        if (a[r] === s.Data) {
                            if (l && u === s.Data) {
                                st({}, o.StrictDuplicateProperty)
                            } else if (u !== s.Data) {
                                st({}, o.AccessorDataProperty)
                            }
                        } else {
                            if (u === s.Data) {
                                st({}, o.AccessorDataProperty)
                            } else if (a[r] & u) {
                                st({}, o.AccessorGetSet)
                            }
                        }
                        a[r] |= u
                    } else {
                        a[r] = u
                    }
                    e.push(t);
                    if (!ft("}")) {
                        ut(",")
                    }
                }
                ut("}");
                return v.markEnd(v.createObjectExpression(e), c)
            }

            function bt() {
                var e;
                ut("(");
                e = Pt();
                ut(")");
                return e
            }

            function wt() {
                var e, n, r, i;
                if (ft("(")) {
                    return bt()
                }
                if (ft("[")) {
                    return dt()
                }
                if (ft("{")) {
                    return yt()
                }
                e = m.type;
                i = m;
                if (e === t.Identifier) {
                    r = v.createIdentifier(Z().value)
                } else if (e === t.StringLiteral || e === t.NumericLiteral) {
                    if (l && m.octal) {
                        st(m, o.StrictOctalLiteral)
                    }
                    r = v.createLiteral(Z())
                } else if (e === t.Keyword) {
                    if (lt("function")) {
                        return ln()
                    }
                    if (lt("this")) {
                        Z();
                        r = v.createThisExpression()
                    } else {
                        ot(Z())
                    }
                } else if (e === t.BooleanLiteral) {
                    n = Z();
                    n.value = n.value === "true";
                    r = v.createLiteral(n)
                } else if (e === t.NullLiteral) {
                    n = Z();
                    n.value = null;
                    r = v.createLiteral(n)
                } else if (ft("/") || ft("/=")) {
                    if (typeof y.tokens !== "undefined") {
                        r = v.createLiteral(J())
                    } else {
                        r = v.createLiteral($())
                    }
                    et()
                } else {
                    ot(Z())
                }
                return v.markEnd(r, i)
            }

            function Et() {
                var e = [];
                ut("(");
                if (!ft(")")) {
                    while (c < d) {
                        e.push(Dt());
                        if (ft(")")) {
                            break
                        }
                        ut(",")
                    }
                }
                ut(")");
                return e
            }

            function St() {
                var e, t;
                t = m;
                e = Z();
                if (!K(e)) {
                    ot(e)
                }
                return v.markEnd(v.createIdentifier(e.value), t)
            }

            function xt() {
                ut(".");
                return St()
            }

            function Tt() {
                var e;
                ut("[");
                e = Pt();
                ut("]");
                return e
            }

            function Nt() {
                var e, t, n;
                n = m;
                at("new");
                e = kt();
                t = ft("(") ? Et() : [];
                return v.markEnd(v.createNewExpression(e, t), n)
            }

            function Ct() {
                var e, t, n, r, i;
                i = m;
                e = g.allowIn;
                g.allowIn = true;
                t = lt("new") ? Nt() : wt();
                g.allowIn = e;
                for (; ;) {
                    if (ft(".")) {
                        r = xt();
                        t = v.createMemberExpression(".", t, r)
                    } else if (ft("(")) {
                        n = Et();
                        t = v.createCallExpression(t, n)
                    } else if (ft("[")) {
                        r = Tt();
                        t = v.createMemberExpression("[", t, r)
                    } else {
                        break
                    }
                    v.markEnd(t, i)
                }
                return t
            }

            function kt() {
                var e, t, n, r;
                r = m;
                e = g.allowIn;
                t = lt("new") ? Nt() : wt();
                g.allowIn = e;
                while (ft(".") || ft("[")) {
                    if (ft("[")) {
                        n = Tt();
                        t = v.createMemberExpression("[", t, n)
                    } else {
                        n = xt();
                        t = v.createMemberExpression(".", t, n)
                    }
                    v.markEnd(t, r)
                }
                return t
            }

            function Lt() {
                var e, n, r = m;
                e = Ct();
                if (m.type === t.Punctuator) {
                    if ((ft("++") || ft("--")) && !rt()) {
                        if (l && e.type === i.Identifier && A(e.name)) {
                            st({}, o.StrictLHSPostfix)
                        }
                        if (!pt(e)) {
                            st({}, o.InvalidLHSInAssignment)
                        }
                        n = Z();
                        e = v.markEnd(v.createPostfixExpression(n.value, e), r)
                    }
                }
                return e
            }

            function At() {
                var e, n, r;
                if (m.type !== t.Punctuator && m.type !== t.Keyword) {
                    n = Lt()
                } else if (ft("++") || ft("--")) {
                    r = m;
                    e = Z();
                    n = At();
                    if (l && n.type === i.Identifier && A(n.name)) {
                        st({}, o.StrictLHSPrefix)
                    }
                    if (!pt(n)) {
                        st({}, o.InvalidLHSInAssignment)
                    }
                    n = v.createUnaryExpression(e.value, n);
                    n = v.markEnd(n, r)
                } else if (ft("+") || ft("-") || ft("~") || ft("!")) {
                    r = m;
                    e = Z();
                    n = At();
                    n = v.createUnaryExpression(e.value, n);
                    n = v.markEnd(n, r)
                } else if (lt("delete") || lt("void") || lt("typeof")) {
                    r = m;
                    e = Z();
                    n = At();
                    n = v.createUnaryExpression(e.value, n);
                    n = v.markEnd(n, r);
                    if (l && n.operator === "delete" && n.argument.type === i.Identifier) {
                        st({}, o.StrictDelete)
                    }
                } else {
                    n = Lt()
                }
                return n
            }

            function Ot(e, n) {
                var r = 0;
                if (e.type !== t.Punctuator && e.type !== t.Keyword) {
                    return 0
                }
                switch (e.value) {
                    case"||":
                        r = 1;
                        break;
                    case"&&":
                        r = 2;
                        break;
                    case"|":
                        r = 3;
                        break;
                    case"^":
                        r = 4;
                        break;
                    case"&":
                        r = 5;
                        break;
                    case"==":
                    case"!=":
                    case"===":
                    case"!==":
                        r = 6;
                        break;
                    case"<":
                    case">":
                    case"<=":
                    case">=":
                    case"instanceof":
                        r = 7;
                        break;
                    case"in":
                        r = n ? 7 : 0;
                        break;
                    case"<<":
                    case">>":
                    case">>>":
                        r = 8;
                        break;
                    case"+":
                    case"-":
                        r = 9;
                        break;
                    case"*":
                    case"/":
                    case"%":
                        r = 11;
                        break;
                    default:
                        break
                }
                return r
            }

            function Mt() {
                var e, t, n, r, i, s, o, u, a, f;
                e = m;
                a = At();
                r = m;
                i = Ot(r, g.allowIn);
                if (i === 0) {
                    return a
                }
                r.prec = i;
                Z();
                t = [e, m];
                o = At();
                s = [a, r, o];
                while ((i = Ot(m, g.allowIn)) > 0) {
                    while (s.length > 2 && i <= s[s.length - 2].prec) {
                        o = s.pop();
                        u = s.pop().value;
                        a = s.pop();
                        n = v.createBinaryExpression(u, a, o);
                        t.pop();
                        e = t[t.length - 1];
                        v.markEnd(n, e);
                        s.push(n)
                    }
                    r = Z();
                    r.prec = i;
                    s.push(r);
                    t.push(m);
                    n = At();
                    s.push(n)
                }
                f = s.length - 1;
                n = s[f];
                t.pop();
                while (f > 1) {
                    n = v.createBinaryExpression(s[f - 1].value, s[f - 2], n);
                    f -= 2;
                    e = t.pop();
                    v.markEnd(n, e)
                }
                return n
            }

            function _t() {
                var e, t, n, r, i;
                i = m;
                e = Mt();
                if (ft("?")) {
                    Z();
                    t = g.allowIn;
                    g.allowIn = true;
                    n = Dt();
                    g.allowIn = t;
                    ut(":");
                    r = Dt();
                    e = v.createConditionalExpression(e, n, r);
                    v.markEnd(e, i)
                }
                return e
            }

            function Dt() {
                var e, t, n, r, s;
                e = m;
                s = m;
                r = t = _t();
                if (ct()) {
                    if (!pt(t)) {
                        st({}, o.InvalidLHSInAssignment)
                    }
                    if (l && t.type === i.Identifier && A(t.name)) {
                        st(e, o.StrictLHSAssignment)
                    }
                    e = Z();
                    n = Dt();
                    r = v.markEnd(v.createAssignmentExpression(e.value, t, n), s)
                }
                return r
            }

            function Pt() {
                var e, t = m;
                e = Dt();
                if (ft(",")) {
                    e = v.createSequenceExpression([e]);
                    while (c < d) {
                        if (!ft(",")) {
                            break
                        }
                        Z();
                        e.expressions.push(Dt())
                    }
                    v.markEnd(e, t)
                }
                return e
            }

            function Ht() {
                var e = [], t;
                while (c < d) {
                    if (ft("}")) {
                        break
                    }
                    t = cn();
                    if (typeof t === "undefined") {
                        break
                    }
                    e.push(t)
                }
                return e
            }

            function Bt() {
                var e, t;
                t = m;
                ut("{");
                e = Ht();
                ut("}");
                return v.markEnd(v.createBlockStatement(e), t)
            }

            function jt() {
                var e, n;
                n = m;
                e = Z();
                if (e.type !== t.Identifier) {
                    ot(e)
                }
                return v.markEnd(v.createIdentifier(e.value), n)
            }

            function Ft(e) {
                var t = null, n, r;
                r = m;
                n = jt();
                if (l && A(n.name)) {
                    st({}, o.StrictVarName)
                }
                if (e === "const") {
                    ut("=");
                    t = Dt()
                } else if (ft("=")) {
                    Z();
                    t = Dt()
                }
                return v.markEnd(v.createVariableDeclarator(n, t), r)
            }

            function It(e) {
                var t = [];
                do {
                    t.push(Ft(e));
                    if (!ft(",")) {
                        break
                    }
                    Z()
                } while (c < d);
                return t
            }

            function qt() {
                var e;
                at("var");
                e = It();
                ht();
                return v.createVariableDeclaration(e, "var")
            }

            function Rt(e) {
                var t, n;
                n = m;
                at(e);
                t = It(e);
                ht();
                return v.markEnd(v.createVariableDeclaration(t, e), n)
            }

            function Ut() {
                ut(";");
                return v.createEmptyStatement()
            }

            function zt() {
                var e = Pt();
                ht();
                return v.createExpressionStatement(e)
            }

            function Wt() {
                var e, t, n;
                at("if");
                ut("(");
                e = Pt();
                ut(")");
                t = on();
                if (lt("else")) {
                    Z();
                    n = on()
                } else {
                    n = null
                }
                return v.createIfStatement(e, t, n)
            }

            function Xt() {
                var e, t, n;
                at("do");
                n = g.inIteration;
                g.inIteration = true;
                e = on();
                g.inIteration = n;
                at("while");
                ut("(");
                t = Pt();
                ut(")");
                if (ft(";")) {
                    Z()
                }
                return v.createDoWhileStatement(e, t)
            }

            function Vt() {
                var e, t, n;
                at("while");
                ut("(");
                e = Pt();
                ut(")");
                n = g.inIteration;
                g.inIteration = true;
                t = on();
                g.inIteration = n;
                return v.createWhileStatement(e, t)
            }

            function $t() {
                var e, t, n;
                n = m;
                e = Z();
                t = It();
                return v.markEnd(v.createVariableDeclaration(t, e.value), n)
            }

            function Jt() {
                var e, t, n, r, i, s, u;
                e = t = n = null;
                at("for");
                ut("(");
                if (ft(";")) {
                    Z()
                } else {
                    if (lt("var") || lt("let")) {
                        g.allowIn = false;
                        e = $t();
                        g.allowIn = true;
                        if (e.declarations.length === 1 && lt("in")) {
                            Z();
                            r = e;
                            i = Pt();
                            e = null
                        }
                    } else {
                        g.allowIn = false;
                        e = Pt();
                        g.allowIn = true;
                        if (lt("in")) {
                            if (!pt(e)) {
                                st({}, o.InvalidLHSInForIn)
                            }
                            Z();
                            r = e;
                            i = Pt();
                            e = null
                        }
                    }
                    if (typeof r === "undefined") {
                        ut(";")
                    }
                }
                if (typeof r === "undefined") {
                    if (!ft(";")) {
                        t = Pt()
                    }
                    ut(";");
                    if (!ft(")")) {
                        n = Pt()
                    }
                }
                ut(")");
                u = g.inIteration;
                g.inIteration = true;
                s = on();
                g.inIteration = u;
                return typeof r === "undefined" ? v.createForStatement(e, t, n, s) : v.createForInStatement(r, i, s)
            }

            function Kt() {
                var e = null, n;
                at("continue");
                if (f.charCodeAt(c) === 59) {
                    Z();
                    if (!g.inIteration) {
                        it({}, o.IllegalContinue)
                    }
                    return v.createContinueStatement(null)
                }
                if (rt()) {
                    if (!g.inIteration) {
                        it({}, o.IllegalContinue)
                    }
                    return v.createContinueStatement(null)
                }
                if (m.type === t.Identifier) {
                    e = jt();
                    n = "$" + e.name;
                    if (!Object.prototype.hasOwnProperty.call(g.labelSet, n)) {
                        it({}, o.UnknownLabel, e.name)
                    }
                }
                ht();
                if (e === null && !g.inIteration) {
                    it({}, o.IllegalContinue)
                }
                return v.createContinueStatement(e)
            }

            function Qt() {
                var e = null, n;
                at("break");
                if (f.charCodeAt(c) === 59) {
                    Z();
                    if (!(g.inIteration || g.inSwitch)) {
                        it({}, o.IllegalBreak)
                    }
                    return v.createBreakStatement(null)
                }
                if (rt()) {
                    if (!(g.inIteration || g.inSwitch)) {
                        it({}, o.IllegalBreak)
                    }
                    return v.createBreakStatement(null)
                }
                if (m.type === t.Identifier) {
                    e = jt();
                    n = "$" + e.name;
                    if (!Object.prototype.hasOwnProperty.call(g.labelSet, n)) {
                        it({}, o.UnknownLabel, e.name)
                    }
                }
                ht();
                if (e === null && !(g.inIteration || g.inSwitch)) {
                    it({}, o.IllegalBreak)
                }
                return v.createBreakStatement(e)
            }

            function Gt() {
                var e = null;
                at("return");
                if (!g.inFunctionBody) {
                    st({}, o.IllegalReturn)
                }
                if (f.charCodeAt(c) === 32) {
                    if (N(f.charCodeAt(c + 1))) {
                        e = Pt();
                        ht();
                        return v.createReturnStatement(e)
                    }
                }
                if (rt()) {
                    return v.createReturnStatement(null)
                }
                if (!ft(";")) {
                    if (!ft("}") && m.type !== t.EOF) {
                        e = Pt()
                    }
                }
                ht();
                return v.createReturnStatement(e)
            }

            function Yt() {
                var e, t;
                if (l) {
                    P();
                    st({}, o.StrictModeWith)
                }
                at("with");
                ut("(");
                e = Pt();
                ut(")");
                t = on();
                return v.createWithStatement(e, t)
            }

            function Zt() {
                var e, t = [], n, r;
                r = m;
                if (lt("default")) {
                    Z();
                    e = null
                } else {
                    at("case");
                    e = Pt()
                }
                ut(":");
                while (c < d) {
                    if (ft("}") || lt("default") || lt("case")) {
                        break
                    }
                    n = on();
                    t.push(n)
                }
                return v.markEnd(v.createSwitchCase(e, t), r)
            }

            function en() {
                var e, t, n, r, i;
                at("switch");
                ut("(");
                e = Pt();
                ut(")");
                ut("{");
                t = [];
                if (ft("}")) {
                    Z();
                    return v.createSwitchStatement(e, t)
                }
                r = g.inSwitch;
                g.inSwitch = true;
                i = false;
                while (c < d) {
                    if (ft("}")) {
                        break
                    }
                    n = Zt();
                    if (n.test === null) {
                        if (i) {
                            it({}, o.MultipleDefaultsInSwitch)
                        }
                        i = true
                    }
                    t.push(n)
                }
                g.inSwitch = r;
                ut("}");
                return v.createSwitchStatement(e, t)
            }

            function tn() {
                var e;
                at("throw");
                if (rt()) {
                    it({}, o.NewlineAfterThrow)
                }
                e = Pt();
                ht();
                return v.createThrowStatement(e)
            }

            function nn() {
                var e, t, n;
                n = m;
                at("catch");
                ut("(");
                if (ft(")")) {
                    ot(m)
                }
                e = jt();
                if (l && A(e.name)) {
                    st({}, o.StrictCatchVariable)
                }
                ut(")");
                t = Bt();
                return v.markEnd(v.createCatchClause(e, t), n)
            }

            function rn() {
                var e, t = [], n = null;
                at("try");
                e = Bt();
                if (lt("catch")) {
                    t.push(nn())
                }
                if (lt("finally")) {
                    Z();
                    n = Bt()
                }
                if (t.length === 0 && !n) {
                    it({}, o.NoCatchOrFinally)
                }
                return v.createTryStatement(e, [], t, n)
            }

            function sn() {
                at("debugger");
                ht();
                return v.createDebuggerStatement()
            }

            function on() {
                var e = m.type, n, r, s, u;
                if (e === t.EOF) {
                    ot(m)
                }
                if (e === t.Punctuator && m.value === "{") {
                    return Bt()
                }
                u = m;
                if (e === t.Punctuator) {
                    switch (m.value) {
                        case";":
                            return v.markEnd(Ut(), u);
                        case"(":
                            return v.markEnd(zt(), u);
                        default:
                            break
                    }
                }
                if (e === t.Keyword) {
                    switch (m.value) {
                        case"break":
                            return v.markEnd(Qt(), u);
                        case"continue":
                            return v.markEnd(Kt(), u);
                        case"debugger":
                            return v.markEnd(sn(), u);
                        case"do":
                            return v.markEnd(Xt(), u);
                        case"for":
                            return v.markEnd(Jt(), u);
                        case"function":
                            return v.markEnd(fn(), u);
                        case"if":
                            return v.markEnd(Wt(), u);
                        case"return":
                            return v.markEnd(Gt(), u);
                        case"switch":
                            return v.markEnd(en(), u);
                        case"throw":
                            return v.markEnd(tn(), u);
                        case"try":
                            return v.markEnd(rn(), u);
                        case"var":
                            return v.markEnd(qt(), u);
                        case"while":
                            return v.markEnd(Vt(), u);
                        case"with":
                            return v.markEnd(Yt(), u);
                        default:
                            break
                    }
                }
                n = Pt();
                if (n.type === i.Identifier && ft(":")) {
                    Z();
                    s = "$" + n.name;
                    if (Object.prototype.hasOwnProperty.call(g.labelSet, s)) {
                        it({}, o.Redeclaration, "Label", n.name)
                    }
                    g.labelSet[s] = true;
                    r = on();
                    delete g.labelSet[s];
                    return v.markEnd(v.createLabeledStatement(n, r), u)
                }
                ht();
                return v.markEnd(v.createExpressionStatement(n), u)
            }

            function un() {
                var e, n = [], r, s, u, a, h, p, y, b;
                b = m;
                ut("{");
                while (c < d) {
                    if (m.type !== t.StringLiteral) {
                        break
                    }
                    r = m;
                    e = cn();
                    n.push(e);
                    if (e.expression.type !== i.Literal) {
                        break
                    }
                    s = f.slice(r.start + 1, r.end - 1);
                    if (s === "use strict") {
                        l = true;
                        if (u) {
                            st(u, o.StrictOctalLiteral)
                        }
                    } else {
                        if (!u && r.octal) {
                            u = r
                        }
                    }
                }
                a = g.labelSet;
                h = g.inIteration;
                p = g.inSwitch;
                y = g.inFunctionBody;
                g.labelSet = {};
                g.inIteration = false;
                g.inSwitch = false;
                g.inFunctionBody = true;
                while (c < d) {
                    if (ft("}")) {
                        break
                    }
                    e = cn();
                    if (typeof e === "undefined") {
                        break
                    }
                    n.push(e)
                }
                ut("}");
                g.labelSet = a;
                g.inIteration = h;
                g.inSwitch = p;
                g.inFunctionBody = y;
                return v.markEnd(v.createBlockStatement(n), b)
            }

            function an(e) {
                var t, n = [], r, i, s, u, a;
                ut("(");
                if (!ft(")")) {
                    s = {};
                    while (c < d) {
                        r = m;
                        t = jt();
                        u = "$" + r.value;
                        if (l) {
                            if (A(r.value)) {
                                i = r;
                                a = o.StrictParamName
                            }
                            if (Object.prototype.hasOwnProperty.call(s, u)) {
                                i = r;
                                a = o.StrictParamDupe
                            }
                        } else if (!e) {
                            if (A(r.value)) {
                                e = r;
                                a = o.StrictParamName
                            } else if (L(r.value)) {
                                e = r;
                                a = o.StrictReservedWord
                            } else if (Object.prototype.hasOwnProperty.call(s, u)) {
                                e = r;
                                a = o.StrictParamDupe
                            }
                        }
                        n.push(t);
                        s[u] = true;
                        if (ft(")")) {
                            break
                        }
                        ut(",")
                    }
                }
                ut(")");
                return {params: n, stricted: i, firstRestricted: e, message: a}
            }

            function fn() {
                var e, t = [], n, r, i, s, u, a, f, c;
                c = m;
                at("function");
                r = m;
                e = jt();
                if (l) {
                    if (A(r.value)) {
                        st(r, o.StrictFunctionName)
                    }
                } else {
                    if (A(r.value)) {
                        u = r;
                        a = o.StrictFunctionName
                    } else if (L(r.value)) {
                        u = r;
                        a = o.StrictReservedWord
                    }
                }
                s = an(u);
                t = s.params;
                i = s.stricted;
                u = s.firstRestricted;
                if (s.message) {
                    a = s.message
                }
                f = l;
                n = un();
                if (l && u) {
                    it(u, a)
                }
                if (l && i) {
                    st(i, a)
                }
                l = f;
                return v.markEnd(v.createFunctionDeclaration(e, t, [], n), c)
            }

            function ln() {
                var e, t = null, n, r, i, s, u = [], a, f, c;
                c = m;
                at("function");
                if (!ft("(")) {
                    e = m;
                    t = jt();
                    if (l) {
                        if (A(e.value)) {
                            st(e, o.StrictFunctionName)
                        }
                    } else {
                        if (A(e.value)) {
                            r = e;
                            i = o.StrictFunctionName
                        } else if (L(e.value)) {
                            r = e;
                            i = o.StrictReservedWord
                        }
                    }
                }
                s = an(r);
                u = s.params;
                n = s.stricted;
                r = s.firstRestricted;
                if (s.message) {
                    i = s.message
                }
                f = l;
                a = un();
                if (l && r) {
                    it(r, i)
                }
                if (l && n) {
                    st(n, i)
                }
                l = f;
                return v.markEnd(v.createFunctionExpression(t, u, [], a), c)
            }

            function cn() {
                if (m.type === t.Keyword) {
                    switch (m.value) {
                        case"const":
                        case"let":
                            return Rt(m.value);
                        case"function":
                            return fn();
                        default:
                            return on()
                    }
                }
                if (m.type !== t.EOF) {
                    return on()
                }
            }

            function hn() {
                var e, n = [], r, s, u;
                while (c < d) {
                    r = m;
                    if (r.type !== t.StringLiteral) {
                        break
                    }
                    e = cn();
                    n.push(e);
                    if (e.expression.type !== i.Literal) {
                        break
                    }
                    s = f.slice(r.start + 1, r.end - 1);
                    if (s === "use strict") {
                        l = true;
                        if (u) {
                            st(u, o.StrictOctalLiteral)
                        }
                    } else {
                        if (!u && r.octal) {
                            u = r
                        }
                    }
                }
                while (c < d) {
                    e = cn();
                    if (typeof e === "undefined") {
                        break
                    }
                    n.push(e)
                }
                return n
            }

            function pn() {
                var e, t;
                P();
                et();
                t = m;
                l = false;
                e = hn();
                return v.markEnd(v.createProgram(e), t)
            }

            function dn() {
                var e, t, n, r = [];
                for (e = 0; e < y.tokens.length; ++e) {
                    t = y.tokens[e];
                    n = {type: t.type, value: t.value};
                    if (y.range) {
                        n.range = t.range
                    }
                    if (y.loc) {
                        n.loc = t.loc
                    }
                    r.push(n)
                }
                y.tokens = r
            }

            function vn(e, n) {
                var r, i, s;
                r = String;
                if (typeof e !== "string" && !(e instanceof String)) {
                    e = r(e)
                }
                v = a;
                f = e;
                c = 0;
                h = f.length > 0 ? 1 : 0;
                p = 0;
                d = f.length;
                m = null;
                g = {
                    allowIn: true,
                    labelSet: {},
                    inFunctionBody: false,
                    inIteration: false,
                    inSwitch: false,
                    lastCommentStart: -1
                };
                y = {};
                n = n || {};
                n.tokens = true;
                y.tokens = [];
                y.tokenize = true;
                y.openParenToken = -1;
                y.openCurlyToken = -1;
                y.range = typeof n.range === "boolean" && n.range;
                y.loc = typeof n.loc === "boolean" && n.loc;
                if (typeof n.comment === "boolean" && n.comment) {
                    y.comments = []
                }
                if (typeof n.tolerant === "boolean" && n.tolerant) {
                    y.errors = []
                }
                try {
                    et();
                    if (m.type === t.EOF) {
                        return y.tokens
                    }
                    i = Z();
                    while (m.type !== t.EOF) {
                        try {
                            i = Z()
                        } catch (o) {
                            i = m;
                            if (y.errors) {
                                y.errors.push(o);
                                break
                            } else {
                                throw o
                            }
                        }
                    }
                    dn();
                    s = y.tokens;
                    if (typeof y.comments !== "undefined") {
                        s.comments = y.comments
                    }
                    if (typeof y.errors !== "undefined") {
                        s.errors = y.errors
                    }
                } catch (u) {
                    throw u
                } finally {
                    y = {}
                }
                return s
            }

            function mn(e, t) {
                var n, r;
                r = String;
                if (typeof e !== "string" && !(e instanceof String)) {
                    e = r(e)
                }
                v = a;
                f = e;
                c = 0;
                h = f.length > 0 ? 1 : 0;
                p = 0;
                d = f.length;
                m = null;
                g = {
                    allowIn: true,
                    labelSet: {},
                    inFunctionBody: false,
                    inIteration: false,
                    inSwitch: false,
                    lastCommentStart: -1
                };
                y = {};
                if (typeof t !== "undefined") {
                    y.range = typeof t.range === "boolean" && t.range;
                    y.loc = typeof t.loc === "boolean" && t.loc;
                    y.attachComment = typeof t.attachComment === "boolean" && t.attachComment;
                    if (y.loc && t.source !== null && t.source !== undefined) {
                        y.source = r(t.source)
                    }
                    if (typeof t.tokens === "boolean" && t.tokens) {
                        y.tokens = []
                    }
                    if (typeof t.comment === "boolean" && t.comment) {
                        y.comments = []
                    }
                    if (typeof t.tolerant === "boolean" && t.tolerant) {
                        y.errors = []
                    }
                    if (y.attachComment) {
                        y.range = true;
                        y.comments = [];
                        y.bottomRightStack = [];
                        y.trailingComments = [];
                        y.leadingComments = []
                    }
                }
                try {
                    n = pn();
                    if (typeof y.comments !== "undefined") {
                        n.comments = y.comments
                    }
                    if (typeof y.tokens !== "undefined") {
                        dn();
                        n.tokens = y.tokens
                    }
                    if (typeof y.errors !== "undefined") {
                        n.errors = y.errors
                    }
                } catch (i) {
                    throw i
                } finally {
                    y = {}
                }
                return n
            }

            var t, n, r, i, s, o, u, a, f, l, c, h, p, d, v, m, g, y;
            t = {
                BooleanLiteral: 1,
                EOF: 2,
                Identifier: 3,
                Keyword: 4,
                NullLiteral: 5,
                NumericLiteral: 6,
                Punctuator: 7,
                StringLiteral: 8,
                RegularExpression: 9
            };
            n = {};
            n[t.BooleanLiteral] = "Boolean";
            n[t.EOF] = "<end>";
            n[t.Identifier] = "Identifier";
            n[t.Keyword] = "Keyword";
            n[t.NullLiteral] = "Null";
            n[t.NumericLiteral] = "Numeric";
            n[t.Punctuator] = "Punctuator";
            n[t.StringLiteral] = "String";
            n[t.RegularExpression] = "RegularExpression";
            r = ["(", "{", "[", "in", "typeof", "instanceof", "new", "return", "case", "delete", "throw", "void", "=", "+=", "-=", "*=", "/=", "%=", "<<=", ">>=", ">>>=", "&=", "|=", "^=", ",", "+", "-", "*", "/", "%", "++", "--", "<<", ">>", ">>>", "&", "|", "^", "!", "~", "&&", "||", "?", ":", "===", "==", ">=", "<=", "<", ">", "!=", "!=="];
            i = {
                AssignmentExpression: "AssignmentExpression",
                ArrayExpression: "ArrayExpression",
                BlockStatement: "BlockStatement",
                BinaryExpression: "BinaryExpression",
                BreakStatement: "BreakStatement",
                CallExpression: "CallExpression",
                CatchClause: "CatchClause",
                ConditionalExpression: "ConditionalExpression",
                ContinueStatement: "ContinueStatement",
                DoWhileStatement: "DoWhileStatement",
                DebuggerStatement: "DebuggerStatement",
                EmptyStatement: "EmptyStatement",
                ExpressionStatement: "ExpressionStatement",
                ForStatement: "ForStatement",
                ForInStatement: "ForInStatement",
                FunctionDeclaration: "FunctionDeclaration",
                FunctionExpression: "FunctionExpression",
                Identifier: "Identifier",
                IfStatement: "IfStatement",
                Literal: "Literal",
                LabeledStatement: "LabeledStatement",
                LogicalExpression: "LogicalExpression",
                MemberExpression: "MemberExpression",
                NewExpression: "NewExpression",
                ObjectExpression: "ObjectExpression",
                Program: "Program",
                Property: "Property",
                ReturnStatement: "ReturnStatement",
                SequenceExpression: "SequenceExpression",
                SwitchStatement: "SwitchStatement",
                SwitchCase: "SwitchCase",
                ThisExpression: "ThisExpression",
                ThrowStatement: "ThrowStatement",
                TryStatement: "TryStatement",
                UnaryExpression: "UnaryExpression",
                UpdateExpression: "UpdateExpression",
                VariableDeclaration: "VariableDeclaration",
                VariableDeclarator: "VariableDeclarator",
                WhileStatement: "WhileStatement",
                WithStatement: "WithStatement"
            };
            s = {Data: 1, Get: 2, Set: 4};
            o = {
                UnexpectedToken: "Unexpected token %0",
                UnexpectedNumber: "Unexpected number",
                UnexpectedString: "Unexpected string",
                UnexpectedIdentifier: "Unexpected identifier",
                UnexpectedReserved: "Unexpected reserved word",
                UnexpectedEOS: "Unexpected end of input",
                NewlineAfterThrow: "Illegal newline after throw",
                InvalidRegExp: "Invalid regular expression",
                UnterminatedRegExp: "Invalid regular expression: missing /",
                InvalidLHSInAssignment: "Invalid left-hand side in assignment",
                InvalidLHSInForIn: "Invalid left-hand side in for-in",
                MultipleDefaultsInSwitch: "More than one default clause in switch statement",
                NoCatchOrFinally: "Missing catch or finally after try",
                UnknownLabel: "Undefined label '%0'",
                Redeclaration: "%0 '%1' has already been declared",
                IllegalContinue: "Illegal continue statement",
                IllegalBreak: "Illegal break statement",
                IllegalReturn: "Illegal return statement",
                StrictModeWith: "Strict mode code may not include a with statement",
                StrictCatchVariable: "Catch variable may not be eval or arguments in strict mode",
                StrictVarName: "Variable name may not be eval or arguments in strict mode",
                StrictParamName: "Parameter name eval or arguments is not allowed in strict mode",
                StrictParamDupe: "Strict mode function may not have duplicate parameter names",
                StrictFunctionName: "Function name may not be eval or arguments in strict mode",
                StrictOctalLiteral: "Octal literals are not allowed in strict mode.",
                StrictDelete: "Delete of an unqualified identifier in strict mode.",
                StrictDuplicateProperty: "Duplicate data property in object literal not allowed in strict mode",
                AccessorDataProperty: "Object literal may not have data and accessor property with the same name",
                AccessorGetSet: "Object literal may not have multiple get/set accessors with the same name",
                StrictLHSAssignment: "Assignment to eval or arguments is not allowed in strict mode",
                StrictLHSPostfix: "Postfix increment/decrement may not have eval or arguments operand in strict mode",
                StrictLHSPrefix: "Prefix increment/decrement may not have eval or arguments operand in strict mode",
                StrictReservedWord: "Use of future reserved word in strict mode"
            };
            u = {
                NonAsciiIdentifierStart: new RegExp("[ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԧԱ-Ֆՙա-ևא-תװ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࢠࢢ-ࢬऄ-हऽॐक़-ॡॱ-ॷॹ-ॿঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-ళవ-హఽౘౙౠౡಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠೡೱೲഅ-ഌഎ-ഐഒ-ഺഽൎൠൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄງຈຊຍດ-ທນ-ຟມ-ຣລວສຫອ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏼᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛰᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡷᢀ-ᢨᢪᢰ-ᣵᤀ-ᤜᥐ-ᥭᥰ-ᥴᦀ-ᦫᧁ-ᧇᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭋᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᳩ-ᳬᳮ-ᳱᳵᳶᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞⸯ々-〇〡-〩〱-〵〸-〼ぁ-ゖゝ-ゟァ-ヺー-ヿㄅ-ㄭㄱ-ㆎㆠ-ㆺㇰ-ㇿ㐀-䶵一-鿌ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚗꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꪀ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꯀ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ]"),
                NonAsciiIdentifierPart: new RegExp("[ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮ̀-ʹͶͷͺ-ͽΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁ҃-҇Ҋ-ԧԱ-Ֆՙա-և֑-ׇֽֿׁׂׅׄא-תװ-ײؐ-ؚؠ-٩ٮ-ۓە-ۜ۟-۪ۨ-ۼۿܐ-݊ݍ-ޱ߀-ߵߺࠀ-࠭ࡀ-࡛ࢠࢢ-ࢬࣤ-ࣾऀ-ॣ०-९ॱ-ॷॹ-ॿঁ-ঃঅ-ঌএঐও-নপ-রলশ-হ়-ৄেৈো-ৎৗড়ঢ়য়-ৣ০-ৱਁ-ਃਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹ਼ਾ-ੂੇੈੋ-੍ੑਖ਼-ੜਫ਼੦-ੵઁ-ઃઅ-ઍએ-ઑઓ-નપ-રલળવ-હ઼-ૅે-ૉો-્ૐૠ-ૣ૦-૯ଁ-ଃଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହ଼-ୄେୈୋ-୍ୖୗଡ଼ଢ଼ୟ-ୣ୦-୯ୱஂஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹா-ூெ-ைொ-்ௐௗ௦-௯ఁ-ఃఅ-ఌఎ-ఐఒ-నప-ళవ-హఽ-ౄె-ైొ-్ౕౖౘౙౠ-ౣ౦-౯ಂಃಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹ಼-ೄೆ-ೈೊ-್ೕೖೞೠ-ೣ೦-೯ೱೲംഃഅ-ഌഎ-ഐഒ-ഺഽ-ൄെ-ൈൊ-ൎൗൠ-ൣ൦-൯ൺ-ൿංඃඅ-ඖක-නඳ-රලව-ෆ්ා-ුූෘ-ෟෲෳก-ฺเ-๎๐-๙ກຂຄງຈຊຍດ-ທນ-ຟມ-ຣລວສຫອ-ູົ-ຽເ-ໄໆ່-ໍ໐-໙ໜ-ໟༀ༘༙༠-༩༹༵༷༾-ཇཉ-ཬཱ-྄྆-ྗྙ-ྼ࿆က-၉ၐ-ႝႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚ፝-፟ᎀ-ᎏᎠ-Ᏼᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛰᜀ-ᜌᜎ-᜔ᜠ-᜴ᝀ-ᝓᝠ-ᝬᝮ-ᝰᝲᝳក-៓ៗៜ៝០-៩᠋-᠍᠐-᠙ᠠ-ᡷᢀ-ᢪᢰ-ᣵᤀ-ᤜᤠ-ᤫᤰ-᤻᥆-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉ᧐-᧙ᨀ-ᨛᨠ-ᩞ᩠-᩿᩼-᪉᪐-᪙ᪧᬀ-ᭋ᭐-᭙᭫-᭳ᮀ-᯳ᰀ-᰷᱀-᱉ᱍ-ᱽ᳐-᳔᳒-ᳶᴀ-ᷦ᷼-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼ‌‍‿⁀⁔ⁱⁿₐ-ₜ⃐-⃥⃜⃡-⃰ℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯ⵿-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞⷠ-ⷿⸯ々-〇〡-〯〱-〵〸-〼ぁ-ゖ゙゚ゝ-ゟァ-ヺー-ヿㄅ-ㄭㄱ-ㆎㆠ-ㆺㇰ-ㇿ㐀-䶵一-鿌ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘫꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟ-꛱ꜗ-ꜟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꠧꡀ-ꡳꢀ-꣄꣐-꣙꣠-ꣷꣻ꤀-꤭ꤰ-꥓ꥠ-ꥼꦀ-꧀ꧏ-꧙ꨀ-ꨶꩀ-ꩍ꩐-꩙ꩠ-ꩶꩺꩻꪀ-ꫂꫛ-ꫝꫠ-ꫯꫲ-꫶ꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꯀ-ꯪ꯬꯭꯰-꯹가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻ︀-️︠-︦︳︴﹍-﹏ﹰ-ﹴﹶ-ﻼ０-９Ａ-Ｚ＿ａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ]")
            };
            a = {
                name: "SyntaxTree", processComment: function (e) {
                    var t, n;
                    if (e.type === i.Program) {
                        if (e.body.length > 0) {
                            return
                        }
                    }
                    if (y.trailingComments.length > 0) {
                        if (y.trailingComments[0].range[0] >= e.range[1]) {
                            n = y.trailingComments;
                            y.trailingComments = []
                        } else {
                            y.trailingComments.length = 0
                        }
                    } else {
                        if (y.bottomRightStack.length > 0 && y.bottomRightStack[y.bottomRightStack.length - 1].trailingComments && y.bottomRightStack[y.bottomRightStack.length - 1].trailingComments[0].range[0] >= e.range[1]) {
                            n = y.bottomRightStack[y.bottomRightStack.length - 1].trailingComments;
                            delete y.bottomRightStack[y.bottomRightStack.length - 1].trailingComments
                        }
                    }
                    while (y.bottomRightStack.length > 0 && y.bottomRightStack[y.bottomRightStack.length - 1].range[0] >= e.range[0]) {
                        t = y.bottomRightStack.pop()
                    }
                    if (t) {
                        if (t.leadingComments && t.leadingComments[t.leadingComments.length - 1].range[1] <= e.range[0]) {
                            e.leadingComments = t.leadingComments;
                            delete t.leadingComments
                        }
                    } else if (y.leadingComments.length > 0 && y.leadingComments[y.leadingComments.length - 1].range[1] <= e.range[0]) {
                        e.leadingComments = y.leadingComments;
                        y.leadingComments = []
                    }
                    if (n) {
                        e.trailingComments = n
                    }
                    y.bottomRightStack.push(e)
                }, markEnd: function (e, t) {
                    if (y.range) {
                        e.range = [t.start, c]
                    }
                    if (y.loc) {
                        e.loc = new nt(t.startLineNumber === undefined ? t.lineNumber : t.startLineNumber, t.start - (t.startLineStart === undefined ? t.lineStart : t.startLineStart), h, c - p);
                        this.postProcess(e)
                    }
                    if (y.attachComment) {
                        this.processComment(e)
                    }
                    return e
                }, postProcess: function (e) {
                    if (y.source) {
                        e.loc.source = y.source
                    }
                    return e
                }, createArrayExpression: function (e) {
                    return {type: i.ArrayExpression, elements: e}
                }, createAssignmentExpression: function (e, t, n) {
                    return {type: i.AssignmentExpression, operator: e, left: t, right: n}
                }, createBinaryExpression: function (e, t, n) {
                    var r = e === "||" || e === "&&" ? i.LogicalExpression : i.BinaryExpression;
                    return {type: r, operator: e, left: t, right: n}
                }, createBlockStatement: function (e) {
                    return {type: i.BlockStatement, body: e}
                }, createBreakStatement: function (e) {
                    return {type: i.BreakStatement, label: e}
                }, createCallExpression: function (e, t) {
                    return {type: i.CallExpression, callee: e, arguments: t}
                }, createCatchClause: function (e, t) {
                    return {type: i.CatchClause, param: e, body: t}
                }, createConditionalExpression: function (e, t, n) {
                    return {type: i.ConditionalExpression, test: e, consequent: t, alternate: n}
                }, createContinueStatement: function (e) {
                    return {type: i.ContinueStatement, label: e}
                }, createDebuggerStatement: function () {
                    return {type: i.DebuggerStatement}
                }, createDoWhileStatement: function (e, t) {
                    return {type: i.DoWhileStatement, body: e, test: t}
                }, createEmptyStatement: function () {
                    return {type: i.EmptyStatement}
                }, createExpressionStatement: function (e) {
                    return {type: i.ExpressionStatement, expression: e}
                }, createForStatement: function (e, t, n, r) {
                    return {type: i.ForStatement, init: e, test: t, update: n, body: r}
                }, createForInStatement: function (e, t, n) {
                    return {type: i.ForInStatement, left: e, right: t, body: n, each: false}
                }, createFunctionDeclaration: function (e, t, n, r) {
                    return {
                        type: i.FunctionDeclaration,
                        id: e,
                        params: t,
                        defaults: n,
                        body: r,
                        rest: null,
                        generator: false,
                        expression: false
                    }
                }, createFunctionExpression: function (e, t, n, r) {
                    return {
                        type: i.FunctionExpression,
                        id: e,
                        params: t,
                        defaults: n,
                        body: r,
                        rest: null,
                        generator: false,
                        expression: false
                    }
                }, createIdentifier: function (e) {
                    return {type: i.Identifier, name: e}
                }, createIfStatement: function (e, t, n) {
                    return {type: i.IfStatement, test: e, consequent: t, alternate: n}
                }, createLabeledStatement: function (e, t) {
                    return {type: i.LabeledStatement, label: e, body: t}
                }, createLiteral: function (e) {
                    return {type: i.Literal, value: e.value, raw: f.slice(e.start, e.end)}
                }, createMemberExpression: function (e, t, n) {
                    return {type: i.MemberExpression, computed: e === "[", object: t, property: n}
                }, createNewExpression: function (e, t) {
                    return {type: i.NewExpression, callee: e, arguments: t}
                }, createObjectExpression: function (e) {
                    return {type: i.ObjectExpression, properties: e}
                }, createPostfixExpression: function (e, t) {
                    return {type: i.UpdateExpression, operator: e, argument: t, prefix: false}
                }, createProgram: function (e) {
                    return {type: i.Program, body: e}
                }, createProperty: function (e, t, n) {
                    return {type: i.Property, key: t, value: n, kind: e}
                }, createReturnStatement: function (e) {
                    return {type: i.ReturnStatement, argument: e}
                }, createSequenceExpression: function (e) {
                    return {type: i.SequenceExpression, expressions: e}
                }, createSwitchCase: function (e, t) {
                    return {type: i.SwitchCase, test: e, consequent: t}
                }, createSwitchStatement: function (e, t) {
                    return {type: i.SwitchStatement, discriminant: e, cases: t}
                }, createThisExpression: function () {
                    return {type: i.ThisExpression}
                }, createThrowStatement: function (e) {
                    return {type: i.ThrowStatement, argument: e}
                }, createTryStatement: function (e, t, n, r) {
                    return {type: i.TryStatement, block: e, guardedHandlers: t, handlers: n, finalizer: r}
                }, createUnaryExpression: function (e, t) {
                    if (e === "++" || e === "--") {
                        return {type: i.UpdateExpression, operator: e, argument: t, prefix: true}
                    }
                    return {type: i.UnaryExpression, operator: e, argument: t, prefix: true}
                }, createVariableDeclaration: function (e, t) {
                    return {type: i.VariableDeclaration, declarations: e, kind: t}
                }, createVariableDeclarator: function (e, t) {
                    return {type: i.VariableDeclarator, id: e, init: t}
                }, createWhileStatement: function (e, t) {
                    return {type: i.WhileStatement, test: e, body: t}
                }, createWithStatement: function (e, t) {
                    return {type: i.WithStatement, object: e, body: t}
                }
            };
            e.version = "1.2.2";
            e.tokenize = vn;
            e.parse = mn;
            e.Syntax = function () {
                var e, t = {};
                if (typeof Object.create === "function") {
                    t = Object.create(null)
                }
                for (e in i) {
                    if (i.hasOwnProperty(e)) {
                        t[e] = i[e]
                    }
                }
                if (typeof Object.freeze === "function") {
                    Object.freeze(t)
                }
                return t
            }()
        });
        define("esprimaAdapter", ["./esprima", "env"], function (e, t) {
            if (t.get() === "xpconnect" && typeof Reflect !== "undefined") {
                return Reflect
            } else {
                return e
            }
        });
        define("uglifyjs/consolidator", ["require", "exports", "module", "./parse-js", "./process"], function (e, t, n) {
            t["ast_consolidate"] = function (t) {
                "use strict";
                var n, r = function () {
                    this.nCategory = l.N_OTHER;
                    this.aCount = [];
                    this.aCount[a.N_IDENTIFIER_NAMES] = {};
                    this.aCount[a.N_STRING_LITERALS] = {};
                    this.aCount[a.N_NULL_AND_BOOLEAN_LITERALS] = {};
                    this.aIdentifiers = [];
                    this.aPrimitiveValues = []
                }, i = function () {
                    this.nSaving = 0;
                    this.sName = ""
                }, s = function () {
                    this.oPrimitiveValues = {};
                    this.nSavings = 0
                }, o = e("./process"), u = {
                    N_PROPERTY_ACCESSOR: 1,
                    N_VARIABLE_DECLARATION: 2,
                    N_VARIABLE_STATEMENT_AFFIXATION: 4,
                    N_CLOSURE: 17
                }, a = {
                    N_IDENTIFIER_NAMES: 0,
                    N_STRING_LITERALS: 1,
                    N_NULL_AND_BOOLEAN_LITERALS: 2
                }, f = {S_STRING: "#S", S_SYMBOLIC: "#O"}, l = {
                    N_WITH: 0,
                    N_EVAL: 1,
                    N_EXCLUDABLE: 2,
                    N_OTHER: 3
                }, c = ["null", "false", "true"];
                (function h(e) {
                    var t, n = "toplevel" === e[0], p = !n, d, v, m, g, y = {
                        oSurveySourceElement: {
                            defun: function (e, t, n) {
                                T();
                                N(e);
                                t.forEach(N)
                            }, dot: function (e, t) {
                                k(a.N_IDENTIFIER_NAMES, f.S_STRING + t);
                                return ["dot", g.walk(e), t]
                            }, "function": function (e, t, n) {
                                if ("string" === typeof e) {
                                    N(e)
                                }
                                t.forEach(N)
                            }, name: function (e) {
                                if (-1 !== c.indexOf(e)) {
                                    k(a.N_NULL_AND_BOOLEAN_LITERALS, f.S_SYMBOLIC + e)
                                } else {
                                    if ("eval" === e) {
                                        v.nCategory = l.N_EVAL
                                    }
                                    N(e)
                                }
                            }, "return": function (e) {
                                T()
                            }, string: function (e) {
                                if (e.length > 0) {
                                    k(a.N_STRING_LITERALS, f.S_STRING + e)
                                }
                            }, "try": function (e, t, n) {
                                if (Array.isArray(t)) {
                                    N(t[0])
                                }
                            }, "var": function (e) {
                                T();
                                e.forEach(C)
                            }, "with": function (e, t) {
                                v.nCategory = l.N_WITH;
                                return []
                            }
                        }, oExamineFunctions: {
                            defun: function () {
                                h(this);
                                return []
                            }, "function": function () {
                                h(this);
                                return []
                            }
                        }
                    }, b = [], w = 0, E, S, x = function (e, t) {
                        var n = function () {
                            return e.walk(t)
                        };
                        return n
                    }, T = function () {
                        if (v.nCategory === l.N_OTHER) {
                            v.nCategory = l.N_EXCLUDABLE
                        }
                    }, N = function (e) {
                        if (-1 === v.aIdentifiers.indexOf(e)) {
                            v.aIdentifiers.push(e)
                        }
                    }, C = function (e) {
                        N(e[0])
                    }, k = function (e, t) {
                        if (!v.aCount[e].hasOwnProperty(t)) {
                            v.aCount[e][t] = 0;
                            if (-1 === v.aPrimitiveValues.indexOf(t)) {
                                v.aPrimitiveValues.push(t)
                            }
                        }
                        v.aCount[e][t] += 1
                    }, L = function (e, t, n) {
                        var l, c = m.cname, p, v = {
                            dot: function (e, t) {
                                var n = f.S_STRING + t;
                                return y.oPrimitiveValues.hasOwnProperty(n) && y.oPrimitiveValues[n].nSaving > 0 ? ["sub", g.walk(e), ["name", y.oPrimitiveValues[n].sName]] : ["dot", g.walk(e), t]
                            }, name: function (e) {
                                var t = f.S_SYMBOLIC + e;
                                return ["name", y.oPrimitiveValues.hasOwnProperty(t) && y.oPrimitiveValues[t].nSaving > 0 ? y.oPrimitiveValues[t].sName : e]
                            }, string: function (e) {
                                var t = f.S_STRING + e;
                                return y.oPrimitiveValues.hasOwnProperty(t) && y.oPrimitiveValues[t].nSaving > 0 ? ["name", y.oPrimitiveValues[t].sName] : ["string", e]
                            }
                        }, y = new s, w = new s, E = new r, S = [], T = function (e) {
                            var t = function (t) {
                                if (-1 === e.indexOf(t)) {
                                    e.push(t)
                                }
                            };
                            return t
                        }, N = function (e, t) {
                            var n = function (n) {
                                if (!E.aCount[t].hasOwnProperty(n)) {
                                    E.aCount[t][n] = 0
                                }
                                E.aCount[t][n] += b[e].aCount[t][n]
                            };
                            return n
                        }, C = function (e) {
                            var t = function (t) {
                                Object.keys(b[e].aCount[t]).forEach(N(e, t))
                            };
                            return t
                        }, k = function (e) {
                            Object.keys(b[e].aCount).forEach(C(e))
                        }, L = function (e) {
                            if (y.oPrimitiveValues[e].nSaving > 0) {
                                S.push([y.oPrimitiveValues[e].sName, [0 === e.indexOf(f.S_SYMBOLIC) ? "name" : "string", e.substring(f.S_SYMBOLIC.length)]])
                            }
                        }, A = function (e, t) {
                            var n = w.oPrimitiveValues[e].nSaving - w.oPrimitiveValues[t].nSaving;
                            return n > 0 ? -1 : n < 0 ? 1 : 0
                        }, O = function (e) {
                            var t, n, r = e.substring(f.S_SYMBOLIC.length), s = r.length, l, c = o.make_string(r).length;
                            w.oPrimitiveValues[e] = new i;
                            do {
                                n = m.cname;
                                w.oPrimitiveValues[e].sName = m.next_mangled()
                            } while (-1 !== E.aIdentifiers.indexOf(w.oPrimitiveValues[e].sName));
                            l = w.oPrimitiveValues[e].sName.length;
                            if (0 === e.indexOf(f.S_SYMBOLIC)) {
                                w.oPrimitiveValues[e].nSaving -= l + s + u.N_VARIABLE_DECLARATION;
                                w.oPrimitiveValues[e].nSaving += E.aCount[a.N_NULL_AND_BOOLEAN_LITERALS][e] * (s - l)
                            } else {
                                w.oPrimitiveValues[e].nSaving -= l + c + u.N_VARIABLE_DECLARATION;
                                if (E.aCount[a.N_IDENTIFIER_NAMES].hasOwnProperty(e)) {
                                    w.oPrimitiveValues[e].nSaving += E.aCount[a.N_IDENTIFIER_NAMES][e] * (s - l - u.N_PROPERTY_ACCESSOR)
                                }
                                if (E.aCount[a.N_STRING_LITERALS].hasOwnProperty(e)) {
                                    w.oPrimitiveValues[e].nSaving += E.aCount[a.N_STRING_LITERALS][e] * (c - l)
                                }
                            }
                            if (w.oPrimitiveValues[e].nSaving > 0) {
                                w.nSavings += w.oPrimitiveValues[e].nSaving
                            } else {
                                m.cname = n
                            }
                        }, M = function (t) {
                            d[e][1].unshift(t)
                        };
                        if (e > t) {
                            return
                        }
                        if (e === t && "stat" === d[e][0] && "call" === d[e][1][0] && "function" === d[e][1][1][0]) {
                            h(d[e][1][1]);
                            return
                        }
                        for (p = e; p <= t; p += 1) {
                            b[p].aPrimitiveValues.forEach(T(E.aPrimitiveValues))
                        }
                        if (0 === E.aPrimitiveValues.length) {
                            return
                        }
                        for (p = e; p <= t; p += 1) {
                            k(p);
                            b[p].aIdentifiers.forEach(T(E.aIdentifiers))
                        }
                        do {
                            y = w;
                            if (Object.keys(w.oPrimitiveValues).length > 0) {
                                E.aPrimitiveValues.sort(A)
                            }
                            w = new s;
                            E.aPrimitiveValues.forEach(O);
                            m.cname = c
                        } while (w.nSavings > y.nSavings);
                        if ("var" !== d[e][0]) {
                            y.nSavings -= u.N_VARIABLE_STATEMENT_AFFIXATION
                        }
                        if (n) {
                            y.nSavings -= u.N_CLOSURE
                        }
                        if (y.nSavings > 0) {
                            Object.keys(y.oPrimitiveValues).forEach(L);
                            for (p = e; p <= t; p += 1) {
                                g = o.ast_walker();
                                d[p] = g.with_walkers(v, x(g, d[p]))
                            }
                            if ("var" === d[e][0]) {
                                S.reverse().forEach(M)
                            } else {
                                Array.prototype.splice.call(d, e, 0, ["var", S]);
                                t += 1
                            }
                            if (n) {
                                Array.prototype.splice.call(d, e, 0, ["stat", ["call", ["function", null, [], []], []]]);
                                for (p = t + 1; p > e; p -= 1) {
                                    Array.prototype.unshift.call(d[e][1][1][3], d[p])
                                }
                                Array.prototype.splice.call(d, e + 1, t - e + 1)
                            }
                        }
                        if (n) {
                            m.cname = c
                        }
                    };
                    d = e[n ? 1 : 3];
                    if (0 === d.length) {
                        return
                    }
                    m = n ? e.scope : d.scope;
                    while (w < d.length && "directive" === d[w][0]) {
                        w += 1;
                        b.push(null)
                    }
                    if (d.length === w) {
                        return
                    }
                    for (E = w; E < d.length; E += 1) {
                        v = new r;
                        g = o.ast_walker();
                        g.with_walkers(y.oSurveySourceElement, x(g, d[E]));
                        p = p && l.N_WITH !== v.nCategory && l.N_EVAL !== v.nCategory;
                        b.push(v)
                    }
                    if (p) {
                        L(w, d.length - 1, false)
                    } else {
                        for (E = d.length - 1; E >= w; E -= 1) {
                            v = b[E];
                            if (l.N_OTHER === v.nCategory) {
                                if ("undefined" === typeof S) {
                                    S = E
                                }
                                if (E === w) {
                                    L(E, S, true)
                                }
                            } else {
                                if ("undefined" !== typeof S) {
                                    L(E + 1, S, true);
                                    S = void 0
                                }
                                g = o.ast_walker();
                                g.with_walkers(y.oExamineFunctions, x(g, d[E]))
                            }
                        }
                    }
                })(t = o.ast_add_scope(t));
                return t
            }
        });
        define("uglifyjs/parse-js", ["exports"], function (e) {
            function v(e) {
                return d.letter.test(e)
            }

            function m(e) {
                e = e.charCodeAt(0);
                return e >= 48 && e <= 57
            }

            function g(e) {
                return d.digit.test(e)
            }

            function y(e) {
                return m(e) || v(e)
            }

            function b(e) {
                return d.combining_mark.test(e)
            }

            function w(e) {
                return d.connector_punctuation.test(e)
            }

            function E(e) {
                return e == "$" || e == "_" || v(e)
            }

            function S(e) {
                return E(e) || b(e) || g(e) || w(e) || e == "‌" || e == "‍"
            }

            function x(e) {
                if (o.test(e)) {
                    return parseInt(e.substr(2), 16)
                } else if (u.test(e)) {
                    return parseInt(e.substr(1), 8)
                } else if (a.test(e)) {
                    return parseFloat(e)
                }
            }

            function T(e, t, n, r) {
                this.message = e;
                this.line = t + 1;
                this.col = n + 1;
                this.pos = r + 1;
                this.stack = (new Error).stack
            }

            function N(e, t, n, r) {
                throw new T(e, t, n, r)
            }

            function C(e, t, n) {
                return e.type == t && (n == null || e.value == n)
            }

            function L(e) {
                function o() {
                    return n.text.charAt(n.pos)
                }

                function u(e, t) {
                    var r = n.text.charAt(n.pos++);
                    if (e && !r)throw k;
                    if (r == "\n") {
                        n.newline_before = n.newline_before || !t;
                        ++n.line;
                        n.col = 0
                    } else {
                        ++n.col
                    }
                    return r
                }

                function a() {
                    return !n.peek()
                }

                function p(e, t) {
                    var r = n.text.indexOf(e, n.pos);
                    if (t && r == -1)throw k;
                    return r
                }

                function d() {
                    n.tokline = n.line;
                    n.tokcol = n.col;
                    n.tokpos = n.pos
                }

                function v(e, t, i) {
                    n.regex_allowed = e == "operator" && !z(O, t) || e == "keyword" && z(r, t) || e == "punc" && z(c, t);
                    var s = {
                        type: e,
                        value: t,
                        line: n.tokline,
                        col: n.tokcol,
                        pos: n.tokpos,
                        endpos: n.pos,
                        nlb: n.newline_before
                    };
                    if (!i) {
                        s.comments_before = n.comments_before;
                        n.comments_before = [];
                        for (var o = 0, u = s.comments_before.length; o < u; o++) {
                            s.nlb = s.nlb || s.comments_before[o].nlb
                        }
                    }
                    n.newline_before = false;
                    return s
                }

                function g() {
                    while (z(l, o()))u()
                }

                function b(e) {
                    var t = "", n = o(), r = 0;
                    while (n && e(n, r++)) {
                        t += u();
                        n = o()
                    }
                    return t
                }

                function w(e) {
                    N(e, n.tokline, n.tokcol, n.tokpos)
                }

                function T(e) {
                    var t = false, n = false, r = false, i = e == ".";
                    var s = b(function (s, o) {
                        if (s == "x" || s == "X") {
                            if (r)return false;
                            return r = true
                        }
                        if (!r && (s == "E" || s == "e")) {
                            if (t)return false;
                            return t = n = true
                        }
                        if (s == "-") {
                            if (n || o == 0 && !e)return true;
                            return false
                        }
                        if (s == "+")return n;
                        n = false;
                        if (s == ".") {
                            if (!i && !r && !t)return i = true;
                            return false
                        }
                        return y(s)
                    });
                    if (e)s = e + s;
                    var o = x(s);
                    if (!isNaN(o)) {
                        return v("num", o)
                    } else {
                        w("Invalid syntax: " + s)
                    }
                }

                function C(e) {
                    var t = u(true, e);
                    switch (t) {
                        case"n":
                            return "\n";
                        case"r":
                            return "\r";
                        case"t":
                            return "	";
                        case"b":
                            return "\b";
                        case"v":
                            return "";
                        case"f":
                            return "\f";
                        case"0":
                            return "\0";
                        case"x":
                            return String.fromCharCode(L(2));
                        case"u":
                            return String.fromCharCode(L(4));
                        case"\n":
                            return "";
                        default:
                            return t
                    }
                }

                function L(e) {
                    var t = 0;
                    for (; e > 0; --e) {
                        var n = parseInt(u(true), 16);
                        if (isNaN(n))w("Invalid hex-character pattern in string");
                        t = t << 4 | n
                    }
                    return t
                }

                function A() {
                    return I("Unterminated string constant", function () {
                        var e = u(), t = "";
                        for (; ;) {
                            var n = u(true);
                            if (n == "\\") {
                                var r = 0, i = null;
                                n = b(function (e) {
                                    if (e >= "0" && e <= "7") {
                                        if (!i) {
                                            i = e;
                                            return ++r
                                        } else if (i <= "3" && r <= 2)return ++r; else if (i >= "4" && r <= 1)return ++r
                                    }
                                    return false
                                });
                                if (r > 0)n = String.fromCharCode(parseInt(n, 8)); else n = C(true)
                            } else if (n == e)break; else if (n == "\n")throw k;
                            t += n
                        }
                        return v("string", t)
                    })
                }

                function M() {
                    u();
                    var e = p("\n"), t;
                    if (e == -1) {
                        t = n.text.substr(n.pos);
                        n.pos = n.text.length
                    } else {
                        t = n.text.substring(n.pos, e);
                        n.pos = e
                    }
                    return v("comment1", t, true)
                }

                function _() {
                    u();
                    return I("Unterminated multiline comment", function () {
                        var e = p("*/", true), t = n.text.substring(n.pos, e);
                        n.pos = e + 2;
                        n.line += t.split("\n").length - 1;
                        n.newline_before = n.newline_before || t.indexOf("\n") >= 0;
                        if (/^@cc_on/i.test(t)) {
                            W("WARNING: at line " + n.line);
                            W('*** Found "conditional comment": ' + t);
                            W("*** UglifyJS DISCARDS ALL COMMENTS.  This means your code might no longer work properly in Internet Explorer.")
                        }
                        return v("comment2", t, true)
                    })
                }

                function D() {
                    var e = false, n = "", r, i = false, s;
                    while ((r = o()) != null) {
                        if (!e) {
                            if (r == "\\")i = e = true, u(); else if (S(r))n += u(); else break
                        } else {
                            if (r != "u")w("Expecting UnicodeEscapeSequence -- uXXXX");
                            r = C();
                            if (!S(r))w("Unicode char: " + r.charCodeAt(0) + " is not valid in identifier");
                            n += r;
                            e = false
                        }
                    }
                    if (z(t, n) && i) {
                        s = n.charCodeAt(0).toString(16).toUpperCase();
                        n = "\\u" + "0000".substr(s.length) + s + n.slice(1)
                    }
                    return n
                }

                function P(e) {
                    return I("Unterminated regular expression", function () {
                        var t = false, n, r = false;
                        while (n = u(true))if (t) {
                            e += "\\" + n;
                            t = false
                        } else if (n == "[") {
                            r = true;
                            e += n
                        } else if (n == "]" && r) {
                            r = false;
                            e += n
                        } else if (n == "/" && !r) {
                            break
                        } else if (n == "\\") {
                            t = true
                        } else {
                            e += n
                        }
                        var i = D();
                        return v("regexp", [e, i])
                    })
                }

                function H(e) {
                    function t(e) {
                        if (!o())return e;
                        var n = e + o();
                        if (z(f, n)) {
                            u();
                            return t(n)
                        } else {
                            return e
                        }
                    }

                    return v("operator", t(e || u()))
                }

                function B() {
                    u();
                    var e = n.regex_allowed;
                    switch (o()) {
                        case"/":
                            n.comments_before.push(M());
                            n.regex_allowed = e;
                            return q();
                        case"*":
                            n.comments_before.push(_());
                            n.regex_allowed = e;
                            return q()
                    }
                    return n.regex_allowed ? P("") : H("/")
                }

                function j() {
                    u();
                    return m(o()) ? T(".") : v("punc", ".")
                }

                function F() {
                    var e = D();
                    return !z(t, e) ? v("name", e) : z(f, e) ? v("operator", e) : z(i, e) ? v("atom", e) : v("keyword", e)
                }

                function I(e, t) {
                    try {
                        return t()
                    } catch (n) {
                        if (n === k)w(e); else throw n
                    }
                }

                function q(e) {
                    if (e != null)return P(e);
                    g();
                    d();
                    var t = o();
                    if (!t)return v("eof");
                    if (m(t))return T();
                    if (t == '"' || t == "'")return A();
                    if (z(h, t))return v("punc", u());
                    if (t == ".")return j();
                    if (t == "/")return B();
                    if (z(s, t))return H();
                    if (t == "\\" || E(t))return F();
                    w("Unexpected character '" + t + "'")
                }

                var n = {
                    text: e.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/^\uFEFF/, ""),
                    pos: 0,
                    tokpos: 0,
                    line: 0,
                    tokline: 0,
                    col: 0,
                    tokcol: 0,
                    newline_before: false,
                    regex_allowed: false,
                    comments_before: []
                };
                q.context = function (e) {
                    if (e)n = e;
                    return n
                };
                return q
            }

            function H(e, t, n) {
                this.name = e;
                this.start = t;
                this.end = n
            }

            function B(e, t, n) {
                function i(e, t) {
                    return C(r.token, e, t)
                }

                function s() {
                    return r.peeked || (r.peeked = r.input())
                }

                function o() {
                    r.prev = r.token;
                    if (r.peeked) {
                        r.token = r.peeked;
                        r.peeked = null
                    } else {
                        r.token = r.input()
                    }
                    r.in_directives = r.in_directives && (r.token.type == "string" || i("punc", ";"));
                    return r.token
                }

                function u() {
                    return r.prev
                }

                function a(e, t, n, i) {
                    var s = r.input.context();
                    N(e, t != null ? t : s.tokline, n != null ? n : s.tokcol, i != null ? i : s.tokpos)
                }

                function f(e, t) {
                    a(t, e.line, e.col)
                }

                function l(e) {
                    if (e == null)e = r.token;
                    f(e, "Unexpected token: " + e.type + " (" + e.value + ")")
                }

                function c(e, t) {
                    if (i(e, t)) {
                        return o()
                    }
                    f(r.token, "Unexpected token " + r.token.type + ", expected " + e)
                }

                function h(e) {
                    return c("punc", e)
                }

                function p() {
                    return !t && (r.token.nlb || i("eof") || i("punc", "}"))
                }

                function d() {
                    if (i("punc", ";"))o(); else if (!p())l()
                }

                function v() {
                    return q(arguments)
                }

                function m() {
                    h("(");
                    var e = lt();
                    h(")");
                    return e
                }

                function g(e, t, n) {
                    return e instanceof H ? e : new H(e, t, n)
                }

                function y(e) {
                    if (n)return function () {
                        var t = r.token;
                        var n = e.apply(this, arguments);
                        n[0] = g(n[0], t, u());
                        return n
                    }; else return e
                }

                function w(e) {
                    r.labels.push(e);
                    var n = r.token, i = b();
                    if (t && !z(D, i[0]))l(n);
                    r.labels.pop();
                    return v("label", e, i)
                }

                function E() {
                    return v("stat", F(lt, d))
                }

                function S(e) {
                    var t;
                    if (!p()) {
                        t = i("name") ? r.token.value : null
                    }
                    if (t != null) {
                        o();
                        if (!U(t, r.labels))a("Label " + t + " without matching loop or statement")
                    } else if (r.in_loop == 0)a(e + " not inside a loop or switch");
                    d();
                    return v(e, t)
                }

                function x() {
                    h("(");
                    var e = null;
                    if (!i("punc", ";")) {
                        e = i("keyword", "var") ? (o(), $(true)) : lt(true, true);
                        if (i("operator", "in")) {
                            if (e[0] == "var" && e[1].length > 1)a("Only one variable declaration allowed in for..in loop");
                            return k(e)
                        }
                    }
                    return T(e)
                }

                function T(e) {
                    h(";");
                    var t = i("punc", ";") ? null : lt();
                    h(";");
                    var n = i("punc", ")") ? null : lt();
                    h(")");
                    return v("for", e, t, n, ct(b))
                }

                function k(e) {
                    var t = e[0] == "var" ? v("name", e[1][0]) : e;
                    o();
                    var n = lt();
                    h(")");
                    return v("for-in", e, t, n, ct(b))
                }

                function I() {
                    var e = m(), t = b(), n;
                    if (i("keyword", "else")) {
                        o();
                        n = b()
                    }
                    return v("if", e, t, n)
                }

                function R() {
                    h("{");
                    var e = [];
                    while (!i("punc", "}")) {
                        if (i("eof"))l();
                        e.push(b())
                    }
                    o();
                    return e
                }

                function X() {
                    var e = R(), t, n;
                    if (i("keyword", "catch")) {
                        o();
                        h("(");
                        if (!i("name"))a("Name expected");
                        var s = r.token.value;
                        o();
                        h(")");
                        t = [s, R()]
                    }
                    if (i("keyword", "finally")) {
                        o();
                        n = R()
                    }
                    if (!t && !n)a("Missing catch/finally blocks");
                    return v("try", e, t, n)
                }

                function V(e) {
                    var t = [];
                    for (; ;) {
                        if (!i("name"))l();
                        var n = r.token.value;
                        o();
                        if (i("operator", "=")) {
                            o();
                            t.push([n, lt(false, e)])
                        } else {
                            t.push([n])
                        }
                        if (!i("punc", ","))break;
                        o()
                    }
                    return t
                }

                function $(e) {
                    return v("var", V(e))
                }

                function J() {
                    return v("const", V())
                }

                function K() {
                    var e = Q(false), t;
                    if (i("punc", "(")) {
                        o();
                        t = G(")")
                    } else {
                        t = []
                    }
                    return nt(v("new", e, t), true)
                }

                function G(e, t, n) {
                    var r = true, s = [];
                    while (!i("punc", e)) {
                        if (r)r = false; else h(",");
                        if (t && i("punc", e))break;
                        if (i("punc", ",") && n) {
                            s.push(["atom", "undefined"])
                        } else {
                            s.push(lt(false))
                        }
                    }
                    o();
                    return s
                }

                function Y() {
                    return v("array", G("]", !t, true))
                }

                function Z() {
                    var e = true, n = [];
                    while (!i("punc", "}")) {
                        if (e)e = false; else h(",");
                        if (!t && i("punc", "}"))break;
                        var s = r.token.type;
                        var u = et();
                        if (s == "name" && (u == "get" || u == "set") && !i("punc", ":")) {
                            n.push([tt(), B(false), u])
                        } else {
                            h(":");
                            n.push([u, lt(false)])
                        }
                    }
                    o();
                    return v("object", n)
                }

                function et() {
                    switch (r.token.type) {
                        case"num":
                        case"string":
                            return F(r.token.value, o)
                    }
                    return tt()
                }

                function tt() {
                    switch (r.token.type) {
                        case"name":
                        case"operator":
                        case"keyword":
                        case"atom":
                            return F(r.token.value, o);
                        default:
                            l()
                    }
                }

                function nt(e, t) {
                    if (i("punc", ".")) {
                        o();
                        return nt(v("dot", e, tt()), t)
                    }
                    if (i("punc", "[")) {
                        o();
                        return nt(v("sub", e, F(lt, j(h, "]"))), t)
                    }
                    if (t && i("punc", "(")) {
                        o();
                        return nt(v("call", e, G(")")), true)
                    }
                    return e
                }

                function rt(e) {
                    if (i("operator") && z(A, r.token.value)) {
                        return it("unary-prefix", F(r.token.value, o), rt(e))
                    }
                    var t = Q(e);
                    while (i("operator") && z(O, r.token.value) && !r.token.nlb) {
                        t = it("unary-postfix", r.token.value, t);
                        o()
                    }
                    return t
                }

                function it(e, t, n) {
                    if ((t == "++" || t == "--") && !at(n))a("Invalid use of " + t + " operator");
                    return v(e, t, n)
                }

                function st(e, t, n) {
                    var s = i("operator") ? r.token.value : null;
                    if (s && s == "in" && n)s = null;
                    var u = s != null ? _[s] : null;
                    if (u != null && u > t) {
                        o();
                        var a = st(rt(true), u, n);
                        return st(v("binary", s, e, a), t, n)
                    }
                    return e
                }

                function ot(e) {
                    return st(rt(true), 0, e)
                }

                function ut(e) {
                    var t = ot(e);
                    if (i("operator", "?")) {
                        o();
                        var n = lt(false);
                        h(":");
                        return v("conditional", t, n, lt(false, e))
                    }
                    return t
                }

                function at(e) {
                    if (!t)return true;
                    switch (e[0] + "") {
                        case"dot":
                        case"sub":
                        case"new":
                        case"call":
                            return true;
                        case"name":
                            return e[1] != "this"
                    }
                }

                function ft(e) {
                    var t = ut(e), n = r.token.value;
                    if (i("operator") && z(M, n)) {
                        if (at(t)) {
                            o();
                            return v("assign", M[n], t, ft(e))
                        }
                        a("Invalid assignment")
                    }
                    return t
                }

                function ct(e) {
                    try {
                        ++r.in_loop;
                        return e()
                    } finally {
                        --r.in_loop
                    }
                }

                var r = {
                    input: typeof e == "string" ? L(e, true) : e,
                    token: null,
                    prev: null,
                    peeked: null,
                    in_function: 0,
                    in_directives: true,
                    in_loop: 0,
                    labels: []
                };
                r.token = o();
                var b = y(function () {
                    if (i("operator", "/") || i("operator", "/=")) {
                        r.peeked = null;
                        r.token = r.input(r.token.value.substr(1))
                    }
                    switch (r.token.type) {
                        case"string":
                            var e = r.in_directives, t = E();
                            if (e && t[1][0] == "string" && !i("punc", ","))return v("directive", t[1][1]);
                            return t;
                        case"num":
                        case"regexp":
                        case"operator":
                        case"atom":
                            return E();
                        case"name":
                            return C(s(), "punc", ":") ? w(F(r.token.value, o, o)) : E();
                        case"punc":
                            switch (r.token.value) {
                                case"{":
                                    return v("block", R());
                                case"[":
                                case"(":
                                    return E();
                                case";":
                                    o();
                                    return v("block");
                                default:
                                    l()
                            }
                            ;
                        case"keyword":
                            switch (F(r.token.value, o)) {
                                case"break":
                                    return S("break");
                                case"continue":
                                    return S("continue");
                                case"debugger":
                                    d();
                                    return v("debugger");
                                case"do":
                                    return function (e) {
                                        c("keyword", "while");
                                        return v("do", F(m, d), e)
                                    }(ct(b));
                                case"for":
                                    return x();
                                case"function":
                                    return B(true);
                                case"if":
                                    return I();
                                case"return":
                                    if (r.in_function == 0)a("'return' outside of function");
                                    return v("return", i("punc", ";") ? (o(), null) : p() ? null : F(lt, d));
                                case"switch":
                                    return v("switch", m(), W());
                                case"throw":
                                    if (r.token.nlb)a("Illegal newline after 'throw'");
                                    return v("throw", F(lt, d));
                                case"try":
                                    return X();
                                case"var":
                                    return F($, d);
                                case"const":
                                    return F(J, d);
                                case"while":
                                    return v("while", m(), ct(b));
                                case"with":
                                    return v("with", m(), b());
                                default:
                                    l()
                            }
                    }
                });
                var B = function (e) {
                    var t = i("name") ? F(r.token.value, o) : null;
                    if (e && !t)l();
                    h("(");
                    return v(e ? "defun" : "function", t, function (e, t) {
                        while (!i("punc", ")")) {
                            if (e)e = false; else h(",");
                            if (!i("name"))l();
                            t.push(r.token.value);
                            o()
                        }
                        o();
                        return t
                    }(true, []), function () {
                        ++r.in_function;
                        var e = r.in_loop;
                        r.in_directives = true;
                        r.in_loop = 0;
                        var t = R();
                        --r.in_function;
                        r.in_loop = e;
                        return t
                    }())
                };
                var W = j(ct, function () {
                    h("{");
                    var e = [], t = null;
                    while (!i("punc", "}")) {
                        if (i("eof"))l();
                        if (i("keyword", "case")) {
                            o();
                            t = [];
                            e.push([lt(), t]);
                            h(":")
                        } else if (i("keyword", "default")) {
                            o();
                            h(":");
                            t = [];
                            e.push([null, t])
                        } else {
                            if (!t)l();
                            t.push(b())
                        }
                    }
                    o();
                    return e
                });
                var Q = y(function (e) {
                    if (i("operator", "new")) {
                        o();
                        return K()
                    }
                    if (i("punc")) {
                        switch (r.token.value) {
                            case"(":
                                o();
                                return nt(F(lt, j(h, ")")), e);
                            case"[":
                                o();
                                return nt(Y(), e);
                            case"{":
                                o();
                                return nt(Z(), e)
                        }
                        l()
                    }
                    if (i("keyword", "function")) {
                        o();
                        return nt(B(false), e)
                    }
                    if (z(P, r.token.type)) {
                        var t = r.token.type == "regexp" ? v("regexp", r.token.value[0], r.token.value[1]) : v(r.token.type, r.token.value);
                        return nt(F(t, o), e)
                    }
                    l()
                });
                var lt = y(function (e, t) {
                    if (arguments.length == 0)e = true;
                    var n = ft(t);
                    if (e && i("punc", ",")) {
                        o();
                        return v("seq", n, lt(true, t))
                    }
                    return n
                });
                return v("toplevel", function (e) {
                    while (!i("eof"))e.push(b());
                    return e
                }([]))
            }

            function j(e) {
                var t = q(arguments, 1);
                return function () {
                    return e.apply(this, t.concat(q(arguments)))
                }
            }

            function F(e) {
                if (e instanceof Function)e = e();
                for (var t = 1, n = arguments.length; --n > 0; ++t)arguments[t]();
                return e
            }

            function I(e) {
                var t = {};
                for (var n = 0; n < e.length; ++n)t[e[n]] = true;
                return t
            }

            function q(e, t) {
                return Array.prototype.slice.call(e, t || 0)
            }

            function R(e) {
                return e.split("")
            }

            function U(e, t) {
                for (var n = t.length; --n >= 0;)if (t[n] == e)return true;
                return false
            }

            function z(e, t) {
                return Object.prototype.hasOwnProperty.call(e, t)
            }

            var t = I(["break", "case", "catch", "const", "continue", "debugger", "default", "delete", "do", "else", "finally", "for", "function", "if", "in", "instanceof", "new", "return", "switch", "throw", "try", "typeof", "var", "void", "while", "with"]);
            var n = I(["abstract", "boolean", "byte", "char", "class", "double", "enum", "export", "extends", "final", "float", "goto", "implements", "import", "int", "interface", "long", "native", "package", "private", "protected", "public", "short", "static", "super", "synchronized", "throws", "transient", "volatile"]);
            var r = I(["return", "new", "delete", "throw", "else", "case"]);
            var i = I(["false", "null", "true", "undefined"]);
            var s = I(R("+-*&%=<>!?|~^"));
            var o = /^0x[0-9a-f]+$/i;
            var u = /^0[0-7]+$/;
            var a = /^\d*\.?\d*(?:e[+-]?\d*(?:\d\.?|\.?\d)\d*)?$/i;
            var f = I(["in", "instanceof", "typeof", "new", "void", "delete", "++", "--", "+", "-", "!", "~", "&", "|", "^", "*", "/", "%", ">>", "<<", ">>>", "<", ">", "<=", ">=", "==", "===", "!=", "!==", "?", "=", "+=", "-=", "/=", "*=", "%=", ">>=", "<<=", ">>>=", "|=", "^=", "&=", "&&", "||"]);
            var l = I(R("  \n\r	\f​᠎             　﻿"));
            var c = I(R("[{(,.;:"));
            var h = I(R("[]{}(),;:"));
            var p = I(R("gmsiy"));
            var d = {
                letter: new RegExp("[\\u0041-\\u005A\\u0061-\\u007A\\u00AA\\u00B5\\u00BA\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u0527\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0620-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE\\u06EF\\u06FA-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u07F4\\u07F5\\u07FA\\u0800-\\u0815\\u081A\\u0824\\u0828\\u0840-\\u0858\\u08A0\\u08A2-\\u08AC\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0971-\\u0977\\u0979-\\u097F\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C33\\u0C35-\\u0C39\\u0C3D\\u0C58\\u0C59\\u0C60\\u0C61\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0CF1\\u0CF2\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D3A\\u0D3D\\u0D4E\\u0D60\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E46\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EDC-\\u0EDF\\u0F00\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8C\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10A0-\\u10C5\\u10C7\\u10CD\\u10D0-\\u10FA\\u10FC-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u167F\\u1681-\\u169A\\u16A0-\\u16EA\\u16EE-\\u16F0\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17D7\\u17DC\\u1820-\\u1877\\u1880-\\u18A8\\u18AA\\u18B0-\\u18F5\\u1900-\\u191C\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19AB\\u19C1-\\u19C7\\u1A00-\\u1A16\\u1A20-\\u1A54\\u1AA7\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1BBA-\\u1BE5\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C7D\\u1CE9-\\u1CEC\\u1CEE-\\u1CF1\\u1CF5\\u1CF6\\u1D00-\\u1DBF\\u1E00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2071\\u207F\\u2090-\\u209C\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u212F-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2160-\\u2188\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2CE4\\u2CEB-\\u2CEE\\u2CF2\\u2CF3\\u2D00-\\u2D25\\u2D27\\u2D2D\\u2D30-\\u2D67\\u2D6F\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2E2F\\u3005-\\u3007\\u3021-\\u3029\\u3031-\\u3035\\u3038-\\u303C\\u3041-\\u3096\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31BA\\u31F0-\\u31FF\\u3400-\\u4DB5\\u4E00-\\u9FCC\\uA000-\\uA48C\\uA4D0-\\uA4FD\\uA500-\\uA60C\\uA610-\\uA61F\\uA62A\\uA62B\\uA640-\\uA66E\\uA67F-\\uA697\\uA6A0-\\uA6EF\\uA717-\\uA71F\\uA722-\\uA788\\uA78B-\\uA78E\\uA790-\\uA793\\uA7A0-\\uA7AA\\uA7F8-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA8F2-\\uA8F7\\uA8FB\\uA90A-\\uA925\\uA930-\\uA946\\uA960-\\uA97C\\uA984-\\uA9B2\\uA9CF\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAA60-\\uAA76\\uAA7A\\uAA80-\\uAAAF\\uAAB1\\uAAB5\\uAAB6\\uAAB9-\\uAABD\\uAAC0\\uAAC2\\uAADB-\\uAADD\\uAAE0-\\uAAEA\\uAAF2-\\uAAF4\\uAB01-\\uAB06\\uAB09-\\uAB0E\\uAB11-\\uAB16\\uAB20-\\uAB26\\uAB28-\\uAB2E\\uABC0-\\uABE2\\uAC00-\\uD7A3\\uD7B0-\\uD7C6\\uD7CB-\\uD7FB\\uF900-\\uFA6D\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC]"),
                combining_mark: new RegExp("[\\u0300-\\u036F\\u0483-\\u0487\\u0591-\\u05BD\\u05BF\\u05C1\\u05C2\\u05C4\\u05C5\\u05C7\\u0610-\\u061A\\u064B-\\u065F\\u0670\\u06D6-\\u06DC\\u06DF-\\u06E4\\u06E7\\u06E8\\u06EA-\\u06ED\\u0711\\u0730-\\u074A\\u07A6-\\u07B0\\u07EB-\\u07F3\\u0816-\\u0819\\u081B-\\u0823\\u0825-\\u0827\\u0829-\\u082D\\u0859-\\u085B\\u08E4-\\u08FE\\u0900-\\u0903\\u093A-\\u093C\\u093E-\\u094F\\u0951-\\u0957\\u0962\\u0963\\u0981-\\u0983\\u09BC\\u09BE-\\u09C4\\u09C7\\u09C8\\u09CB-\\u09CD\\u09D7\\u09E2\\u09E3\\u0A01-\\u0A03\\u0A3C\\u0A3E-\\u0A42\\u0A47\\u0A48\\u0A4B-\\u0A4D\\u0A51\\u0A70\\u0A71\\u0A75\\u0A81-\\u0A83\\u0ABC\\u0ABE-\\u0AC5\\u0AC7-\\u0AC9\\u0ACB-\\u0ACD\\u0AE2\\u0AE3\\u0B01-\\u0B03\\u0B3C\\u0B3E-\\u0B44\\u0B47\\u0B48\\u0B4B-\\u0B4D\\u0B56\\u0B57\\u0B62\\u0B63\\u0B82\\u0BBE-\\u0BC2\\u0BC6-\\u0BC8\\u0BCA-\\u0BCD\\u0BD7\\u0C01-\\u0C03\\u0C3E-\\u0C44\\u0C46-\\u0C48\\u0C4A-\\u0C4D\\u0C55\\u0C56\\u0C62\\u0C63\\u0C82\\u0C83\\u0CBC\\u0CBE-\\u0CC4\\u0CC6-\\u0CC8\\u0CCA-\\u0CCD\\u0CD5\\u0CD6\\u0CE2\\u0CE3\\u0D02\\u0D03\\u0D3E-\\u0D44\\u0D46-\\u0D48\\u0D4A-\\u0D4D\\u0D57\\u0D62\\u0D63\\u0D82\\u0D83\\u0DCA\\u0DCF-\\u0DD4\\u0DD6\\u0DD8-\\u0DDF\\u0DF2\\u0DF3\\u0E31\\u0E34-\\u0E3A\\u0E47-\\u0E4E\\u0EB1\\u0EB4-\\u0EB9\\u0EBB\\u0EBC\\u0EC8-\\u0ECD\\u0F18\\u0F19\\u0F35\\u0F37\\u0F39\\u0F3E\\u0F3F\\u0F71-\\u0F84\\u0F86\\u0F87\\u0F8D-\\u0F97\\u0F99-\\u0FBC\\u0FC6\\u102B-\\u103E\\u1056-\\u1059\\u105E-\\u1060\\u1062-\\u1064\\u1067-\\u106D\\u1071-\\u1074\\u1082-\\u108D\\u108F\\u109A-\\u109D\\u135D-\\u135F\\u1712-\\u1714\\u1732-\\u1734\\u1752\\u1753\\u1772\\u1773\\u17B4-\\u17D3\\u17DD\\u180B-\\u180D\\u18A9\\u1920-\\u192B\\u1930-\\u193B\\u19B0-\\u19C0\\u19C8\\u19C9\\u1A17-\\u1A1B\\u1A55-\\u1A5E\\u1A60-\\u1A7C\\u1A7F\\u1B00-\\u1B04\\u1B34-\\u1B44\\u1B6B-\\u1B73\\u1B80-\\u1B82\\u1BA1-\\u1BAD\\u1BE6-\\u1BF3\\u1C24-\\u1C37\\u1CD0-\\u1CD2\\u1CD4-\\u1CE8\\u1CED\\u1CF2-\\u1CF4\\u1DC0-\\u1DE6\\u1DFC-\\u1DFF\\u20D0-\\u20DC\\u20E1\\u20E5-\\u20F0\\u2CEF-\\u2CF1\\u2D7F\\u2DE0-\\u2DFF\\u302A-\\u302F\\u3099\\u309A\\uA66F\\uA674-\\uA67D\\uA69F\\uA6F0\\uA6F1\\uA802\\uA806\\uA80B\\uA823-\\uA827\\uA880\\uA881\\uA8B4-\\uA8C4\\uA8E0-\\uA8F1\\uA926-\\uA92D\\uA947-\\uA953\\uA980-\\uA983\\uA9B3-\\uA9C0\\uAA29-\\uAA36\\uAA43\\uAA4C\\uAA4D\\uAA7B\\uAAB0\\uAAB2-\\uAAB4\\uAAB7\\uAAB8\\uAABE\\uAABF\\uAAC1\\uAAEB-\\uAAEF\\uAAF5\\uAAF6\\uABE3-\\uABEA\\uABEC\\uABED\\uFB1E\\uFE00-\\uFE0F\\uFE20-\\uFE26]"),
                connector_punctuation: new RegExp("[\\u005F\\u203F\\u2040\\u2054\\uFE33\\uFE34\\uFE4D-\\uFE4F\\uFF3F]"),
                digit: new RegExp("[\\u0030-\\u0039\\u0660-\\u0669\\u06F0-\\u06F9\\u07C0-\\u07C9\\u0966-\\u096F\\u09E6-\\u09EF\\u0A66-\\u0A6F\\u0AE6-\\u0AEF\\u0B66-\\u0B6F\\u0BE6-\\u0BEF\\u0C66-\\u0C6F\\u0CE6-\\u0CEF\\u0D66-\\u0D6F\\u0E50-\\u0E59\\u0ED0-\\u0ED9\\u0F20-\\u0F29\\u1040-\\u1049\\u1090-\\u1099\\u17E0-\\u17E9\\u1810-\\u1819\\u1946-\\u194F\\u19D0-\\u19D9\\u1A80-\\u1A89\\u1A90-\\u1A99\\u1B50-\\u1B59\\u1BB0-\\u1BB9\\u1C40-\\u1C49\\u1C50-\\u1C59\\uA620-\\uA629\\uA8D0-\\uA8D9\\uA900-\\uA909\\uA9D0-\\uA9D9\\uAA50-\\uAA59\\uABF0-\\uABF9\\uFF10-\\uFF19]")
            };
            T.prototype.toString = function () {
                return this.message + " (line: " + this.line + ", col: " + this.col + ", pos: " + this.pos + ")" + "\n\n" + this.stack
            };
            var k = {};
            var A = I(["typeof", "void", "delete", "--", "++", "!", "~", "-", "+"]);
            var O = I(["--", "++"]);
            var M = function (e, t, n) {
                while (n < e.length) {
                    t[e[n]] = e[n].substr(0, e[n].length - 1);
                    n++
                }
                return t
            }(["+=", "-=", "/=", "*=", "%=", ">>=", "<<=", ">>>=", "|=", "^=", "&="], {"=": true}, 0);
            var _ = function (e, t) {
                for (var n = 0, r = 1; n < e.length; ++n, ++r) {
                    var i = e[n];
                    for (var s = 0; s < i.length; ++s) {
                        t[i[s]] = r
                    }
                }
                return t
            }([["||"], ["&&"], ["|"], ["^"], ["&"], ["==", "===", "!=", "!=="], ["<", ">", "<=", ">=", "in", "instanceof"], [">>", "<<", ">>>"], ["+", "-"], ["*", "/", "%"]], {});
            var D = I(["for", "do", "while", "switch"]);
            var P = I(["atom", "num", "string", "regexp", "name"]);
            H.prototype.toString = function () {
                return this.name
            };
            var W = function () {
            };
            e.tokenizer = L;
            e.parse = B;
            e.slice = q;
            e.curry = j;
            e.member = U;
            e.array_to_hash = I;
            e.PRECEDENCE = _;
            e.KEYWORDS_ATOM = i;
            e.RESERVED_WORDS = n;
            e.KEYWORDS = t;
            e.ATOMIC_START_TOKEN = P;
            e.OPERATORS = f;
            e.is_alphanumeric_char = y;
            e.is_identifier_start = E;
            e.is_identifier_char = S;
            e.set_logger = function (e) {
                W = e
            }
        });
        define("uglifyjs/squeeze-more", ["require", "exports", "module", "./parse-js", "./squeeze-more"], function (e, t, n) {
            function c(e) {
                function s(e, t) {
                    var n = r, i;
                    r = e;
                    i = t();
                    r = n;
                    return i
                }

                function o(e, t, r) {
                    return [this[0], e, t, s(r.scope, u(a, r, n))]
                }

                var t = i.ast_walker(), n = t.walk, r;
                return t.with_walkers({
                    toplevel: function (e) {
                        return [this[0], s(this.scope, u(a, e, n))]
                    }, "function": o, defun: o, "new": function (e, t) {
                        if (e[0] == "name") {
                            if (e[1] == "Array" && !r.has("Array")) {
                                if (t.length != 1) {
                                    return ["array", t]
                                } else {
                                    return n(["call", ["name", "Array"], t])
                                }
                            } else if (e[1] == "Object" && !r.has("Object")) {
                                if (!t.length) {
                                    return ["object", []]
                                } else {
                                    return n(["call", ["name", "Object"], t])
                                }
                            } else if ((e[1] == "RegExp" || e[1] == "Function" || e[1] == "Error") && !r.has(e[1])) {
                                return n(["call", ["name", e[1]], t])
                            }
                        }
                    }, call: function (e, t) {
                        if (e[0] == "dot" && e[1][0] == "string" && t.length == 1 && (t[0][1] > 0 && e[2] == "substring" || e[2] == "substr")) {
                            return ["call", ["dot", e[1], "slice"], t]
                        }
                        if (e[0] == "dot" && e[2] == "toString" && t.length == 0) {
                            if (e[1][0] == "string")return e[1];
                            return ["binary", "+", e[1], ["string", ""]]
                        }
                        if (e[0] == "name") {
                            if (e[1] == "Array" && t.length != 1 && !r.has("Array")) {
                                return ["array", t]
                            }
                            if (e[1] == "Object" && !t.length && !r.has("Object")) {
                                return ["object", []]
                            }
                            if (e[1] == "String" && !r.has("String")) {
                                return ["binary", "+", t[0], ["string", ""]]
                            }
                        }
                    }
                }, function () {
                    return n(i.ast_add_scope(e))
                })
            }

            var r = e("./parse-js"), i = e("./process"), s = r.slice, o = r.member, u = r.curry, a = i.MAP, f = r.PRECEDENCE, l = r.OPERATORS;
            t.ast_squeeze_more = c
        });
        define("uglifyjs/process", ["require", "exports", "module", "./parse-js", "./squeeze-more"], function (e, t, n) {
            function l() {
                function e(e) {
                    return [this[0], R(e, function (e) {
                        var t = [e[0]];
                        if (e.length > 1)t[1] = o(e[1]);
                        return t
                    })]
                }

                function t(e) {
                    var t = [this[0]];
                    if (e != null)t.push(R(e, o));
                    return t
                }

                function o(e) {
                    if (e == null)return null;
                    try {
                        i.push(e);
                        var t = e[0];
                        var s = r[t];
                        if (s) {
                            var o = s.apply(e, e.slice(1));
                            if (o != null)return o
                        }
                        s = n[t];
                        return s.apply(e, e.slice(1))
                    } finally {
                        i.pop()
                    }
                }

                function u(e) {
                    if (e == null)return null;
                    try {
                        i.push(e);
                        return n[e[0]].apply(e, e.slice(1))
                    } finally {
                        i.pop()
                    }
                }

                function a(e, t) {
                    var n = {}, i;
                    for (i in e)if (q(e, i)) {
                        n[i] = r[i];
                        r[i] = e[i]
                    }
                    var s = t();
                    for (i in n)if (q(n, i)) {
                        if (!n[i])delete r[i]; else r[i] = n[i]
                    }
                    return s
                }

                var n = {
                    string: function (e) {
                        return [this[0], e]
                    }, num: function (e) {
                        return [this[0], e]
                    }, name: function (e) {
                        return [this[0], e]
                    }, toplevel: function (e) {
                        return [this[0], R(e, o)]
                    }, block: t, splice: t, "var": e, "const": e, "try": function (e, t, n) {
                        return [this[0], R(e, o), t != null ? [t[0], R(t[1], o)] : null, n != null ? R(n, o) : null]
                    }, "throw": function (e) {
                        return [this[0], o(e)]
                    }, "new": function (e, t) {
                        return [this[0], o(e), R(t, o)]
                    }, "switch": function (e, t) {
                        return [this[0], o(e), R(t, function (e) {
                            return [e[0] ? o(e[0]) : null, R(e[1], o)]
                        })]
                    }, "break": function (e) {
                        return [this[0], e]
                    }, "continue": function (e) {
                        return [this[0], e]
                    }, conditional: function (e, t, n) {
                        return [this[0], o(e), o(t), o(n)]
                    }, assign: function (e, t, n) {
                        return [this[0], e, o(t), o(n)]
                    }, dot: function (e) {
                        return [this[0], o(e)].concat(s(arguments, 1))
                    }, call: function (e, t) {
                        return [this[0], o(e), R(t, o)]
                    }, "function": function (e, t, n) {
                        return [this[0], e, t.slice(), R(n, o)]
                    }, "debugger": function () {
                        return [this[0]]
                    }, defun: function (e, t, n) {
                        return [this[0], e, t.slice(), R(n, o)]
                    }, "if": function (e, t, n) {
                        return [this[0], o(e), o(t), o(n)]
                    }, "for": function (e, t, n, r) {
                        return [this[0], o(e), o(t), o(n), o(r)]
                    }, "for-in": function (e, t, n, r) {
                        return [this[0], o(e), o(t), o(n), o(r)]
                    }, "while": function (e, t) {
                        return [this[0], o(e), o(t)]
                    }, "do": function (e, t) {
                        return [this[0], o(e), o(t)]
                    }, "return": function (e) {
                        return [this[0], o(e)]
                    }, binary: function (e, t, n) {
                        return [this[0], e, o(t), o(n)]
                    }, "unary-prefix": function (e, t) {
                        return [this[0], e, o(t)]
                    }, "unary-postfix": function (e, t) {
                        return [this[0], e, o(t)]
                    }, sub: function (e, t) {
                        return [this[0], o(e), o(t)]
                    }, object: function (e) {
                        return [this[0], R(e, function (e) {
                            return e.length == 2 ? [e[0], o(e[1])] : [e[0], o(e[1]), e[2]]
                        })]
                    }, regexp: function (e, t) {
                        return [this[0], e, t]
                    }, array: function (e) {
                        return [this[0], R(e, o)]
                    }, stat: function (e) {
                        return [this[0], o(e)]
                    }, seq: function () {
                        return [this[0]].concat(R(s(arguments), o))
                    }, label: function (e, t) {
                        return [this[0], e, o(t)]
                    }, "with": function (e, t) {
                        return [this[0], o(e), o(t)]
                    }, atom: function (e) {
                        return [this[0], e]
                    }, directive: function (e) {
                        return [this[0], e]
                    }
                };
                var r = {};
                var i = [];
                return {
                    walk: o, dive: u, with_walkers: a, parent: function () {
                        return i[i.length - 2]
                    }, stack: function () {
                        return i
                    }
                }
            }

            function c(e) {
                this.names = {};
                this.mangled = {};
                this.rev_mangled = {};
                this.cname = -1;
                this.refs = {};
                this.uses_with = false;
                this.uses_eval = false;
                this.directives = [];
                this.parent = e;
                this.children = [];
                if (e) {
                    this.level = e.level + 1;
                    e.children.push(this)
                } else {
                    this.level = 0
                }
            }

            function h() {
                if (typeof DIGITS_OVERRIDE_FOR_TESTING != "undefined")return DIGITS_OVERRIDE_FOR_TESTING; else return "etnrisouaflchpdvmgybwESxTNCkLAOM_DPHBjFIqRUzWXV$JKQGYZ0516372984"
            }

            function d(e) {
                function s(e) {
                    t = new c(t);
                    t.labels = new c;
                    var n = t.body = e();
                    n.scope = t;
                    t = t.parent;
                    return n
                }

                function o(e, n) {
                    return t.define(e, n)
                }

                function u(e) {
                    t.refs[e] = true
                }

                function a(e, t, n) {
                    var i = this[0] == "defun";
                    return [this[0], i ? o(e, "defun") : e, t, s(function () {
                        if (!i)o(e, "lambda");
                        R(t, function (e) {
                            o(e, "arg")
                        });
                        return R(n, r)
                    })]
                }

                function f(e) {
                    return function (t) {
                        R(t, function (t) {
                            o(t[0], e);
                            if (t[1])u(t[0])
                        })
                    }
                }

                function h(e) {
                    if (e)t.labels.refs[e] = true
                }

                var t = null;
                var n = l(), r = n.walk;
                var i = [];
                return s(function () {
                    function l(e, t) {
                        for (t = e.children.length; --t >= 0;)l(e.children[t]);
                        for (t in e.refs)if (q(e.refs, t)) {
                            for (var n = e.has(t), r = e; r; r = r.parent) {
                                r.refs[t] = n;
                                if (r === n)break
                            }
                        }
                    }

                    var s = n.with_walkers({
                        "function": a, defun: a, label: function (e, n) {
                            t.labels.define(e)
                        }, "break": h, "continue": h, "with": function (e, n) {
                            for (var r = t; r; r = r.parent)r.uses_with = true
                        }, "var": f("var"), "const": f("const"), "try": function (e, t, n) {
                            if (t != null)return [this[0], R(e, r), [o(t[0], "catch"), R(t[1], r)], n != null ? R(n, r) : null]
                        }, name: function (e) {
                            if (e == "eval")i.push(t);
                            u(e)
                        }
                    }, function () {
                        return r(e)
                    });
                    R(i, function (e) {
                        if (!e.has("eval"))while (e) {
                            e.uses_eval = true;
                            e = e.parent
                        }
                    });
                    l(t);
                    return s
                })
            }

            function v(e, t) {
                function s(e, n) {
                    if (!t.mangle)return e;
                    if (!t.toplevel && !i.parent)return e;
                    if (t.except && o(e, t.except))return e;
                    if (t.no_functions && q(i.names, e) && (i.names[e] == "defun" || i.names[e] == "lambda"))return e;
                    return i.get_mangled(e, n)
                }

                function u(e) {
                    if (t.defines) {
                        if (!i.has(e)) {
                            if (q(t.defines, e)) {
                                return t.defines[e]
                            }
                        }
                        return null
                    }
                }

                function a(e, n, o) {
                    if (!t.no_functions && t.mangle) {
                        var u = this[0] == "defun", a;
                        if (e) {
                            if (u)e = s(e); else if (o.scope.references(e)) {
                                a = {};
                                if (!(i.uses_eval || i.uses_with))e = a[e] = i.next_mangled(); else a[e] = e
                            } else e = null
                        }
                    }
                    o = f(o.scope, function () {
                        n = R(n, function (e) {
                            return s(e)
                        });
                        return R(o, r)
                    }, a);
                    return [this[0], e, n, o]
                }

                function f(e, t, n) {
                    var r = i;
                    i = e;
                    if (n)for (var o in n)if (q(n, o)) {
                        e.set_mangle(o, n[o])
                    }
                    for (var o in e.names)if (q(e.names, o)) {
                        s(o, true)
                    }
                    var u = t();
                    u.scope = e;
                    i = r;
                    return u
                }

                function c(e) {
                    return [this[0], R(e, function (e) {
                        return [s(e[0]), r(e[1])]
                    })]
                }

                function h(e) {
                    if (e)return [this[0], i.labels.get_mangled(e)]
                }

                var n = l(), r = n.walk, i;
                t = F(t, {mangle: true, toplevel: false, defines: null, except: null, no_functions: false});
                return n.with_walkers({
                    "function": a, defun: function () {
                        var e = a.apply(this, arguments);
                        switch (n.parent()[0]) {
                            case"toplevel":
                            case"function":
                            case"defun":
                                return R.at_top(e)
                        }
                        return e
                    }, label: function (e, t) {
                        if (i.labels.refs[e])return [this[0], i.labels.get_mangled(e, true), r(t)];
                        return r(t)
                    }, "break": h, "continue": h, "var": c, "const": c, name: function (e) {
                        return u(e) || [this[0], s(e)]
                    }, "try": function (e, t, n) {
                        return [this[0], R(e, r), t != null ? [s(t[0]), R(t[1], r)] : null, n != null ? R(n, r) : null]
                    }, toplevel: function (e) {
                        var t = this;
                        return f(t.scope, function () {
                            return [t[0], R(e, r)]
                        })
                    }, directive: function () {
                        return R.at_top(this)
                    }
                }, function () {
                    return r(d(e))
                })
            }

            function g(e, t) {
                return H(e).length > H(t[0] == "stat" ? t[1] : t).length ? t : e
            }

            function y(e) {
                if (e[0] == "block" && e[1] && e[1].length > 0)return e[1][e[1].length - 1];
                return e
            }

            function b(e) {
                if (e)switch (y(e)[0]) {
                    case"return":
                    case"break":
                    case"continue":
                    case"throw":
                        return true
                }
            }

            function w(e) {
                return e[0] == "unary-prefix" && o(e[1], ["!", "delete"]) || e[0] == "binary" && o(e[1], ["in", "instanceof", "==", "!=", "===", "!==", "<", "<=", ">=", ">"]) || e[0] == "binary" && o(e[1], ["&&", "||"]) && w(e[2]) && w(e[3]) || e[0] == "conditional" && w(e[2]) && w(e[3]) || e[0] == "assign" && e[1] === true && w(e[3]) || e[0] == "seq" && w(e[e.length - 1])
            }

            function E(e) {
                return !e || e[0] == "block" && (!e[1] || e[1].length == 0)
            }

            function S(e) {
                return e[0] == "string" || e[0] == "unary-prefix" && e[1] == "typeof" || e[0] == "binary" && e[1] == "+" && (S(e[2]) || S(e[3]))
            }

            function T(e) {
                if (!E(e))m("Dropping unreachable code: " + H(e, true))
            }

            function N(e) {
                function r(e) {
                    e = R(e, n);
                    for (var t = 0; t < e.length; ++t) {
                        var i = e[t];
                        if (i[0] != "if")continue;
                        if (i[3])continue;
                        var s = i[2];
                        if (!b(s))continue;
                        var o = n(i[1]);
                        var u = r(e.slice(t + 1));
                        var a = u.length == 1 ? u[0] : ["block", u];
                        return e.slice(0, t).concat([[i[0], o, s, a]])
                    }
                    return e
                }

                function i(e, t, n) {
                    n = r(n);
                    return [this[0], e, t, n]
                }

                function s(e) {
                    return [this[0], e != null ? r(e) : null]
                }

                var t = l(), n = t.walk;
                return t.with_walkers({
                    defun: i, "function": i, block: s, splice: s, toplevel: function (e) {
                        return [this[0], r(e)]
                    }, "try": function (e, t, n) {
                        return [this[0], r(e), t != null ? [t[0], r(t[1])] : null, n != null ? r(n) : null]
                    }
                }, function () {
                    return n(e)
                })
            }

            function C(e, t) {
                function o() {
                    throw i
                }

                function u() {
                    throw s
                }

                function a() {
                    return t.call(this, this, n, o, u)
                }

                function f(e) {
                    if (e == "++" || e == "--")return a.apply(this, arguments)
                }

                function c(e) {
                    if (e == "&&" || e == "||")return a.apply(this, arguments)
                }

                var n = l(), r = n.walk;
                var i = {}, s = {};
                return n.with_walkers({
                    "try": a,
                    "throw": a,
                    "return": a,
                    "new": a,
                    "switch": a,
                    "break": a,
                    "continue": a,
                    assign: a,
                    call: a,
                    "if": a,
                    "for": a,
                    "for-in": a,
                    "while": a,
                    "do": a,
                    "return": a,
                    "unary-prefix": f,
                    "unary-postfix": f,
                    conditional: a,
                    binary: c,
                    defun: a
                }, function () {
                    while (true)try {
                        r(e);
                        break
                    } catch (t) {
                        if (t === i)break;
                        if (t === s)continue;
                        throw t
                    }
                })
            }

            function k(e) {
                function i(e, t) {
                    var i = r;
                    r = t;
                    e = R(e, n);
                    var s = {}, o = R(t.names, function (e, n) {
                        if (e != "var")return R.skip;
                        if (!t.references(n))return R.skip;
                        s[n] = true;
                        return [n]
                    });
                    if (o.length > 0) {
                        C(["block", e], function (e, t, n, r) {
                            if (e[0] == "assign" && e[1] === true && e[2][0] == "name" && q(s, e[2][1])) {
                                for (var i = o.length; --i >= 0;) {
                                    if (o[i][0] == e[2][1]) {
                                        if (o[i][1])n();
                                        o[i][1] = e[3];
                                        o.push(o.splice(i, 1)[0]);
                                        break
                                    }
                                }
                                var u = t.parent();
                                if (u[0] == "seq") {
                                    var a = u[2];
                                    a.unshift(0, u.length);
                                    u.splice.apply(u, a)
                                } else if (u[0] == "stat") {
                                    u.splice(0, u.length, "block")
                                } else {
                                    n()
                                }
                                r()
                            }
                            n()
                        });
                        e.unshift(["var", o])
                    }
                    r = i;
                    return e
                }

                function s(e) {
                    var n = null;
                    for (var r = e.length; --r >= 0;) {
                        var i = e[r];
                        if (!i[1])continue;
                        i = ["assign", true, ["name", i[0]], i[1]];
                        if (n == null)n = i; else n = ["seq", i, n]
                    }
                    if (n == null && t.parent()[0] != "for") {
                        if (t.parent()[0] == "for-in")return ["name", e[0][0]];
                        return R.skip
                    }
                    return ["stat", n]
                }

                function o(e) {
                    return [this[0], i(e, this.scope)]
                }

                var t = l(), n = t.walk, r;
                return t.with_walkers({
                    "function": function (e, t, n) {
                        for (var r = t.length; --r >= 0 && !n.scope.references(t[r]);)t.pop();
                        if (!n.scope.references(e))e = null;
                        return [this[0], e, t, i(n, n.scope)]
                    }, defun: function (e, t, n) {
                        if (!r.references(e))return R.skip;
                        for (var s = t.length; --s >= 0 && !n.scope.references(t[s]);)t.pop();
                        return [this[0], e, t, i(n, n.scope)]
                    }, "var": s, toplevel: o
                }, function () {
                    return n(d(e))
                })
            }

            function L(e, t) {
                e = A(e, t);
                e = O(e, t);
                return e
            }

            function A(e, t) {
                function u(e) {
                    var n = ["unary-prefix", "!", e];
                    switch (e[0]) {
                        case"unary-prefix":
                            return e[1] == "!" && w(e[2]) ? e[2] : n;
                        case"seq":
                            e = s(e);
                            e[e.length - 1] = u(e[e.length - 1]);
                            return e;
                        case"conditional":
                            return g(n, ["conditional", e[1], u(e[2]), u(e[3])]);
                        case"binary":
                            var r = e[1], i = e[2], o = e[3];
                            if (!t.keep_comps)switch (r) {
                                case"<=":
                                    return ["binary", ">", i, o];
                                case"<":
                                    return ["binary", ">=", i, o];
                                case">=":
                                    return ["binary", "<", i, o];
                                case">":
                                    return ["binary", "<=", i, o]
                            }
                            switch (r) {
                                case"==":
                                    return ["binary", "!=", i, o];
                                case"!=":
                                    return ["binary", "==", i, o];
                                case"===":
                                    return ["binary", "!==", i, o];
                                case"!==":
                                    return ["binary", "===", i, o];
                                case"&&":
                                    return g(n, ["binary", "||", u(i), u(o)]);
                                case"||":
                                    return g(n, ["binary", "&&", u(i), u(o)])
                            }
                            break
                    }
                    return n
                }

                function a(e, t, n) {
                    var r = function () {
                        if (e[0] == "unary-prefix" && e[1] == "!") {
                            return n ? ["conditional", e[2], n, t] : ["binary", "||", e[2], t]
                        } else {
                            return n ? g(["conditional", e, t, n], ["conditional", u(e), n, t]) : ["binary", "&&", e, t]
                        }
                    };
                    return x(e, function (e, r) {
                        T(r ? n : t);
                        return r ? t : n
                    }, r)
                }

                function f(e) {
                    if (e != null && e[0] == "block" && e[1]) {
                        if (e[1].length == 1)e = e[1][0]; else if (e[1].length == 0)e = ["block"]
                    }
                    return e
                }

                function c(e, t, n) {
                    return [this[0], e, t, h(n, "lambda")]
                }

                function h(e, n) {
                    e = R(e, r);
                    e = e.reduce(function (e, t) {
                        if (t[0] == "block") {
                            if (t[1]) {
                                e.push.apply(e, t[1])
                            }
                        } else {
                            e.push(t)
                        }
                        return e
                    }, []);
                    e = function (t, n) {
                        e.forEach(function (e) {
                            if (n && (e[0] == "var" && n[0] == "var" || e[0] == "const" && n[0] == "const")) {
                                n[1] = n[1].concat(e[1])
                            } else {
                                t.push(e);
                                n = e
                            }
                        });
                        return t
                    }([]);
                    if (t.dead_code)e = function (n, r) {
                        e.forEach(function (e) {
                            if (r) {
                                if (e[0] == "function" || e[0] == "defun") {
                                    n.push(e)
                                } else if (e[0] == "var" || e[0] == "const") {
                                    if (!t.no_warnings)m("Variables declared in unreachable code");
                                    e[1] = R(e[1], function (e) {
                                        if (e[1] && !t.no_warnings)T(["assign", true, ["name", e[0]], e[1]]);
                                        return [e[0]]
                                    });
                                    n.push(e)
                                } else if (!t.no_warnings)T(e)
                            } else {
                                n.push(e);
                                if (o(e[0], ["return", "throw", "break", "continue"]))r = true
                            }
                        });
                        return n
                    }([]);
                    if (t.make_seqs)e = function (t, n) {
                        e.forEach(function (e) {
                            if (n && n[0] == "stat" && e[0] == "stat") {
                                n[1] = ["seq", n[1], e[1]]
                            } else {
                                t.push(e);
                                n = e
                            }
                        });
                        if (t.length >= 2 && t[t.length - 2][0] == "stat" && (t[t.length - 1][0] == "return" || t[t.length - 1][0] == "throw") && t[t.length - 1][1]) {
                            t.splice(t.length - 2, 2, [t[t.length - 1][0], ["seq", t[t.length - 2][1], t[t.length - 1][1]]])
                        }
                        return t
                    }([]);
                    return e
                }

                function p(e, t, n) {
                    return x(e, function (e, i) {
                        if (i) {
                            t = r(t);
                            T(n);
                            return t || ["block"]
                        } else {
                            n = r(n);
                            T(t);
                            return n || ["block"]
                        }
                    }, function () {
                        return v(e, t, n)
                    })
                }

                function d(e, t, n) {
                    var i = [["if", u(e), n]];
                    if (t[0] == "block") {
                        if (t[1])i = i.concat(t[1])
                    } else {
                        i.push(t)
                    }
                    return r(["block", i])
                }

                function v(e, t, n) {
                    e = r(e);
                    t = r(t);
                    n = r(n);
                    if (E(n) && E(t))return ["stat", e];
                    if (E(t)) {
                        e = u(e);
                        t = n;
                        n = null
                    } else if (E(n)) {
                        n = null
                    } else {
                        (function () {
                            var r = H(e);
                            var i = u(e);
                            var s = H(i);
                            if (s.length < r.length) {
                                var o = t;
                                t = n;
                                n = o;
                                e = i
                            }
                        })()
                    }
                    var i = ["if", e, t, n];
                    if (t[0] == "if" && E(t[3]) && E(n)) {
                        i = g(i, r(["if", ["binary", "&&", e, t[1]], t[2]]))
                    } else if (t[0] == "stat") {
                        if (n) {
                            if (n[0] == "stat")i = g(i, ["stat", a(e, t[1], n[1])]); else if (b(n))i = d(e, t, n)
                        } else {
                            i = g(i, ["stat", a(e, t[1])])
                        }
                    } else if (n && t[0] == n[0] && (t[0] == "return" || t[0] == "throw") && t[1] && n[1]) {
                        i = g(i, [t[0], a(e, t[1], n[1])])
                    } else if (n && b(t)) {
                        i = [["if", e, t]];
                        if (n[0] == "block") {
                            if (n[1])i = i.concat(n[1])
                        } else {
                            i.push(n)
                        }
                        i = r(["block", i])
                    } else if (t && b(n)) {
                        i = d(e, t, n)
                    }
                    return i
                }

                function y(e, t) {
                    return x(e, function (e, n) {
                        if (!n) {
                            T(t);
                            return ["block"]
                        } else {
                            return ["for", null, null, null, r(t)]
                        }
                    })
                }

                t = F(t, {make_seqs: true, dead_code: true, no_warnings: false, keep_comps: true, unsafe: false});
                var n = l(), r = n.walk, i;
                return n.with_walkers({
                    sub: function (e, t) {
                        if (t[0] == "string") {
                            var n = t[1];
                            if (I(n))return ["dot", r(e), n]; else if (/^[1-9][0-9]*$/.test(n) || n === "0")return ["sub", r(e), ["num", parseInt(n, 10)]]
                        }
                    }, "if": p, toplevel: function (e) {
                        return ["toplevel", h(e)]
                    }, "switch": function (e, t) {
                        var n = t.length - 1;
                        return ["switch", r(e), R(t, function (e, t) {
                            var i = h(e[1]);
                            if (t == n && i.length > 0) {
                                var s = i[i.length - 1];
                                if (s[0] == "break" && !s[1])i.pop()
                            }
                            return [e[0] ? r(e[0]) : null, i]
                        })]
                    }, "function": c, defun: c, block: function (e) {
                        if (e)return f(["block", h(e)])
                    }, binary: function (e, t, n) {
                        return x(["binary", e, r(t), r(n)], function (t) {
                            return g(r(t), this)
                        }, function () {
                            return function () {
                                    if (e != "==" && e != "!=")return;
                                    var i = r(t), s = r(n);
                                    if (i && i[0] == "unary-prefix" && i[1] == "!" && i[2][0] == "num")t = ["num", +!i[2][1]]; else if (s && s[0] == "unary-prefix" && s[1] == "!" && s[2][0] == "num")n = ["num", +!s[2][1]];
                                    return ["binary", e, t, n]
                                }() || this
                        })
                    }, conditional: function (e, t, n) {
                        return a(r(e), r(t), r(n))
                    }, "try": function (e, t, n) {
                        return ["try", h(e), t != null ? [t[0], h(t[1])] : null, n != null ? h(n) : null]
                    }, "unary-prefix": function (e, t) {
                        t = r(t);
                        var n = ["unary-prefix", e, t];
                        if (e == "!")n = g(n, u(t));
                        return x(n, function (e, t) {
                            return r(e)
                        }, function () {
                            return n
                        })
                    }, name: function (e) {
                        switch (e) {
                            case"true":
                                return ["unary-prefix", "!", ["num", 0]];
                            case"false":
                                return ["unary-prefix", "!", ["num", 1]]
                        }
                    }, "while": y, assign: function (e, t, n) {
                        t = r(t);
                        n = r(n);
                        var i = ["+", "-", "/", "*", "%", ">>", "<<", ">>>", "|", "^", "&"];
                        if (e === true && t[0] === "name" && n[0] === "binary" && ~i.indexOf(n[1]) && n[2][0] === "name" && n[2][1] === t[1]) {
                            return [this[0], n[1], t, n[3]]
                        }
                        return [this[0], e, t, n]
                    }, call: function (e, n) {
                        e = r(e);
                        if (t.unsafe && e[0] == "dot" && e[1][0] == "string" && e[2] == "toString") {
                            return e[1]
                        }
                        return [this[0], e, R(n, r)]
                    }, num: function (e) {
                        if (!isFinite(e))return ["binary", "/", e === 1 / 0 ? ["num", 1] : e === -1 / 0 ? ["unary-prefix", "-", ["num", 1]] : ["num", 0], ["num", 0]];
                        return [this[0], e]
                    }
                }, function () {
                    return r(N(r(N(e))))
                })
            }

            function O(e, t) {
                function o(e, t) {
                    var n = s, r;
                    s = e;
                    r = t();
                    s = n;
                    return r
                }

                function u(e, t, n) {
                    return [this[0], e, t, o(n.scope, i(R, n, r))]
                }

                var n = l(), r = n.walk, s;
                return n.with_walkers({
                    directive: function (e) {
                        if (s.active_directive(e))return ["block"];
                        s.directives.push(e)
                    }, toplevel: function (e) {
                        return [this[0], o(this.scope, i(R, e, r))]
                    }, "function": u, defun: u
                }, function () {
                    return r(d(e))
                })
            }

            function _(e, t) {
                var n = 0, r = 0;
                e = e.replace(/[\\\b\f\n\r\t\x22\x27\u2028\u2029\0]/g, function (e) {
                    switch (e) {
                        case"\\":
                            return "\\\\";
                        case"\b":
                            return "\\b";
                        case"\f":
                            return "\\f";
                        case"\n":
                            return "\\n";
                        case"\r":
                            return "\\r";
                        case"\u2028":
                            return "\\u2028";
                        case"\u2029":
                            return "\\u2029";
                        case'"':
                            ++n;
                            return '"';
                        case"'":
                            ++r;
                            return "'";
                        case"\0":
                            return "\\0"
                    }
                    return e
                });
                if (t)e = D(e);
                if (n > r)return "'" + e.replace(/\x27/g, "\\'") + "'"; else return '"' + e.replace(/\x22/g, '\\"') + '"'
            }

            function D(e) {
                return e.replace(/[\u0080-\uffff]/g, function (e) {
                    var t = e.charCodeAt(0).toString(16);
                    while (t.length < 4)t = "0" + t;
                    return "\\u" + t
                })
            }

            function H(e, t) {
                function p(e) {
                    var n = _(e, t.ascii_only);
                    if (t.inline_script)n = n.replace(/<\x2fscript([>\/\t\n\f\r ])/gi, "<\\/script$1");
                    return n
                }

                function d(e) {
                    e = e.toString();
                    if (t.ascii_only)e = D(e);
                    return e
                }

                function v(e) {
                    if (e == null)e = "";
                    if (n)e = j(" ", t.indent_start + i * t.indent_level) + e;
                    return e
                }

                function m(e, t) {
                    if (t == null)t = 1;
                    i += t;
                    try {
                        return e.apply(null, s(arguments, 1))
                    } finally {
                        i -= t
                    }
                }

                function g(e) {
                    e = e.toString();
                    return e.charAt(e.length - 1)
                }

                function y(e) {
                    return e.toString().charAt(0)
                }

                function b(e) {
                    if (n)return e.join(" ");
                    var t = [];
                    for (var r = 0; r < e.length; ++r) {
                        var i = e[r + 1];
                        t.push(e[r]);
                        if (i && (u(g(e[r])) && (u(y(i)) || y(i) == "\\") || /[\+\-]$/.test(e[r].toString()) && /^[\+\-]/.test(i.toString()) || g(e[r]) == "/" && y(i) == "/")) {
                            t.push(" ")
                        }
                    }
                    return t.join("")
                }

                function w(e) {
                    return e.join("," + h)
                }

                function S(e) {
                    var t = k(e);
                    for (var n = 1; n < arguments.length; ++n) {
                        var r = arguments[n];
                        if (r instanceof Function && r(e) || e[0] == r)return "(" + t + ")"
                    }
                    return t
                }

                function x(e) {
                    if (e.length == 1) {
                        return e[0]
                    }
                    if (e.length == 2) {
                        var t = e[1];
                        e = e[0];
                        return e.length <= t.length ? e : t
                    }
                    return x([e[0], x(e.slice(1))])
                }

                function T(e) {
                    if (e[0] == "function" || e[0] == "object") {
                        var t = s(C.stack()), n = t.pop(), r = t.pop();
                        while (r) {
                            if (r[0] == "stat")return true;
                            if ((r[0] == "seq" || r[0] == "call" || r[0] == "dot" || r[0] == "sub" || r[0] == "conditional") && r[1] === n || (r[0] == "binary" || r[0] == "assign" || r[0] == "unary-postfix") && r[2] === n) {
                                n = r;
                                r = t.pop()
                            } else {
                                return false
                            }
                        }
                    }
                    return !q(M, e[0])
                }

                function N(e) {
                    var t = e.toString(10), n = [t.replace(/^0\./, ".").replace("e+", "e")], r;
                    if (Math.floor(e) === e) {
                        if (e >= 0) {
                            n.push("0x" + e.toString(16).toLowerCase(), "0" + e.toString(8))
                        } else {
                            n.push("-0x" + (-e).toString(16).toLowerCase(), "-0" + (-e).toString(8))
                        }
                        if (r = /^(.*?)(0+)$/.exec(e)) {
                            n.push(r[1] + "e" + r[2].length)
                        }
                    } else if (r = /^0?\.(0+)(.*)$/.exec(e)) {
                        n.push(r[2] + "e-" + (r[1].length + r[2].length), t.substr(t.indexOf(".")))
                    }
                    return x(n)
                }

                function L(e) {
                    if (e == null)return ";";
                    if (e[0] == "do") {
                        return U([e])
                    }
                    var t = e;
                    while (true) {
                        var n = t[0];
                        if (n == "if") {
                            if (!t[3])return k(["block", [e]]);
                            t = t[3]
                        } else if (n == "while" || n == "do")t = t[2]; else if (n == "for" || n == "for-in")t = t[4]; else break
                    }
                    return k(e)
                }

                function A(e, t, n, r, i) {
                    var s = r || "function";
                    if (e) {
                        s += " " + d(e)
                    }
                    s += "(" + w(R(t, d)) + ")";
                    s = b([s, U(n)]);
                    return !i && T(this) ? "(" + s + ")" : s
                }

                function O(e) {
                    switch (e[0]) {
                        case"with":
                        case"while":
                            return E(e[2]) || O(e[2]);
                        case"for":
                        case"for-in":
                            return E(e[4]) || O(e[4]);
                        case"if":
                            if (E(e[2]) && !e[3])return true;
                            if (e[3]) {
                                if (E(e[3]))return true;
                                return O(e[3])
                            }
                            return O(e[2]);
                        case"directive":
                            return true
                    }
                }

                function H(e, t) {
                    for (var r = [], i = e.length - 1, s = 0; s <= i; ++s) {
                        var o = e[s];
                        var u = k(o);
                        if (u != ";") {
                            if (!n && s == i && !O(o)) {
                                u = u.replace(/;+\s*$/, "")
                            }
                            r.push(u)
                        }
                    }
                    return t ? r : R(r, v)
                }

                function B(e) {
                    var t = e.length;
                    if (t == 0)return "{}";
                    return "{" + c + R(e, function (e, r) {
                            var i = e[1].length > 0, s = m(function () {
                                    return v(e[0] ? b(["case", k(e[0]) + ":"]) : "default:")
                                }, .5) + (i ? c + m(function () {
                                    return H(e[1]).join(c)
                                }) : "");
                            if (!n && i && r < t - 1)s += ";";
                            return s
                        }).join(c) + c + v("}")
                }

                function U(e) {
                    if (!e)return ";";
                    if (e.length == 0)return "{}";
                    return "{" + c + m(function () {
                            return H(e).join(c)
                        }) + c + v("}")
                }

                function z(e) {
                    var t = e[0], n = e[1];
                    if (n != null)t = b([d(t), "=", S(n, "seq")]);
                    return t
                }

                t = F(t, {
                    indent_start: 0,
                    indent_level: 4,
                    quote_keys: false,
                    space_colon: false,
                    beautify: false,
                    ascii_only: false,
                    inline_script: false
                });
                var n = !!t.beautify;
                var i = 0, c = n ? "\n" : "", h = n ? " " : "";
                var C = l();
                var k = C.walk;
                return C.with_walkers({
                    string: p, num: N, name: d, "debugger": function () {
                        return "debugger;"
                    }, toplevel: function (e) {
                        return H(e).join(c + c)
                    }, splice: function (e) {
                        var t = C.parent();
                        if (q(P, t)) {
                            return U.apply(this, arguments)
                        } else {
                            return R(H(e, true), function (e, t) {
                                return t > 0 ? v(e) : e
                            }).join(c)
                        }
                    }, block: U, "var": function (e) {
                        return "var " + w(R(e, z)) + ";"
                    }, "const": function (e) {
                        return "const " + w(R(e, z)) + ";"
                    }, "try": function (e, t, n) {
                        var r = ["try", U(e)];
                        if (t)r.push("catch", "(" + t[0] + ")", U(t[1]));
                        if (n)r.push("finally", U(n));
                        return b(r)
                    }, "throw": function (e) {
                        return b(["throw", k(e)]) + ";"
                    }, "new": function (e, t) {
                        t = t.length > 0 ? "(" + w(R(t, function (e) {
                            return S(e, "seq")
                        })) + ")" : "";
                        return b(["new", S(e, "seq", "binary", "conditional", "assign", function (e) {
                            var t = l(), n = {};
                            try {
                                t.with_walkers({
                                    call: function () {
                                        throw n
                                    }, "function": function () {
                                        return this
                                    }
                                }, function () {
                                    t.walk(e)
                                })
                            } catch (r) {
                                if (r === n)return true;
                                throw r
                            }
                        }) + t])
                    }, "switch": function (e, t) {
                        return b(["switch", "(" + k(e) + ")", B(t)])
                    }, "break": function (e) {
                        var t = "break";
                        if (e != null)t += " " + d(e);
                        return t + ";"
                    }, "continue": function (e) {
                        var t = "continue";
                        if (e != null)t += " " + d(e);
                        return t + ";"
                    }, conditional: function (e, t, n) {
                        return b([S(e, "assign", "seq", "conditional"), "?", S(t, "seq"), ":", S(n, "seq")])
                    }, assign: function (e, t, n) {
                        if (e && e !== true)e += "="; else e = "=";
                        return b([k(t), e, S(n, "seq")])
                    }, dot: function (e) {
                        var t = k(e), n = 1;
                        if (e[0] == "num") {
                            if (!/[a-f.]/i.test(t))t += "."
                        } else if (e[0] != "function" && T(e))t = "(" + t + ")";
                        while (n < arguments.length)t += "." + d(arguments[n++]);
                        return t
                    }, call: function (e, t) {
                        var n = k(e);
                        if (n.charAt(0) != "(" && T(e))n = "(" + n + ")";
                        return n + "(" + w(R(t, function (e) {
                                return S(e, "seq")
                            })) + ")"
                    }, "function": A, defun: A, "if": function (e, t, n) {
                        var r = ["if", "(" + k(e) + ")", n ? L(t) : k(t)];
                        if (n) {
                            r.push("else", k(n))
                        }
                        return b(r)
                    }, "for": function (e, t, n, r) {
                        var i = ["for"];
                        e = (e != null ? k(e) : "").replace(/;*\s*$/, ";" + h);
                        t = (t != null ? k(t) : "").replace(/;*\s*$/, ";" + h);
                        n = (n != null ? k(n) : "").replace(/;*\s*$/, "");
                        var s = e + t + n;
                        if (s == "; ; ")s = ";;";
                        i.push("(" + s + ")", k(r));
                        return b(i)
                    }, "for-in": function (e, t, n, r) {
                        return b(["for", "(" + (e ? k(e).replace(/;+$/, "") : k(t)), "in", k(n) + ")", k(r)])
                    }, "while": function (e, t) {
                        return b(["while", "(" + k(e) + ")", k(t)])
                    }, "do": function (e, t) {
                        return b(["do", k(t), "while", "(" + k(e) + ")"]) + ";"
                    }, "return": function (e) {
                        var t = ["return"];
                        if (e != null)t.push(k(e));
                        return b(t) + ";"
                    }, binary: function (e, r, i) {
                        var s = k(r), u = k(i);
                        if (o(r[0], ["assign", "conditional", "seq"]) || r[0] == "binary" && a[e] > a[r[1]] || r[0] == "function" && T(this)) {
                            s = "(" + s + ")"
                        }
                        if (o(i[0], ["assign", "conditional", "seq"]) || i[0] == "binary" && a[e] >= a[i[1]] && !(i[1] == e && o(e, ["&&", "||", "*"]))) {
                            u = "(" + u + ")"
                        } else if (!n && t.inline_script && (e == "<" || e == "<<") && i[0] == "regexp" && /^script/i.test(i[1])) {
                            u = " " + u
                        }
                        return b([s, e, u])
                    }, "unary-prefix": function (e, t) {
                        var n = k(t);
                        if (!(t[0] == "num" || t[0] == "unary-prefix" && !q(f, e + t[1]) || !T(t)))n = "(" + n + ")";
                        return e + (r.is_alphanumeric_char(e.charAt(0)) ? " " : "") + n
                    }, "unary-postfix": function (e, t) {
                        var n = k(t);
                        if (!(t[0] == "num" || t[0] == "unary-postfix" && !q(f, e + t[1]) || !T(t)))n = "(" + n + ")";
                        return n + e
                    }, sub: function (e, t) {
                        var n = k(e);
                        if (T(e))n = "(" + n + ")";
                        return n + "[" + k(t) + "]"
                    }, object: function (e) {
                        var r = T(this);
                        if (e.length == 0)return r ? "({})" : "{}";
                        var i = "{" + c + m(function () {
                                return R(e, function (e) {
                                    if (e.length == 3) {
                                        return v(A(e[0], e[1][2], e[1][3], e[2], true))
                                    }
                                    var r = e[0], i = S(e[1], "seq");
                                    if (t.quote_keys) {
                                        r = p(r)
                                    } else if ((typeof r == "number" || !n && +r + "" == r) && parseFloat(r) >= 0) {
                                        r = N(+r)
                                    } else if (!I(r)) {
                                        r = p(r)
                                    }
                                    return v(b(n && t.space_colon ? [r, ":", i] : [r + ":", i]))
                                }).join("," + c)
                            }) + c + v("}");
                        return r ? "(" + i + ")" : i
                    }, regexp: function (e, n) {
                        if (t.ascii_only)e = D(e);
                        return "/" + e + "/" + n
                    }, array: function (e) {
                        if (e.length == 0)return "[]";
                        return b(["[", w(R(e, function (t, r) {
                            if (!n && t[0] == "atom" && t[1] == "undefined")return r === e.length - 1 ? "," : "";
                            return S(t, "seq")
                        })), "]"])
                    }, stat: function (e) {
                        return e != null ? k(e).replace(/;*\s*$/, ";") : ";"
                    }, seq: function () {
                        return w(R(s(arguments), k))
                    }, label: function (e, t) {
                        return b([d(e), ":", k(t)])
                    }, "with": function (e, t) {
                        return b(["with", "(" + k(e) + ")", k(t)])
                    }, atom: function (e) {
                        return d(e)
                    }, directive: function (e) {
                        return _(e) + ";"
                    }
                }, function () {
                    return k(e)
                });
            }

            function B(e, t) {
                var n = [0];
                r.parse(function () {
                    function u(e) {
                        return e.pos - s
                    }

                    function a(e) {
                        s = e.pos;
                        n.push(s)
                    }

                    function f() {
                        var e = i.apply(this, arguments);
                        e:{
                            if (o) {
                                if (o.type == "keyword")break e
                            }
                            if (u(e) > t) {
                                switch (e.type) {
                                    case"keyword":
                                    case"atom":
                                    case"name":
                                    case"punc":
                                        a(e);
                                        break e
                                }
                            }
                        }
                        o = e;
                        return e
                    }

                    var i = r.tokenizer(e);
                    var s = 0;
                    var o;
                    f.context = function () {
                        return i.context.apply(this, arguments)
                    };
                    return f
                }());
                return n.map(function (t, r) {
                    return e.substring(t, n[r + 1] || e.length)
                }).join("\n")
            }

            function j(e, t) {
                if (t <= 0)return "";
                if (t == 1)return e;
                var n = j(e, t >> 1);
                n += n;
                if (t & 1)n += e;
                return n
            }

            function F(e, t) {
                var n = {};
                if (e === true)e = {};
                for (var r in t)if (q(t, r)) {
                    n[r] = e && q(e, r) ? e[r] : t[r]
                }
                return n
            }

            function I(e) {
                return /^[a-z_$][a-z0-9_$]*$/i.test(e) && e != "this" && !q(r.KEYWORDS_ATOM, e) && !q(r.RESERVED_WORDS, e) && !q(r.KEYWORDS, e)
            }

            function q(e, t) {
                return Object.prototype.hasOwnProperty.call(e, t)
            }

            var r = e("./parse-js"), i = r.curry, s = r.slice, o = r.member, u = r.is_identifier_char, a = r.PRECEDENCE, f = r.OPERATORS;
            var p = function () {
                var e = h();
                return function (t) {
                    var n = "", r = 54;
                    do {
                        n += e.charAt(t % r);
                        t = Math.floor(t / r);
                        r = 64
                    } while (t > 0);
                    return n
                }
            }();
            c.prototype = {
                has: function (e) {
                    for (var t = this; t; t = t.parent)if (q(t.names, e))return t
                }, has_mangled: function (e) {
                    for (var t = this; t; t = t.parent)if (q(t.rev_mangled, e))return t
                }, toJSON: function () {
                    return {names: this.names, uses_eval: this.uses_eval, uses_with: this.uses_with}
                }, next_mangled: function () {
                    for (; ;) {
                        var e = p(++this.cname), t;
                        t = this.has_mangled(e);
                        if (t && this.refs[t.rev_mangled[e]] === t)continue;
                        t = this.has(e);
                        if (t && t !== this && this.refs[e] === t && !t.has_mangled(e))continue;
                        if (q(this.refs, e) && this.refs[e] == null)continue;
                        if (!I(e))continue;
                        return e
                    }
                }, set_mangle: function (e, t) {
                    this.rev_mangled[t] = e;
                    return this.mangled[e] = t
                }, get_mangled: function (e, t) {
                    if (this.uses_eval || this.uses_with)return e;
                    var n = this.has(e);
                    if (!n)return e;
                    if (q(n.mangled, e))return n.mangled[e];
                    if (!t)return e;
                    return n.set_mangle(e, n.next_mangled())
                }, references: function (e) {
                    return e && !this.parent || this.uses_with || this.uses_eval || this.refs[e]
                }, define: function (e, t) {
                    if (e != null) {
                        if (t == "var" || !q(this.names, e))this.names[e] = t || "var";
                        return e
                    }
                }, active_directive: function (e) {
                    return o(e, this.directives) || this.parent && this.parent.active_directive(e)
                }
            };
            var m = function () {
            };
            var x = function () {
                function t(n) {
                    switch (n[0]) {
                        case"string":
                        case"num":
                            return n[1];
                        case"name":
                        case"atom":
                            switch (n[1]) {
                                case"true":
                                    return true;
                                case"false":
                                    return false;
                                case"null":
                                    return null
                            }
                            break;
                        case"unary-prefix":
                            switch (n[1]) {
                                case"!":
                                    return !t(n[2]);
                                case"typeof":
                                    return typeof t(n[2]);
                                case"~":
                                    return ~t(n[2]);
                                case"-":
                                    return -t(n[2]);
                                case"+":
                                    return +t(n[2])
                            }
                            break;
                        case"binary":
                            var r = n[2], i = n[3];
                            switch (n[1]) {
                                case"&&":
                                    return t(r) && t(i);
                                case"||":
                                    return t(r) || t(i);
                                case"|":
                                    return t(r) | t(i);
                                case"&":
                                    return t(r) & t(i);
                                case"^":
                                    return t(r) ^ t(i);
                                case"+":
                                    return t(r) + t(i);
                                case"*":
                                    return t(r) * t(i);
                                case"/":
                                    return t(r) / t(i);
                                case"%":
                                    return t(r) % t(i);
                                case"-":
                                    return t(r) - t(i);
                                case"<<":
                                    return t(r) << t(i);
                                case">>":
                                    return t(r) >> t(i);
                                case">>>":
                                    return t(r) >>> t(i);
                                case"==":
                                    return t(r) == t(i);
                                case"===":
                                    return t(r) === t(i);
                                case"!=":
                                    return t(r) != t(i);
                                case"!==":
                                    return t(r) !== t(i);
                                case"<":
                                    return t(r) < t(i);
                                case"<=":
                                    return t(r) <= t(i);
                                case">":
                                    return t(r) > t(i);
                                case">=":
                                    return t(r) >= t(i);
                                case"in":
                                    return t(r)in t(i);
                                case"instanceof":
                                    return t(r)instanceof t(i)
                            }
                    }
                    throw e
                }

                var e = {};
                return function (n, r, i) {
                    try {
                        var s = t(n), o;
                        switch (typeof s) {
                            case"string":
                                o = ["string", s];
                                break;
                            case"number":
                                o = ["num", s];
                                break;
                            case"boolean":
                                o = ["name", String(s)];
                                break;
                            default:
                                if (s === null) {
                                    o = ["atom", "null"];
                                    break
                                }
                                throw new Error("Can't handle constant of type: " + typeof s)
                        }
                        return r.call(n, o, s)
                    } catch (u) {
                        if (u === e) {
                            if (n[0] == "binary" && (n[1] == "===" || n[1] == "!==") && (S(n[2]) && S(n[3]) || w(n[2]) && w(n[3]))) {
                                n[1] = n[1].substr(0, 2)
                            } else if (i && n[0] == "binary" && (n[1] == "||" || n[1] == "&&")) {
                                try {
                                    var a = t(n[2]);
                                    n = n[1] == "&&" && (a ? n[3] : a) || n[1] == "||" && (a ? a : n[3]) || n
                                } catch (f) {
                                }
                            }
                            return i ? i.call(n, n) : null
                        } else throw u
                    }
                }
            }();
            var M = r.array_to_hash(["name", "array", "object", "string", "dot", "sub", "call", "regexp", "defun"]);
            var P = r.array_to_hash(["if", "while", "do", "for", "for-in", "with"]);
            var R;
            (function () {
                function t(e) {
                    this.v = e
                }

                function n(e) {
                    this.v = e
                }

                R = function (r, i, s) {
                    function f() {
                        var f = i.call(s, r[a], a);
                        if (f instanceof t) {
                            f = f.v;
                            if (f instanceof n) {
                                u.push.apply(u, f.v)
                            } else {
                                u.push(f)
                            }
                        } else if (f != e) {
                            if (f instanceof n) {
                                o.push.apply(o, f.v)
                            } else {
                                o.push(f)
                            }
                        }
                    }

                    var o = [], u = [], a;
                    if (r instanceof Array)for (a = 0; a < r.length; ++a)f(); else for (a in r)if (q(r, a))f();
                    return u.concat(o)
                };
                R.at_top = function (e) {
                    return new t(e)
                };
                R.splice = function (e) {
                    return new n(e)
                };
                var e = R.skip = {};
            })();
            t.ast_walker = l;
            t.ast_mangle = v;
            t.ast_squeeze = L;
            t.ast_lift_variables = k;
            t.gen_code = H;
            t.ast_add_scope = d;
            t.set_logger = function (e) {
                m = e
            };
            t.make_string = _;
            t.split_lines = B;
            t.MAP = R;
            t.ast_squeeze_more = e("./squeeze-more").ast_squeeze_more
        });
        define("uglifyjs/index", ["require", "exports", "module", "./parse-js", "./process", "./consolidator"], function (e, t, n) {
            function r(e, t) {
                t || (t = {});
                var n = r.parser;
                var i = r.uglify;
                var s = n.parse(e, t.strict_semicolons);
                s = i.ast_mangle(s, t.mangle_options);
                s = i.ast_squeeze(s, t.squeeze_options);
                var o = i.gen_code(s, t.gen_options);
                return o
            }

            r.parser = e("./parse-js");
            r.uglify = e("./process");
            r.consolidator = e("./consolidator");
            n.exports = r
        });
        define("source-map/array-set", function (e, t, n) {
            function i() {
                this._array = [];
                this._set = {}
            }

            var r = e("./util");
            i.fromArray = function (t, n) {
                var r = new i;
                for (var s = 0, o = t.length; s < o; s++) {
                    r.add(t[s], n)
                }
                return r
            };
            i.prototype.add = function (t, n) {
                var i = this.has(t);
                var s = this._array.length;
                if (!i || n) {
                    this._array.push(t)
                }
                if (!i) {
                    this._set[r.toSetString(t)] = s
                }
            };
            i.prototype.has = function (t) {
                return Object.prototype.hasOwnProperty.call(this._set, r.toSetString(t))
            };
            i.prototype.indexOf = function (t) {
                if (this.has(t)) {
                    return this._set[r.toSetString(t)]
                }
                throw new Error('"' + t + '" is not in the set.')
            };
            i.prototype.at = function (t) {
                if (t >= 0 && t < this._array.length) {
                    return this._array[t]
                }
                throw new Error("No element indexed by " + t)
            };
            i.prototype.toArray = function () {
                return this._array.slice()
            };
            t.ArraySet = i
        });
        define("source-map/base64-vlq", function (e, t, n) {
            function a(e) {
                return e < 0 ? (-e << 1) + 1 : (e << 1) + 0
            }

            function f(e) {
                var t = (e & 1) === 1;
                var n = e >> 1;
                return t ? -n : n
            }

            var r = e("./base64");
            var i = 5;
            var s = 1 << i;
            var o = s - 1;
            var u = s;
            t.encode = function (t) {
                var n = "";
                var s;
                var f = a(t);
                do {
                    s = f & o;
                    f >>>= i;
                    if (f > 0) {
                        s |= u
                    }
                    n += r.encode(s)
                } while (f > 0);
                return n
            };
            t.decode = function (t) {
                var n = 0;
                var s = t.length;
                var a = 0;
                var l = 0;
                var c, h;
                do {
                    if (n >= s) {
                        throw new Error("Expected more digits in base 64 VLQ value.")
                    }
                    h = r.decode(t.charAt(n++));
                    c = !!(h & u);
                    h &= o;
                    a = a + (h << l);
                    l += i
                } while (c);
                return {value: f(a), rest: t.slice(n)}
            }
        });
        define("source-map/base64", function (e, t, n) {
            var r = {};
            var i = {};
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("").forEach(function (e, t) {
                r[e] = t;
                i[t] = e
            });
            t.encode = function (t) {
                if (t in i) {
                    return i[t]
                }
                throw new TypeError("Must be between 0 and 63: " + t)
            };
            t.decode = function (t) {
                if (t in r) {
                    return r[t]
                }
                throw new TypeError("Not a valid base 64 digit: " + t)
            }
        });
        define("source-map/binary-search", function (e, t, n) {
            function r(e, t, n, i, s) {
                var o = Math.floor((t - e) / 2) + e;
                var u = s(n, i[o], true);
                if (u === 0) {
                    return i[o]
                } else if (u > 0) {
                    if (t - o > 1) {
                        return r(o, t, n, i, s)
                    }
                    return i[o]
                } else {
                    if (o - e > 1) {
                        return r(e, o, n, i, s)
                    }
                    return e < 0 ? null : i[e]
                }
            }

            t.search = function (t, n, i) {
                return n.length > 0 ? r(-1, n.length, t, n, i) : null
            }
        });
        define("source-map/source-map-consumer", function (e, t, n) {
            function u(e) {
                var t = e;
                if (typeof e === "string") {
                    t = JSON.parse(e.replace(/^\)\]\}'/, ""))
                }
                var n = r.getArg(t, "version");
                var i = r.getArg(t, "sources");
                var o = r.getArg(t, "names", []);
                var u = r.getArg(t, "sourceRoot", null);
                var a = r.getArg(t, "sourcesContent", null);
                var f = r.getArg(t, "mappings");
                var l = r.getArg(t, "file", null);
                if (n != this._version) {
                    throw new Error("Unsupported version: " + n)
                }
                this._names = s.fromArray(o, true);
                this._sources = s.fromArray(i, true);
                this.sourceRoot = u;
                this.sourcesContent = a;
                this._mappings = f;
                this.file = l
            }

            var r = e("./util");
            var i = e("./binary-search");
            var s = e("./array-set").ArraySet;
            var o = e("./base64-vlq");
            u.fromSourceMap = function (t) {
                var n = Object.create(u.prototype);
                n._names = s.fromArray(t._names.toArray(), true);
                n._sources = s.fromArray(t._sources.toArray(), true);
                n.sourceRoot = t._sourceRoot;
                n.sourcesContent = t._generateSourcesContent(n._sources.toArray(), n.sourceRoot);
                n.file = t._file;
                n.__generatedMappings = t._mappings.slice().sort(r.compareByGeneratedPositions);
                n.__originalMappings = t._mappings.slice().sort(r.compareByOriginalPositions);
                return n
            };
            u.prototype._version = 3;
            Object.defineProperty(u.prototype, "sources", {
                get: function () {
                    return this._sources.toArray().map(function (e) {
                        return this.sourceRoot ? r.join(this.sourceRoot, e) : e
                    }, this)
                }
            });
            u.prototype.__generatedMappings = null;
            Object.defineProperty(u.prototype, "_generatedMappings", {
                get: function () {
                    if (!this.__generatedMappings) {
                        this.__generatedMappings = [];
                        this.__originalMappings = [];
                        this._parseMappings(this._mappings, this.sourceRoot)
                    }
                    return this.__generatedMappings
                }
            });
            u.prototype.__originalMappings = null;
            Object.defineProperty(u.prototype, "_originalMappings", {
                get: function () {
                    if (!this.__originalMappings) {
                        this.__generatedMappings = [];
                        this.__originalMappings = [];
                        this._parseMappings(this._mappings, this.sourceRoot)
                    }
                    return this.__originalMappings
                }
            });
            u.prototype._parseMappings = function (t, n) {
                var i = 1;
                var s = 0;
                var u = 0;
                var a = 0;
                var f = 0;
                var l = 0;
                var c = /^[,;]/;
                var h = t;
                var p;
                var d;
                while (h.length > 0) {
                    if (h.charAt(0) === ";") {
                        i++;
                        h = h.slice(1);
                        s = 0
                    } else if (h.charAt(0) === ",") {
                        h = h.slice(1)
                    } else {
                        p = {};
                        p.generatedLine = i;
                        d = o.decode(h);
                        p.generatedColumn = s + d.value;
                        s = p.generatedColumn;
                        h = d.rest;
                        if (h.length > 0 && !c.test(h.charAt(0))) {
                            d = o.decode(h);
                            p.source = this._sources.at(f + d.value);
                            f += d.value;
                            h = d.rest;
                            if (h.length === 0 || c.test(h.charAt(0))) {
                                throw new Error("Found a source, but no line and column")
                            }
                            d = o.decode(h);
                            p.originalLine = u + d.value;
                            u = p.originalLine;
                            p.originalLine += 1;
                            h = d.rest;
                            if (h.length === 0 || c.test(h.charAt(0))) {
                                throw new Error("Found a source and line, but no column")
                            }
                            d = o.decode(h);
                            p.originalColumn = a + d.value;
                            a = p.originalColumn;
                            h = d.rest;
                            if (h.length > 0 && !c.test(h.charAt(0))) {
                                d = o.decode(h);
                                p.name = this._names.at(l + d.value);
                                l += d.value;
                                h = d.rest
                            }
                        }
                        this.__generatedMappings.push(p);
                        if (typeof p.originalLine === "number") {
                            this.__originalMappings.push(p)
                        }
                    }
                }
                this.__generatedMappings.sort(r.compareByGeneratedPositions);
                this.__originalMappings.sort(r.compareByOriginalPositions)
            };
            u.prototype._findMapping = function (t, n, r, s, o) {
                if (t[r] <= 0) {
                    throw new TypeError("Line must be greater than or equal to 1, got " + t[r])
                }
                if (t[s] < 0) {
                    throw new TypeError("Column must be greater than or equal to 0, got " + t[s])
                }
                return i.search(t, n, o)
            };
            u.prototype.originalPositionFor = function (t) {
                var n = {generatedLine: r.getArg(t, "line"), generatedColumn: r.getArg(t, "column")};
                var i = this._findMapping(n, this._generatedMappings, "generatedLine", "generatedColumn", r.compareByGeneratedPositions);
                if (i && i.generatedLine === n.generatedLine) {
                    var s = r.getArg(i, "source", null);
                    if (s && this.sourceRoot) {
                        s = r.join(this.sourceRoot, s)
                    }
                    return {
                        source: s,
                        line: r.getArg(i, "originalLine", null),
                        column: r.getArg(i, "originalColumn", null),
                        name: r.getArg(i, "name", null)
                    }
                }
                return {source: null, line: null, column: null, name: null}
            };
            u.prototype.sourceContentFor = function (t) {
                if (!this.sourcesContent) {
                    return null
                }
                if (this.sourceRoot) {
                    t = r.relative(this.sourceRoot, t)
                }
                if (this._sources.has(t)) {
                    return this.sourcesContent[this._sources.indexOf(t)]
                }
                var n;
                if (this.sourceRoot && (n = r.urlParse(this.sourceRoot))) {
                    var i = t.replace(/^file:\/\//, "");
                    if (n.scheme == "file" && this._sources.has(i)) {
                        return this.sourcesContent[this._sources.indexOf(i)]
                    }
                    if ((!n.path || n.path == "/") && this._sources.has("/" + t)) {
                        return this.sourcesContent[this._sources.indexOf("/" + t)]
                    }
                }
                throw new Error('"' + t + '" is not in the SourceMap.')
            };
            u.prototype.generatedPositionFor = function (t) {
                var n = {
                    source: r.getArg(t, "source"),
                    originalLine: r.getArg(t, "line"),
                    originalColumn: r.getArg(t, "column")
                };
                if (this.sourceRoot) {
                    n.source = r.relative(this.sourceRoot, n.source)
                }
                var i = this._findMapping(n, this._originalMappings, "originalLine", "originalColumn", r.compareByOriginalPositions);
                if (i) {
                    return {line: r.getArg(i, "generatedLine", null), column: r.getArg(i, "generatedColumn", null)}
                }
                return {line: null, column: null}
            };
            u.GENERATED_ORDER = 1;
            u.ORIGINAL_ORDER = 2;
            u.prototype.eachMapping = function (t, n, i) {
                var s = n || null;
                var o = i || u.GENERATED_ORDER;
                var a;
                switch (o) {
                    case u.GENERATED_ORDER:
                        a = this._generatedMappings;
                        break;
                    case u.ORIGINAL_ORDER:
                        a = this._originalMappings;
                        break;
                    default:
                        throw new Error("Unknown order of iteration.")
                }
                var f = this.sourceRoot;
                a.map(function (e) {
                    var t = e.source;
                    if (t && f) {
                        t = r.join(f, t)
                    }
                    return {
                        source: t,
                        generatedLine: e.generatedLine,
                        generatedColumn: e.generatedColumn,
                        originalLine: e.originalLine,
                        originalColumn: e.originalColumn,
                        name: e.name
                    }
                }).forEach(t, s)
            };
            t.SourceMapConsumer = u
        });
        define("source-map/source-map-generator", function (e, t, n) {
            function o(e) {
                if (!e) {
                    e = {}
                }
                this._file = i.getArg(e, "file", null);
                this._sourceRoot = i.getArg(e, "sourceRoot", null);
                this._sources = new s;
                this._names = new s;
                this._mappings = [];
                this._sourcesContents = null
            }

            var r = e("./base64-vlq");
            var i = e("./util");
            var s = e("./array-set").ArraySet;
            o.prototype._version = 3;
            o.fromSourceMap = function (t) {
                var n = t.sourceRoot;
                var r = new o({file: t.file, sourceRoot: n});
                t.eachMapping(function (e) {
                    var t = {generated: {line: e.generatedLine, column: e.generatedColumn}};
                    if (e.source) {
                        t.source = e.source;
                        if (n) {
                            t.source = i.relative(n, t.source)
                        }
                        t.original = {line: e.originalLine, column: e.originalColumn};
                        if (e.name) {
                            t.name = e.name
                        }
                    }
                    r.addMapping(t)
                });
                t.sources.forEach(function (e) {
                    var n = t.sourceContentFor(e);
                    if (n) {
                        r.setSourceContent(e, n)
                    }
                });
                return r
            };
            o.prototype.addMapping = function (t) {
                var n = i.getArg(t, "generated");
                var r = i.getArg(t, "original", null);
                var s = i.getArg(t, "source", null);
                var o = i.getArg(t, "name", null);
                this._validateMapping(n, r, s, o);
                if (s && !this._sources.has(s)) {
                    this._sources.add(s)
                }
                if (o && !this._names.has(o)) {
                    this._names.add(o)
                }
                this._mappings.push({
                    generatedLine: n.line,
                    generatedColumn: n.column,
                    originalLine: r != null && r.line,
                    originalColumn: r != null && r.column,
                    source: s,
                    name: o
                })
            };
            o.prototype.setSourceContent = function (t, n) {
                var r = t;
                if (this._sourceRoot) {
                    r = i.relative(this._sourceRoot, r)
                }
                if (n !== null) {
                    if (!this._sourcesContents) {
                        this._sourcesContents = {}
                    }
                    this._sourcesContents[i.toSetString(r)] = n
                } else {
                    delete this._sourcesContents[i.toSetString(r)];
                    if (Object.keys(this._sourcesContents).length === 0) {
                        this._sourcesContents = null
                    }
                }
            };
            o.prototype.applySourceMap = function (t, n, r) {
                if (!n) {
                    if (!t.file) {
                        throw new Error("SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, " + 'or the source map\'s "file" property. Both were omitted.')
                    }
                    n = t.file
                }
                var o = this._sourceRoot;
                if (o) {
                    n = i.relative(o, n)
                }
                var u = new s;
                var a = new s;
                this._mappings.forEach(function (e) {
                    if (e.source === n && e.originalLine) {
                        var s = t.originalPositionFor({line: e.originalLine, column: e.originalColumn});
                        if (s.source !== null) {
                            e.source = s.source;
                            if (r) {
                                e.source = i.join(r, e.source)
                            }
                            if (o) {
                                e.source = i.relative(o, e.source)
                            }
                            e.originalLine = s.line;
                            e.originalColumn = s.column;
                            if (s.name !== null && e.name !== null) {
                                e.name = s.name
                            }
                        }
                    }
                    var f = e.source;
                    if (f && !u.has(f)) {
                        u.add(f)
                    }
                    var l = e.name;
                    if (l && !a.has(l)) {
                        a.add(l)
                    }
                }, this);
                this._sources = u;
                this._names = a;
                t.sources.forEach(function (e) {
                    var n = t.sourceContentFor(e);
                    if (n) {
                        if (o) {
                            e = i.relative(o, e)
                        }
                        this.setSourceContent(e, n)
                    }
                }, this)
            };
            o.prototype._validateMapping = function (t, n, r, i) {
                if (t && "line"in t && "column"in t && t.line > 0 && t.column >= 0 && !n && !r && !i) {
                    return
                } else if (t && "line"in t && "column"in t && n && "line"in n && "column"in n && t.line > 0 && t.column >= 0 && n.line > 0 && n.column >= 0 && r) {
                    return
                } else {
                    throw new Error("Invalid mapping: " + JSON.stringify({
                            generated: t,
                            source: r,
                            original: n,
                            name: i
                        }))
                }
            };
            o.prototype._serializeMappings = function () {
                var t = 0;
                var n = 1;
                var s = 0;
                var o = 0;
                var u = 0;
                var a = 0;
                var f = "";
                var l;
                this._mappings.sort(i.compareByGeneratedPositions);
                for (var c = 0, h = this._mappings.length; c < h; c++) {
                    l = this._mappings[c];
                    if (l.generatedLine !== n) {
                        t = 0;
                        while (l.generatedLine !== n) {
                            f += ";";
                            n++
                        }
                    } else {
                        if (c > 0) {
                            if (!i.compareByGeneratedPositions(l, this._mappings[c - 1])) {
                                continue
                            }
                            f += ","
                        }
                    }
                    f += r.encode(l.generatedColumn - t);
                    t = l.generatedColumn;
                    if (l.source) {
                        f += r.encode(this._sources.indexOf(l.source) - a);
                        a = this._sources.indexOf(l.source);
                        f += r.encode(l.originalLine - 1 - o);
                        o = l.originalLine - 1;
                        f += r.encode(l.originalColumn - s);
                        s = l.originalColumn;
                        if (l.name) {
                            f += r.encode(this._names.indexOf(l.name) - u);
                            u = this._names.indexOf(l.name)
                        }
                    }
                }
                return f
            };
            o.prototype._generateSourcesContent = function (t, n) {
                return t.map(function (e) {
                    if (!this._sourcesContents) {
                        return null
                    }
                    if (n) {
                        e = i.relative(n, e)
                    }
                    var t = i.toSetString(e);
                    return Object.prototype.hasOwnProperty.call(this._sourcesContents, t) ? this._sourcesContents[t] : null
                }, this)
            };
            o.prototype.toJSON = function () {
                var t = {
                    version: this._version,
                    file: this._file,
                    sources: this._sources.toArray(),
                    names: this._names.toArray(),
                    mappings: this._serializeMappings()
                };
                if (this._sourceRoot) {
                    t.sourceRoot = this._sourceRoot
                }
                if (this._sourcesContents) {
                    t.sourcesContent = this._generateSourcesContent(t.sources, t.sourceRoot)
                }
                return t
            };
            o.prototype.toString = function () {
                return JSON.stringify(this)
            };
            t.SourceMapGenerator = o
        });
        define("source-map/source-node", function (e, t, n) {
            function s(e, t, n, r, i) {
                this.children = [];
                this.sourceContents = {};
                this.line = e === undefined ? null : e;
                this.column = t === undefined ? null : t;
                this.source = n === undefined ? null : n;
                this.name = i === undefined ? null : i;
                if (r != null)this.add(r)
            }

            var r = e("./source-map-generator").SourceMapGenerator;
            var i = e("./util");
            s.fromStringWithSourceMap = function (t, n) {
                function l(e, t) {
                    if (e === null || e.source === undefined) {
                        r.add(t)
                    } else {
                        r.add(new s(e.originalLine, e.originalColumn, e.source, t, e.name))
                    }
                }

                var r = new s;
                var i = t.split("\n");
                var o = 1, u = 0;
                var a = null;
                n.eachMapping(function (e) {
                    if (a !== null) {
                        if (o < e.generatedLine) {
                            var t = "";
                            l(a, i.shift() + "\n");
                            o++;
                            u = 0
                        } else {
                            var n = i[0];
                            var t = n.substr(0, e.generatedColumn - u);
                            i[0] = n.substr(e.generatedColumn - u);
                            u = e.generatedColumn;
                            l(a, t);
                            a = e;
                            return
                        }
                    }
                    while (o < e.generatedLine) {
                        r.add(i.shift() + "\n");
                        o++
                    }
                    if (u < e.generatedColumn) {
                        var n = i[0];
                        r.add(n.substr(0, e.generatedColumn));
                        i[0] = n.substr(e.generatedColumn);
                        u = e.generatedColumn
                    }
                    a = e
                }, this);
                if (i.length > 0) {
                    if (a) {
                        var f = i.shift();
                        if (i.length > 0)f += "\n";
                        l(a, f)
                    }
                    r.add(i.join("\n"))
                }
                n.sources.forEach(function (e) {
                    var t = n.sourceContentFor(e);
                    if (t) {
                        r.setSourceContent(e, t)
                    }
                });
                return r
            };
            s.prototype.add = function (t) {
                if (Array.isArray(t)) {
                    t.forEach(function (e) {
                        this.add(e)
                    }, this)
                } else if (t instanceof s || typeof t === "string") {
                    if (t) {
                        this.children.push(t)
                    }
                } else {
                    throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + t)
                }
                return this
            };
            s.prototype.prepend = function (t) {
                if (Array.isArray(t)) {
                    for (var n = t.length - 1; n >= 0; n--) {
                        this.prepend(t[n])
                    }
                } else if (t instanceof s || typeof t === "string") {
                    this.children.unshift(t)
                } else {
                    throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + t)
                }
                return this
            };
            s.prototype.walk = function (t) {
                var n;
                for (var r = 0, i = this.children.length; r < i; r++) {
                    n = this.children[r];
                    if (n instanceof s) {
                        n.walk(t)
                    } else {
                        if (n !== "") {
                            t(n, {source: this.source, line: this.line, column: this.column, name: this.name})
                        }
                    }
                }
            };
            s.prototype.join = function (t) {
                var n;
                var r;
                var i = this.children.length;
                if (i > 0) {
                    n = [];
                    for (r = 0; r < i - 1; r++) {
                        n.push(this.children[r]);
                        n.push(t)
                    }
                    n.push(this.children[r]);
                    this.children = n
                }
                return this
            };
            s.prototype.replaceRight = function (t, n) {
                var r = this.children[this.children.length - 1];
                if (r instanceof s) {
                    r.replaceRight(t, n)
                } else if (typeof r === "string") {
                    this.children[this.children.length - 1] = r.replace(t, n)
                } else {
                    this.children.push("".replace(t, n))
                }
                return this
            };
            s.prototype.setSourceContent = function (t, n) {
                this.sourceContents[i.toSetString(t)] = n
            };
            s.prototype.walkSourceContents = function (t) {
                for (var n = 0, r = this.children.length; n < r; n++) {
                    if (this.children[n]instanceof s) {
                        this.children[n].walkSourceContents(t)
                    }
                }
                var o = Object.keys(this.sourceContents);
                for (var n = 0, r = o.length; n < r; n++) {
                    t(i.fromSetString(o[n]), this.sourceContents[o[n]])
                }
            };
            s.prototype.toString = function () {
                var t = "";
                this.walk(function (e) {
                    t += e
                });
                return t
            };
            s.prototype.toStringWithSourceMap = function (t) {
                var n = {code: "", line: 1, column: 0};
                var i = new r(t);
                var s = false;
                var o = null;
                var u = null;
                var a = null;
                var f = null;
                this.walk(function (e, t) {
                    n.code += e;
                    if (t.source !== null && t.line !== null && t.column !== null) {
                        if (o !== t.source || u !== t.line || a !== t.column || f !== t.name) {
                            i.addMapping({
                                source: t.source,
                                original: {line: t.line, column: t.column},
                                generated: {line: n.line, column: n.column},
                                name: t.name
                            })
                        }
                        o = t.source;
                        u = t.line;
                        a = t.column;
                        f = t.name;
                        s = true
                    } else if (s) {
                        i.addMapping({generated: {line: n.line, column: n.column}});
                        o = null;
                        s = false
                    }
                    e.split("").forEach(function (e, r, u) {
                        if (e === "\n") {
                            n.line++;
                            n.column = 0;
                            if (r + 1 === u.length) {
                                o = null;
                                s = false
                            } else if (s) {
                                i.addMapping({
                                    source: t.source,
                                    original: {line: t.line, column: t.column},
                                    generated: {line: n.line, column: n.column},
                                    name: t.name
                                })
                            }
                        } else {
                            n.column++
                        }
                    })
                });
                this.walkSourceContents(function (e, t) {
                    i.setSourceContent(e, t)
                });
                return {code: n.code, map: i}
            };
            t.SourceNode = s
        });
        define("source-map/util", function (e, t, n) {
            function r(e, t, n) {
                if (t in e) {
                    return e[t]
                } else if (arguments.length === 3) {
                    return n
                } else {
                    throw new Error('"' + t + '" is a required argument.')
                }
            }

            function o(e) {
                var t = e.match(i);
                if (!t) {
                    return null
                }
                return {scheme: t[1], auth: t[2], host: t[3], port: t[4], path: t[5]}
            }

            function u(e) {
                var t = "";
                if (e.scheme) {
                    t += e.scheme + ":"
                }
                t += "//";
                if (e.auth) {
                    t += e.auth + "@"
                }
                if (e.host) {
                    t += e.host
                }
                if (e.port) {
                    t += ":" + e.port
                }
                if (e.path) {
                    t += e.path
                }
                return t
            }

            function a(e) {
                var t = e;
                var n = o(e);
                if (n) {
                    if (!n.path) {
                        return e
                    }
                    t = n.path
                }
                var r = t.charAt(0) === "/";
                var i = t.split(/\/+/);
                for (var s, a = 0, f = i.length - 1; f >= 0; f--) {
                    s = i[f];
                    if (s === ".") {
                        i.splice(f, 1)
                    } else if (s === "..") {
                        a++
                    } else if (a > 0) {
                        if (s === "") {
                            i.splice(f + 1, a);
                            a = 0
                        } else {
                            i.splice(f, 2);
                            a--
                        }
                    }
                }
                t = i.join("/");
                if (t === "") {
                    t = r ? "/" : "."
                }
                if (n) {
                    n.path = t;
                    return u(n)
                }
                return t
            }

            function f(e, t) {
                var n = o(t);
                var r = o(e);
                if (r) {
                    e = r.path || "/"
                }
                if (n && !n.scheme) {
                    if (r) {
                        n.scheme = r.scheme
                    }
                    return u(n)
                }
                if (n || t.match(s)) {
                    return t
                }
                if (r && !r.host && !r.path) {
                    r.host = t;
                    return u(r)
                }
                var i = t.charAt(0) === "/" ? t : a(e.replace(/\/+$/, "") + "/" + t);
                if (r) {
                    r.path = i;
                    return u(r)
                }
                return i
            }

            function l(e) {
                return "$" + e
            }

            function c(e) {
                return e.substr(1)
            }

            function h(e, t) {
                e = e.replace(/\/$/, "");
                var n = o(e);
                if (t.charAt(0) == "/" && n && n.path == "/") {
                    return t.slice(1)
                }
                return t.indexOf(e + "/") === 0 ? t.substr(e.length + 1) : t
            }

            function p(e, t) {
                var n = e || "";
                var r = t || "";
                return (n > r) - (n < r)
            }

            function d(e, t, n) {
                var r;
                r = p(e.source, t.source);
                if (r) {
                    return r
                }
                r = e.originalLine - t.originalLine;
                if (r) {
                    return r
                }
                r = e.originalColumn - t.originalColumn;
                if (r || n) {
                    return r
                }
                r = p(e.name, t.name);
                if (r) {
                    return r
                }
                r = e.generatedLine - t.generatedLine;
                if (r) {
                    return r
                }
                return e.generatedColumn - t.generatedColumn
            }

            function v(e, t, n) {
                var r;
                r = e.generatedLine - t.generatedLine;
                if (r) {
                    return r
                }
                r = e.generatedColumn - t.generatedColumn;
                if (r || n) {
                    return r
                }
                r = p(e.source, t.source);
                if (r) {
                    return r
                }
                r = e.originalLine - t.originalLine;
                if (r) {
                    return r
                }
                r = e.originalColumn - t.originalColumn;
                if (r) {
                    return r
                }
                return p(e.name, t.name)
            }

            t.getArg = r;
            var i = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/;
            var s = /^data:.+\,.+$/;
            t.urlParse = o;
            t.urlGenerate = u;
            t.normalize = a;
            t.join = f;
            t.toSetString = l;
            t.fromSetString = c;
            t.relative = h;
            t.compareByOriginalPositions = d;
            t.compareByGeneratedPositions = v
        });
        define("source-map", function (e, t, n) {
            t.SourceMapGenerator = e("./source-map/source-map-generator").SourceMapGenerator;
            t.SourceMapConsumer = e("./source-map/source-map-consumer").SourceMapConsumer;
            t.SourceNode = e("./source-map/source-node").SourceNode
        });
        define("uglifyjs2", ["exports", "source-map", "logger", "env!env/file"], function (e, t, n, r) {
            "use strict";
            function i(e) {
                var t = Object.create(null);
                for (var n = 0; n < e.length; ++n)t[e[n]] = true;
                return t
            }

            function s(e, t) {
                return Array.prototype.slice.call(e, t || 0)
            }

            function o(e) {
                return e.split("")
            }

            function u(e, t) {
                for (var n = t.length; --n >= 0;)if (t[n] == e)return true;
                return false
            }

            function a(e, t) {
                for (var n = 0, r = t.length; n < r; ++n) {
                    if (e(t[n]))return t[n]
                }
            }

            function f(e, t) {
                if (t <= 0)return "";
                if (t == 1)return e;
                var n = f(e, t >> 1);
                n += n;
                if (t & 1)n += e;
                return n
            }

            function l(e, t) {
                Error.call(this, e);
                this.msg = e;
                this.defs = t
            }

            function c(e, t, n) {
                if (e === true)e = {};
                var r = e || {};
                if (n)for (var i in r)if (r.hasOwnProperty(i) && !t.hasOwnProperty(i))l.croak("`" + i + "` is not a supported option", t);
                for (var i in t)if (t.hasOwnProperty(i)) {
                    r[i] = e && e.hasOwnProperty(i) ? e[i] : t[i]
                }
                return r
            }

            function h(e, t) {
                for (var n in t)if (t.hasOwnProperty(n)) {
                    e[n] = t[n]
                }
                return e
            }

            function p() {
            }

            function v(e, t) {
                if (e.indexOf(t) < 0)e.push(t)
            }

            function m(e, t) {
                return e.replace(/\{(.+?)\}/g, function (e, n) {
                    return t[n]
                })
            }

            function g(e, t) {
                for (var n = e.length; --n >= 0;) {
                    if (e[n] === t)e.splice(n, 1)
                }
            }

            function y(e, t) {
                function n(e, n) {
                    var r = [], i = 0, s = 0, o = 0;
                    while (i < e.length && s < n.length) {
                        t(e[i], n[s]) <= 0 ? r[o++] = e[i++] : r[o++] = n[s++]
                    }
                    if (i < e.length)r.push.apply(r, e.slice(i));
                    if (s < n.length)r.push.apply(r, n.slice(s));
                    return r
                }

                function r(e) {
                    if (e.length <= 1)return e;
                    var t = Math.floor(e.length / 2), i = e.slice(0, t), s = e.slice(t);
                    i = r(i);
                    s = r(s);
                    return n(i, s)
                }

                if (e.length < 2)return e.slice();
                return r(e)
            }

            function b(e, t) {
                return e.filter(function (e) {
                    return t.indexOf(e) < 0
                })
            }

            function w(e, t) {
                return e.filter(function (e) {
                    return t.indexOf(e) >= 0
                })
            }

            function E(e) {
                function s(e) {
                    if (e.length == 1)return t += "return str === " + JSON.stringify(e[0]) + ";";
                    t += "switch(str){";
                    for (var n = 0; n < e.length; ++n)t += "case " + JSON.stringify(e[n]) + ":";
                    t += "return true}return false;"
                }

                if (!(e instanceof Array))e = e.split(" ");
                var t = "", n = [];
                e:for (var r = 0; r < e.length; ++r) {
                    for (var i = 0; i < n.length; ++i)if (n[i][0].length == e[r].length) {
                        n[i].push(e[r]);
                        continue e
                    }
                    n.push([e[r]])
                }
                if (n.length > 3) {
                    n.sort(function (e, t) {
                        return t.length - e.length
                    });
                    t += "switch(str.length){";
                    for (var r = 0; r < n.length; ++r) {
                        var o = n[r];
                        t += "case " + o[0].length + ":";
                        s(o)
                    }
                    t += "}"
                } else {
                    s(e)
                }
                return new Function("str", t)
            }

            function S(e, t) {
                for (var n = e.length; --n >= 0;)if (!t(e[n]))return false;
                return true
            }

            function x() {
                this._values = Object.create(null);
                this._size = 0
            }

            function T(e, t, n, r) {
                if (arguments.length < 4)r = C;
                if (!t)t = []; else t = t.split(/\s+/);
                var i = t;
                if (r && r.PROPS)t = t.concat(r.PROPS);
                var s = "return function AST_" + e + "(props){ if (props) { ";
                for (var o = t.length; --o >= 0;) {
                    s += "this." + t[o] + " = props." + t[o] + ";"
                }
                var u = r && new r;
                if (u && u.initialize || n && n.initialize)s += "this.initialize();";
                s += "}}";
                var a = (new Function(s))();
                if (u) {
                    a.prototype = u;
                    a.BASE = r
                }
                if (r)r.SUBCLASSES.push(a);
                a.prototype.CTOR = a;
                a.PROPS = t || null;
                a.SELF_PROPS = i;
                a.SUBCLASSES = [];
                if (e) {
                    a.prototype.TYPE = a.TYPE = e
                }
                if (n)for (o in n)if (n.hasOwnProperty(o)) {
                    if (/^\$/.test(o)) {
                        a[o.substr(1)] = n[o]
                    } else {
                        a.prototype[o] = n[o]
                    }
                }
                a.DEFMETHOD = function (e, t) {
                    this.prototype[e] = t
                };
                return a
            }

            function M(e, t) {
                if (e.body instanceof k) {
                    e.body._walk(t)
                } else e.body.forEach(function (e) {
                    e._walk(t)
                })
            }

            function on(e) {
                this.visit = e;
                this.stack = []
            }

            function En(e) {
                return e >= 97 && e <= 122 || e >= 65 && e <= 90 || e >= 170 && wn.letter.test(String.fromCharCode(e))
            }

            function Sn(e) {
                return e >= 48 && e <= 57
            }

            function xn(e) {
                return Sn(e) || En(e)
            }

            function Tn(e) {
                return wn.non_spacing_mark.test(e) || wn.space_combining_mark.test(e)
            }

            function Nn(e) {
                return wn.connector_punctuation.test(e)
            }

            function Cn(e) {
                return !fn(e) && /^[a-z_$][a-z0-9_$]*$/i.test(e)
            }

            function kn(e) {
                return e == 36 || e == 95 || En(e)
            }

            function Ln(e) {
                var t = e.charCodeAt(0);
                return kn(t) || Sn(t) || t == 8204 || t == 8205 || Tn(e) || Nn(e)
            }

            function An(e) {
                var t = e.length;
                if (t == 0)return false;
                if (!kn(e.charCodeAt(0)))return false;
                while (--t >= 0) {
                    if (!Ln(e.charAt(t)))return false
                }
                return true
            }

            function On(e) {
                if (hn.test(e)) {
                    return parseInt(e.substr(2), 16)
                } else if (pn.test(e)) {
                    return parseInt(e.substr(1), 8)
                } else if (dn.test(e)) {
                    return parseFloat(e)
                }
            }

            function Mn(e, t, n, r) {
                this.message = e;
                this.line = t;
                this.col = n;
                this.pos = r;
                this.stack = (new Error).stack
            }

            function _n(e, t, n, r, i) {
                throw new Mn(e, n, r, i)
            }

            function Dn(e, t, n) {
                return e.type == t && (n == null || e.value == n)
            }

            function Hn(e, t, n) {
                function i() {
                    return r.text.charAt(r.pos)
                }

                function s(e, t) {
                    var n = r.text.charAt(r.pos++);
                    if (e && !n)throw Pn;
                    if (n == "\n") {
                        r.newline_before = r.newline_before || !t;
                        ++r.line;
                        r.col = 0
                    } else {
                        ++r.col
                    }
                    return n
                }

                function o(e) {
                    while (e-- > 0)s()
                }

                function u(e) {
                    return r.text.substr(r.pos, e.length) == e
                }

                function a(e, t) {
                    var n = r.text.indexOf(e, r.pos);
                    if (t && n == -1)throw Pn;
                    return n
                }

                function f() {
                    r.tokline = r.line;
                    r.tokcol = r.col;
                    r.tokpos = r.pos
                }

                function c(e, n, i) {
                    r.regex_allowed = e == "operator" && !jn(n) || e == "keyword" && ln(n) || e == "punc" && gn(n);
                    l = e == "punc" && n == ".";
                    var s = {
                        type: e,
                        value: n,
                        line: r.tokline,
                        col: r.tokcol,
                        pos: r.tokpos,
                        endpos: r.pos,
                        nlb: r.newline_before,
                        file: t
                    };
                    if (!i) {
                        s.comments_before = r.comments_before;
                        r.comments_before = [];
                        for (var o = 0, u = s.comments_before.length; o < u; o++) {
                            s.nlb = s.nlb || s.comments_before[o].nlb
                        }
                    }
                    r.newline_before = false;
                    return new N(s)
                }

                function h() {
                    while (mn(i()))s()
                }

                function p(e) {
                    var t = "", n, r = 0;
                    while ((n = i()) && e(n, r++))t += s();
                    return t
                }

                function d(e) {
                    _n(e, t, r.tokline, r.tokcol, r.tokpos)
                }

                function v(e) {
                    var t = false, n = false, r = false, i = e == ".";
                    var s = p(function (s, o) {
                        var u = s.charCodeAt(0);
                        switch (u) {
                            case 120:
                            case 88:
                                return r ? false : r = true;
                            case 101:
                            case 69:
                                return r ? true : t ? false : t = n = true;
                            case 45:
                                return n || o == 0 && !e;
                            case 43:
                                return n;
                            case n = false, 46:
                                return !i && !r && !t ? i = true : false
                        }
                        return xn(u)
                    });
                    if (e)s = e + s;
                    var o = On(s);
                    if (!isNaN(o)) {
                        return c("num", o)
                    } else {
                        d("Invalid syntax: " + s)
                    }
                }

                function m(e) {
                    var t = s(true, e);
                    switch (t.charCodeAt(0)) {
                        case 110:
                            return "\n";
                        case 114:
                            return "\r";
                        case 116:
                            return "	";
                        case 98:
                            return "\b";
                        case 118:
                            return "";
                        case 102:
                            return "\f";
                        case 48:
                            return "\0";
                        case 120:
                            return String.fromCharCode(g(2));
                        case 117:
                            return String.fromCharCode(g(4));
                        case 10:
                            return "";
                        default:
                            return t
                    }
                }

                function g(e) {
                    var t = 0;
                    for (; e > 0; --e) {
                        var n = parseInt(s(true), 16);
                        if (isNaN(n))d("Invalid hex-character pattern in string");
                        t = t << 4 | n
                    }
                    return t
                }

                function b(e) {
                    var t = r.regex_allowed;
                    var n = a("\n"), i;
                    if (n == -1) {
                        i = r.text.substr(r.pos);
                        r.pos = r.text.length
                    } else {
                        i = r.text.substring(r.pos, n);
                        r.pos = n
                    }
                    r.comments_before.push(c(e, i, true));
                    r.regex_allowed = t;
                    return A()
                }

                function E() {
                    var e = false, t = "", n, r = false, o;
                    while ((n = i()) != null) {
                        if (!e) {
                            if (n == "\\")r = e = true, s(); else if (Ln(n))t += s(); else break
                        } else {
                            if (n != "u")d("Expecting UnicodeEscapeSequence -- uXXXX");
                            n = m();
                            if (!Ln(n))d("Unicode char: " + n.charCodeAt(0) + " is not valid in identifier");
                            t += n;
                            e = false
                        }
                    }
                    if (un(t) && r) {
                        o = t.charCodeAt(0).toString(16).toUpperCase();
                        t = "\\u" + "0000".substr(o.length) + o + t.slice(1)
                    }
                    return t
                }

                function x(e) {
                    function t(e) {
                        if (!i())return e;
                        var n = e + i();
                        if (vn(n)) {
                            s();
                            return t(n)
                        } else {
                            return e
                        }
                    }

                    return c("operator", t(e || s()))
                }

                function T() {
                    s();
                    switch (i()) {
                        case"/":
                            s();
                            return b("comment1");
                        case"*":
                            s();
                            return w()
                    }
                    return r.regex_allowed ? S("") : x("/")
                }

                function C() {
                    s();
                    return Sn(i().charCodeAt(0)) ? v(".") : c("punc", ".")
                }

                function k() {
                    var e = E();
                    if (l)return c("name", e);
                    return an(e) ? c("atom", e) : !un(e) ? c("name", e) : vn(e) ? c("operator", e) : c("keyword", e)
                }

                function L(e, t) {
                    return function (n) {
                        try {
                            return t(n)
                        } catch (r) {
                            if (r === Pn)d(e); else throw r
                        }
                    }
                }

                function A(e) {
                    if (e != null)return S(e);
                    h();
                    f();
                    if (n) {
                        if (u("<!--")) {
                            o(4);
                            return b("comment3")
                        }
                        if (u("-->") && r.newline_before) {
                            o(3);
                            return b("comment4")
                        }
                    }
                    var t = i();
                    if (!t)return c("eof");
                    var a = t.charCodeAt(0);
                    switch (a) {
                        case 34:
                        case 39:
                            return y();
                        case 46:
                            return C();
                        case 47:
                            return T()
                    }
                    if (Sn(a))return v();
                    if (yn(t))return c("punc", s());
                    if (cn(t))return x();
                    if (a == 92 || kn(a))return k();
                    d("Unexpected character '" + t + "'")
                }

                var r = {
                    text: e.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/\uFEFF/g, ""),
                    filename: t,
                    pos: 0,
                    tokpos: 0,
                    line: 1,
                    tokline: 0,
                    col: 0,
                    tokcol: 0,
                    newline_before: false,
                    regex_allowed: false,
                    comments_before: []
                };
                var l = false;
                var y = L("Unterminated string constant", function () {
                    var e = s(), t = "";
                    for (; ;) {
                        var n = s(true);
                        if (n == "\\") {
                            var r = 0, i = null;
                            n = p(function (e) {
                                if (e >= "0" && e <= "7") {
                                    if (!i) {
                                        i = e;
                                        return ++r
                                    } else if (i <= "3" && r <= 2)return ++r; else if (i >= "4" && r <= 1)return ++r
                                }
                                return false
                            });
                            if (r > 0)n = String.fromCharCode(parseInt(n, 8)); else n = m(true)
                        } else if (n == e)break;
                        t += n
                    }
                    return c("string", t)
                });
                var w = L("Unterminated multiline comment", function () {
                    var e = r.regex_allowed;
                    var t = a("*/", true);
                    var n = r.text.substring(r.pos, t);
                    var i = n.split("\n"), s = i.length;
                    r.pos = t + 2;
                    r.line += s - 1;
                    if (s > 1)r.col = i[s - 1].length; else r.col += i[s - 1].length;
                    r.col += 2;
                    var o = r.newline_before = r.newline_before || n.indexOf("\n") >= 0;
                    r.comments_before.push(c("comment2", n, true));
                    r.regex_allowed = e;
                    r.newline_before = o;
                    return A()
                });
                var S = L("Unterminated regular expression", function (e) {
                    var t = false, n, r = false;
                    while (n = s(true))if (t) {
                        e += "\\" + n;
                        t = false
                    } else if (n == "[") {
                        r = true;
                        e += n
                    } else if (n == "]" && r) {
                        r = false;
                        e += n
                    } else if (n == "/" && !r) {
                        break
                    } else if (n == "\\") {
                        t = true
                    } else {
                        e += n
                    }
                    var i = E();
                    return c("regexp", new RegExp(e, i))
                });
                A.context = function (e) {
                    if (e)r = e;
                    return r
                };
                return A
            }

            function Un(e, t) {
                function r(e, t) {
                    return Dn(n.token, e, t)
                }

                function i() {
                    return n.peeked || (n.peeked = n.input())
                }

                function s() {
                    n.prev = n.token;
                    if (n.peeked) {
                        n.token = n.peeked;
                        n.peeked = null
                    } else {
                        n.token = n.input()
                    }
                    n.in_directives = n.in_directives && (n.token.type == "string" || r("punc", ";"));
                    return n.token
                }

                function o() {
                    return n.prev
                }

                function u(e, t, r, i) {
                    var s = n.input.context();
                    _n(e, s.filename, t != null ? t : s.tokline, r != null ? r : s.tokcol, i != null ? i : s.tokpos)
                }

                function f(e, t) {
                    u(t, e.line, e.col)
                }

                function l(e) {
                    if (e == null)e = n.token;
                    f(e, "Unexpected token: " + e.type + " (" + e.value + ")")
                }

                function h(e, t) {
                    if (r(e, t)) {
                        return s()
                    }
                    f(n.token, "Unexpected token " + n.token.type + " «" + n.token.value + "»" + ", expected " + e + " «" + t + "»")
                }

                function p(e) {
                    return h("punc", e)
                }

                function d() {
                    return !t.strict && (n.token.nlb || r("eof") || r("punc", "}"))
                }

                function v() {
                    if (r("punc", ";"))s(); else if (!d())l()
                }

                function m() {
                    p("(");
                    var e = fn(true);
                    p(")");
                    return e
                }

                function g(e) {
                    return function () {
                        var t = n.token;
                        var r = e();
                        var i = o();
                        r.start = t;
                        r.end = i;
                        return r
                    }
                }

                function y() {
                    if (r("operator", "/") || r("operator", "/=")) {
                        n.peeked = null;
                        n.token = n.input(n.token.value.substr(1))
                    }
                }

                function w() {
                    var e = Vt(Ut);
                    if (a(function (t) {
                            return t.name == e.name
                        }, n.labels)) {
                        u("Label " + e.name + " defined twice")
                    }
                    p(":");
                    n.labels.push(e);
                    var t = b();
                    n.labels.pop();
                    if (!(t instanceof j)) {
                        e.references.forEach(function (t) {
                            if (t instanceof nt) {
                                t = t.label.start;
                                u("Continue label `" + e.name + "` refers to non-IterationStatement.", t.line, t.col, t.pos)
                            }
                        })
                    }
                    return new B({body: t, label: e})
                }

                function E(e) {
                    return new O({body: (e = fn(true), v(), e)})
                }

                function S(e) {
                    var t = null, r;
                    if (!d()) {
                        t = Vt(Wt, true)
                    }
                    if (t != null) {
                        r = a(function (e) {
                            return e.name == t.name
                        }, n.labels);
                        if (!r)u("Undefined label " + t.name);
                        t.thedef = r
                    } else if (n.in_loop == 0)u(e.TYPE + " not inside a loop or switch");
                    v();
                    var i = new e({label: t});
                    if (r)r.references.push(i);
                    return i
                }

                function x() {
                    p("(");
                    var e = null;
                    if (!r("punc", ";")) {
                        e = r("keyword", "var") ? (s(), W(true)) : fn(true, true);
                        if (r("operator", "in")) {
                            if (e instanceof ht && e.definitions.length > 1)u("Only one variable declaration allowed in for..in loop");
                            s();
                            return N(e)
                        }
                    }
                    return T(e)
                }

                function T(e) {
                    p(";");
                    var t = r("punc", ";") ? null : fn(true);
                    p(";");
                    var n = r("punc", ")") ? null : fn(true);
                    p(")");
                    return new R({init: e, condition: t, step: n, body: ln(b)})
                }

                function N(e) {
                    var t = e instanceof ht ? e.definitions[0].name : null;
                    var n = fn(true);
                    p(")");
                    return new U({init: e, name: t, object: n, body: ln(b)})
                }

                function k() {
                    var e = m(), t = b(), n = null;
                    if (r("keyword", "else")) {
                        s();
                        n = b()
                    }
                    return new rt({condition: e, body: t, alternative: n})
                }

                function M() {
                    p("{");
                    var e = [];
                    while (!r("punc", "}")) {
                        if (r("eof"))l();
                        e.push(b())
                    }
                    s();
                    return e
                }

                function _() {
                    p("{");
                    var e = [], t = null, i = null, u;
                    while (!r("punc", "}")) {
                        if (r("eof"))l();
                        if (r("keyword", "case")) {
                            if (i)i.end = o();
                            t = [];
                            i = new ut({start: (u = n.token, s(), u), expression: fn(true), body: t});
                            e.push(i);
                            p(":")
                        } else if (r("keyword", "default")) {
                            if (i)i.end = o();
                            t = [];
                            i = new ot({start: (u = n.token, s(), p(":"), u), body: t});
                            e.push(i)
                        } else {
                            if (!t)l();
                            t.push(b())
                        }
                    }
                    if (i)i.end = o();
                    s();
                    return e
                }

                function H() {
                    var e = M(), t = null, i = null;
                    if (r("keyword", "catch")) {
                        var a = n.token;
                        s();
                        p("(");
                        var f = Vt(Rt);
                        p(")");
                        t = new ft({start: a, argname: f, body: M(), end: o()})
                    }
                    if (r("keyword", "finally")) {
                        var a = n.token;
                        s();
                        i = new lt({start: a, body: M(), end: o()})
                    }
                    if (!t && !i)u("Missing catch/finally blocks");
                    return new at({body: e, bcatch: t, bfinally: i})
                }

                function F(e, t) {
                    var i = [];
                    for (; ;) {
                        i.push(new dt({
                            start: n.token,
                            name: Vt(t ? jt : Bt),
                            value: r("operator", "=") ? (s(), fn(false, e)) : null,
                            end: o()
                        }));
                        if (!r("punc", ","))break;
                        s()
                    }
                    return i
                }

                function G() {
                    var e = n.token, t;
                    switch (e.type) {
                        case"name":
                        case"keyword":
                            t = Ht(zt);
                            break;
                        case"num":
                            t = new Jt({start: e, end: e, value: e.value});
                            break;
                        case"string":
                            t = new $t({start: e, end: e, value: e.value});
                            break;
                        case"regexp":
                            t = new Kt({start: e, end: e, value: e.value});
                            break;
                        case"atom":
                            switch (e.value) {
                                case"false":
                                    t = new rn({start: e, end: e});
                                    break;
                                case"true":
                                    t = new sn({start: e, end: e});
                                    break;
                                case"null":
                                    t = new Gt({start: e, end: e});
                                    break
                            }
                            break
                    }
                    s();
                    return t
                }

                function st(e, t, i) {
                    var o = true, u = [];
                    while (!r("punc", e)) {
                        if (o)o = false; else p(",");
                        if (t && r("punc", e))break;
                        if (r("punc", ",") && i) {
                            u.push(new en({start: n.token, end: n.token}))
                        } else {
                            u.push(fn(false))
                        }
                    }
                    s();
                    return u
                }

                function At() {
                    var e = n.token;
                    s();
                    switch (e.type) {
                        case"num":
                        case"string":
                        case"name":
                        case"operator":
                        case"keyword":
                        case"atom":
                            return e.value;
                        default:
                            l()
                    }
                }

                function Pt() {
                    var e = n.token;
                    s();
                    switch (e.type) {
                        case"name":
                        case"operator":
                        case"keyword":
                        case"atom":
                            return e.value;
                        default:
                            l()
                    }
                }

                function Ht(e) {
                    var t = n.token.value;
                    return new (t == "this" ? Xt : e)({name: String(t), start: n.token, end: n.token})
                }

                function Vt(e, t) {
                    if (!r("name")) {
                        if (!t)u("Name expected");
                        return null
                    }
                    var n = Ht(e);
                    s();
                    return n
                }

                function Zt(e, t, n) {
                    if ((t == "++" || t == "--") && !un(n))u("Invalid use of " + t + " operator");
                    return new e({operator: t, expression: n})
                }

                function nn(e) {
                    return tn(Yt(true), 0, e)
                }

                function un(e) {
                    if (!t.strict)return true;
                    if (e instanceof Xt)return false;
                    return e instanceof yt || e instanceof Dt
                }

                function ln(e) {
                    ++n.in_loop;
                    var t = e();
                    --n.in_loop;
                    return t
                }

                t = c(t, {strict: false, filename: null, toplevel: null, expression: false, html5_comments: true});
                var n = {
                    input: typeof e == "string" ? Hn(e, t.filename, t.html5_comments) : e,
                    token: null,
                    prev: null,
                    peeked: null,
                    in_function: 0,
                    in_directives: true,
                    in_loop: 0,
                    labels: []
                };
                n.token = s();
                var b = g(function () {
                    var e;
                    y();
                    switch (n.token.type) {
                        case"string":
                            var t = n.in_directives, a = E();
                            if (t && a.body instanceof $t && !r("punc", ","))return new A({value: a.body.value});
                            return a;
                        case"num":
                        case"regexp":
                        case"operator":
                        case"atom":
                            return E();
                        case"name":
                            return Dn(i(), "punc", ":") ? w() : E();
                        case"punc":
                            switch (n.token.value) {
                                case"{":
                                    return new D({start: n.token, body: M(), end: o()});
                                case"[":
                                case"(":
                                    return E();
                                case";":
                                    s();
                                    return new P;
                                default:
                                    l()
                            }
                            ;
                        case"keyword":
                            switch (e = n.token.value, s(), e) {
                                case"break":
                                    return S(tt);
                                case"continue":
                                    return S(nt);
                                case"debugger":
                                    v();
                                    return new L;
                                case"do":
                                    return new I({body: ln(b), condition: (h("keyword", "while"), e = m(), v(), e)});
                                case"while":
                                    return new q({condition: m(), body: ln(b)});
                                case"for":
                                    return x();
                                case"function":
                                    return C(K);
                                case"if":
                                    return k();
                                case"return":
                                    if (n.in_function == 0)u("'return' outside of function");
                                    return new Y({value: r("punc", ";") ? (s(), null) : d() ? null : (e = fn(true), v(), e)});
                                case"switch":
                                    return new it({expression: m(), body: ln(_)});
                                case"throw":
                                    if (n.token.nlb)u("Illegal newline after 'throw'");
                                    return new Z({value: (e = fn(true), v(), e)});
                                case"try":
                                    return H();
                                case"var":
                                    return e = W(), v(), e;
                                case"const":
                                    return e = V(), v(), e;
                                case"with":
                                    return new z({expression: m(), body: b()});
                                default:
                                    l()
                            }
                    }
                });
                var C = function (e) {
                    var t = e === K;
                    var i = r("name") ? Vt(t ? It : qt) : null;
                    if (t && !i)l();
                    p("(");
                    return new e({
                        name: i, argnames: function (e, t) {
                            while (!r("punc", ")")) {
                                if (e)e = false; else p(",");
                                t.push(Vt(Ft))
                            }
                            s();
                            return t
                        }(true, []), body: function (e, t) {
                            ++n.in_function;
                            n.in_directives = true;
                            n.in_loop = 0;
                            n.labels = [];
                            var r = M();
                            --n.in_function;
                            n.in_loop = e;
                            n.labels = t;
                            return r
                        }(n.in_loop, n.labels)
                    })
                };
                var W = function (e) {
                    return new ht({start: o(), definitions: F(e, false), end: o()})
                };
                var V = function () {
                    return new pt({start: o(), definitions: F(false, true), end: o()})
                };
                var Q = function () {
                    var e = n.token;
                    h("operator", "new");
                    var t = et(false), i;
                    if (r("punc", "(")) {
                        s();
                        i = st(")")
                    } else {
                        i = []
                    }
                    return Qt(new mt({start: e, expression: t, args: i, end: o()}), true)
                };
                var et = function (e) {
                    if (r("operator", "new")) {
                        return Q()
                    }
                    var t = n.token;
                    if (r("punc")) {
                        switch (t.value) {
                            case"(":
                                s();
                                var i = fn(true);
                                i.start = t;
                                i.end = n.token;
                                p(")");
                                return Qt(i, e);
                            case"[":
                                return Qt(ct(), e);
                            case"{":
                                return Qt(Et(), e)
                        }
                        l()
                    }
                    if (r("keyword", "function")) {
                        s();
                        var u = C(J);
                        u.start = t;
                        u.end = o();
                        return Qt(u, e)
                    }
                    if (Rn[n.token.type]) {
                        return Qt(G(), e)
                    }
                    l()
                };
                var ct = g(function () {
                    p("[");
                    return new kt({elements: st("]", !t.strict, true)})
                });
                var Et = g(function () {
                    p("{");
                    var e = true, i = [];
                    while (!r("punc", "}")) {
                        if (e)e = false; else p(",");
                        if (!t.strict && r("punc", "}"))break;
                        var u = n.token;
                        var a = u.type;
                        var f = At();
                        if (a == "name" && !r("punc", ":")) {
                            if (f == "get") {
                                i.push(new _t({start: u, key: G(), value: C($), end: o()}));
                                continue
                            }
                            if (f == "set") {
                                i.push(new Mt({start: u, key: G(), value: C($), end: o()}));
                                continue
                            }
                        }
                        p(":");
                        i.push(new Ot({start: u, key: f, value: fn(false), end: o()}))
                    }
                    s();
                    return new Lt({properties: i})
                });
                var Qt = function (e, t) {
                    var n = e.start;
                    if (r("punc", ".")) {
                        s();
                        return Qt(new bt({start: n, expression: e, property: Pt(), end: o()}), t)
                    }
                    if (r("punc", "[")) {
                        s();
                        var i = fn(true);
                        p("]");
                        return Qt(new wt({start: n, expression: e, property: i, end: o()}), t)
                    }
                    if (t && r("punc", "(")) {
                        s();
                        return Qt(new vt({start: n, expression: e, args: st(")"), end: o()}), true)
                    }
                    return e
                };
                var Yt = function (e) {
                    var t = n.token;
                    if (r("operator") && Bn(t.value)) {
                        s();
                        y();
                        var i = Zt(St, t.value, Yt(e));
                        i.start = t;
                        i.end = o();
                        return i
                    }
                    var u = et(e);
                    while (r("operator") && jn(n.token.value) && !n.token.nlb) {
                        u = Zt(xt, n.token.value, u);
                        u.start = t;
                        u.end = n.token;
                        s()
                    }
                    return u
                };
                var tn = function (e, t, i) {
                    var o = r("operator") ? n.token.value : null;
                    if (o == "in" && i)o = null;
                    var u = o != null ? In[o] : null;
                    if (u != null && u > t) {
                        s();
                        var a = tn(Yt(true), u, i);
                        return tn(new Tt({start: e.start, left: e, operator: o, right: a, end: a.end}), t, i)
                    }
                    return e
                };
                var on = function (e) {
                    var t = n.token;
                    var i = nn(e);
                    if (r("operator", "?")) {
                        s();
                        var u = fn(false);
                        p(":");
                        return new Nt({start: t, condition: i, consequent: u, alternative: fn(false, e), end: o()})
                    }
                    return i
                };
                var an = function (e) {
                    var t = n.token;
                    var i = on(e), a = n.token.value;
                    if (r("operator") && Fn(a)) {
                        if (un(i)) {
                            s();
                            return new Ct({start: t, left: i, operator: a, right: an(e), end: o()})
                        }
                        u("Invalid assignment")
                    }
                    return i
                };
                var fn = function (e, t) {
                    var o = n.token;
                    var u = an(t);
                    if (e && r("punc", ",")) {
                        s();
                        return new gt({start: o, car: u, cdr: fn(true, t), end: i()})
                    }
                    return u
                };
                if (t.expression) {
                    return fn(true)
                }
                return function () {
                    var e = n.token;
                    var i = [];
                    while (!r("eof"))i.push(b());
                    var s = o();
                    var u = t.toplevel;
                    if (u) {
                        u.body = u.body.concat(i);
                        u.end = s
                    } else {
                        u = new X({start: e, body: i, end: s})
                    }
                    return u
                }()
            }

            function zn(e, t) {
                on.call(this);
                this.before = e;
                this.after = t
            }

            function Wn(e, t, n) {
                this.name = n.name;
                this.orig = [n];
                this.scope = e;
                this.references = [];
                this.global = false;
                this.mangled_name = null;
                this.undeclared = false;
                this.constant = false;
                this.index = t
            }

            function Vn(e) {
                function o(e, t) {
                    return e.replace(/[\u0080-\uffff]/g, function (e) {
                        var n = e.charCodeAt(0).toString(16);
                        if (n.length <= 2 && !t) {
                            while (n.length < 2)n = "0" + n;
                            return "\\x" + n
                        } else {
                            while (n.length < 4)n = "0" + n;
                            return "\\u" + n
                        }
                    })
                }

                function u(t) {
                    var n = 0, r = 0;
                    t = t.replace(/[\\\b\f\n\r\t\x22\x27\u2028\u2029\0]/g, function (e) {
                        switch (e) {
                            case"\\":
                                return "\\\\";
                            case"\b":
                                return "\\b";
                            case"\f":
                                return "\\f";
                            case"\n":
                                return "\\n";
                            case"\r":
                                return "\\r";
                            case"\u2028":
                                return "\\u2028";
                            case"\u2029":
                                return "\\u2029";
                            case'"':
                                ++n;
                                return '"';
                            case"'":
                                ++r;
                                return "'";
                            case"\0":
                                return "\\x00"
                        }
                        return e
                    });
                    if (e.ascii_only)t = o(t);
                    if (n > r)return "'" + t.replace(/\x27/g, "\\'") + "'"; else return '"' + t.replace(/\x22/g, '\\"') + '"'
                }

                function a(t) {
                    var n = u(t);
                    if (e.inline_script)n = n.replace(/<\x2fscript([>\/\t\n\f\r ])/gi, "<\\/script$1");
                    return n
                }

                function l(t) {
                    t = t.toString();
                    if (e.ascii_only)t = o(t, true);
                    return t
                }

                function h(n) {
                    return f(" ", e.indent_start + t - n * e.indent_level)
                }

                function g() {
                    return m.charAt(m.length - 1)
                }

                function y() {
                    if (e.max_line_len && n > e.max_line_len)w("\n")
                }

                function w(t) {
                    t = String(t);
                    var o = t.charAt(0);
                    if (v) {
                        if ((!o || ";}".indexOf(o) < 0) && !/[;]$/.test(m)) {
                            if (e.semicolons || b(o)) {
                                s += ";";
                                n++;
                                i++
                            } else {
                                s += "\n";
                                i++;
                                r++;
                                n = 0
                            }
                            if (!e.beautify)d = false
                        }
                        v = false;
                        y()
                    }
                    if (!e.beautify && e.preserve_line && j[j.length - 1]) {
                        var u = j[j.length - 1].start.line;
                        while (r < u) {
                            s += "\n";
                            i++;
                            r++;
                            n = 0;
                            d = false
                        }
                    }
                    if (d) {
                        var a = g();
                        if (Ln(a) && (Ln(o) || o == "\\") || /^[\+\-\/]$/.test(o) && o == a) {
                            s += " ";
                            n++;
                            i++
                        }
                        d = false
                    }
                    var f = t.split(/\r?\n/), l = f.length - 1;
                    r += l;
                    if (l == 0) {
                        n += f[l].length
                    } else {
                        n = f[l].length
                    }
                    i += t.length;
                    m = t;
                    s += t
                }

                function L() {
                    v = false;
                    w(";")
                }

                function A() {
                    return t + e.indent_level
                }

                function O(e) {
                    var t;
                    w("{");
                    N();
                    T(A(), function () {
                        t = e()
                    });
                    x();
                    w("}");
                    return t
                }

                function M(e) {
                    w("(");
                    var t = e();
                    w(")");
                    return t
                }

                function _(e) {
                    w("[");
                    var t = e();
                    w("]");
                    return t
                }

                function D() {
                    w(",");
                    S()
                }

                function P() {
                    w(":");
                    if (e.space_colon)S()
                }

                function B() {
                    return s
                }

                e = c(e, {
                    indent_start: 0,
                    indent_level: 4,
                    quote_keys: false,
                    space_colon: true,
                    ascii_only: false,
                    unescape_regexps: false,
                    inline_script: false,
                    width: 80,
                    max_line_len: 32e3,
                    beautify: false,
                    source_map: null,
                    bracketize: false,
                    semicolons: true,
                    comments: false,
                    preserve_line: false,
                    screw_ie8: false,
                    preamble: null
                }, true);
                var t = 0;
                var n = 0;
                var r = 1;
                var i = 0;
                var s = "";
                var d = false;
                var v = false;
                var m = null;
                var b = E("( [ + * / - , .");
                var S = e.beautify ? function () {
                    w(" ")
                } : function () {
                    d = true
                };
                var x = e.beautify ? function (t) {
                    if (e.beautify) {
                        w(h(t ? .5 : 0))
                    }
                } : p;
                var T = e.beautify ? function (e, n) {
                    if (e === true)e = A();
                    var r = t;
                    t = e;
                    var i = n();
                    t = r;
                    return i
                } : function (e, t) {
                    return t()
                };
                var N = e.beautify ? function () {
                    w("\n")
                } : p;
                var k = e.beautify ? function () {
                    w(";")
                } : function () {
                    v = true
                };
                var H = e.source_map ? function (t, i) {
                    try {
                        if (t)e.source_map.add(t.file || "?", r, n, t.line, t.col, !i && t.type == "name" ? t.value : i)
                    } catch (s) {
                        C.warn("Couldn't figure out mapping for {file}:{line},{col} → {cline},{ccol} [{name}]", {
                            file: t.file,
                            line: t.line,
                            col: t.col,
                            cline: r,
                            ccol: n,
                            name: i || ""
                        })
                    }
                } : p;
                if (e.preamble) {
                    w(e.preamble.replace(/\r\n?|[\n\u2028\u2029]|\s*$/g, "\n"))
                }
                var j = [];
                return {
                    get: B,
                    toString: B,
                    indent: x,
                    indentation: function () {
                        return t
                    },
                    current_width: function () {
                        return n - t
                    },
                    should_break: function () {
                        return e.width && this.current_width() >= e.width
                    },
                    newline: N,
                    print: w,
                    space: S,
                    comma: D,
                    colon: P,
                    last: function () {
                        return m
                    },
                    semicolon: k,
                    force_semicolon: L,
                    to_ascii: o,
                    print_name: function (e) {
                        w(l(e))
                    },
                    print_string: function (e) {
                        w(a(e))
                    },
                    next_indent: A,
                    with_indent: T,
                    with_block: O,
                    with_parens: M,
                    with_square: _,
                    add_mapping: H,
                    option: function (t) {
                        return e[t]
                    },
                    line: function () {
                        return r
                    },
                    col: function () {
                        return n
                    },
                    pos: function () {
                        return i
                    },
                    push_node: function (e) {
                        j.push(e)
                    },
                    pop_node: function () {
                        return j.pop()
                    },
                    stack: function () {
                        return j
                    },
                    parent: function (e) {
                        return j[j.length - 2 - (e || 0)]
                    }
                }
            }

            function $n(e, t) {
                if (!(this instanceof $n))return new $n(e, t);
                zn.call(this, this.before, this.after);
                this.options = c(e, {
                    sequences: !t,
                    properties: !t,
                    dead_code: !t,
                    drop_debugger: !t,
                    unsafe: false,
                    unsafe_comps: false,
                    conditionals: !t,
                    comparisons: !t,
                    evaluate: !t,
                    booleans: !t,
                    loops: !t,
                    unused: !t,
                    hoist_funs: !t,
                    keep_fargs: false,
                    hoist_vars: false,
                    if_return: !t,
                    join_vars: !t,
                    cascade: !t,
                    side_effects: !t,
                    pure_getters: false,
                    pure_funcs: null,
                    negate_iife: !t,
                    screw_ie8: false,
                    drop_console: false,
                    angular: false,
                    warnings: true,
                    global_defs: {}
                }, true)
            }

            function Jn(e) {
                function i(t, i, s, o, u, a) {
                    if (r) {
                        var f = r.originalPositionFor({line: o, column: u});
                        if (f.source === null) {
                            return
                        }
                        t = f.source;
                        o = f.line;
                        u = f.column;
                        a = f.name
                    }
                    n.addMapping({
                        generated: {line: i + e.dest_line_diff, column: s},
                        original: {line: o + e.orig_line_diff, column: u},
                        source: t,
                        name: a
                    })
                }

                e = c(e, {file: null, root: null, orig: null, orig_line_diff: 0, dest_line_diff: 0});
                var n = new t.SourceMapGenerator({file: e.file, sourceRoot: e.root});
                var r = e.orig && new t.SourceMapConsumer(e.orig);
                return {
                    add: i, get: function () {
                        return n
                    }, toString: function () {
                        return n.toString()
                    }
                }
            }

            l.prototype = Object.create(Error.prototype);
            l.prototype.constructor = l;
            l.croak = function (e, t) {
                throw new l(e, t)
            };
            var d = function () {
                function e(e, s, o) {
                    function l() {
                        var l = s(e[f], f);
                        var c = l instanceof i;
                        if (c)l = l.v;
                        if (l instanceof n) {
                            l = l.v;
                            if (l instanceof r) {
                                a.push.apply(a, o ? l.v.slice().reverse() : l.v)
                            } else {
                                a.push(l)
                            }
                        } else if (l !== t) {
                            if (l instanceof r) {
                                u.push.apply(u, o ? l.v.slice().reverse() : l.v)
                            } else {
                                u.push(l)
                            }
                        }
                        return c
                    }

                    var u = [], a = [], f;
                    if (e instanceof Array) {
                        if (o) {
                            for (f = e.length; --f >= 0;)if (l())break;
                            u.reverse();
                            a.reverse()
                        } else {
                            for (f = 0; f < e.length; ++f)if (l())break
                        }
                    } else {
                        for (f in e)if (e.hasOwnProperty(f))if (l())break
                    }
                    return a.concat(u)
                }

                function n(e) {
                    this.v = e
                }

                function r(e) {
                    this.v = e
                }

                function i(e) {
                    this.v = e
                }

                e.at_top = function (e) {
                    return new n(e)
                };
                e.splice = function (e) {
                    return new r(e)
                };
                e.last = function (e) {
                    return new i(e)
                };
                var t = e.skip = {};
                return e
            }();
            x.prototype = {
                set: function (e, t) {
                    if (!this.has(e))++this._size;
                    this._values["$" + e] = t;
                    return this
                }, add: function (e, t) {
                    if (this.has(e)) {
                        this.get(e).push(t)
                    } else {
                        this.set(e, [t])
                    }
                    return this
                }, get: function (e) {
                    return this._values["$" + e]
                }, del: function (e) {
                    if (this.has(e)) {
                        --this._size;
                        delete this._values["$" + e]
                    }
                    return this
                }, has: function (e) {
                    return "$" + e in this._values
                }, each: function (e) {
                    for (var t in this._values)e(this._values[t], t.substr(1))
                }, size: function () {
                    return this._size
                }, map: function (e) {
                    var t = [];
                    for (var n in this._values)t.push(e(this._values[n], n.substr(1)));
                    return t
                }
            };
            "use strict";
            var N = T("Token", "type value line col pos endpos nlb comments_before file", {}, null);
            var C = T("Node", "start end", {
                clone: function () {
                    return new this.CTOR(this)
                },
                $documentation: "Base class of all AST nodes",
                $propdoc: {
                    start: "[AST_Token] The first token of this node",
                    end: "[AST_Token] The last token of this node"
                },
                _walk: function (e) {
                    return e._visit(this)
                },
                walk: function (e) {
                    return this._walk(e)
                }
            }, null);
            C.warn_function = null;
            C.warn = function (e, t) {
                if (C.warn_function)C.warn_function(m(e, t))
            };
            var k = T("Statement", null, {$documentation: "Base class of all statements"});
            var L = T("Debugger", null, {$documentation: "Represents a debugger statement"}, k);
            var A = T("Directive", "value scope", {
                $documentation: 'Represents a directive, like "use strict";',
                $propdoc: {
                    value: "[string] The value of this directive as a plain string (it's not an AST_String!)",
                    scope: "[AST_Scope/S] The scope that this directive affects"
                }
            }, k);
            var O = T("SimpleStatement", "body", {
                $documentation: "A statement consisting of an expression, i.e. a = 1 + 2",
                $propdoc: {body: "[AST_Node] an expression node (should not be instanceof AST_Statement)"},
                _walk: function (e) {
                    return e._visit(this, function () {
                        this.body._walk(e)
                    })
                }
            }, k);
            var _ = T("Block", "body", {
                $documentation: "A body of statements (usually bracketed)",
                $propdoc: {body: "[AST_Statement*] an array of statements"},
                _walk: function (e) {
                    return e._visit(this, function () {
                        M(this, e)
                    })
                }
            }, k);
            var D = T("BlockStatement", null, {$documentation: "A block statement"}, _);
            var P = T("EmptyStatement", null, {
                $documentation: "The empty statement (empty block or simply a semicolon)",
                _walk: function (e) {
                    return e._visit(this)
                }
            }, k);
            var H = T("StatementWithBody", "body", {
                $documentation: "Base class for all statements that contain one nested body: `For`, `ForIn`, `Do`, `While`, `With`",
                $propdoc: {body: "[AST_Statement] the body; this should always be present, even if it's an AST_EmptyStatement"},
                _walk: function (e) {
                    return e._visit(this, function () {
                        this.body._walk(e)
                    })
                }
            }, k);
            var B = T("LabeledStatement", "label", {
                $documentation: "Statement with a label",
                $propdoc: {label: "[AST_Label] a label definition"},
                _walk: function (e) {
                    return e._visit(this, function () {
                        this.label._walk(e);
                        this.body._walk(e)
                    })
                }
            }, H);
            var j = T("IterationStatement", null, {$documentation: "Internal class.  All loops inherit from it."}, H);
            var F = T("DWLoop", "condition", {
                $documentation: "Base class for do/while statements",
                $propdoc: {condition: "[AST_Node] the loop condition.  Should not be instanceof AST_Statement"},
                _walk: function (e) {
                    return e._visit(this, function () {
                        this.condition._walk(e);
                        this.body._walk(e)
                    })
                }
            }, j);
            var I = T("Do", null, {$documentation: "A `do` statement"}, F);
            var q = T("While", null, {$documentation: "A `while` statement"}, F);
            var R = T("For", "init condition step", {
                $documentation: "A `for` statement",
                $propdoc: {
                    init: "[AST_Node?] the `for` initialization code, or null if empty",
                    condition: "[AST_Node?] the `for` termination clause, or null if empty",
                    step: "[AST_Node?] the `for` update clause, or null if empty"
                },
                _walk: function (e) {
                    return e._visit(this, function () {
                        if (this.init)this.init._walk(e);
                        if (this.condition)this.condition._walk(e);
                        if (this.step)this.step._walk(e);
                        this.body._walk(e)
                    })
                }
            }, j);
            var U = T("ForIn", "init name object", {
                $documentation: "A `for ... in` statement",
                $propdoc: {
                    init: "[AST_Node] the `for/in` initialization code",
                    name: "[AST_SymbolRef?] the loop variable, only if `init` is AST_Var",
                    object: "[AST_Node] the object that we're looping through"
                },
                _walk: function (e) {
                    return e._visit(this, function () {
                        this.init._walk(e);
                        this.object._walk(e);
                        this.body._walk(e)
                    })
                }
            }, j);
            var z = T("With", "expression", {
                $documentation: "A `with` statement",
                $propdoc: {expression: "[AST_Node] the `with` expression"},
                _walk: function (e) {
                    return e._visit(this, function () {
                        this.expression._walk(e);
                        this.body._walk(e)
                    })
                }
            }, H);
            var W = T("Scope", "directives variables functions uses_with uses_eval parent_scope enclosed cname", {
                $documentation: "Base class for all statements introducing a lexical scope",
                $propdoc: {
                    directives: "[string*/S] an array of directives declared in this scope",
                    variables: "[Object/S] a map of name -> SymbolDef for all variables/functions defined in this scope",
                    functions: "[Object/S] like `variables`, but only lists function declarations",
                    uses_with: "[boolean/S] tells whether this scope uses the `with` statement",
                    uses_eval: "[boolean/S] tells whether this scope contains a direct call to the global `eval`",
                    parent_scope: "[AST_Scope?/S] link to the parent scope",
                    enclosed: "[SymbolDef*/S] a list of all symbol definitions that are accessed from this scope or any subscopes",
                    cname: "[integer/S] current index for mangling variables (used internally by the mangler)"
                }
            }, _);
            var X = T("Toplevel", "globals", {
                $documentation: "The toplevel scope",
                $propdoc: {globals: "[Object/S] a map of name -> SymbolDef for all undeclared names"},
                wrap_enclose: function (e) {
                    var t = this;
                    var n = [];
                    var r = [];
                    e.forEach(function (e) {
                        var t = e.split(":");
                        n.push(t[0]);
                        r.push(t[1])
                    });
                    var i = "(function(" + r.join(",") + "){ '$ORIG'; })(" + n.join(",") + ")";
                    i = Un(i);
                    i = i.transform(new zn(function (n) {
                        if (n instanceof A && n.value == "$ORIG") {
                            return d.splice(t.body)
                        }
                    }));
                    return i
                },
                wrap_commonjs: function (e, t) {
                    var n = this;
                    var r = [];
                    if (t) {
                        n.figure_out_scope();
                        n.walk(new on(function (e) {
                            if (e instanceof Ht && e.definition().global) {
                                if (!a(function (t) {
                                        return t.name == e.name
                                    }, r))r.push(e)
                            }
                        }))
                    }
                    var i = "(function(exports, global){ global['" + e + "'] = exports; '$ORIG'; '$EXPORTS'; }({}, (function(){return this}())))";
                    i = Un(i);
                    i = i.transform(new zn(function (t) {
                        if (t instanceof O) {
                            t = t.body;
                            if (t instanceof $t)switch (t.getValue()) {
                                case"$ORIG":
                                    return d.splice(n.body);
                                case"$EXPORTS":
                                    var i = [];
                                    r.forEach(function (e) {
                                        i.push(new O({
                                            body: new Ct({
                                                left: new wt({
                                                    expression: new zt({name: "exports"}),
                                                    property: new $t({value: e.name})
                                                }), operator: "=", right: new zt(e)
                                            })
                                        }))
                                    });
                                    return d.splice(i)
                            }
                        }
                    }));
                    return i
                }
            }, W);
            var V = T("Lambda", "name argnames uses_arguments", {
                $documentation: "Base class for functions",
                $propdoc: {
                    name: "[AST_SymbolDeclaration?] the name of this function",
                    argnames: "[AST_SymbolFunarg*] array of function arguments",
                    uses_arguments: "[boolean/S] tells whether this function accesses the arguments array"
                },
                _walk: function (e) {
                    return e._visit(this, function () {
                        if (this.name)this.name._walk(e);
                        this.argnames.forEach(function (t) {
                            t._walk(e)
                        });
                        M(this, e)
                    })
                }
            }, W);
            var $ = T("Accessor", null, {$documentation: "A setter/getter function.  The `name` property is always null."}, V);
            var J = T("Function", null, {$documentation: "A function expression"}, V);
            var K = T("Defun", null, {$documentation: "A function definition"}, V);
            var Q = T("Jump", null, {$documentation: "Base class for “jumps” (for now that's `return`, `throw`, `break` and `continue`)"}, k);
            var G = T("Exit", "value", {
                $documentation: "Base class for “exits” (`return` and `throw`)",
                $propdoc: {value: "[AST_Node?] the value returned or thrown by this statement; could be null for AST_Return"},
                _walk: function (e) {
                    return e._visit(this, this.value && function () {
                            this.value._walk(e)
                        })
                }
            }, Q);
            var Y = T("Return", null, {$documentation: "A `return` statement"}, G);
            var Z = T("Throw", null, {$documentation: "A `throw` statement"}, G);
            var et = T("LoopControl", "label", {
                $documentation: "Base class for loop control statements (`break` and `continue`)",
                $propdoc: {label: "[AST_LabelRef?] the label, or null if none"},
                _walk: function (e) {
                    return e._visit(this, this.label && function () {
                            this.label._walk(e)
                        })
                }
            }, Q);
            var tt = T("Break", null, {$documentation: "A `break` statement"}, et);
            var nt = T("Continue", null, {$documentation: "A `continue` statement"}, et);
            var rt = T("If", "condition alternative", {
                $documentation: "A `if` statement",
                $propdoc: {
                    condition: "[AST_Node] the `if` condition",
                    alternative: "[AST_Statement?] the `else` part, or null if not present"
                },
                _walk: function (e) {
                    return e._visit(this, function () {
                        this.condition._walk(e);
                        this.body._walk(e);
                        if (this.alternative)this.alternative._walk(e)
                    })
                }
            }, H);
            var it = T("Switch", "expression", {
                $documentation: "A `switch` statement",
                $propdoc: {expression: "[AST_Node] the `switch` “discriminant”"},
                _walk: function (e) {
                    return e._visit(this, function () {
                        this.expression._walk(e);
                        M(this, e)
                    })
                }
            }, _);
            var st = T("SwitchBranch", null, {$documentation: "Base class for `switch` branches"}, _);
            var ot = T("Default", null, {$documentation: "A `default` switch branch"}, st);
            var ut = T("Case", "expression", {
                $documentation: "A `case` switch branch",
                $propdoc: {expression: "[AST_Node] the `case` expression"},
                _walk: function (e) {
                    return e._visit(this, function () {
                        this.expression._walk(e);
                        M(this, e)
                    })
                }
            }, st);
            var at = T("Try", "bcatch bfinally", {
                $documentation: "A `try` statement",
                $propdoc: {
                    bcatch: "[AST_Catch?] the catch block, or null if not present",
                    bfinally: "[AST_Finally?] the finally block, or null if not present"
                },
                _walk: function (e) {
                    return e._visit(this, function () {
                        M(this, e);
                        if (this.bcatch)this.bcatch._walk(e);
                        if (this.bfinally)this.bfinally._walk(e)
                    })
                }
            }, _);
            var ft = T("Catch", "argname", {
                $documentation: "A `catch` node; only makes sense as part of a `try` statement",
                $propdoc: {argname: "[AST_SymbolCatch] symbol for the exception"},
                _walk: function (e) {
                    return e._visit(this, function () {
                        this.argname._walk(e);
                        M(this, e)
                    })
                }
            }, _);
            var lt = T("Finally", null, {$documentation: "A `finally` node; only makes sense as part of a `try` statement"}, _);
            var ct = T("Definitions", "definitions", {
                $documentation: "Base class for `var` or `const` nodes (variable declarations/initializations)",
                $propdoc: {definitions: "[AST_VarDef*] array of variable definitions"},
                _walk: function (e) {
                    return e._visit(this, function () {
                        this.definitions.forEach(function (t) {
                            t._walk(e)
                        })
                    })
                }
            }, k);
            var ht = T("Var", null, {$documentation: "A `var` statement"}, ct);
            var pt = T("Const", null, {$documentation: "A `const` statement"}, ct);
            var dt = T("VarDef", "name value", {
                $documentation: "A variable declaration; only appears in a AST_Definitions node",
                $propdoc: {
                    name: "[AST_SymbolVar|AST_SymbolConst] name of the variable",
                    value: "[AST_Node?] initializer, or null of there's no initializer"
                },
                _walk: function (e) {
                    return e._visit(this, function () {
                        this.name._walk(e);
                        if (this.value)this.value._walk(e)
                    })
                }
            });
            var vt = T("Call", "expression args", {
                $documentation: "A function call expression",
                $propdoc: {
                    expression: "[AST_Node] expression to invoke as function",
                    args: "[AST_Node*] array of arguments"
                },
                _walk: function (e) {
                    return e._visit(this, function () {
                        this.expression._walk(e);
                        this.args.forEach(function (t) {
                            t._walk(e)
                        })
                    })
                }
            });
            var mt = T("New", null, {$documentation: "An object instantiation.  Derives from a function call since it has exactly the same properties"}, vt);
            var gt = T("Seq", "car cdr", {
                $documentation: "A sequence expression (two comma-separated expressions)",
                $propdoc: {car: "[AST_Node] first element in sequence", cdr: "[AST_Node] second element in sequence"},
                $cons: function (e, t) {
                    var n = new gt(e);
                    n.car = e;
                    n.cdr = t;
                    return n
                },
                $from_array: function (e) {
                    if (e.length == 0)return null;
                    if (e.length == 1)return e[0].clone();
                    var t = null;
                    for (var n = e.length; --n >= 0;) {
                        t = gt.cons(e[n], t)
                    }
                    var r = t;
                    while (r) {
                        if (r.cdr && !r.cdr.cdr) {
                            r.cdr = r.cdr.car;
                            break
                        }
                        r = r.cdr
                    }
                    return t
                },
                to_array: function () {
                    var e = this, t = [];
                    while (e) {
                        t.push(e.car);
                        if (e.cdr && !(e.cdr instanceof gt)) {
                            t.push(e.cdr);
                            break
                        }
                        e = e.cdr
                    }
                    return t
                },
                add: function (e) {
                    var t = this;
                    while (t) {
                        if (!(t.cdr instanceof gt)) {
                            var n = gt.cons(t.cdr, e);
                            return t.cdr = n
                        }
                        t = t.cdr
                    }
                },
                _walk: function (e) {
                    return e._visit(this, function () {
                        this.car._walk(e);
                        if (this.cdr)this.cdr._walk(e)
                    })
                }
            });
            var yt = T("PropAccess", "expression property", {
                $documentation: 'Base class for property access expressions, i.e. `a.foo` or `a["foo"]`',
                $propdoc: {
                    expression: "[AST_Node] the “container” expression",
                    property: "[AST_Node|string] the property to access.  For AST_Dot this is always a plain string, while for AST_Sub it's an arbitrary AST_Node"
                }
            });
            var bt = T("Dot", null, {
                $documentation: "A dotted property access expression", _walk: function (e) {
                    return e._visit(this, function () {
                        this.expression._walk(e)
                    })
                }
            }, yt);
            var wt = T("Sub", null, {
                $documentation: 'Index-style property access, i.e. `a["foo"]`',
                _walk: function (e) {
                    return e._visit(this, function () {
                        this.expression._walk(e);
                        this.property._walk(e)
                    })
                }
            }, yt);
            var Et = T("Unary", "operator expression", {
                $documentation: "Base class for unary expressions",
                $propdoc: {
                    operator: "[string] the operator",
                    expression: "[AST_Node] expression that this unary operator applies to"
                },
                _walk: function (e) {
                    return e._visit(this, function () {
                        this.expression._walk(e)
                    })
                }
            });
            var St = T("UnaryPrefix", null, {$documentation: "Unary prefix expression, i.e. `typeof i` or `++i`"}, Et);
            var xt = T("UnaryPostfix", null, {$documentation: "Unary postfix expression, i.e. `i++`"}, Et);
            var Tt = T("Binary", "left operator right", {
                $documentation: "Binary expression, i.e. `a + b`",
                $propdoc: {
                    left: "[AST_Node] left-hand side expression",
                    operator: "[string] the operator",
                    right: "[AST_Node] right-hand side expression"
                },
                _walk: function (e) {
                    return e._visit(this, function () {
                        this.left._walk(e);
                        this.right._walk(e)
                    })
                }
            });
            var Nt = T("Conditional", "condition consequent alternative", {
                $documentation: "Conditional expression using the ternary operator, i.e. `a ? b : c`",
                $propdoc: {condition: "[AST_Node]", consequent: "[AST_Node]", alternative: "[AST_Node]"},
                _walk: function (e) {
                    return e._visit(this, function () {
                        this.condition._walk(e);
                        this.consequent._walk(e);
                        this.alternative._walk(e)
                    })
                }
            });
            var Ct = T("Assign", null, {$documentation: "An assignment expression — `a = b + 5`"}, Tt);
            var kt = T("Array", "elements", {
                $documentation: "An array literal",
                $propdoc: {elements: "[AST_Node*] array of elements"},
                _walk: function (e) {
                    return e._visit(this, function () {
                        this.elements.forEach(function (t) {
                            t._walk(e)
                        })
                    })
                }
            });
            var Lt = T("Object", "properties", {
                $documentation: "An object literal",
                $propdoc: {properties: "[AST_ObjectProperty*] array of properties"},
                _walk: function (e) {
                    return e._visit(this, function () {
                        this.properties.forEach(function (t) {
                            t._walk(e)
                        })
                    })
                }
            });
            var At = T("ObjectProperty", "key value", {
                $documentation: "Base class for literal object properties",
                $propdoc: {
                    key: "[string] the property name converted to a string for ObjectKeyVal.  For setters and getters this is an arbitrary AST_Node.",
                    value: "[AST_Node] property value.  For setters and getters this is an AST_Function."
                },
                _walk: function (e) {
                    return e._visit(this, function () {
                        this.value._walk(e)
                    })
                }
            });
            var Ot = T("ObjectKeyVal", null, {$documentation: "A key: value object property"}, At);
            var Mt = T("ObjectSetter", null, {$documentation: "An object setter property"}, At);
            var _t = T("ObjectGetter", null, {$documentation: "An object getter property"}, At);
            var Dt = T("Symbol", "scope name thedef", {
                $propdoc: {
                    name: "[string] name of this symbol",
                    scope: "[AST_Scope/S] the current scope (not necessarily the definition scope)",
                    thedef: "[SymbolDef/S] the definition of this symbol"
                }, $documentation: "Base class for all symbols"
            });
            var Pt = T("SymbolAccessor", null, {$documentation: "The name of a property accessor (setter/getter function)"}, Dt);
            var Ht = T("SymbolDeclaration", "init", {
                $documentation: "A declaration symbol (symbol in var/const, function name or argument, symbol in catch)",
                $propdoc: {init: "[AST_Node*/S] array of initializers for this declaration."}
            }, Dt);
            var Bt = T("SymbolVar", null, {$documentation: "Symbol defining a variable"}, Ht);
            var jt = T("SymbolConst", null, {$documentation: "A constant declaration"}, Ht);
            var Ft = T("SymbolFunarg", null, {$documentation: "Symbol naming a function argument"}, Bt);
            var It = T("SymbolDefun", null, {$documentation: "Symbol defining a function"}, Ht);
            var qt = T("SymbolLambda", null, {$documentation: "Symbol naming a function expression"}, Ht);
            var Rt = T("SymbolCatch", null, {$documentation: "Symbol naming the exception in catch"}, Ht);
            var Ut = T("Label", "references", {
                $documentation: "Symbol naming a label (declaration)",
                $propdoc: {references: "[AST_LoopControl*] a list of nodes referring to this label"},
                initialize: function () {
                    this.references = [];
                    this.thedef = this
                }
            }, Dt);
            var zt = T("SymbolRef", null, {$documentation: "Reference to some symbol (not definition/declaration)"}, Dt);
            var Wt = T("LabelRef", null, {$documentation: "Reference to a label symbol"}, Dt);
            var Xt = T("This", null, {$documentation: "The `this` symbol"}, Dt);
            var Vt = T("Constant", null, {
                $documentation: "Base class for all constants", getValue: function () {
                    return this.value
                }
            });
            var $t = T("String", "value", {
                $documentation: "A string literal",
                $propdoc: {value: "[string] the contents of this string"}
            }, Vt);
            var Jt = T("Number", "value", {
                $documentation: "A number literal",
                $propdoc: {value: "[number] the numeric value"}
            }, Vt);
            var Kt = T("RegExp", "value", {
                $documentation: "A regexp literal",
                $propdoc: {value: "[RegExp] the actual regexp"}
            }, Vt);
            var Qt = T("Atom", null, {$documentation: "Base class for atoms"}, Vt);
            var Gt = T("Null", null, {$documentation: "The `null` atom", value: null}, Qt);
            var Yt = T("NaN", null, {$documentation: "The impossible value", value: 0 / 0}, Qt);
            var Zt = T("Undefined", null, {
                $documentation: "The `undefined` value", value: function () {
                }()
            }, Qt);
            var en = T("Hole", null, {
                $documentation: "A hole in an array", value: function () {
                }()
            }, Qt);
            var tn = T("Infinity", null, {$documentation: "The `Infinity` value", value: 1 / 0}, Qt);
            var nn = T("Boolean", null, {$documentation: "Base class for booleans"}, Qt);
            var rn = T("False", null, {$documentation: "The `false` atom", value: false}, nn);
            var sn = T("True", null, {$documentation: "The `true` atom", value: true}, nn);
            on.prototype = {
                _visit: function (e, t) {
                    this.stack.push(e);
                    var n = this.visit(e, t ? function () {
                        t.call(e)
                    } : p);
                    if (!n && t) {
                        t.call(e)
                    }
                    this.stack.pop();
                    return n
                }, parent: function (e) {
                    return this.stack[this.stack.length - 2 - (e || 0)]
                }, push: function (e) {
                    this.stack.push(e)
                }, pop: function () {
                    return this.stack.pop()
                }, self: function () {
                    return this.stack[this.stack.length - 1]
                }, find_parent: function (e) {
                    var t = this.stack;
                    for (var n = t.length; --n >= 0;) {
                        var r = t[n];
                        if (r instanceof e)return r
                    }
                }, has_directive: function (e) {
                    return this.find_parent(W).has_directive(e)
                }, in_boolean_context: function () {
                    var e = this.stack;
                    var t = e.length, n = e[--t];
                    while (t > 0) {
                        var r = e[--t];
                        if (r instanceof rt && r.condition === n || r instanceof Nt && r.condition === n || r instanceof F && r.condition === n || r instanceof R && r.condition === n || r instanceof St && r.operator == "!" && r.expression === n) {
                            return true
                        }
                        if (!(r instanceof Tt && (r.operator == "&&" || r.operator == "||")))return false;
                        n = r
                    }
                }, loopcontrol_target: function (e) {
                    var t = this.stack;
                    if (e)for (var n = t.length; --n >= 0;) {
                        var r = t[n];
                        if (r instanceof B && r.label.name == e.name) {
                            return r.body
                        }
                    } else for (var n = t.length; --n >= 0;) {
                        var r = t[n];
                        if (r instanceof it || r instanceof j)return r
                    }
                }
            };
            "use strict";
            var un = "break case catch const continue debugger default delete do else finally for function if in instanceof new return switch throw try typeof var void while with";
            var an = "false null true";
            var fn = "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized this throws transient volatile yield" + " " + an + " " + un;
            var ln = "return new delete throw else case";
            un = E(un);
            fn = E(fn);
            ln = E(ln);
            an = E(an);
            var cn = E(o("+-*&%=<>!?|~^"));
            var hn = /^0x[0-9a-f]+$/i;
            var pn = /^0[0-7]+$/;
            var dn = /^\d*\.?\d*(?:e[+-]?\d*(?:\d\.?|\.?\d)\d*)?$/i;
            var vn = E(["in", "instanceof", "typeof", "new", "void", "delete", "++", "--", "+", "-", "!", "~", "&", "|", "^", "*", "/", "%", ">>", "<<", ">>>", "<", ">", "<=", ">=", "==", "===", "!=", "!==", "?", "=", "+=", "-=", "/=", "*=", "%=", ">>=", "<<=", ">>>=", "|=", "^=", "&=", "&&", "||"]);
            var mn = E(o("  \n\r	\f​᠎             　"));
            var gn = E(o("[{(,.;:"));
            var yn = E(o("[]{}(),;:"));
            var bn = E(o("gmsiy"));
            var wn = {
                letter: new RegExp("[\\u0041-\\u005A\\u0061-\\u007A\\u00AA\\u00B5\\u00BA\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u0523\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0621-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE\\u06EF\\u06FA-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u07F4\\u07F5\\u07FA\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0971\\u0972\\u097B-\\u097F\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C33\\u0C35-\\u0C39\\u0C3D\\u0C58\\u0C59\\u0C60\\u0C61\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D28\\u0D2A-\\u0D39\\u0D3D\\u0D60\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E46\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EDC\\u0EDD\\u0F00\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8B\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10A0-\\u10C5\\u10D0-\\u10FA\\u10FC\\u1100-\\u1159\\u115F-\\u11A2\\u11A8-\\u11F9\\u1200-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u1676\\u1681-\\u169A\\u16A0-\\u16EA\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17D7\\u17DC\\u1820-\\u1877\\u1880-\\u18A8\\u18AA\\u1900-\\u191C\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19A9\\u19C1-\\u19C7\\u1A00-\\u1A16\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C7D\\u1D00-\\u1DBF\\u1E00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2071\\u207F\\u2090-\\u2094\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u212F-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2183\\u2184\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2C6F\\u2C71-\\u2C7D\\u2C80-\\u2CE4\\u2D00-\\u2D25\\u2D30-\\u2D65\\u2D6F\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2E2F\\u3005\\u3006\\u3031-\\u3035\\u303B\\u303C\\u3041-\\u3096\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31B7\\u31F0-\\u31FF\\u3400\\u4DB5\\u4E00\\u9FC3\\uA000-\\uA48C\\uA500-\\uA60C\\uA610-\\uA61F\\uA62A\\uA62B\\uA640-\\uA65F\\uA662-\\uA66E\\uA67F-\\uA697\\uA717-\\uA71F\\uA722-\\uA788\\uA78B\\uA78C\\uA7FB-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA90A-\\uA925\\uA930-\\uA946\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAC00\\uD7A3\\uF900-\\uFA2D\\uFA30-\\uFA6A\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC]"),
                non_spacing_mark: new RegExp("[\\u0300-\\u036F\\u0483-\\u0487\\u0591-\\u05BD\\u05BF\\u05C1\\u05C2\\u05C4\\u05C5\\u05C7\\u0610-\\u061A\\u064B-\\u065E\\u0670\\u06D6-\\u06DC\\u06DF-\\u06E4\\u06E7\\u06E8\\u06EA-\\u06ED\\u0711\\u0730-\\u074A\\u07A6-\\u07B0\\u07EB-\\u07F3\\u0816-\\u0819\\u081B-\\u0823\\u0825-\\u0827\\u0829-\\u082D\\u0900-\\u0902\\u093C\\u0941-\\u0948\\u094D\\u0951-\\u0955\\u0962\\u0963\\u0981\\u09BC\\u09C1-\\u09C4\\u09CD\\u09E2\\u09E3\\u0A01\\u0A02\\u0A3C\\u0A41\\u0A42\\u0A47\\u0A48\\u0A4B-\\u0A4D\\u0A51\\u0A70\\u0A71\\u0A75\\u0A81\\u0A82\\u0ABC\\u0AC1-\\u0AC5\\u0AC7\\u0AC8\\u0ACD\\u0AE2\\u0AE3\\u0B01\\u0B3C\\u0B3F\\u0B41-\\u0B44\\u0B4D\\u0B56\\u0B62\\u0B63\\u0B82\\u0BC0\\u0BCD\\u0C3E-\\u0C40\\u0C46-\\u0C48\\u0C4A-\\u0C4D\\u0C55\\u0C56\\u0C62\\u0C63\\u0CBC\\u0CBF\\u0CC6\\u0CCC\\u0CCD\\u0CE2\\u0CE3\\u0D41-\\u0D44\\u0D4D\\u0D62\\u0D63\\u0DCA\\u0DD2-\\u0DD4\\u0DD6\\u0E31\\u0E34-\\u0E3A\\u0E47-\\u0E4E\\u0EB1\\u0EB4-\\u0EB9\\u0EBB\\u0EBC\\u0EC8-\\u0ECD\\u0F18\\u0F19\\u0F35\\u0F37\\u0F39\\u0F71-\\u0F7E\\u0F80-\\u0F84\\u0F86\\u0F87\\u0F90-\\u0F97\\u0F99-\\u0FBC\\u0FC6\\u102D-\\u1030\\u1032-\\u1037\\u1039\\u103A\\u103D\\u103E\\u1058\\u1059\\u105E-\\u1060\\u1071-\\u1074\\u1082\\u1085\\u1086\\u108D\\u109D\\u135F\\u1712-\\u1714\\u1732-\\u1734\\u1752\\u1753\\u1772\\u1773\\u17B7-\\u17BD\\u17C6\\u17C9-\\u17D3\\u17DD\\u180B-\\u180D\\u18A9\\u1920-\\u1922\\u1927\\u1928\\u1932\\u1939-\\u193B\\u1A17\\u1A18\\u1A56\\u1A58-\\u1A5E\\u1A60\\u1A62\\u1A65-\\u1A6C\\u1A73-\\u1A7C\\u1A7F\\u1B00-\\u1B03\\u1B34\\u1B36-\\u1B3A\\u1B3C\\u1B42\\u1B6B-\\u1B73\\u1B80\\u1B81\\u1BA2-\\u1BA5\\u1BA8\\u1BA9\\u1C2C-\\u1C33\\u1C36\\u1C37\\u1CD0-\\u1CD2\\u1CD4-\\u1CE0\\u1CE2-\\u1CE8\\u1CED\\u1DC0-\\u1DE6\\u1DFD-\\u1DFF\\u20D0-\\u20DC\\u20E1\\u20E5-\\u20F0\\u2CEF-\\u2CF1\\u2DE0-\\u2DFF\\u302A-\\u302F\\u3099\\u309A\\uA66F\\uA67C\\uA67D\\uA6F0\\uA6F1\\uA802\\uA806\\uA80B\\uA825\\uA826\\uA8C4\\uA8E0-\\uA8F1\\uA926-\\uA92D\\uA947-\\uA951\\uA980-\\uA982\\uA9B3\\uA9B6-\\uA9B9\\uA9BC\\uAA29-\\uAA2E\\uAA31\\uAA32\\uAA35\\uAA36\\uAA43\\uAA4C\\uAAB0\\uAAB2-\\uAAB4\\uAAB7\\uAAB8\\uAABE\\uAABF\\uAAC1\\uABE5\\uABE8\\uABED\\uFB1E\\uFE00-\\uFE0F\\uFE20-\\uFE26]"),
                space_combining_mark: new RegExp("[\\u0903\\u093E-\\u0940\\u0949-\\u094C\\u094E\\u0982\\u0983\\u09BE-\\u09C0\\u09C7\\u09C8\\u09CB\\u09CC\\u09D7\\u0A03\\u0A3E-\\u0A40\\u0A83\\u0ABE-\\u0AC0\\u0AC9\\u0ACB\\u0ACC\\u0B02\\u0B03\\u0B3E\\u0B40\\u0B47\\u0B48\\u0B4B\\u0B4C\\u0B57\\u0BBE\\u0BBF\\u0BC1\\u0BC2\\u0BC6-\\u0BC8\\u0BCA-\\u0BCC\\u0BD7\\u0C01-\\u0C03\\u0C41-\\u0C44\\u0C82\\u0C83\\u0CBE\\u0CC0-\\u0CC4\\u0CC7\\u0CC8\\u0CCA\\u0CCB\\u0CD5\\u0CD6\\u0D02\\u0D03\\u0D3E-\\u0D40\\u0D46-\\u0D48\\u0D4A-\\u0D4C\\u0D57\\u0D82\\u0D83\\u0DCF-\\u0DD1\\u0DD8-\\u0DDF\\u0DF2\\u0DF3\\u0F3E\\u0F3F\\u0F7F\\u102B\\u102C\\u1031\\u1038\\u103B\\u103C\\u1056\\u1057\\u1062-\\u1064\\u1067-\\u106D\\u1083\\u1084\\u1087-\\u108C\\u108F\\u109A-\\u109C\\u17B6\\u17BE-\\u17C5\\u17C7\\u17C8\\u1923-\\u1926\\u1929-\\u192B\\u1930\\u1931\\u1933-\\u1938\\u19B0-\\u19C0\\u19C8\\u19C9\\u1A19-\\u1A1B\\u1A55\\u1A57\\u1A61\\u1A63\\u1A64\\u1A6D-\\u1A72\\u1B04\\u1B35\\u1B3B\\u1B3D-\\u1B41\\u1B43\\u1B44\\u1B82\\u1BA1\\u1BA6\\u1BA7\\u1BAA\\u1C24-\\u1C2B\\u1C34\\u1C35\\u1CE1\\u1CF2\\uA823\\uA824\\uA827\\uA880\\uA881\\uA8B4-\\uA8C3\\uA952\\uA953\\uA983\\uA9B4\\uA9B5\\uA9BA\\uA9BB\\uA9BD-\\uA9C0\\uAA2F\\uAA30\\uAA33\\uAA34\\uAA4D\\uAA7B\\uABE3\\uABE4\\uABE6\\uABE7\\uABE9\\uABEA\\uABEC]"),
                connector_punctuation: new RegExp("[\\u005F\\u203F\\u2040\\u2054\\uFE33\\uFE34\\uFE4D-\\uFE4F\\uFF3F]")
            };
            Mn.prototype.toString = function () {
                return this.message + " (line: " + this.line + ", col: " + this.col + ", pos: " + this.pos + ")" + "\n\n" + this.stack
            };
            var Pn = {};
            var Bn = E(["typeof", "void", "delete", "--", "++", "!", "~", "-", "+"]);
            var jn = E(["--", "++"]);
            var Fn = E(["=", "+=", "-=", "/=", "*=", "%=", ">>=", "<<=", ">>>=", "|=", "^=", "&="]);
            var In = function (e, t) {
                for (var n = 0; n < e.length; ++n) {
                    var r = e[n];
                    for (var i = 0; i < r.length; ++i) {
                        t[r[i]] = n + 1
                    }
                }
                return t
            }([["||"], ["&&"], ["|"], ["^"], ["&"], ["==", "===", "!=", "!=="], ["<", ">", "<=", ">=", "in", "instanceof"], [">>", "<<", ">>>"], ["+", "-"], ["*", "/", "%"]], {});
            var qn = i(["for", "do", "while", "switch"]);
            var Rn = i(["atom", "num", "string", "regexp", "name"]);
            "use strict";
            zn.prototype = new on;
            (function (e) {
                function t(t, n) {
                    t.DEFMETHOD("transform", function (t, r) {
                        var i, s;
                        t.push(this);
                        if (t.before)i = t.before(this, n, r);
                        if (i === e) {
                            if (!t.after) {
                                i = this;
                                n(i, t)
                            } else {
                                t.stack[t.stack.length - 1] = i = this.clone();
                                n(i, t);
                                s = t.after(i, r);
                                if (s !== e)i = s
                            }
                        }
                        t.pop();
                        return i
                    })
                }

                function n(e, t) {
                    return d(e, function (e) {
                        return e.transform(t, true)
                    })
                }

                t(C, p);
                t(B, function (e, t) {
                    e.label = e.label.transform(t);
                    e.body = e.body.transform(t)
                });
                t(O, function (e, t) {
                    e.body = e.body.transform(t)
                });
                t(_, function (e, t) {
                    e.body = n(e.body, t)
                });
                t(F, function (e, t) {
                    e.condition = e.condition.transform(t);
                    e.body = e.body.transform(t)
                });
                t(R, function (e, t) {
                    if (e.init)e.init = e.init.transform(t);
                    if (e.condition)e.condition = e.condition.transform(t);
                    if (e.step)e.step = e.step.transform(t);
                    e.body = e.body.transform(t)
                });
                t(U, function (e, t) {
                    e.init = e.init.transform(t);
                    e.object = e.object.transform(t);
                    e.body = e.body.transform(t)
                });
                t(z, function (e, t) {
                    e.expression = e.expression.transform(t);
                    e.body = e.body.transform(t)
                });
                t(G, function (e, t) {
                    if (e.value)e.value = e.value.transform(t)
                });
                t(et, function (e, t) {
                    if (e.label)e.label = e.label.transform(t)
                });
                t(rt, function (e, t) {
                    e.condition = e.condition.transform(t);
                    e.body = e.body.transform(t);
                    if (e.alternative)e.alternative = e.alternative.transform(t)
                });
                t(it, function (e, t) {
                    e.expression = e.expression.transform(t);
                    e.body = n(e.body, t)
                });
                t(ut, function (e, t) {
                    e.expression = e.expression.transform(t);
                    e.body = n(e.body, t)
                });
                t(at, function (e, t) {
                    e.body = n(e.body, t);
                    if (e.bcatch)e.bcatch = e.bcatch.transform(t);
                    if (e.bfinally)e.bfinally = e.bfinally.transform(t)
                });
                t(ft, function (e, t) {
                    e.argname = e.argname.transform(t);
                    e.body = n(e.body, t)
                });
                t(ct, function (e, t) {
                    e.definitions = n(e.definitions, t)
                });
                t(dt, function (e, t) {
                    e.name = e.name.transform(t);
                    if (e.value)e.value = e.value.transform(t)
                });
                t(V, function (e, t) {
                    if (e.name)e.name = e.name.transform(t);
                    e.argnames = n(e.argnames, t);
                    e.body = n(e.body, t)
                });
                t(vt, function (e, t) {
                    e.expression = e.expression.transform(t);
                    e.args = n(e.args, t)
                });
                t(gt, function (e, t) {
                    e.car = e.car.transform(t);
                    e.cdr = e.cdr.transform(t)
                });
                t(bt, function (e, t) {
                    e.expression = e.expression.transform(t)
                });
                t(wt, function (e, t) {
                    e.expression = e.expression.transform(t);
                    e.property = e.property.transform(t)
                });
                t(Et, function (e, t) {
                    e.expression = e.expression.transform(t)
                });
                t(Tt, function (e, t) {
                    e.left = e.left.transform(t);
                    e.right = e.right.transform(t)
                });
                t(Nt, function (e, t) {
                    e.condition = e.condition.transform(t);
                    e.consequent = e.consequent.transform(t);
                    e.alternative = e.alternative.transform(t)
                });
                t(kt, function (e, t) {
                    e.elements = n(e.elements, t)
                });
                t(Lt, function (e, t) {
                    e.properties = n(e.properties, t)
                });
                t(At, function (e, t) {
                    e.value = e.value.transform(t)
                })
            })();
            "use strict";
            Wn.prototype = {
                unmangleable: function (e) {
                    return this.global && !(e && e.toplevel) || this.undeclared || !(e && e.eval) && (this.scope.uses_eval || this.scope.uses_with)
                }, mangle: function (e) {
                    if (!this.mangled_name && !this.unmangleable(e)) {
                        var t = this.scope;
                        if (!e.screw_ie8 && this.orig[0]instanceof qt)t = t.parent_scope;
                        this.mangled_name = t.next_mangled(e, this)
                    }
                }
            };
            X.DEFMETHOD("figure_out_scope", function (e) {
                e = c(e, {screw_ie8: false});
                var t = this;
                var n = t.parent_scope = null;
                var r = null;
                var i = 0;
                var s = new on(function (t, o) {
                    if (e.screw_ie8 && t instanceof ft) {
                        var u = n;
                        n = new W(t);
                        n.init_scope_vars(i);
                        n.parent_scope = u;
                        o();
                        n = u;
                        return true
                    }
                    if (t instanceof W) {
                        t.init_scope_vars(i);
                        var u = t.parent_scope = n;
                        var a = r;
                        r = n = t;
                        ++i;
                        o();
                        --i;
                        n = u;
                        r = a;
                        return true
                    }
                    if (t instanceof A) {
                        t.scope = n;
                        v(n.directives, t.value);
                        return true
                    }
                    if (t instanceof z) {
                        for (var f = n; f; f = f.parent_scope)f.uses_with = true;
                        return
                    }
                    if (t instanceof Dt) {
                        t.scope = n
                    }
                    if (t instanceof qt) {
                        r.def_function(t)
                    } else if (t instanceof It) {
                        (t.scope = r.parent_scope).def_function(t)
                    } else if (t instanceof Bt || t instanceof jt) {
                        var l = r.def_variable(t);
                        l.constant = t instanceof jt;
                        l.init = s.parent().value
                    } else if (t instanceof Rt) {
                        (e.screw_ie8 ? n : r).def_variable(t)
                    }
                });
                t.walk(s);
                var o = null;
                var u = t.globals = new x;
                var s = new on(function (e, n) {
                    if (e instanceof V) {
                        var r = o;
                        o = e;
                        n();
                        o = r;
                        return true
                    }
                    if (e instanceof zt) {
                        var i = e.name;
                        var a = e.scope.find_variable(i);
                        if (!a) {
                            var f;
                            if (u.has(i)) {
                                f = u.get(i)
                            } else {
                                f = new Wn(t, u.size(), e);
                                f.undeclared = true;
                                f.global = true;
                                u.set(i, f)
                            }
                            e.thedef = f;
                            if (i == "eval" && s.parent()instanceof vt) {
                                for (var l = e.scope; l && !l.uses_eval; l = l.parent_scope)l.uses_eval = true
                            }
                            if (o && i == "arguments") {
                                o.uses_arguments = true
                            }
                        } else {
                            e.thedef = a
                        }
                        e.reference();
                        return true
                    }
                });
                t.walk(s)
            });
            W.DEFMETHOD("init_scope_vars", function (e) {
                this.directives = [];
                this.variables = new x;
                this.functions = new x;
                this.uses_with = false;
                this.uses_eval = false;
                this.parent_scope = null;
                this.enclosed = [];
                this.cname = -1;
                this.nesting = e
            });
            W.DEFMETHOD("strict", function () {
                return this.has_directive("use strict")
            });
            V.DEFMETHOD("init_scope_vars", function () {
                W.prototype.init_scope_vars.apply(this, arguments);
                this.uses_arguments = false
            });
            zt.DEFMETHOD("reference", function () {
                var e = this.definition();
                e.references.push(this);
                var t = this.scope;
                while (t) {
                    v(t.enclosed, e);
                    if (t === e.scope)break;
                    t = t.parent_scope
                }
                this.frame = this.scope.nesting - e.scope.nesting
            });
            W.DEFMETHOD("find_variable", function (e) {
                if (e instanceof Dt)e = e.name;
                return this.variables.get(e) || this.parent_scope && this.parent_scope.find_variable(e)
            });
            W.DEFMETHOD("has_directive", function (e) {
                return this.parent_scope && this.parent_scope.has_directive(e) || (this.directives.indexOf(e) >= 0 ? this : null)
            });
            W.DEFMETHOD("def_function", function (e) {
                this.functions.set(e.name, this.def_variable(e))
            });
            W.DEFMETHOD("def_variable", function (e) {
                var t;
                if (!this.variables.has(e.name)) {
                    t = new Wn(this, this.variables.size(), e);
                    this.variables.set(e.name, t);
                    t.global = !this.parent_scope
                } else {
                    t = this.variables.get(e.name);
                    t.orig.push(e)
                }
                return e.thedef = t
            });
            W.DEFMETHOD("next_mangled", function (e) {
                var t = this.enclosed;
                e:while (true) {
                    var n = Xn(++this.cname);
                    if (!Cn(n))continue;
                    if (e.except.indexOf(n) >= 0)continue;
                    for (var r = t.length; --r >= 0;) {
                        var i = t[r];
                        var s = i.mangled_name || i.unmangleable(e) && i.name;
                        if (n == s)continue e
                    }
                    return n
                }
            });
            J.DEFMETHOD("next_mangled", function (e, t) {
                var n = t.orig[0]instanceof Ft && this.name && this.name.definition();
                while (true) {
                    var r = V.prototype.next_mangled.call(this, e, t);
                    if (!(n && n.mangled_name == r))return r
                }
            });
            W.DEFMETHOD("references", function (e) {
                if (e instanceof Dt)e = e.definition();
                return this.enclosed.indexOf(e) < 0 ? null : e
            });
            Dt.DEFMETHOD("unmangleable", function (e) {
                return this.definition().unmangleable(e)
            });
            Pt.DEFMETHOD("unmangleable", function () {
                return true
            });
            Ut.DEFMETHOD("unmangleable", function () {
                return false
            });
            Dt.DEFMETHOD("unreferenced", function () {
                return this.definition().references.length == 0 && !(this.scope.uses_eval || this.scope.uses_with)
            });
            Dt.DEFMETHOD("undeclared", function () {
                return this.definition().undeclared
            });
            Wt.DEFMETHOD("undeclared", function () {
                return false
            });
            Ut.DEFMETHOD("undeclared", function () {
                return false
            });
            Dt.DEFMETHOD("definition", function () {
                return this.thedef
            });
            Dt.DEFMETHOD("global", function () {
                return this.definition().global
            });
            X.DEFMETHOD("_default_mangler_options", function (e) {
                return c(e, {except: [], eval: false, sort: false, toplevel: false, screw_ie8: false})
            });
            X.DEFMETHOD("mangle_names", function (e) {
                e = this._default_mangler_options(e);
                var t = -1;
                var n = [];
                var r = new on(function (i, s) {
                    if (i instanceof B) {
                        var o = t;
                        s();
                        t = o;
                        return true
                    }
                    if (i instanceof W) {
                        var u = r.parent(), a = [];
                        i.variables.each(function (t) {
                            if (e.except.indexOf(t.name) < 0) {
                                a.push(t)
                            }
                        });
                        if (e.sort)a.sort(function (e, t) {
                            return t.references.length - e.references.length
                        });
                        n.push.apply(n, a);
                        return
                    }
                    if (i instanceof Ut) {
                        var f;
                        do f = Xn(++t); while (!Cn(f));
                        i.mangled_name = f;
                        return true
                    }
                    if (e.screw_ie8 && i instanceof Rt) {
                        n.push(i.definition());
                        return
                    }
                });
                this.walk(r);
                n.forEach(function (t) {
                    t.mangle(e)
                })
            });
            X.DEFMETHOD("compute_char_frequency", function (e) {
                e = this._default_mangler_options(e);
                var t = new on(function (t) {
                    if (t instanceof Vt)Xn.consider(t.print_to_string()); else if (t instanceof Y)Xn.consider("return"); else if (t instanceof Z)Xn.consider("throw"); else if (t instanceof nt)Xn.consider("continue"); else if (t instanceof tt)Xn.consider("break"); else if (t instanceof L)Xn.consider("debugger"); else if (t instanceof A)Xn.consider(t.value); else if (t instanceof q)Xn.consider("while"); else if (t instanceof I)Xn.consider("do while"); else if (t instanceof rt) {
                        Xn.consider("if");
                        if (t.alternative)Xn.consider("else")
                    } else if (t instanceof ht)Xn.consider("var"); else if (t instanceof pt)Xn.consider("const"); else if (t instanceof V)Xn.consider("function"); else if (t instanceof R)Xn.consider("for"); else if (t instanceof U)Xn.consider("for in"); else if (t instanceof it)Xn.consider("switch"); else if (t instanceof ut)Xn.consider("case"); else if (t instanceof ot)Xn.consider("default"); else if (t instanceof z)Xn.consider("with"); else if (t instanceof Mt)Xn.consider("set" + t.key); else if (t instanceof _t)Xn.consider("get" + t.key); else if (t instanceof Ot)Xn.consider(t.key); else if (t instanceof mt)Xn.consider("new"); else if (t instanceof Xt)Xn.consider("this"); else if (t instanceof at)Xn.consider("try"); else if (t instanceof ft)Xn.consider("catch"); else if (t instanceof lt)Xn.consider("finally"); else if (t instanceof Dt && t.unmangleable(e))Xn.consider(t.name); else if (t instanceof Et || t instanceof Tt)Xn.consider(t.operator); else if (t instanceof bt)Xn.consider(t.property)
                });
                this.walk(t);
                Xn.sort()
            });
            var Xn = function () {
                function r() {
                    n = Object.create(null);
                    t = e.split("").map(function (e) {
                        return e.charCodeAt(0)
                    });
                    t.forEach(function (e) {
                        n[e] = 0
                    })
                }

                function i(e) {
                    var n = "", r = 54;
                    do {
                        n += String.fromCharCode(t[e % r]);
                        e = Math.floor(e / r);
                        r = 64
                    } while (e > 0);
                    return n
                }

                var e = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_0123456789";
                var t, n;
                i.consider = function (e) {
                    for (var t = e.length; --t >= 0;) {
                        var r = e.charCodeAt(t);
                        if (r in n)++n[r]
                    }
                };
                i.sort = function () {
                    t = y(t, function (e, t) {
                        if (Sn(e) && !Sn(t))return 1;
                        if (Sn(t) && !Sn(e))return -1;
                        return n[t] - n[e]
                    })
                };
                i.reset = r;
                r();
                i.get = function () {
                    return t
                };
                i.freq = function () {
                    return n
                };
                return i
            }();
            X.DEFMETHOD("scope_warnings", function (e) {
                e = c(e, {
                    undeclared: false,
                    unreferenced: true,
                    assign_to_global: true,
                    func_arguments: true,
                    nested_defuns: true,
                    eval: true
                });
                var t = new on(function (n) {
                    if (e.undeclared && n instanceof zt && n.undeclared()) {
                        C.warn("Undeclared symbol: {name} [{file}:{line},{col}]", {
                            name: n.name,
                            file: n.start.file,
                            line: n.start.line,
                            col: n.start.col
                        })
                    }
                    if (e.assign_to_global) {
                        var r = null;
                        if (n instanceof Ct && n.left instanceof zt)r = n.left; else if (n instanceof U && n.init instanceof zt)r = n.init;
                        if (r && (r.undeclared() || r.global() && r.scope !== r.definition().scope)) {
                            C.warn("{msg}: {name} [{file}:{line},{col}]", {
                                msg: r.undeclared() ? "Accidental global?" : "Assignment to global",
                                name: r.name,
                                file: r.start.file,
                                line: r.start.line,
                                col: r.start.col
                            })
                        }
                    }
                    if (e.eval && n instanceof zt && n.undeclared() && n.name == "eval") {
                        C.warn("Eval is used [{file}:{line},{col}]", n.start)
                    }
                    if (e.unreferenced && (n instanceof Ht || n instanceof Ut) && n.unreferenced()) {
                        C.warn("{type} {name} is declared but not referenced [{file}:{line},{col}]", {
                            type: n instanceof Ut ? "Label" : "Symbol",
                            name: n.name,
                            file: n.start.file,
                            line: n.start.line,
                            col: n.start.col
                        })
                    }
                    if (e.func_arguments && n instanceof V && n.uses_arguments) {
                        C.warn("arguments used in function {name} [{file}:{line},{col}]", {
                            name: n.name ? n.name.name : "anonymous",
                            file: n.start.file,
                            line: n.start.line,
                            col: n.start.col
                        })
                    }
                    if (e.nested_defuns && n instanceof K && !(t.parent()instanceof W)) {
                        C.warn('Function {name} declared in nested statement "{type}" [{file}:{line},{col}]', {
                            name: n.name.name,
                            type: t.parent().TYPE,
                            file: n.start.file,
                            line: n.start.line,
                            col: n.start.col
                        })
                    }
                });
                this.walk(t)
            });
            "use strict";
            (function () {
                function e(e, t) {
                    e.DEFMETHOD("_codegen", t)
                }

                function t(e, t) {
                    e.DEFMETHOD("needs_parens", t)
                }

                function n(e) {
                    var t = e.parent();
                    if (t instanceof Et)return true;
                    if (t instanceof Tt && !(t instanceof Ct))return true;
                    if (t instanceof vt && t.expression === this)return true;
                    if (t instanceof Nt && t.condition === this)return true;
                    if (t instanceof yt && t.expression === this)return true
                }

                function r(e, t, n) {
                    var r = e.length - 1;
                    e.forEach(function (e, i) {
                        if (!(e instanceof P)) {
                            n.indent();
                            e.print(n);
                            if (!(i == r && t)) {
                                n.newline();
                                if (t)n.newline()
                            }
                        }
                    })
                }

                function i(e, t) {
                    if (e.length > 0)t.with_block(function () {
                        r(e, false, t)
                    }); else t.print("{}")
                }

                function s(e, t) {
                    if (t.option("bracketize")) {
                        d(e.body, t);
                        return
                    }
                    if (!e.body)return t.force_semicolon();
                    if (e.body instanceof I && !t.option("screw_ie8")) {
                        d(e.body, t);
                        return
                    }
                    var n = e.body;
                    while (true) {
                        if (n instanceof rt) {
                            if (!n.alternative) {
                                d(e.body, t);
                                return
                            }
                            n = n.alternative
                        } else if (n instanceof H) {
                            n = n.body
                        } else break
                    }
                    a(e.body, t)
                }

                function o(e, t, n) {
                    if (!n)e.print(t); else try {
                        e.walk(new on(function (e) {
                            if (e instanceof Tt && e.operator == "in")throw t
                        }));
                        e.print(t)
                    } catch (r) {
                        if (r !== t)throw r;
                        e.print(t, true)
                    }
                }

                function u(e) {
                    return [92, 47, 46, 43, 42, 63, 40, 41, 91, 93, 123, 125, 36, 94, 58, 124, 33, 10, 13, 0, 65279, 8232, 8233].indexOf(e) < 0
                }

                function a(e, t) {
                    if (t.option("bracketize")) {
                        if (!e || e instanceof P)t.print("{}"); else if (e instanceof D)e.print(t); else t.with_block(function () {
                            t.indent();
                            e.print(t);
                            t.newline()
                        })
                    } else {
                        if (!e || e instanceof P)t.force_semicolon(); else e.print(t)
                    }
                }

                function f(e) {
                    var t = e.stack(), n = t.length, r = t[--n], i = t[--n];
                    while (n > 0) {
                        if (i instanceof k && i.body === r)return true;
                        if (i instanceof gt && i.car === r || i instanceof vt && i.expression === r && !(i instanceof mt) || i instanceof bt && i.expression === r || i instanceof wt && i.expression === r || i instanceof Nt && i.condition === r || i instanceof Tt && i.left === r || i instanceof xt && i.expression === r) {
                            r = i;
                            i = t[--n]
                        } else {
                            return false
                        }
                    }
                }

                function l(e, t) {
                    return e.args.length == 0 && !t.option("beautify")
                }

                function c(e) {
                    var t = e[0], n = t.length;
                    for (var r = 1; r < e.length; ++r) {
                        if (e[r].length < n) {
                            t = e[r];
                            n = t.length
                        }
                    }
                    return t
                }

                function h(e) {
                    var t = e.toString(10), n = [t.replace(/^0\./, ".").replace("e+", "e")], r;
                    if (Math.floor(e) === e) {
                        if (e >= 0) {
                            n.push("0x" + e.toString(16).toLowerCase(), "0" + e.toString(8))
                        } else {
                            n.push("-0x" + (-e).toString(16).toLowerCase(), "-0" + (-e).toString(8))
                        }
                        if (r = /^(.*?)(0+)$/.exec(e)) {
                            n.push(r[1] + "e" + r[2].length)
                        }
                    } else if (r = /^0?\.(0+)(.*)$/.exec(e)) {
                        n.push(r[2] + "e-" + (r[1].length + r[2].length), t.substr(t.indexOf(".")))
                    }
                    return c(n)
                }

                function d(e, t) {
                    if (e instanceof D) {
                        e.print(t);
                        return
                    }
                    t.with_block(function () {
                        t.indent();
                        e.print(t);
                        t.newline()
                    })
                }

                function v(e, t) {
                    e.DEFMETHOD("add_source_map", function (e) {
                        t(this, e)
                    })
                }

                function m(e, t) {
                    t.add_mapping(e.start)
                }

                C.DEFMETHOD("print", function (e, t) {
                    function i() {
                        n.add_comments(e);
                        n.add_source_map(e);
                        r(n, e)
                    }

                    var n = this, r = n._codegen;
                    e.push_node(n);
                    if (t || n.needs_parens(e)) {
                        e.with_parens(i)
                    } else {
                        i()
                    }
                    e.pop_node()
                });
                C.DEFMETHOD("print_to_string", function (e) {
                    var t = Vn(e);
                    this.print(t);
                    return t.get()
                });
                C.DEFMETHOD("add_comments", function (e) {
                    var t = e.option("comments"), n = this;
                    if (t) {
                        var r = n.start;
                        if (r && !r._comments_dumped) {
                            r._comments_dumped = true;
                            var i = r.comments_before || [];
                            if (n instanceof G && n.value) {
                                n.value.walk(new on(function (e) {
                                    if (e.start && e.start.comments_before) {
                                        i = i.concat(e.start.comments_before);
                                        e.start.comments_before = []
                                    }
                                    if (e instanceof J || e instanceof kt || e instanceof Lt) {
                                        return true
                                    }
                                }))
                            }
                            if (t.test) {
                                i = i.filter(function (e) {
                                    return t.test(e.value)
                                })
                            } else if (typeof t == "function") {
                                i = i.filter(function (e) {
                                    return t(n, e)
                                })
                            }
                            i.forEach(function (t) {
                                if (/comment[134]/.test(t.type)) {
                                    e.print("//" + t.value + "\n");
                                    e.indent()
                                } else if (t.type == "comment2") {
                                    e.print("/*" + t.value + "*/");
                                    if (r.nlb) {
                                        e.print("\n");
                                        e.indent()
                                    } else {
                                        e.space()
                                    }
                                }
                            })
                        }
                    }
                });
                t(C, function () {
                    return false
                });
                t(J, function (e) {
                    return f(e)
                });
                t(Lt, function (e) {
                    return f(e)
                });
                t(Et, function (e) {
                    var t = e.parent();
                    return t instanceof yt && t.expression === this
                });
                t(gt, function (e) {
                    var t = e.parent();
                    return t instanceof vt || t instanceof Et || t instanceof Tt || t instanceof dt || t instanceof yt || t instanceof kt || t instanceof At || t instanceof Nt
                });
                t(Tt, function (e) {
                    var t = e.parent();
                    if (t instanceof vt && t.expression === this)return true;
                    if (t instanceof Et)return true;
                    if (t instanceof yt && t.expression === this)return true;
                    if (t instanceof Tt) {
                        var n = t.operator, r = In[n];
                        var i = this.operator, s = In[i];
                        if (r > s || r == s && this === t.right) {
                            return true
                        }
                    }
                });
                t(yt, function (e) {
                    var t = e.parent();
                    if (t instanceof mt && t.expression === this) {
                        try {
                            this.walk(new on(function (e) {
                                if (e instanceof vt)throw t
                            }))
                        } catch (n) {
                            if (n !== t)throw n;
                            return true
                        }
                    }
                });
                t(vt, function (e) {
                    var t = e.parent(), n;
                    if (t instanceof mt && t.expression === this)return true;
                    return this.expression instanceof J && t instanceof yt && t.expression === this && (n = e.parent(1))instanceof Ct && n.left === t
                });
                t(mt, function (e) {
                    var t = e.parent();
                    if (l(this, e) && (t instanceof yt || t instanceof vt && t.expression === this))return true
                });
                t(Jt, function (e) {
                    var t = e.parent();
                    if (this.getValue() < 0 && t instanceof yt && t.expression === this)return true
                });
                t(Yt, function (e) {
                    var t = e.parent();
                    if (t instanceof yt && t.expression === this)return true
                });
                t(Ct, n);
                t(Nt, n);
                e(A, function (e, t) {
                    t.print_string(e.value);
                    t.semicolon()
                });
                e(L, function (e, t) {
                    t.print("debugger");
                    t.semicolon()
                });
                H.DEFMETHOD("_do_print_body", function (e) {
                    a(this.body, e)
                });
                e(k, function (e, t) {
                    e.body.print(t);
                    t.semicolon()
                });
                e(X, function (e, t) {
                    r(e.body, true, t);
                    t.print("")
                });
                e(B, function (e, t) {
                    e.label.print(t);
                    t.colon();
                    e.body.print(t)
                });
                e(O, function (e, t) {
                    e.body.print(t);
                    t.semicolon()
                });
                e(D, function (e, t) {
                    i(e.body, t)
                });
                e(P, function (e, t) {
                    t.semicolon()
                });
                e(I, function (e, t) {
                    t.print("do");
                    t.space();
                    e._do_print_body(t);
                    t.space();
                    t.print("while");
                    t.space();
                    t.with_parens(function () {
                        e.condition.print(t)
                    });
                    t.semicolon()
                });
                e(q, function (e, t) {
                    t.print("while");
                    t.space();
                    t.with_parens(function () {
                        e.condition.print(t)
                    });
                    t.space();
                    e._do_print_body(t)
                });
                e(R, function (e, t) {
                    t.print("for");
                    t.space();
                    t.with_parens(function () {
                        if (e.init) {
                            if (e.init instanceof ct) {
                                e.init.print(t)
                            } else {
                                o(e.init, t, true)
                            }
                            t.print(";");
                            t.space()
                        } else {
                            t.print(";")
                        }
                        if (e.condition) {
                            e.condition.print(t);
                            t.print(";");
                            t.space()
                        } else {
                            t.print(";")
                        }
                        if (e.step) {
                            e.step.print(t)
                        }
                    });
                    t.space();
                    e._do_print_body(t)
                });
                e(U, function (e, t) {
                    t.print("for");
                    t.space();
                    t.with_parens(function () {
                        e.init.print(t);
                        t.space();
                        t.print("in");
                        t.space();
                        e.object.print(t)
                    });
                    t.space();
                    e._do_print_body(t)
                });
                e(z, function (e, t) {
                    t.print("with");
                    t.space();
                    t.with_parens(function () {
                        e.expression.print(t)
                    });
                    t.space();
                    e._do_print_body(t)
                });
                V.DEFMETHOD("_do_print", function (e, t) {
                    var n = this;
                    if (!t) {
                        e.print("function")
                    }
                    if (n.name) {
                        e.space();
                        n.name.print(e)
                    }
                    e.with_parens(function () {
                        n.argnames.forEach(function (t, n) {
                            if (n)e.comma();
                            t.print(e)
                        })
                    });
                    e.space();
                    i(n.body, e)
                });
                e(V, function (e, t) {
                    e._do_print(t)
                });
                G.DEFMETHOD("_do_print", function (e, t) {
                    e.print(t);
                    if (this.value) {
                        e.space();
                        this.value.print(e)
                    }
                    e.semicolon()
                });
                e(Y, function (e, t) {
                    e._do_print(t, "return")
                });
                e(Z, function (e, t) {
                    e._do_print(t, "throw")
                });
                et.DEFMETHOD("_do_print", function (e, t) {
                    e.print(t);
                    if (this.label) {
                        e.space();
                        this.label.print(e)
                    }
                    e.semicolon()
                });
                e(tt, function (e, t) {
                    e._do_print(t, "break")
                });
                e(nt, function (e, t) {
                    e._do_print(t, "continue")
                });
                e(rt, function (e, t) {
                    t.print("if");
                    t.space();
                    t.with_parens(function () {
                        e.condition.print(t)
                    });
                    t.space();
                    if (e.alternative) {
                        s(e, t);
                        t.space();
                        t.print("else");
                        t.space();
                        a(e.alternative, t)
                    } else {
                        e._do_print_body(t)
                    }
                });
                e(it, function (e, t) {
                    t.print("switch");
                    t.space();
                    t.with_parens(function () {
                        e.expression.print(t)
                    });
                    t.space();
                    if (e.body.length > 0)t.with_block(function () {
                        e.body.forEach(function (e, n) {
                            if (n)t.newline();
                            t.indent(true);
                            e.print(t)
                        })
                    }); else t.print("{}")
                });
                st.DEFMETHOD("_do_print_body", function (e) {
                    if (this.body.length > 0) {
                        e.newline();
                        this.body.forEach(function (t) {
                            e.indent();
                            t.print(e);
                            e.newline()
                        })
                    }
                });
                e(ot, function (e, t) {
                    t.print("default:");
                    e._do_print_body(t)
                });
                e(ut, function (e, t) {
                    t.print("case");
                    t.space();
                    e.expression.print(t);
                    t.print(":");
                    e._do_print_body(t)
                });
                e(at, function (e, t) {
                    t.print("try");
                    t.space();
                    i(e.body, t);
                    if (e.bcatch) {
                        t.space();
                        e.bcatch.print(t)
                    }
                    if (e.bfinally) {
                        t.space();
                        e.bfinally.print(t)
                    }
                });
                e(ft, function (e, t) {
                    t.print("catch");
                    t.space();
                    t.with_parens(function () {
                        e.argname.print(t)
                    });
                    t.space();
                    i(e.body, t)
                });
                e(lt, function (e, t) {
                    t.print("finally");
                    t.space();
                    i(e.body, t)
                });
                ct.DEFMETHOD("_do_print", function (e, t) {
                    e.print(t);
                    e.space();
                    this.definitions.forEach(function (t, n) {
                        if (n)e.comma();
                        t.print(e)
                    });
                    var n = e.parent();
                    var r = n instanceof R || n instanceof U;
                    var i = r && n.init === this;
                    if (!i)e.semicolon()
                });
                e(ht, function (e, t) {
                    e._do_print(t, "var")
                });
                e(pt, function (e, t) {
                    e._do_print(t, "const")
                });
                e(dt, function (e, t) {
                    e.name.print(t);
                    if (e.value) {
                        t.space();
                        t.print("=");
                        t.space();
                        var n = t.parent(1);
                        var r = n instanceof R || n instanceof U;
                        o(e.value, t, r)
                    }
                });
                e(vt, function (e, t) {
                    e.expression.print(t);
                    if (e instanceof mt && l(e, t))return;
                    t.with_parens(function () {
                        e.args.forEach(function (e, n) {
                            if (n)t.comma();
                            e.print(t)
                        })
                    })
                });
                e(mt, function (e, t) {
                    t.print("new");
                    t.space();
                    vt.prototype._codegen(e, t)
                });
                gt.DEFMETHOD("_do_print", function (e) {
                    this.car.print(e);
                    if (this.cdr) {
                        e.comma();
                        if (e.should_break()) {
                            e.newline();
                            e.indent()
                        }
                        this.cdr.print(e)
                    }
                });
                e(gt, function (e, t) {
                    e._do_print(t)
                });
                e(bt, function (e, t) {
                    var n = e.expression;
                    n.print(t);
                    if (n instanceof Jt && n.getValue() >= 0) {
                        if (!/[xa-f.]/i.test(t.last())) {
                            t.print(".")
                        }
                    }
                    t.print(".");
                    t.add_mapping(e.end);
                    t.print_name(e.property)
                });
                e(wt, function (e, t) {
                    e.expression.print(t);
                    t.print("[");
                    e.property.print(t);
                    t.print("]")
                });
                e(St, function (e, t) {
                    var n = e.operator;
                    t.print(n);
                    if (/^[a-z]/i.test(n))t.space();
                    e.expression.print(t)
                });
                e(xt, function (e, t) {
                    e.expression.print(t);
                    t.print(e.operator)
                });
                e(Tt, function (e, t) {
                    e.left.print(t);
                    t.space();
                    t.print(e.operator);
                    if (e.operator == "<" && e.right instanceof St && e.right.operator == "!" && e.right.expression instanceof St && e.right.expression.operator == "--") {
                        t.print(" ")
                    } else {
                        t.space()
                    }
                    e.right.print(t)
                });
                e(Nt, function (e, t) {
                    e.condition.print(t);
                    t.space();
                    t.print("?");
                    t.space();
                    e.consequent.print(t);
                    t.space();
                    t.colon();
                    e.alternative.print(t)
                });
                e(kt, function (e, t) {
                    t.with_square(function () {
                        var n = e.elements, r = n.length;
                        if (r > 0)t.space();
                        n.forEach(function (e, n) {
                            if (n)t.comma();
                            e.print(t);
                            if (n === r - 1 && e instanceof en)t.comma()
                        });
                        if (r > 0)t.space()
                    })
                });
                e(Lt, function (e, t) {
                    if (e.properties.length > 0)t.with_block(function () {
                        e.properties.forEach(function (e, n) {
                            if (n) {
                                t.print(",");
                                t.newline()
                            }
                            t.indent();
                            e.print(t)
                        });
                        t.newline()
                    }); else t.print("{}")
                });
                e(Ot, function (e, t) {
                    var n = e.key;
                    if (t.option("quote_keys")) {
                        t.print_string(n + "")
                    } else if ((typeof n == "number" || !t.option("beautify") && +n + "" == n) && parseFloat(n) >= 0) {
                        t.print(h(n))
                    } else if (fn(n) ? t.option("screw_ie8") : An(n)) {
                        t.print_name(n)
                    } else {
                        t.print_string(n)
                    }
                    t.colon();
                    e.value.print(t)
                });
                e(Mt, function (e, t) {
                    t.print("set");
                    t.space();
                    e.key.print(t);
                    e.value._do_print(t, true)
                });
                e(_t, function (e, t) {
                    t.print("get");
                    t.space();
                    e.key.print(t);
                    e.value._do_print(t, true)
                });
                e(Dt, function (e, t) {
                    var n = e.definition();
                    t.print_name(n ? n.mangled_name || n.name : e.name)
                });
                e(Zt, function (e, t) {
                    t.print("void 0")
                });
                e(en, p);
                e(tn, function (e, t) {
                    t.print("1/0")
                });
                e(Yt, function (e, t) {
                    t.print("0/0")
                });
                e(Xt, function (e, t) {
                    t.print("this")
                });
                e(Vt, function (e, t) {
                    t.print(e.getValue())
                });
                e($t, function (e, t) {
                    t.print_string(e.getValue())
                });
                e(Jt, function (e, t) {
                    t.print(h(e.getValue()))
                });
                e(Kt, function (e, t) {
                    var n = e.getValue().toString();
                    if (t.option("ascii_only")) {
                        n = t.to_ascii(n)
                    } else if (t.option("unescape_regexps")) {
                        n = n.split("\\\\").map(function (e) {
                            return e.replace(/\\u[0-9a-fA-F]{4}|\\x[0-9a-fA-F]{2}/g, function (e) {
                                var t = parseInt(e.substr(2), 16);
                                return u(t) ? String.fromCharCode(t) : e
                            })
                        }).join("\\\\")
                    }
                    t.print(n);
                    var r = t.parent();
                    if (r instanceof Tt && /^in/.test(r.operator) && r.left === e)t.print(" ")
                });
                v(C, p);
                v(A, m);
                v(L, m);
                v(Dt, m);
                v(Q, m);
                v(H, m);
                v(B, p);
                v(V, m);
                v(it, m);
                v(st, m);
                v(D, m);
                v(X, p);
                v(mt, m);
                v(at, m);
                v(ft, m);
                v(lt, m);
                v(ct, m);
                v(Vt, m);
                v(At, function (e, t) {
                    t.add_mapping(e.start, e.key)
                })
            })();
            "use strict";
            $n.prototype = new zn;
            h($n.prototype, {
                option: function (e) {
                    return this.options[e]
                }, warn: function () {
                    if (this.options.warnings)C.warn.apply(C, arguments)
                }, before: function (e, t, n) {
                    if (e._squeezed)return e;
                    var r = false;
                    if (e instanceof W) {
                        e = e.hoist_declarations(this);
                        r = true
                    }
                    t(e, this);
                    e = e.optimize(this);
                    if (r && e instanceof W) {
                        e.drop_unused(this);
                        t(e, this)
                    }
                    e._squeezed = true;
                    return e
                }
            });
            (function () {
                function e(e, t) {
                    e.DEFMETHOD("optimize", function (e) {
                        var n = this;
                        if (n._optimized)return n;
                        var r = t(n, e);
                        r._optimized = true;
                        if (r === n)return r;
                        return r.transform(e)
                    })
                }

                function t(e, t, n) {
                    if (!n)n = {};
                    if (t) {
                        if (!n.start)n.start = t.start;
                        if (!n.end)n.end = t.end
                    }
                    return new e(n)
                }

                function n(e, n, r) {
                    if (n instanceof C)return n.transform(e);
                    switch (typeof n) {
                        case"string":
                            return t($t, r, {value: n}).optimize(e);
                        case"number":
                            return t(isNaN(n) ? Yt : Jt, r, {value: n}).optimize(e);
                        case"boolean":
                            return t(n ? sn : rn, r).optimize(e);
                        case"undefined":
                            return t(Zt, r).optimize(e);
                        default:
                            if (n === null) {
                                return t(Gt, r).optimize(e)
                            }
                            if (n instanceof RegExp) {
                                return t(Kt, r).optimize(e)
                            }
                            throw new Error(m("Can't handle constant of type: {type}", {type: typeof n}))
                    }
                }

                function r(e) {
                    if (e === null)return [];
                    if (e instanceof D)return e.body;
                    if (e instanceof P)return [];
                    if (e instanceof k)return [e];
                    throw new Error("Can't convert thing to statement array")
                }

                function i(e) {
                    if (e === null)return true;
                    if (e instanceof P)return true;
                    if (e instanceof D)return e.body.length == 0;
                    return false
                }

                function s(e) {
                    if (e instanceof it)return e;
                    if (e instanceof R || e instanceof U || e instanceof F) {
                        return e.body instanceof D ? e.body : e
                    }
                    return e
                }

                function o(e, n) {
                    function o(e) {
                        function r(e, n) {
                            return t(O, e, {
                                body: t(Ct, e, {
                                    operator: "=",
                                    left: t(bt, n, {expression: t(zt, n, n), property: "$inject"}),
                                    right: t(kt, e, {
                                        elements: e.argnames.map(function (e) {
                                            return t($t, e, {value: e.name})
                                        })
                                    })
                                })
                            })
                        }

                        return e.reduce(function (e, t) {
                            e.push(t);
                            var i = t.start;
                            var s = i.comments_before;
                            if (s && s.length > 0) {
                                var o = s.pop();
                                if (/@ngInject/.test(o.value)) {
                                    if (t instanceof K) {
                                        e.push(r(t, t.name))
                                    } else if (t instanceof ct) {
                                        t.definitions.forEach(function (t) {
                                            if (t.value && t.value instanceof V) {
                                                e.push(r(t.value, t.name))
                                            }
                                        })
                                    } else {
                                        n.warn("Unknown statement marked with @ngInject [{file}:{line},{col}]", i)
                                    }
                                }
                            }
                            return e
                        }, [])
                    }

                    function u(e) {
                        var t = [];
                        return e.reduce(function (e, n) {
                            if (n instanceof D) {
                                i = true;
                                e.push.apply(e, u(n.body))
                            } else if (n instanceof P) {
                                i = true
                            } else if (n instanceof A) {
                                if (t.indexOf(n.value) < 0) {
                                    e.push(n);
                                    t.push(n.value)
                                } else {
                                    i = true
                                }
                            } else {
                                e.push(n)
                            }
                            return e
                        }, [])
                    }

                    function a(e, n) {
                        var o = n.self();
                        var u = o instanceof V;
                        var a = [];
                        e:for (var f = e.length; --f >= 0;) {
                            var l = e[f];
                            switch (true) {
                                case u && l instanceof Y && !l.value && a.length == 0:
                                    i = true;
                                    continue e;
                                case l instanceof rt:
                                    if (l.body instanceof Y) {
                                        if ((u && a.length == 0 || a[0]instanceof Y && !a[0].value) && !l.body.value && !l.alternative) {
                                            i = true;
                                            var h = t(O, l.condition, {body: l.condition});
                                            a.unshift(h);
                                            continue e
                                        }
                                        if (a[0]instanceof Y && l.body.value && a[0].value && !l.alternative) {
                                            i = true;
                                            l = l.clone();
                                            l.alternative = a[0];
                                            a[0] = l.transform(n);
                                            continue e
                                        }
                                        if ((a.length == 0 || a[0]instanceof Y) && l.body.value && !l.alternative && u) {
                                            i = true;
                                            l = l.clone();
                                            l.alternative = a[0] || t(Y, l, {value: t(Zt, l)});
                                            a[0] = l.transform(n);
                                            continue e
                                        }
                                        if (!l.body.value && u) {
                                            i = true;
                                            l = l.clone();
                                            l.condition = l.condition.negate(n);
                                            l.body = t(D, l, {body: r(l.alternative).concat(a)});
                                            l.alternative = null;
                                            a = [l.transform(n)];
                                            continue e
                                        }
                                        if (a.length == 1 && u && a[0]instanceof O && (!l.alternative || l.alternative instanceof O)) {
                                            i = true;
                                            a.push(t(Y, a[0], {value: t(Zt, a[0])}).transform(n));
                                            a = r(l.alternative).concat(a);
                                            a.unshift(l);
                                            continue e
                                        }
                                    }
                                    var p = c(l.body);
                                    var d = p instanceof et ? n.loopcontrol_target(p.label) : null;
                                    if (p && (p instanceof Y && !p.value && u || p instanceof nt && o === s(d) || p instanceof tt && d instanceof D && o === d)) {
                                        if (p.label) {
                                            g(p.label.thedef.references, p)
                                        }
                                        i = true;
                                        var v = r(l.body).slice(0, -1);
                                        l = l.clone();
                                        l.condition = l.condition.negate(n);
                                        l.body = t(D, l, {body: r(l.alternative).concat(a)});
                                        l.alternative = t(D, l, {body: v});
                                        a = [l.transform(n)];
                                        continue e
                                    }
                                    var p = c(l.alternative);
                                    var d = p instanceof et ? n.loopcontrol_target(p.label) : null;
                                    if (p && (p instanceof Y && !p.value && u || p instanceof nt && o === s(d) || p instanceof tt && d instanceof D && o === d)) {
                                        if (p.label) {
                                            g(p.label.thedef.references, p)
                                        }
                                        i = true;
                                        l = l.clone();
                                        l.body = t(D, l.body, {body: r(l.body).concat(a)});
                                        l.alternative = t(D, l.alternative, {body: r(l.alternative).slice(0, -1)});
                                        a = [l.transform(n)];
                                        continue e
                                    }
                                    a.unshift(l);
                                    break;
                                default:
                                    a.unshift(l);
                                    break
                            }
                        }
                        return a
                    }

                    function l(e, t) {
                        var n = false;
                        var r = e.length;
                        var o = t.self();
                        e = e.reduce(function (e, r) {
                            if (n) {
                                f(t, r, e)
                            } else {
                                if (r instanceof et) {
                                    var i = t.loopcontrol_target(r.label);
                                    if (r instanceof tt && i instanceof D && s(i) === o || r instanceof nt && s(i) === o) {
                                        if (r.label) {
                                            g(r.label.thedef.references, r)
                                        }
                                    } else {
                                        e.push(r)
                                    }
                                } else {
                                    e.push(r)
                                }
                                if (c(r))n = true
                            }
                            return e
                        }, []);
                        i = e.length != r;
                        return e
                    }

                    function h(e, n) {
                        function o() {
                            r = gt.from_array(r);
                            if (r)s.push(t(O, r, {body: r}));
                            r = []
                        }

                        if (e.length < 2)return e;
                        var r = [], s = [];
                        e.forEach(function (e) {
                            if (e instanceof O)r.push(e.body); else o(), s.push(e)
                        });
                        o();
                        s = p(s, n);
                        i = s.length != e.length;
                        return s
                    }

                    function p(e, n) {
                        function r(e) {
                            i.pop();
                            var t = s.body;
                            if (t instanceof gt) {
                                t.add(e)
                            } else {
                                t = gt.cons(t, e)
                            }
                            return t.transform(n)
                        }

                        var i = [], s = null;
                        e.forEach(function (e) {
                            if (s) {
                                if (e instanceof R) {
                                    var n = {};
                                    try {
                                        s.body.walk(new on(function (e) {
                                            if (e instanceof Tt && e.operator == "in")throw n
                                        }));
                                        if (e.init && !(e.init instanceof ct)) {
                                            e.init = r(e.init)
                                        } else if (!e.init) {
                                            e.init = s.body;
                                            i.pop()
                                        }
                                    } catch (o) {
                                        if (o !== n)throw o
                                    }
                                } else if (e instanceof rt) {
                                    e.condition = r(e.condition)
                                } else if (e instanceof z) {
                                    e.expression = r(e.expression)
                                } else if (e instanceof G && e.value) {
                                    e.value = r(e.value)
                                } else if (e instanceof G) {
                                    e.value = r(t(Zt, e))
                                } else if (e instanceof it) {
                                    e.expression = r(e.expression)
                                }
                            }
                            i.push(e);
                            s = e instanceof O ? e : null
                        });
                        return i
                    }

                    function d(e, t) {
                        var n = null;
                        return e.reduce(function (e, t) {
                            if (t instanceof ct && n && n.TYPE == t.TYPE) {
                                n.definitions = n.definitions.concat(t.definitions);
                                i = true
                            } else if (t instanceof R && n instanceof ct && (!t.init || t.init.TYPE == n.TYPE)) {
                                i = true;
                                e.pop();
                                if (t.init) {
                                    t.init.definitions = n.definitions.concat(t.init.definitions)
                                } else {
                                    t.init = n
                                }
                                e.push(t);
                                n = t
                            } else {
                                n = t;
                                e.push(t)
                            }
                            return e
                        }, [])
                    }

                    function v(e, n) {
                        e.forEach(function (e) {
                            if (e instanceof O) {
                                e.body = function n(e) {
                                    return e.transform(new zn(function (e) {
                                        if (e instanceof vt && e.expression instanceof J) {
                                            return t(St, e, {operator: "!", expression: e})
                                        } else if (e instanceof vt) {
                                            e.expression = n(e.expression)
                                        } else if (e instanceof gt) {
                                            e.car = n(e.car)
                                        } else if (e instanceof Nt) {
                                            var r = n(e.condition);
                                            if (r !== e.condition) {
                                                e.condition = r;
                                                var i = e.consequent;
                                                e.consequent = e.alternative;
                                                e.alternative = i
                                            }
                                        }
                                        return e
                                    }))
                                }(e.body)
                            }
                        })
                    }

                    var i;
                    do {
                        i = false;
                        if (n.option("angular")) {
                            e = o(e)
                        }
                        e = u(e);
                        if (n.option("dead_code")) {
                            e = l(e, n)
                        }
                        if (n.option("if_return")) {
                            e = a(e, n)
                        }
                        if (n.option("sequences")) {
                            e = h(e, n)
                        }
                        if (n.option("join_vars")) {
                            e = d(e, n)
                        }
                    } while (i);
                    if (n.option("negate_iife")) {
                        v(e, n)
                    }
                    return e;
                }

                function f(e, t, n) {
                    e.warn("Dropping unreachable code [{file}:{line},{col}]", t.start);
                    t.walk(new on(function (t) {
                        if (t instanceof ct) {
                            e.warn("Declarations in unreachable code! [{file}:{line},{col}]", t.start);
                            t.remove_initializers();
                            n.push(t);
                            return true
                        }
                        if (t instanceof K) {
                            n.push(t);
                            return true
                        }
                        if (t instanceof W) {
                            return true
                        }
                    }))
                }

                function l(e, t) {
                    return e.print_to_string().length > t.print_to_string().length ? t : e
                }

                function c(e) {
                    return e && e.aborts()
                }

                function h(e, n) {
                    function i(i) {
                        i = r(i);
                        if (e.body instanceof D) {
                            e.body = e.body.clone();
                            e.body.body = i.concat(e.body.body.slice(1));
                            e.body = e.body.transform(n)
                        } else {
                            e.body = t(D, e.body, {body: i}).transform(n)
                        }
                        h(e, n)
                    }

                    var s = e.body instanceof D ? e.body.body[0] : e.body;
                    if (s instanceof rt) {
                        if (s.body instanceof tt && n.loopcontrol_target(s.body.label) === e) {
                            if (e.condition) {
                                e.condition = t(Tt, e.condition, {
                                    left: e.condition,
                                    operator: "&&",
                                    right: s.condition.negate(n)
                                })
                            } else {
                                e.condition = s.condition.negate(n)
                            }
                            i(s.alternative)
                        } else if (s.alternative instanceof tt && n.loopcontrol_target(s.alternative.label) === e) {
                            if (e.condition) {
                                e.condition = t(Tt, e.condition, {
                                    left: e.condition,
                                    operator: "&&",
                                    right: s.condition
                                })
                            } else {
                                e.condition = s.condition
                            }
                            i(s.body)
                        }
                    }
                }

                function b(e, t) {
                    var n = t.option("pure_getters");
                    t.options.pure_getters = false;
                    var r = e.has_side_effects(t);
                    t.options.pure_getters = n;
                    return r
                }

                function N(e, n) {
                    if (n.option("booleans") && n.in_boolean_context()) {
                        return t(sn, e)
                    }
                    return e
                }

                e(C, function (e, t) {
                    return e
                });
                C.DEFMETHOD("equivalent_to", function (e) {
                    return this.print_to_string() == e.print_to_string()
                });
                (function (e) {
                    var t = ["!", "delete"];
                    var n = ["in", "instanceof", "==", "!=", "===", "!==", "<", "<=", ">=", ">"];
                    e(C, function () {
                        return false
                    });
                    e(St, function () {
                        return u(this.operator, t)
                    });
                    e(Tt, function () {
                        return u(this.operator, n) || (this.operator == "&&" || this.operator == "||") && this.left.is_boolean() && this.right.is_boolean()
                    });
                    e(Nt, function () {
                        return this.consequent.is_boolean() && this.alternative.is_boolean()
                    });
                    e(Ct, function () {
                        return this.operator == "=" && this.right.is_boolean()
                    });
                    e(gt, function () {
                        return this.cdr.is_boolean()
                    });
                    e(sn, function () {
                        return true
                    });
                    e(rn, function () {
                        return true
                    })
                })(function (e, t) {
                    e.DEFMETHOD("is_boolean", t)
                });
                (function (e) {
                    e(C, function () {
                        return false
                    });
                    e($t, function () {
                        return true
                    });
                    e(St, function () {
                        return this.operator == "typeof"
                    });
                    e(Tt, function (e) {
                        return this.operator == "+" && (this.left.is_string(e) || this.right.is_string(e))
                    });
                    e(Ct, function (e) {
                        return (this.operator == "=" || this.operator == "+=") && this.right.is_string(e)
                    });
                    e(gt, function (e) {
                        return this.cdr.is_string(e)
                    });
                    e(Nt, function (e) {
                        return this.consequent.is_string(e) && this.alternative.is_string(e)
                    });
                    e(vt, function (e) {
                        return e.option("unsafe") && this.expression instanceof zt && this.expression.name == "String" && this.expression.undeclared()
                    })
                })(function (e, t) {
                    e.DEFMETHOD("is_string", t)
                });
                (function (e) {
                    function t(e, t) {
                        if (!t)throw new Error("Compressor must be passed");
                        return e._eval(t)
                    }

                    C.DEFMETHOD("evaluate", function (t) {
                        if (!t.option("evaluate"))return [this];
                        try {
                            var r = this._eval(t);
                            return [l(n(t, r, this), this), r]
                        } catch (i) {
                            if (i !== e)throw i;
                            return [this]
                        }
                    });
                    e(k, function () {
                        throw new Error(m("Cannot evaluate a statement [{file}:{line},{col}]", this.start))
                    });
                    e(J, function () {
                        throw e
                    });
                    e(C, function () {
                        throw e
                    });
                    e(Vt, function () {
                        return this.getValue()
                    });
                    e(St, function (n) {
                        var r = this.expression;
                        switch (this.operator) {
                            case"!":
                                return !t(r, n);
                            case"typeof":
                                if (r instanceof J)return typeof function () {
                                };
                                r = t(r, n);
                                if (r instanceof RegExp)throw e;
                                return typeof r;
                            case"void":
                                return void t(r, n);
                            case"~":
                                return ~t(r, n);
                            case"-":
                                r = t(r, n);
                                if (r === 0)throw e;
                                return -r;
                            case"+":
                                return +t(r, n)
                        }
                        throw e
                    });
                    e(Tt, function (n) {
                        var r = this.left, i = this.right;
                        switch (this.operator) {
                            case"&&":
                                return t(r, n) && t(i, n);
                            case"||":
                                return t(r, n) || t(i, n);
                            case"|":
                                return t(r, n) | t(i, n);
                            case"&":
                                return t(r, n) & t(i, n);
                            case"^":
                                return t(r, n) ^ t(i, n);
                            case"+":
                                return t(r, n) + t(i, n);
                            case"*":
                                return t(r, n) * t(i, n);
                            case"/":
                                return t(r, n) / t(i, n);
                            case"%":
                                return t(r, n) % t(i, n);
                            case"-":
                                return t(r, n) - t(i, n);
                            case"<<":
                                return t(r, n) << t(i, n);
                            case">>":
                                return t(r, n) >> t(i, n);
                            case">>>":
                                return t(r, n) >>> t(i, n);
                            case"==":
                                return t(r, n) == t(i, n);
                            case"===":
                                return t(r, n) === t(i, n);
                            case"!=":
                                return t(r, n) != t(i, n);
                            case"!==":
                                return t(r, n) !== t(i, n);
                            case"<":
                                return t(r, n) < t(i, n);
                            case"<=":
                                return t(r, n) <= t(i, n);
                            case">":
                                return t(r, n) > t(i, n);
                            case">=":
                                return t(r, n) >= t(i, n);
                            case"in":
                                return t(r, n)in t(i, n);
                            case"instanceof":
                                return t(r, n)instanceof t(i, n)
                        }
                        throw e
                    });
                    e(Nt, function (e) {
                        return t(this.condition, e) ? t(this.consequent, e) : t(this.alternative, e)
                    });
                    e(zt, function (n) {
                        var r = this.definition();
                        if (r && r.constant && r.init)return t(r.init, n);
                        throw e
                    })
                })(function (e, t) {
                    e.DEFMETHOD("_eval", t)
                });
                (function (e) {
                    function n(e) {
                        return t(St, e, {operator: "!", expression: e})
                    }

                    e(C, function () {
                        return n(this)
                    });
                    e(k, function () {
                        throw new Error("Cannot negate a statement")
                    });
                    e(J, function () {
                        return n(this)
                    });
                    e(St, function () {
                        if (this.operator == "!")return this.expression;
                        return n(this)
                    });
                    e(gt, function (e) {
                        var t = this.clone();
                        t.cdr = t.cdr.negate(e);
                        return t
                    });
                    e(Nt, function (e) {
                        var t = this.clone();
                        t.consequent = t.consequent.negate(e);
                        t.alternative = t.alternative.negate(e);
                        return l(n(this), t)
                    });
                    e(Tt, function (e) {
                        var t = this.clone(), r = this.operator;
                        if (e.option("unsafe_comps")) {
                            switch (r) {
                                case"<=":
                                    t.operator = ">";
                                    return t;
                                case"<":
                                    t.operator = ">=";
                                    return t;
                                case">=":
                                    t.operator = "<";
                                    return t;
                                case">":
                                    t.operator = "<=";
                                    return t
                            }
                        }
                        switch (r) {
                            case"==":
                                t.operator = "!=";
                                return t;
                            case"!=":
                                t.operator = "==";
                                return t;
                            case"===":
                                t.operator = "!==";
                                return t;
                            case"!==":
                                t.operator = "===";
                                return t;
                            case"&&":
                                t.operator = "||";
                                t.left = t.left.negate(e);
                                t.right = t.right.negate(e);
                                return l(n(this), t);
                            case"||":
                                t.operator = "&&";
                                t.left = t.left.negate(e);
                                t.right = t.right.negate(e);
                                return l(n(this), t)
                        }
                        return n(this)
                    })
                })(function (e, t) {
                    e.DEFMETHOD("negate", function (e) {
                        return t.call(this, e)
                    })
                });
                (function (e) {
                    e(C, function (e) {
                        return true
                    });
                    e(P, function (e) {
                        return false
                    });
                    e(Vt, function (e) {
                        return false
                    });
                    e(Xt, function (e) {
                        return false
                    });
                    e(vt, function (e) {
                        var t = e.option("pure_funcs");
                        if (!t)return true;
                        return t.indexOf(this.expression.print_to_string()) < 0
                    });
                    e(_, function (e) {
                        for (var t = this.body.length; --t >= 0;) {
                            if (this.body[t].has_side_effects(e))return true
                        }
                        return false
                    });
                    e(O, function (e) {
                        return this.body.has_side_effects(e)
                    });
                    e(K, function (e) {
                        return true
                    });
                    e(J, function (e) {
                        return false
                    });
                    e(Tt, function (e) {
                        return this.left.has_side_effects(e) || this.right.has_side_effects(e)
                    });
                    e(Ct, function (e) {
                        return true
                    });
                    e(Nt, function (e) {
                        return this.condition.has_side_effects(e) || this.consequent.has_side_effects(e) || this.alternative.has_side_effects(e)
                    });
                    e(Et, function (e) {
                        return this.operator == "delete" || this.operator == "++" || this.operator == "--" || this.expression.has_side_effects(e)
                    });
                    e(zt, function (e) {
                        return false
                    });
                    e(Lt, function (e) {
                        for (var t = this.properties.length; --t >= 0;)if (this.properties[t].has_side_effects(e))return true;
                        return false
                    });
                    e(At, function (e) {
                        return this.value.has_side_effects(e)
                    });
                    e(kt, function (e) {
                        for (var t = this.elements.length; --t >= 0;)if (this.elements[t].has_side_effects(e))return true;
                        return false
                    });
                    e(bt, function (e) {
                        if (!e.option("pure_getters"))return true;
                        return this.expression.has_side_effects(e)
                    });
                    e(wt, function (e) {
                        if (!e.option("pure_getters"))return true;
                        return this.expression.has_side_effects(e) || this.property.has_side_effects(e)
                    });
                    e(yt, function (e) {
                        return !e.option("pure_getters")
                    });
                    e(gt, function (e) {
                        return this.car.has_side_effects(e) || this.cdr.has_side_effects(e)
                    })
                })(function (e, t) {
                    e.DEFMETHOD("has_side_effects", t)
                });
                (function (e) {
                    function t() {
                        var e = this.body.length;
                        return e > 0 && c(this.body[e - 1])
                    }

                    e(k, function () {
                        return null
                    });
                    e(Q, function () {
                        return this
                    });
                    e(D, t);
                    e(st, t);
                    e(rt, function () {
                        return this.alternative && c(this.body) && c(this.alternative)
                    })
                })(function (e, t) {
                    e.DEFMETHOD("aborts", t)
                });
                e(A, function (e, n) {
                    if (e.scope.has_directive(e.value) !== e.scope) {
                        return t(P, e)
                    }
                    return e
                });
                e(L, function (e, n) {
                    if (n.option("drop_debugger"))return t(P, e);
                    return e
                });
                e(B, function (e, n) {
                    if (e.body instanceof tt && n.loopcontrol_target(e.body.label) === e.body) {
                        return t(P, e)
                    }
                    return e.label.references.length == 0 ? e.body : e
                });
                e(_, function (e, t) {
                    e.body = o(e.body, t);
                    return e
                });
                e(D, function (e, n) {
                    e.body = o(e.body, n);
                    switch (e.body.length) {
                        case 1:
                            return e.body[0];
                        case 0:
                            return t(P, e)
                    }
                    return e
                });
                W.DEFMETHOD("drop_unused", function (e) {
                    var n = this;
                    if (e.option("unused") && !(n instanceof X) && !n.uses_eval) {
                        var r = [];
                        var i = new x;
                        var s = this;
                        var o = new on(function (t, u) {
                            if (t !== n) {
                                if (t instanceof K) {
                                    i.add(t.name.name, t);
                                    return true
                                }
                                if (t instanceof ct && s === n) {
                                    t.definitions.forEach(function (t) {
                                        if (t.value) {
                                            i.add(t.name.name, t.value);
                                            if (t.value.has_side_effects(e)) {
                                                t.value.walk(o)
                                            }
                                        }
                                    });
                                    return true
                                }
                                if (t instanceof zt) {
                                    v(r, t.definition());
                                    return true
                                }
                                if (t instanceof W) {
                                    var a = s;
                                    s = t;
                                    u();
                                    s = a;
                                    return true
                                }
                            }
                        });
                        n.walk(o);
                        for (var a = 0; a < r.length; ++a) {
                            r[a].orig.forEach(function (e) {
                                var t = i.get(e.name);
                                if (t)t.forEach(function (e) {
                                    var t = new on(function (e) {
                                        if (e instanceof zt) {
                                            v(r, e.definition())
                                        }
                                    });
                                    e.walk(t)
                                })
                            })
                        }
                        var f = new zn(function (s, o, a) {
                            if (s instanceof V && !(s instanceof $)) {
                                if (!e.option("keep_fargs")) {
                                    for (var l = s.argnames, c = l.length; --c >= 0;) {
                                        var h = l[c];
                                        if (h.unreferenced()) {
                                            l.pop();
                                            e.warn("Dropping unused function argument {name} [{file}:{line},{col}]", {
                                                name: h.name,
                                                file: h.start.file,
                                                line: h.start.line,
                                                col: h.start.col
                                            })
                                        } else break
                                    }
                                }
                            }
                            if (s instanceof K && s !== n) {
                                if (!u(s.name.definition(), r)) {
                                    e.warn("Dropping unused function {name} [{file}:{line},{col}]", {
                                        name: s.name.name,
                                        file: s.name.start.file,
                                        line: s.name.start.line,
                                        col: s.name.start.col
                                    });
                                    return t(P, s)
                                }
                                return s
                            }
                            if (s instanceof ct && !(f.parent()instanceof U)) {
                                var p = s.definitions.filter(function (t) {
                                    if (u(t.name.definition(), r))return true;
                                    var n = {
                                        name: t.name.name,
                                        file: t.name.start.file,
                                        line: t.name.start.line,
                                        col: t.name.start.col
                                    };
                                    if (t.value && t.value.has_side_effects(e)) {
                                        t._unused_side_effects = true;
                                        e.warn("Side effects in initialization of unused variable {name} [{file}:{line},{col}]", n);
                                        return true
                                    }
                                    e.warn("Dropping unused variable {name} [{file}:{line},{col}]", n);
                                    return false
                                });
                                p = y(p, function (e, t) {
                                    if (!e.value && t.value)return -1;
                                    if (!t.value && e.value)return 1;
                                    return 0
                                });
                                var v = [];
                                for (var c = 0; c < p.length;) {
                                    var m = p[c];
                                    if (m._unused_side_effects) {
                                        v.push(m.value);
                                        p.splice(c, 1)
                                    } else {
                                        if (v.length > 0) {
                                            v.push(m.value);
                                            m.value = gt.from_array(v);
                                            v = []
                                        }
                                        ++c
                                    }
                                }
                                if (v.length > 0) {
                                    v = t(D, s, {body: [t(O, s, {body: gt.from_array(v)})]})
                                } else {
                                    v = null
                                }
                                if (p.length == 0 && !v) {
                                    return t(P, s)
                                }
                                if (p.length == 0) {
                                    return v
                                }
                                s.definitions = p;
                                if (v) {
                                    v.body.unshift(s);
                                    s = v
                                }
                                return s
                            }
                            if (s instanceof R) {
                                o(s, this);
                                if (s.init instanceof D) {
                                    var g = s.init.body.slice(0, -1);
                                    s.init = s.init.body.slice(-1)[0].body;
                                    g.push(s);
                                    return a ? d.splice(g) : t(D, s, {body: g})
                                }
                            }
                            if (s instanceof W && s !== n)return s
                        });
                        n.transform(f)
                    }
                });
                W.DEFMETHOD("hoist_declarations", function (e) {
                    var n = e.option("hoist_funs");
                    var r = e.option("hoist_vars");
                    var i = this;
                    if (n || r) {
                        var s = [];
                        var o = [];
                        var u = new x, f = 0, l = 0;
                        i.walk(new on(function (e) {
                            if (e instanceof W && e !== i)return true;
                            if (e instanceof ht) {
                                ++l;
                                return true
                            }
                        }));
                        r = r && l > 1;
                        var c = new zn(function (a) {
                            if (a !== i) {
                                if (a instanceof A) {
                                    s.push(a);
                                    return t(P, a)
                                }
                                if (a instanceof K && n) {
                                    o.push(a);
                                    return t(P, a)
                                }
                                if (a instanceof ht && r) {
                                    a.definitions.forEach(function (e) {
                                        u.set(e.name.name, e);
                                        ++f
                                    });
                                    var l = a.to_assignments();
                                    var h = c.parent();
                                    if (h instanceof U && h.init === a) {
                                        if (l == null)return a.definitions[0].name;
                                        return l
                                    }
                                    if (h instanceof R && h.init === a) {
                                        return l
                                    }
                                    if (!l)return t(P, a);
                                    return t(O, a, {body: l})
                                }
                                if (a instanceof W)return a
                            }
                        });
                        i = i.transform(c);
                        if (f > 0) {
                            var h = [];
                            u.each(function (e, t) {
                                if (i instanceof V && a(function (t) {
                                        return t.name == e.name.name
                                    }, i.argnames)) {
                                    u.del(t)
                                } else {
                                    e = e.clone();
                                    e.value = null;
                                    h.push(e);
                                    u.set(t, e)
                                }
                            });
                            if (h.length > 0) {
                                for (var p = 0; p < i.body.length;) {
                                    if (i.body[p]instanceof O) {
                                        var d = i.body[p].body, v, m;
                                        if (d instanceof Ct && d.operator == "=" && (v = d.left)instanceof Dt && u.has(v.name)) {
                                            var y = u.get(v.name);
                                            if (y.value)break;
                                            y.value = d.right;
                                            g(h, y);
                                            h.push(y);
                                            i.body.splice(p, 1);
                                            continue
                                        }
                                        if (d instanceof gt && (m = d.car)instanceof Ct && m.operator == "=" && (v = m.left)instanceof Dt && u.has(v.name)) {
                                            var y = u.get(v.name);
                                            if (y.value)break;
                                            y.value = m.right;
                                            g(h, y);
                                            h.push(y);
                                            i.body[p].body = d.cdr;
                                            continue
                                        }
                                    }
                                    if (i.body[p]instanceof P) {
                                        i.body.splice(p, 1);
                                        continue
                                    }
                                    if (i.body[p]instanceof D) {
                                        var b = [p, 1].concat(i.body[p].body);
                                        i.body.splice.apply(i.body, b);
                                        continue
                                    }
                                    break
                                }
                                h = t(ht, i, {definitions: h});
                                o.push(h)
                            }
                        }
                        i.body = s.concat(o, i.body)
                    }
                    return i
                });
                e(O, function (e, n) {
                    if (n.option("side_effects")) {
                        if (!e.body.has_side_effects(n)) {
                            n.warn("Dropping side-effect-free statement [{file}:{line},{col}]", e.start);
                            return t(P, e)
                        }
                    }
                    return e
                });
                e(F, function (e, n) {
                    var r = e.condition.evaluate(n);
                    e.condition = r[0];
                    if (!n.option("loops"))return e;
                    if (r.length > 1) {
                        if (r[1]) {
                            return t(R, e, {body: e.body})
                        } else if (e instanceof q) {
                            if (n.option("dead_code")) {
                                var i = [];
                                f(n, e.body, i);
                                return t(D, e, {body: i})
                            }
                        }
                    }
                    return e
                });
                e(q, function (e, n) {
                    if (!n.option("loops"))return e;
                    e = F.prototype.optimize.call(e, n);
                    if (e instanceof q) {
                        h(e, n);
                        e = t(R, e, e).transform(n)
                    }
                    return e
                });
                e(R, function (e, n) {
                    var r = e.condition;
                    if (r) {
                        r = r.evaluate(n);
                        e.condition = r[0]
                    }
                    if (!n.option("loops"))return e;
                    if (r) {
                        if (r.length > 1 && !r[1]) {
                            if (n.option("dead_code")) {
                                var i = [];
                                if (e.init instanceof k) {
                                    i.push(e.init)
                                } else if (e.init) {
                                    i.push(t(O, e.init, {body: e.init}))
                                }
                                f(n, e.body, i);
                                return t(D, e, {body: i})
                            }
                        }
                    }
                    h(e, n);
                    return e
                });
                e(rt, function (e, n) {
                    if (!n.option("conditionals"))return e;
                    var r = e.condition.evaluate(n);
                    e.condition = r[0];
                    if (r.length > 1) {
                        if (r[1]) {
                            n.warn("Condition always true [{file}:{line},{col}]", e.condition.start);
                            if (n.option("dead_code")) {
                                var s = [];
                                if (e.alternative) {
                                    f(n, e.alternative, s)
                                }
                                s.push(e.body);
                                return t(D, e, {body: s}).transform(n)
                            }
                        } else {
                            n.warn("Condition always false [{file}:{line},{col}]", e.condition.start);
                            if (n.option("dead_code")) {
                                var s = [];
                                f(n, e.body, s);
                                if (e.alternative)s.push(e.alternative);
                                return t(D, e, {body: s}).transform(n)
                            }
                        }
                    }
                    if (i(e.alternative))e.alternative = null;
                    var o = e.condition.negate(n);
                    var u = l(e.condition, o) === o;
                    if (e.alternative && u) {
                        u = false;
                        e.condition = o;
                        var a = e.body;
                        e.body = e.alternative || t(P);
                        e.alternative = a
                    }
                    if (i(e.body) && i(e.alternative)) {
                        return t(O, e.condition, {body: e.condition}).transform(n)
                    }
                    if (e.body instanceof O && e.alternative instanceof O) {
                        return t(O, e, {
                            body: t(Nt, e, {
                                condition: e.condition,
                                consequent: e.body.body,
                                alternative: e.alternative.body
                            })
                        }).transform(n)
                    }
                    if (i(e.alternative) && e.body instanceof O) {
                        if (u)return t(O, e, {
                            body: t(Tt, e, {
                                operator: "||",
                                left: o,
                                right: e.body.body
                            })
                        }).transform(n);
                        return t(O, e, {
                            body: t(Tt, e, {
                                operator: "&&",
                                left: e.condition,
                                right: e.body.body
                            })
                        }).transform(n)
                    }
                    if (e.body instanceof P && e.alternative && e.alternative instanceof O) {
                        return t(O, e, {
                            body: t(Tt, e, {
                                operator: "||",
                                left: e.condition,
                                right: e.alternative.body
                            })
                        }).transform(n)
                    }
                    if (e.body instanceof G && e.alternative instanceof G && e.body.TYPE == e.alternative.TYPE) {
                        return t(e.body.CTOR, e, {
                            value: t(Nt, e, {
                                condition: e.condition,
                                consequent: e.body.value || t(Zt, e.body).optimize(n),
                                alternative: e.alternative.value || t(Zt, e.alternative).optimize(n)
                            })
                        }).transform(n)
                    }
                    if (e.body instanceof rt && !e.body.alternative && !e.alternative) {
                        e.condition = t(Tt, e.condition, {
                            operator: "&&",
                            left: e.condition,
                            right: e.body.condition
                        }).transform(n);
                        e.body = e.body.body
                    }
                    if (c(e.body)) {
                        if (e.alternative) {
                            var h = e.alternative;
                            e.alternative = null;
                            return t(D, e, {body: [e, h]}).transform(n)
                        }
                    }
                    if (c(e.alternative)) {
                        var p = e.body;
                        e.body = e.alternative;
                        e.condition = u ? o : e.condition.negate(n);
                        e.alternative = null;
                        return t(D, e, {body: [e, p]}).transform(n)
                    }
                    return e
                });
                e(it, function (e, n) {
                    if (e.body.length == 0 && n.option("conditionals")) {
                        return t(O, e, {body: e.expression}).transform(n)
                    }
                    for (; ;) {
                        var r = e.body[e.body.length - 1];
                        if (r) {
                            var i = r.body[r.body.length - 1];
                            if (i instanceof tt && s(n.loopcontrol_target(i.label)) === e)r.body.pop();
                            if (r instanceof ot && r.body.length == 0) {
                                e.body.pop();
                                continue
                            }
                        }
                        break
                    }
                    var o = e.expression.evaluate(n);
                    e:if (o.length == 2)try {
                        e.expression = o[0];
                        if (!n.option("dead_code"))break e;
                        var u = o[1];
                        var a = false;
                        var f = false;
                        var l = false;
                        var h = false;
                        var p = false;
                        var v = new zn(function (r, i, s) {
                            if (r instanceof V || r instanceof O) {
                                return r
                            } else if (r instanceof it && r === e) {
                                r = r.clone();
                                i(r, this);
                                return p ? r : t(D, r, {
                                    body: r.body.reduce(function (e, t) {
                                        return e.concat(t.body)
                                    }, [])
                                }).transform(n)
                            } else if (r instanceof rt || r instanceof at) {
                                var o = a;
                                a = !f;
                                i(r, this);
                                a = o;
                                return r
                            } else if (r instanceof H || r instanceof it) {
                                var o = f;
                                f = true;
                                i(r, this);
                                f = o;
                                return r
                            } else if (r instanceof tt && this.loopcontrol_target(r.label) === e) {
                                if (a) {
                                    p = true;
                                    return r
                                }
                                if (f)return r;
                                h = true;
                                return s ? d.skip : t(P, r)
                            } else if (r instanceof st && this.parent() === e) {
                                if (h)return d.skip;
                                if (r instanceof ut) {
                                    var v = r.expression.evaluate(n);
                                    if (v.length < 2) {
                                        throw e
                                    }
                                    if (v[1] === u || l) {
                                        l = true;
                                        if (c(r))h = true;
                                        i(r, this);
                                        return r
                                    }
                                    return d.skip
                                }
                                i(r, this);
                                return r
                            }
                        });
                        v.stack = n.stack.slice();
                        e = e.transform(v)
                    } catch (m) {
                        if (m !== e)throw m
                    }
                    return e
                });
                e(ut, function (e, t) {
                    e.body = o(e.body, t);
                    return e
                });
                e(at, function (e, t) {
                    e.body = o(e.body, t);
                    return e
                });
                ct.DEFMETHOD("remove_initializers", function () {
                    this.definitions.forEach(function (e) {
                        e.value = null
                    })
                });
                ct.DEFMETHOD("to_assignments", function () {
                    var e = this.definitions.reduce(function (e, n) {
                        if (n.value) {
                            var r = t(zt, n.name, n.name);
                            e.push(t(Ct, n, {operator: "=", left: r, right: n.value}))
                        }
                        return e
                    }, []);
                    if (e.length == 0)return null;
                    return gt.from_array(e)
                });
                e(ct, function (e, n) {
                    if (e.definitions.length == 0)return t(P, e);
                    return e
                });
                e(J, function (e, t) {
                    e = V.prototype.optimize.call(e, t);
                    if (t.option("unused")) {
                        if (e.name && e.name.unreferenced()) {
                            e.name = null
                        }
                    }
                    return e
                });
                e(vt, function (e, r) {
                    if (r.option("unsafe")) {
                        var i = e.expression;
                        if (i instanceof zt && i.undeclared()) {
                            switch (i.name) {
                                case"Array":
                                    if (e.args.length != 1) {
                                        return t(kt, e, {elements: e.args}).transform(r)
                                    }
                                    break;
                                case"Object":
                                    if (e.args.length == 0) {
                                        return t(Lt, e, {properties: []})
                                    }
                                    break;
                                case"String":
                                    if (e.args.length == 0)return t($t, e, {value: ""});
                                    if (e.args.length <= 1)return t(Tt, e, {
                                        left: e.args[0],
                                        operator: "+",
                                        right: t($t, e, {value: ""})
                                    }).transform(r);
                                    break;
                                case"Number":
                                    if (e.args.length == 0)return t(Jt, e, {value: 0});
                                    if (e.args.length == 1)return t(St, e, {
                                        expression: e.args[0],
                                        operator: "+"
                                    }).transform(r);
                                case"Boolean":
                                    if (e.args.length == 0)return t(rn, e);
                                    if (e.args.length == 1)return t(St, e, {
                                        expression: t(St, null, {
                                            expression: e.args[0],
                                            operator: "!"
                                        }), operator: "!"
                                    }).transform(r);
                                    break;
                                case"Function":
                                    if (S(e.args, function (e) {
                                            return e instanceof $t
                                        })) {
                                        try {
                                            var s = "(function(" + e.args.slice(0, -1).map(function (e) {
                                                    return e.value
                                                }).join(",") + "){" + e.args[e.args.length - 1].value + "})()";
                                            var o = Un(s);
                                            o.figure_out_scope({screw_ie8: r.option("screw_ie8")});
                                            var u = new $n(r.options);
                                            o = o.transform(u);
                                            o.figure_out_scope({screw_ie8: r.option("screw_ie8")});
                                            o.mangle_names();
                                            var a;
                                            try {
                                                o.walk(new on(function (e) {
                                                    if (e instanceof V) {
                                                        a = e;
                                                        throw o
                                                    }
                                                }))
                                            } catch (f) {
                                                if (f !== o)throw f
                                            }
                                            var c = a.argnames.map(function (n, r) {
                                                return t($t, e.args[r], {value: n.print_to_string()})
                                            });
                                            var s = Vn();
                                            D.prototype._codegen.call(a, a, s);
                                            s = s.toString().replace(/^\{|\}$/g, "");
                                            c.push(t($t, e.args[e.args.length - 1], {value: s}));
                                            e.args = c;
                                            return e
                                        } catch (f) {
                                            if (f instanceof Mn) {
                                                r.warn("Error parsing code passed to new Function [{file}:{line},{col}]", e.args[e.args.length - 1].start);
                                                r.warn(f.toString())
                                            } else {
                                                console.log(f);
                                                throw f
                                            }
                                        }
                                    }
                                    break
                            }
                        } else if (i instanceof bt && i.property == "toString" && e.args.length == 0) {
                            return t(Tt, e, {
                                left: t($t, e, {value: ""}),
                                operator: "+",
                                right: i.expression
                            }).transform(r)
                        } else if (i instanceof bt && i.expression instanceof kt && i.property == "join")e:{
                            var h = e.args.length == 0 ? "," : e.args[0].evaluate(r)[1];
                            if (h == null)break e;
                            var p = i.expression.elements.reduce(function (e, t) {
                                t = t.evaluate(r);
                                if (e.length == 0 || t.length == 1) {
                                    e.push(t)
                                } else {
                                    var i = e[e.length - 1];
                                    if (i.length == 2) {
                                        var s = "" + i[1] + h + t[1];
                                        e[e.length - 1] = [n(r, s, i[0]), s]
                                    } else {
                                        e.push(t)
                                    }
                                }
                                return e
                            }, []);
                            if (p.length == 0)return t($t, e, {value: ""});
                            if (p.length == 1)return p[0][0];
                            if (h == "") {
                                var d;
                                if (p[0][0]instanceof $t || p[1][0]instanceof $t) {
                                    d = p.shift()[0]
                                } else {
                                    d = t($t, e, {value: ""})
                                }
                                return p.reduce(function (e, n) {
                                    return t(Tt, n[0], {operator: "+", left: e, right: n[0]})
                                }, d).transform(r)
                            }
                            var v = e.clone();
                            v.expression = v.expression.clone();
                            v.expression.expression = v.expression.expression.clone();
                            v.expression.expression.elements = p.map(function (e) {
                                return e[0]
                            });
                            return l(e, v)
                        }
                    }
                    if (r.option("side_effects")) {
                        if (e.expression instanceof J && e.args.length == 0 && !_.prototype.has_side_effects.call(e.expression, r)) {
                            return t(Zt, e).transform(r)
                        }
                    }
                    if (r.option("drop_console")) {
                        if (e.expression instanceof yt && e.expression.expression instanceof zt && e.expression.expression.name == "console" && e.expression.expression.undeclared()) {
                            return t(Zt, e).transform(r)
                        }
                    }
                    return e.evaluate(r)[0]
                });
                e(mt, function (e, n) {
                    if (n.option("unsafe")) {
                        var r = e.expression;
                        if (r instanceof zt && r.undeclared()) {
                            switch (r.name) {
                                case"Object":
                                case"RegExp":
                                case"Function":
                                case"Error":
                                case"Array":
                                    return t(vt, e, e).transform(n)
                            }
                        }
                    }
                    return e
                });
                e(gt, function (e, n) {
                    if (!n.option("side_effects"))return e;
                    if (!e.car.has_side_effects(n)) {
                        var r;
                        if (!(e.cdr instanceof zt && e.cdr.name == "eval" && e.cdr.undeclared() && (r = n.parent())instanceof vt && r.expression === e)) {
                            return e.cdr
                        }
                    }
                    if (n.option("cascade")) {
                        if (e.car instanceof Ct && !e.car.left.has_side_effects(n)) {
                            if (e.car.left.equivalent_to(e.cdr)) {
                                return e.car
                            }
                            if (e.cdr instanceof vt && e.cdr.expression.equivalent_to(e.car.left)) {
                                e.cdr.expression = e.car;
                                return e.cdr
                            }
                        }
                        if (!e.car.has_side_effects(n) && !e.cdr.has_side_effects(n) && e.car.equivalent_to(e.cdr)) {
                            return e.car
                        }
                    }
                    if (e.cdr instanceof St && e.cdr.operator == "void" && !e.cdr.expression.has_side_effects(n)) {
                        e.cdr.operator = e.car;
                        return e.cdr
                    }
                    if (e.cdr instanceof Zt) {
                        return t(St, e, {operator: "void", expression: e.car})
                    }
                    return e
                });
                Et.DEFMETHOD("lift_sequences", function (e) {
                    if (e.option("sequences")) {
                        if (this.expression instanceof gt) {
                            var t = this.expression;
                            var n = t.to_array();
                            this.expression = n.pop();
                            n.push(this);
                            t = gt.from_array(n).transform(e);
                            return t
                        }
                    }
                    return this
                });
                e(xt, function (e, t) {
                    return e.lift_sequences(t)
                });
                e(St, function (e, n) {
                    e = e.lift_sequences(n);
                    var r = e.expression;
                    if (n.option("booleans") && n.in_boolean_context()) {
                        switch (e.operator) {
                            case"!":
                                if (r instanceof St && r.operator == "!") {
                                    return r.expression
                                }
                                break;
                            case"typeof":
                                n.warn("Boolean expression always true [{file}:{line},{col}]", e.start);
                                return t(sn, e)
                        }
                        if (r instanceof Tt && e.operator == "!") {
                            e = l(e, r.negate(n))
                        }
                    }
                    return e.evaluate(n)[0]
                });
                Tt.DEFMETHOD("lift_sequences", function (e) {
                    if (e.option("sequences")) {
                        if (this.left instanceof gt) {
                            var t = this.left;
                            var n = t.to_array();
                            this.left = n.pop();
                            n.push(this);
                            t = gt.from_array(n).transform(e);
                            return t
                        }
                        if (this.right instanceof gt && this instanceof Ct && !b(this.left, e)) {
                            var t = this.right;
                            var n = t.to_array();
                            this.right = n.pop();
                            n.push(this);
                            t = gt.from_array(n).transform(e);
                            return t
                        }
                    }
                    return this
                });
                var w = E("== === != !== * & | ^");
                e(Tt, function (e, n) {
                    var r = n.has_directive("use asm") ? p : function (t, r) {
                        if (r || !(e.left.has_side_effects(n) || e.right.has_side_effects(n))) {
                            if (t)e.operator = t;
                            var i = e.left;
                            e.left = e.right;
                            e.right = i
                        }
                    };
                    if (w(e.operator)) {
                        if (e.right instanceof Vt && !(e.left instanceof Vt)) {
                            if (!(e.left instanceof Tt && In[e.left.operator] >= In[e.operator])) {
                                r(null, true)
                            }
                        }
                        if (/^[!=]==?$/.test(e.operator)) {
                            if (e.left instanceof zt && e.right instanceof Nt) {
                                if (e.right.consequent instanceof zt && e.right.consequent.definition() === e.left.definition()) {
                                    if (/^==/.test(e.operator))return e.right.condition;
                                    if (/^!=/.test(e.operator))return e.right.condition.negate(n)
                                }
                                if (e.right.alternative instanceof zt && e.right.alternative.definition() === e.left.definition()) {
                                    if (/^==/.test(e.operator))return e.right.condition.negate(n);
                                    if (/^!=/.test(e.operator))return e.right.condition
                                }
                            }
                            if (e.right instanceof zt && e.left instanceof Nt) {
                                if (e.left.consequent instanceof zt && e.left.consequent.definition() === e.right.definition()) {
                                    if (/^==/.test(e.operator))return e.left.condition;
                                    if (/^!=/.test(e.operator))return e.left.condition.negate(n)
                                }
                                if (e.left.alternative instanceof zt && e.left.alternative.definition() === e.right.definition()) {
                                    if (/^==/.test(e.operator))return e.left.condition.negate(n);
                                    if (/^!=/.test(e.operator))return e.left.condition
                                }
                            }
                        }
                    }
                    e = e.lift_sequences(n);
                    if (n.option("comparisons"))switch (e.operator) {
                        case"===":
                        case"!==":
                            if (e.left.is_string(n) && e.right.is_string(n) || e.left.is_boolean() && e.right.is_boolean()) {
                                e.operator = e.operator.substr(0, 2)
                            }
                            ;
                        case"==":
                        case"!=":
                            if (e.left instanceof $t && e.left.value == "undefined" && e.right instanceof St && e.right.operator == "typeof" && n.option("unsafe")) {
                                if (!(e.right.expression instanceof zt) || !e.right.expression.undeclared()) {
                                    e.right = e.right.expression;
                                    e.left = t(Zt, e.left).optimize(n);
                                    if (e.operator.length == 2)e.operator += "="
                                }
                            }
                            break
                    }
                    if (n.option("booleans") && n.in_boolean_context())switch (e.operator) {
                        case"&&":
                            var i = e.left.evaluate(n);
                            var s = e.right.evaluate(n);
                            if (i.length > 1 && !i[1] || s.length > 1 && !s[1]) {
                                n.warn("Boolean && always false [{file}:{line},{col}]", e.start);
                                return t(rn, e)
                            }
                            if (i.length > 1 && i[1]) {
                                return s[0]
                            }
                            if (s.length > 1 && s[1]) {
                                return i[0]
                            }
                            break;
                        case"||":
                            var i = e.left.evaluate(n);
                            var s = e.right.evaluate(n);
                            if (i.length > 1 && i[1] || s.length > 1 && s[1]) {
                                n.warn("Boolean || always true [{file}:{line},{col}]", e.start);
                                return t(sn, e)
                            }
                            if (i.length > 1 && !i[1]) {
                                return s[0]
                            }
                            if (s.length > 1 && !s[1]) {
                                return i[0]
                            }
                            break;
                        case"+":
                            var i = e.left.evaluate(n);
                            var s = e.right.evaluate(n);
                            if (i.length > 1 && i[0]instanceof $t && i[1] || s.length > 1 && s[0]instanceof $t && s[1]) {
                                n.warn("+ in boolean context always true [{file}:{line},{col}]", e.start);
                                return t(sn, e)
                            }
                            break
                    }
                    if (n.option("comparisons")) {
                        if (!(n.parent()instanceof Tt) || n.parent()instanceof Ct) {
                            var o = t(St, e, {operator: "!", expression: e.negate(n)});
                            e = l(e, o)
                        }
                        switch (e.operator) {
                            case"<":
                                r(">");
                                break;
                            case"<=":
                                r(">=");
                                break
                        }
                    }
                    if (e.operator == "+" && e.right instanceof $t && e.right.getValue() === "" && e.left instanceof Tt && e.left.operator == "+" && e.left.is_string(n)) {
                        return e.left
                    }
                    if (n.option("evaluate")) {
                        if (e.operator == "+") {
                            if (e.left instanceof Vt && e.right instanceof Tt && e.right.operator == "+" && e.right.left instanceof Vt && e.right.is_string(n)) {
                                e = t(Tt, e, {
                                    operator: "+",
                                    left: t($t, null, {
                                        value: "" + e.left.getValue() + e.right.left.getValue(),
                                        start: e.left.start,
                                        end: e.right.left.end
                                    }),
                                    right: e.right.right
                                })
                            }
                            if (e.right instanceof Vt && e.left instanceof Tt && e.left.operator == "+" && e.left.right instanceof Vt && e.left.is_string(n)) {
                                e = t(Tt, e, {
                                    operator: "+",
                                    left: e.left.left,
                                    right: t($t, null, {
                                        value: "" + e.left.right.getValue() + e.right.getValue(),
                                        start: e.left.right.start,
                                        end: e.right.end
                                    })
                                })
                            }
                            if (e.left instanceof Tt && e.left.operator == "+" && e.left.is_string(n) && e.left.right instanceof Vt && e.right instanceof Tt && e.right.operator == "+" && e.right.left instanceof Vt && e.right.is_string(n)) {
                                e = t(Tt, e, {
                                    operator: "+",
                                    left: t(Tt, e.left, {
                                        operator: "+",
                                        left: e.left.left,
                                        right: t($t, null, {
                                            value: "" + e.left.right.getValue() + e.right.left.getValue(),
                                            start: e.left.right.start,
                                            end: e.right.left.end
                                        })
                                    }),
                                    right: e.right.right
                                })
                            }
                        }
                    }
                    if (e.right instanceof Tt && e.right.operator == e.operator && (e.operator == "*" || e.operator == "&&" || e.operator == "||")) {
                        e.left = t(Tt, e.left, {operator: e.operator, left: e.left, right: e.right.left});
                        e.right = e.right.right;
                        return e.transform(n)
                    }
                    return e.evaluate(n)[0]
                });
                e(zt, function (e, r) {
                    if (e.undeclared()) {
                        var i = r.option("global_defs");
                        if (i && i.hasOwnProperty(e.name)) {
                            return n(r, i[e.name], e)
                        }
                        switch (e.name) {
                            case"undefined":
                                return t(Zt, e);
                            case"NaN":
                                return t(Yt, e);
                            case"Infinity":
                                return t(tn, e)
                        }
                    }
                    return e
                });
                e(Zt, function (e, n) {
                    if (n.option("unsafe")) {
                        var r = n.find_parent(W);
                        var i = r.find_variable("undefined");
                        if (i) {
                            var s = t(zt, e, {name: "undefined", scope: r, thedef: i});
                            s.reference();
                            return s
                        }
                    }
                    return e
                });
                var T = ["+", "-", "/", "*", "%", ">>", "<<", ">>>", "|", "^", "&"];
                e(Ct, function (e, t) {
                    e = e.lift_sequences(t);
                    if (e.operator == "=" && e.left instanceof zt && e.right instanceof Tt && e.right.left instanceof zt && e.right.left.name == e.left.name && u(e.right.operator, T)) {
                        e.operator = e.right.operator + "=";
                        e.right = e.right.right
                    }
                    return e
                });
                e(Nt, function (e, n) {
                    if (!n.option("conditionals"))return e;
                    if (e.condition instanceof gt) {
                        var r = e.condition.car;
                        e.condition = e.condition.cdr;
                        return gt.cons(r, e)
                    }
                    var i = e.condition.evaluate(n);
                    if (i.length > 1) {
                        if (i[1]) {
                            n.warn("Condition always true [{file}:{line},{col}]", e.start);
                            return e.consequent
                        } else {
                            n.warn("Condition always false [{file}:{line},{col}]", e.start);
                            return e.alternative
                        }
                    }
                    var s = i[0].negate(n);
                    if (l(i[0], s) === s) {
                        e = t(Nt, e, {condition: s, consequent: e.alternative, alternative: e.consequent})
                    }
                    var o = e.consequent;
                    var u = e.alternative;
                    if (o instanceof Ct && u instanceof Ct && o.operator == u.operator && o.left.equivalent_to(u.left)) {
                        return t(Ct, e, {
                            operator: o.operator,
                            left: o.left,
                            right: t(Nt, e, {condition: e.condition, consequent: o.right, alternative: u.right})
                        })
                    }
                    if (o instanceof vt && u.TYPE === o.TYPE && o.args.length == u.args.length && o.expression.equivalent_to(u.expression)) {
                        if (o.args.length == 0) {
                            return t(gt, e, {car: e.condition, cdr: o})
                        }
                        if (o.args.length == 1) {
                            o.args[0] = t(Nt, e, {
                                condition: e.condition,
                                consequent: o.args[0],
                                alternative: u.args[0]
                            });
                            return o
                        }
                    }
                    if (o instanceof Nt && o.alternative.equivalent_to(u)) {
                        return t(Nt, e, {
                            condition: t(Tt, e, {left: e.condition, operator: "&&", right: o.condition}),
                            consequent: o.consequent,
                            alternative: u
                        })
                    }
                    return e
                });
                e(nn, function (e, n) {
                    if (n.option("booleans")) {
                        var r = n.parent();
                        if (r instanceof Tt && (r.operator == "==" || r.operator == "!=")) {
                            n.warn("Non-strict equality against boolean: {operator} {value} [{file}:{line},{col}]", {
                                operator: r.operator,
                                value: e.value,
                                file: r.start.file,
                                line: r.start.line,
                                col: r.start.col
                            });
                            return t(Jt, e, {value: +e.value})
                        }
                        return t(St, e, {operator: "!", expression: t(Jt, e, {value: 1 - e.value})})
                    }
                    return e
                });
                e(wt, function (e, n) {
                    var r = e.property;
                    if (r instanceof $t && n.option("properties")) {
                        r = r.getValue();
                        if (fn(r) ? n.option("screw_ie8") : An(r)) {
                            return t(bt, e, {expression: e.expression, property: r})
                        }
                        var i = parseFloat(r);
                        if (!isNaN(i) && i.toString() == r) {
                            e.property = t(Jt, e.property, {value: i})
                        }
                    }
                    return e
                });
                e(kt, N);
                e(Lt, N);
                e(Kt, N)
            })();
            "use strict";
            "use strict";
            (function () {
                function t(e) {
                    var t = "prefix"in e ? e.prefix : e.type == "UnaryExpression" ? true : false;
                    return new (t ? St : xt)({start: r(e), end: i(e), operator: e.operator, expression: u(e.argument)})
                }

                function r(e) {
                    return new N({
                        file: e.loc && e.loc.source,
                        line: e.loc && e.loc.start.line,
                        col: e.loc && e.loc.start.column,
                        pos: e.start,
                        endpos: e.start
                    })
                }

                function i(e) {
                    return new N({
                        file: e.loc && e.loc.source,
                        line: e.loc && e.loc.end.line,
                        col: e.loc && e.loc.end.column,
                        pos: e.end,
                        endpos: e.end
                    })
                }

                function s(t, n, s) {
                    var o = "function From_Moz_" + t + "(M){\n";
                    o += "return new mytype({\n" + "start: my_start_token(M),\n" + "end: my_end_token(M)";
                    if (s)s.split(/\s*,\s*/).forEach(function (e) {
                        var t = /([a-z0-9$_]+)(=|@|>|%)([a-z0-9$_]+)/i.exec(e);
                        if (!t)throw new Error("Can't understand property map: " + e);
                        var n = "M." + t[1], r = t[2], i = t[3];
                        o += ",\n" + i + ": ";
                        if (r == "@") {
                            o += n + ".map(from_moz)"
                        } else if (r == ">") {
                            o += "from_moz(" + n + ")"
                        } else if (r == "=") {
                            o += n
                        } else if (r == "%") {
                            o += "from_moz(" + n + ").body"
                        } else throw new Error("Can't understand operator in propmap: " + e)
                    });
                    o += "\n})}";
                    o = (new Function("mytype", "my_start_token", "my_end_token", "from_moz", "return(" + o + ")"))(n, r, i, u);
                    return e[t] = o
                }

                function u(t) {
                    o.push(t);
                    var n = t != null ? e[t.type](t) : null;
                    o.pop();
                    return n
                }

                var e = {
                    TryStatement: function (e) {
                        return new at({
                            start: r(e),
                            end: i(e),
                            body: u(e.block).body,
                            bcatch: u(e.handlers[0]),
                            bfinally: e.finalizer ? new lt(u(e.finalizer)) : null
                        })
                    }, CatchClause: function (e) {
                        return new ft({start: r(e), end: i(e), argname: u(e.param), body: u(e.body).body})
                    }, ObjectExpression: function (e) {
                        return new Lt({
                            start: r(e), end: i(e), properties: e.properties.map(function (e) {
                                var t = e.key;
                                var n = t.type == "Identifier" ? t.name : t.value;
                                var s = {start: r(t), end: i(e.value), key: n, value: u(e.value)};
                                switch (e.kind) {
                                    case"init":
                                        return new Ot(s);
                                    case"set":
                                        s.value.name = u(t);
                                        return new Mt(s);
                                    case"get":
                                        s.value.name = u(t);
                                        return new _t(s)
                                }
                            })
                        })
                    }, SequenceExpression: function (e) {
                        return gt.from_array(e.expressions.map(u))
                    }, MemberExpression: function (e) {
                        return new (e.computed ? wt : bt)({
                            start: r(e),
                            end: i(e),
                            property: e.computed ? u(e.property) : e.property.name,
                            expression: u(e.object)
                        })
                    }, SwitchCase: function (e) {
                        return new (e.test ? ut : ot)({
                            start: r(e),
                            end: i(e),
                            expression: u(e.test),
                            body: e.consequent.map(u)
                        })
                    }, Literal: function (e) {
                        var t = e.value, n = {start: r(e), end: i(e)};
                        if (t === null)return new Gt(n);
                        switch (typeof t) {
                            case"string":
                                n.value = t;
                                return new $t(n);
                            case"number":
                                n.value = t;
                                return new Jt(n);
                            case"boolean":
                                return new (t ? sn : rn)(n);
                            default:
                                n.value = t;
                                return new Kt(n)
                        }
                    }, UnaryExpression: t, UpdateExpression: t, Identifier: function (e) {
                        var t = o[o.length - 2];
                        return new (e.name == "this" ? Xt : t.type == "LabeledStatement" ? Ut : t.type == "VariableDeclarator" && t.id === e ? t.kind == "const" ? jt : Bt : t.type == "FunctionExpression" ? t.id === e ? qt : Ft : t.type == "FunctionDeclaration" ? t.id === e ? It : Ft : t.type == "CatchClause" ? Rt : t.type == "BreakStatement" || t.type == "ContinueStatement" ? Wt : zt)({
                            start: r(e),
                            end: i(e),
                            name: e.name
                        })
                    }
                };
                var n = {};
                s("Node", C);
                s("Program", X, "body@body");
                s("Function", J, "id>name, params@argnames, body%body");
                s("EmptyStatement", P);
                s("BlockStatement", D, "body@body");
                s("ExpressionStatement", O, "expression>body");
                s("IfStatement", rt, "test>condition, consequent>body, alternate>alternative");
                s("LabeledStatement", B, "label>label, body>body");
                s("BreakStatement", tt, "label>label");
                s("ContinueStatement", nt, "label>label");
                s("WithStatement", z, "object>expression, body>body");
                s("SwitchStatement", it, "discriminant>expression, cases@body");
                s("ReturnStatement", Y, "argument>value");
                s("ThrowStatement", Z, "argument>value");
                s("WhileStatement", q, "test>condition, body>body");
                s("DoWhileStatement", I, "test>condition, body>body");
                s("ForStatement", R, "init>init, test>condition, update>step, body>body");
                s("ForInStatement", U, "left>init, right>object, body>body");
                s("DebuggerStatement", L);
                s("FunctionDeclaration", K, "id>name, params@argnames, body%body");
                s("VariableDeclaration", ht, "declarations@definitions");
                s("VariableDeclarator", dt, "id>name, init>value");
                s("ThisExpression", Xt);
                s("ArrayExpression", kt, "elements@elements");
                s("FunctionExpression", J, "id>name, params@argnames, body%body");
                s("BinaryExpression", Tt, "operator=operator, left>left, right>right");
                s("AssignmentExpression", Ct, "operator=operator, left>left, right>right");
                s("LogicalExpression", Tt, "operator=operator, left>left, right>right");
                s("ConditionalExpression", Nt, "test>condition, consequent>consequent, alternate>alternative");
                s("NewExpression", mt, "callee>expression, arguments@args");
                s("CallExpression", vt, "callee>expression, arguments@args");
                var o = null;
                C.from_mozilla_ast = function (e) {
                    var t = o;
                    o = [];
                    var n = u(e);
                    o = t;
                    return n
                }
            })();
            C.warn_function = function (e) {
                n.error("uglifyjs2 WARN: " + e)
            };
            e.minify = function (e, t, n) {
                t = c(t, {
                    spidermonkey: false,
                    outSourceMap: null,
                    sourceRoot: null,
                    inSourceMap: null,
                    fromString: false,
                    warnings: false,
                    mangle: {},
                    output: null,
                    compress: {}
                });
                Xn.reset();
                var i = null, s = {};
                if (t.spidermonkey) {
                    i = C.from_mozilla_ast(e)
                } else {
                    if (typeof e == "string")e = [e];
                    e.forEach(function (e) {
                        var o = t.fromString ? e : r.readFile(e, "utf8");
                        s[e] = o;
                        i = Un(o, {filename: t.fromString ? n : e, toplevel: i})
                    })
                }
                if (t.compress) {
                    var o = {warnings: t.warnings};
                    h(o, t.compress);
                    i.figure_out_scope();
                    var u = $n(o);
                    i = i.transform(u)
                }
                if (t.mangle) {
                    i.figure_out_scope();
                    i.compute_char_frequency();
                    i.mangle_names(t.mangle)
                }
                var a = t.inSourceMap;
                var f = {};
                if (typeof t.inSourceMap == "string") {
                    a = r.readFile(t.inSourceMap, "utf8")
                }
                if (t.outSourceMap) {
                    f.source_map = Jn({file: t.outSourceMap, orig: a, root: t.sourceRoot});
                    if (t.sourceMapIncludeSources) {
                        for (var l in s) {
                            if (s.hasOwnProperty(l)) {
                                t.source_map.get().setSourceContent(l, s[l])
                            }
                        }
                    }
                }
                if (t.output) {
                    h(f, t.output)
                }
                var p = Vn(f);
                i.print(p);
                return {code: p + "", map: f.source_map + ""}
            };
            e.describe_ast = function () {
                function t(n) {
                    e.print("AST_" + n.TYPE);
                    var r = n.SELF_PROPS.filter(function (e) {
                        return !/^\$/.test(e)
                    });
                    if (r.length > 0) {
                        e.space();
                        e.with_parens(function () {
                            r.forEach(function (t, n) {
                                if (n)e.space();
                                e.print(t)
                            })
                        })
                    }
                    if (n.documentation) {
                        e.space();
                        e.print_string(n.documentation)
                    }
                    if (n.SUBCLASSES.length > 0) {
                        e.space();
                        e.with_block(function () {
                            n.SUBCLASSES.forEach(function (n, r) {
                                e.indent();
                                t(n);
                                e.newline()
                            })
                        })
                    }
                }

                var e = Vn({beautify: true});
                t(C);
                return e + ""
            }
        });
        define("parse", ["./esprimaAdapter", "lang"], function (esprima, lang) {
            "use strict";
            function arrayToString(e) {
                var t = "[";
                if (e) {
                    e.forEach(function (e, n) {
                        t += (n > 0 ? "," : "") + '"' + lang.jsEscape(e) + '"'
                    })
                }
                t += "]";
                return t
            }

            function traverse(e, t) {
                var n, r;
                if (!e) {
                    return
                }
                if (t.call(null, e) === false) {
                    return false
                }
                for (n in e) {
                    if (e.hasOwnProperty(n)) {
                        r = e[n];
                        if (typeof r === "object" && r !== null) {
                            if (traverse(r, t) === false) {
                                return false
                            }
                        }
                    }
                }
            }

            function traverseBroad(e, t) {
                var n, r;
                if (!e) {
                    return
                }
                if (t.call(null, e) === false) {
                    return false
                }
                for (n in e) {
                    if (e.hasOwnProperty(n)) {
                        r = e[n];
                        if (typeof r === "object" && r !== null) {
                            traverseBroad(r, t)
                        }
                    }
                }
            }

            function getValidDeps(e) {
                if (!e || e.type !== "ArrayExpression" || !e.elements) {
                    return
                }
                var t = [];
                e.elements.some(function (e) {
                    if (e.type === "Literal") {
                        t.push(e.value)
                    }
                });
                return t.length ? t : undefined
            }

            function parse(e, t, n, r) {
                r = r || {};
                var i, s, o, u = [], a = "", f = [], l = true, c = esprima.parse(n);
                parse.recurse(c, function (t, n, i, s, o, a, c) {
                    if (!s) {
                        s = []
                    }
                    if (t === "define" && (!i || i === e)) {
                        l = false
                    }
                    if (!i) {
                        u = u.concat(s)
                    } else {
                        f.push({name: i, deps: s})
                    }
                    if (t === "define" && a && hasProp(c, a)) {
                        return a
                    }
                    return !!r.findNestedDependencies
                }, r);
                if (r.insertNeedsDefine && l) {
                    a += 'require.needsDefine("' + e + '");'
                }
                if (u.length || f.length) {
                    for (i = 0; i < f.length; i++) {
                        s = f[i];
                        if (a) {
                            a += "\n"
                        }
                        if (s.name === e) {
                            s.deps = s.deps.concat(u);
                            u = []
                        }
                        o = arrayToString(s.deps);
                        a += 'define("' + s.name + '",' + o + ");"
                    }
                    if (u.length) {
                        if (a) {
                            a += "\n"
                        }
                        o = arrayToString(u);
                        a += 'define("' + e + '",' + o + ");"
                    }
                }
                return a || null
            }

            var argPropName = "arguments", emptyScope = {}, mixin = lang.mixin, hasProp = lang.hasProp;
            parse.traverse = traverse;
            parse.traverseBroad = traverseBroad;
            parse.recurse = function (e, t, n, r) {
                var i, s, o, u, a, f, l = n && n.has;
                r = r || emptyScope;
                if (!e) {
                    return
                }
                if (l && e.type === "IfStatement" && e.test.type && e.test.type === "Literal") {
                    if (e.test.value) {
                        this.recurse(e.consequent, t, n, r)
                    } else {
                        this.recurse(e.alternate, t, n, r)
                    }
                } else {
                    o = this.parseNode(e, t, r);
                    if (o === false) {
                        return
                    } else if (typeof o === "string") {
                        return o
                    }
                    if (e.type === "ExpressionStatement" && e.expression && e.expression.type === "CallExpression" && e.expression.callee && e.expression.callee.type === "FunctionExpression") {
                        e = e.expression.callee;
                        if (e.params && e.params.length) {
                            a = e.params;
                            r = mixin({}, r, true);
                            for (u = 0; u < a.length; u++) {
                                f = a[u];
                                if (f.type === "Identifier") {
                                    r[f.name] = true
                                }
                            }
                        }
                    }
                    for (i in e) {
                        if (e.hasOwnProperty(i)) {
                            s = e[i];
                            if (typeof s === "object" && s !== null) {
                                o = this.recurse(s, t, n, r);
                                if (typeof o === "string") {
                                    break
                                }
                            }
                        }
                    }
                    if (typeof o === "string") {
                        if (hasProp(r, o)) {
                            return
                        }
                        return o
                    }
                }
            };
            parse.definesRequire = function (e, t) {
                var n = false;
                traverse(esprima.parse(t), function (e) {
                    if (parse.hasDefineAmd(e)) {
                        n = true;
                        return false
                    }
                });
                return n
            };
            parse.getAnonDeps = function (e, t) {
                var n = typeof t === "string" ? esprima.parse(t) : t, r = this.findAnonDefineFactory(n);
                return parse.getAnonDepsFromNode(r)
            };
            parse.getAnonDepsFromNode = function (e) {
                var t = [], n;
                if (e) {
                    this.findRequireDepNames(e, t);
                    n = e.params && e.params.length;
                    if (n) {
                        t = (n > 1 ? ["require", "exports", "module"] : ["require"]).concat(t)
                    }
                }
                return t
            };
            parse.isDefineNodeWithArgs = function (e) {
                return e && e.type === "CallExpression" && e.callee && e.callee.type === "Identifier" && e.callee.name === "define" && e[argPropName]
            };
            parse.findAnonDefineFactory = function (e) {
                var t;
                traverse(e, function (e) {
                    var n, r;
                    if (parse.isDefineNodeWithArgs(e)) {
                        n = e[argPropName][0];
                        if (n && n.type === "FunctionExpression") {
                            t = n;
                            return false
                        }
                        r = e[argPropName][1];
                        if (n.type === "Literal" && r && r.type === "FunctionExpression") {
                            t = r;
                            return false
                        }
                    }
                });
                return t
            };
            parse.findConfig = function (fileContents) {
                var jsConfig, foundConfig, stringData, foundRange, quote, quoteMatch, quoteRegExp = /(:\s|\[\s*)(['"])/, astRoot = esprima.parse(fileContents, {loc: true});
                traverse(astRoot, function (e) {
                    var t, n = parse.hasRequire(e);
                    if (n && (n === "require" || n === "requirejs" || n === "requireConfig" || n === "requirejsConfig")) {
                        t = e[argPropName] && e[argPropName][0];
                        if (t && t.type === "ObjectExpression") {
                            stringData = parse.nodeToString(fileContents, t);
                            jsConfig = stringData.value;
                            foundRange = stringData.range;
                            return false
                        }
                    } else {
                        t = parse.getRequireObjectLiteral(e);
                        if (t) {
                            stringData = parse.nodeToString(fileContents, t);
                            jsConfig = stringData.value;
                            foundRange = stringData.range;
                            return false
                        }
                    }
                });
                if (jsConfig) {
                    quoteMatch = quoteRegExp.exec(jsConfig);
                    quote = quoteMatch && quoteMatch[2] || '"';
                    foundConfig = eval("(" + jsConfig + ")")
                }
                return {config: foundConfig, range: foundRange, quote: quote}
            };
            parse.getRequireObjectLiteral = function (e) {
                if (e.id && e.id.type === "Identifier" && (e.id.name === "require" || e.id.name === "requirejs") && e.init && e.init.type === "ObjectExpression") {
                    return e.init
                }
            };
            parse.renameNamespace = function (e, t) {
                var n, r = [], i = esprima.parse(e, {loc: true});
                parse.recurse(i, function (e, t, n, i, s) {
                    r.push(s.loc);
                    return e !== "define"
                }, {});
                if (r.length) {
                    n = e.split("\n");
                    r.reverse();
                    r.forEach(function (e) {
                        var r = e.start.column, i = e.start.line - 1, s = n[i];
                        n[i] = s.substring(0, r) + t + "." + s.substring(r, s.length)
                    });
                    e = n.join("\n")
                }
                return e
            };
            parse.findDependencies = function (e, t, n) {
                var r = [], i = esprima.parse(t);
                parse.recurse(i, function (e, t, n, i) {
                    if (i) {
                        r = r.concat(i)
                    }
                }, n);
                return r
            };
            parse.findCjsDependencies = function (e, t) {
                var n = [];
                traverse(esprima.parse(t), function (e) {
                    var t;
                    if (e && e.type === "CallExpression" && e.callee && e.callee.type === "Identifier" && e.callee.name === "require" && e[argPropName] && e[argPropName].length === 1) {
                        t = e[argPropName][0];
                        if (t.type === "Literal") {
                            n.push(t.value)
                        }
                    }
                });
                return n
            };
            parse.hasDefDefine = function (e) {
                return e.type === "FunctionDeclaration" && e.id && e.id.type === "Identifier" && e.id.name === "define"
            };
            parse.hasDefineAmd = function (e) {
                return e && e.type === "AssignmentExpression" && e.left && e.left.type === "MemberExpression" && e.left.object && e.left.object.name === "define" && e.left.property && e.left.property.name === "amd"
            };
            parse.refsDefineAmd = function (e) {
                return e && e.type === "MemberExpression" && e.object && e.object.name === "define" && e.object.type === "Identifier" && e.property && e.property.name === "amd" && e.property.type === "Identifier"
            };
            parse.hasRequire = function (e) {
                var t, n = e && e.callee;
                if (e && e.type === "CallExpression" && n) {
                    if (n.type === "Identifier" && (n.name === "require" || n.name === "requirejs")) {
                        t = n.name
                    } else if (n.type === "MemberExpression" && n.object && n.object.type === "Identifier" && (n.object.name === "require" || n.object.name === "requirejs") && n.property && n.property.name === "config") {
                        t = n.object.name + "Config"
                    }
                }
                return t
            };
            parse.hasDefine = function (e) {
                return e && e.type === "CallExpression" && e.callee && e.callee.type === "Identifier" && e.callee.name === "define"
            };
            parse.getNamedDefine = function (e) {
                var t;
                traverse(esprima.parse(e), function (e) {
                    if (e && e.type === "CallExpression" && e.callee && e.callee.type === "Identifier" && e.callee.name === "define" && e[argPropName] && e[argPropName][0] && e[argPropName][0].type === "Literal") {
                        t = e[argPropName][0].value;
                        return false
                    }
                });
                return t
            };
            parse.usesAmdOrRequireJs = function (e, t) {
                var n;
                traverse(esprima.parse(t), function (e) {
                    var t, r, i;
                    if (parse.hasDefDefine(e)) {
                        t = "declaresDefine"
                    } else if (parse.hasDefineAmd(e)) {
                        t = "defineAmd"
                    } else {
                        r = parse.hasRequire(e);
                        if (r) {
                            i = e[argPropName] && e[argPropName][0];
                            if (i && (i.type === "ObjectExpression" || i.type === "ArrayExpression")) {
                                t = r
                            }
                        } else if (parse.hasDefine(e)) {
                            t = "define"
                        }
                    }
                    if (t) {
                        if (!n) {
                            n = {}
                        }
                        n[t] = true
                    }
                });
                return n
            };
            parse.usesCommonJs = function (e, t) {
                var n = null, r = false;
                traverse(esprima.parse(t), function (e) {
                    var t, i = e.expression || e.init;
                    if (e.type === "Identifier" && (e.name === "__dirname" || e.name === "__filename")) {
                        t = e.name.substring(2)
                    } else if (e.type === "VariableDeclarator" && e.id && e.id.type === "Identifier" && e.id.name === "exports") {
                        t = "varExports"
                    } else if (i && i.type === "AssignmentExpression" && i.left && i.left.type === "MemberExpression" && i.left.object) {
                        if (i.left.object.name === "module" && i.left.property && i.left.property.name === "exports") {
                            t = "moduleExports"
                        } else if (i.left.object.name === "exports" && i.left.property) {
                            t = "exports"
                        }
                    } else if (e && e.type === "CallExpression" && e.callee && e.callee.type === "Identifier" && e.callee.name === "require" && e[argPropName] && e[argPropName].length === 1 && e[argPropName][0].type === "Literal") {
                        t = "require"
                    }
                    if (t) {
                        if (t === "varExports") {
                            r = true
                        } else if (t !== "exports" || !r) {
                            if (!n) {
                                n = {}
                            }
                            n[t] = true
                        }
                    }
                });
                return n
            };
            parse.findRequireDepNames = function (e, t) {
                traverse(e, function (e) {
                    var n;
                    if (e && e.type === "CallExpression" && e.callee && e.callee.type === "Identifier" && e.callee.name === "require" && e[argPropName] && e[argPropName].length === 1) {
                        n = e[argPropName][0];
                        if (n.type === "Literal") {
                            t.push(n.value)
                        }
                    }
                })
            };
            parse.parseNode = function (e, t, n) {
                var r, i, s, o, u, a, f, l, c = e && e[argPropName], h = parse.hasRequire(e);
                if (h === "require" || h === "requirejs") {
                    o = e[argPropName] && e[argPropName][0];
                    if (o.type !== "ArrayExpression") {
                        if (o.type === "ObjectExpression") {
                            o = e[argPropName][1]
                        }
                    }
                    i = getValidDeps(o);
                    if (!i) {
                        return
                    }
                    return t("require", null, null, i, e)
                } else if (parse.hasDefine(e) && c && c.length) {
                    r = c[0];
                    i = c[1];
                    u = c[2];
                    if (r.type === "ArrayExpression") {
                        u = i;
                        i = r;
                        r = null
                    } else if (r.type === "FunctionExpression") {
                        u = r;
                        r = i = null
                    } else if (r.type !== "Literal") {
                        r = i = u = null
                    }
                    if (r && r.type === "Literal" && i) {
                        if (i.type === "FunctionExpression") {
                            u = i;
                            i = null
                        } else if (i.type === "ObjectExpression") {
                            i = u = null
                        } else if (i.type === "Identifier" && c.length === 2) {
                            i = u = null
                        }
                    }
                    if (i && i.type === "ArrayExpression") {
                        i = getValidDeps(i)
                    } else if (u && u.type === "FunctionExpression") {
                        s = parse.getAnonDepsFromNode(u);
                        if (s.length) {
                            i = s
                        }
                    } else if (i || u) {
                        return
                    }
                    if (r && r.type === "Literal") {
                        r = r.value
                    }
                    return t("define", null, r, i, e, u && u.type === "Identifier" ? u.name : undefined, n)
                } else if (e.type === "CallExpression" && e.callee && e.callee.type === "FunctionExpression" && e.callee.body && e.callee.body.body && e.callee.body.body.length === 1 && e.callee.body.body[0].type === "IfStatement") {
                    l = e.callee.body.body[0];
                    if (l.consequent && l.consequent.body) {
                        a = l.consequent.body[0];
                        if (a.type === "ExpressionStatement" && a.expression && parse.hasDefine(a.expression) && a.expression.arguments && a.expression.arguments.length === 1 && a.expression.arguments[0].type === "Identifier") {
                            traverse(l.test, function (e) {
                                if (parse.refsDefineAmd(e)) {
                                    f = true;
                                    return false
                                }
                            });
                            if (f) {
                                return t("define", null, null, null, a.expression, a.expression.arguments[0].name, n)
                            }
                        }
                    }
                }
            };
            parse.nodeToString = function (e, t) {
                var n, r = t.loc, i = e.split("\n"), s = r.start.line > 1 ? i.slice(0, r.start.line - 1).join("\n") + "\n" : "", o = s + i[r.start.line - 1].substring(0, r.start.column);
                if (r.start.line === r.end.line) {
                    n = i[r.start.line - 1].substring(r.start.column, r.end.column)
                } else {
                    n = i[r.start.line - 1].substring(r.start.column) + "\n" + i.slice(r.start.line, r.end.line - 1).join("\n") + "\n" + i[r.end.line - 1].substring(0, r.end.column)
                }
                return {value: n, range: [o.length, o.length + n.length]}
            };
            parse.getLicenseComments = function (e, t) {
                var n, r, i, s, o, u, a = esprima.parse(t, {
                    comment: true,
                    range: true
                }), f = "", l = {}, c = t.indexOf("\r") === -1 ? "\n" : "\r\n";
                if (a.comments) {
                    for (o = 0; o < a.comments.length; o++) {
                        n = a.comments[o];
                        if (n.type === "Line") {
                            s = "//" + n.value + c;
                            r = n;
                            if (o + 1 >= a.comments.length) {
                                s += c
                            } else {
                                for (u = o + 1; u < a.comments.length; u++) {
                                    i = a.comments[u];
                                    if (i.type === "Line" && i.range[0] === r.range[1] + 1) {
                                        s += "//" + i.value + c;
                                        r = i
                                    } else {
                                        break
                                    }
                                }
                                s += c;
                                o = u - 1
                            }
                        } else {
                            s = "/*" + n.value + "*/" + c + c
                        }
                        if (!l[s] && (s.indexOf("license") !== -1 || n.type === "Block" && s.indexOf("/*!") === 0 || s.indexOf("opyright") !== -1 || s.indexOf("(c)") !== -1)) {
                            f += s;
                            l[s] = true
                        }
                    }
                }
                return f
            };
            return parse
        });
        define("transform", ["./esprimaAdapter", "./parse", "logger", "lang"], function (e, t, n, r) {
            "use strict";
            function f(e, t, n) {
                var r = a[n];
                return e.replace(r, "$&" + t)
            }

            var i, s = /^([ \t]+)/, o = /\{[\r\n]+([ \t]+)/, u = /^[_A-Za-z]([A-Za-z\d_]*)$/, a = {
                "\n": /\n/g,
                "\r\n": /\r\n/g
            };
            i = {
                toTransport: function (i, s, o, u, a, f) {
                    f = f || {};
                    var l, c, h, p, d = 0, v = false, m = [], g = function (e) {
                        if (f.useSourceUrl) {
                            e = 'eval("' + r.jsEscape(e) + "\\n//# sourceURL=" + (o.indexOf("/") === 0 ? "" : "/") + o + '");\n'
                        }
                        return e
                    };
                    try {
                        l = e.parse(u, {loc: true})
                    } catch (y) {
                        n.trace("toTransport skipping " + o + ": " + y.toString());
                        return u
                    }
                    t.traverse(l, function (e) {
                        var r, s, u, a, f, l, c, h, g, y, b = false;
                        if (e.type === "VariableDeclarator" && e.id && e.id.name === "define" && e.id.type === "Identifier") {
                            h = e.init;
                            if (h && h.callee && h.callee.type === "CallExpression" && h.callee.callee && h.callee.callee.type === "Identifier" && h.callee.callee.name === "require" && h.callee.arguments && h.callee.arguments.length === 1 && h.callee.arguments[0].type === "Literal" && h.callee.arguments[0].value && h.callee.arguments[0].value.indexOf("amdefine") !== -1) {
                            } else {
                                return false
                            }
                        }
                        b = i && e.type === "CallExpression" && e.callee && e.callee.object && e.callee.object.type === "Identifier" && e.callee.object.name === i && e.callee.property.type === "Identifier" && e.callee.property.name === "define";
                        if (b || t.isDefineNodeWithArgs(e)) {
                            r = e.arguments;
                            if (!r || !r.length) {
                                return
                            }
                            s = r[0];
                            u = s.loc;
                            if (r.length === 1) {
                                if (s.type === "Identifier") {
                                    f = true;
                                    l = "empty"
                                } else if (s.type === "FunctionExpression") {
                                    a = s;
                                    f = true;
                                    l = "scan"
                                } else if (s.type === "ObjectExpression") {
                                    f = true;
                                    l = "skip"
                                } else if (s.type === "Literal" && typeof s.value === "number") {
                                    f = true;
                                    l = "skip"
                                } else if (s.type === "UnaryExpression" && s.operator === "-" && s.argument && s.argument.type === "Literal" && typeof s.argument.value === "number") {
                                    f = true;
                                    l = "skip"
                                } else if (s.type === "MemberExpression" && s.object && s.property && s.property.type === "Identifier") {
                                    f = true;
                                    l = "empty"
                                }
                            } else if (s.type === "ArrayExpression") {
                                f = true;
                                l = "skip"
                            } else if (s.type === "Literal" && typeof s.value === "string") {
                                f = false;
                                if (r.length === 2 && r[1].type === "FunctionExpression") {
                                    a = r[1];
                                    l = "scan"
                                } else {
                                    l = "skip"
                                }
                            } else {
                                return
                            }
                            y = {
                                foundId: c,
                                needsId: f,
                                depAction: l,
                                namespaceExists: b,
                                node: e,
                                defineLoc: e.loc,
                                firstArgLoc: u,
                                factoryNode: a,
                                sourceUrlData: g
                            };
                            if (y.needsId) {
                                if (p) {
                                    n.trace(o + " has more than one anonymous " + "define. May be a built file from another " + "build system like, Ender. Skipping normalization.");
                                    m = [];
                                    return false
                                } else {
                                    p = y;
                                    m.push(y)
                                }
                            } else if (l === "scan") {
                                d += 1;
                                if (d > 1) {
                                    if (!v) {
                                        m = p ? [p] : [];
                                        v = true
                                    }
                                } else {
                                    m.push(y)
                                }
                            }
                        }
                    });
                    if (!m.length) {
                        return g(u)
                    }
                    m.reverse();
                    c = u.split("\n");
                    h = function (e, t) {
                        var n = e.start.column, r = e.start.line - 1, i = c[r];
                        c[r] = i.substring(0, n) + t + i.substring(n, i.length)
                    };
                    m.forEach(function (e) {
                        var n, r = "", o = "";
                        if (e.needsId && s) {
                            r += "'" + s + "',"
                        }
                        if (e.depAction === "scan") {
                            n = t.getAnonDepsFromNode(e.factoryNode);
                            if (n.length) {
                                o = "[" + n.map(function (e) {
                                        return "'" + e + "'"
                                    }) + "]"
                            } else {
                                o = "[]"
                            }
                            o += ",";
                            if (e.factoryNode) {
                                h(e.factoryNode.loc, o)
                            } else {
                                r += o
                            }
                        }
                        if (r) {
                            h(e.firstArgLoc, r)
                        }
                        if (i && !e.namespaceExists) {
                            h(e.defineLoc, i + ".")
                        }
                        if (a) {
                            a(e)
                        }
                    });
                    u = c.join("\n");
                    return g(u)
                }, modifyConfig: function (e, n) {
                    var r = t.findConfig(e), s = r.config;
                    if (s) {
                        s = n(s);
                        if (s) {
                            return i.serializeConfig(s, e, r.range[0], r.range[1], {quote: r.quote})
                        }
                    }
                    return e
                }, serializeConfig: function (e, t, n, r, u) {
                    var a, l, c, h, p = "", d = t.substring(0, n), v = t.substring(n, r), m = v.indexOf("\r") === -1 ? "\n" : "\r\n", g = d.lastIndexOf("\n");
                    if (g === -1) {
                        g = 0
                    }
                    l = s.exec(d.substring(g + 1, n));
                    if (l && l[1]) {
                        p = l[1]
                    }
                    l = o.exec(v);
                    if (l && l[1]) {
                        a = l[1]
                    }
                    if (!a || a.length < p) {
                        a = "  "
                    } else {
                        a = a.substring(p.length)
                    }
                    h = new RegExp("(" + m + ")" + a, "g");
                    c = i.objectToString(e, {indent: a, lineReturn: m, outDentRegExp: h, quote: u && u.quote});
                    c = f(c, p, m);
                    return d + c + t.substring(r)
                }, objectToString: function (e, t, n) {
                    var s, o, a, f = true, l = "", c = t.lineReturn, h = t.indent, p = t.outDentRegExp, d = t.quote || '"';
                    n = n || "";
                    a = n + h;
                    if (e === null) {
                        l = "null"
                    } else if (e === undefined) {
                        l = "undefined"
                    } else if (typeof e === "number" || typeof e === "boolean") {
                        l = e
                    } else if (typeof e === "string") {
                        l = d + r.jsEscape(e) + d
                    } else if (r.isArray(e)) {
                        r.each(e, function (e, n) {
                            l += (n !== 0 ? "," + c : "") + a + i.objectToString(e, t, a)
                        });
                        s = "[";
                        o = "]"
                    } else if (r.isFunction(e) || r.isRegExp(e)) {
                        l = e.toString().replace(p, "$1")
                    } else {
                        r.eachProp(e, function (e, n) {
                            l += (f ? "" : "," + c) + a + (u.test(n) ? n : d + r.jsEscape(n) + d) + ": " + i.objectToString(e, t, a);
                            f = false
                        });
                        s = "{";
                        o = "}"
                    }
                    if (s) {
                        l = s + c + l + c + n + o
                    }
                    return l
                }
            };
            return i
        });
        define("pragma", ["parse", "logger"], function (parse, logger) {
            "use strict";
            function Temp() {
            }

            function create(e, t) {
                Temp.prototype = e;
                var n = new Temp, r;
                Temp.prototype = null;
                if (t) {
                    for (r in t) {
                        if (t.hasOwnProperty(r) && !n.hasOwnProperty(r)) {
                            n[r] = t[r]
                        }
                    }
                }
                return n
            }

            var pragma = {
                conditionalRegExp: /(exclude|include)Start\s*\(\s*["'](\w+)["']\s*,(.*)\)/,
                useStrictRegExp: /['"]use strict['"];/g,
                hasRegExp: /has\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
                configRegExp: /(^|[^\.])(requirejs|require)(\.config)\s*\(/g,
                nsWrapRegExp: /\/\*requirejs namespace: true \*\//,
                apiDefRegExp: /var requirejs,\s*require,\s*define;/,
                defineCheckRegExp: /typeof\s+define\s*===?\s*["']function["']\s*&&\s*define\s*\.\s*amd/g,
                defineStringCheckRegExp: /typeof\s+define\s*===?\s*["']function["']\s*&&\s*define\s*\[\s*["']amd["']\s*\]/g,
                defineTypeFirstCheckRegExp: /\s*["']function["']\s*==(=?)\s*typeof\s+define\s*&&\s*define\s*\.\s*amd/g,
                defineJQueryRegExp: /typeof\s+define\s*===?\s*["']function["']\s*&&\s*define\s*\.\s*amd\s*&&\s*define\s*\.\s*amd\s*\.\s*jQuery/g,
                defineHasRegExp: /typeof\s+define\s*==(=)?\s*['"]function['"]\s*&&\s*typeof\s+define\.amd\s*==(=)?\s*['"]object['"]\s*&&\s*define\.amd/g,
                defineTernaryRegExp: /typeof\s+define\s*===?\s*['"]function["']\s*&&\s*define\s*\.\s*amd\s*\?\s*define/,
                amdefineRegExp: /if\s*\(\s*typeof define\s*\!==\s*'function'\s*\)\s*\{\s*[^\{\}]+amdefine[^\{\}]+\}/g,
                removeStrict: function (e, t) {
                    return t.useStrict ? e : e.replace(pragma.useStrictRegExp, "")
                },
                namespace: function (e, t, n) {
                    if (t) {
                        e = e.replace(pragma.configRegExp, "$1" + t + ".$2$3(");
                        e = parse.renameNamespace(e, t);
                        e = e.replace(pragma.defineTernaryRegExp, "typeof " + t + ".define === 'function' && " + t + ".define.amd ? " + t + ".define");
                        e = e.replace(pragma.defineJQueryRegExp, "typeof " + t + ".define === 'function' && " + t + ".define.amd && " + t + ".define.amd.jQuery");
                        e = e.replace(pragma.defineHasRegExp, "typeof " + t + ".define === 'function' && typeof " + t + ".define.amd === 'object' && " + t + ".define.amd");
                        e = e.replace(pragma.defineCheckRegExp, "typeof " + t + ".define === 'function' && " + t + ".define.amd");
                        e = e.replace(pragma.defineStringCheckRegExp, "typeof " + t + ".define === 'function' && " + t + ".define['amd']");
                        e = e.replace(pragma.defineTypeFirstCheckRegExp, "'function' === typeof " + t + ".define && " + t + ".define.amd");
                        if (pragma.apiDefRegExp.test(e) && e.indexOf("if (!" + t + " || !" + t + ".requirejs)") === -1) {
                            e = "var " + t + ";(function () { if (!" + t + " || !" + t + ".requirejs) {\n" + "if (!" + t + ") { " + t + " = {}; } else { require = " + t + "; }\n" + e + "\n" + t + ".requirejs = requirejs;" + t + ".require = require;" + t + ".define = define;\n" + "}\n}());"
                        }
                        if (pragma.nsWrapRegExp.test(e)) {
                            e = e.replace(pragma.nsWrapRegExp, "");
                            e = "(function () {\n" + "var require = " + t + ".require," + "requirejs = " + t + ".requirejs," + "define = " + t + ".define;\n" + e + "\n}());"
                        }
                    }
                    return e
                },
                process: function (fileName, fileContents, config, onLifecycleName, pluginCollector) {
                    var foundIndex = -1, startIndex = 0, lineEndIndex, conditionLine, matches, type, marker, condition, isTrue, endRegExp, endMatches, endMarkerIndex, shouldInclude, startLength, lifecycleHas, deps, i, dep, moduleName, collectorMod, lifecyclePragmas, pragmas = config.pragmas, hasConfig = config.has, kwArgs = pragmas;
                    if (onLifecycleName) {
                        lifecyclePragmas = config["pragmas" + onLifecycleName];
                        lifecycleHas = config["has" + onLifecycleName];
                        if (lifecyclePragmas) {
                            pragmas = create(pragmas || {}, lifecyclePragmas)
                        }
                        if (lifecycleHas) {
                            hasConfig = create(hasConfig || {}, lifecycleHas)
                        }
                    }
                    if (hasConfig) {
                        fileContents = fileContents.replace(pragma.hasRegExp, function (e, t) {
                            if (hasConfig.hasOwnProperty(t)) {
                                return !!hasConfig[t]
                            }
                            return e
                        })
                    }
                    if (!config.skipPragmas) {
                        while ((foundIndex = fileContents.indexOf("//>>", startIndex)) !== -1) {
                            lineEndIndex = fileContents.indexOf("\n", foundIndex);
                            if (lineEndIndex === -1) {
                                lineEndIndex = fileContents.length - 1
                            }
                            startIndex = lineEndIndex + 1;
                            conditionLine = fileContents.substring(foundIndex, lineEndIndex + 1);
                            matches = conditionLine.match(pragma.conditionalRegExp);
                            if (matches) {
                                type = matches[1];
                                marker = matches[2];
                                condition = matches[3];
                                isTrue = false;
                                try {
                                    isTrue = !!eval("(" + condition + ")")
                                } catch (e) {
                                    throw"Error in file: " + fileName + ". Conditional comment: " + conditionLine + " failed with this error: " + e
                                }
                                endRegExp = new RegExp("\\/\\/\\>\\>\\s*" + type + "End\\(\\s*['\"]" + marker + "['\"]\\s*\\)", "g");
                                endMatches = endRegExp.exec(fileContents.substring(startIndex, fileContents.length));
                                if (endMatches) {
                                    endMarkerIndex = startIndex + endRegExp.lastIndex - endMatches[0].length;
                                    lineEndIndex = fileContents.indexOf("\n", endMarkerIndex);
                                    if (lineEndIndex === -1) {
                                        lineEndIndex = fileContents.length - 1
                                    }
                                    shouldInclude = type === "exclude" && !isTrue || type === "include" && isTrue;
                                    startLength = startIndex - foundIndex;
                                    fileContents = fileContents.substring(0, foundIndex) + (shouldInclude ? fileContents.substring(startIndex, endMarkerIndex) : "") + fileContents.substring(lineEndIndex + 1, fileContents.length);
                                    startIndex = foundIndex
                                } else {
                                    throw"Error in file: " + fileName + ". Cannot find end marker for conditional comment: " + conditionLine
                                }
                            }
                        }
                    }
                    if (config.optimizeAllPluginResources && pluginCollector) {
                        try {
                            deps = parse.findDependencies(fileName, fileContents);
                            if (deps.length) {
                                for (i = 0; i < deps.length; i++) {
                                    dep = deps[i];
                                    if (dep.indexOf("!") !== -1) {
                                        moduleName = dep.split("!")[0];
                                        collectorMod = pluginCollector[moduleName];
                                        if (!collectorMod) {
                                            collectorMod = pluginCollector[moduleName] = []
                                        }
                                        collectorMod.push(dep)
                                    }
                                }
                            }
                        } catch (eDep) {
                            logger.error("Parse error looking for plugin resources in " + fileName + ", skipping.")
                        }
                    }
                    if (!config.keepAmdefine) {
                        fileContents = fileContents.replace(pragma.amdefineRegExp, "")
                    }
                    if (onLifecycleName === "OnSave" && config.namespace) {
                        fileContents = pragma.namespace(fileContents, config.namespace, onLifecycleName)
                    }
                    return pragma.removeStrict(fileContents, config)
                }
            };
            return pragma
        });
        if (env === "browser") {
            define("browser/optimize", {})
        }
        if (env === "node") {
            define("node/optimize", {})
        }
        if (env === "rhino") {
            define("rhino/optimize", ["logger", "env!env/file"], function (e, t) {
                function o(e, t) {
                    return n.invoke(null, [e, t])
                }

                function u(e, t) {
                    var n = new java.io.File(e), r, i;
                    i = n.getAbsoluteFile().getParentFile();
                    if (!i.exists()) {
                        if (!i.mkdirs()) {
                            throw"Could not create directory: " + i.getAbsolutePath()
                        }
                    }
                    if (t) {
                        r = new java.io.OutputStreamWriter(new java.io.FileOutputStream(n), t)
                    } else {
                        r = new java.io.OutputStreamWriter(new java.io.FileOutputStream(n))
                    }
                    return new java.io.BufferedWriter(r)
                }

                if (!Array.prototype.reduce) {
                    Array.prototype.reduce = function (e) {
                        var t = 0, n = this.length, r;
                        if (arguments.length >= 2) {
                            r = arguments[1]
                        } else {
                            if (n) {
                                while (!(t in this)) {
                                    t++
                                }
                                r = this[t++]
                            }
                        }
                        for (; t < n; t++) {
                            if (t in this) {
                                r = e.call(undefined, r, this[t], t, this)
                            }
                        }
                        return r
                    }
                }
                var n, r, i = /"file":"[^"]+"/;
                try {
                    n = java.lang.Class.forName("com.google.javascript.jscomp.JSSourceFile").getMethod("fromCode", [java.lang.String, java.lang.String])
                } catch (s) {
                    try {
                        n = java.lang.Class.forName("com.google.javascript.jscomp.SourceFile").getMethod("fromCode", [java.lang.String, java.lang.String])
                    } catch (s) {
                    }
                }
                r = {
                    closure: function (n, r, s, a, f) {
                        f = f || {};
                        var l, c, h, p, d, v, m, g, y, b, w, E = Packages.com.google.javascript.jscomp, S = Packages.com.google.common.flags, x = o(String(n), String(r)), T = new java.util.ArrayList, N, C, k, L, A = Packages.com.google.javascript.jscomp.Compiler, O = Packages.com.google.javascript.jscomp.CommandLineRunner;
                        e.trace("Minifying file: " + n);
                        d = (new java.io.File(n)).getName();
                        N = new E.CompilerOptions;
                        for (C in f.CompilerOptions) {
                            if (f.CompilerOptions[C]) {
                                N[C] = f.CompilerOptions[C]
                            }
                        }
                        N.prettyPrint = a || N.prettyPrint;
                        k = E.CompilationLevel[f.CompilationLevel || "SIMPLE_OPTIMIZATIONS"];
                        k.setOptionsForCompilationLevel(N);
                        if (f.generateSourceMaps) {
                            c = new java.util.ArrayList;
                            c.add(new com.google.javascript.jscomp.SourceMap.LocationMapping(n, d + ".src.js"));
                            N.setSourceMapLocationMappings(c);
                            N.setSourceMapOutputPath(n + ".map")
                        }
                        A.setLoggingLevel(Packages.java.util.logging.Level[f.loggingLevel || "WARNING"]);
                        L = new A;
                        T.add(x);
                        l = L.compile(O.getDefaultExterns(), T, N);
                        if (l.success) {
                            h = String(L.toSource());
                            if (f.generateSourceMaps && l.sourceMap && s) {
                                m = (new java.io.File(s)).getName();
                                b = s + ".src.js";
                                g = s + ".map";
                                if (t.exists(g)) {
                                    w = g.replace(/\.map$/, ".src.js.map");
                                    t.saveFile(w, t.readFile(g));
                                    t.saveFile(b, r.replace(/\/\# sourceMappingURL=(.+).map/, "/# sourceMappingURL=$1.src.js.map"))
                                } else {
                                    t.saveUtf8File(b, r)
                                }
                                v = u(g, "utf-8");
                                l.sourceMap.appendTo(v, s);
                                v.close();
                                t.saveFile(g, t.readFile(g).replace(i, '"file":"' + d + '"'));
                                r = h + "\n//# sourceMappingURL=" + m + ".map"
                            } else {
                                r = h
                            }
                            return r
                        } else {
                            throw new Error("Cannot closure compile file: " + n + ". Skipping it.")
                        }
                        return r
                    }
                };
                return r
            })
        }
        if (env === "xpconnect") {
            define("xpconnect/optimize", {})
        }
        define("optimize", ["lang", "logger", "env!env/optimize", "env!env/file", "parse", "pragma", "uglifyjs/index", "uglifyjs2", "source-map"], function (e, t, n, r, i, s, o, u, a) {
            "use strict";
            function m(e) {
                e = e.replace(/\s+$/, "");
                if (e.charAt(0) === "'" || e.charAt(0) === '"') {
                    e = e.substring(1, e.length - 1)
                }
                return e
            }

            function g(n, r, i, s) {
                return i.replace(h, function (i, o) {
                    var u, a, f, l, c = m(o);
                    c = c.replace(e.backSlashRegExp, "/");
                    u = c.charAt(0);
                    a = p.test(c);
                    if (u !== "/" && u !== "#" && !a) {
                        o = s + r + c
                    } else if (!a) {
                        t.trace(n + "\n  URL not a relative URL, skipping: " + o)
                    }
                    f = o.split("/");
                    for (l = f.length - 1; l > 0; l--) {
                        if (f[l] === ".") {
                            f.splice(l, 1)
                        } else if (f[l] === "..") {
                            if (l !== 0 && f[l - 1] !== "..") {
                                f.splice(l - 1, 2);
                                l -= 1
                            }
                        }
                    }
                    return "url(" + f.join("/") + ")"
                })
            }

            function y(n, i, s, o, u, a) {
                n = n.replace(e.backSlashRegExp, "/");
                var f = n.lastIndexOf("/"), h = f !== -1 ? n.substring(0, f + 1) : "", p = [], d = [];
                i = i.replace(c, "");
                if (s && s.charAt(s.length - 1) !== ",") {
                    s += ","
                }
                i = i.replace(l, function (i, a, f, l, c) {
                    if (c && c.replace(/^\s\s*/, "").replace(/\s\s*$/, "") !== "all") {
                        d.push(n);
                        return i
                    }
                    f = m(f);
                    if (s && s.indexOf(f + ",") !== -1) {
                        return i
                    }
                    f = f.replace(e.backSlashRegExp, "/");
                    try {
                        var v = f.charAt(0) === "/" ? f : h + f, b = r.readFile(v), w, E, S;
                        if (u[v]) {
                            return ""
                        }
                        u[v] = true;
                        S = y(v, b, s, o, u);
                        b = S.fileContents;
                        if (S.importList.length) {
                            p.push.apply(p, S.importList)
                        }
                        if (S.skippedList.length) {
                            d.push.apply(d, S.skippedList)
                        }
                        w = f.lastIndexOf("/");
                        E = w !== -1 ? f.substring(0, w + 1) : "";
                        E = E.replace(/^\.\//, "");
                        b = g(f, E, b, o);
                        p.push(v);
                        return b
                    } catch (x) {
                        t.warn(n + "\n  Cannot inline css import, skipping: " + f);
                        return i
                    }
                });
                if (o && a) {
                    i = g(n, "", i, o)
                }
                return {importList: p, skippedList: d, fileContents: i}
            }

            var f, l = /\@import\s+(url\()?\s*([^);]+)\s*(\))?([\w, ]*)(;)?/ig, c = /\/\*[^\*]*@import[^\*]*\*\//g, h = /\url\(\s*([^\)]+)\s*\)?/g, p = /^\w+:/, d = a.SourceMapGenerator, v = a.SourceMapConsumer;
            f = {
                jsFile: function (e, t, n, i, s) {
                    if (!t) {
                        t = r.readFile(e)
                    }
                    t = f.js(e, t, n, i, s);
                    r.saveUtf8File(n, t)
                }, js: function (e, r, o, u, a) {
                    var l, c, h = String(u.optimize).split("."), p = h[0], d = h[1] === "keepLines", v = "";
                    u = u || {};
                    r = s.process(e, r, u, "OnSave", a);
                    if (p && p !== "none") {
                        l = n[p] || f.optimizers[p];
                        if (!l) {
                            throw new Error('optimizer with name of "' + p + '" not found for this environment')
                        }
                        c = u[p] || {};
                        if (u.generateSourceMaps) {
                            c.generateSourceMaps = !!u.generateSourceMaps;
                            c._buildSourceMap = u._buildSourceMap
                        }
                        try {
                            if (u.preserveLicenseComments) {
                                try {
                                    v = i.getLicenseComments(e, r)
                                } catch (m) {
                                    throw new Error("Cannot parse file: " + e + " for comments. Skipping it. Error is:\n" + m.toString())
                                }
                            }
                            r = v + l(e, r, o, d, c);
                            if (c._buildSourceMap && c._buildSourceMap !== u._buildSourceMap) {
                                u._buildSourceMap = c._buildSourceMap
                            }
                        } catch (m) {
                            if (u.throwWhen && u.throwWhen.optimize) {
                                throw m
                            } else {
                                t.error(m)
                            }
                        }
                    } else {
                        if (u._buildSourceMap) {
                            u._buildSourceMap = null
                        }
                    }
                    return r
                }, cssFile: function (e, n, i) {
                    var s = r.readFile(e), o = y(e, s, i.cssImportIgnore, i.cssPrefix, {}, true), u = o.skippedList.length ? s : o.fileContents, a, f, l, c;
                    if (o.skippedList.length) {
                        t.warn("Cannot inline @imports for " + e + ",\nthe following files had media queries in them:\n" + o.skippedList.join("\n"))
                    }
                    try {
                        if (i.optimizeCss.indexOf(".keepComments") === -1) {
                            a = 0;
                            while ((a = u.indexOf("/*", a)) !== -1) {
                                f = u.indexOf("*/", a + 2);
                                if (f === -1) {
                                    throw"Improper comment in CSS file: " + e
                                }
                                c = u.substring(a, f);
                                if (i.preserveLicenseComments && (c.indexOf("license") !== -1 || c.indexOf("opyright") !== -1 || c.indexOf("(c)") !== -1)) {
                                    a = f
                                } else {
                                    u = u.substring(0, a) + u.substring(f + 2, u.length);
                                    a = 0
                                }
                            }
                        }
                        if (i.optimizeCss.indexOf(".keepLines") === -1) {
                            u = u.replace(/[\r\n]/g, " ");
                            u = u.replace(/\s+/g, " ");
                            u = u.replace(/\{\s/g, "{");
                            u = u.replace(/\s\}/g, "}")
                        } else {
                            u = u.replace(/(\r\n)+/g, "\r\n");
                            u = u.replace(/(\n)+/g, "\n")
                        }
                        if (i.optimizeCss.indexOf(".keepWhitespace") === -1) {
                            u = u.replace(/^[ \t]+/gm, "");
                            u = u.replace(/[ \t]+$/gm, "");
                            u = u.replace(/(;|:|\{|}|,)[ \t]+/g, "$1");
                            u = u.replace(/[ \t]+(\{)/g, "$1");
                            u = u.replace(/([ \t])+/g, "$1");
                            u = u.replace(/^[ \t]*[\r\n]/gm, "")
                        }
                    } catch (h) {
                        u = s;
                        t.error("Could not optimized CSS file: " + e + ", error: " + h)
                    }
                    r.saveUtf8File(n, u);
                    l = "\n" + n.replace(i.dir, "") + "\n----------------\n";
                    o.importList.push(e);
                    l += o.importList.map(function (e) {
                        return e.replace(i.dir, "")
                    }).join("\n");
                    return {importList: o.importList, buildText: l + "\n"}
                }, css: function (e, n) {
                    var i = "", s = [], o = n.dir && n.removeCombined, u, a, l, c;
                    if (n.optimizeCss.indexOf("standard") !== -1) {
                        c = r.getFilteredFileList(e, /\.css$/, true);
                        if (c) {
                            for (u = 0; u < c.length; u++) {
                                a = c[u];
                                t.trace("Optimizing (" + n.optimizeCss + ") CSS file: " + a);
                                l = f.cssFile(a, a, n);
                                i += l.buildText;
                                if (o) {
                                    l.importList.pop();
                                    s = s.concat(l.importList)
                                }
                            }
                        }
                        if (o) {
                            s.forEach(function (e) {
                                if (r.exists(e)) {
                                    r.deleteFile(e)
                                }
                            })
                        }
                    }
                    return i
                }, optimizers: {
                    uglify: function (e, n, r, i, s) {
                        var u = o.parser, a = o.uglify, f, l, c;
                        s = s || {};
                        t.trace("Uglifying file: " + e);
                        try {
                            f = u.parse(n, s.strict_semicolons);
                            if (s.no_mangle !== true) {
                                f = a.ast_mangle(f, s)
                            }
                            f = a.ast_squeeze(f, s);
                            n = a.gen_code(f, s);
                            if (s.max_line_length) {
                                n = a.split_lines(n, s.max_line_length)
                            }
                            n += ";"
                        } catch (h) {
                            l = h.toString();
                            c = /\nError(\r)?\n/.exec(l);
                            if (c) {
                                l = l.substring(0, c.index)
                            }
                            throw new Error("Cannot uglify file: " + e + ". Skipping it. Error is:\n" + l)
                        }
                        return n
                    }, uglify2: function (n, i, s, o, a) {
                        var f, l, c, h, p, m = {}, g = s + ".map", y = n && n.split("/").pop();
                        a = a || {};
                        e.mixin(m, a, true);
                        m.fromString = true;
                        if (a.generateSourceMaps && (s || a._buildSourceMap)) {
                            m.outSourceMap = y;
                            if (a._buildSourceMap) {
                                l = JSON.parse(a._buildSourceMap);
                                m.inSourceMap = l
                            } else if (r.exists(g)) {
                                m.inSourceMap = g;
                                l = JSON.parse(r.readFile(g))
                            }
                        }
                        t.trace("Uglify2 file: " + n);
                        try {
                            f = u.minify(i, m, y + ".src.js");
                            if (m.outSourceMap && f.map) {
                                c = f.map;
                                if (l) {
                                    c = JSON.parse(c);
                                    h = d.fromSourceMap(new v(c));
                                    h.applySourceMap(new v(l));
                                    c = h.toString()
                                } else if (!a._buildSourceMap) {
                                    r.saveFile(s + ".src.js", i)
                                }
                                i = f.code;
                                if (a._buildSourceMap) {
                                    a._buildSourceMap = c
                                } else {
                                    r.saveFile(s + ".map", c);
                                    i += "\n//# sourceMappingURL=" + y + ".map"
                                }
                            } else {
                                i = f.code
                            }
                        } catch (b) {
                            throw new Error("Cannot uglify2 file: " + n + ". Skipping it. Error is:\n" + b.toString())
                        }
                        return i
                    }
                }
            };
            return f
        });
        define("requirePatch", ["env!env/file", "pragma", "parse", "lang", "logger", "commonJs", "prim"], function (file, pragma, parse, lang, logger, commonJs, prim) {
            var allowRun = true, hasProp = lang.hasProp, falseProp = lang.falseProp, getOwn = lang.getOwn;
            prim.hideResolutionConflict = true;
            return function () {
                function normalizeUrlWithBase(e, t, n) {
                    if (require.jsExtRegExp.test(t)) {
                        n = (e.config.dir || e.config.dirBaseUrl) + n
                    }
                    return n
                }

                if (!allowRun) {
                    return
                }
                allowRun = false;
                var layer, pluginBuilderRegExp = /(["']?)pluginBuilder(["']?)\s*[=\:]\s*["']([^'"\s]+)["']/, oldNewContext = require.s.newContext, oldDef, exports, module;
                require._cacheReset = function () {
                    require._cachedRawText = {};
                    require._cachedFileContents = {};
                    require._cachedDefinesRequireUrls = {}
                };
                require._cacheReset();
                require._isSupportedBuildUrl = function (e) {
                    if (e.indexOf("://") === -1 && e.indexOf("?") === -1 && e.indexOf("empty:") !== 0 && e.indexOf("//") !== 0) {
                        return true
                    } else {
                        if (!layer.ignoredUrls[e]) {
                            if (e.indexOf("empty:") === -1) {
                                logger.info("Cannot optimize network URL, skipping: " + e)
                            }
                            layer.ignoredUrls[e] = true
                        }
                        return false
                    }
                };
                require.s.newContext = function (name) {
                    var context = oldNewContext(name), oldEnable = context.enable, moduleProto = context.Module.prototype, oldInit = moduleProto.init, oldCallPlugin = moduleProto.callPlugin;
                    if (name === "_") {
                        context.nextTick = function (e) {
                            e()
                        };
                        context.needFullExec = {};
                        context.fullExec = {};
                        context.plugins = {};
                        context.buildShimExports = {};
                        context.makeShimExports = function (e) {
                            var t;
                            if (context.config.wrapShim) {
                                t = function () {
                                    var t = "return ";
                                    if (e.exports && e.exports.indexOf(".") === -1) {
                                        t += "root." + e.exports + " = "
                                    }
                                    if (e.init) {
                                        t += "(" + e.init.toString() + ".apply(this, arguments))"
                                    }
                                    if (e.init && e.exports) {
                                        t += " || "
                                    }
                                    if (e.exports) {
                                        t += e.exports
                                    }
                                    t += ";";
                                    return t
                                }
                            } else {
                                t = function () {
                                    return "(function (global) {\n" + "    return function () {\n" + "        var ret, fn;\n" + (e.init ? "       fn = " + e.init.toString() + ";\n" + "        ret = fn.apply(global, arguments);\n" : "") + (e.exports ? "        return ret || global." + e.exports + ";\n" : "        return ret;\n") + "    };\n" + "}(this))"
                                }
                            }
                            return t
                        };
                        context.enable = function (e, t) {
                            var n = e.id, r = t && t.map.id, i = context.needFullExec, s = context.fullExec, o = getOwn(context.registry, n);
                            if (o && !o.defined) {
                                if (r && getOwn(i, r)) {
                                    i[n] = e
                                }
                            } else if (getOwn(i, n) && falseProp(s, n) || r && getOwn(i, r) && falseProp(s, n)) {
                                context.require.undef(n)
                            }
                            return oldEnable.apply(context, arguments)
                        };
                        context.load = function (moduleName, url) {
                            var contents, pluginBuilderMatch, builderName, shim, shimExports;
                            if (url.indexOf("empty:") === 0) {
                                delete context.urlFetched[url]
                            }
                            if (require._isSupportedBuildUrl(url)) {
                                url = normalizeUrlWithBase(context, moduleName, url);
                                layer.buildPathMap[moduleName] = url;
                                layer.buildFileToModule[url] = moduleName;
                                if (hasProp(context.plugins, moduleName)) {
                                    context.needFullExec[moduleName] = true
                                }
                                prim().start(function () {
                                    if (hasProp(require._cachedFileContents, url) && (falseProp(context.needFullExec, moduleName) || getOwn(context.fullExec, moduleName))) {
                                        contents = require._cachedFileContents[url];
                                        if (!layer.existingRequireUrl && require._cachedDefinesRequireUrls[url]) {
                                            layer.existingRequireUrl = url
                                        }
                                    } else {
                                        return require._cacheReadAsync(url).then(function (e) {
                                            contents = e;
                                            if (context.config.cjsTranslate && (!context.config.shim || !lang.hasProp(context.config.shim, moduleName))) {
                                                contents = commonJs.convert(url, contents)
                                            }
                                            if (context.config.onBuildRead) {
                                                contents = context.config.onBuildRead(moduleName, url, contents)
                                            }
                                            contents = pragma.process(url, contents, context.config, "OnExecute");
                                            try {
                                                if (!layer.existingRequireUrl && parse.definesRequire(url, contents)) {
                                                    layer.existingRequireUrl = url;
                                                    require._cachedDefinesRequireUrls[url] = true
                                                }
                                            } catch (t) {
                                                throw new Error("Parse error using esprima " + "for file: " + url + "\n" + t)
                                            }
                                        }).then(function () {
                                            if (hasProp(context.plugins, moduleName)) {
                                                pluginBuilderMatch = pluginBuilderRegExp.exec(contents);
                                                if (pluginBuilderMatch) {
                                                    builderName = context.makeModuleMap(pluginBuilderMatch[3], context.makeModuleMap(moduleName), null, true).id;
                                                    return require._cacheReadAsync(context.nameToUrl(builderName))
                                                }
                                            }
                                            return contents
                                        }).then(function (e) {
                                            contents = e;
                                            try {
                                                if (falseProp(context.needFullExec, moduleName)) {
                                                    contents = parse(moduleName, url, contents, {
                                                        insertNeedsDefine: true,
                                                        has: context.config.has,
                                                        findNestedDependencies: context.config.findNestedDependencies
                                                    })
                                                }
                                            } catch (t) {
                                                throw new Error("Parse error using esprima " + "for file: " + url + "\n" + t)
                                            }
                                            require._cachedFileContents[url] = contents
                                        })
                                    }
                                }).then(function () {
                                    if (contents) {
                                        eval(contents)
                                    }
                                    try {
                                        if (getOwn(context.needFullExec, moduleName)) {
                                            shim = getOwn(context.config.shim, moduleName);
                                            if (shim && shim.exports) {
                                                shimExports = eval(shim.exports);
                                                if (typeof shimExports !== "undefined") {
                                                    context.buildShimExports[moduleName] = shimExports
                                                }
                                            }
                                        }
                                        context.completeLoad(moduleName)
                                    } catch (e) {
                                        if (!e.moduleTree) {
                                            e.moduleTree = []
                                        }
                                        e.moduleTree.push(moduleName);
                                        throw e
                                    }
                                }).then(null, function (e) {
                                    if (!e.fileName) {
                                        e.fileName = url
                                    }
                                    throw e
                                }).end()
                            } else {
                                context.completeLoad(moduleName)
                            }
                        };
                        context.execCb = function (e, t, n, r) {
                            var i = getOwn(layer.context.buildShimExports, e);
                            if (i) {
                                return i
                            } else if (t.__requireJsBuild || getOwn(layer.context.needFullExec, e)) {
                                return t.apply(r, n)
                            }
                            return undefined
                        };
                        moduleProto.init = function (e) {
                            if (context.needFullExec[this.map.id]) {
                                lang.each(e, lang.bind(this, function (e) {
                                    if (typeof e === "string") {
                                        e = context.makeModuleMap(e, this.map.isDefine ? this.map : this.map.parentMap)
                                    }
                                    if (!context.fullExec[e.id]) {
                                        context.require.undef(e.id)
                                    }
                                }))
                            }
                            return oldInit.apply(this, arguments)
                        };
                        moduleProto.callPlugin = function () {
                            var e = this.map, t = context.makeModuleMap(e.prefix), n = t.id, r = getOwn(context.registry, n);
                            context.plugins[n] = true;
                            context.needFullExec[n] = e;
                            if (falseProp(context.fullExec, n) && (!r || r.defined)) {
                                context.require.undef(t.id)
                            }
                            return oldCallPlugin.apply(this, arguments)
                        }
                    }
                    return context
                };
                delete require.s.contexts._;
                require._buildReset = function () {
                    var e = require.s.contexts._;
                    delete require.s.contexts._;
                    require({});
                    layer = require._layer = {
                        buildPathMap: {},
                        buildFileToModule: {},
                        buildFilePaths: [],
                        pathAdded: {},
                        modulesWithNames: {},
                        needsDefine: {},
                        existingRequireUrl: "",
                        ignoredUrls: {},
                        context: require.s.contexts._
                    };
                    return e
                };
                require._buildReset();
                oldDef = define;
                define = function (e) {
                    if (typeof e === "string" && falseProp(layer.needsDefine, e)) {
                        layer.modulesWithNames[e] = true
                    }
                    return oldDef.apply(require, arguments)
                };
                define.amd = oldDef.amd;
                require._readFile = file.readFile;
                require._fileExists = function (e) {
                    return file.exists(e)
                };
                require.onResourceLoad = function (e, t) {
                    var n = t.id, r;
                    if (e.plugins && lang.hasProp(e.plugins, n)) {
                        lang.eachProp(e.needFullExec, function (t, r) {
                            if (t !== true && t.prefix === n && t.unnormalized) {
                                var i = e.makeModuleMap(t.originalName, t.parentMap);
                                e.needFullExec[i.id] = i
                            }
                        })
                    }
                    if (e.needFullExec && getOwn(e.needFullExec, n)) {
                        e.fullExec[n] = t
                    }
                    if (t.prefix) {
                        if (falseProp(layer.pathAdded, n)) {
                            layer.buildFilePaths.push(n);
                            layer.buildPathMap[n] = n;
                            layer.buildFileToModule[n] = n;
                            layer.modulesWithNames[n] = true;
                            layer.pathAdded[n] = true
                        }
                    } else if (t.url && require._isSupportedBuildUrl(t.url)) {
                        r = normalizeUrlWithBase(e, n, t.url);
                        if (!layer.pathAdded[r] && getOwn(layer.buildPathMap, n)) {
                            layer.buildFilePaths.push(r);
                            layer.pathAdded[r] = true
                        }
                    }
                };
                require.needsDefine = function (e) {
                    layer.needsDefine[e] = true
                }
            }
        });
        define("commonJs", ["env!env/file", "parse"], function (e, t) {
            "use strict";
            var n = {
                useLog: true, convertDir: function (t, r) {
                    var i, s, o = /\.js$/, u, a, f;
                    i = e.getFilteredFileList(t, /\w/, true);
                    t = t.replace(/\\/g, "/");
                    r = r.replace(/\\/g, "/");
                    if (t.charAt(t.length - 1) === "/") {
                        t = t.substring(0, t.length - 1)
                    }
                    if (r.charAt(r.length - 1) === "/") {
                        r = r.substring(0, r.length - 1)
                    }
                    if (!i || !i.length) {
                        if (n.useLog) {
                            if (t === "convert") {
                                console.log("\n\n" + n.convert(r, e.readFile(r)))
                            } else {
                                console.log("No files to convert in directory: " + t)
                            }
                        }
                    } else {
                        for (s = 0; s < i.length; s++) {
                            u = i[s];
                            a = u.replace(t, r);
                            if (o.test(u)) {
                                f = e.readFile(u);
                                f = n.convert(u, f);
                                e.saveUtf8File(a, f)
                            } else {
                                e.copyFile(u, a, true)
                            }
                        }
                    }
                }, convert: function (e, n) {
                    try {
                        var r = "", i = t.usesCommonJs(e, n);
                        if (t.usesAmdOrRequireJs(e, n) || !i) {
                            return n
                        }
                        if (i.dirname || i.filename) {
                            r = 'var __filename = module.uri || "", ' + '__dirname = __filename.substring(0, __filename.lastIndexOf("/") + 1); '
                        }
                        n = "define(function (require, exports, module) {" + r + n + "\n});\n"
                    } catch (s) {
                        console.log("commonJs.convert: COULD NOT CONVERT: " + e + ", so skipping it. Error was: " + s);
                        return n
                    }
                    return n
                }
            };
            return n
        });
        define("build", function (require) {
            "use strict";
            function makeBuildBaseConfig() {
                return {
                    appDir: "",
                    pragmas: {},
                    paths: {},
                    optimize: "uglify",
                    optimizeCss: "standard.keepLines.keepWhitespace",
                    inlineText: true,
                    isBuild: true,
                    optimizeAllPluginResources: false,
                    findNestedDependencies: false,
                    preserveLicenseComments: true,
                    dirExclusionRegExp: file.dirExclusionRegExp,
                    _buildPathToModuleIndex: {}
                }
            }

            function addSemiColon(e, t) {
                if (t.skipSemiColonInsertion || endsWithSemiColonRegExp.test(e)) {
                    return e
                } else {
                    return e + ";"
                }
            }

            function endsWithSlash(e) {
                if (e.charAt(e.length - 1) !== "/") {
                    e += "/"
                }
                return e
            }

            function makeWriteFile(e, t) {
                function n(e, t) {
                    logger.trace("Saving plugin-optimized file: " + e);
                    file.saveUtf8File(e, t)
                }

                n.asModule = function (r, i, s) {
                    n(i, build.toTransport(e, r, i, s, t))
                };
                return n
            }

            function stringDotToObj(e, t, n) {
                var r = t.split(".");
                r.forEach(function (t, i) {
                    if (i === r.length - 1) {
                        e[t] = n
                    } else {
                        if (falseProp(e, t)) {
                            e[t] = {}
                        }
                        e = e[t]
                    }
                })
            }

            function mixConfig(e, t, n) {
                var r, i, s, o;
                for (r in t) {
                    if (hasProp(t, r)) {
                        i = t[r];
                        s = lang.isArray(i);
                        if (typeof i === "object" && i && !s && !lang.isFunction(i) && !lang.isRegExp(i)) {
                            if (r === "map") {
                                if (!e.map) {
                                    e.map = {}
                                }
                                lang.deepMix(e.map, t.map)
                            } else {
                                e[r] = lang.mixin({}, e[r], i, true)
                            }
                        } else if (s) {
                            if (!n) {
                                o = e[r];
                                if (lang.isArray(o)) {
                                    e[r] = o.concat(i)
                                } else {
                                    e[r] = i
                                }
                            }
                        } else {
                            e[r] = i
                        }
                    }
                }
                if (lang.hasProp(e, "logLevel")) {
                    logger.logLevel(e.logLevel)
                }
            }

            function flattenWrapFile(e, t, n) {
                var r = t + "File";
                if (typeof e[t] !== "string" && e[r]) {
                    e[t] = "";
                    if (typeof e[r] === "string") {
                        e[r] = [e[r]]
                    }
                    e[r].forEach(function (r) {
                        e[t] += (e[t] ? "\n" : "") + file.readFile(build.makeAbsPath(r, n))
                    })
                } else if (e[t] === null || e[t] === undefined) {
                    e[t] = ""
                } else if (typeof e[t] !== "string") {
                    throw new Error("wrap." + t + " or wrap." + r + " malformed")
                }
            }

            function normalizeWrapConfig(e, t) {
                try {
                    if (e.wrap) {
                        if (e.wrap === true) {
                            e.wrap = {start: "(function () {", end: "}());"}
                        } else {
                            flattenWrapFile(e.wrap, "start", t);
                            flattenWrapFile(e.wrap, "end", t)
                        }
                    }
                } catch (n) {
                    throw new Error("Malformed wrap config: " + n.toString())
                }
            }

            var build, lang = require("lang"), prim = require("prim"), logger = require("logger"), file = require("env!env/file"), parse = require("parse"), optimize = require("optimize"), pragma = require("pragma"), transform = require("transform"), requirePatch = require("requirePatch"), env = require("env"), commonJs = require("commonJs"), SourceMapGenerator = require("source-map/source-map-generator"), hasProp = lang.hasProp, getOwn = lang.getOwn, falseProp = lang.falseProp, endsWithSemiColonRegExp = /;\s*$/, endsWithSlashRegExp = /[\/\\]$/, resourceIsModuleIdRegExp = /^[\w\/\\\.]+$/;
            prim.nextTick = function (e) {
                e()
            };
            require = requirejs;
            require._cacheReadAsync = function (e, t) {
                var n;
                if (lang.hasProp(require._cachedRawText, e)) {
                    n = prim();
                    n.resolve(require._cachedRawText[e]);
                    return n.promise
                } else {
                    return file.readFileAsync(e, t).then(function (t) {
                        require._cachedRawText[e] = t;
                        return t
                    })
                }
            };
            build = function (e) {
                var t, n, r, i, s, o, u, a, f, l = /( {4}at[^\n]+)\n/, c = "  ";
                return prim().start(function () {
                    if (!e || lang.isArray(e)) {
                        if (!e || e.length < 1) {
                            logger.error("build.js buildProfile.js\n" + "where buildProfile.js is the name of the build file (see example.build.js for hints on how to make a build file).");
                            return undefined
                        }
                        if (e[0].indexOf("=") === -1) {
                            t = e[0];
                            e.splice(0, 1)
                        }
                        n = build.convertArrayToObject(e);
                        n.buildFile = t
                    } else {
                        n = e
                    }
                    return build._run(n)
                }).then(null, function (t) {
                    var n;
                    r = t.toString();
                    o = t.moduleTree;
                    s = l.exec(r);
                    if (s) {
                        r += r.substring(0, s.index + s[0].length + 1)
                    }
                    if (o && o.length > 0) {
                        r += "\nIn module tree:\n";
                        for (u = o.length - 1; u > -1; u--) {
                            f = o[u];
                            if (f) {
                                for (a = o.length - u; a > -1; a--) {
                                    r += c
                                }
                                r += f + "\n"
                            }
                        }
                        logger.error(r)
                    }
                    i = t.stack;
                    if (typeof e === "string" && e.indexOf("stacktrace=true") !== -1) {
                        r += "\n" + i
                    } else {
                        if (!s && i) {
                            s = l.exec(i);
                            if (s) {
                                r += "\n" + s[0] || ""
                            }
                        }
                    }
                    n = new Error(r);
                    n.originalError = t;
                    throw n
                })
            };
            build._run = function (e) {
                var t, n, r, i, s, o, u, a, f, l, c, h, p, d, v, m, g, y, b = {}, w = "", E = {};
                return prim().start(function () {
                    var n;
                    requirePatch();
                    u = build.createConfig(e);
                    i = u.paths;
                    if (u.dir && !u.keepBuildDir && file.exists(u.dir)) {
                        file.deleteFile(u.dir)
                    }
                    if (!u.out && !u.cssIn) {
                        file.copyDir(u.appDir || u.baseUrl, u.dir, /\w/, true);
                        t = {};
                        if (u.appDir) {
                            for (n in i) {
                                if (hasProp(i, n)) {
                                    t[n] = i[n].replace(u.appDir, u.dir)
                                }
                            }
                        } else {
                            for (n in i) {
                                if (hasProp(i, n)) {
                                    if (i[n].indexOf(u.baseUrl) === 0) {
                                        t[n] = i[n].replace(u.baseUrl, u.dirBaseUrl)
                                    } else {
                                        t[n] = i[n] === "empty:" ? "empty:" : n.replace(/\./g, "/");
                                        f = i[n];
                                        if (f.indexOf("/") !== 0 && f.indexOf(":") === -1) {
                                            f = u.baseUrl + f
                                        }
                                        c = u.dirBaseUrl + t[n];
                                        if (f !== "empty:") {
                                            if (file.exists(f) && file.isDirectory(f)) {
                                                file.copyDir(f, c, /\w/, true)
                                            } else {
                                                f += ".js";
                                                c += ".js";
                                                file.copyFile(f, c)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    require({baseUrl: u.baseUrl, paths: i, packagePaths: u.packagePaths, packages: u.packages});
                    l = require.s.contexts._;
                    a = u.modules;
                    if (a) {
                        a.forEach(function (e) {
                            if (e.name) {
                                e._sourcePath = l.nameToUrl(e.name);
                                if (!file.exists(e._sourcePath) && !e.create && e.name.indexOf("!") === -1 && (!u.rawText || !lang.hasProp(u.rawText, e.name))) {
                                    throw new Error("ERROR: module path does not exist: " + e._sourcePath + " for module named: " + e.name + ". Path is relative to: " + file.absPath("."))
                                }
                            }
                        })
                    }
                    if (u.out) {
                        require(u);
                        if (!u.cssIn) {
                            u.modules[0]._buildPath = typeof u.out === "function" ? "FUNCTION" : u.out
                        }
                    } else if (!u.cssIn) {
                        o = {baseUrl: u.dirBaseUrl, paths: t};
                        lang.mixin(o, u);
                        require(o);
                        if (a) {
                            a.forEach(function (e) {
                                if (e.name) {
                                    e._buildPath = l.nameToUrl(e.name, null);
                                    if (e._buildPath === e._sourcePath) {
                                        throw new Error("Module ID '" + e.name + "' has a source path that is same as output path: " + e._sourcePath + ". Stopping, config is malformed.")
                                    }
                                    if (!e.create) {
                                        file.copyFile(e._sourcePath, e._buildPath)
                                    }
                                }
                            })
                        }
                    }
                    if (u.optimizeCss && u.optimizeCss !== "none" && u.dir) {
                        w += optimize.css(u.dir, u)
                    }
                }).then(function () {
                    o = lang.deeplikeCopy(require.s.contexts._.config)
                }).then(function () {
                    var e = [];
                    if (a) {
                        e = a.map(function (e, t) {
                            return function () {
                                u._buildPathToModuleIndex[file.normalize(e._buildPath)] = t;
                                return build.traceDependencies(e, u, o).then(function (t) {
                                    e.layer = t
                                })
                            }
                        });
                        return prim.serial(e)
                    }
                }).then(function () {
                    var e;
                    if (a) {
                        e = a.map(function (e) {
                            return function () {
                                if (e.exclude) {
                                    e.excludeLayers = [];
                                    return prim.serial(e.exclude.map(function (t, n) {
                                        return function () {
                                            var r = build.findBuildModule(t, a);
                                            if (r) {
                                                e.excludeLayers[n] = r
                                            } else {
                                                return build.traceDependencies({name: t}, u, o).then(function (t) {
                                                    e.excludeLayers[n] = {layer: t}
                                                })
                                            }
                                        }
                                    }))
                                }
                            }
                        });
                        return prim.serial(e)
                    }
                }).then(function () {
                    if (a) {
                        return prim.serial(a.map(function (e) {
                            return function () {
                                if (e.exclude) {
                                    e.exclude.forEach(function (t, n) {
                                        var r = e.excludeLayers[n].layer, i = r.buildFileToModule;
                                        r.buildFilePaths.forEach(function (t) {
                                            build.removeModulePath(i[t], t, e.layer)
                                        })
                                    })
                                }
                                if (e.excludeShallow) {
                                    e.excludeShallow.forEach(function (t) {
                                        var n = getOwn(e.layer.buildPathMap, t);
                                        if (n) {
                                            build.removeModulePath(t, n, e.layer)
                                        }
                                    })
                                }
                                return build.flattenModule(e, e.layer, u).then(function (t) {
                                    var n, r;
                                    if (e._buildPath === "FUNCTION") {
                                        e._buildText = t.text;
                                        e._buildSourceMap = t.sourceMap
                                    } else {
                                        n = t.text;
                                        if (t.sourceMap) {
                                            r = e._buildPath.split("/");
                                            r = r.pop();
                                            n += "\n//# sourceMappingURL=" + r + ".map";
                                            file.saveUtf8File(e._buildPath + ".map", t.sourceMap)
                                        }
                                        file.saveUtf8File(e._buildPath + "-temp", n)
                                    }
                                    w += t.buildText
                                })
                            }
                        }))
                    }
                }).then(function () {
                    var e, t;
                    if (a) {
                        a.forEach(function (e) {
                            var t = e._buildPath;
                            if (t !== "FUNCTION") {
                                if (file.exists(t)) {
                                    file.deleteFile(t)
                                }
                                file.renameFile(t + "-temp", t);
                                if (u.removeCombined && !u.out) {
                                    e.layer.buildFilePaths.forEach(function (e) {
                                        var t = a.some(function (t) {
                                            return t._buildPath === e
                                        }), n = build.makeRelativeFilePath(u.dir, e);
                                        if (file.exists(e) && !t && n.indexOf("..") !== 0) {
                                            file.deleteFile(e)
                                        }
                                    })
                                }
                            }
                            if (u.onModuleBundleComplete) {
                                u.onModuleBundleComplete(e.onCompleteData)
                            }
                        })
                    }
                    if (u.removeCombined && !u.out && u.dir) {
                        file.deleteEmptyDirs(u.dir)
                    }
                    if (u.out && !u.cssIn) {
                        n = u.modules[0]._buildPath;
                        if (n === "FUNCTION") {
                            t = u.modules[0]._buildSourceMap;
                            u._buildSourceMap = t;
                            u.modules[0]._buildText = optimize.js((u.modules[0].name || u.modules[0].include[0] || n) + ".build.js", u.modules[0]._buildText, null, u);
                            if (u._buildSourceMap && u._buildSourceMap !== t) {
                                u.modules[0]._buildSourceMap = u._buildSourceMap;
                                u._buildSourceMap = null
                            }
                        } else {
                            optimize.jsFile(n, null, n, u)
                        }
                    } else if (!u.cssIn) {
                        r = file.getFilteredFileList(u.dir, /\.js$/, true);
                        r.forEach(function (t) {
                            var n, r, i;
                            e = t.replace(u.dir, "");
                            e = e.substring(0, e.length - 3);
                            i = getOwn(u._buildPathToModuleIndex, t);
                            i = i === 0 || i > 0 ? i : -1;
                            if (i > -1 || !u.skipDirOptimize || u.normalizeDirDefines === "all" || u.cjsTranslate) {
                                y = file.readFile(t);
                                if (u.cjsTranslate && (!u.shim || !lang.hasProp(u.shim, e))) {
                                    y = commonJs.convert(t, y)
                                }
                                if (i === -1) {
                                    if (u.onBuildRead) {
                                        y = u.onBuildRead(e, t, y)
                                    }
                                    if (u.normalizeDirDefines === "all") {
                                        y = build.toTransport(u.namespace, null, t, y)
                                    }
                                    if (u.onBuildWrite) {
                                        y = u.onBuildWrite(e, t, y)
                                    }
                                }
                                r = i > -1 ? u.modules[i].override : null;
                                if (r) {
                                    n = build.createOverrideConfig(u, r)
                                } else {
                                    n = u
                                }
                                if (i > -1 || !u.skipDirOptimize) {
                                    optimize.jsFile(t, y, t, n, E)
                                }
                            }
                        });
                        d = require.s.contexts._;
                        for (e in E) {
                            if (hasProp(E, e)) {
                                p = d.makeModuleMap(e);
                                v = E[e];
                                for (s = 0; s < v.length; s++) {
                                    m = v[s];
                                    h = d.makeModuleMap(m, p);
                                    if (falseProp(d.plugins, h.prefix)) {
                                        d.plugins[h.prefix] = true;
                                        if (!file.exists(require.toUrl(h.prefix + ".js"))) {
                                            continue
                                        }
                                        d.require([h.prefix]);
                                        h = d.makeModuleMap(m, p)
                                    }
                                    if (falseProp(b, h.id)) {
                                        g = getOwn(d.defined, h.prefix);
                                        if (g && g.writeFile) {
                                            g.writeFile(h.prefix, h.name, require, makeWriteFile(u.namespace), d.config)
                                        }
                                        b[h.id] = true
                                    }
                                }
                            }
                        }
                        file.saveUtf8File(u.dir + "build.txt", w)
                    }
                    if (u.cssIn) {
                        w += optimize.cssFile(u.cssIn, u.out, u).buildText
                    }
                    if (typeof u.out === "function") {
                        u.out(u.modules[0]._buildText, u.modules[0]._buildSourceMap)
                    }
                    if (w) {
                        logger.info(w);
                        return w
                    }
                    return ""
                })
            };
            build.objProps = {
                paths: true,
                wrap: true,
                pragmas: true,
                pragmasOnSave: true,
                has: true,
                hasOnSave: true,
                uglify: true,
                uglify2: true,
                closure: true,
                map: true,
                throwWhen: true
            };
            build.hasDotPropMatch = function (e) {
                var t, n = e.indexOf(".");
                if (n !== -1) {
                    t = e.substring(0, n);
                    return hasProp(build.objProps, t)
                }
                return false
            };
            build.convertArrayToObject = function (e) {
                var t = {}, n, r, i, s, o = {
                    include: true,
                    exclude: true,
                    excludeShallow: true,
                    insertRequire: true,
                    stubModules: true,
                    deps: true
                };
                for (n = 0; n < e.length; n++) {
                    r = e[n].indexOf("=");
                    if (r === -1) {
                        throw"Malformed name/value pair: [" + e[n] + "]. Format should be name=value"
                    }
                    s = e[n].substring(r + 1, e[n].length);
                    if (s === "true") {
                        s = true
                    } else if (s === "false") {
                        s = false
                    }
                    i = e[n].substring(0, r);
                    if (getOwn(o, i)) {
                        s = s.split(",")
                    }
                    if (build.hasDotPropMatch(i)) {
                        stringDotToObj(t, i, s)
                    } else {
                        t[i] = s
                    }
                }
                return t
            };
            build.makeAbsPath = function (e, t) {
                if (!t) {
                    return e
                }
                if (e.indexOf("/") !== 0 && e.indexOf(":") === -1) {
                    e = t + (t.charAt(t.length - 1) === "/" ? "" : "/") + e;
                    e = file.normalize(e)
                }
                return e.replace(lang.backSlashRegExp, "/")
            };
            build.makeAbsObject = function (e, t, n) {
                var r, i;
                if (t) {
                    for (r = 0; r < e.length; r++) {
                        i = e[r];
                        if (hasProp(t, i) && typeof t[i] === "string") {
                            t[i] = build.makeAbsPath(t[i], n)
                        }
                    }
                }
            };
            build.makeAbsConfig = function (e, t) {
                var n, r, i;
                n = ["appDir", "dir", "baseUrl"];
                for (i = 0; i < n.length; i++) {
                    r = n[i];
                    if (getOwn(e, r)) {
                        if (r === "baseUrl") {
                            e.originalBaseUrl = e.baseUrl;
                            if (e.appDir) {
                                e.baseUrl = build.makeAbsPath(e.originalBaseUrl, e.appDir)
                            } else {
                                e.baseUrl = build.makeAbsPath(e[r], t)
                            }
                        } else {
                            e[r] = build.makeAbsPath(e[r], t)
                        }
                        e[r] = endsWithSlash(e[r])
                    }
                }
                build.makeAbsObject(e.out === "stdout" ? ["cssIn"] : ["out", "cssIn"], e, t);
                build.makeAbsObject(["startFile", "endFile"], e.wrap, t)
            };
            build.makeRelativeFilePath = function (e, t) {
                var n, r, i, s, o, u, a = e.split("/"), f = endsWithSlashRegExp.test(t), l = [];
                t = file.normalize(t);
                if (f && !endsWithSlashRegExp.test(t)) {
                    t += "/"
                }
                o = t.split("/");
                u = o.pop();
                a.pop();
                s = a.length;
                for (n = 0; n < s; n += 1) {
                    if (a[n] !== o[n]) {
                        break
                    }
                }
                i = o.slice(n);
                r = s - n;
                for (n = 0; n > -1 && n < r; n += 1) {
                    l.push("..")
                }
                return l.join("/") + (l.length ? "/" : "") + i.join("/") + (i.length ? "/" : "") + u
            };
            build.nestedMix = {paths: true, has: true, hasOnSave: true, pragmas: true, pragmasOnSave: true};
            build.createConfig = function (cfg) {
                var buildFileContents, buildFileConfig, mainConfig, mainConfigFile, mainConfigPath, buildFile, absFilePath, config = {}, buildBaseConfig = makeBuildBaseConfig();
                absFilePath = file.absPath(".");
                build.makeAbsConfig(cfg, absFilePath);
                build.makeAbsConfig(buildBaseConfig, absFilePath);
                lang.mixin(config, buildBaseConfig);
                lang.mixin(config, cfg, true);
                if (lang.hasProp(config, "logLevel")) {
                    logger.logLevel(config.logLevel)
                }
                if (config.buildFile) {
                    buildFile = file.absPath(config.buildFile);
                    if (!file.exists(buildFile)) {
                        throw new Error("ERROR: build file does not exist: " + buildFile)
                    }
                    absFilePath = config.baseUrl = file.absPath(file.parent(buildFile));
                    buildFileContents = file.readFile(buildFile);
                    try {
                        buildFileConfig = eval("(" + buildFileContents + ")");
                        build.makeAbsConfig(buildFileConfig, absFilePath);
                        mixConfig(config, buildFileConfig)
                    } catch (e) {
                        throw new Error("Build file " + buildFile + " is malformed: " + e)
                    }
                }
                mainConfigFile = config.mainConfigFile || buildFileConfig && buildFileConfig.mainConfigFile;
                if (mainConfigFile) {
                    if (typeof mainConfigFile === "string") {
                        mainConfigFile = [mainConfigFile]
                    }
                    mainConfigFile.forEach(function (e) {
                        e = build.makeAbsPath(e, absFilePath);
                        if (!file.exists(e)) {
                            throw new Error(e + " does not exist.")
                        }
                        try {
                            mainConfig = parse.findConfig(file.readFile(e)).config
                        } catch (t) {
                            throw new Error("The config in mainConfigFile " + e + " cannot be used because it cannot be evaluated" + " correctly while running in the optimizer. Try only" + " using a config that is also valid JSON, or do not use" + " mainConfigFile and instead copy the config values needed" + " into a build file or command line arguments given to the optimizer.\n" + "Source error from parsing: " + e + ": " + t)
                        }
                        if (mainConfig) {
                            mainConfigPath = e.substring(0, e.lastIndexOf("/"));
                            if (config.appDir && !mainConfig.appDir) {
                                mainConfig.appDir = config.appDir
                            }
                            if (!mainConfig.baseUrl) {
                                mainConfig.baseUrl = mainConfigPath
                            }
                            build.makeAbsConfig(mainConfig, mainConfigPath);
                            mixConfig(config, mainConfig)
                        }
                    })
                }
                if (buildFileConfig) {
                    mixConfig(config, buildFileConfig, true)
                }
                mixConfig(config, cfg, true);
                lang.eachProp(config.paths, function (e, t) {
                    if (lang.isArray(e)) {
                        throw new Error("paths fallback not supported in optimizer. " + "Please provide a build config path override " + "for " + t)
                    }
                    config.paths[t] = build.makeAbsPath(e, config.baseUrl)
                });
                if (hasProp(config, "baseUrl")) {
                    if (config.appDir) {
                        if (!config.originalBaseUrl) {
                            throw new Error("Please set a baseUrl in the build config")
                        }
                        config.dirBaseUrl = build.makeAbsPath(config.originalBaseUrl, config.dir)
                    } else {
                        config.dirBaseUrl = config.dir || config.baseUrl
                    }
                    config.dirBaseUrl = endsWithSlash(config.dirBaseUrl)
                }
                if (config.out && config.out === "stdout") {
                    config.out = function (e) {
                        var t = env.get();
                        if (t === "rhino") {
                            var n = new java.io.PrintStream(java.lang.System.out, true, "UTF-8");
                            n.println(e)
                        } else if (t === "node") {
                            process.stdout.setEncoding("utf8");
                            process.stdout.write(e)
                        } else {
                            console.log(e)
                        }
                    }
                }
                if (config.main) {
                    throw new Error('"main" passed as an option, but the ' + 'supported option is called "name".')
                }
                if (config.out && !config.name && !config.modules && !config.include && !config.cssIn) {
                    throw new Error('Missing either a "name", "include" or "modules" ' + "option")
                }
                if (config.cssIn) {
                    if (config.dir || config.appDir) {
                        throw new Error("cssIn is only for the output of single file " + 'CSS optimizations and is not compatible with "dir" or "appDir" configuration.')
                    }
                    if (!config.out) {
                        throw new Error('"out" option missing.')
                    }
                }
                if (!config.cssIn && !config.baseUrl) {
                    config.baseUrl = "./"
                }
                if (!config.out && !config.dir) {
                    throw new Error('Missing either an "out" or "dir" config value. ' + 'If using "appDir" for a full project optimization, ' + 'use "dir". If you want to optimize to one file, ' + 'use "out".')
                }
                if (config.appDir && config.out) {
                    throw new Error('"appDir" is not compatible with "out". Use "dir" ' + "instead. appDir is used to copy whole projects, " + 'where "out" with "baseUrl" is used to just ' + "optimize to one file.")
                }
                if (config.out && config.dir) {
                    throw new Error('The "out" and "dir" options are incompatible.' + ' Use "out" if you are targeting a single file' + ' for optimization, and "dir" if you want the appDir' + " or baseUrl directories optimized.")
                }
                if (config.dir) {
                    if (!config.allowSourceOverwrites && (config.dir === config.baseUrl || config.dir === config.appDir || config.baseUrl && build.makeRelativeFilePath(config.dir, config.baseUrl).indexOf("..") !== 0 || config.appDir && build.makeRelativeFilePath(config.dir, config.appDir).indexOf("..") !== 0)) {
                        throw new Error('"dir" is set to a parent or same directory as' + ' "appDir" or "baseUrl". This can result in' + " the deletion of source code. Stopping. If" + " you want to allow possible overwriting of" + ' source code, set "allowSourceOverwrites"' + " to true in the build config, but do so at" + " your own risk. In that case, you may want" + ' to also set "keepBuildDir" to true.')
                    }
                }
                if (config.insertRequire && !lang.isArray(config.insertRequire)) {
                    throw new Error("insertRequire should be a list of module IDs" + " to insert in to a require([]) call.")
                }
                if (config.generateSourceMaps) {
                    if (config.preserveLicenseComments && config.optimize !== "none") {
                        throw new Error("Cannot use preserveLicenseComments and " + "generateSourceMaps together. Either explcitly set " + "preserveLicenseComments to false (default is true) or " + "turn off generateSourceMaps. If you want source maps with " + "license comments, see: " + "http://requirejs.org/docs/errors.html#sourcemapcomments")
                    } else if (config.optimize !== "none" && config.optimize !== "closure" && config.optimize !== "uglify2") {
                        throw new Error('optimize: "' + config.optimize + '" does not support generateSourceMaps.')
                    }
                }
                if ((config.name || config.include) && !config.modules) {
                    config.modules = [{
                        name: config.name,
                        out: config.out,
                        create: config.create,
                        include: config.include,
                        exclude: config.exclude,
                        excludeShallow: config.excludeShallow,
                        insertRequire: config.insertRequire,
                        stubModules: config.stubModules
                    }];
                    delete config.stubModules
                } else if (config.modules && config.out) {
                    throw new Error('If the "modules" option is used, then there ' + 'should be a "dir" option set and "out" should ' + 'not be used since "out" is only for single file ' + "optimization output.")
                } else if (config.modules && config.name) {
                    throw new Error('"name" and "modules" options are incompatible. ' + 'Either use "name" if doing a single file ' + 'optimization, or "modules" if you want to target ' + "more than one file for optimization.")
                }
                if (config.out && !config.cssIn) {
                    if (!cfg.optimizeCss) {
                        config.optimizeCss = "none"
                    }
                }
                if (config.cssPrefix) {
                    config.cssPrefix = endsWithSlash(config.cssPrefix)
                } else {
                    config.cssPrefix = ""
                }
                if (config.modules && config.modules.length) {
                    config.modules.forEach(function (e) {
                        if (config.stubModules) {
                            e.stubModules = config.stubModules.concat(e.stubModules || [])
                        }
                        if (e.stubModules) {
                            e.stubModules._byName = {};
                            e.stubModules.forEach(function (t) {
                                e.stubModules._byName[t] = true
                            })
                        }
                        if (typeof e.include === "string") {
                            e.include = [e.include]
                        }
                        if (e.override) {
                            normalizeWrapConfig(e.override, absFilePath)
                        }
                    })
                }
                normalizeWrapConfig(config, absFilePath);
                if (config.context) {
                    throw new Error('The build argument "context" is not supported' + " in a build. It should only be used in web" + " pages.")
                }
                if (!hasProp(config, "normalizeDirDefines")) {
                    if (config.optimize === "none" || config.skipDirOptimize) {
                        config.normalizeDirDefines = "skip"
                    } else {
                        config.normalizeDirDefines = "all"
                    }
                }
                if (hasProp(config, "fileExclusionRegExp")) {
                    if (typeof config.fileExclusionRegExp === "string") {
                        file.exclusionRegExp = new RegExp(config.fileExclusionRegExp)
                    } else {
                        file.exclusionRegExp = config.fileExclusionRegExp
                    }
                } else if (hasProp(config, "dirExclusionRegExp")) {
                    file.exclusionRegExp = config.dirExclusionRegExp
                }
                if (config.deps) {
                    config._depsInclude = config.deps
                }
                delete config.deps;
                delete config.jQuery;
                delete config.enforceDefine;
                delete config.urlArgs;
                return config
            };
            build.findBuildModule = function (e, t) {
                var n, r;
                for (n = 0; n < t.length; n++) {
                    r = t[n];
                    if (r.name === e) {
                        return r
                    }
                }
                return null
            };
            build.removeModulePath = function (e, t, n) {
                var r = n.buildFilePaths.indexOf(t);
                if (r !== -1) {
                    n.buildFilePaths.splice(r, 1)
                }
            };
            build.traceDependencies = function (e, t, n) {
                function c(e) {
                    var t = false;
                    if (f[env.get()]) {
                        try {
                            build.checkForErrors(o)
                        } catch (n) {
                            t = true;
                            l.reject(n)
                        }
                    }
                    if (!t) {
                        l.resolve(e)
                    }
                }

                var r, i, s, o, u, a, f = {rhino: true, node: true, xpconnect: true}, l = prim();
                u = require._buildReset();
                s = require._layer;
                o = s.context;
                if (n) {
                    require(lang.deeplikeCopy(n))
                }
                logger.trace("\nTracing dependencies for: " + (e.name || (typeof e.out === "function" ? "FUNCTION" : e.out)));
                r = t._depsInclude || [];
                r = r.concat(e.name && !e.create ? [e.name] : []);
                if (e.include) {
                    r = r.concat(e.include)
                }
                if (e.override) {
                    if (n) {
                        i = build.createOverrideConfig(n, e.override)
                    } else {
                        i = lang.deeplikeCopy(e.override)
                    }
                    require(i)
                }
                a = require.s.contexts._.config.rawText;
                if (a) {
                    lang.eachProp(a, function (e, t) {
                        var n = require.toUrl(t) + ".js";
                        require._cachedRawText[n] = e
                    })
                }
                l.reject.__requireJsBuild = true;
                c.__requireJsBuild = true;
                require(r, c, l.reject);
                if (f[env.get()]) {
                    build.checkForErrors(o)
                }
                return l.promise.then(function () {
                    if (e.override && n) {
                        require(lang.deeplikeCopy(n))
                    }
                    build.checkForErrors(o);
                    return s
                })
            };
            build.checkForErrors = function (e) {
                function g(e, t, n) {
                    if (!t) {
                        return
                    }
                    if (!n) {
                        l.push(e)
                    }
                    if (c[t]) {
                        p = true;
                        if (!h[t]) {
                            h[t] = [];
                            h[t].push(c[t])
                        }
                        h[t].push(e)
                    } else if (!n) {
                        c[t] = e
                    }
                }

                var t, n, r, i, s, o, u = "", a = {}, f = [], l = [], c = {}, h = {}, p = false, d = false, v = e.defined, m = e.registry;
                for (t in m) {
                    if (hasProp(m, t) && t.indexOf("_@r") !== 0) {
                        d = true;
                        r = getOwn(m, t);
                        i = t.split("!");
                        s = i[0];
                        if (t.indexOf("_unnormalized") === -1 && r && r.enabled) {
                            g(t, r.map.url)
                        }
                        if (i.length > 1) {
                            if (falseProp(a, s)) {
                                f.push(s)
                            }
                            o = a[s];
                            if (!o) {
                                o = a[s] = []
                            }
                            o.push(t + (r.error ? ": " + r.error : ""))
                        }
                    }
                }
                if (d) {
                    for (t in v) {
                        if (hasProp(v, t) && t.indexOf("!") === -1) {
                            g(t, require.toUrl(t) + ".js", true)
                        }
                    }
                }
                if (l.length || f.length) {
                    if (f.length) {
                        u += "Loader plugin" + (f.length === 1 ? "" : "s") + " did not call " + "the load callback in the build:\n" + f.map(function (e) {
                                var t = a[e];
                                return e + ":\n  " + t.join("\n  ")
                            }).join("\n") + "\n"
                    }
                    u += "Module loading did not complete for: " + l.join(", ");
                    if (p) {
                        u += "\nThe following modules share the same URL. This " + "could be a misconfiguration if that URL only has " + "one anonymous module in it:";
                        for (n in h) {
                            if (hasProp(h, n)) {
                                u += "\n" + n + ": " + h[n].join(", ")
                            }
                        }
                    }
                    throw new Error(u)
                }
            };
            build.createOverrideConfig = function (e, t) {
                var n = lang.deeplikeCopy(e), r = lang.deeplikeCopy(t);
                lang.eachProp(r, function (r, i) {
                    if (hasProp(build.objProps, i)) {
                        n[i] = {};
                        lang.mixin(n[i], e[i], true);
                        lang.mixin(n[i], t[i], true)
                    } else {
                        n[i] = t[i]
                    }
                });
                return n
            };
            build.flattenModule = function (e, t, n) {
                var r, i, s, o = "";
                return prim().start(function () {
                    var u, a, f, l, c, h, p, d, v, m, g, y, b, w = t.context, E = [], S = {};
                    if (e.override) {
                        n = build.createOverrideConfig(n, e.override)
                    }
                    g = n.namespace || "";
                    y = g ? g + "." : "";
                    b = e.stubModules && e.stubModules._byName || {};
                    e.onCompleteData = {
                        name: e.name,
                        path: n.dir ? e._buildPath.replace(n.dir, "") : e._buildPath,
                        included: []
                    };
                    o += "\n" + e.onCompleteData.path + "\n----------------\n";
                    if (t.existingRequireUrl) {
                        u = t.buildFilePaths.indexOf(t.existingRequireUrl);
                        if (u !== -1) {
                            t.buildFilePaths.splice(u, 1);
                            t.buildFilePaths.unshift(t.existingRequireUrl)
                        }
                    }
                    if (n.generateSourceMaps) {
                        s = n.dir || n.baseUrl;
                        f = e._buildPath === "FUNCTION" ? (e.name || e.include[0] || "FUNCTION") + ".build.js" : e._buildPath.replace(s, "");
                        i = new SourceMapGenerator.SourceMapGenerator({file: f})
                    }
                    r = "";
                    return prim.serial(t.buildFilePaths.map(function (s) {
                        return function () {
                            var u, f = "";
                            l = t.buildFileToModule[s];
                            p = l.split("/").shift();
                            h = t.context.config.pkgs && getOwn(t.context.config.pkgs, p);
                            if (h !== l) {
                                h = undefined
                            }
                            return prim().start(function () {
                                d = w.makeModuleMap(l);
                                v = d.prefix && getOwn(w.defined, d.prefix);
                                if (v) {
                                    if (v.onLayerEnd && falseProp(S, d.prefix)) {
                                        E.push(v);
                                        S[d.prefix] = true
                                    }
                                    if (v.write) {
                                        m = function (e) {
                                            f += "\n" + addSemiColon(e, n);
                                            if (n.onBuildWrite) {
                                                f = n.onBuildWrite(l, s, f)
                                            }
                                        };
                                        m.asModule = function (e, r) {
                                            f += "\n" + addSemiColon(build.toTransport(g, e, s, r, t, {useSourceUrl: t.context.config.useSourceUrl}), n);
                                            if (n.onBuildWrite) {
                                                f = n.onBuildWrite(e, s, f)
                                            }
                                        };
                                        v.write(d.prefix, d.name, m)
                                    }
                                    return
                                } else {
                                    return prim().start(function () {
                                        if (hasProp(b, l)) {
                                            if (hasProp(t.context.plugins, l)) {
                                                return 'define({load: function(id){throw new Error("Dynamic load not allowed: " + id);}});'
                                            } else {
                                                return "define({});"
                                            }
                                        } else {
                                            return require._cacheReadAsync(s)
                                        }
                                    }).then(function (e) {
                                        var r;
                                        a = e;
                                        if (n.cjsTranslate && (!n.shim || !lang.hasProp(n.shim, l))) {
                                            a = commonJs.convert(s, a)
                                        }
                                        if (n.onBuildRead) {
                                            a = n.onBuildRead(l, s, a)
                                        }
                                        if (h) {
                                            r = p === parse.getNamedDefine(a)
                                        }
                                        if (g) {
                                            a = pragma.namespace(a, g)
                                        }
                                        a = build.toTransport(g, l, s, a, t, {useSourceUrl: n.useSourceUrl});
                                        if (h && !r) {
                                            a = addSemiColon(a, n) + "\n";
                                            a += y + "define('" + p + "', ['" + l + "'], function (main) { return main; });\n"
                                        }
                                        if (n.onBuildWrite) {
                                            a = n.onBuildWrite(l, s, a)
                                        }
                                        f += addSemiColon(a, n)
                                    })
                                }
                            }).then(function () {
                                var a, v, m, g, b, w = s.replace(n.dir, "");
                                e.onCompleteData.included.push(w);
                                o += w + "\n";
                                if (l && falseProp(t.modulesWithNames, l) && !n.skipModuleInsertion) {
                                    c = n.shim && (getOwn(n.shim, l) || h && getOwn(n.shim, l) || getOwn(n.shim, p));
                                    if (c) {
                                        if (n.wrapShim) {
                                            f = "(function(root) {\n" + y + 'define("' + l + '", ' + (c.deps && c.deps.length ? build.makeJsArrayString(c.deps) + ", " : "[], ") + "function() {\n" + "  return (function() {\n" + f + "\n" + (c.exportsFn ? c.exportsFn() : "") + "\n" + "  }).apply(root, arguments);\n" + "});\n" + "}(this));\n"
                                        } else {
                                            f += "\n" + y + 'define("' + l + '", ' + (c.deps && c.deps.length ? build.makeJsArrayString(c.deps) + ", " : "") + (c.exportsFn ? c.exportsFn() : "function(){}") + ");\n"
                                        }
                                    } else {
                                        f += "\n" + y + 'define("' + l + '", function(){});\n'
                                    }
                                }
                                f += "\n";
                                if (i) {
                                    a = n.out ? n.baseUrl : e._buildPath;
                                    d = s.split("!");
                                    if (d.length === 1) {
                                        g = build.makeRelativeFilePath(a, s)
                                    } else {
                                        v = d.shift();
                                        m = d.join("!");
                                        if (resourceIsModuleIdRegExp.test(m)) {
                                            g = build.makeRelativeFilePath(a, require.toUrl(m)) + "!" + v
                                        } else {
                                            g = s
                                        }
                                    }
                                    b = r.split("\n").length - 1;
                                    u = f.split("\n").length;
                                    for (var E = 1; E <= u; E += 1) {
                                        i.addMapping({
                                            generated: {line: b + E, column: 0},
                                            original: {line: E, column: 0},
                                            source: g
                                        })
                                    }
                                    i.setSourceContent(g, f)
                                }
                                r += f
                            })
                        }
                    })).then(function () {
                        if (E.length) {
                            E.forEach(function (t) {
                                var i;
                                if (typeof e.out === "string") {
                                    i = e.out
                                } else if (typeof e._buildPath === "string") {
                                    i = e._buildPath
                                }
                                t.onLayerEnd(function (e) {
                                    r += "\n" + addSemiColon(e, n)
                                }, {name: e.name, path: i})
                            })
                        }
                        if (e.create) {
                            r += "\n" + y + 'define("' + e.name + '", function(){});\n'
                        }
                        if (e.insertRequire) {
                            r += "\n" + y + 'require(["' + e.insertRequire.join('", "') + '"]);\n'
                        }
                    })
                }).then(function () {
                    return {
                        text: n.wrap ? n.wrap.start + r + n.wrap.end : r,
                        buildText: o,
                        sourceMap: i ? JSON.stringify(i.toJSON(), null, "  ") : undefined
                    }
                })
            };
            build.makeJsArrayString = function (e) {
                return '["' + e.map(function (e) {
                        return lang.jsEscape(e)
                    }).join('","') + '"]'
            };
            build.toTransport = function (e, t, n, r, i, s) {
                function u(e) {
                    if (i && (e.needsId || e.foundId === t)) {
                        i.modulesWithNames[t] = true
                    }
                }

                var o = i && i.context.config.baseUrl;
                if (o) {
                    n = n.replace(o, "")
                }
                return transform.toTransport(e, t, n, r, u, s)
            };
            return build
        })
    }

    function setBaseUrl(e) {
        dir = e.replace(/\\/g, "/");
        if (dir.indexOf("/") !== -1) {
            dir = dir.split("/");
            dir.pop();
            dir = dir.join("/");
            exec("require({baseUrl: '" + dir.replace(/[\\"']/g, "\\$&") + "'});")
        }
    }

    function createRjsApi() {
        requirejs.optimize = function (e, t, n) {
            if (!loadedOptimizedLib) {
                loadLib();
                loadedOptimizedLib = true
            }
            var r = function (r, i, s) {
                function o(e) {
                    if (requirejs._buildReset) {
                        requirejs._buildReset();
                        requirejs._cacheReset()
                    }
                    if (e instanceof Error) {
                        throw e
                    }
                    return e
                }

                e.logLevel = e.hasOwnProperty("logLevel") ? e.logLevel : i.SILENT;
                if (requirejs._buildReset) {
                    requirejs._buildReset();
                    requirejs._cacheReset()
                }
                n = n || function (e) {
                        console.log(e);
                        s(1)
                    };
                r(e).then(o, o).then(t, n)
            };
            requirejs({context: "build"}, ["build", "logger", "env!env/quit"], r)
        };
        requirejs.tools = {
            useLib: function (e, t) {
                if (!t) {
                    t = e;
                    e = "uselib"
                }
                if (!useLibLoaded[e]) {
                    loadLib();
                    useLibLoaded[e] = true
                }
                var n = requirejs({context: e});
                n(["build"], function () {
                    t(n)
                })
            }
        };
        requirejs.define = define
    }

    var fileName, env, fs, vm, path, exec, rhinoContext, dir, nodeRequire, nodeDefine, exists, reqMain, loadedOptimizedLib, existsForNode, Cc, Ci, version = "2.1.14", jsSuffixRegExp = /\.js$/, commandOption = "", useLibLoaded = {}, rhinoArgs = args, xpconnectArgs = args, readFile = typeof readFileFunc !== "undefined" ? readFileFunc : null;
    if (typeof navigator !== "undefined" && typeof document !== "undefined" || typeof importScripts !== "undefined" && typeof self !== "undefined") {
        env = "browser";
        readFile = function (e) {
            return fs.readFileSync(e, "utf8")
        };
        exec = function (string) {
            return eval(string)
        };
        exists = function () {
            console.log("x.js exists not applicable in browser env");
            return false
        }
    } else if (typeof process !== "undefined" && process.versions && !!process.versions.node) {
        env = "node";
        fs = require("fs");
        vm = require("vm");
        path = require("path");
        existsForNode = fs.existsSync || path.existsSync;
        nodeRequire = require;
        nodeDefine = define;
        reqMain = require.main;
        require = undefined;
        define = undefined;
        readFile = function (e) {
            return fs.readFileSync(e, "utf8")
        };
        exec = function (e, t) {
            return vm.runInThisContext(this.requirejsVars.require.makeNodeWrapper(e), t ? fs.realpathSync(t) : "")
        };
        exists = function (e) {
            return existsForNode(e)
        };
        fileName = process.argv[2];
        if (fileName && fileName.indexOf("-") === 0) {
            commandOption = fileName.substring(1);
            fileName = process.argv[3]
        }
    } else if (typeof Packages !== "undefined") {
        env = "rhino";
        fileName = args[0];
        if (fileName && fileName.indexOf("-") === 0) {
            commandOption = fileName.substring(1);
            fileName = args[1]
        }
        rhinoContext = Packages.org.mozilla.javascript.ContextFactory.getGlobal().enterContext();
        exec = function (e, t) {
            return rhinoContext.evaluateString(this, e, t, 0, null)
        };
        exists = function (e) {
            return (new java.io.File(e)).exists()
        };
        if (typeof console === "undefined") {
            console = {
                log: function () {
                    print.apply(undefined, arguments)
                }
            }
        }
    } else if (typeof Components !== "undefined" && Components.classes && Components.interfaces) {
        env = "xpconnect";
        Components.utils["import"]("resource://gre/modules/FileUtils.jsm");
        Cc = Components.classes;
        Ci = Components.interfaces;
        fileName = args[0];
        if (fileName && fileName.indexOf("-") === 0) {
            commandOption = fileName.substring(1);
            fileName = args[1]
        }
        xpcUtil = {
            isWindows: "@mozilla.org/windows-registry-key;1"in Cc, cwd: function () {
                return FileUtils.getFile("CurWorkD", []).path
            }, normalize: function (e) {
                var t, n, r, i = e.charAt(0);
                if (i !== "/" && i !== "\\" && e.indexOf(":") === -1) {
                    e = xpcUtil.cwd() + "/" + e
                }
                r = e.replace(/\\/g, "/").split("/");
                for (t = 0; t < r.length; t += 1) {
                    n = r[t];
                    if (n === ".") {
                        r.splice(t, 1);
                        t -= 1
                    } else if (n === "..") {
                        r.splice(t - 1, 2);
                        t -= 2
                    }
                }
                return r.join("/")
            }, xpfile: function (e) {
                var t;
                try {
                    t = xpcUtil.normalize(e);
                    if (xpcUtil.isWindows) {
                        t = t.replace(/\//g, "\\")
                    }
                    return new FileUtils.File(t)
                } catch (n) {
                    throw new Error((t || e) + " failed: " + n)
                }
            }, readFile: function (e, t) {
                t = t || "utf-8";
                var n, r, i = {}, s = xpcUtil.xpfile(e);
                try {
                    n = Cc["@mozilla.org/network/file-input-stream;1"].createInstance(Ci.nsIFileInputStream);
                    n.init(s, 1, 0, false);
                    r = Cc["@mozilla.org/intl/converter-input-stream;1"].createInstance(Ci.nsIConverterInputStream);
                    r.init(n, t, n.available(), Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);
                    r.readString(n.available(), i);
                    return i.value
                } catch (o) {
                    throw new Error((s && s.path || "") + ": " + o)
                } finally {
                    if (r) {
                        r.close()
                    }
                    if (n) {
                        n.close()
                    }
                }
            }
        };
        readFile = xpcUtil.readFile;
        exec = function (string) {
            return eval(string)
        };
        exists = function (e) {
            return xpcUtil.xpfile(e).exists()
        };
        if (typeof console === "undefined") {
            console = {
                log: function () {
                    print.apply(undefined, arguments)
                }
            }
        }
    }
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
                var t, n;
                for (t = 0; t < e.length; t++) {
                    n = e[t];
                    if (n === ".") {
                        e.splice(t, 1);
                        t -= 1
                    } else if (n === "..") {
                        if (t === 0 || t == 1 && e[2] === ".." || e[t - 1] === "..") {
                            continue
                        } else if (t > 0) {
                            e.splice(t - 1, 2);
                            t -= 2
                        }
                    }
                }
            }

            function g(e, t, n) {
                var r, i, s, u, a, f, l, c, h, p, d, v, g = t && t.split("/"), y = o.map, b = y && y["*"];
                if (e) {
                    e = e.split("/");
                    l = e.length - 1;
                    if (o.nodeIdCompat && jsSuffixRegExp.test(e[l])) {
                        e[l] = e[l].replace(jsSuffixRegExp, "")
                    }
                    if (e[0].charAt(0) === "." && g) {
                        v = g.slice(0, g.length - 1);
                        e = v.concat(e)
                    }
                    m(e);
                    e = e.join("/")
                }
                if (n && y && (g || b)) {
                    s = e.split("/");
                    e:for (u = s.length; u > 0; u -= 1) {
                        f = s.slice(0, u).join("/");
                        if (g) {
                            for (a = g.length; a > 0; a -= 1) {
                                i = getOwn(y, g.slice(0, a).join("/"));
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
                    r.makeRequire(null, {skipMap: true})([e]);
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
                            m = e.indexOf("!") === -1 ? g(e, l, i) : e
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

        var req, s, head, baseElement, dataMain, src, interactiveScript, currentlyAddingScript, mainScript, subPath, version = "2.1.14", commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg, cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g, jsSuffixRegExp = /\.js$/, currDirRegExp = /^\.\//, op = Object.prototype, ostring = op.toString, hasOwn = op.hasOwnProperty, ap = Array.prototype, apsp = ap.splice, isBrowser = !!(typeof window !== "undefined" && typeof navigator !== "undefined" && window.document), isWebWorker = !isBrowser && typeof importScripts !== "undefined", readyRegExp = isBrowser && navigator.platform === "PLAYSTATION 3" ? /^complete$/ : /^(complete|loaded)$/, defContextName = "_", isOpera = typeof opera !== "undefined" && opera.toString() === "[object Opera]", contexts = {}, cfg = {}, globalDefQueue = [], useInteractive = false;
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
    })(this);
    this.requirejsVars = {require: require, requirejs: require, define: define};
    if (env === "browser") {
        (function () {
            require.load = function (context, moduleName, url) {
                var xhr = new XMLHttpRequest;
                xhr.open("GET", url, true);
                xhr.send();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        eval(xhr.responseText);
                        context.completeLoad(moduleName)
                    }
                }
            }
        })()
    } else if (env === "rhino") {
        (function () {
            "use strict";
            require.load = function (e, t, n) {
                load(n);
                e.completeLoad(t)
            }
        })()
    } else if (env === "node") {
        this.requirejsVars.nodeRequire = nodeRequire;
        require.nodeRequire = nodeRequire;
        (function () {
            "use strict";
            function hasProp(e, t) {
                return hasOwn.call(e, t)
            }

            function syncTick(e) {
                e()
            }

            function makeError(e, t) {
                var n = new Error(e);
                n.requireModules = [t];
                return n
            }

            var nodeReq = requirejsVars.nodeRequire, req = requirejsVars.require, def = requirejsVars.define, fs = nodeReq("fs"), path = nodeReq("path"), vm = nodeReq("vm"), exists = fs.existsSync || path.existsSync, hasOwn = Object.prototype.hasOwnProperty;
            req.get = function (e, t, n, r) {
                if (t === "require" || t === "exports" || t === "module") {
                    e.onError(makeError("Explicit require of " + t + " is not allowed.", t))
                }
                var i, s, o = e.makeModuleMap(t, n, false, true);
                t = o.id;
                if (hasProp(e.defined, t)) {
                    i = e.defined[t]
                } else {
                    if (i === undefined) {
                        s = e.nextTick;
                        e.nextTick = syncTick;
                        try {
                            if (o.prefix) {
                                r([o.originalName]);
                                o = e.makeModuleMap(o.originalName, n, false, true);
                                t = o.id
                            } else {
                                req.load(e, t, o.url);
                                e.enable(o, n)
                            }
                            e.require([t]);
                            i = e.defined[t]
                        } finally {
                            e.nextTick = s
                        }
                    }
                }
                return i
            };
            req.nextTick = function (e) {
                process.nextTick(e)
            };
            req.makeNodeWrapper = function (e) {
                return "(function (require, requirejs, define) { " + e + "\n}(requirejsVars.require, requirejsVars.requirejs, requirejsVars.define));"
            };
            req.load = function (e, t, n) {
                var r, i, s = e.config;
                if (s.shim[t] && (!s.suppress || !s.suppress.nodeShim)) {
                    console.warn("Shim config not supported in Node, may or may not work. Detected " + "for module: " + t)
                }
                if (exists(n)) {
                    r = fs.readFileSync(n, "utf8");
                    r = req.makeNodeWrapper(r);
                    try {
                        vm.runInThisContext(r, fs.realpathSync(n))
                    } catch (o) {
                        i = new Error("Evaluating " + n + ' as module "' + t + '" failed with error: ' + o);
                        i.originalError = o;
                        i.moduleName = t;
                        i.requireModules = [t];
                        i.fileName = n;
                        return e.onError(i)
                    }
                } else {
                    def(t, function () {
                        var r, s = hasProp(e.registry, t) && e.registry[t].map, o = s && s.parentMap, u = s && s.originalName;
                        if (u.charAt(0) === "." && o) {
                            r = o.url.split("/");
                            r.pop();
                            u = r.join("/") + "/" + u
                        }
                        try {
                            return (e.config.nodeRequire || req.nodeRequire)(u)
                        } catch (a) {
                            i = new Error('Tried loading "' + t + '" at ' + n + " then tried node's require(\"" + u + '") and it failed ' + "with error: " + a);
                            i.originalError = a;
                            i.moduleName = u;
                            i.requireModules = [t];
                            throw i
                        }
                    })
                }
                e.completeLoad(t)
            };
            req.exec = function (text) {
                text = req.makeNodeWrapper(text);
                return eval(text)
            }
        })()
    } else if (env === "xpconnect") {
        (function () {
            "use strict";
            require.load = function (e, t, n) {
                load(n);
                e.completeLoad(t)
            }
        })()
    }
    if (commandOption !== "o" && (!fileName || !jsSuffixRegExp.test(fileName))) {
        fileName = "main.js"
    }
    if (env === "node" && reqMain !== module) {
        setBaseUrl(path.resolve(reqMain ? reqMain.filename : "."));
        createRjsApi();
        module.exports = requirejs;
        return
    } else if (env === "browser") {
        setBaseUrl(location.href);
        createRjsApi();
        return
    } else if ((env === "rhino" || env === "xpconnect") && typeof requirejsAsLib !== "undefined" && requirejsAsLib) {
        setBaseUrl(fileName);
        createRjsApi();
        return
    }
    if (commandOption === "o") {
        loadLib();
        require({
            baseUrl: require.s.contexts._.config.baseUrl,
            context: "build",
            catchError: {define: true}
        }, ["env!env/args", "env!env/quit", "logger", "build"], function (e, t, n, r) {
            r(e).then(function () {
            }, function (e) {
                n.error(e);
                t(1)
            })
        })
    } else if (commandOption === "v") {
        console.log("r.js: " + version + ", RequireJS: " + this.requirejsVars.require.version + ", UglifyJS2: 2.4.13, UglifyJS: 1.3.4")
    } else if (commandOption === "convert") {
        loadLib();
        this.requirejsVars.require(["env!env/args", "commonJs", "env!env/print"], function (e, t, n) {
            var r, i;
            r = e[0];
            i = e[1];
            if (!r || !i) {
                n("Usage: path/to/commonjs/modules output/dir");
                return
            }
            t.convertDir(e[0], e[1])
        })
    } else {
        if (commandOption === "lib") {
            loadLib()
        }
        setBaseUrl(fileName);
        if (exists(fileName)) {
            exec(readFile(fileName), fileName)
        } else {
            showHelp()
        }
    }
})(typeof console !== "undefined" ? console : undefined, typeof Packages !== "undefined" || typeof window === "undefined" && typeof Components !== "undefined" && Components.interfaces ? Array.prototype.slice.call(arguments, 0) : [], typeof readFile !== "undefined" ? readFile : undefined)