import { useEffect, useState } from 'react';

export function useApiData<T>(loader: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    loader()
      .then(result => { if (active) setData(result); })
      .catch(errorValue => { if (active) setError(errorValue instanceof Error ? errorValue.message : 'خطا در دریافت داده از سرور'); })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [loader]);

  return { data, loading, error };
}
