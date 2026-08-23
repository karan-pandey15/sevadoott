import JsonLd from './JsonLd';
import { getGlobalStructuredDataGraph } from '@/lib/seo';

export default function GlobalStructuredData() {
  return <JsonLd data={getGlobalStructuredDataGraph()} />;
}
