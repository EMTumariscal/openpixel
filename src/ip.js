class Ip {
  static getIp() {
    axios.get(Config.iphost).then(function (response) {
      const ip = response.data.ip;

      if(!Storage.exists('ip') || Storage.get('ip') != ip) {
        Ip.existsIp(ip);
      } else {
        const day = new Date().getDate();
        Storage.set('check',day);
      }

      Storage.set('ip', response.data.ip);
    });
  }

  static existsIp(ip){
    axios.get(Config.host+'/ip/'+ip).then(function (response) {
      const info = response.data;
      if (info != '') {

        const city = info.city;
        const region = info.region;
        const country = info.country;

        Storage.set('location',city+', '+region+', '+country);
        Storage.set('ipinfo','ok');
        const day = new Date().getDate();
        Storage.set('check',day);
      } else {
        Ip.getIpInfo();
      }
    })
  }

  static getIpInfo(){
    axios.get(Config.ipinfo).then(function (response) {
      const info = response.data

      const city = info.city;
      const region = info.region;
      const country = info.country;

      Storage.set('ipinfo',JSON.stringify(info));
      Storage.set('location',city+', '+region+', '+country);

      Ip.saveIpInfo(info)
    });
  }

  static saveIpInfo(info){
    axios.post(Config.host+'/ip',info).then(function (response) {

        const city = info.city;
        const region = info.region;
        const country = info.country;

        Storage.set('location',city+', '+region+', '+country);
        Storage.set('ipinfo','ok');
        const day = new Date().getDate();
        Storage.set('check',day);
    })
  }
}