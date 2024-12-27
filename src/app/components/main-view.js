import {ViewStream} from 'spyne';
import {MainContentHolderView} from './main-content-holder-view.js';
import {SpynePluginConsoleTraits} from '../traits/spyne-plugin-console-traits.js';

export class MainView extends ViewStream {

  constructor(props = {}) {
    props.id = 'spyne-plugin-console';
    props.traits = SpynePluginConsoleTraits;
    props.dataset = {isConsoleItem: 'true'};
    super(props);
  }

  addActionListeners() {
    // return nexted array(s)
    return [
      ['CHANNEL_SPYNE_CONSOLE_PLUGIN_INIT', 'onInitState']
    ];
  }

  onInitState() {
    this.props.mainContentHolderEl$.addClass('active');
  }

  broadcastEvents() {
    // return nexted array(s)
    return [
      ['#spyne-plugin-console', 'mouseup'],
    ];
  }

  onRendered() {
    const {config, pluginName} = this.props;
    this.appendView(new MainContentHolderView({config, pluginName}));
    this.props.mainContentHolderEl$ = this.props.el$('#spyne-plugin-console-content-holder');
    this.addChannel('CHANNEL_SPYNE_CONSOLE_PLUGIN');
    this.spyneConsole$UpdatePosition(this.props.config.position, this.props.mainContentHolderEl$);
    const {darkMode} = config;
    this.props.mainContentHolderEl$.addClass('active');
    const modeClass = darkMode ? 'dark' : 'light';
    this.props.el$.addClass(modeClass);
  }

}
