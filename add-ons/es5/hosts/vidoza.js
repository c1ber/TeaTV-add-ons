

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vidoza = function () {
    function Vidoza(props) {
        _classCallCheck(this, Vidoza);

        this.libs = props.libs;
        this.settings = props.settings;
        this.state = {};
    }

    _createClass(Vidoza, [{
        key: "checkLive",
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url) {
                var httpRequest, html;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                httpRequest = this.libs.httpRequest;

                                // you fill the die status text
                                // const dieStatusText = "";

                                _context.next = 3;
                                return httpRequest.getHTML(url);

                            case 3:
                                html = _context.sent;
                                return _context.abrupt("return", html);

                            case 5:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function checkLive(_x) {
                return _ref.apply(this, arguments);
            }

            return checkLive;
        }()
    }, {
        key: "convertToEmbed",
        value: function convertToEmbed(url) {

            // convert link detail to link embed
            // if input is embed then return input

            // let id = url.match(/\/embed\-([^\-]+)/i);
            // id = url != null ? url[1] : false;

            // if( id == false ) return url;

        }
    }, {
        key: "getLink",
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(url) {
                var _libs, httpRequest, cheerio, sources, html, m, isDie;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _libs = this.libs, httpRequest = _libs.httpRequest, cheerio = _libs.cheerio;
                                sources = [];
                                _context2.next = 4;
                                return this.checkLive(url);

                            case 4:
                                html = _context2.sent;

                                if (!(html == false)) {
                                    _context2.next = 7;
                                    break;
                                }

                                throw new Error("LINK DIE");

                            case 7:

                                /*
                                let startIndex  = html.indexOf('jwplayer("vplayer").setup');
                                html            = html.substring(startIndex);
                                html            = html.substring(0, html.indexOf(".setVolume("));
                                html            = html.replace('jwplayer("vplayer").setup', "player = ");
                                html            += ";";
                                 var player;
                                eval(html);
                                let data = player.sources;
                                 let arrPromise = data.map( async val => {
                                    
                                    let isDie = await httpRequest.isLinkDie(val.file);
                                     if( isDie != false ) {
                                         sources.push({
                                            label: val.file.indexOf("mp4") !== -1 ? val.label : "NOR",
                                            file: val.file,
                                            type: "embed",
                                            size: isDie
                                        });
                                    }
                                
                                 });
                                 await Promise.all(arrPromise);
                                */

                                m = html.match(/source src="([^"]+)/);

                                if (!(m != undefined)) {
                                    _context2.next = 14;
                                    break;
                                }

                                console.log(m[1]);
                                _context2.next = 12;
                                return httpRequest.isLinkDie(m[1]);

                            case 12:
                                isDie = _context2.sent;

                                sources.push({
                                    label: m[1].indexOf("mp4") !== -1 ? 'NOR' : "NOR",
                                    file: m[1],
                                    type: "direct",
                                    size: isDie
                                });

                            case 14:
                                return _context2.abrupt("return", {
                                    host: {
                                        url: url,
                                        name: "vidoza"
                                    },
                                    result: sources
                                });

                            case 15:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function getLink(_x2) {
                return _ref2.apply(this, arguments);
            }

            return getLink;
        }()
    }]);

    return Vidoza;
}();

thisSource.function = function (libs, settings) {
    return new Vidoza({ libs: libs, settings: settings });
};