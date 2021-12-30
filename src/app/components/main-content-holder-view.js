import {ViewStream, DomElement} from 'spyne';
import {SpynePluginConsoleDragHandleTraits} from '../traits/spyne-plugin-console-drag-handle-traits';
import {ConsoleMenuView} from './console-menu-view';
import {ConsoleCodeView} from './console-code-view';
import {ConsoleUI} from './console-ui/console-ui';
import {ConsoleUIResizeTraits} from '../traits/console-ui-resize-traits';

export class MainContentHolderView extends ViewStream {

  constructor(props = {}) {
    props.id = 'spyne-plugin-console-content-holder';
    props.traits = [SpynePluginConsoleDragHandleTraits, ConsoleUIResizeTraits];
    super(props);
  }

  addActionListeners() {
    // return nexted array(s)
    return [
      ['CHANNEL_SPYNE_CONSOLE_PLUGIN_RESIZE_EVENT', 'onResizeEvent'],
      ['CHANNEL_SPYNE_CONSOLE_PLUGIN_MIN_MAX_CLOSE_EVENT', 'onMinMaxCloseEvent'],
      ['CHANNEL_SPYNE_CONSOLE_PLUGIN_CORNER_PIN_EVENT', 'onCornerPinEvent']
    ];
  }

  onMinMaxCloseEvent(e) {
    const {pluginConsoleWidth, pluginConsoleHeight} = e.payload;
    this.resizePanel(pluginConsoleWidth, pluginConsoleHeight);
  }

  onInitPanel() {
    const {minimize} = this.props.config;
    const selectorBtn = minimize === true ? 'close' : 'min-max';
    const closeBtn = document.querySelector(`.ui-option.${selectorBtn}.console-btn`);
    const {pluginConsoleWidth, pluginConsoleHeight} = closeBtn.dataset;
    this.resizePanel(pluginConsoleWidth, pluginConsoleHeight);
  }

  resizePanel(w, h) {
    const windowWidth = window.innerWidth - 32;
    const windowHeight = window.innerHeight - 32;


    const width = Math.min(parseInt(w), windowWidth);
    const height = Math.min(parseInt(h), windowHeight);
    //console.log('width adjust ',{w,h, windowWidth,windowHeight, width, height})

    this.props.el.style['width'] = width;
    this.props.el.style['height'] = h;
  }

  onCornerPinEvent(e) {
    const {horzPosition, vertPosition} = e.payload;
    const cornerClassesArr = [horzPosition, vertPosition];
    this.resize$AddCornerPinClasses(cornerClassesArr);
  }

  onResizeEvent(e) {
    this.dragHandle$ResizeConsole(e.payload);
  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {
    const {config, pluginName} = this.props;

    this.appendView(new ConsoleUI({config, pluginName}),
    );

    const headerEl = new DomElement({
      tagName: 'header',
      template: '<h5>CHANNELS CONSOLE</h5>'
    });

    this.props.el.appendChild(headerEl.render());
    this.appendView(new ConsoleMenuView({config}));
    this.appendView(new ConsoleCodeView());
    this.addChannel('CHANNEL_SPYNE_CONSOLE_PLUGIN');
    this.onInitPanel();
  }

}
