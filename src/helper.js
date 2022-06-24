class Helper {
  static isPresent(variable) {
    return typeof(variable) !== 'undefined' && variable !== null && variable !== '';
  }

  static now() {
    return 1 * new Date;
  }

  static guid() {
    return Config.version + '-xxxxxxxx-'.replace(/[x]/g, function(c) {
        var r = Math.random()*36|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(36);
    }) + (1 * new Date()).toString(36);
  }

  // reduces all optional data down to a string
  static optionalData(data) {
    if (Helper.isPresent(data) === false) {

      // get b value from cookies
      if (Storage.exists('b') && Storage.exists('a') && Storage.exists('e')) {
        const akw = Storage.exists('ak') ? Storage.get('ak') : '';
        const au = Storage.exists('au') ? Storage.get('au') : '';
        let sale = ''

        // buscar las keyword
        if (akw !==''){
          const rakw= JSON.parse(Helper.recoveryString(akw));
          if (typeof rakw.length === 'number' && rakw.length > 0){
            const url = window.location.href
            for (let i = 0; i < rakw.length; i++) {
              const k = rakw[i];
              const keyword = k.keyword
              if (url.includes(keyword)) {
                var id = k.id ? k.id : '';
                var klass = k["class"] ? k["class"] : '';

                sale = Helper.getSale(id, klass)
              }
            }
          }
        }

        // si no existe sale buscar por la url
        if (au !== '' && sale === '') {
          const aurl = JSON.parse(Helper.recoveryString(au));

          if (typeof aurl['url'] === 'string'){
            const ur = aurl
            const url = ur['secure'] + '://' + (ur.url[ur.url.length - 1]==='/' ? ur['url'].substring(0,ur.url.length - 2) : ur['url']);
            const durl = window.location.href;

            if (durl.includes(url)) {
              const id = ur.id ? ur.id : '';
              const klass = ur["class"] ? ur["class"] : '';

              sale = Helper.getSale(id, klass);
            }
          }
        }
        
        return Helper.optionalData({
          "a":Storage.get('a'),
          "b":Storage.get('b'),
          "c":Storage.get('c'),
          "e":Storage.get('e'),
          "cu": Storage.exists('cu') ? Storage.get('cu') : '',
          "au": au,
          "ak": akw,
          "lu": Storage.exists('lu') ? Storage.get('lu') : '',
          "lk": Storage.exists('lk') ? Storage.get('lk') : '',
          "banner": Storage.exists('banner') ? Storage.get('banner') : '',
          "session": Storage.existsS('session') ? Storage.getS('session') : '',
          "sale": sale
        });
      } else {
        return '';
      }
      
    } else if (typeof data === 'object') {
      // runs Helper.optionalData again to reduce to string in case something else was returned
      return Helper.optionalData(JSON.stringify(data));
    } else if (typeof data === 'function') {
      // runs the function and calls Helper.optionalData again to reduce further if it isn't a string
      return Helper.optionalData(data());
    } else {
      return String(data);
    }
  }

  // crear un limite de tiempo para borrar la informacion del local Storage
  static createTime(){
    const persistence = Storage.exists('pers') ? +Storage.get('pers') : 8;
    const date = new Date();
    date.setDate(date.getDate()+persistence);
    return date.toISOString();
  }

  static timeDelete(time){
    const date = new Date().getTime();
    return +time < date;
  }

  static gsuid() {
    return (1 * new Date()).toString(36);
  }

  static recoveryString = (str) => {
    return str
      .replace(/_comma_/g, ',')
      .replace(/_dash_/g, '/')
      .replace(/_point_/g, '.')
      .replace(/_colon_/g, ':')
      .replace(/_bracketo_/g, '[')
      .replace(/_bracketc_/g, ']')
      .replace(/_braceo_/g, '{')
      .replace(/_bracec_/g, '}')
      .replace(/_quote_/g, '"')
      .replace(/_bslash_/g, '\\');
  };

  static getSale(id,klass){
    const sales = [];
    if (id !== '') {
      const getId = document.getElementById(id);

      if (getId){
        const html = getId.innerHTML
          .replace(/<[^<>]*>/g,'')

        sales.push(html)
      } else {
        console.log('soy nulo')
      }
    }

    if (sales.length === 0 && klass !== '') {
      const separa = klass.split('/');
      if (separa.length === 1) { 
        const klasses = document.getElementsByClassName(klass)
        
        if (klasses.length > 0) {
          for (let j = 0; j < klasses.length; j++) {
            const c = klasses[j];
            const html = c.innerHTML
              .replace(/<[^<>]*>/g,'')
              .replace(/,/g,'.')

            sales.push(html)
          }
        }
      } else if (separa.length > 1) {
        const klasses = document.getElementsByClassName(separa[0]);
        
        if (klasses.length > 0) {
          
          if (klasses[0].children.length > 0) {
            for (let i = 0; i < klasses[0].children.length; i++) {
              const element = klasses[0].children[i];
              if (element.localName === separa[1]) {
                sales.push(element.textContent.replace(/\$/g,'').replace(/,/g,'.'));
              };
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
}
