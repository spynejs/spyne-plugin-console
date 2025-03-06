import {SpyneTrait, SpyneAppProperties} from 'spyne';
import {move,prop} from 'ramda';

export class SpynePluginConsoleTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'spyneConsole$';
    super(context, traitPrefix);
  }

  static spyneConsole$GetPluginName(){
    return 'spyneConsole';
  }

  static spyneConsole$GetMainChannelName(){
    return "CHANNEL_SPYNE_CONSOLE_PLUGIN"
  }
  static spyneConsole$UpdatePosition(arr=this.props.config.position, el$=this.props.el$){
    const posArr = arr.slice(0, 2);
    posArr.forEach(c => el$.addClass(c))
    return posArr;
  }

  static spyneConsole$GetMenuData(allChannelsArr){
    const mapMenuData = (str)=> {
      const channelLower = String(str).toLowerCase();
      const channelName = channelLower.replace(/^(channel_)(.*)$/, '$2');
      const channelTitle = channelName.toUpperCase();
      return {channelLower, channelName, channelTitle}

    }

    const menuChannelData = allChannelsArr.map(mapMenuData);
    return menuChannelData;

  }


  static spyneConsole$SetAvailableChannels(spyneApp, excludeChannelsArr=['CHANNEL_SPYNE_CONSOLE_PLUGIN', "DISPATCHER"]){
   // const app = spyneApp || prop('Spyne', window);
    //console.log("APP IS ",SpyneAppProperties);

    const allChannelsArr = SpyneAppProperties.listRegisteredChannels();
    const channelsReducer = (acc, val) =>{
      if (excludeChannelsArr.indexOf(val)<0){
        acc.push(val);
      }
      return acc;
    }
    let interimAllChannelsArr = allChannelsArr.reduce(channelsReducer, []);
    return move(0, 2, interimAllChannelsArr);
  }

}
