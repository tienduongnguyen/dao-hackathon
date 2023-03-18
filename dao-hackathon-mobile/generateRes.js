console.log('Generating...');
var fs = require('fs');
var Hjson = require('hjson');
var glob = require('glob');

let genStringResource = () => {
  try {
    const data = fs.readFileSync('./src/i18n/locales/vi.ts', 'utf8');
    const json = Hjson.parse(
      data.replace('export default', '').replace(';', ''),
    );
    const stringName = Object.keys(json);
    fs.writeFileSync(
      './src/assets/strings.ts',
      `import I18n from "@src/i18n/i18n";
function strings(){
    return{${stringName.map(string => {
      path = `
        ${string}: I18n.t("${string}", { defaultValue: "" })`;
      return path;
    })}
}}
export default strings
        `,
    );
    console.log(
      `============== Linked ${stringName.length} string ==============`,
    );
  } catch (err) {
    console.error(err);
  }
};

function genImageResource() {
  fs.readdir('./src/assets/images/', function (err, fileName) {
    if (err) {
      console.log(err);
      return;
    }
    fs.writeFileSync(
      './src/assets/imagesAsset.ts',
      `const images = {
    ${fileName.map(iconNane => {
      path = `
    ${iconNane.replace('.png', '')}: require("./images/${iconNane}")`;
      return path;
    })}
    }
export default images`,
      {encoding: 'utf8', flag: 'w'},
    );
    console.log(
      `============== Linked ${fileName.length} images ==============`,
    );
  });
}

const getDirectories = function (src, callback) {
  glob(src + '/**/*', callback);
};

let genRouteScreen = () => {
  let convertName = str => {
    let resStr = str + '';
    for (let i = 1; i < resStr.length; i++) {
      const element = resStr[i];
      if (element == element.toUpperCase()) {
        resStr = resStr.substr(0, i) + `_${element}` + resStr.substr(i + 1);
        i++;
      }
    }
    return resStr.toUpperCase();
  };

  getDirectories('./src/screens/main/stack', function (err, res) {
    if (err) {
      console.log('Error', err);
    } else {
      let screens = res
        .filter(e => e.includes('Screen.tsx'))
        .map(e => {
          const last = e.split('/').length - 1;
          return e.split('/')[last].replace('Screen.tsx', '');
        });

      let stackMain = {};
      res
        .filter(e => e.includes('Screen.tsx'))
        .map(e => `require('../../../${e}').default`)
        .forEach((e, i) => {
          stackMain[screens[i]] = e;
        });
      fs.writeFileSync(
        './src/navigation/stack/MainStack.js',
        `module.exports = ${JSON.stringify(stackMain).split('"').join('')}`,
      );
      console.log(
        `============== Linked Bottom ${screens.length} screens ==============`,
      );
    }
  });

  getDirectories('./src/screens/main', function (err, res) {
    if (err) {
      console.log('Error', err);
    } else {
      let screens = res
        .filter(e => e.includes('Screen.tsx'))
        .map(e => {
          const last = e.split('/').length - 1;
          return e.split('/')[last].replace('Screen.tsx', '');
        });
      let c = require('./src/navigation/routers');
      let screenMain = {};
      screens = screens.concat(['MainTab']);
      screens.forEach(e => {
        screenMain[convertName(e)] = e;
      });
      c.SCREEN_ROUTER_MAIN = screenMain;
      fs.writeFileSync(
        './src/navigation/routers.js',
        `module.exports = ${JSON.stringify(c)}`,
      );
      console.log(
        `============== Linked Main ${screens.length} screens ==============`,
      );
    }
  });

  getDirectories('./src/screens/auth', function (err, res) {
    if (err) {
      console.log('Error', err);
    } else {
      let screens = res
        .filter(e => e.includes('Screen.tsx'))
        .map(e => {
          const last = e.split('/').length - 1;
          return e.split('/')[last].replace('Screen.tsx', '');
        });
      let c = require('./src/navigation/routers');
      let screenAuth = {};
      screens.forEach(e => {
        screenAuth[convertName(e)] = e;
      });
      c.SCREEN_ROUTER_AUTH = screenAuth;
      fs.writeFileSync(
        './src/navigation/routers.js',
        `module.exports = ${JSON.stringify(c)}`,
      );

      let stackAuth = {};
      res
        .filter(e => e.includes('Screen.tsx'))
        .map(e => `require('../../../${e}').default`)
        .forEach((e, i) => {
          stackAuth[screens[i]] = e;
        });
      fs.writeFileSync(
        './src/navigation/stack/AuthStack.js',
        `module.exports = ${JSON.stringify(stackAuth).split('"').join('')}`,
      );
      console.log(
        `============== Linked Auth ${screens.length} screens ==============`,
      );
    }
  });
};

const genReduxReducer = () => {
  getDirectories('./src/redux/reducers', function (err, res) {
    if (err) {
      console.log('Error', err);
    } else {
      let reducers = res
        .filter(e => e.includes('.ts'))
        .map(e => {
          const last = e.split('/').length - 1;
          return `${e.split('/')[last].replace('.ts', '')}`;
        });
      let listReducers = {};
      res
        .filter(e => e.includes('.ts'))
        .map((e, i) => `require('./${reducers[i]}').default`)
        .forEach((e, i) => {
          listReducers[reducers[i]] = e;
        });
      fs.writeFileSync(
        './src/redux/reducers/index.js',
        `module.exports = ${JSON.stringify(listReducers).split('"').join('')}`,
      );
      console.log(
        `============== Linked Redux ${reducers.length} reducers ==============`,
      );
    }
  });
};

genRouteScreen();
genImageResource();
genStringResource();
genReduxReducer();
