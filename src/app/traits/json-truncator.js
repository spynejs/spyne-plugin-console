import {SpyneTrait} from 'spyne';
import {isEmpty, mapObjIndexed, is} from 'ramda';
import {stringify} from 'flatted';

export class JsonTruncator extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'jsonTruncator$';
    super(context, traitPrefix);
  }

  static JsonTruncatorConvertNodeToName(el) {
    const name = String(el.nodeName).toLowerCase();
    const id = el.id ? '#' + el.id : '';
    let className = el.className ? '.' +
        String(el.classList[0]).replace(/\s+/gm, '.') : '';
    return `${name}${id}${className}`;
  }

  static JsonTruncatorGetMaxObjs(arr, maxStrLen = 2500) {
    let currentLen = 0;
    let index = 0;
    while (currentLen < maxStrLen && arr[index] !== undefined) {
      const obj = arr[index] || {};
      const objLen = stringify(obj).length;
      currentLen += objLen;
      index++;
    }

    return index;

  }

  static JsonTruncatorSoftWrapObjValues(obj, breakChar = '<br>') {
    const checkFoStrings = (o) => {
      const ifStrThenParse = (prop) => {
        if (o.hasOwnProperty(prop) && typeof (o[prop] === 'string')) {
          o[prop] = JsonTruncator.JsonTruncatorParseString(o[prop], breakChar);
        }
      };
      Object.getOwnPropertyNames(o).forEach(ifStrThenParse);

    };
    checkFoStrings(obj);
    return obj;
  }

  static JsonTruncatorDeCycleEls(obj, maxArrLen = 15000) {
    const isArray = is(Array);
    const isObj = is(Object);
    let propNum = 0;
    const checkPropForEl = (prop) => {
      propNum = propNum + 1;
      if (prop !== undefined && prop !== null && prop.nodeType >= 0) {
        prop = JsonTruncator.JsonTruncatorConvertNodeToName(prop);
      }
      if (isArray(prop)) {
        if (prop.length > 2 && maxArrLen !== false) {
          prop = JsonTruncator.JsonTruncatorFormatArray(prop, maxArrLen);
        }
        prop = prop.map(checkPropForEl);
      } else if (isObj(prop) === true && isEmpty(prop) === false) {
        prop = mapObjIndexed(checkPropForEl, prop);
      }

      return prop;
    };

    const decycledObj = checkPropForEl(obj);

    return {decycledObj, propNum};
  }

  static JsonTruncatorFormatArray(arr, maxStrLen = 1500) {
    const len = arr.length;
    const maxIndex = JsonTruncator.JsonTruncatorGetMaxObjs(arr, maxStrLen);
    let truncatedSymbol = ['+'];
    if (maxIndex >= len) {
      return arr;
    }

    truncatedSymbol = `<span class='truncator-expand console-btn'>[+${len -
    maxIndex}]</span>`;

    const newArr = arr.slice(0, maxIndex);
    newArr.push(truncatedSymbol);
    return newArr;
  }

  static JsonTruncatorParseString(
      str, breakChar = '<br>', minLine = 12, defaultLine = 30, maxLine = 42) {
    const regexStr = `(.{${minLine},${defaultLine}}([\\s\?\\/\\\\])|.{${defaultLine},${maxLine}})`;
    const re = new RegExp(regexStr, 'gm');
    return String(str).replace(re, `$1${breakChar}`);
  }

}
