import { createClient } from '@/lib/supabase/server'
import { CurationClient } from './curation-client'

export default async function CurationPage() {
  const supabase = await createClient()
  
  const { data: nominations } = await supabase
    .from('nominations')
    .select('*, categories(name, slug, mode), profiles(username)')
    .order('nomination_count', { ascending: false })
  
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('display_order')
  
  const { data: finalists } = await supabase
    .from('finalists')
    .select('*, categories(name)')
    .order('category_id')
  
  return (
    <CurationClient
      initialNominations={nominations || []}
      categories={categories || []}
      existingFinalists={finalists || []}
    />
  )
}