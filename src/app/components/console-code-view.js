import {ViewStream} from 'spyne';
import {ConsoleChannelPayloadsTraits} from '../traits/console-channel-payloads-traits.js';
import {clone} from 'ramda';
import {JsonTruncator} from '../traits/json-truncator.js';
import hljs from 'highlight.js';

export class ConsoleCodeView extends ViewStream {

  constructor(props = {}) {
    props.id = 'console-code-display';
    props.traits = ConsoleChannelPayloadsTraits;
    props.template = `<pre><code class="language-json"></code></pre>`;
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
      ['CHANNEL_SPYNE_CONSOLE_CHANNEL_DATA_EVENT', 'onConsoleDataEvent'],
      ['CHANNEL_SPYNE_CONSOLE_PLUGIN_EXPAND_CACHED_DATA_EVENT', 'onConsoleDataEvent']
    ];
  }


  sendCachedData(cachedChannel, cachedEl, srcJsonPayload) {
    const isCached = true;
    const cachedData = {isCached, cachedChannel, cachedEl, srcJsonPayload};
    const payload = {cachedData, cachedChannel};
    const action = 'CHANNEL_SPYNE_CONSOLE_PLUGIN_CACHE_CHANNEL_DATA';
    this.sendInfoToChannel('CHANNEL_SPYNE_CONSOLE_PLUGIN', payload, action);
  }

  checkForTruncatorExpandButtons(cachedChannelName) {
    const truncatorBtnSel$ = this.props.el$('code span.truncator-expand');
    const addDataset = (el) => {
      el.dataset['channel'] = 'UI';
      el.dataset['cachedChannelName'] = cachedChannelName;
      el.dataset['isConsoleItem'] = 'true';
      el.dataset['pluginConsoleBtnType'] = 'expandTruncatedData';
    };

    const updateBroadcaster = () => this.viewsStreamBroadcaster.broadcast(['code span.truncator-expand', 'click']);

    if (truncatorBtnSel$.exists === true) {
      const {arr} = truncatorBtnSel$;
      arr.forEach(addDataset);
      updateBroadcaster();
    }

  }

  checkForDatasetHighlight(){
    if (this.props.el$('code').el.dataset.highlighted){
      delete this.props.el$('code').el.dataset.highlighted;
    }
  }

  onConsoleDataEvent(e) {

    this.checkForDatasetHighlight();

    const expandTruncatedCachedData = e.action === 'CHANNEL_SPYNE_CONSOLE_PLUGIN_EXPAND_CACHED_DATA_EVENT';
    const {consoleChannelName, consoleChannelData} = e.payload;
    const {cachedEl} = consoleChannelData;

    if (consoleChannelData === false) {
      return;
    }

    if (cachedEl) {
      this.props.el$('code').el.innerHTML = cachedEl;
      this.checkForTruncatorExpandButtons(consoleChannelName);
      return;
    }

    let {event, srcElement, payload, action} = consoleChannelData;

    const addJson = () => {
      const expandState = expandTruncatedCachedData ? false : 8000;


      function escape(s) {
        return s.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }

      let {decycledObj, propNum} = JsonTruncator.JsonTruncatorDeCycleEls({action, payload, event, srcElement}, expandState);
      if (expandTruncatedCachedData === false) {
        const codeStr = escape(JSON.stringify(decycledObj, null, 4));
        this.props.el$('code').el.innerHTML = codeStr;
        this.checkForDatasetHighlight();


        hljs.highlightElement(this.props.el$('code').el);
      } else {
        this.props.el$('code').el.innerHTML = JSON.stringify(decycledObj, null, 4);
        if (propNum < 3000) {hljs.highlightElement(this.props.el$('code').el);}
      }

      this.sendCachedData(consoleChannelName, clone(this.props.el$('code').el.innerHTML), {action, payload, event, srcElement});
      this.checkForTruncatorExpandButtons(consoleChannelName);

    };

    requestAnimationFrame(addJson);
  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {
    this.addChannel('CHANNEL_SPYNE_CONSOLE_PLUGIN');

  }

}
