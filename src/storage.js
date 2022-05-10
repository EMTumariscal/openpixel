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
      var locals = ['utm','a','b','c','e','pers','time'];
      var item = '';
      for (var i = 0, l = locals.length; i < l; i++) {
        item = locals[i];
        this.delete(item);
      }
    }

    static checkParams(){
      //si existen parametros, eliminar todos
      Helper.isPresent(Url.getParameterByName('a')) ? this.clear() : null;
      Helper.isPresent(Url.getParameterByName('pers')) ? this.set('pers', Url.getParameterByName('pers')) : this.set('pers', '8');

      // update the cookie if it exists, if it doesn't, create a new one, lasting 2 years
      this.exists('time') ? ( Helper.timeDelete(this.get('time')) ? this.clear() : null ) : this.set('time', Helper.createTime());
      this.exists('uid') ? this.set('uid', this.get('uid')) : this.set('uid', Helper.guid());

      // check a-b-e cookies
      Helper.isPresent(Url.getParameterByName('a')) ? this.set('a', Url.getParameterByName('a')) : null;
      Helper.isPresent(Url.getParameterByName('b')) ? this.set('b', Url.getParameterByName('b')) : null;
      Helper.isPresent(Url.getParameterByName('c')) ? this.set('c', Url.getParameterByName('c')) : null;
      Helper.isPresent(Url.getParameterByName('e')) ? this.set('e', Url.getParameterByName('e')) : null;

      // save any utms through as session cookies
      this.setUtms();
    }
}
  