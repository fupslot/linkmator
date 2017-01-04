'use strict';
const expect = require('expect');
const util = require('../server/util');
const ImageUrlObject = require('../server/lib/ImageUrlObject');
const validationMethodDecorator = require('../server/middleware/sendModelValidationError');

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

describe('middleware', function() {
  it('validation error method', function() {
    const responseHandler = expect.createSpy().andCall(
      (data) => {
        expect(data).toExist();
        expect(data.status).toExist(400);
        expect(data.name).toEqual('ValidationError');
        expect(data.errors).toBeA(Array);
        expect(data.errors[0].path).toEqual('path');
        expect(data.errors[0].message).toEqual('message');
        expect(data.errors[0].value).toEqual('value');
      }
    );

    const next = expect.createSpy();

    const response = {
      status() {
        return {
          json: expect.createSpy().andCall(responseHandler)
        };
      }
    };

    validationMethodDecorator(null, response, next);
    expect(response.sendModelValidationError).toBeA('function');
    expect(next).toHaveBeenCalled();

    response.sendModelValidationError({
      errors: {
        path: {
          path: 'path',
          message: 'message',
          value: 'value'
        }
      }
    });

    response.sendModelValidationError('path', 'message', 'value');

    expect(
      response.sendModelValidationError.bind({}, 'path', 'message')
    ).toThrow('function expects 1 or 3 arguments');
    expect(
      response.sendModelValidationError.bind({}, {})
    ).toThrow('errors object not found');
  });
});
