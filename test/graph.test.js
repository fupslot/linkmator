'use strict';
const expect = require('expect');
const util = require('../server/util');
const ImageUrlObject = require('../server/lib/ImageUrlObject');

describe('lib/graph', function() {
  it('should return string hash', function() {
    const hash = util.getStringHash('hello');
    expect(hash).toBeA('string');
  });

  it('should create ImageUrlObject instance', function() {
    const url = 'http://www.example.com';
    const image = new ImageUrlObject({url});

    expect(image).toBeA(ImageUrlObject);
    expect(image.url).toBe(url);
    expect(image.hash_url).toEqual(util.getStringHash(url));
  });

  it('should use "https:" when no protocol specified', function() {
    const url = '//www.example.com';
    const image = new ImageUrlObject({url});

    expect(image).toBeA(ImageUrlObject);
    expect(image.url).toBe(`https:${url}`);
    expect(image.hash_url).toEqual(util.getStringHash(image.url));
  });
});
