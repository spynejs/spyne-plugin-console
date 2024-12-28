import mockData from './static/data/mock-data.json';
//const {SpyneApp, ChannelFetch} = require('spyne');
import {SpyneApp, ChannelFetch} from 'spyne';
import {SpynePluginConsole} from './app/spyne-plugin-console.js';

import * as R from 'ramda';
document.body.style.background = "#333";
window.R = R;
const config = {
  debug:true,
  channels: {
    WINDOW: {
    }
  }
}

const consolePluginConfig = {
  position: ['bottom', 'left'],
  openOnLoad: false,
  darkMode: true,
  minimize:false

}

const spyneApp = SpyneApp;
spyneApp.init(config);
spyneApp.registerChannel(new ChannelFetch("CHANNEL_FETCH_MOCK_DATA", {url:mockData}));

const spyneConsolePlugin = new SpynePluginConsole(consolePluginConfig);
spyneApp.registerPlugin(spyneConsolePlugin);

