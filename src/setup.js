//establecer client id
Helper.isPresent(Url.getParameterByName('uid'))
  ? Storage.exists('uid') 
    ? Storage.get('uid')[0]!=='S'
     ? Storage.delete('uid') && Storage.set('iud',Url.getParameterByName('uid')) : null
    : null
  : null;

Storage.exists('uid')
  ? Helper.isPresent(Url.getParameterByName('uid'))
    ? Storage.clear() : null
  : Helper.isPresent(Url.getParameterByName('uid'))
    ? Storage.set('uid', Url.getParameterByName('uid')) : Storage.set('uid', Helper.guid());

Helper.isPresent(Url.getParameterByName('pers'))
  ? Storage.exists('pers') ? Storage.delete('pers') && Storage.set('pers', Url.getParameterByName('pers')) : Storage.set('pers', Url.getParameterByName('pers'))
  : !Storage.exists('pers') ? Storage.set('pers', '8') : null;


// update the cookie if it exists, if it doesn't, create a new one, lasting 2 years
Storage.exists('time') ? ( Helper.timeDelete(Storage.get('time')) ? Storage.clear() : null ) : Storage.set('time', Helper.createTime());

// check a-b-e cookies
Helper.isPresent(Url.getParameterByName('a')) ? Storage.set('a', Url.getParameterByName('a')) : null;
Helper.isPresent(Url.getParameterByName('b')) ? Storage.set('b', Url.getParameterByName('b')) : null;
Helper.isPresent(Url.getParameterByName('c')) ? Storage.set('c', Url.getParameterByName('c')) : null;
Helper.isPresent(Url.getParameterByName('e')) ? Storage.set('e', Url.getParameterByName('e')) : null;
;

// save any utms through as session cookies
Storage.setUtms();

if(axios){
  axios.get(Config.iphost).then(function (response){
    Storage.exists('ip') ? Storage.delete('ip') : null;
    Storage.set('ip',`${response.data.ip}`)
  })

  if(Storage.exists('c')){
    const c = Storage.get('c');
    axios.get(Config.host+'/campaign?fuid='+c).then(function (response){
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
      } else {
        Storage.clear();
      }
    })
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
  if (!Config.pageCloseOnce) {
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
