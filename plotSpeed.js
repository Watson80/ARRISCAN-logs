function plotGraphForScanSpeed(combinedLogs) {
    const filteredContent = filterContentByKeyword(combinedLogs, 'moving av');
    const lines = filteredContent.split('\n');
    const dataPoints = [];

    // Iterate over each line to extract the timestamp and value
    for (const line of lines) {
        const match = line.match(/^\d{4}\.\d{2}\.\d{2}\s\d{2}:\d{2}:\d{2}.*\s(\d+\.\d+)\sfps$/);
        if (match) {
            const timestampString = line.substring(0, 19); // Extract timestamp string
            const value = parseFloat(match[1]); // Extract the value and convert to float
            const timestamp = new Date(timestampString); // Parse the timestamp into a Date object
            dataPoints.push({ x: timestamp, y: value }); // Add the data point
        }
    }

    // Sort data points by timestamp
    dataPoints.sort((a, b) => a.x - b.x);

    // Extract x and y values for the chart
    const xValues = dataPoints.map(point => point.x);
    const yValues = dataPoints.map(point => point.y);

    // Plot the graph using a charting library (e.g., Chart.js)
    // Example Chart.js code:
    const ctx = document.getElementById('scanSpeedChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [{
                label: 'Scan Speed (fps)',
                data: yValues,
                borderColor: 'blue',
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        displayFormats: {
                            hour: 'HH:mm:ss'
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Scan Speed (fps)'
                    }
                }
            }
        }
    });
}
