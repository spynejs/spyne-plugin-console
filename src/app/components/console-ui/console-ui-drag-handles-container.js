import {ViewStream} from 'spyne';
import {ConsoleUIDragHandleView} from './console-ui-drag-hanndle-view.js';
import {range} from 'ramda';
export class ConsoleUIDragHandlesContainer extends ViewStream {

  constructor(props = {}) {
    props.id = 'console-ui-drag-handles-container';
    props.dragMode = false;
    super(props);
  }

  addActionListeners() {
    // return nexted array(s)
    return [
      ["CHANNEL_WINDOW_CLICK_EVENT",  "onDragHandleMouseUp"],
      ["CHANNEL_UI_MOUSEDOWN_EVENT",  "onDragHandleMouseDown", '.drag-handle'],
      ["CHANNEL_UI_MOUSEMOVE_EVENT",  "onDragHandleMouseOver", '.drag-handle'],
      ["CHANNEL_UI_MOUSEOVER_EVENT",  "onDragHandleMouseOver", '.drag-handle'],
      ["CHANNEL_UI_MOUSEENTER_EVENT", "onDragHandleMouseOver", '.drag-handle'],
      ["CHANNEL_UI_MOUSEUP_EVENT",    "onDragHandleMouseUp"],
      ["CHANNEL_UI_MOUSEOUT_EVENT",   "onDragHandleMouseOver", '.drag-handle'],
      ["CHANNEL_UI_MOUSELEAVE_EVENT", "onDragHandleMouseOver", '.drag-handle']
    ];
  }

  onDragHandleMouseDown(e){
    this.props.dragMode=true;
  }

  sendDragEventToConsolePluginChannel(payload){
    const action = "CHANNEL_SPYNE_CONSOLE_PLUGIN_DRAG_HANDLE_EVENT";
    const channelName = "CHANNEL_SPYNE_CONSOLE_PLUGIN"
    this.sendInfoToChannel(channelName, payload, action);
  }

  onDragHandleMouseOver(e){

    if (this.props.dragMode===true){
      const {clientX, clientY} = e.event;
      const {handleType, handleName, isConsoleItem} = e.payload;
      if (isConsoleItem==='true') {
        this.sendDragEventToConsolePluginChannel({clientX, clientY, handleName, handleType})
      }
    }
  }

  onDragHandleMouseUp(){
    this.props.dragMode = false;
  }


  broadcastEvents() {
    // return nexted array(s)
    return [
      ['.drag-handle', 'mousedown'],
      ['.drag-handle', 'mouseout'],
      ['.drag-handle', 'mouseover'],
      ['.drag-handle', 'mouseleave'],
      ['.drag-handle', 'mousemove'],
      ['.drag-handle', 'mouseenter'],
      ['.drag-handle', 'mouseup'],
    ];
  }

  getAllHandlesPropsArr(){
    const types = ['side', 'corner'];
    const rangeArr = range(0, 4);
    const reduceToProps = (acc, val) =>{
      const addTypesAndIndex = (type)=>{
        acc.push({
              handleType: type,
              handleIndex: val
            }
        )
      }
      types.forEach(addTypesAndIndex)
      return acc;
    }

    return rangeArr.reduce(reduceToProps, []);

  }

  addDragHandles(){
    const addDragHandle = (props) => {
      this.appendView(new ConsoleUIDragHandleView(props))
    }

    const propsArr = this.getAllHandlesPropsArr();
    propsArr.forEach(addDragHandle);
  }

  onRendered() {
    this.addDragHandles();
    this.addChannel("CHANNEL_UI");
    this.addChannel("CHANNEL_WINDOW");
  }

}
