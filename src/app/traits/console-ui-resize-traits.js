import {SpyneTrait} from 'spyne';

export class ConsoleUIResizeTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'resize$';
    super(context, traitPrefix);
  }

  static resize$AddCornerPinClasses(cornerPinClassesArr, allClassesArr=['top', 'right', 'bottom', 'left'], props=this.props){
    const updatedCornerClasses = (c)=>{
      const isSelected = cornerPinClassesArr.indexOf(c)>=0;
      isSelected ? this.props.el$.addClass(c) : this.props.el$.removeClass(c);
    }
    allClassesArr.forEach(updatedCornerClasses)

  }
}
