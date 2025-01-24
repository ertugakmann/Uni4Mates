import { useEffect, useState } from "react";

export function useSession() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Hata mesajları için

  useEffect(() => {
    const fetchSession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/auth/getSession", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include", // Cookies'in gönderilmesini sağlar
        });

        const data = await response.json(); // JSON yanıtını bir kez alıyoruz

        if (response.ok) {
          setUser(data.user); // Eğer session varsa kullanıcıyı ayarla
        } else {
          setError(data.message || "Session fetch failed");
          console.error("Session fetch failed:", data.message);
        }
      } catch (error) {
        setError("Error fetching session: " + error); // Hata yönetimi
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []); // useEffect yalnızca bir kez çalışacak

  return { user, loading, error }; // error state'i de döndürülür
}
