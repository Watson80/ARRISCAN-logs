let combinedLogs = '';

function chooseMultipleFiles() {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
}

function displayLogInfo() {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;

    if (!files || files.length === 0) {
        return;
    }

    let fileList = '';

    for (let i = 0; i < files.length; i++) {
        fileList += files[i].name;
        if (i < files.length - 1) {
            fileList += ', ';
        }
    }

    document.getElementById('fileMessage').textContent = `Selected file(s): ${fileList}`;

    combinedLogs = '';
    const reader = new FileReader();

    let filesProcessed = 0;

    for (const file of files) {
        const fileReader = new FileReader();
        fileReader.onload = function(e) {
            combinedLogs += e.target.result + '\n';
            filesProcessed++;

            if (filesProcessed === files.length) {
                processCombinedLogs();
            }
        };

        fileReader.readAsText(file);
    }
}

function processCombinedLogs() {
    const pmacVersion = extractLogInfo(combinedLogs, 'PMAC version');
    const swVersion = extractLogInfo(combinedLogs, 'Safety board version');
    const kcrTrack = extractLogInfo(combinedLogs, 'KCR track:');

    const lines = combinedLogs.split('\n');
    let startOfLogs = 'N/A';
    let endOfLogs = 'N/A';

    // Find the start of logs
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim(); // Remove leading and trailing whitespace
        if (line !== '') {
            startOfLogs = formatDate(line.substring(0, 19));
            break;
        }
    }

    // Find the end of logs
    for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i].trim(); // Remove leading and trailing whitespace
        if (line !== '') {
            endOfLogs = formatDate(line.substring(0, 19));
            break;
        }
    }

    document.getElementById('startOfLogs').textContent = `Start of logs: ${startOfLogs}`;
    document.getElementById('endOfLogs').textContent = `End of logs: ${endOfLogs}`;
    document.getElementById('pmacVersion').textContent = `PMAC version: ${pmacVersion}`;
    document.getElementById('swVersion').textContent = `SW version: ${swVersion}`;
    document.getElementById('kcrTrack').textContent = `KCR track: ${kcrTrack}`;
  //TD scan locations? formats? 35 or 16? autofocus on or off?
}

function formatDate(timestamp) {
    const date = new Date(timestamp.replace(/-/g, '/')); // Replace hyphens with slashes for better browser compatibility
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear().toString().slice(-2);
    return `${hours}:${minutes}:${seconds},   ${day} ${month} ${year}`;
}

function extractLogInfo(content, keyword) {
    const startIndex = content.indexOf(keyword);
    if (startIndex === -1) {
        return 'N/A';
    }
    let endIndex = content.indexOf('\n', startIndex);
    if (endIndex === -1) {
        endIndex = content.length;
    }
    const line = content.substring(startIndex, endIndex);
    const match = line.match(/\d+(\.\d+)?/);
    if (match) {
        return match[0];
    }
    return 'N/A';
}

function filterLogs() {
    const keywordInput = document.getElementById('keywordInput').value.toLowerCase();
    const filteredContent = filterContentByKeyword(combinedLogs, keywordInput);
    download(filteredContent, 'filtered_logs_custom.txt');
}

function filterLogsByScanSpeed() {
    const filteredContent = filterContentByKeyword(combinedLogs, 'moving av');
    download(filteredContent, 'filtered_logs_scan_speed.txt');
}

function filterLogsByScanLocation() {
    const filteredContent = filterContentByKeyword(combinedLogs, 'Finished writing file');
    download(filteredContent, 'filtered_logs_Scan_Location.txt');
}

function filterLogsByResolution() {
    const filteredContent = filterContentByKeyword(combinedLogs, ':Downsampling.');
    download(filteredContent, 'filtered_logs_Resolution.txt');
}

function filterContentByKeyword(content, keyword) {
    const lines = content.split('\n');
    const lowercaseKeyword = keyword.toLowerCase();
    return lines.filter(line => line.toLowerCase().includes(lowercaseKeyword)).join('\n');
}




function download(content, filename) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  }

  function downloadFilteredLogs() {
  const filteredContent = ""; // Generate or retrieve the filtered content here
  const filename = "filtered_logs.txt"; // Define the filename for the filtered logs
  download(filteredContent, filename); // Trigger download with filtered content and filename
  }

