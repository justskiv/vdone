const isWin = process.platform === 'win32';

// Windows platform check
if (isWin) {
  const {dev: devScriptStr, build: buildScriptStr} = require('../package.json').scripts
  const args = process.argv.slice(2)
  const scriptType = args[0]
  const fRed = "\x1b[31m"

  const warnFn = (type) => {
    console.log(fRed,
      `\n[vdone] you are on Windows, please use ${type}:win instead, otherwise it will fail.\n`
    )
    process.exit(1)
  }

  // Running dev script and it starts with 'export'
  if (scriptType === 'dev' && devScriptStr.startsWith('export')) {
    warnFn('dev')
  }

  // Running build script and it starts with 'export'
  if (scriptType === 'build' && buildScriptStr.startsWith('export')) {
    warnFn('build')
  }
}