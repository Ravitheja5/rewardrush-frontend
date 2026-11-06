import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function StoreRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/rewards');
  }, [router]);
  return null;
}
