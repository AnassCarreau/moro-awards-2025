import { test, expect } from '@playwright/test'

test.describe('Sistema de Fases', () => {
  test.beforeEach(async ({ page }) => {
    // Limpiar localStorage antes de cada test
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('muestra el contador en la página principal', async ({ page }) => {
    await page.goto('/')
    
    // Verificar que el título está presente
    await expect(page.getByText('MORO TW AWARDS 2025')).toBeVisible()
    
    // Verificar que hay algún mensaje de fase
    const phaseMessages = [
      'PROPÓN LA CATEGORÍA ESPECIAL',
      'CIERRE DE NOMINACIONES',
      'CERRADO: PROCESANDO FINALISTAS',
      'LA VOTACIÓN FINAL TERMINA EN',
      'GALA EN DIRECTO',
      'RESULTADOS FINALES'
    ]
    
    const messageVisible = await page.evaluate((messages) => {
      return messages.some(msg => document.body.innerText.includes(msg))
    }, phaseMessages)
    
    expect(messageVisible).toBeTruthy()
  })

  test('fase de propuestas permite ver categorías', async ({ page }) => {
    // Forzar fase de propuestas
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('dev_force_phase', 'proposals')
    })
    await page.reload()
    
    // Buscar botón de nominar
    const nominateButton = page.getByRole('link', { name: /nominar/i })
    await expect(nominateButton).toBeVisible()
    
    // Ir a categorías
    await nominateButton.click()
    await expect(page).toHaveURL('/categorias')
    
    // Verificar que hay categorías listadas
    await expect(page.getByText('Mejor Tweet')).toBeVisible()
  })

  test('fase de votación muestra botón de votar', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('dev_force_phase', 'voting')
    })
    await page.reload()
    
    const voteButton = page.getByRole('link', { name: /votar/i })
    await expect(voteButton).toBeVisible()
  })

  test('fase de gala muestra indicador EN DIRECTO', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('dev_force_phase', 'gala')
    })
    await page.reload()
    
    await expect(page.getByText('GALA EN DIRECTO')).toBeVisible()
    await expect(page.getByText('EN DIRECTO')).toBeVisible()
  })

  test('fase de resultados muestra botón de resultados', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('dev_force_phase', 'results')
    })
    await page.reload()
    
    const resultsButton = page.getByRole('link', { name: /ver resultados/i })
    await expect(resultsButton).toBeVisible()
  })
})