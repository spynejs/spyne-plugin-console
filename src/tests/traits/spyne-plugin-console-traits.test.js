const R = require('ramda');
const {SpyneApp} = require('spyne');
const {SpynePluginConsoleTraits} = require('../../app/traits/spyne-plugin-console-traits');
const {expect, assert} = require('chai');

describe('should test spyne plugin console traits methods', () => {
  const props = {};
  let spyneApp;
  //spyneApp =  SpyneApp.init({debug:true})

  beforeEach(()=>{
    props.el$={};
    props.el$.addClass = (c) =>  c;

  })

  it('spyne plugin console traits should exist', () => {
    expect(SpynePluginConsoleTraits).to.exist;
  });

  it('should add the class names from the config arr to main view', ()=>{

      const pluginArr = ['bottom', 'right', 'top', 'left8'];

      const addClassesArr = SpynePluginConsoleTraits.spyneConsole$UpdatePosition(pluginArr, props.el$);
     expect(addClassesArr).to.deep.equal(['bottom', 'right']);
  });

  it('should pull all of the available channels to listen to', ()=>{
    const arr = SpynePluginConsoleTraits.spyneConsole$SetAvailableChannels(spyneApp);
    expect(arr).to.deep.equal(['CHANNEL_UI', 'CHANNEL_WINDOW', 'CHANNEL_ROUTE', 'CHANNEL_LIFECYCLE']);
  })

  

});
