const {expect, assert} = require('chai');
const {SpyneApp} = require('spyne');
const {ConsoleChannelPayloadsTraits} = require(
    '../../app/traits/console-channel-payloads-traits');
const {SpynePluginConsoleTraits} = require(
    '../../app/traits/spyne-plugin-console-traits');
const {
  ChannelPayloadUIData,
  ChannelPayloadToTestFilters,
  ChannelPayloadRouteData,
  DeepLinkData,
  ChannelPayloadRouteDataRegexOverride,
} = require('../mocks/channel-payload-data');

describe('should return correct values from console payloads maintainer',
    () => {

      const props = {};
      let spyneApp;
      //spyneApp = SpyneApp.init({debug: true});

      beforeEach(() => {
        props.el$ = {};
        props.el$.addClass = (c) => c;

      });

      it('should create a correctled formatted channels maintainer', () => {
        const allChannelsArr = SpynePluginConsoleTraits.spyneConsole$SetAvailableChannels(
            spyneApp);

        const channelsMaintainer = ConsoleChannelPayloadsTraits.cPayload$CreatePayloadMaintainerArr(
            allChannelsArr);

        const channelName = 'CHANNEL_UI';
        channelsMaintainer.updateMaintainers(channelName, {myData: 'ubu'});
        const {
          consoleChannelName,
          sendConsoleEvent,
          consoleChannelData,
          consoleStateChanged,
          consoleChannelState,
        } = channelsMaintainer;

        return true;

      });

      describe('should return correct state from maintainer ', () => {

        let allChannelsArr;
        let channelsMaintainer;

        beforeEach(() => {

          allChannelsArr = SpynePluginConsoleTraits.spyneConsole$SetAvailableChannels(
              spyneApp);
          channelsMaintainer = ConsoleChannelPayloadsTraits.cPayload$CreatePayloadMaintainerArr(
              allChannelsArr);

        });

        it('should get default maintainer state', () => {
          const channelName = 'CHANNEL_UI';
          channelsMaintainer.updateMaintainers(channelName, {myData: 'ubu'});
          const {
            consoleIsFocused,
            consoleChannelName,
            consoleChannelData,
            sendConsoleEvent,
          } = channelsMaintainer;
          return true;

        });

        it('should set maintainer focus to true', () => {
          const channelName = 'CHANNEL_ROUTE';
          channelsMaintainer.setMaintainerState(true, channelName);
          const {consoleIsFocused} = channelsMaintainer;
          expect(consoleIsFocused).to.be.true;
        });

        it('should set maintainer focus to true by channelName', () => {
          const channelName = 'CHANNEL_ROUTE';
          channelsMaintainer.setMaintainerState(false, channelName);
          const {consoleIsFocused} = channelsMaintainer;
          expect(consoleIsFocused).to.be.false;
        });

        it('should set maintainer sendConsoleEvent to true by all', () => {
          const channelName = 'CHANNEL_ROUTE';
          channelsMaintainer.updateMaintainers(channelName, {myData: 'ubu'});
          channelsMaintainer.setMaintainerState(false, 'CHANNEL_UI');
          const {
            consoleIsFocused,
            consoleChannelName,
            consoleFocusedChannel,
            consoleChannelData,
            sendConsoleEvent,
          } = channelsMaintainer;
          expect(sendConsoleEvent).to.be.true;

        });

        it('should set maintainer sendConsoleEvent to true by channelName',
            () => {
              const channelName = 'CHANNEL_ROUTE';
              channelsMaintainer.updateMaintainers(channelName,
                  {myData: 'ubu'});

              channelsMaintainer.setMaintainerState(true, 'CHANNEL_ROUTE');
              const {
                consoleIsFocused,
                consoleChannelName,
                consoleFocusedChannel,
                consoleChannelData,
                sendConsoleEvent,
              } = channelsMaintainer;

              expect(sendConsoleEvent).to.be.true;

            });

        it('should set maintainer sendConsoleEvent to true by updateMaintainer',
            () => {
              const channelName = 'CHANNEL_ROUTE';
              const newChannelName = 'CHANNEL_UI';
              channelsMaintainer.updateMaintainers(channelName,
                  {myData: 'ubu'});

              channelsMaintainer.setMaintainerState(true, newChannelName);
              channelsMaintainer.updateMaintainers(newChannelName,
                  {myNewData: 'ya'});

              const {
                consoleIsFocused,
                consoleChannelName,
                consoleFocusedChannel,
                consoleChannelData,
                sendConsoleEvent,
              } = channelsMaintainer;

              expect(sendConsoleEvent).to.be.true;

            });

        it('should set maintainer sendConsoleEvent to false by updateMaintainer',
            () => {
              const channelName = 'CHANNEL_ROUTE';
              const newChannelName = 'CHANNEL_UI';
              channelsMaintainer.updateMaintainers(channelName,
                  {myData: 'ubu'});

              channelsMaintainer.setMaintainerState(true, newChannelName);
              channelsMaintainer.updateMaintainers(channelName,
                  {myNewData: 'ya'});

              const {
                consoleIsFocused,
                consoleChannelName,
                consoleFocusedChannel,
                consoleChannelData,
                sendConsoleEvent,
              } = channelsMaintainer;
              expect(sendConsoleEvent).to.be.false;

            });

        it('should set maintainer sendConsoleEvent to true by changed focusedChannel',
            () => {
              const channelName = 'CHANNEL_ROUTE';
              const newChannelName = 'CHANNEL_UI';
              channelsMaintainer.updateMaintainers(newChannelName,
                  {myData: 'firstEvent'});
              channelsMaintainer.updateMaintainers(channelName,
                  {myData: 'secondEvent'});

              channelsMaintainer.setMaintainerState(true, newChannelName);

              const {
                consoleIsFocused,
                consoleChannelName,
                consoleFocusedChannel,
                consoleChannelData,
                sendConsoleEvent,
              } = channelsMaintainer;

              const {myData} = consoleChannelData;
              expect(myData).to.be.equal('firstEvent');

            });

        it('should set maintainer sendConsoleEvent to false by changed focusedChannel',
            () => {
              const channelName = 'CHANNEL_ROUTE';
              const newChannelName = 'CHANNEL_UI';
              channelsMaintainer.updateMaintainers(newChannelName,
                  {myData: 'firstEvent'});
              channelsMaintainer.updateMaintainers(channelName,
                  {myData: 'secondEvent'});

              channelsMaintainer.setMaintainerState(true, newChannelName);
              channelsMaintainer.updateMaintainers(channelName,
                  {myData: 'thirdEvent'});

              const {
                consoleIsFocused,
                consoleChannelName,
                consoleFocusedChannel,
                consoleChannelData,
                sendConsoleEvent,
              } = channelsMaintainer;
              const {myData} = consoleChannelData;
              expect(sendConsoleEvent).to.be.false;
            });

      });

    });
