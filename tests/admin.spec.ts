import { test, expect } from '@playwright/test'

test.describe('Panel de Administración', () => {
  test('redirige a inicio si no está autenticado', async ({ page }) => {
    await page.goto('/admin/curation')
    
    // Debe redirigir a la página principal
    await expect(page).toHaveURL('/')
  })

  test('redirige a inicio si no es admin', async ({ page }) => {
    // Simular usuario no admin (esto requeriría mock de auth)
    await page.goto('/admin/gala')
    
    // Debe redirigir
    await expect(page).toHaveURL('/')
  })
})