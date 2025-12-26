import { test, expect } from '@playwright/test'

test.describe('Sistema de Votación', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('dev_force_phase', 'voting')
    })
    await page.reload()
  })

  test('página de votación carga correctamente', async ({ page }) => {
    await page.goto('/votar')
    
    // Verificar header
    await expect(page.getByText('Votación Final')).toBeVisible()
    
    // Verificar indicadores de progreso
    await expect(page.getByText(/de 20 categorías votadas/i)).toBeVisible()
  })

  test('muestra finalistas de la categoría actual', async ({ page }) => {
    await page.goto('/votar')
    
    // Debe mostrar alguna categoría
    await expect(page.locator('h3').first()).toBeVisible()
    
    // Debe mostrar aviso de voto ciego
    await expect(page.getByText(/voto ciego/i)).toBeVisible()
  })

  test('navegación entre categorías funciona', async ({ page }) => {
    await page.goto('/votar')
    
    // Guardar nombre de primera categoría
    const firstCategory = await page.locator('h3').first().textContent()
    
    // Click en siguiente
    await page.getByRole('button', { name: /siguiente/i }).click()
    
    // La categoría debería haber cambiado
    const secondCategory = await page.locator('h3').first().textContent()
    expect(firstCategory).not.toBe(secondCategory)
    
    // Click en anterior
    await page.getByRole('button', { name: /anterior/i }).click()
    
    // Debería volver a la primera
    const backToFirst = await page.locator('h3').first().textContent()
    expect(backToFirst).toBe(firstCategory)
  })

  test('votación bloqueada sin autenticación', async ({ page }) => {
    await page.goto('/votar')
    
    // Intentar votar (click en cualquier finalista)
    const finalistButton = page.locator('button').filter({ hasText: /@/ }).first()
    
    if (await finalistButton.isVisible()) {
      await finalistButton.click()
      
      // Debe mostrar modal de login
      await expect(page.getByText('Inicia sesión para participar')).toBeVisible()
    }
  })
})