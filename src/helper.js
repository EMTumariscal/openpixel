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
        return Helper.optionalData({
          "a":Storage.get('a'),
          "b":Storage.get('b'),
          "c":Storage.get('c'),
          "e":Storage.get('e'),
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
    return date.getTime().toString();
  }

  static timeDelete(time){
    const date = new Date().getTime();
    return +time < date;
  }
}
