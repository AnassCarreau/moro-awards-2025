export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Términos de Servicio</h1>
      <div className="prose prose-invert">
        <p>Última actualización: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Uso del Servicio</h2>
        <p>
          Los Premios Moro 2025 es una plataforma de votación para premiar
          contenido y creadores de la comunidad. Al usar este servicio, aceptas
          estos términos.
        </p>

        <h2>2. Registro y Cuenta</h2>
        <p>
          Usamos autenticación mediante redes sociales (Twitter/X, Google, Discord)
          para verificar tu identidad. No almacenamos contraseñas.
        </p>

        <h2>3. Uso Aceptable</h2>
        <p>
          Prohibido: crear múltiples cuentas para votar, manipular resultados,
          contenido ofensivo, spam, o cualquier actividad fraudulenta.
        </p>

        <h2>4. Propiedad Intelectual</h2>
        <p>
          Los usuarios retienen los derechos sobre su contenido. Al participar,
          otorgas permiso para mostrar tu contenido en la plataforma.
        </p>

        <h2>5. Limitación de Responsabilidad</h2>
        <p>
          El servicio se proporciona "tal cual". No garantizamos disponibilidad
          continua ni resultados específicos.
        </p>

        <h2>6. Contacto</h2>
        <p>
          Para preguntas sobre estos términos: tu-email@ejemplo.com
        </p>
      </div>
    </div>
  )
}
