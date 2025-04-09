const fs = require('node:fs');

const args = process.argv.slice(2);

const parseArgs = () => {
  const inputs = {};
  args.forEach((v) => {
    if (v.startsWith('day')) {
      inputs['day'] = v;
    } else {
      inputs['year'] = v;
    }
  });

  return inputs;
};

const inputs = parseArgs();
const year = inputs.year;
const day = inputs.day;

try {
  if (!fs.existsSync(year)) {
    fs.mkdirSync(year);
  }
} catch (err) {
  console.error('Unable to create folder', year, err);
}

try {
  if (!fs.existsSync(`${year}/${day}`)) {
    fs.mkdirSync(`${year}/${day}`);
    fs.cp('temp', `${year}/${day}`, { recursive: true }, () =>
      console.log(`Folder "${year}/${day}" was successfully created`)
    );
  } else {
    console.log(`Folder "${year}/${day}" already exist`);
  }
} catch (err) {
  console.error('Unable to create folder', day, err);
}
