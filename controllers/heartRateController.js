const heartRateModel = require('../models/heartRateModel');

function processHeartRateData(heartRateData) {
    const processedData = [];
    // Grouping heart rate data into 15-minute intervals
    const interval = 15 * 60 * 1000; // 15 minutes in milliseconds
    let currentIntervalStart = new Date(heartRateData[0].on_date).getTime();
    let currentIntervalEnd = currentIntervalStart + interval;
  
    let minHeartRate = Number.MAX_SAFE_INTEGER;
    let maxHeartRate = Number.MIN_SAFE_INTEGER;
  
    for (const reading of heartRateData) {
      const readingTimestamp = new Date(reading.on_date).getTime();
      if (readingTimestamp < currentIntervalEnd) {
        const heartRate = parseInt(reading.measurement);
        minHeartRate = Math.min(minHeartRate, heartRate);
        maxHeartRate = Math.max(maxHeartRate, heartRate);
      } else {
        // Push aggregated data for the previous interval
        processedData.push({
          from_date: new Date(currentIntervalStart).toISOString(),
          to_date: new Date(currentIntervalEnd).toISOString(),
          measurement: { low: minHeartRate.toString(), high: maxHeartRate.toString() },
        });
  
        // Update interval boundaries for the next interval
        currentIntervalStart = currentIntervalEnd;
        currentIntervalEnd += interval;
  
        // Reset min and max heart rate
        minHeartRate = Number.MAX_SAFE_INTEGER;
        maxHeartRate = Number.MIN_SAFE_INTEGER;
  
        // Process the current reading
        const heartRate = parseInt(reading.measurement);
        minHeartRate = Math.min(minHeartRate, heartRate);
        maxHeartRate = Math.max(maxHeartRate, heartRate);
      }
    }
  
    // Push the last aggregated data
    processedData.push({
      from_date: new Date(currentIntervalStart).toISOString(),
      to_date: new Date(currentIntervalEnd).toISOString(),
      measurement: { low: minHeartRate.toString(), high: maxHeartRate.toString() },
    });
  
    return processedData;
      
}

async function handleHeartRateRequest(req, res) {
  try {
    const heartRateData = req.body.clinical_data.HEART_RATE.data;
    const processedHeartRateData = processHeartRateData(heartRateData);

    // await heartRateModel.storeHeartRateData(processedHeartRateData);

    const otherMetrics = {
      patient_id: req.body.patient_id,
      from_healthkit_sync: req.body.from_healthkit_sync,
      orgId: req.body.orgId,
      timestamp: req.body.timestamp,
    };

    res.json({ processedHeartRateData, ...otherMetrics });
  } catch (error) {
    console.error('Error processing data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { handleHeartRateRequest };
