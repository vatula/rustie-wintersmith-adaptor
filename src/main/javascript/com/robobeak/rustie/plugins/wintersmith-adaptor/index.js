import promisify  from 'promisify-node';
import {Plugin}   from 'rustie';


function toUint8Array(buffer) {
  let ab = new ArrayBuffer(buffer.length);
  let view = new Uint8Array(ab);
  for (let i = 0, size = buffer.length; i < size; ++i) {
    view[i] = buffer[i];
  }
  return view;
}

export class WintersmithAdaptor extends Plugin {

  constructor(config = {plugins: Object.create(null)}) {
    this._plugins = Object.keys(config.plugins).map(pluginName => require(pluginName)(config.plugins[pluginName]));
    this._wintersmith = Object.create(null);
  }

  async process(files) {
    // convert Rustie data to Wintersmith
    let wintersmithSource = Object.keys(files).reduce((wintersmithFiles, path) => {
      let data = files[path];
      wintersmithFiles[path] = { contents: new Buffer(data.content) };
      return wintersmithFiles;
    }, Object.create(null));

    // Process data with Wintersmith plugins
    for (let plugin of this._plugins) {
      await promisify(plugin)(wintersmithSource, this._wintersmith);
    }

    // Convert processed Wintersmith data back to Rustie data
    Object.keys(wintersmithSource).forEach(path => {
      let wintersmithData = wintersmithSource[path];
      files[path].content = toUint8Array(wintersmithData.contents);
    });

    return files;
  }
}