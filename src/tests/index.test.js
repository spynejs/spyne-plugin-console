const {expect} = require('chai');
const {SpyneApp, SpyneAppProperties} = require('spyne');
describe('should initialize spyne', () => {
  SpyneApp.init();
  beforeEach(()=>{
  })

  it('should be show that spyne has initialized', () => {
    expect(SpyneAppProperties.initialized).to.be.true;
  });
});
