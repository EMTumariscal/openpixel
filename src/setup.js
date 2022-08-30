
// uid y persistence remplazar si existe en parametros o crear default
Helper.isPresent(Url.getParameterByName('uid')) 
  ? Storage.set('uid', Url.getParameterByName('uid'))
  : Storage.exists('uid') ? null : Storage.existsS('uid')
    ? null : Storage.setS('uid', Helper.guid());

Helper.isPresent(Url.getParameterByName('pers')) ? Storage.set('pers', Url.getParameterByName('pers')) : Storage.exists('pers') ? null : Storage.set('pers', '1');

// check a-b-e cookies remplazar si existe en parametros
Helper.isPresent(Url.getParameterByName('a')) ? Storage.set('a', Url.getParameterByName('a')) : null;
Helper.isPresent(Url.getParameterByName('b')) ? Storage.set('b', Url.getParameterByName('b')) : null;
Helper.isPresent(Url.getParameterByName('c')) ? Storage.set('c', Url.getParameterByName('c')) : null;
Helper.isPresent(Url.getParameterByName('e')) ? Storage.set('e', Url.getParameterByName('e')) : null;

const day = new Date().getDate().toString();

Helper.isPresent(Url.getParameterByName('cu')) ? Storage.set('cu', Url.getParameterByName('cu')) : null;
Helper.isPresent(Url.getParameterByName('lu')) ? Storage.set('lu', Url.getParameterByName('lu')) : null;
Helper.isPresent(Url.getParameterByName('lk')) ? Storage.set('lk', Url.getParameterByName('lk')) : null;
Helper.isPresent(Url.getParameterByName('au')) ? Storage.set('au', Url.getParameterByName('au')) : null;
Helper.isPresent(Url.getParameterByName('ak')) ? Storage.set('ak', Url.getParameterByName('ak')) : null;
Helper.isPresent(Url.getParameterByName('banner')) ? Storage.set('banner', Url.getParameterByName('banner')) : null;
Helper.isPresent(Url.getParameterByName('c')) ? Storage.set('checkC', day) : null;

// crear tiempo de vida, en base a la persistence
Storage.exists('time') ? ( Helper.timeDelete(Storage.get('time')) ? Storage.clear() : null ) : Storage.set('time', Helper.createTime());

// crear variable de sessioin
Storage.existsS('session') ? null : Storage.setS('session', Helper.gsuid());

// save any utms through as session cookies
Storage.setUtms();

if(typeof axios!='undefined'){

  //obtener los datos de las cmapañas
  if(Storage.exists('c') && Storage.get('checkC') != day){

    const c = Storage.get('c');
    axios.get(Config.host+'/campaign/'+c).then(function (response){
      //hacer calculos para establecer nueva persistencia o eliminar data si esta ya invigente la campaña
      if(response.data.status === 'active'){
        const newPers = response.data.persistence;
        const oldPers = +Storage.get('pers');
        if(newPers != oldPers){

          const currentDate = new Date();
          const newDate = new Date(Storage.get('time'));
          newDate.setDate(newDate.getDate()-oldPers+newPers);

          if(currentDate.getTime() < newDate.getTime()){
            Storage.delete('pers');
            Storage.delete('time');
            Storage.set('pers', newPers);
            Storage.set('time', newDate.toISOString());
          } else {
            Storage.clear();
          }

        }

        Storage.set('cu',response.data.cu);
        Storage.set('au',response.data.au);
        Storage.set('lu',response.data.lu);
        Storage.set('ak',response.data.ak);
        Storage.set('lk',response.data.lk);
        Storage.set('checkC', day);
      } else {
        Storage.clear();
      }
    })
  }

  // obtener los datos para los click organicos
  if (!Storage.exists('c') && Storage.get('checkO')) {
    const site = window.location.href.split('/')[2];
    axios.get(Config.host+'/site/only/'+site).then(function (response){
      const campaigns = response.data;
      Storage.set('campaigns', JSON.stringify(campaigns));
      Storage.set('checkO', day);
    })
  }


  //obtener los datos del sitio multisitio
  if (Config.id.includes('-')) {

    //evitar que envie page close
    Config.pageCloseOnce = true;

    if (Storage.get('checkM') != day) {
      const site = window.location.href.split('/')[2];
      axios.get(Config.host+'/site/multi/'+site).then(function (response){
        const campaigns = response.data;
        Storage.set('campaigns', JSON.stringify(campaigns));
        Storage.set('checkM', day);
      })
    }

    // reviasr que tenga referrer para enviar ppimer cliik
    if (!Storage.exists('referrer') && document.referrer !== '' && !document.referrer.includes(window.location.href.split('/')[2])) {
      Storage.set('checkM', '0');
      Storage.set('referrer', document.referrer);

      new Pixel('pageload', Helper.now());

      setTimeout(function() {
        new Pixel('pageload-5s', Helper.now());
      },5000);

      //enmviar pixeltrack si cambia de url 
      var url2 = window.location.href;
      setInterval(function() {
        var nurl = window.location.href;
        if (url2!=nurl) {
          new Pixel('pageload-sp', Helper.now());
          url2 = nurl;
        }
      },1823);
    }

    //si existe variable de referrer continuar con la enviadera de informacion
    else if (Storage.exists('referrer')) {
      var url2 = window.location.href;

      new Pixel('pageload', Helper.now());

      setTimeout(function() {
        new Pixel('pageload-5s', Helper.now());
      },5000);

      //enmviar pixeltrack si cambia de url
      var url2 = window.location.href;
      setInterval(function() {
        var nurl = window.location.href;
        if (url2!=nurl) {
          new Pixel('pageload-sp', Helper.now());
          url2 = nurl;
        }
      },1823);
    }
    // enviar clicks normales al existir storaage.campaigns
    if (Storage.exists('campaigns')) {
      new Pixel('pageload', Helper.now());

      var url2 = window.location.href;
      if(typeof dl=='undefined'){
        setTimeout(function() {
          new Pixel('pageload-5s', Helper.now());
        },5000);
      }

      setInterval(function() {
        var nurl = window.location.href;
        if (url2!=nurl) {
          new Pixel('pageload-sp', Helper.now());
          url2 = nurl;
        }
      },1823);
    }
  }

  //obtener los datos de la ip y ubicacion
  if(!Storage.exists('check') || Storage.get('check') != day){
    Ip.getIp();
  }

  if(Storage.exists('ip')){
    if (Storage.exists('ipinfo') && Storage.get('ipinfo')!='ok') {
      Ip.saveIpInfo(JSON.parse(Storage.get('ipinfo')));
    } else if(!Storage.exists('ipinfo')) {
      Ip.existsIp(Storage.get('ip'));
    }
  }


}

// process the queue and future incoming commands
pixelFunc.process = function(method, value, optional) {
  if (method === 'init') {
    Config.id = value;
  } else if(method === 'param') {
    Config.params[value] = () => optional
  } else if(method === 'event') {
    if(value.includes('pageload') && !Config.pageLoadOnce) {
      // Config.pageLoadOnce = true;
      new Pixel(value, pixelFunc.t, optional);
    } else if(!value.includes('pageload') && value !== 'pageclose') {
      new Pixel(value, Helper.now(), optional);
    }
  }
}

// run the queued calls from the snippet to be processed
for (var i = 0, l = pixelFunc.queue.length; i < l; i++) {
  pixelFunc.process.apply(pixelFunc, pixelFunc.queue[i]);
}

// https://github.com/GoogleChromeLabs/page-lifecycle/blob/master/src/Lifecycle.mjs
// Safari does not reliably fire the `pagehide` or `visibilitychange`
var isSafari = typeof safari === 'object' && safari.pushNotification;
var isPageHideSupported = 'onpageshow' in self;

// IE9-10 do not support the pagehide event, so we fall back to unload
// pagehide event is more reliable but less broad than unload event for mobile and modern browsers
var pageCloseEvent = isPageHideSupported && !isSafari ? 'pagehide' : 'unload';

window.addEventListener(pageCloseEvent, function() {
  if (!Config.pageCloseOnce && !Config.id.includes('-')) {
    Config.pageCloseOnce = true;
    new Pixel('pageclose', Helper.now(), function() {
      // if a link was clicked in the last 5 seconds that goes to an external host, pass it through as event data
      if (Helper.isPresent(Config.externalHost) && (Helper.now() - Config.externalHost.time) < 5*1000) {
        return Config.externalHost.link;
      }
    });
  }
});

window.onload = function() {
  //solo aplicar cuando los sitios sean normales

  setTimeout(function() {
    if (!Config.id.includes('-')) {
      //solicitar pixel al cargar completamente la pagina
      new Pixel('pageloaded', Helper.now());
    
      // cargar cada 5 segundos al no estar dl declarada, por snipet
      var url2 = window.location.href;
      if(typeof dl=='undefined'){
        new Pixel('pageload-5s', Helper.now());
      }
    
      setInterval(function() {
        var nurl = window.location.href;
        if (url2!=nurl) {
          new Pixel('pageload-sp', Helper.now());
          url2 = nurl;
        }
      },1823);
    }
  },5000);

  var aTags = document.getElementsByTagName('a');
  for (var i = 0, l = aTags.length; i < l; i++) {
    aTags[i].addEventListener('click', function(_e) {
      if (Url.externalHost(this)) {
        Config.externalHost = { link: this.href, time: Helper.now() };
      }
    }.bind(aTags[i]));
  }

  var dataAttributes = document.querySelectorAll('[data-OPIX_FUNC-event]')
  for (var i = 0, l = dataAttributes.length; i < l; i++) {
    dataAttributes[i].addEventListener('click', function(_e) {
      var event = this.getAttribute('data-OPIX_FUNC-event');
      if (event) {
        new Pixel(event, Helper.now(), this.getAttribute('data-OPIX_FUNC-data'));
      }
    }.bind(dataAttributes[i]));
  }
}
