import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Lock,
  Database,
  Eye,
  AlertTriangle,
  Cookie,
  FileText,
  Globe,
  UserX,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Términos y Privacidad - Moro TW Awards 2025",
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-dark-400 hover:text-gold-400 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Volver al inicio
        </Link>

        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gold-400/10 rounded-lg">
                <Shield className="w-8 h-8 text-gold-400" />
              </div>
              <div>
                <CardTitle className="text-3xl">
                  Términos y Política de Privacidad
                </CardTitle>
                <p className="text-dark-400 text-sm mt-1">
                  Última actualización: 5 de enero de 2026
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="prose prose-invert max-w-none">
            {/* BANNER DESTACADO */}
            <div className="bg-gradient-to-r from-gold-400/20 via-gold-500/20 to-gold-400/20 border-2 border-gold-400/50 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gold-400/30 rounded-full">
                  <UserX className="w-10 h-10 text-gold-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3 m-0">
                    🔒 Tu Voto es 100% Anónimo
                  </h3>
                  <p className="text-dark-100 text-base leading-relaxed m-0">
                    <strong className="text-gold-300">NADIE</strong> puede ver a
                    quién has votado o nominado. Ni organizadores, ni
                    administradores, ni otros usuarios. Las políticas de
                    seguridad{" "}
                    <strong className="text-gold-300">
                      impiden técnicamente
                    </strong>{" "}
                    vincular tu identidad con tus elecciones. Solo se publican
                    resultados totales.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gold-400/10 border border-gold-400/30 rounded-lg p-4 mb-8">
              <p className="text-dark-200 text-sm m-0">
                <strong className="text-gold-400">Al iniciar sesión</strong> en
                esta plataforma, aceptas los términos descritos a continuación.
                Lee esta información para entender cómo protegemos tu
                privacidad.
              </p>
            </div>

            {/* SECCIÓN 1: CONDICIONES DE USO */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-white mt-0 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 bg-gold-400/20 rounded-full text-gold-400 text-lg">
                  1
                </span>
                Condiciones de Uso
              </h2>

              <div className="space-y-4 text-dark-300">
                <div className="pl-11">
                  <h3 className="text-white font-semibold mb-2 text-lg">
                    Propósito de la Plataforma
                  </h3>
                  <p className="leading-relaxed">
                    Esta plataforma gestiona las nominaciones y votaciones de
                    los{" "}
                    <strong className="text-white">
                      "Moro TW Awards 2025"
                    </strong>
                    . El acceso es 100% gratuito para todos los miembros de la
                    comunidad.
                  </p>
                </div>

                <div className="pl-11">
                  <h3 className="text-white font-semibold mb-2 text-lg">
                    Requisitos de Edad
                  </h3>
                  <p className="leading-relaxed">
                    Debes tener al menos{" "}
                    <strong className="text-white">14 años</strong> para
                    participar, conforme a la normativa española (artículo 7
                    LOPDGDD).
                  </p>
                </div>

                <div className="pl-11">
                  <h3 className="text-white font-semibold mb-2 text-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    Prohibición Estricta de Fraude
                  </h3>
                  <p className="leading-relaxed mb-2">
                    Está totalmente prohibido:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Usar bots o scripts automatizados</li>
                    <li>Crear múltiples cuentas (multicuentas)</li>
                    <li>Manipular resultados de cualquier forma</li>
                  </ul>
                  <div className="mt-3 p-3 bg-red-500/10 border-l-4 border-red-500 rounded">
                    <p className="text-sm text-red-300 m-0">
                      <strong>Consecuencias:</strong> Anularemos votos
                      sospechosos y descalificaremos nominaciones fraudulentas.
                      Por eso usamos Google OAuth: para garantizar que cada
                      persona vota una sola vez.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: DATOS RECOPILADOS */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-white mt-0 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 bg-gold-400/20 rounded-full text-gold-400 text-lg">
                  2
                </span>
                Datos que Recopilamos
              </h2>

              <div className="pl-11 space-y-4">
                <p className="text-dark-300 leading-relaxed">
                  Con <strong className="text-white">Google OAuth</strong>{" "}
                  recopilamos únicamente:
                </p>

                <div className="grid gap-3">
                  <div className="flex items-start gap-3 p-3 bg-dark-800/50 rounded-lg border border-dark-700">
                    <Eye className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-white">Foto de perfil</strong>
                      <p className="text-sm text-dark-400 mt-1 m-0">
                        Solo se muestra en tu esquina superior derecha. No
                        aparece vinculada a tus votos ni nominaciones en ningún
                        lugar.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-dark-800/50 rounded-lg border border-dark-700">
                    <Database className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-white">ID único de Google</strong>
                      <p className="text-sm text-dark-400 mt-1 m-0">
                        Usado EXCLUSIVAMENTE para{" "}
                        <strong className="text-gold-400">
                          evitar votos duplicados
                        </strong>
                        . Nunca se muestra públicamente. Las políticas de
                        seguridad impiden que nadie acceda a la relación entre
                        tu ID y tus votos.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-500/10 border-l-4 border-blue-400 rounded-lg p-4 mt-4">
                  <h3 className="text-blue-300 font-bold text-sm uppercase mb-2 m-0">
                    Base Legal del Tratamiento (RGPD)
                  </h3>
                  <p className="text-dark-300 text-sm m-0">
                    Tratamos tus datos con tu{" "}
                    <strong className="text-white">
                      consentimiento explícito
                    </strong>{" "}
                    al iniciar sesión (artículo 6.1.a del RGPD). Puedes retirar
                    tu consentimiento contactándonos para eliminar tu cuenta.
                  </p>
                </div>
              </div>
            </div>

            {/* SECCIÓN 3: PRIVACIDAD ABSOLUTA */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-white mt-0 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 bg-gold-400/20 rounded-full text-gold-400 text-lg">
                  3
                </span>
                🔐 Privacidad Total de Votos y Nominaciones
              </h2>

              <div className="pl-11">
                <div className="bg-gradient-to-br from-green-400/20 to-emerald-600/20 border-2 border-green-400/50 rounded-xl p-6 mb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-400/20 rounded-lg">
                      <Lock className="w-8 h-8 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-xl mb-3 m-0">
                        NADIE puede ver tus elecciones
                      </h3>
                      <p className="text-dark-100 leading-relaxed m-0">
                        Tus votos y nominaciones están protegidos por{" "}
                        <strong className="text-green-300">
                          Row Level Security (RLS)
                        </strong>
                        , un sistema de seguridad que{" "}
                        <strong className="text-green-300">
                          bloquea técnicamente
                        </strong>{" "}
                        cualquier acceso a la relación entre tu identidad y tus
                        votos. Es{" "}
                        <strong className="text-green-300">
                          imposible rastrear
                        </strong>{" "}
                        quién votó a quién, incluso para administradores.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3 mb-4">
                  <div className="bg-dark-800/30 border-l-4 border-green-400 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <strong className="text-white">Votos Anónimos</strong>
                    </div>
                    <p className="text-dark-400 text-sm m-0">
                      Cuando votas, el sistema bloquea automáticamente el acceso
                      a tu identidad. Solo se cuenta el voto, nunca quién lo
                      emitió.
                    </p>
                  </div>

                  <div className="bg-dark-800/30 border-l-4 border-blue-400 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-400" />
                      <strong className="text-white">
                        Nominaciones Anónimas
                      </strong>
                    </div>
                    <p className="text-dark-400 text-sm m-0">
                      Las nominaciones se procesan de la misma forma: nadie
                      puede ver quién nominó a quién. Solo se agregan los datos
                      para curación.
                    </p>
                  </div>
                </div>

                <div className="bg-dark-800/30 border border-dark-700 rounded-lg p-4 mb-4">
                  <h3 className="text-gold-400 font-bold text-sm uppercase mb-2 m-0">
                    ¿Cómo funciona la protección?
                  </h3>
                  <p className="text-dark-300 text-sm leading-relaxed m-0">
                    <strong className="text-white">1.</strong> Google OAuth
                    verifica tu identidad para evitar multicuentas.
                    <br />
                    <strong className="text-white">2.</strong> Los datos se
                    almacenan con{" "}
                    <strong className="text-gold-400">
                      cifrado de extremo a extremo
                    </strong>{" "}
                    en servidores europeos.
                    <br />
                    <strong className="text-white">3.</strong> Las{" "}
                    <strong className="text-gold-400">
                      políticas de seguridad (RLS)
                    </strong>{" "}
                    bloquean todo acceso no autorizado desde la web.
                    <br />
                    <strong className="text-white">4.</strong> Solo se procesan{" "}
                    <strong className="text-gold-400">datos agregados</strong>{" "}
                    (totales) para determinar ganadores.
                  </p>
                </div>

                <div className="space-y-2 text-dark-300">
                  <div className="flex items-center gap-3 bg-dark-800/20 p-3 rounded-lg">
                    <span className="text-green-400 font-bold text-xl">✓</span>
                    <p className="m-0">
                      <strong className="text-white">
                        Imposible ver votos individuales:
                      </strong>{" "}
                      Ni siquiera los administradores técnicos pueden consultar
                      quién votó a quién desde la aplicación.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-dark-800/20 p-3 rounded-lg">
                    <span className="text-green-400 font-bold text-xl">✓</span>
                    <p className="m-0">
                      <strong className="text-white">
                        Solo resultados públicos:
                      </strong>{" "}
                      Se publican únicamente totales agregados, nunca
                      información individual.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-dark-800/20 p-3 rounded-lg">
                    <span className="text-green-400 font-bold text-xl">✓</span>
                    <p className="m-0">
                      <strong className="text-white">
                        Votos y nominaciones iguales:
                      </strong>{" "}
                      Ambos están protegidos de la misma forma. Nadie puede
                      rastrear tus elecciones.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-dark-800/20 p-3 rounded-lg">
                    <span className="text-green-400 font-bold text-xl">✓</span>
                    <p className="m-0">
                      <strong className="text-white">
                        OAuth solo para seguridad:
                      </strong>{" "}
                      Tu cuenta de Google verifica que eres real, no rastrea tus
                      votos.
                    </p>
                  </div>
                </div>

                <div className="mt-4 bg-gradient-to-r from-gold-400/10 to-green-400/10 border border-gold-400/30 rounded-lg p-4">
                  <p className="text-dark-200 text-sm text-center m-0">
                    💡 <strong className="text-gold-300">En resumen:</strong> Tu
                    voto y tus nominaciones están{" "}
                    <strong className="text-white">
                      blindados técnicamente
                    </strong>
                    . La privacidad no depende de confianza, sino de{" "}
                    <strong className="text-white">seguridad real</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* SECCIÓN 4: DESTINATARIOS */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-white mt-0 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 bg-gold-400/20 rounded-full text-gold-400 text-lg">
                  4
                </span>
                Proveedores de Servicios
              </h2>

              <div className="pl-11 space-y-4">
                <p className="text-dark-300 leading-relaxed">
                  Tus datos personales pueden ser compartidos únicamente con
                  estos proveedores necesarios para el funcionamiento:
                </p>

                <div className="grid gap-3">
                  <div className="flex items-start gap-3 p-3 bg-dark-800/50 rounded-lg border border-dark-700">
                    <Globe className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-white">Google LLC (OAuth)</strong>
                      <p className="text-sm text-dark-400 mt-1 m-0">
                        Gestiona la autenticación. Política:{" "}
                        <a
                          href="https://policies.google.com/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gold-400 hover:text-gold-300 underline"
                        >
                          policies.google.com/privacy
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-dark-800/50 rounded-lg border border-dark-700">
                    <Database className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-white">
                        Supabase Inc. (Base de Datos)
                      </strong>
                      <p className="text-sm text-dark-400 mt-1 m-0">
                        Almacena datos en servidores de la UE (cumple GDPR).
                        Política:{" "}
                        <a
                          href="https://supabase.com/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gold-400 hover:text-gold-300 underline"
                        >
                          supabase.com/privacy
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-dark-800/50 rounded-lg border border-dark-700">
                    <FileText className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-white">
                        Netlify Inc. (Hosting Web)
                      </strong>
                      <p className="text-sm text-dark-400 mt-1 m-0">
                        Aloja la aplicación. Solo procesa logs técnicos
                        anónimos. Política:{" "}
                        <a
                          href="https://www.netlify.com/privacy/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gold-400 hover:text-gold-300 underline"
                        >
                          netlify.com/privacy
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-500/10 border-l-4 border-orange-400 rounded-lg p-4">
                  <h3 className="text-orange-300 font-bold text-sm uppercase mb-2 m-0">
                    Transferencias Internacionales
                  </h3>
                  <p className="text-dark-300 text-sm m-0">
                    Google y Netlify (Estados Unidos) están acogidos al{" "}
                    <strong className="text-white">
                      Data Privacy Framework (DPF)
                    </strong>
                    , proporcionando garantías adecuadas para transferencias
                    fuera de la UE (artículo 45 RGPD). Supabase almacena todo en
                    la Unión Europea.
                  </p>
                </div>
              </div>
            </div>

            {/* SECCIÓN 5: COOKIES */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-white mt-0 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 bg-gold-400/20 rounded-full text-gold-400 text-lg">
                  5
                </span>
                Cookies
              </h2>

              <div className="pl-11 space-y-4">
                <p className="text-dark-300 leading-relaxed">
                  Usamos solo cookies estrictamente necesarias:
                </p>

                <div className="grid gap-3">
                  <div className="flex items-start gap-3 p-3 bg-dark-800/50 rounded-lg border border-dark-700">
                    <Cookie className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-white">Google OAuth</strong>
                      <p className="text-sm text-dark-400 mt-1 m-0">
                        Para mantener tu sesión activa
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-dark-800/50 rounded-lg border border-dark-700">
                    <Shield className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-white">
                        Seguridad (CSRF Protection)
                      </strong>
                      <p className="text-sm text-dark-400 mt-1 m-0">
                        Para prevenir ataques
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-500/10 border-l-4 border-green-400 rounded-lg p-4">
                  <p className="text-dark-300 text-sm m-0">
                    <strong className="text-green-300">
                      No usamos cookies de marketing, publicidad o seguimiento
                    </strong>
                    . Las cookies de sesión se eliminan al cerrar sesión.
                  </p>
                </div>
              </div>
            </div>

            {/* SECCIÓN 6: RESPONSABLE */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-white mt-0 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 bg-gold-400/20 rounded-full text-gold-400 text-lg">
                  6
                </span>
                Responsable del Tratamiento
              </h2>

              <div className="pl-11">
                <div className="bg-dark-800/50 rounded-lg p-4 border border-dark-700">
                  <p className="text-dark-300 m-0">
                    Responsable:{" "}
                    <strong className="text-white">
                      Anass Carreau Allagui
                    </strong>
                  </p>
                  <p className="text-dark-300 mt-3 m-0">
                    Contacto para consultas legales o sobre tus datos:{" "}
                    <a
                      href="mailto:anasscaro@gmail.com"
                      className="text-gold-400 hover:text-gold-300 underline"
                    >
                      anasscaro@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* SECCIÓN 7: RETENCIÓN */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-white mt-0 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 bg-gold-400/20 rounded-full text-gold-400 text-lg">
                  7
                </span>
                Conservación de Datos
              </h2>

              <div className="pl-11 space-y-4">
                <div className="bg-blue-500/10 border-l-4 border-blue-400 rounded-lg p-4">
                  <h3 className="text-blue-300 font-bold text-sm uppercase mb-2 m-0">
                    Periodo de Conservación
                  </h3>
                  <div className="space-y-2">
                    <p className="text-dark-300 text-sm m-0">
                      <strong className="text-white">
                        📅 Datos personales:
                      </strong>{" "}
                      Foto y ID de Google se eliminan{" "}
                      <strong className="text-white">
                        3 días después de la gala
                      </strong>
                      .
                    </p>
                    <p className="text-dark-300 text-sm m-0">
                      <strong className="text-white">
                        📊 Resultados generales:
                      </strong>{" "}
                      Solo se conservan totales agregados (nombres de ganadores
                      y recuento de votos) sin información personal vinculada.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-gold-400 text-xl">🌍</span>
                  <p className="text-dark-300 m-0">
                    <strong className="text-white">Ubicación:</strong> Supabase
                    almacena todo en la{" "}
                    <strong className="text-gold-400">Unión Europea</strong>,
                    bajo protección RGPD completa.
                  </p>
                </div>
              </div>
            </div>

            {/* SECCIÓN 8: DERECHOS */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-white mt-0 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 bg-gold-400/20 rounded-full text-gold-400 text-lg">
                  8
                </span>
                Tus Derechos (RGPD)
              </h2>

              <div className="pl-11">
                <p className="text-dark-300 mb-4">
                  Conforme al RGPD, tienes derecho a:
                </p>

                <div className="grid md:grid-cols-2 gap-3 mb-4">
                  <div className="bg-dark-800/30 border border-dark-700 rounded-lg p-3">
                    <strong className="text-white text-sm">📋 Acceso</strong>
                    <p className="text-dark-400 text-xs mt-1 m-0">
                      Solicitar copia de tus datos
                    </p>
                  </div>

                  <div className="bg-dark-800/30 border border-dark-700 rounded-lg p-3">
                    <strong className="text-white text-sm">
                      ✏️ Rectificación
                    </strong>
                    <p className="text-dark-400 text-xs mt-1 m-0">
                      Corregir datos inexactos
                    </p>
                  </div>

                  <div className="bg-dark-800/30 border border-dark-700 rounded-lg p-3">
                    <strong className="text-white text-sm">🗑️ Supresión</strong>
                    <p className="text-dark-400 text-xs mt-1 m-0">
                      Eliminar completamente tus datos
                    </p>
                  </div>

                  <div className="bg-dark-800/30 border border-dark-700 rounded-lg p-3">
                    <strong className="text-white text-sm">⛔ Oposición</strong>
                    <p className="text-dark-400 text-xs mt-1 m-0">
                      Oponerte al tratamiento
                    </p>
                  </div>

                  <div className="bg-dark-800/30 border border-dark-700 rounded-lg p-3">
                    <strong className="text-white text-sm">
                      📦 Portabilidad
                    </strong>
                    <p className="text-dark-400 text-xs mt-1 m-0">
                      Recibir tus datos en formato estructurado
                    </p>
                  </div>

                  <div className="bg-dark-800/30 border border-dark-700 rounded-lg p-3">
                    <strong className="text-white text-sm">
                      🔒 Limitación
                    </strong>
                    <p className="text-dark-400 text-xs mt-1 m-0">
                      Restringir el tratamiento
                    </p>
                  </div>
                </div>

                <div className="bg-dark-800/50 border border-dark-700 rounded-lg p-4 mb-4">
                  <p className="text-dark-300 text-sm m-0">
                    Contacta en{" "}
                    <a
                      href="mailto:anasscaro@gmail.com"
                      className="text-gold-400 hover:text-gold-300 underline"
                    >
                      anasscaro@gmail.com
                    </a>{" "}
                    para ejercer tus derechos. Respuesta en máximo{" "}
                    <strong className="text-white">30 días</strong>.
                  </p>
                </div>

                <div className="bg-purple-500/10 border-l-4 border-purple-400 rounded-lg p-4">
                  <h3 className="text-purple-300 font-bold text-sm uppercase mb-2 m-0">
                    Derecho a Reclamar
                  </h3>
                  <p className="text-dark-300 text-sm m-0">
                    Puedes reclamar ante la{" "}
                    <strong className="text-white">AEPD</strong>:{" "}
                    <a
                      href="https://www.aepd.es"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-300 hover:text-purple-200 underline"
                    >
                      www.aepd.es
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* SECCIÓN 9: DECISIONES AUTOMATIZADAS */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-white mt-0 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 bg-gold-400/20 rounded-full text-gold-400 text-lg">
                  9
                </span>
                Decisiones Automatizadas
              </h2>

              <div className="pl-11">
                <div className="bg-dark-800/50 rounded-lg p-4 border border-dark-700">
                  <p className="text-dark-300 m-0">
                    <strong className="text-white">
                      No realizamos perfilado ni decisiones automatizadas
                    </strong>{" "}
                    sobre tus datos. Los votos se procesan de forma agregada
                    mediante conteo simple.
                  </p>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="mt-12 pt-8 border-t border-dark-700">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-gold-400">
                  <Shield className="w-6 h-6" />
                  <span className="font-bold text-lg">
                    Privacidad Garantizada · Votos Anónimos
                  </span>
                </div>
                <p className="text-dark-300 text-base max-w-2xl mx-auto">
                  <strong className="text-white">
                    Tu voto es 100% anónimo.
                  </strong>{" "}
                  Las políticas de seguridad impiden técnicamente vincular tu
                  identidad con tus elecciones. Google OAuth solo verifica que
                  eres real, nunca rastrea tus votos.
                </p>
                <p className="text-dark-500 text-xs">
                  © 2025 Moro TW Awards · Hecho con ❤️ para la comunidad
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
