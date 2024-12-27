import {ViewStream} from 'spyne';
import ConsoleMaxMinCloseTmpl from './templates/console-max-min-close.tmpl.html';

export class ConsoleUIMaxMinClose extends ViewStream {

  constructor(props = {}) {
    props.id='console-max-min-close';
    props.template = ConsoleMaxMinCloseTmpl;
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [];
  }


  broadcastEvents() {
    // return nexted array(s)
    return [
        ['.console-btn', 'click']
    ];
  }

  onRendered() {
      this.addChannel("CHANNEL_SPYNE_CONSOLE_PLUGIN");
  }

}
