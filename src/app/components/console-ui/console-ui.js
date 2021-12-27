import {ViewStream} from 'spyne';
import {ConsoleUIMaxMinClose} from './console-ui-max-min-close';
import {ConsoleUIDragHandlesContainer} from './console-ui-drag-handles-container';
import {ConsoleUICornersContainer} from './console-ui-corners-container';

export class ConsoleUI extends ViewStream {

  constructor(props = {}) {
    props.id = 'console-ui';
    super(props);
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
    this.appendView(new ConsoleUIMaxMinClose());
    this.appendView(new ConsoleUIDragHandlesContainer());
    this.appendView(new ConsoleUICornersContainer());
  }

}
