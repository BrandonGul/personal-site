import {colors} from '../colors/colors.js';

// SOUND CLOUD SCRIPT AND TRACK LIST
//
var SC="object"==typeof SC?SC:{};SC.Widget=function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){var r,o,i,u=n(1),a=n(2),c=n(3),s=u.api,l=u.bridge,d=[],f=[],p=/^http(?:s?)/;function E(e){var t,n;for(t=0,n=f.length;t<n&&!1!==e(f[t]);t++);}function v(e){return e.contentWindow?e.contentWindow:e.contentDocument&&"parentWindow"in e.contentDocument?e.contentDocument.parentWindow:null}function _(e){var t,n=[];for(t in e)e.hasOwnProperty(t)&&n.push(e[t]);return n}function S(e,t,n){n.callbacks[e]=n.callbacks[e]||[],n.callbacks[e].push(t)}function h(e,t){var n=!0;return t.callbacks[e]=[],E((function(t){if((t.callbacks[e]||[]).length)return n=!1,!1})),n}function y(e,t,n){var r,o,i=v(n);if(!i.postMessage)return!1;r=n.getAttribute("src").split("?")[0],o=JSON.stringify({method:e,value:t}),"//"===r.substr(0,2)&&(r=window.location.protocol+r),r=r.replace(/http:\/\/(w|wt).soundcloud.com/,"https://$1.soundcloud.com"),i.postMessage(o,r)}function b(e){var t;return E((function(n){if(n.instance===e)return t=n,!1})),t}function g(e){var t;return E((function(n){if(v(n.element)===e)return t=n,!1})),t}function m(e,t){return function(n){var r,o=!!((r=n)&&r.constructor&&r.call&&r.apply),i=b(this),u=!o&&t?n:null,a=o&&!t?n:null;return a&&S(e,a,i),y(e,u,i.element),this}}function R(e,t,n){var r,o,i;for(r=0,o=t.length;r<o;r++)e[i=t[r]]=m(i,n)}function O(e,t,n){return e+"?url="+t+"&"+function(e){var t,n,r=[];for(t in e)e.hasOwnProperty(t)&&(n=e[t],r.push(t+"="+("start_track"===t?parseInt(n,10):n?"true":"false")));return r.join("&")}(n)}function w(e,t,n){var r,o,i=e.callbacks[t]||[];for(r=0,o=i.length;r<o;r++)i[r].apply(e.instance,n);(function(e){var t,n=!1;for(t in a)if(a.hasOwnProperty(t)&&a[t]===e){n=!0;break}return n}(t)||t===s.READY)&&(e.callbacks[t]=[])}function A(e){var t,n,r,o,i;try{n=JSON.parse(e.data)}catch(e){return!1}return t=g(e.source),r=n.method,o=n.value,(!t||P(e.origin)===P(t.domain))&&(t?(r===s.READY&&(t.isReady=!0,w(t,"__LATE_BINDING__"),h("__LATE_BINDING__",t)),r!==s.PLAY||t.playEventFired||(t.playEventFired=!0),r!==s.PLAY_PROGRESS||t.playEventFired||(t.playEventFired=!0,w(t,s.PLAY,[o])),i=[],void 0!==o&&i.push(o),void w(t,r,i)):(r===s.READY&&d.push(e.source),!1))}function P(e){return e.replace(p,"")}window.addEventListener?window.addEventListener("message",A,!1):window.attachEvent("onmessage",A),e.exports=i=function(e,t,n){var i;if((""===(i=e)||i&&i.charCodeAt&&i.substr)&&(e=document.getElementById(e)),!function(e){return!(!e||1!==e.nodeType||"IFRAME"!==e.nodeName.toUpperCase())}(e))throw new Error("SC.Widget function should be given either iframe element or a string specifying id attribute of iframe element.");t&&(n=n||{},e.src=O("http://wt.soundcloud.test:9200/",t,n));var u,a,c=g(v(e));return c&&c.instance?c.instance:(u=d.indexOf(v(e))>-1,a=new r(e),f.push(new o(a,e,u)),a)},i.Events=s,window.SC=window.SC||{},window.SC.Widget=i,o=function(e,t,n){this.instance=e,this.element=t,this.domain=function(e){var t,n,r,o="";"//"===e.substr(0,2)&&(e=window.location.protocol+e);for(r=e.split("/"),t=0,n=r.length;t<n&&t<3;t++)o+=r[t],t<2&&(o+="/");return o}(t.getAttribute("src")),this.isReady=!!n,this.callbacks={}},(r=function(){}).prototype={constructor:r,load:function(e,t){if(e){t=t||{};var n=this,r=b(this),o=r.element,i=o.src,u=i.substr(0,i.indexOf("?"));r.isReady=!1,r.playEventFired=!1,o.onload=function(){n.bind(s.READY,(function(){var e,n=r.callbacks;for(e in n)n.hasOwnProperty(e)&&e!==s.READY&&y(l.ADD_LISTENER,e,r.element);t.callback&&t.callback()}))},o.src=O(u,e,t)}},bind:function(e,t){var n=this,r=b(this);return r&&r.element&&(e===s.READY&&r.isReady?setTimeout(t,1):r.isReady?(S(e,t,r),y(l.ADD_LISTENER,e,r.element)):S("__LATE_BINDING__",(function(){n.bind(e,t)}),r)),this},unbind:function(e){var t,n=b(this);n&&n.element&&(t=h(e,n),e!==s.READY&&t&&y(l.REMOVE_LISTENER,e,n.element))}},R(r.prototype,_(a)),R(r.prototype,_(c),!0)},function(e,t){t.api={LOAD_PROGRESS:"loadProgress",PLAY_PROGRESS:"playProgress",PLAY:"play",PAUSE:"pause",FINISH:"finish",SEEK:"seek",READY:"ready",OPEN_SHARE_PANEL:"sharePanelOpened",CLICK_DOWNLOAD:"downloadClicked",CLICK_BUY:"buyClicked",ERROR:"error"},t.bridge={REMOVE_LISTENER:"removeEventListener",ADD_LISTENER:"addEventListener"}},function(e,t){e.exports={GET_VOLUME:"getVolume",GET_DURATION:"getDuration",GET_POSITION:"getPosition",GET_SOUNDS:"getSounds",GET_CURRENT_SOUND:"getCurrentSound",GET_CURRENT_SOUND_INDEX:"getCurrentSoundIndex",IS_PAUSED:"isPaused"}},function(e,t){e.exports={PLAY:"play",PAUSE:"pause",TOGGLE:"toggle",SEEK_TO:"seekTo",SET_VOLUME:"setVolume",NEXT:"next",PREV:"prev",SKIP:"skip"}}]);
const tracks = [
  {
    'url': 'https://soundcloud.com/user-937932513/2-am',
    'title': '2 AM - Animal Crossing GCN'
  },
  {
    'url': 'https://soundcloud.com/thisisgara/simian-segue',
    'title': 'Simian Segue - Donkey Kong Country'
  },
  {
    'url': 'https://soundcloud.com/vgmplanet/fairy-magic',
    'title': 'Fairy Magic - The Legend of Zelda: Ocarina of Time'
  },
  {
    'url': 'https://soundcloud.com/vgmplanet/gameboy-horror-theme',
    'title': 'Gameboy Horror Theme - Luigi\'s Mansion'
  }
];

// INIT 
//
export default function menuInit() {
  document.querySelectorAll('section.menu').forEach(control=> {
    setupMenu(control)
  });
}

function setupMenu(control) {
  const body       = document.body;
  const contact    = document.getElementById('contact');
  const opener     = control.querySelector('#opener');
  const colorMode  = control.querySelector('#color-mode');
  const prevTrack  = control.querySelector('#prev-track');
  const playPause  = control.querySelector('#play-pause');
  const nextTrack  = control.querySelector('#next-track');
  const titleLink  = control.querySelector('#title-link');
  const titleImage = control.querySelector('#title-image');
  const title      = control.querySelector('#title');
  var   mode       = 0;

  const widget        = SC.Widget(control.querySelector('iframe'));
  const tracksLength  = tracks.length - 1;
  var   trackIndex    = 0;

  titleLink.href  = tracks[trackIndex].url;
  title.innerHTML = tracks[trackIndex].title + ' ' + tracks[trackIndex].title;

  const storageMode = localStorage.getItem('mode');
  if(storageMode) {
    colorMode.classList.add(storageMode);
    for (let i = 0; i < colors.length; i++) {
      if(storageMode == colors[i].mode) {
        mode = i;
        break;
      }
    }
  }

  opener.addEventListener('click', function() {
    if (body.classList.contains('no-animate')) {
      body.classList.remove('no-animate');
    }

    if(control.classList.contains('active')) {
      control.classList.remove('active');
    }
    else {
      control.classList.add('active');
    }
  });

  colorMode.addEventListener('click', function() {
    if (body.classList.contains('no-animate')) {
      body.classList.remove('no-animate');
    }

    if (mode == (colors.length - 1)) {
      let removeClass = colors[mode].mode;
      body.classList.remove(removeClass);
      colorMode.classList.remove(removeClass);
      mode = 0;
      localStorage.removeItem('mode');
    }
    else {
      let removeClass = colors[mode].mode;
      body.classList.remove(removeClass);
      colorMode.classList.remove(removeClass);
      mode++;
      let addClass = colors[mode].mode;
      body.classList.add(addClass);
      colorMode.classList.add(addClass);
      localStorage.setItem('mode', addClass);
    }

    control.classList.add('animating');
    contact.classList.add('animating');
    control.addEventListener('transitionend', () => {
      control.classList.remove('animating');
      contact.classList.remove('animating');
    });
  });

  playPause.addEventListener('click', function() {
    widget.isPaused((topic) => {
      if(topic) {
        widget.play();
      }
      else {
        widget.pause();
      }
    });
  });

  nextTrack.addEventListener('click', function() {
    if (trackIndex >= tracksLength) {
      trackIndex = 0;
    }
    else {
      trackIndex++;
    }
    newTrack(trackIndex);
  });

  prevTrack.addEventListener('click', function() {
    if (trackIndex > 0) {
      trackIndex--;
    }
    else {
      trackIndex = tracksLength;
    }
    newTrack(trackIndex);
  });

  function newTrack(track) {
    title.innerHTML = tracks[track].title + ' ' + tracks[track].title;
    titleLink.href  = tracks[track].url;
    widget.load(tracks[track].url, {}); 

    widget.bind(SC.Widget.Events.READY, function() {
      artwork();
      if(playPause.classList.contains('pause')) {
        widget.play();
      }
    })
  }

  function artwork() {
    widget.getCurrentSound((obj) => {
      titleImage.src = obj.artwork_url;
    });
  }

  widget.bind(SC.Widget.Events.FINISH, function() {
    if (trackIndex >= tracksLength) {
      trackIndex = 0;
    }
    else {
      trackIndex++;
    }
    newTrack(trackIndex);
  });

  widget.bind(SC.Widget.Events.PLAY, function() {
    playPause.classList.add('pause');
  });

  widget.bind(SC.Widget.Events.PAUSE, function() {
    playPause.classList.remove('pause');
  });

  widget.bind(SC.Widget.Events.READY, function() {
    artwork();
  })
}

