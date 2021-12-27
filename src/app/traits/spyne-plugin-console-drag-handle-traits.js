import {SpyneTrait} from 'spyne';

export class SpynePluginConsoleDragHandleTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'dragHandle$';
    super(context, traitPrefix);
  }

  static dragHandle$GetResizeMethods(handleName){
    const widthFn =     (p)=>['width', `${p.clientX+p.x}px`];
    const leftWidthFn = (p)=>['width', `${p.width-(p.clientX-p.x)}px`];
    const leftFn =      (p)=>['left', `${p.clientX}`];

    const heightFn =    (p)=>['height', `${p.clientY+p.y}px`];
    const topHeightFn = (p)=>['height', `${p.height-(p.clientY-p.y)}px`];
    const topFn =       (p)=>['top',`${p.clientY}`];

    const heightDefaultFn = (p)=> ['height', `${p.height}px`];
    const widthDefaultFn =  (p)=> ['width',  `${p.width}px`];

    let defaultFn = (val) => console.log('default fn with val ',val);

    const resizeHandleNameHash = {
      right: [widthFn],
      bottomRight: [heightFn, widthFn],
      bottom: [heightFn],
      bottomLeft: [leftFn, leftWidthFn, heightFn],
      left: [leftWidthFn,heightDefaultFn],
      top: [topHeightFn],
      topRight: [topFn, topHeightFn, widthFn],
      topLeft:  [topHeightFn, leftWidthFn]

    }

    return resizeHandleNameHash[handleName] || [defaultFn]

  }

  dragHandle$MapStyleMethodsArr(allProps, methodsArr) {
    const mapMethods = (fn) => fn(allProps);
    return methodsArr.map(mapMethods);

  }

  static dragHandle$ResizeRunStyleProps(stylePropsArr, el = this.props.el) {
    const addStyleProp = (arr) => {
      const [prop, cssVal] = arr;
      el.style[prop] = cssVal;
    };
    stylePropsArr.forEach(addStyleProp);

  }

  static dragHandle$ResizeConsole(resizeProps, props = this.props) {
    const {el} = this.props;
    const {handleName, clientX, clientY} = resizeProps;
    const getAllProps = () => {
      const boundingBox = el.getBoundingClientRect();
      const {x, y, width, height} = boundingBox;
      return {x, y, clientX, clientY, width, height};
    };

    const allProps = getAllProps();
    const propMethodsArr = this.dragHandle$GetResizeMethods(handleName);

    const resizeStylesArr = this.dragHandle$MapStyleMethodsArr(allProps,
        propMethodsArr);

    this.dragHandle$ResizeRunStyleProps(resizeStylesArr);

  }



}
