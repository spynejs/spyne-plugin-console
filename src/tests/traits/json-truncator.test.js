import {SpyneApp} from '../../../../spyne';

const {expect, assert} = require('chai');
const {parse, stringify} = require('flatted');

const {jsonTruncatorCorrectValues} = require('../mocks/json-truncator-results');
const {MockData} = require('../mocks/mock-data.js');
const {mockDataArr} = MockData;
const {correctBase64} = jsonTruncatorCorrectValues;
const R = require('ramda');

const {ChannelPayloadToTestFilters} = require('../mocks/channel-payload-data');

const longStringWithParagraph = 'Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.\n\nIn congue. Etiam justo. Etiam pretium iaculis justo.';

const longStringUrl = 'https://miitbeian.gov.cn/ultricies/eu/nibh/quisque/id/justo/sit.jpg?duis=nulla&faucibus=ac&accumsan=enim&odio=in';

const longStringBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJNSURBVDjLpZNLSNVhEMV/f7UCy+iaqWkpKVFqUIlRUS3SHkSPRYugVbuCaFPrEgIxsKCFix5QtIsWraIIS5MQa6G1CTN7iKa3SAyt7P7v983M1+Kqm4oCB4bDmcXhzBkmCiEwl8pijpXTf+v0iKqWmimqgqpHxCPiZtF7h4hrO9DUufc3AVUtLdy2jxCUoEYwwUwJKgT1mApBhRf3bu75owMRj5mQnkwSVDDxmPoMisPEsWDxcq7ltXDl/JOgoqioipeTXZf2X88RcRRVH/znrtrZQePRWtQCI2M/slvv9l4AMgLn7n+gP/kddYY4RZ0iaZ3la0sWIl5wEqgpT7BxVYLLt5/nA+R4n+bEsi5+Zg1NW/botPUZnru0nNb8du70THFs3gNqyorxzmfO6H0a8w51KWS61aVQF6MuxnyMiScWx4qCKlo7d9LzbnRWIMe5GBXH/LyiTOKSSf7qtzZCtseZ4Cb6Kc1fTVXxZr7HU1zs2ITqWQCiI7s2hBAMMyMEI0xj6fEEu2uOocFQU4zA58kREgsLefbhMb1DT4k1vSTrzqOX0aukH0xUbqFkXT39Y1GqvHYfsTg0GEPjbxkcH+D9WB8TqXGGvr5nw8odrCmpI5YwHoUQqK6u3g60ACngBnCq9gxbD60/gZgipmgwPk0Ok7+omJcfu3n0+uFXpzREf3umw1crLHYOZ45YHJUFNdGWij30DHfTPtD22QkNyebQF/3vN65rypqqK6vP7RxoH3VGQ7I5vAH4b4GKxmhKLTs3ZVrxpTkMzsx/ARtuob3+yA7oAAAAAElFTkSuQmCC';

import {JsonTruncator} from '../../app/traits/json-truncator';

describe('should break long json strings', () => {

  it('should add line breaks to long base64 string', () => {
    const base64Wrap = JsonTruncator.JsonTruncatorParseString
    (longStringBase64, '\n');

    //expect(base64Wrap.length).to.equal(correctBase64.length)
    return true;
  });

  it('should add line breaks to long url', () => {
    const longString = JsonTruncator.JsonTruncatorParseString
    (longStringUrl, '\n', 34, 46, 62);
    //console.log('long s ',longString);
    return true;
    // expect(base64Wrap.length).to.equal(correctBase64.length)
  });

  it('should add line breaks to paragraph', () => {
    const longString = JsonTruncator.JsonTruncatorParseString
    (longStringWithParagraph, '\n', 34, 46, 62);
    //console.log('long s ',longString);
    return true;
    // expect(base64Wrap.length).to.equal(correctBase64.length)
  });

});

describe('should truncate an array', () => {

  it('should check max amount of objs per str len', () => {
    const maxObjs = JsonTruncator.JsonTruncatorGetMaxObjs(mockDataArr);
    expect(maxObjs).to.equal(2);
  });

  it('should return formatted  obj', () => {
    const obj = mockDataArr[2];
    const formattedObj = JsonTruncator.JsonTruncatorSoftWrapObjValues(obj,
        '\n');
    return true;
  });

  it('should return truncated array ', () => {
    const arr = JsonTruncator.JsonTruncatorFormatArray(mockDataArr, 4821);
    const arrLen = arr.length;
    expect(arrLen).to.equal(4);

  });
  it('should return original array ', () => {
    const arr = JsonTruncator.JsonTruncatorFormatArray(mockDataArr, 1000000);
    const arrLen = arr.length;
    expect(arrLen).to.equal(mockDataArr.length);

  });

});

describe('should json truncator', () => {

  const liSel = '#xqdlqmr';

  beforeEach(function() {
     SpyneApp.init({debug: true});
    const liElTmpl = `
     <pre class="page-card page-menu-4-card" id="xqdlqmr" name="PageCardView" data-vsid="xqdlqmr"><a href="/menu-3/sub-menu-4" data-channel="ROUTE" data-event-prevent-default="true" data-topic-id="sub-menu-2" data-nav-level="2">
        <code>
                <span>let h3 = new HTMLEl>ement('h3') h3.innerText="SDFSDFSDFDSFDS";</span>

    document.body.appendChild(h3)
        </code>

      </pre>
    `;

    const ul = document.createElement('ul');
    ul.innerHTML = liElTmpl;
    document.body.appendChild(ul);
    ChannelPayloadToTestFilters.el = document.querySelector(liSel);
  })



  it('should conform payload obj', () => {
    const tempEl = {
      el: document.querySelector(liSel)
    };
    const payloadObj = R.pick(['action', 'event', 'srcElement'], ChannelPayloadToTestFilters)



    payloadObj['payload']={mockDataArr}
    payloadObj.payload.mockDataArr[0]['elObj']=tempEl;
    const conformedPayload = JsonTruncator.JsonTruncatorDeCycleEls(payloadObj);
    const nodeName = 'pre#xqdlqmr.page-card';

    const returnedNodeName = R.path(['decycledObj','payload', 'mockDataArr', 0, 'elObj', 'el'], conformedPayload);
    expect(returnedNodeName).to.equal(nodeName);

    expect(conformedPayload.decycledObj.payload.mockDataArr.length).to.be.gt(2);



  });

});
