const { Pool } = require('pg');

const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'caremonitor',
  password: 'admin',
  port: 5432,
});

async function storeHeartRateData(processedData) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const data of processedData) {
      const { from_date, to_date, measurement } = data;
      await client.query(
        'INSERT INTO heart_rate_data (from_date, to_date, low, high) VALUES ($1, $2, $3, $4)',
        [from_date, to_date, measurement.low, measurement.high]
      );
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { storeHeartRateData };
