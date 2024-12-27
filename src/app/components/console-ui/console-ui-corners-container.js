import {ViewStream} from 'spyne';
import UICornersTmpl from './templates/console-ui-corners.tmpl.html';

export class ConsoleUICornersContainer extends ViewStream {

  constructor(props = {}) {
    props.id='console-ui-corners-container';
    props.data = ConsoleUICornersContainer.getCornersData();
    props.template = UICornersTmpl;
    super(props);
  }


  static getSVGCornerIcon(){
    return `
        <svg id="corner-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 38">
          <rect width="8" height="38"/>
          <rect id="rect-left" x="8" y="30" width="30" height="8"/>
          <circle id="selected" cx="22" cy="16" r="7"/>
        </svg>
    `
  }
  static getCornersData(){
    const horzArr = ['top', 'bottom'];
    const vertArr = ['left', 'right']
    const svgIcon = ConsoleUICornersContainer.getSVGCornerIcon();

    const reduceToArr = (acc, val) =>{
      const horz = val;
      const forEachVertPos = (vert)=>{
        acc.push({
          horz, vert, svgIcon
        })
      }
      vertArr.forEach(forEachVertPos)
      return acc;
    }
    return horzArr.reduce(reduceToArr, []);
  }

  addActionListeners() {
    // return nexted array(s)
    return [];
  }

  broadcastEvents() {
    // return nexted array(s)
    return [
        ['.corner-pin', 'click']
    ];
  }

  onRendered() {

  }

}
