// Open Pixel v1.3.0 | Published By Dockwa | Created By Stuart Yamartino | MIT License
;(function(window, document, pixelFunc, pixelFuncName, pixelEndpoint, versionNumber) {
"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Config = {
  id: '',
  params: {},
  version: versionNumber,
  datahost: 'https://us-central1-trakmarket-prod.cloudfunctions.net',
  host: 'https://trakmkt.com',
  iphost: 'https://api.ipify.org?format=json',
  ipinfo: 'https://ipinfo.io/json'
};

var Helper = /*#__PURE__*/function () {
  function Helper() {
    _classCallCheck(this, Helper);
  }

  _createClass(Helper, null, [{
    key: "isPresent",
    value: function isPresent(variable) {
      return typeof variable !== 'undefined' && variable !== null && variable !== '';
    }
  }, {
    key: "now",
    value: function now() {
      return 1 * new Date();
    }
  }, {
    key: "guid",
    value: function guid() {
      return Config.version + '-xxxxxxxx-'.replace(/[x]/g, function (c) {
        var r = Math.random() * 36 | 0,
            v = c == 'x' ? r : r & 0x3 | 0x8;
        return v.toString(36);
      }) + (1 * new Date()).toString(36);
    } // reduces all optional data down to a string

  }, {
    key: "optionalData",
    value: function optionalData(data) {
      if (Helper.isPresent(data) === false) {
        // obtener datos del cpa de una campaña
        if (Storage.exists('b') && Storage.exists('a') && Storage.exists('e')) {
          var akw = Storage.exists('ak') ? Storage.get('ak') : '';
          var au = Storage.exists('au') ? Storage.get('au') : '';
          var sale = ''; // buscar las keyword

          if (akw !== '') {
            var rakw = JSON.parse(Helper.recoveryString(akw));

            if (typeof rakw.length === 'number' && rakw.length > 0) {
              var url = window.location.href;

              for (var _i = 0; _i < rakw.length; _i++) {
                var _k = rakw[_i];
                var keyword = _k.keyword;

                if (url.includes(keyword)) {
                  var id = _k.id ? _k.id : '';
                  var klass = _k["class"] ? _k["class"] : '';
                  sale = Helper.getSale(id, klass);
                }
              }
            }
          } // si no existe sale buscar por la url


          if (au !== '' && sale === '') {
            var aurl = JSON.parse(Helper.recoveryString(au));

            if (typeof aurl['url'] === 'string') {
              var ur = aurl;

              var _url = ur['secure'] + '://' + (ur.url[ur.url.length - 1] === '/' ? ur['url'].substring(0, ur.url.length - 2) : ur['url']);

              var durl = window.location.href;

              if (durl.includes(_url)) {
                var _id = ur.id ? ur.id : '';

                var _klass = ur["class"] ? ur["class"] : '';

                sale = Helper.getSale(_id, _klass);
              }
            }
          }

          return Helper.optionalData({
            "a": Storage.get('a'),
            "b": Storage.get('b'),
            "c": Storage.get('c'),
            "e": Storage.get('e'),
            "cu": Storage.exists('cu') ? Storage.get('cu') : '',
            "au": au,
            "ak": akw,
            "lu": Storage.exists('lu') ? Storage.get('lu') : '',
            "lk": Storage.exists('lk') ? Storage.get('lk') : '',
            "banner": Storage.exists('banner') ? Storage.get('banner') : '',
            "session": Storage.existsS('session') ? Storage.getS('session') : '',
            "sale": sale,
            "multisite": false
          });
        } //obtener click de multisitio y organicos
        else if (Storage.exists('campaigns')) {
          var campaignsStorage = JSON.parse(Storage.get('campaigns'));
          var _url2 = window.location.href;
          var _sale = '';
          var cmpgn = null;
          var type = '';
          var salePosition = 1;

          if (typeof campaignsStorage.length === 'number' && campaignsStorage.length > 0) {
            //obtener campaigns en base al referrer
            var campaigns = campaignsStorage; //obtener datos cpa de algun click organico

            if (Storage.exists('checkO')) {} //obtener datos de sitios multisitio
            else if (Storage.exists('checkM')) {
              for (var _i2 = 0; _i2 < campaigns.length; _i2++) {
                var campaign = campaigns[_i2];

                if (campaign['multiSiteCpa'] !== undefined && cmpgn === null) {
                  var cpa = campaign['cpa'];
                  var kw = cpa['keywords'];

                  if (kw !== undefined && typeof kw.length === 'number' && kw.length > 0) {
                    for (var j = 0; j < kw.length; j++) {
                      var _k2 = kw[j];

                      if (_url2.includes(_k2['keyword']) && _sale === '') {
                        var id = _k2.id ? _k2.id : '';
                        var klass = _k2["class"] ? _k2["class"] : '';
                        _sale = Helper.getSale(id, klass);
                        cmpgn = campaign;
                        type = 'cpa';
                        salePosition = _k2['salePosition'] ? +_k2['salePosition'] : 1;
                      }
                    }
                  } //encontrar click desde url si no se encontro en kwords


                  if (cpa['url']['url'] !== undefined && cpa['url']['url'].includes('/') && cmpgn === null) {
                    var uUrl = cpa['url']['url'];

                    if (_url2.includes(uUrl) && _sale === '') {
                      var id = cpa['url'].id ? k.id : '';
                      var klass = cpa['url']["class"] ? cpa['url']["class"] : '';
                      _sale = Helper.getSale(id, klass);
                      cmpgn = campaign;
                      type = 'cpa';
                      salePosition = cpa['url']['salePosition'] ? +cpa['url']['salePosition'] : 1;
                    }
                  }
                } // si no obtubo cpa, obtener cpl


                if (campaign['multiSiteCpl'] && cmpgn === null) {
                  var cpl = campaign['cpl'];
                  var _kw = cpl['keywords'];

                  if (_kw !== undefined && typeof _kw.length === 'number' && _kw.length > 0) {
                    for (var _k3 = 0; _k3 < _kw.length; _k3++) {
                      var key = _kw[_k3];

                      if (_url2.includes(key['keyword'])) {
                        cmpgn = campaign;
                        type = 'cpl';
                      }
                    }
                  } //obtener cpl desde la url si no se encontro anteriormente


                  if (cpl['url']['url'] !== undefined && cpl['url']['url'].includes('/') && cmpgn === null) {
                    var _uUrl = cpl['url']['url'];

                    if (_url2.includes(_uUrl)) {
                      cmpgn = campaign;
                      type = 'cpl';
                    }
                  }
                }
              } //datos multisitio


              return Helper.optionalData({
                "campaign": cmpgn,
                "campaigns": campaigns,
                "type": type,
                "session": Storage.existsS('session') ? Storage.getS('session') : '',
                "sale": _sale,
                "multisite": true,
                "salePosition": salePosition
              });
            }
          }
        } // si no es nunguno de los anteriores regresar vacio


        return '';
      } else if (_typeof(data) === 'object') {
        // runs Helper.optionalData again to reduce to string in case something else was returned
        return Helper.optionalData(JSON.stringify(data));
      } else if (typeof data === 'function') {
        // runs the function and calls Helper.optionalData again to reduce further if it isn't a string
        return Helper.optionalData(data());
      } else {
        return String(data);
      }
    } // crear un limite de tiempo para borrar la informacion del local Storage

  }, {
    key: "createTime",
    value: function createTime() {
      var persistence = Storage.exists('pers') ? +Storage.get('pers') : 8;
      var date = new Date();
      date.setDate(date.getDate() + persistence);
      return date.toISOString();
    }
  }, {
    key: "timeDelete",
    value: function timeDelete(time) {
      var date = new Date().getTime();
      return +time < date;
    }
  }, {
    key: "gsuid",
    value: function gsuid() {
      return (1 * new Date()).toString(36);
    }
  }, {
    key: "getSale",
    value: function getSale(id, klass) {
      var sales = [];

      if (id !== '') {
        var getId = document.getElementById(id);

        if (getId) {
          var html = getId.innerHTML.replace(/<[^<>]*>/g, '');
          sales.push(html);
        } else {
          console.log('soy nulo');
        }
      }

      if (sales.length === 0 && klass !== '') {
        var separa = klass.split('/');

        if (separa.length === 1) {
          var klasses = document.getElementsByClassName(klass);

          if (klasses.length > 0) {
            for (var j = 0; j < klasses.length; j++) {
              var c = klasses[j];

              var _html = c.innerHTML.replace(/<[^<>]*>/g, '').replace(/,/g, '.');

              sales.push(_html);
            }
          }
        } else if (separa.length > 1) {
          var _klasses = document.getElementsByClassName(separa[0]);

          if (_klasses.length > 0) {
            if (_klasses[0].children.length > 0) {
              for (var _i3 = 0; _i3 < _klasses[0].children.length; _i3++) {
                var element = _klasses[0].children[_i3];

                if (element.localName === separa[1]) {
                  sales.push(element.textContent.replace(/\$/g, '').replace(/,/g, '.'));
                }

                ;
              }
            }
          }
        }
      }

      if (sales.length > 0) {
        return sales.toString().replace(/\\n/g, '');
      }

      return '';
    }
  }]);

  return Helper;
}();

_defineProperty(Helper, "recoveryString", function (str) {
  return str.replace(/_comma_/g, ',').replace(/_dash_/g, '/').replace(/_point_/g, '.').replace(/_colon_/g, ':').replace(/_bracketo_/g, '[').replace(/_bracketc_/g, ']').replace(/_braceo_/g, '{').replace(/_bracec_/g, '}').replace(/_quote_/g, '"').replace(/_bslash_/g, '\\');
});

var Browser = /*#__PURE__*/function () {
  function Browser() {
    _classCallCheck(this, Browser);
  }

  _createClass(Browser, null, [{
    key: "nameAndVersion",
    value: function nameAndVersion() {
      // http://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser
      var ua = navigator.userAgent.replace(/CriOS/g, 'Chrome'),
          tem,
          M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

      if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
      }

      if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
      }

      M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
      if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
      return M.join(' ');
    }
  }, {
    key: "isMobile",
    value: function isMobile() {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    }
  }, {
    key: "userAgent",
    value: function userAgent() {
      return window.navigator.userAgent;
    }
  }]);

  return Browser;
}();

var Storage = /*#__PURE__*/function () {
  function Storage() {
    _classCallCheck(this, Storage);
  }

  _createClass(Storage, null, [{
    key: "prefix",
    value: function prefix() {
      return "__".concat(pixelFuncName, "_");
    }
  }, {
    key: "loc",
    value: function loc() {
      return window.localStorage;
    }
  }, {
    key: "sess",
    value: function sess() {
      return window.sessionStorage;
    }
  }, {
    key: "set",
    value: function set(name, value) {
      this.loc().setItem("".concat(this.prefix()).concat(name), value);
    }
  }, {
    key: "get",
    value: function get(name) {
      return this.loc().getItem("".concat(this.prefix()).concat(name));
    }
  }, {
    key: "delete",
    value: function _delete(name) {
      this.loc().removeItem("".concat(this.prefix()).concat(name));
    }
  }, {
    key: "exists",
    value: function exists(name) {
      return this.get(name) != null;
    }
  }, {
    key: "setS",
    value: function setS(name, value) {
      this.sess().setItem("".concat(this.prefix()).concat(name), value);
    }
  }, {
    key: "getS",
    value: function getS(name) {
      return this.sess().getItem("".concat(this.prefix()).concat(name));
    }
  }, {
    key: "deleteS",
    value: function deleteS(name) {
      this.sess().removeItem("".concat(this.prefix()).concat(name));
    }
  }, {
    key: "existsS",
    value: function existsS(name) {
      return this.getS(name) != null;
    }
  }, {
    key: "setUtms",
    value: function setUtms() {
      var utmArray = ['utm_source', 'utm_medium', 'utm_term', 'utm_content', 'utm_campaign'];
      var exists = false;

      for (var i = 0, l = utmArray.length; i < l; i++) {
        if (Helper.isPresent(Url.getParameterByName(utmArray[i]))) {
          exists = true;
          break;
        }
      }

      if (exists) {
        var val,
            save = {};

        for (var i = 0, l = utmArray.length; i < l; i++) {
          val = Url.getParameterByName(utmArray[i]);

          if (Helper.isPresent(val)) {
            save[utmArray[i]] = val;
          }
        }

        this.set('utm', JSON.stringify(save));
      }
    }
  }, {
    key: "getUtm",
    value: function getUtm(name) {
      if (this.exists('utm')) {
        var utms = JSON.parse(this.get('utm'));
        return name in utms ? utms[name] : '';
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      var locals = ['utm', 'a', 'b', 'c', 'e', 'pers', 'time', 'checkC', 'uid', 'lu', 'lk', 'au', 'ak', 'cu'];
      var item = '';

      for (var i = 0, l = locals.length; i < l; i++) {
        item = locals[i];
        this.exists(item) ? this["delete"](item) : null;
        this.existsS(item) ? this.deleteS(item) : null;
      }
    }
  }]);

  return Storage;
}();

var Ip = /*#__PURE__*/function () {
  function Ip() {
    _classCallCheck(this, Ip);
  }

  _createClass(Ip, null, [{
    key: "getIp",
    value: function getIp() {
      axios.get(Config.iphost).then(function (response) {
        var ip = response.data.ip;

        if (!Storage.exists('ip') || Storage.get('ip') != ip) {
          Ip.existsIp(ip);
        } else {
          var _day = new Date().getDate();

          Storage.set('check', _day);
        }

        Storage.set('ip', response.data.ip);
      });
    }
  }, {
    key: "existsIp",
    value: function existsIp(ip) {
      axios.get(Config.datahost + '/ip/' + ip).then(function (response) {
        var info = response.data;

        if (info != '') {
          var city = info.city;
          var region = info.region;
          var country = info.country;
          var postal = info.postal;
          var timezone = info.timezone;
          var loc = info.loc.split(',');
          var latitude = loc[0];
          var longitude = loc[1];
          Storage.set('location', JSON.stringify({
            city: city,
            region: region,
            country: country,
            latitude: latitude,
            longitude: longitude,
            postal: postal,
            timezone: timezone
          }));
          Storage.set('ipinfo', 'ok');

          var _day2 = new Date().getDate();

          Storage.set('check', _day2);
        } else {
          Ip.getIpInfo();
        }
      });
    }
  }, {
    key: "getIpInfo",
    value: function getIpInfo() {
      axios.get(Config.ipinfo).then(function (response) {
        var info = response.data;
        var city = info.city;
        var region = info.region;
        var country = info.country;
        var postal = info.postal;
        var timezone = info.timezone;
        var loc = info.loc.split(',');
        var latitude = loc[0];
        var longitude = loc[1];
        Storage.set('ipinfo', JSON.stringify(info));
        Storage.set('location', JSON.stringify({
          city: city,
          region: region,
          country: country,
          latitude: latitude,
          longitude: longitude,
          postal: postal,
          timezone: timezone
        }));
        Ip.saveIpInfo(info);
      });
    }
  }, {
    key: "saveIpInfo",
    value: function saveIpInfo(info) {
      axios.post(Config.datahost + '/ip', info).then(function (response) {
        var city = info.city;
        var region = info.region;
        var country = info.country;
        var postal = info.postal;
        var timezone = info.timezone;
        var loc = info.loc.split(',');
        var latitude = loc[0];
        var longitude = loc[1];
        Storage.set('location', JSON.stringify({
          city: city,
          region: region,
          country: country,
          latitude: latitude,
          longitude: longitude,
          postal: postal,
          timezone: timezone
        }));
        Storage.set('ipinfo', 'ok');
        var day = new Date().getDate();
        Storage.set('check', day);
      });
    }
  }]);

  return Ip;
}();

var Url = /*#__PURE__*/function () {
  function Url() {
    _classCallCheck(this, Url);
  }

  _createClass(Url, null, [{
    key: "getParameterByName",
    value: // http://stackoverflow.com/a/901144/1231563
    function getParameterByName(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
  }, {
    key: "externalHost",
    value: function externalHost(link) {
      return link.hostname != location.hostname && link.protocol.indexOf('http') === 0;
    }
  }]);

  return Url;
}();

var Pixel = /*#__PURE__*/function () {
  function Pixel(event, timestamp, optional) {
    _classCallCheck(this, Pixel);

    this.params = [];
    this.event = event;
    this.timestamp = timestamp;
    this.optional = Helper.optionalData(optional);
    this.buildParams();
    this.send();
  }

  _createClass(Pixel, [{
    key: "buildParams",
    value: function buildParams() {
      var attr = this.getAttribute();

      for (var index in attr) {
        if (attr.hasOwnProperty(index)) {
          this.setParam(index, attr[index](index));
        }
      }
    }
  }, {
    key: "getAttribute",
    value: function getAttribute() {
      var _this = this;

      return _objectSpread({
        id: function id() {
          return Config.id;
        },
        // website Id
        uid: function uid() {
          return Storage.exists('uid') ? Storage.get('uid') : Storage.getS('uid');
        },
        // user Id
        ev: function ev() {
          return _this.event;
        },
        // event being triggered
        ip: function ip() {
          return Storage.exists('ip') ? Storage.get('ip') : '';
        },
        // ip client
        location: function location() {
          return Storage.exists('location') ? Storage.get('location') : '';
        },
        // location for ip client
        ed: function ed() {
          return _this.optional;
        },
        // any event data to pass along
        v: function v() {
          return Config.version;
        },
        // openpixel.js version
        dl: function dl() {
          return window.location.href;
        },
        // document location
        rl: function rl() {
          return document.referrer;
        },
        // referrer location
        ts: function ts() {
          return _this.timestamp;
        },
        // timestamp when event was triggered
        de: function de() {
          return document.characterSet;
        },
        // document encoding
        sr: function sr() {
          return window.screen.width + 'x' + window.screen.height;
        },
        // screen resolution
        vp: function vp() {
          return window.innerWidth + 'x' + window.innerHeight;
        },
        // viewport size
        cd: function cd() {
          return window.screen.colorDepth;
        },
        // color depth
        dt: function dt() {
          return document.title;
        },
        // document title
        bn: function bn() {
          return Browser.nameAndVersion();
        },
        // browser name and version number
        md: function md() {
          return Browser.isMobile();
        },
        // is a mobile device?
        ua: function ua() {
          return Browser.userAgent();
        },
        // user agent
        tz: function tz() {
          return new Date().getTimezoneOffset();
        },
        // timezone
        utm_source: function utm_source(key) {
          return Storage.getUtm(key);
        },
        // get the utm source
        utm_medium: function utm_medium(key) {
          return Storage.getUtm(key);
        },
        // get the utm medium
        utm_term: function utm_term(key) {
          return Storage.getUtm(key);
        },
        // get the utm term
        utm_content: function utm_content(key) {
          return Storage.getUtm(key);
        },
        // get the utm content
        utm_campaign: function utm_campaign(key) {
          return Storage.getUtm(key);
        }
      }, Config.params);
    }
  }, {
    key: "setParam",
    value: function setParam(key, val) {
      if (Helper.isPresent(val)) {
        this.params.push("".concat(key, "=").concat(encodeURIComponent(val)));
      } else {
        this.params.push("".concat(key, "="));
      }
    }
  }, {
    key: "send",
    value: function send() {
      window.navigator.sendBeacon ? this.sendBeacon() : this.sendImage();
    }
  }, {
    key: "sendBeacon",
    value: function sendBeacon() {
      window.navigator.sendBeacon(this.getSourceUrl());
    }
  }, {
    key: "sendImage",
    value: function sendImage() {
      this.img = document.createElement('img');
      this.img.src = this.getSourceUrl();
      this.img.style.display = 'none';
      this.img.width = '1';
      this.img.height = '1';
      document.getElementsByTagName('body')[0].appendChild(this.img);
    }
  }, {
    key: "getSourceUrl",
    value: function getSourceUrl() {
      return "".concat(pixelEndpoint, "?").concat(this.params.join('&'));
    }
  }]);

  return Pixel;
}(); // uid y persistence remplazar si existe en parametros o crear default


Helper.isPresent(Url.getParameterByName('uid')) ? Storage.set('uid', Url.getParameterByName('uid')) : Storage.exists('uid') ? null : Storage.existsS('uid') ? null : Storage.setS('uid', Helper.guid());
Helper.isPresent(Url.getParameterByName('pers')) ? Storage.set('pers', Url.getParameterByName('pers')) : Storage.exists('pers') ? null : Storage.set('pers', '1'); // check a-b-e cookies remplazar si existe en parametros

Helper.isPresent(Url.getParameterByName('a')) ? Storage.set('a', Url.getParameterByName('a')) : null;
Helper.isPresent(Url.getParameterByName('b')) ? Storage.set('b', Url.getParameterByName('b')) : null;
Helper.isPresent(Url.getParameterByName('c')) ? Storage.set('c', Url.getParameterByName('c')) : null;
Helper.isPresent(Url.getParameterByName('e')) ? Storage.set('e', Url.getParameterByName('e')) : null;
var day = new Date().getDate().toString();
Helper.isPresent(Url.getParameterByName('cu')) ? Storage.set('cu', Url.getParameterByName('cu')) : null;
Helper.isPresent(Url.getParameterByName('lu')) ? Storage.set('lu', Url.getParameterByName('lu')) : null;
Helper.isPresent(Url.getParameterByName('lk')) ? Storage.set('lk', Url.getParameterByName('lk')) : null;
Helper.isPresent(Url.getParameterByName('au')) ? Storage.set('au', Url.getParameterByName('au')) : null;
Helper.isPresent(Url.getParameterByName('ak')) ? Storage.set('ak', Url.getParameterByName('ak')) : null;
Helper.isPresent(Url.getParameterByName('banner')) ? Storage.set('banner', Url.getParameterByName('banner')) : null;
Helper.isPresent(Url.getParameterByName('c')) ? Storage.set('checkC', day) : null; // crear tiempo de vida, en base a la persistence

Storage.exists('time') ? Helper.timeDelete(Storage.get('time')) ? Storage.clear() : null : Storage.set('time', Helper.createTime()); // crear variable de sessioin

Storage.existsS('session') ? null : Storage.setS('session', Helper.gsuid()); // save any utms through as session cookies

Storage.setUtms();

if (typeof axios != 'undefined') {
  //obtener los datos de las cmapañas
  if (Storage.exists('c') && Storage.get('checkC') != day) {
    var c = Storage.get('c');
    axios.get(Config.datahost + '/campaign/' + c).then(function (response) {
      //hacer calculos para establecer nueva persistencia o eliminar data si esta ya invigente la campaña
      if (response.data.status === 'active') {
        var newPers = response.data.persistence;
        var oldPers = +Storage.get('pers');

        if (newPers != oldPers) {
          var currentDate = new Date();
          var newDate = new Date(Storage.get('time'));
          newDate.setDate(newDate.getDate() - oldPers + newPers);

          if (currentDate.getTime() < newDate.getTime()) {
            Storage["delete"]('pers');
            Storage["delete"]('time');
            Storage.set('pers', newPers);
            Storage.set('time', newDate.toISOString());
          } else {
            Storage.clear();
          }
        }

        Storage.set('cu', response.data.cu);
        Storage.set('au', response.data.au);
        Storage.set('lu', response.data.lu);
        Storage.set('ak', response.data.ak);
        Storage.set('lk', response.data.lk);
        Storage.set('checkC', day);
      } else {
        Storage.clear();
      }
    });
  } // obtener los datos para los click organicos


  if (!Storage.exists('c') && Storage.get('checkO')) {
    var site = window.location.href.split('/')[2];
    axios.get(Config.datahost + '/site/only/' + site).then(function (response) {
      var campaigns = response.data;
      Storage.set('campaigns', JSON.stringify(campaigns));
      Storage.set('checkO', day);
    });
  } //obtener los datos de la ip y ubicacion


  if (!Storage.exists('check') || Storage.get('check') != day) {
    Ip.getIp();
  }

  if (Storage.exists('ip')) {
    if (Storage.exists('ipinfo') && Storage.get('ipinfo') != 'ok') {
      Ip.saveIpInfo(JSON.parse(Storage.get('ipinfo')));
    } else if (!Storage.exists('ipinfo')) {
      Ip.existsIp(Storage.get('ip'));
    }
  }
} // process the queue and future incoming commands


pixelFunc.process = function (method, value, optional) {
  if (method === 'init') {
    Config.id = value;
  } else if (method === 'param') {
    Config.params[value] = function () {
      return optional;
    };
  } else if (method === 'event') {
    if (value.includes('pageload') && !Config.pageLoadOnce) {
      // Config.pageLoadOnce = true;
      new Pixel(value, pixelFunc.t, optional);
    } else if (!value.includes('pageload') && value !== 'pageclose') {
      new Pixel(value, Helper.now(), optional);
    }
  }
}; // run the queued calls from the snippet to be processed


for (var i = 0, l = pixelFunc.queue.length; i < l; i++) {
  pixelFunc.process.apply(pixelFunc, pixelFunc.queue[i]);
} // https://github.com/GoogleChromeLabs/page-lifecycle/blob/master/src/Lifecycle.mjs
// Safari does not reliably fire the `pagehide` or `visibilitychange`


var isSafari = (typeof safari === "undefined" ? "undefined" : _typeof(safari)) === 'object' && safari.pushNotification;
var isPageHideSupported = ('onpageshow' in self); // IE9-10 do not support the pagehide event, so we fall back to unload
// pagehide event is more reliable but less broad than unload event for mobile and modern browsers

var pageCloseEvent = isPageHideSupported && !isSafari ? 'pagehide' : 'unload';
window.addEventListener(pageCloseEvent, function () {
  if (!Config.pageCloseOnce && !Config.id.includes('-')) {
    Config.pageCloseOnce = true;
    new Pixel('pageclose', Helper.now(), function () {
      // if a link was clicked in the last 5 seconds that goes to an external host, pass it through as event data
      if (Helper.isPresent(Config.externalHost) && Helper.now() - Config.externalHost.time < 5 * 1000) {
        return Config.externalHost.link;
      }
    });
  }
});

window.onload = function () {
  //solo aplicar cuando los sitios sean normales
  //clicks normales
  if (!Config.id.includes('-')) {
    //solicitar pixel al cargar completamente la pagina
    new Pixel('pageloaded', Helper.now()); // cargar cada 5 segundos al no estar dl declarada, por snipet

    var url2 = location.href;

    if (typeof dl == 'undefined') {
      setTimeout(function () {
        new Pixel('pageload-5s', Helper.now());
      }, 5000);
    }

    setInterval(function () {
      var nurl = location.href;

      if (url2 !== nurl) {
        new Pixel('pageload-sp', Helper.now());
        url2 = nurl;
      }
    }, 1823); //revisar cada 800 ms si hay cpa

    if (Storage.exists('uid') && Storage.get('uid')[0] === 'S' && Storage.exists('b') && Storage.exists('a') && Storage.exists('e')) {
      // obtener datos del cpa de una campaña
      var akw = Storage.exists('ak') ? Storage.get('ak') : '';
      var au = Storage.exists('au') ? Storage.get('au') : '';
      var sale = '';
      var count = 0;

      if (akw !== '' || au !== '') {
        setInterval(function () {
          // buscar las keyword
          if (sale === '' && akw !== '') {
            var rakw = JSON.parse(Helper.recoveryString(akw));

            if (typeof rakw.length === 'number' && rakw.length > 0) {
              var url = window.location.href;

              for (var _i4 = 0; _i4 < rakw.length; _i4++) {
                var _k4 = rakw[_i4];
                var keyword = _k4.keyword;

                if (url.includes(keyword)) {
                  var id = _k4.id ? _k4.id : '';
                  var klass = _k4["class"] ? _k4["class"] : '';
                  sale = Helper.getSale(id, klass);
                }
              }
            }
          } // si no existe sale buscar por la url


          if (sale === '' && au !== '') {
            var aurl = JSON.parse(Helper.recoveryString(au));

            if (typeof aurl['url'] === 'string') {
              var ur = aurl;

              var _url3 = ur['secure'] + '://' + (ur.url[ur.url.length - 1] === '/' ? ur['url'].substring(0, ur.url.length - 2) : ur['url']);

              var durl = window.location.href;

              if (durl.includes(_url3)) {
                var _id2 = ur.id ? ur.id : '';

                var _klass2 = ur["class"] ? ur["class"] : '';

                sale = Helper.getSale(_id2, _klass2);
              }
            }
          }

          if (sale !== '' && count < 18) {
            count++;
            new Pixel('pageloaded', Helper.now(), {
              "a": Storage.get('a'),
              "b": Storage.get('b'),
              "c": Storage.get('c'),
              "e": Storage.get('e'),
              "cu": Storage.exists('cu') ? Storage.get('cu') : '',
              "au": au,
              "ak": akw,
              "lu": Storage.exists('lu') ? Storage.get('lu') : '',
              "lk": Storage.exists('lk') ? Storage.get('lk') : '',
              "banner": Storage.exists('banner') ? Storage.get('banner') : '',
              "session": Storage.existsS('session') ? Storage.getS('session') : '',
              "sale": sale,
              "multisite": false
            });
          }
        }, 800);
      }
    }
  } //obtener los datos del sitio multisitio
  else if (Config.id.includes('-')) {
    var day = new Date().getDate().toString(); //evitar que envie page close

    Config.pageCloseOnce = true;

    if (Storage.get('checkM') != day) {
      var _site = window.location.href.split('/')[2];
      axios.get(Config.datahost + '/site/multi/' + _site + '?ua=' + Browser.userAgent()).then(function (response) {
        var campaigns = response.data.campaigns;
        var uid = response.data.uid;
        Storage.set('campaigns', JSON.stringify(campaigns));
        Storage.set('checkM', day);
        console.log('obtuve campañas');

        if (uid !== '') {
          if (!Storage.exists('uid')) Storage.set('uid', uid);
          console.log('uid changed');
          var url2 = window.location.href;
          new Pixel('pageload', Helper.now());
          setTimeout(function () {
            new Pixel('pageload-5s', Helper.now());
          }, 5000); //enmviar pixeltrack si cambia de url

          var url2 = window.location.href;
          setInterval(function () {
            var nurl = window.location.href;

            if (url2 != nurl) {
              new Pixel('pageload-sp', Helper.now());
              url2 = nurl;
            }
          }, 1823);
        }
      });
    } // enviar clicks normales al existir storaage.campaigns


    if (Storage.exists('campaigns') && Storage.exists('uid')) {
      new Pixel('pageload', Helper.now());
      var url2 = window.location.href;

      if (typeof dl == 'undefined') {
        setTimeout(function () {
          new Pixel('pageload-5s', Helper.now());
        }, 5000);
      }

      setInterval(function () {
        var nurl = window.location.href;

        if (url2 != nurl) {
          new Pixel('pageload-sp', Helper.now());
          url2 = nurl;
        }
      }, 1823);
    }
  }

  var aTags = document.getElementsByTagName('a');

  for (var i = 0, l = aTags.length; i < l; i++) {
    aTags[i].addEventListener('click', function (_e) {
      if (Url.externalHost(this)) {
        Config.externalHost = {
          link: this.href,
          time: Helper.now()
        };
      }
    }.bind(aTags[i]));
  }

  var dataAttributes = document.querySelectorAll('[data-opix-event]');

  for (var i = 0, l = dataAttributes.length; i < l; i++) {
    dataAttributes[i].addEventListener('click', function (_e) {
      var event = this.getAttribute('data-opix-event');

      if (event) {
        new Pixel(event, Helper.now(), this.getAttribute('data-opix-data'));
      }
    }.bind(dataAttributes[i]));
  }
};
}(window, document, window["opix"], "opix", "https://trakmkt.com/pixel", 1));
