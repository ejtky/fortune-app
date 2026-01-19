'use client';

import { useState } from 'react';

const CALC_TYPES = [
  { id: 'KYUSEI_BOARD', name: '九星盤計算' },
  { id: 'ROKUYO', name: '六曜計算' },
  { id: 'REKICHU', name: '暦注計算' },
  { id: 'ETO', name: '干支計算' },
  { id: 'TIME_KYUSEI', name: '時の九星' },
];

export default function CalculationTestPage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState('REKICHU');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const [year, month, day] = date.split('-').map(Number);
      const res = await fetch('/api/fortune/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          params: { year, month, day },
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>🔮 暦計算連携デモ</h1>
      <p>「暦計算サイト」からリアルタイムでデータを取得します。</p>

      <div style={{ background: '#f5f5f5', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>日付を選択:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ padding: '0.5rem', fontSize: '1rem', width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>計算の種類:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{ padding: '0.5rem', fontSize: '1rem', width: '100%' }}
          >
            {CALC_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleCalculate}
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? '計算中...' : '計算を実行する'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: '#fee2e2', color: '#dc2626', borderRadius: '4px', marginBottom: '2rem' }}>
          Error: {error}
        </div>
      )}

      {result && (
        <div>
          <h2>結果: {result.title}</h2>
          <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {result.data.map((row: any[], i: number) => (
                  <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: '0.75rem', fontSize: '0.9rem' }}>
                        {typeof cell === 'string' && cell.includes('<img') ? (
                          <div dangerouslySetInnerHTML={{ __html: cell }} />
                        ) : (
                          cell?.toString()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
