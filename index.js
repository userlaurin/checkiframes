var request = require('request');
const csv = require('csv-parser');
const fs = require('fs');




var result = "";
fs.createReadStream(__dirname+'/checkiframes.csv')
  .pipe(csv())
  .on('data', (row) => {
        request(row['URL'], function(err, response) {
            var isBlocked = 'NO';

            // If the page was found...
            if (!err && response.statusCode == 200) {

                // Grab the headers
                var headers = response.headers;

                // Grab the x-frame-options header if it exists
                var xFrameOptions = headers['x-frame-options'] || '';

                // Normalize the header to lowercase
                xFrameOptions = xFrameOptions.toLowerCase();

                // Check if it's set to a blocking option
                if (
                    xFrameOptions === 'sameorigin' ||
                    xFrameOptions === 'deny'
                ) {
                    isBlocked = 'YES';
                }
            }
            result += row['URL']+" is blocked for iFrames? "+ isBlocked + " \n";
            fs.writeFile(__dirname+'/result.txt', result, ()=>{console.log('')});
            // Print the result
            console.log(row['URL']+' is blocked for iFrames? '+isBlocked);
        });
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
    console.log('You can find the result here: '+__dirname+'/result.txt');
  });

