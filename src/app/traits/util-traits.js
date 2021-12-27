import {SpyneTrait} from 'spyne';
import {isNil, isEmpty, either} from 'ramda';
export class UtilTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'util$';
    super(context, traitPrefix);
  }

  static util$CamelToSnakeCase(str){
    return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
  }


}
