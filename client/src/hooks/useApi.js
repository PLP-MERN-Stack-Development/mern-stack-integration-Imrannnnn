// client/src/hooks/useApi.js
import { useState, useCallback } from 'react';

export default function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const call = useCallback(async (request) => {
    setLoading(true);
    setError(null);
    try {
      const res = await request(); // res is already data from postService
      setLoading(false);
      return res; // ✅ FIXED: don't do res.data
    } catch (err) {
      setError(err.response?.data || { message: err.message });
      setLoading(false);
      throw err;
    }
  }, []);

  return { call, loading, error };
}
