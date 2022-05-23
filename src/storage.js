class Storage {
    static prefix() {
      return  `__${pixelFuncName}_`;
    }

    static loc() {
      return window.localStorage;
    }

    static sess() {
      return window.sessionStorage;
    }
  
    static set(name, value) {
      this.loc().setItem(`${this.prefix()}${name}`,value);
    }
  
    static get(name) {
      return this.loc().getItem(`${this.prefix()}${name}`);
    }
  
    static delete(name) {
      this.loc().removeItem(`${this.prefix()}${name}`);
    }
  
    static exists(name) {
      return this.get(name) != null;
    }
  
    static setS(name, value) {
      this.sess().setItem(`${this.prefix()}${name}`,value);
    }
  
    static getS(name) {
      return this.sess().getItem(`${this.prefix()}${name}`);
    }
  
    static deleteS(name) {
      this.sess().removeItem(`${this.prefix()}${name}`);
    }
  
    static existsS(name) {
      return this.getS(name) != null;
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
      var locals = ['utm','a','b','c','e','pers','time', 'uid', 'lu', 'lk', 'au', 'ak'];
      var item = '';
      for (var i = 0, l = locals.length; i < l; i++) {
        item = locals[i];
        this.exists(item) ? this.delete(item) : null;
        this.existsS(item) ? this.deleteS(item) : null;
      }
    }
}
  