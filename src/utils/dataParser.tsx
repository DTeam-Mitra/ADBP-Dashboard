// File: src/components/Mar2024DataParser.tsx
import React, { useEffect, useState } from 'react';

// Rename to avoid conflicts
interface MarRecord {
  id: number;
  name: string;
  value: string;
  // extend fields as per your schema
}

const Mar2024DataParser: React.FC = () => {
  const [data, setData] = useState<MarRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/mar2024')
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json() as Promise<MarRecord[]>;
      })
      .then((records) => {
        setData(records);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Loading data...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">March 2024 Records</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((rec) => (
              <tr key={rec.id}>
                <td className="px-6 py-4 whitespace-nowrap">{rec.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{rec.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{rec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Mar2024DataParser;


// File: src/pages/api/mar2024.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

// Use a dedicated type to avoid conflicts
type MarRecord = {
  id: number;
  name: string;
  value: string;
};

const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  max: 5,
  idleTimeoutMillis: 30000,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MarRecord[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const client = await pool.connect();
    const { rows } = await client.query<MarRecord>(
      'SELECT id, name, value FROM "Mar2024";'
    );
    client.release();
    return res.status(200).json(rows);
  } catch (error) {
    console.error('DB error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
