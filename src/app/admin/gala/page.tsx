import { createClient } from '@/lib/supabase/server'
import { GalaControlClient } from './gala-control-client'

export default async function GalaControlPage() {
  const supabase = await createClient()
  
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('display_order')
  
  const { data: finalists } = await supabase
    .from('finalists')
    .select('*')
    .order('vote_count', { ascending: false })
  
  return (
    <GalaControlClient
      categories={categories || []}
      initialFinalists={finalists || []}
    />
  )
}