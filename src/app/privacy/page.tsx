export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Política de Privacidad</h1>
      <div className="prose prose-invert">
        <p>Última actualización: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Información que Recopilamos</h2>
        <p>
          Cuando inicias sesión mediante Twitter/X, Google o Discord, recopilamos:
        </p>
        <ul>
          <li>Tu ID de usuario</li>
          <li>Nombre de usuario</li>
          <li>Email (si está disponible)</li>
          <li>Foto de perfil</li>
        </ul>

        <h2>2. Cómo Usamos tu Información</h2>
        <p>
          Usamos tu información para:
        </p>
        <ul>
          <li>Verificar tu identidad para votar</li>
          <li>Prevenir fraude y múltiples votos</li>
          <li>Mostrar tu perfil en nominaciones (si aplica)</li>
          <li>Comunicarnos contigo sobre los premios</li>
        </ul>

        <h2>3. Compartir Información</h2>
        <p>
          NO vendemos tu información personal. Solo compartimos datos agregados
          y anónimos sobre participación en los premios.
        </p>

        <h2>4. Cookies y Tecnologías Similares</h2>
        <p>
          Usamos cookies de sesión para mantener tu inicio de sesión. No usamos
          cookies de seguimiento de terceros para publicidad.
        </p>

        <h2>5. Seguridad</h2>
        <p>
          Usamos Supabase como proveedor de base de datos con cifrado en tránsito
          y en reposo. Las sesiones caducan automáticamente.
        </p>

        <h2>6. Tus Derechos (GDPR)</h2>
        <p>
          Tienes derecho a:
        </p>
        <ul>
          <li>Acceder a tus datos personales</li>
          <li>Solicitar corrección de datos incorrectos</li>
          <li>Solicitar eliminación de tu cuenta</li>
          <li>Retirar consentimiento en cualquier momento</li>
        </ul>

        <h2>7. Retención de Datos</h2>
        <p>
          Mantenemos tus datos mientras tu cuenta esté activa. Puedes solicitar
          eliminación en cualquier momento contactando: tu-email@ejemplo.com
        </p>

        <h2>8. Proveedores de OAuth</h2>
        <p>
          Al iniciar sesión con Twitter/X, Google o Discord, también estás sujeto
          a sus políticas de privacidad:
        </p>
        <ul>
          <li><a href="https://twitter.com/privacy">Twitter/X Privacy Policy</a></li>
          <li><a href="https://policies.google.com/privacy">Google Privacy Policy</a></li>
          <li><a href="https://discord.com/privacy">Discord Privacy Policy</a></li>
        </ul>

        <h2>9. Cambios a Esta Política</h2>
        <p>
          Podemos actualizar esta política. Los cambios se notificarán en esta página.
        </p>

        <h2>10. Contacto</h2>
        <p>
          Para preguntas sobre privacidad: tu-email@ejemplo.com
        </p>
      </div>
    </div>
  )
}
