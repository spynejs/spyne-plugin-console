import {SpyneTrait} from 'spyne';
import {pick, compose} from 'ramda';

export class ConsoleChannelPayloadsTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'cPayload$';
    super(context, traitPrefix);

  }

  static cPayload$CreatePayloadMaintainerArr(channelNamesArr) {

    const addChannelMaintainer = (obj, cName) => {
      obj[cName] = ConsoleChannelPayloadsTraits.cPayload$CreatePayloadMaintainer(
          cName);
      return obj;
    };

    const createMaintainersObj = () => {
      const _defaultState = 'all';
      let _consoleChannelState = _defaultState;
      let _consoleStateChanged = true;
      let _consoleChannelName;
      let _consoleChannelData;
      let _consoleIsFocused = false;
      let _consoleFocusedChannel = false;
      let _sendConsoleEvent;
      let _focusIsAll = _defaultState === 'all';
      let _focusChanged = false;

      const _maintaintersList = channelNamesArr.reduce(addChannelMaintainer,
          Object.create(null));

      const parsePayloadData = (data) => {
        const eventArr = [
          'animationName',
          'clientX',
          'clientY',
          'pageX',
          'pageY',
          'movementX',
          'timeStamp',
          'state',
          'movementY',
          'bubbles',
          'screenY',
          'screenX',
          'offsetX',
          'offsetY',
          'x',
          'y',
          'type'];

        if (data.event) {
          data.event = compose(pick(eventArr))(data.event);
        }

        if (data.srcElement === window) {
          data.srcElement = 'window';
        } else if (data.srcElement !== undefined) {

        }

        return data;

      };

      const updateSendConsoleEvent = (
          sendOnUpdatedBool = false, focusHasChanged = false,
          focusChangedToAll = false) => {
        _focusChanged = focusHasChanged;
        const channelNameIsFocused = _consoleChannelName ===
            _consoleFocusedChannel;
        const sendOnUpdated = sendOnUpdatedBool === true &&
            channelNameIsFocused === false && focusChangedToAll === false;
        const sendWhenSetToAllOnly = _focusIsAll === true && focusHasChanged ===
            false;
        const sendWhenPayloadIsCurrentChannel = channelNameIsFocused === true;
        const sendWhenFocusIsSetToAChannel = focusChangedToAll === false &&
            focusHasChanged === true;

        _sendConsoleEvent = sendWhenSetToAllOnly ||
            sendWhenPayloadIsCurrentChannel || sendWhenFocusIsSetToAChannel;

        //console.log("STATE VARS ",{sendWhenSetToAllOnly,sendWhenPayloadIsCurrentChannel,sendWhenFocusIsSetToAChannel,  _sendConsoleEvent,_focusChanged, _focusIsAll,channelNameIsFocused,focusChangedToAll, sendOnUpdated, _consoleIsFocused, _consoleFocusedChannel, _consoleChannelName})
      };

      const updateMaintainers = (channelName, channelData) => {
        _maintaintersList[channelName] = channelData;
        _consoleChannelName = channelName;
        _consoleChannelData = parsePayloadData(channelData);
        /**
         *
         * TODO: MAKE SURE STATE CHANGE ONLY OCCURS ON updateChannelState
         * sendConsoleEvent = _consoleChannelName === _currentState
         *
         * */

        updateSendConsoleEvent();

      };

      const getChannelDataByChannelName = (channelName) => {
        const cName = String(channelName).toUpperCase();
        return _maintaintersList[cName];
      };

      const setMaintainerState = (
          consoleIsFocused = false, consoleFocusedChannel) => {
        _consoleIsFocused = consoleIsFocused;
        _consoleFocusedChannel = String(consoleFocusedChannel).toUpperCase();
        const prevFocusIsAll = _focusIsAll;

        _focusIsAll = consoleFocusedChannel === undefined;
        const focusHasChanged = prevFocusIsAll !== _focusIsAll;
        const focusChangedToAll = _focusIsAll === true && focusHasChanged ===
            true;

        //console.log("STATE SET ",{_consoleIsFocused,_focusIsAll, focusHasChanged, focusChangedToAll})

        updateSendConsoleEvent(_consoleIsFocused, focusHasChanged,
            focusChangedToAll);

        if (_maintaintersList[_consoleFocusedChannel] !== undefined) {
          _consoleChannelName = _consoleFocusedChannel;
          _consoleChannelData = _maintaintersList[_consoleFocusedChannel];
        }

      };

      const updateChannelState = (stateStr) => {
        let stateName = String(stateStr).toLowerCase();
        _consoleStateChanged = stateName !== _consoleChannelState;
        _consoleChannelState = stateName;
        updateSendConsoleEvent();

        const consoleChannelState = _consoleChannelState;
        const consoleStateChanged = _consoleStateChanged;
        const consoleChannelName = stateName;
        const sendConsoleEvent = _sendConsoleEvent;
        const consoleChannelData = stateStr === 'all'
            ? false
            : getChannelDataByChannelName(stateStr);
        return {
          consoleChannelName,
          consoleChannelData,
          consoleStateChanged,
          sendConsoleEvent,
          consoleChannelState,
        };
      };

      const cacheChannelData = (cName, cCachedData) => {
        _maintaintersList[cName] = cCachedData;

      };

      const maintainerObj = {};

      Object.defineProperties(maintainerObj, {

        defaultState: {
          get: () => _consoleChannelState,
        },
        consoleChannelState: {
          get: () => _consoleChannelState,
          set: (v) => _consoleChannelState = v,
        },
        maintainers: {
          get: () => _maintaintersList,
        },
        consoleStateChanged: {
          get: () => _consoleStateChanged,
          set: (b) => _consoleStateChanged = b,
        },
        consoleIsFocused: {
          get: () => _consoleIsFocused,
          set: (b) => _consoleIsFocused = b,
        },
        focusChanged: {
          get: () => _focusChanged,
          set: (b) => _focusChanged = b,
        },
        focusIsAll: {
          get: () => _focusIsAll,
          set: (b) => _focusIsAll = b,
        },

        consoleFocusedChannel: {
          get: () => _consoleFocusedChannel,
          set: (b) => _consoleFocusedChannel = b,
        },
        consoleChannelName: {
          get: () => _consoleChannelName,
          set: (c) => _consoleChannelName = c,
        },
        consoleChannelData: {
          get: () => _consoleChannelData,
          set: (d) => _consoleChannelData = d,
        },
        sendConsoleEvent: {
          get: () => _sendConsoleEvent,
        },

      });

      maintainerObj['setMaintainerState'] = setMaintainerState.bind(maintainerObj);
      maintainerObj['updateChannelState'] = updateChannelState.bind(maintainerObj);
      maintainerObj['getChannelDataByChannelName'] = getChannelDataByChannelName.bind(maintainerObj);
      maintainerObj['updateMaintainers'] = updateMaintainers.bind(maintainerObj);
      maintainerObj['cacheChannelData'] = cacheChannelData.bind(maintainerObj);

      return maintainerObj;
    };

    return createMaintainersObj();

  }

  static cPayload$CreatePayloadMaintainer(channelName, initData) {

    const createPayloadMaintainer = (cName, initChannelData) => {
      const channelName = cName;
      let _channelData = initChannelData;

      const obj = {};
      Object.defineProperties(obj, {
            channelName: {
              get: () => channelName,
            },
            channelData: {
              get: () => _channelData,
              set: (d) => _channelData = d,
            },
            isEmpty: {
              get: () => _channelData === undefined,
            },
          },
      );

      return obj;

    };

    return createPayloadMaintainer(channelName, initData);

  }

}
