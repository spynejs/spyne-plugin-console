import '../scss/main.scss'
import {ChannelSpyneConsolePlugin} from './channels/channel-spyne-console-plugin.js';
import {SpynePluginConsoleTraits} from './traits/spyne-plugin-console-traits.js';
import {SpynePlugin, SpyneApp, SpyneAppProperties, Channel} from 'spyne';
import {reject, compose, flatten, uniq} from 'ramda';

import {MainView} from './components/main-view.js';

class SpynePluginConsole extends SpynePlugin {

  constructor(props = {}) {
    props['name'] = SpynePluginConsoleTraits.spyneConsole$GetPluginName();
    super(props);
  }

  defaultConfig() {
    return {
      position: ['top', 'left'],
      openOnLoad: true,
      darkMode: true,
      minimize: false,
      excludeChannels: [],
    };

  }

  addAllChannelsArrToConfig() {
    let {excludeChannels} = this.props.config;
    this.props.config['allChannelsArr'] = SpynePluginConsoleTraits.spyneConsole$SetAvailableChannels(
        undefined, excludeChannels);

  }

  updateExcludedChannels() {
    let {excludeChannels} = this.props.config;
    excludeChannels.push(
        SpynePluginConsoleTraits.spyneConsole$GetMainChannelName());
    excludeChannels.push('DISPATCHER');

    const concatArrsFn = compose(uniq, flatten);
    excludeChannels = concatArrsFn([excludeChannels, SpyneAppProperties.excludeChannelsFromConsole]);

    const omittedChannels = [
      'CHANNEL_UI',
      'CHANNEL_WINDOW',
      'CHANNEL_LIFECYCLE',
      'CHANNEL_ROUTE'];
    const rejectPred = s => omittedChannels.indexOf(s) >= 0;
    this.props.config.excludeChannels = reject(rejectPred, excludeChannels);
    //console.log("EXCLUDE CHANNELS ARE ",this.props.config.excludeChannels);
  }

  updateConfig() {
    this.updateExcludedChannels();
    this.addAllChannelsArrToConfig();

  }

  onRegistered() {
    const {pluginName} = this.props;
    this.updateConfig();
    SpyneApp.registerChannel(new Channel('CHANNEL_PLUGIN_CONSOLE_CONFIG', {data: this.props.config, sendCachedPayload: true}));
    SpyneApp.registerChannel(new ChannelSpyneConsolePlugin(undefined, {pluginName}));
  }

  onRender() {
    const {config} = this.props;
    const {pluginName} = this;
    this.props.mainEl = new MainView({config, pluginName}).appendToDom(this.props.parentEl);
  }

}

export {SpynePluginConsole};
