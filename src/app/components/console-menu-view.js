import {ViewStream} from 'spyne';
import {SpynePluginConsoleTraits} from '../traits/spyne-plugin-console-traits';

export class ConsoleMenuView extends ViewStream {

  constructor(props = {}) {
    props.id = 'console-menu';
    props.class = 'panel-menu';
    props.data = SpynePluginConsoleTraits.spyneConsole$GetMenuData(props.config.allChannelsArr);
    props.template = require('./templates/spyne-plugin-console-menu.tmpl.html');
    props.currentChannel = undefined;
    super(props);
  }

  addActionListeners() {
    // return nexted array(s)
    return [

      ['CHANNEL_SPYNE_CONSOLE_CHANNEL_DATA_EVENT', 'onConsoleDataEvent'],
      ['CHANNEL_SPYNE_CONSOLE_CHANNEL_STATE_CHANGE_EVENT', 'onConsoleDataEvent'],
    ];
  }

  onConsoleDataEvent(e) {
    const {focusIsAll, focusChanged, consoleChannelName} = e.payload;
    this.updateMenuSelectors({focusIsAll, focusChanged, consoleChannelName});
  }

  updateMenuSelectors({focusIsAll, focusChanged, consoleChannelName}) {
    const selectorStr = `li.${String(consoleChannelName).toLowerCase()}`;

    if (focusIsAll === true) {
      if (focusChanged === true) {
        this.props.menuLi$.setActiveItem('selected', 'li.channel_all');
        this.props.menuLi$.setActiveItem('activated',
            this.props.currentChannel);
      } else {
        this.props.menuLi$.setActiveItem('activated', selectorStr);
      }
    } else if (this.props.currentChannel !== selectorStr) {
      this.props.menuLi$.setActiveItem('selected', selectorStr);
      this.props.menuLi$.removeClass('activated');
    } else if (focusChanged === true && focusIsAll === false) {
      this.props.menuLi$.setActiveItem('selected', selectorStr);
      this.props.menuLi$.removeClass('activated');
    }
    this.props.currentChannel = selectorStr;
  }

  broadcastEvents() {
    // return nexted array(s)
    return [
      ['li', 'click'],
    ];
  }

  onRendered() {
    this.props.menuLi$ = this.props.el$('#console-panel-menu ul li');
    this.addChannel('CHANNEL_SPYNE_CONSOLE_PLUGIN');
  }

}
