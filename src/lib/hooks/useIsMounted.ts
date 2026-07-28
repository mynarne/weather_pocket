import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * React 19 호환 SSR/CSR 하이드레이션 완료 상태를 안전하게 확인하는 커스텀 훅.
 * getServerSnapshot은 서버에서 false를 반환하고, CSR 마운트 후 getSnapshot은 true를 반환함.
 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
