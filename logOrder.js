function combineSortedLogs(logFiles) {
    // Sort log files based on start timestamps
    logFiles.sort((a, b) => {
        // Convert start timestamps to Date objects
        const dateA = new Date(a.startTimestamp);
        const dateB = new Date(b.startTimestamp);

        // Compare the dates
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
        return 0;
    });

    let combinedLogs = '';
    for (const logFile of logFiles) {
      const startTimestamp = lines.length > 0 ? lines[0].match(/^\d{4}\.\d{2}\.\d{2}\s\d{2}:\d{2}:\d{2}/)[0] : '';
      const endTimestamp = lines.length > 0 ? lines[lines.length - 1].match(/^\d{4}\.\d{2}\.\d{2}\s\d{2}:\d{2}:\d{2}/)[0] : '';

        combinedLogs += `=== Start of ${logFile.file.name} ===\n`;
        combinedLogs += logFile.fileContent + '\n';
        combinedLogs += `=== End of ${logFile.file.name} ===\n\n`;
    }

    // Now, `combinedLogs` contains logs from all files sorted by start timestamps
    console.log(combinedLogs);
    // You can perform further operations with `combinedLogs`, such as filtering or downloading
}
