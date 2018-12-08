'use strict';

const {Transform} = require('stream');

const defaultInitial = 0;
const defaultReducer = (acc, value) => value;

class Scan extends Transform {
  constructor(options) {
    super(Object.assign({}, options, {writableObjectMode: true, readableObjectMode: true}));
    this._accumulator = defaultInitial;
    this._reducer = defaultReducer;
    if (options) {
      'initial' in options && (this._accumulator = options.initial);
      'reducer' in options && (this._reducer = options.reducer);
    }
  }
  _transform(chunk, encoding, callback) {
    this._accumulator = this._reducer.call(this, this._accumulator, chunk);
    this.push(this._accumulator);
    callback(null);
  }
  static make(reducer, initial) {
    return new Scan(typeof reducer == 'object' ? reducer : {reducer, initial});
  }
}
Scan.make.Constructor = Scan;

module.exports = Scan.make;
