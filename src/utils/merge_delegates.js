const fs = require('fs');
const path = require('path');

// Directory containing the delegate JSON files
const directoryPath = path.join(__dirname, 'delegates');

// Array to hold all delegate data
let allDelegates = [];

// Read all files from the directory
fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }

  // Loop through all files and read their content
  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);

    // Read the file and parse its content
    const data = fs.readFileSync(filePath, 'utf8');
    const delegates = JSON.parse(data);

    // Add the content to the allDelegates array
    allDelegates = allDelegates.concat(delegates);
  });

  // Write the combined data to a new JSON file
  const outputFilePath = path.join(__dirname, 'all_delegates.json');
  fs.writeFileSync(outputFilePath, JSON.stringify(allDelegates, null, 2), 'utf8');

  console.log('Successfully merged all delegate files into all_delegates.json');
});
