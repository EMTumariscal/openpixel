class Storage {
    static prefix() {
      return  `__${pixelFuncName}_`;
    }
  
    static set(name, value) {
      var local = window.localStorage;
      local.setItem(`${this.prefix()}${name}`,value);
    }
  
    static get(name) {
      var local = window.localStorage;
      return local.getItem(`${this.prefix()}${name}`);
    }
  
    static delete(name) {
      var local = window.localStorage;
      local.removeItem(`${this.prefix()}${name}`);
    }
  
    static exists(name) {
      return this.get(name) != null;
    }
  
    static setUtms() {
      var utmArray = ['utm_source', 'utm_medium', 'utm_term', 'utm_content', 'utm_campaign'];
      var exists = false;
      for (var i = 0, l = utmArray.length; i < l; i++) {
        if (Helper.isPresent(Url.getParameterByName(utmArray[i]))) {
          exists = true;
          break;
        }
      }
      if (exists) {
        var val, save = {};
        for (var i = 0, l = utmArray.length; i < l; i++) {
          val = Url.getParameterByName(utmArray[i]);
          if (Helper.isPresent(val)) {
            save[utmArray[i]] = val;
          }
        }
        this.set('utm', JSON.stringify(save));
      }
    }
  
    static getUtm(name) {
      if (this.exists('utm')) {
        var utms = JSON.parse(this.get('utm'));
        return name in utms ? utms[name] : '';
      }
    }

    static clear(){
      var local = window.localStorage;
      local.clear();
    }
}
  