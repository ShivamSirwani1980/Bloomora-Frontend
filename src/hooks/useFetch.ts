import { useEffect, useState } from "react";

/** Error shape */
interface FetchError {
  status: number;
  msg: string;
}

/** Generic fetch hook */
function useFetch<T = unknown>(initialUrl: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<FetchError | null>(null);
  const [url, setUrl] = useState<string>(initialUrl);

  useEffect(() => {
    const fetchRecipes = async (): Promise<void> => {
      try {
        setLoading(true);
        setData(null);
        setError(null);

        const resp = await fetch(url);

        if (resp.ok) {
          const result: T = await resp.json();
          setData(result);
        } else {
          setError({
            status: resp.status,
            msg: resp.statusText,
          });
        }
      } catch (e) {
        const err = e as Error;
        setError({
          status: 500,
          msg: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [url]);

  return { data, loading, error, setUrl };
}

export default useFetch;
