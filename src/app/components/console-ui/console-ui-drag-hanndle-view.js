import {ViewStream} from 'spyne';
import {SpynePluginConsoleDragHandleTraits} from '../../traits/spyne-plugin-console-drag-handle-traits';
import {UtilTraits} from '../../traits/util-traits';

export class ConsoleUIDragHandleView extends ViewStream {

  constructor(props = {}) {
    props.traits = SpynePluginConsoleDragHandleTraits;
    props.handleName = ConsoleUIDragHandleView.getHandlePositionName(props.handleType, props.handleIndex);
    props.class = `drag-handle ${props.handleType} ${UtilTraits.util$CamelToSnakeCase(props.handleName)} handle-index-${props.handleIndex}`
    const {handleName, handleType} = props;
    const isConsoleItem = "true";
    props.dataset = {handleName, isConsoleItem, handleType};
    super(props);

  }

  static getHandlePositionName(handleType='side', handleIndex=0){
    const handlesSideArr = ['top', 'right', 'bottom', 'left'];
    const handlesCornerArr = ['topLeft', 'topRight', 'bottomRight', 'bottomLeft']
    const arr = handleType === 'corner' ? handlesCornerArr : handlesSideArr;
    return arr[handleIndex];
  }


  addActionListeners() {
    // return nexted array(s)
    return [];
  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {

  }

}
