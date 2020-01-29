const fs = require('fs');
const path = require('path');
const readlineSync = require('readline-sync');


readlineSync.setDefaultOptions({
  encoding: 'utf8',
});


// 基本参数

let _param = {
  code: '',
  name: '',
  appID: '',
  apiURL: '',
};


// 路径相关

let _path = {};
let _pathInput = {
  projectConfigJson: '../project.config.json',
  appWpy: '../src/app.wpy',
  serviceIndexJs: '../src/service/index.js',
  configFile: 'wxapp.config.json',
  properties: '../src/store/properties.js',
};

Object.keys(_pathInput).map(
  (item) => {
    _path[item] = path.resolve(__dirname, _pathInput[item]);
  }
);


// 帮助

const printDoc = (type) => {
  switch (type) {
    case 'preBuild':
      return stdout(...[
        '提示：\n',
        '继续执行会导致当前代码发生变化，请先注意提交当前变更再继续\n',
        '强烈建议在新建的分支上执行当前命令',
      ]);
    case 'doc':
      return stdout(...[
        '帮助文档：\n',
        '    node gen                   - 自动运行\n',
        '    node gen new (-n)          - 构建新小程序文件\n',
        '    node gen replace (-r)      - 构建小程序文件\n',
        '    node gen help (-h, --help) - 显示帮助文档（当前显示）',
      ]);
    default:
  }
};


// 普通输出 : Function

const stdout = function() {
  const msg = Object.values(arguments).join('') + '\n';
  process.stdout.write(msg);
  return {stdout};
};


// 格式化输出 : Function

const pprint = (obj = '') => {
  if (typeof obj === 'string')
    return stdout(obj);
  return stdout(JSON.stringify(_param, null, 2));
};


// 设置参数 : Function

const setParam = () => {
  const appCode = readlineSync
    .question('请先定义一个当前配置项将要使用的命名空间（例如：\'qichang\'）：');
  if (appCode) _param.code = appCode;

  const appID = readlineSync
    .question('请输入小程序将要使用的AppID（例如：\'wx9e32da81b5b1956c\'）：');
  if (appID) _param.appID = appID;

  const appName = readlineSync
    .question('请输入小程序将要显示的名字（例如：\'齐昌网络\'）：');
  if (appName) _param.name = appName;

  const appApi = readlineSync
    .question('请输入小程序将要使用的数据接口（例如：\'https://bla.bla/bla\'）：');
  if (appApi) _param.apiURL = appApi;

  pprint(_param);
  const confirm = readlineSync
    .keyInYNStrict('请确认以上信息是否正确：');
  if (!confirm) return setParam();
};


// 配置文件

const configFile = () => ({
  read: () => {
    const hasConfig = fs.existsSync(_path.configFile);
    if (hasConfig) {
      const file = fs.readFileSync(_path.configFile, 'utf8');
      return JSON.parse(file);
    } else {
      return hasConfig;
    }
  },
  save: (data = {}) => {
    const hasConfig = fs.existsSync(_path.configFile);
    if (hasConfig) {
      const file = fs.readFileSync(_path.configFile, 'utf8');
      const oldData = JSON.parse(file);
      const newData = {
        data: oldData.data.concat(data),
      };
      return fs.writeFileSync(_path.configFile, JSON.stringify(newData, null, 2), 'utf8');
    } else {
      const _ = {
        data: [data],
      };
      return fs.writeFileSync(_path.configFile, JSON.stringify(_, null, 2), 'utf8');
    }
  },
});


// 新增配置

const newConfig = () => {
  stdout('开始新增配置项..\n')
    .stdout('如果不想填写某个配置项内容可直接回车跳过\n');
  setParam();
  return configFile().save(_param);
};


// 替换版本号

const replaceVersion = () => {
  printDoc('preBuild');
  stdout('\n请输入新接口版本号：');
  const version = readlineSync.prompt();
  if (!version) return stdout('输入有误，程序退出..\n');
  const goOn = readlineSync.keyInYNStrict(`确认使用 ${version} ?`);
  if (!goOn) return;
  let file = fs.readFileSync(_path.properties, 'utf8');
  file = file.replace(
    /export const APP_VERSION = '(\S*)';/,
    `export const APP_VERSION = '${version}';`,
  );
  fs.writeFileSync(_path.properties, file, 'utf8');
  stdout('全部替换完毕\n')
    .stdout('请按需提交代码变更\n\n');
};


// 替换内容

const replaceCode = () => {
  printDoc('preBuild');
  const _con = configFile().read();
  const _runReplace = () => {
    const _f = configFile().read();
    const choices = Array.from(_f.data).map(x => x.name);
    const selected = readlineSync
      .keyInSelect(choices, '请选择一个配置项并继续..', {cancel: '返回'});
    let file = null;
    const data = _f.data[selected];
    if (!data) return;
    console.info(JSON.stringify(data, null, 2));
    const goOn = readlineSync.keyInYNStrict('是否使用以上配置内容：');
    if (!goOn) return;
    const {name, appID, apiURL} = data;
    [
      {
        filePath: 'projectConfigJson',
        str0: /"appid": "(\w)*",/g,
        str1: '"appid": "' + appID + '",',
      },
      {
        filePath: 'appWpy',
        str0: /'navigationBarTitleText': '(\S)*',/g,
        str1: '\'navigationBarTitleText\': \'' + name + '\',',
      },
      {
        filePath: 'appWpy',
        str0: /appName: '(\S)*',/g,
        str1: 'appName: \'' + name + '\',',
      },
      {
        filePath: 'serviceIndexJs',
        str0: /export const baseUrl = '(\w)*:\/\/(\S)*';/g,
        str1: 'export const baseUrl = \'' + apiURL + '\';',
      },
    ].map(
      ({filePath, str0, str1}) => {
        file = fs.readFileSync(_path[filePath], 'utf8');
        file = file.replace(str0, str1);
        fs.writeFileSync(_path[filePath], file, 'utf8');
      }
    );
    stdout('全部替换完毕\n')
      .stdout('请按需提交代码变更\n\n');
  };
  if (!_con) {
    stdout('没有找到可用配置文件..\n');
    newConfig();
    _runReplace();
  } else {
    _runReplace();
  }
};


// 运行

const run = () => ({
  new: () => {
    stdout('');
    newConfig();
  },
  replace: () => {
    stdout('');
    replaceCode();
  },
  help: () => {
    stdout('');
    printDoc('doc');
  },
  replaceVersion: () => {
    stdout('');
    replaceVersion();
  },
  init: () => {
    const selected = readlineSync.keyInSelect(
      ['新增', '替换', '更换接口版本号', '帮助'],
      '请选择一个操作项..',
      {cancel: '退出'},
    );
    switch (selected) {
      case 0:
        return run().new();
      case 1:
        return run().replace();
      case 2:
        return run().replaceVersion();
      case 3:
        return run().help();
      default:
    }
  },
  exit: () => {
    process.exit(0);
  },
});


// ========================================


const _arg = Array.from(process.argv);

if (_arg.filter(x => ['help', '-h', '--help'].includes(x)).length)
  run().help();
else if (_arg.filter(x => ['new', '-n'].includes(x)).length)
  run().new();
else if (_arg.filter(x => ['replace', '-r'].includes(x)).length)
  run().replace();
else if (_arg.filter(x => ['replaceVersion', '-rv'].includes(x)).length)
  run().replaceVersion();
else
  run().init();
