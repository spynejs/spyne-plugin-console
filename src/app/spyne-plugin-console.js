const css = require('../scss/main.scss');
import {ChannelSpyneConsolePlugin} from './channels/channel-spyne-console-plugin';
import {SpynePluginConsoleTraits} from './traits/spyne-plugin-console-traits';
import {SpynePlugin, SpyneApp, Channel} from 'spyne';
import {reject} from 'ramda';

import {MainView} from './components/main-view';

class SpynePluginConsole extends SpynePlugin {

  constructor(props = {}) {
    props['name'] = SpynePluginConsoleTraits.spyneConsole$GetPluginName();
    super(props);
    SpyneApp.registerChannel(new Channel('CHANNEL_PLUGIN_CONSOLE_CONFIG', {data: this.props.config, sendCachedPayload: true}));
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
    const omittedChannels = [
      'CHANNEL_UI',
      'CHANNEL_WINDOW',
      'CHANNEL_LIFECYCLE',
      'CHANNEL_ROUTE'];
    const rejectPred = s => omittedChannels.indexOf(s) >= 0;
    this.props.config.excludeChannels = reject(rejectPred, excludeChannels);
  }

  updateConfig() {
    this.updateExcludedChannels();
    this.addAllChannelsArrToConfig();

  }

  onRegistered() {
    const {pluginName} = this.props;
    this.updateConfig();
    SpyneApp.registerChannel(new ChannelSpyneConsolePlugin(undefined, {pluginName}));
  }

  onRender() {
    const {config} = this.props;
    const {pluginName} = this;
    this.props.mainEl = new MainView({config, pluginName}).appendToDom(this.props.parentEl);
  }

}

export {SpynePluginConsole};
