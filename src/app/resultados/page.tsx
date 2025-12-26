import { createClient } from '@/lib/supabase/server'
import { ResultsClient } from './results-client'

export default async function ResultadosPage() {
  const supabase = await createClient()
  
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('display_order')
  
  const { data: finalists } = await supabase
    .from('finalists')
    .select('*')
    .eq('is_revealed', true)
    .order('final_position')
  
  return (
    <ResultsClient
      categories={categories || []}
      finalists={finalists || []}
    />
  )
}