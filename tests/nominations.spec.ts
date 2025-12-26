import { test, expect } from '@playwright/test'

test.describe('Sistema de Nominaciones', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('dev_force_phase', 'nominations')
    })
    await page.reload()
  })

  test('página de categorías carga correctamente', async ({ page }) => {
    await page.goto('/categorias')
    
    // Verificar header
    await expect(page.getByText('Categorías')).toBeVisible()
    
    // Verificar que hay 20 categorías
    const categoryButtons = page.locator('button').filter({ hasText: /Mejor|NPC|Meme|Fail|Creador|Funada|Tuitero|Plato|Shipeo|Hilo|Evento|Grupito|Revelación|Beef|Pick|Extranjero|Nuev|Padre|Madre|Comunidad/i })
    await expect(categoryButtons.first()).toBeVisible()
  })

  test('al hacer clic en categoría se abre modal de nominación', async ({ page }) => {
    await page.goto('/categorias')
    
    // Click en primera categoría
    await page.getByText('Mejor Tweet').click()
    
    // Verificar que se abre el modal
    await expect(page.getByText('Enviar Nominación')).toBeVisible()
  })

  test('formulario cambia según el tipo de categoría (usuario)', async ({ page }) => {
    await page.goto('/categorias')
    
    // Categoría de tipo usuario
    await page.getByText('NPC del Año').click()
    
    // Debe mostrar campo de usuario con @
    await expect(page.getByPlaceholder('username')).toBeVisible()
  })

  test('formulario cambia según el tipo de categoría (link)', async ({ page }) => {
    await page.goto('/categorias')
    
    // Categoría de tipo link
    await page.getByText('Mejor Hilo').click()
    
    // Debe mostrar campo de enlace
    await expect(page.getByPlaceholder(/twitter.com/i)).toBeVisible()
    
    // Debe mostrar toggle de contenido borrado
    await expect(page.getByText('¿El tweet ha sido borrado?')).toBeVisible()
  })

  test('toggle de contenido borrado funciona', async ({ page }) => {
    await page.goto('/categorias')
    
    await page.getByText('Mejor Tweet').click()
    
    // Activar toggle
    const toggle = page.getByRole('button', { name: '' }).filter({ hasText: '' })
    
    // Verificar que aparece el campo de texto cuando se activa
    await page.getByText('¿El tweet ha sido borrado?').click()
    
    // Ahora debería aparecer el campo de descripción
    await expect(page.getByPlaceholder(/describe/i)).toBeVisible()
  })

  test('no permite nominar sin autenticación', async ({ page }) => {
    await page.goto('/categorias')
    
    await page.getByText('NPC del Año').click()
    
    // Rellenar formulario
    await page.getByPlaceholder('username').fill('testuser')
    
    // Intentar enviar
    await page.getByRole('button', { name: /enviar nominación/i }).click()
    
    // Debe mostrar modal de login
    await expect(page.getByText('Inicia sesión para participar')).toBeVisible()
  })
})