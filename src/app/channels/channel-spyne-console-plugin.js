import {Channel, ChannelPayloadFilter} from 'spyne';
import {SpynePluginConsoleTraits} from '../traits/spyne-plugin-console-traits';
import {ConsoleChannelPayloadsTraits} from '../traits/console-channel-payloads-traits';
import {propEq} from 'ramda';

export class ChannelSpyneConsolePlugin extends Channel {

  constructor(name, props = {}) {
    name = SpynePluginConsoleTraits.spyneConsole$GetMainChannelName();
    props.traits = [SpynePluginConsoleTraits, ConsoleChannelPayloadsTraits];
    props.sendCachedPayload = true;
    super(name, props);
  }

  onRegistered() {

    console.log("SPYNE CONSOLE PLUGIN ")

    const onConfigReturned = (e) => {
      this.props.config = e.payload;
      this.initializeAllChannelListeners();
      this.addConsoleBtnsListener();
      this.sendInitAction();
    };

    const config$ = this.getChannel('CHANNEL_PLUGIN_CONSOLE_CONFIG');
    config$.subscribe(onConfigReturned);
  }

  addConsoleBtnsListener() {
    const grabberFilter = new ChannelPayloadFilter('.console-btn');
    this.getChannel('CHANNEL_UI', grabberFilter).
        subscribe(this.onConsoleBtnEvent.bind(this));

  }

  onConsoleBtnEvent(e) {
    const {pluginConsoleBtnType} = e.payload;
    const methodHash = {
      grabber: this.onWindowShadeEvent.bind(this),
      consoleMenu: this.onConsoleMenuBtnEvent.bind(this),
      expandTruncatedData: this.onExpandTruncatedData.bind(this),
      minMaxClose: this.onMinMaxBtnEvent.bind(this),
      cornerPin: this.onCornerPinEvent.bind(this),
    };

    const fn = methodHash[pluginConsoleBtnType];
    return fn(e);
  }

  onCornerPinEvent(e) {
    const {horzPosition, vertPosition} = e.payload;
    const action = 'CHANNEL_SPYNE_CONSOLE_PLUGIN_CORNER_PIN_EVENT';

    this.sendChannelPayload(action, {horzPosition, vertPosition});
  }

  onExpandTruncatedData(e) {

    const {cachedChannelName} = e.payload;
    const {consoleChannelName} = this.props.channelsMaintainer;

    const payload = this.props.channelsMaintainer.getChannelDataByChannelName(
        cachedChannelName);
    const {srcJsonPayload, cachedChannel} = payload;
    const action = 'CHANNEL_SPYNE_CONSOLE_PLUGIN_EXPAND_CACHED_DATA_EVENT';
    const consoleChannelData = srcJsonPayload;
    if (srcJsonPayload !== undefined) {
      this.sendChannelPayload(action, {
        consoleChannelData,
        cachedChannel,
        consoleChannelName,
        cachedChannelName,
      });
    }

  }

  onConsoleMenuBtnEvent(e) {
    const {consoleIsFocused, channelName} = e.payload;
    const b = {
      'true': true,
      'false': false,
    };

    const consoleIsFocusedBool = b[consoleIsFocused];
    this.props.channelsMaintainer.setMaintainerState(consoleIsFocusedBool,
        channelName);
    const {focusIsAll} = this.props.channelsMaintainer;
    const action = focusIsAll
        ? 'CHANNEL_SPYNE_CONSOLE_CHANNEL_STATE_CHANGE_EVENT'
        : 'CHANNEL_SPYNE_CONSOLE_CHANNEL_DATA_EVENT';
    this.sendConsoleEvent(action);

  }

  sendConsoleEvent(action = 'CHANNEL_SPYNE_CONSOLE_CHANNEL_DATA_EVENT') {
    const {
      consoleChannelName,
      sendConsoleEvent,
      consoleIsFocused,
      consoleChannelData,
      consoleStateChanged,
      focusIsAll,
      focusChanged,
      consoleChannelState,
    } = this.props.channelsMaintainer;

    this.sendChannelPayload(action, {
      consoleChannelName,
      focusIsAll,
      focusChanged,
      sendConsoleEvent,
      consoleIsFocused,
      consoleChannelData,
      consoleStateChanged,
      consoleChannelState,
    });

  }

  onWindowShadeEvent(e) {
    const toggleConsoleOpen = !this.props.toggleConsoleOpen;
    this.props.toggleConsoleOpen = toggleConsoleOpen;
    const action = 'CHANNEL_SPYNE_CONSOLE_PLUGIN_WINDOWSHADE_EVENT';
    this.sendChannelPayload(action, {toggleConsoleOpen});

  }

  onChannelEvent(e) {
    const {action, payload, channelName, srcElement, event} = e;
    const isConsoleItem = channelName === 'CHANNEL_UI' &&
        propEq('isConsoleItem', 'true')(payload);
    if (isConsoleItem) {
      return;
    }

    this.props.channelsMaintainer.updateMaintainers(channelName,
        {action, payload, srcElement, event});
    const {sendConsoleEvent} = this.props.channelsMaintainer;
    if (sendConsoleEvent === true) {
      this.sendConsoleEvent();
    }
  }

  initializeAllChannelListeners() {
    const addToAllListener = (channelName) => {
      console.log("ADD CHANNELS ",channelName);
      this.getChannel(channelName).subscribe(this.onChannelEvent.bind(this));
    };

    this.props.allChannelsArr = this.props.config.allChannelsArr;
    this.props.channelsMaintainer = ConsoleChannelPayloadsTraits.cPayload$CreatePayloadMaintainerArr(
        this.props.allChannelsArr);
    this.props.allChannelsArr.forEach(addToAllListener);

  }

  sendInitAction() {
    const {openOnLoad} = this.props.config;
    const toggleConsoleOpen = openOnLoad;
    this.props.toggleConsoleOpen = toggleConsoleOpen;
  }

  onCacheChannelData(e) {
    const {cachedChannel, cachedData} = e.payload;
    this.props.channelsMaintainer.cacheChannelData(cachedChannel, cachedData);
  }

  onMinMaxBtnEvent(e) {
    const action = 'CHANNEL_SPYNE_CONSOLE_PLUGIN_MIN_MAX_CLOSE_EVENT';
    const {
      pluginConsoleResizeType,
      pluginConsoleWidth,
      pluginConsoleHeight,
    } = e.payload;
    this.sendChannelPayload(action,
        {pluginConsoleResizeType, pluginConsoleWidth, pluginConsoleHeight});
  }

  onDragHandleEvent(e) {
    const {payload} = e;
    const action = 'CHANNEL_SPYNE_CONSOLE_PLUGIN_RESIZE_EVENT';
    this.sendChannelPayload(action, payload);
  }

  addRegisteredActions() {
    return [
      'CHANNEL_SPYNE_CONSOLE_PLUGIN_INIT',
      'CHANNEL_SPYNE_CONSOLE_PLUGIN_EXPAND_CACHED_DATA_EVENT',
      'CHANNEL_SPYNE_CONSOLE_PLUGIN_CHANGE_COLOR',
      ['CHANNEL_SPYNE_CONSOLE_PLUGIN_DRAG_HANDLE_EVENT', 'onDragHandleEvent'],
      'CHANNEL_SPYNE_CONSOLE_PLUGIN_RESIZE_EVENT',
      'CHANNEL_SPYNE_CONSOLE_PLUGIN_MIN_MAX_CLOSE_EVENT',
      'CHANNEL_SPYNE_CONSOLE_CHANNEL_DATA_EVENT',
      'CHANNEL_SPYNE_CONSOLE_CHANNEL_STATE_CHANGE_EVENT',
      'CHANNEL_SPYNE_CONSOLE_PLUGIN_WINDOWSHADE_EVENT',
      'CHANNEL_SPYNE_CONSOLE_PLUGIN_CORNER_PIN_EVENT',
      ['CHANNEL_SPYNE_CONSOLE_PLUGIN_CACHE_CHANNEL_DATA', 'onCacheChannelData'],
    ];
  }

  onViewStreamInfo(obj) {
    let data = obj.props();
    const action = 'CHANNEL_SPYNE_CONSOLE_PLUGIN_CHANGE_COLOR';
  }

  onSendPayload(actionStr, payload = {}) {
    const action = this.channelActions[actionStr];
    const srcElement = {};
    const event = undefined;
    this.sendChannelPayload(action, payload, srcElement, event);
  }

}
