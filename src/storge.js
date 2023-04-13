"use strict";

const electronStorage = require("electron-json-storage");
const { dialog } = require("electron");

let storage;
let template;
let defaultStorage;

/**
 * init - init storge
 * @return {Promise} [promise when init]
 */

let init = () => {
  new Promise((resolve) => {
    electronStorage.has("colorpicker", (error, exit) => {
      if (error) {
        throw error;
      }
      if (exit) {
        resolve(fetch());
      } else {
        storage = defaultStorage;
        resolve(save());
      }
    });
  });
};

/**
 * fatch - fatch storge
 * @return {Promise} [promise when fatch]
 *
 */

let fetch = () => {
  new Promise((resolve) => {
    electronStorage.has("colorpicker", (error, data) => {
      if (error) {
        dialog.showErrorBox("Sorry Loading Faild");
        storage = defaultStorage;
        resolve(false);
      }
      storage = defaultStorage;
      for (let key in defaultStorage.colorpicker) {
        if (!data.colorpicker) {
          return;
        }
        if (!data.colorpicker.hasOwnProperty(key)) {
          data.colorpicker[key] = defaultStorage.colorpicker[key];
        }
      }
      for (let key in defaultStorage.picker) {
        if (!data.picker) {
          return;
        }
        if (!data.colorpicker.hasOwnProperty(key)) {
          data.picker[key] = defaultStorage.picker[key];
        }
      }
      for (let key in defaultStorage.colorsbook) {
        if (!data.colorsbook) {
          return;
        }
        if (!data.colorsbook.hasOwnProperty(key)) {
          data.picker[key] = defaultStorage.colorsbook[key];
        }
      }
      storage = data;
      resolve(true);
    });
  });
};

/**
 * get - return settings of target browser
 * @param {string} el
 * @param {string} name
 * @param {string|Object}
 */

let get = (el, name) => {
  if (!name) {
    name = "colorpicker";
  }
  return storage[name][el] !== null || storage[name][el] !== undefined
    ? storage[name][el]
    : {};
};

/**
 * add - add object settings to storge
 * @param {Object} payload
 * @param {string} name
 */

let add = (payload, name)=>
  new Promise((resolve)=>{
    if(!name){
        name = "colorpicker";
    }
    Object.assign(storage[name], payload)
    resolve(save())
})

/**
 * save - save current storge
 * @returns {Promise}
 */

let save =()=>{
  new Promise((resolve)=>{
    electronStorage.set("colorpicker", storage, (error)=>{
      if(error){
        throw error
      }
      resolve(true);
    });
  });
}

/**
 * reset - reset storage to default
 */
let reset =()=>{
  electronStorage.remove("colorpicker");
  storage = defaultStorage;
  save();
};

/**
 * platform - get actual platform
 * @returns {string}
 */

let platform = () =>{
  switch (process.platform) {
    case "darwin":
      return "";
    case "win32":
      return "windows";
    default:
      return "darwin";
  }
}

/**
 * template - default settings for each platform
 * @type {Object}
 */
template ={
  windows:{},
  darwin:{},
}


/**
 * @type {Object}
 */

defaultStorage ={
  colorpicker:{
    tools:["top","picker","tags","shade","settings"],
    size:{ with: 440, height: 150},
    buttonPosition: template[platform()].buttonPosition,
    buttonType: template[platform()].buttonType,
    lastColor: "#ff651fff",
    history:[],
    colorfullApp: false,
  },
  colorsbook:{
    colors:{
      flat:[
        "#2196F3",
        "#00BCD4",
        "#4CAF50",
        "#8BC34A",
        "#FFEB3B",
        "#FF9800",
        "#FF5722",
        "#F44336",
        "#673AB7",
        "#3F51B5",
        "#607D8B",
      ],
      pastel:[
        "#7E93C8",
        "#8FC1E2",
        "#AFBBE3",
        "#EFCAC4",
        "#E19494",
        "#F8AF85",
        "#F9C48C",
        "#C2BB9B",
        "#B0D9CD",
        "#6B8790",
        "#AC94C9",
      ]
    }
  },
  picker:{
    realTime:true,
  }
}

module.exports ={
  init:init,
  get:get,
  add:add,
  reset:reset,
};