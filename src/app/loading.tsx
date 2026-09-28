import { Loading as LoadingPlaceholder } from '@/components/ui/loading';

/**
 * Route-level loading state.
 *
 * Deliberately minimal: a stable-height placeholder so the layout does not jump
 * when content arrives. A spinner would be motion without information.
 */
export default function Loading() {
  return <LoadingPlaceholder />;
}
