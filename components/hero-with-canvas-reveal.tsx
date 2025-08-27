"use client"
import { Button } from "@/components/ui/button"
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect"
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials"
import { useState } from "react"
import Marquee from "react-fast-marquee"
import {
  IconBrandOpenai,
  IconBrandReact,
  IconBrandTypescript,
  IconBrandPython,
  IconBrandAws,
  IconBrandDocker,
  IconBrandMongodb,
  IconBrandStripe,
  IconBrandVercel,
  IconBrandGoogle,
  IconBrandWindows,
  IconBrandApple,
} from "@tabler/icons-react"

export default function HeroWithCanvasReveal() {
  const [activeAssistant, setActiveAssistant] = useState<number | null>(null)
  const [messages, setMessages] = useState<{ [key: number]: Array<{ role: "user" | "assistant"; content: string }> }>(
    {},
  )
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [showAIDemo, setShowAIDemo] = useState(false)
  const [aiResponse, setAiResponse] = useState("")

  const assistants = [
    {
      id: 1,
      name: "Alex",
      title: "Consultor de Negocios",
      specialty: "Estrategia empresarial y análisis financiero",
      color: "bg-blue-50 hover:bg-blue-100",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
      description: "Especialista en optimización de procesos empresariales y análisis de mercado",
      model: "gpt-4",
      systemPrompt:
        "Eres Alex, un consultor de negocios experto en estrategia empresarial y análisis financiero. Responde de manera profesional y enfócate en soluciones prácticas para empresas.",
    },
    {
      id: 2,
      name: "Dra. Sara",
      title: "Asesora de Salud",
      specialty: "Bienestar corporativo y salud ocupacional",
      color: "bg-amber-50 hover:bg-amber-100",
      textColor: "text-amber-600",
      borderColor: "border-amber-200",
      description: "Experta en programas de bienestar empresarial y salud mental",
      model: "gpt-4",
      systemPrompt:
        "Eres Dr. Sarah, una asesora de salud especializada en bienestar corporativo y salud ocupacional. Proporciona consejos médicos generales y enfócate en la salud en el trabajo.",
    },
    {
      id: 3,
      name: "Emma",
      title: "Ingeniera de Proyectos",
      specialty: "Gestión técnica y desarrollo de infraestructura",
      color: "bg-rose-50 hover:bg-rose-100",
      textColor: "text-rose-600",
      borderColor: "border-rose-200",
      description: "Especialista en gestión de proyectos tecnológicos y automatización",
      model: "gpt-4",
      systemPrompt:
        "Eres Emma, una ingeniera de proyectos especializada en gestión técnica y desarrollo de infraestructura. Ayuda con planificación de proyectos, tecnología y automatización.",
    },
    {
      id: 4,
      name: "Chef Marco",
      title: "Consultor Gastronómico",
      specialty: "Servicios de alimentación empresarial",
      color: "bg-emerald-50 hover:bg-emerald-100",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-200",
      description: "Experto en catering corporativo y nutrición empresarial",
      model: "gpt-4",
      systemPrompt:
        "Eres Chef Marco, un consultor gastronómico experto en servicios de alimentación empresarial. Ayuda con menús corporativos, catering y nutrición en el trabajo.",
    },
  ]

  const startListening = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "es-ES"

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setTranscript(transcript)
        generateAIResponse(transcript)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    }
  }

  const generateAIResponse = (input: string) => {
    setShowAIDemo(true)
    const responses = [
      `Entiendo que necesitas ayuda con "${input}". Como asistente IA, puedo analizar tu solicitud y conectarte con el especialista adecuado.`,
      `Basándome en tu consulta sobre "${input}", recomiendo hablar con nuestro equipo de expertos para una solución personalizada.`,
      `He procesado tu solicitud "${input}" y puedo sugerir varias opciones. ¿Te gustaría que profundice en algún aspecto específico?`,
    ]

    setTimeout(() => {
      setAiResponse(responses[Math.floor(Math.random() * responses.length)])
    }, 1500)
  }

  const handleSendMessage = async (assistantId: number, message: string) => {
    if (!message.trim()) return

    const assistant = assistants.find((a) => a.id === assistantId)
    if (!assistant) return

    const newMessages = [...(messages[assistantId] || []), { role: "user" as const, content: message }]

    // Actualizar mensajes inmediatamente para mostrar el mensaje del usuario
    setMessages((prev) => ({
      ...prev,
      [assistantId]: newMessages,
    }))

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          assistantId: assistantId,
          model: assistant.model,
          systemPrompt: assistant.systemPrompt,
          conversationHistory: messages[assistantId] || [],
        }),
      })

      if (!response.ok) {
        throw new Error("Error en la respuesta de la API")
      }

      const data = await response.json()

      // Agregar respuesta de la IA
      setMessages((prev) => ({
        ...prev,
        [assistantId]: [...newMessages, { role: "assistant", content: data.response }],
      }))
    } catch (error) {
      console.error("Error al comunicarse con la API:", error)

      const fallbackResponses = {
        1: "Como consultor de negocios, puedo ayudarte a analizar tu estrategia empresarial. ¿En qué área específica necesitas asesoramiento? (Nota: Usando respuesta de fallback - verifica la configuración de API)",
        2: "Desde mi experiencia en salud ocupacional, es importante considerar el bienestar de tus empleados. ¿Qué aspectos de salud corporativa te interesan? (Nota: Usando respuesta de fallback - verifica la configuración de API)",
        3: "En gestión de proyectos técnicos, la planificación es clave. ¿Qué tipo de infraestructura o automatización estás considerando? (Nota: Usando respuesta de fallback - verifica la configuración de API)",
        4: "Para servicios gastronómicos empresariales, podemos diseñar menús que mejoren la productividad. ¿Qué tipo de servicio de alimentación necesitas? (Nota: Usando respuesta de fallback - verifica la configuración de API)",
      }

      setMessages((prev) => ({
        ...prev,
        [assistantId]: [
          ...newMessages,
          { role: "assistant", content: fallbackResponses[assistantId as keyof typeof fallbackResponses] },
        ],
      }))
    }
  }

  const testimonials = [
    {
      quote:
        "Los asistentes virtuales de Master Chat transformaron completamente nuestra atención al cliente. Ahora podemos responder consultas 24/7 con una precisión del 95%. Nuestros clientes están más satisfechos que nunca.",
      name: "María González",
      designation: "CEO, TechCorp Solutions",
      src: "/professional-business-woman-ceo-smiling-confident.png",
    },
    {
      quote:
        "Implementar su asistente IA en nuestro sitio web aumentó nuestras conversiones en un 40%. La tecnología es impresionante y el soporte técnico excepcional. Definitivamente recomendamos sus servicios.",
      name: "Carlos Rodríguez",
      designation: "Director de Marketing, InnovateLab",
      src: "/professional-marketing-director-man-in-suit-smilin.png",
    },
    {
      quote:
        "La integración fue perfecta y el asistente virtual entiende perfectamente las consultas de nuestros pacientes. Ha reducido significativamente la carga de trabajo de nuestro personal administrativo.",
      name: "Dra. Ana Martínez",
      designation: "Directora Médica, HealthPlus Clinic",
      src: "/professional-female-doctor-in-white-coat-smiling-c.png",
    },
    {
      quote:
        "Su equipo desarrolló exactamente lo que necesitábamos. El asistente IA maneja consultas complejas sobre nuestros productos financieros con una precisión increíble. Excelente trabajo.",
      name: "Roberto Silva",
      designation: "CTO, FinanceFlow",
      src: "/professional-cto-technology-executive-man-glasses-.png",
    },
  ]

  const logoData = [
    { name: "OpenAI", icon: IconBrandOpenai, color: "text-green-600" },
    { name: "React", icon: IconBrandReact, color: "text-blue-500" },
    { name: "TypeScript", icon: IconBrandTypescript, color: "text-blue-600" },
    { name: "Python", icon: IconBrandPython, color: "text-yellow-500" },
    { name: "AWS", icon: IconBrandAws, color: "text-orange-500" },
    { name: "Docker", icon: IconBrandDocker, color: "text-blue-400" },
    { name: "MongoDB", icon: IconBrandMongodb, color: "text-green-500" },
    { name: "Stripe", icon: IconBrandStripe, color: "text-purple-600" },
    { name: "Vercel", icon: IconBrandVercel, color: "text-black" },
    { name: "Google", icon: IconBrandGoogle, color: "text-red-500" },
    { name: "Windows", icon: IconBrandWindows, color: "text-blue-600" },
    { name: "Apple", icon: IconBrandApple, color: "text-gray-800" },
  ]

  return (
    <div className="relative bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "AI Assistants",
            description: "Asistentes virtuales especializados con IA conversacional de última generación para empresas",
            url: "https://ai-assistants.com",
            logo: "https://ai-assistants.com/logo.png",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+1-555-123-4567",
              contactType: "customer service",
              email: "hola@masterchat.es",
            },
            address: {
              "@type": "PostalAddress",
              streetAddress: "123 Tech Street",
              addressLocality: "Silicon Valley",
              addressRegion: "CA",
              postalCode: "94000",
              addressCountry: "US",
            },
            sameAs: [
              "https://twitter.com/aiassistants",
              "https://linkedin.com/company/aiassistants",
              "https://youtube.com/aiassistants",
            ],
            offers: {
              "@type": "Service",
              name: "Asistentes Virtuales con IA",
              description:
                "Servicios de asistentes virtuales especializados con inteligencia artificial conversacional",
            },
          }),
        }}
      />

      <div className="fixed inset-0 z-0">
        <CanvasRevealEffect
          animationSpeed={0.25}
          colors={[
            [59, 130, 246], // Blue
            [168, 85, 247], // Purple
            [34, 197, 94], // Green
            [251, 191, 36], // Yellow
            [236, 72, 153], // Pink
          ]}
        />
      </div>

      <div className="fixed inset-0 bg-white/20 z-[1]"></div>

      <header
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl" aria-hidden="true"></div>
              <span className="text-gray-900 font-semibold text-xl">AI Assistants</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
              <a href="#inicio" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Inicio
              </a>
              <a href="#asistentes" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Asistentes
              </a>
              <a href="#servicios" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Servicios
              </a>
              <a href="#nosotros" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Nosotros
              </a>
              <a href="#tecnologia" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Tecnología
              </a>
              <a href="#contacto" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Contacto
              </a>
            </nav>

            <button
              className="md:hidden text-gray-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <nav className="flex flex-col space-y-2" role="navigation" aria-label="Mobile navigation">
                <a href="#inicio" className="text-gray-600 hover:text-gray-900 transition-colors py-2 font-medium">
                  Inicio
                </a>
                <a href="#asistentes" className="text-gray-600 hover:text-gray-900 transition-colors py-2 font-medium">
                  Asistentes
                </a>
                <a href="#servicios" className="text-gray-600 hover:text-gray-900 transition-colors py-2 font-medium">
                  Servicios
                </a>
                <a href="#nosotros" className="text-gray-600 hover:text-gray-900 transition-colors py-2 font-medium">
                  Nosotros
                </a>
                <a href="#tecnologia" className="text-gray-600 hover:text-gray-900 transition-colors py-2 font-medium">
                  Tecnología
                </a>
                <a href="#contacto" className="text-gray-600 hover:text-gray-900 transition-colors py-2 font-medium">
                  Contacto
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main>
        <section
          id="inicio"
          className="relative min-h-screen flex items-center justify-center pt-16 bg-transparent overflow-hidden z-10"
        >
          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="text-left space-y-8">
                <div className="space-y-6">
                  <div className="text-sm font-medium text-blue-600 tracking-wide uppercase">
                    Asistentes Virtuales con IA
                  </div>
                  <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-gray-900 tracking-tight leading-none font-sans">
                    Potencia tu
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-teal-500 via-green-500 to-purple-500 font-extrabold">
                      Empresa
                    </span>
                  </h1>
                </div>

                <p className="text-xl text-gray-600 leading-relaxed max-w-lg font-light">
                  Asistentes virtuales especializados con IA conversacional de última generación. Integra inteligencia
                  artificial en tu sitio web empresarial.
                </p>

                <div className="flex items-center space-x-6">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                    onClick={() => document.getElementById("asistentes")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    Probar Asistentes
                  </Button>

                  <button
                    onClick={startListening}
                    className={`flex items-center space-x-3 px-6 py-4 rounded-full border-2 transition-all duration-300 ${
                      isListening
                        ? "border-red-500 bg-red-50 text-red-600"
                        : "border-gray-300 hover:border-gray-400 text-gray-700"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${isListening ? "bg-red-500 animate-pulse" : "bg-gray-400"}`}
                    ></div>
                    <span className="font-medium">{isListening ? "Escuchando..." : "Habla con IA"}</span>
                  </button>
                </div>

                {showAIDemo && (
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 animate-fade-in">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm">🤖</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 mb-1">IA Assistant</div>
                        {transcript && <div className="text-sm text-gray-600 mb-2 italic">Escuché: "{transcript}"</div>}
                        <div className="text-gray-700">
                          {aiResponse || (
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="relative z-20">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Asistentes_virtuales-bGraJtuHGPoA8345gHgHzBDjafVeq4.webp"
                      alt="Asistentes virtuales especializados con IA - Equipo profesional de consultores digitales para empresas"
                      className="w-full max-w-md h-auto transition-all duration-700 ease-out hover:scale-105 hover:rotate-1 hover:-translate-y-2 cursor-pointer"
                      width="400"
                      height="400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-8 bg-transparent overflow-hidden z-10" aria-labelledby="trusted-brands">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <div className="text-sm font-medium text-blue-600 tracking-wide uppercase mb-4">
                Trusted by famous brands
              </div>
              <h2 id="trusted-brands" className="text-3xl font-bold text-black mb-4">
                Trusted by famous brands
              </h2>
            </div>

            <div className="mb-4">
              <Marquee
                gradient={true}
                gradientColor="white"
                gradientWidth={100}
                speed={50}
                pauseOnHover={true}
                className="py-2"
              >
                {logoData.map((logo, index) => (
                  <div key={index} className="mx-8 flex flex-col items-center justify-center group cursor-pointer">
                    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-all duration-500 hover:shadow-lg group-hover:scale-105 transform">
                      <div className="w-24 h-12 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <span className="text-gray-400 text-xs font-medium">{logo.name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </Marquee>
            </div>
          </div>
        </section>

        <section
          id="asistentes"
          className="relative py-12 bg-transparent overflow-hidden z-10"
          aria-labelledby="asistentes-heading"
        >
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="text-sm font-medium text-blue-600 tracking-wide uppercase mb-4">
                Asistentes Especializados
              </div>
              <h2 id="asistentes-heading" className="text-5xl font-bold text-gray-900 mb-6">
                Habla con nuestros{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-teal-500 via-green-500 to-purple-500 font-extrabold">
                  Expertos IA
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
                Cada asistente está entrenado en su área de especialización para brindarte la mejor experiencia
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {assistants.map((assistant) => (
                <div
                  key={assistant.id}
                  className={`group relative bg-white rounded-[2rem] p-8 border-2 transition-all duration-500 hover:transform hover:scale-105 cursor-pointer hover:shadow-xl overflow-hidden`}
                  style={{
                    border: `2px solid ${
                      assistant.id === 1
                        ? "#3b82f6" // blue-600 para Alex
                        : assistant.id === 2
                          ? "#f59e0b" // amber-600 para Dr. Sarah
                          : assistant.id === 3
                            ? "#ec4899" // rose-600 para Emma
                            : "#10b981" // emerald-600 para Chef Marco
                    }`,
                    borderRadius: "2rem",
                  }}
                  onClick={() => setActiveAssistant(activeAssistant === assistant.id ? null : assistant.id)}
                >
                  <div className="text-center relative z-10">
                    <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-[1.5rem] border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <div className="text-gray-400 text-sm font-medium">Imagen</div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{assistant.name}</h3>
                    <p className="text-sm font-medium text-gray-700 mb-3">{assistant.title}</p>
                    <p className="text-sm text-gray-600 mb-4">{assistant.specialty}</p>
                    <p className="text-xs text-gray-500 leading-relaxed mb-6">{assistant.description}</p>
                    <Button
                      size="sm"
                      className={`${assistant.textColor} bg-white hover:bg-gray-50 border border-gray-200 font-medium px-6 py-2 rounded-full transition-all duration-300 shadow-sm`}
                    >
                      {activeAssistant === assistant.id ? "Cerrar Chat" : "Iniciar Chat"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {activeAssistant && (
              <div className="max-w-4xl mx-auto">
                <div
                  className="bg-white rounded-3xl overflow-hidden shadow-xl"
                  style={{
                    border: `2px solid ${
                      activeAssistant === 1
                        ? "#3b82f6" // blue-600 para Alex
                        : activeAssistant === 2
                          ? "#f59e0b" // amber-600 para Dr. Sarah
                          : activeAssistant === 3
                            ? "#ec4899" // rose-600 para Emma
                            : "#10b981" // emerald-600 para Chef Marco
                    }`,
                  }}
                >
                  <div
                    className={`${assistants.find((a) => a.id === activeAssistant)?.color} p-6 border-b border-gray-200`}
                  >
                    <h3 className="text-gray-900 font-bold text-xl">
                      {assistants.find((a) => a.id === activeAssistant)?.name}
                    </h3>
                    <p className="text-gray-700 text-sm">
                      {assistants.find((a) => a.id === activeAssistant)?.specialty}
                    </p>
                  </div>

                  <div className="p-8">
                    <div className="h-64 overflow-y-auto mb-6 space-y-4">
                      {messages[activeAssistant]?.length === 0 || !messages[activeAssistant] ? (
                        <div className="text-center text-gray-500 py-8">
                          <p className="text-lg">
                            ¡Hola! Soy {assistants.find((a) => a.id === activeAssistant)?.name.split(" - ")[0]}. ¿En qué
                            puedo ayudarte hoy?
                          </p>
                        </div>
                      ) : (
                        messages[activeAssistant]?.map((msg, idx) => (
                          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`max-w-xs lg:max-w-md px-6 py-3 rounded-2xl ${
                                msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              {msg.content}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="flex space-x-3">
                      <input
                        type="text"
                        placeholder="Escribe tu mensaje..."
                        className={`flex-1 bg-gray-50 text-gray-900 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 border-2 transition-all duration-300`}
                        style={{
                          borderColor:
                            activeAssistant === 1
                              ? "#3b82f6" // blue-600 para Alex
                              : activeAssistant === 2
                                ? "#f59e0b" // amber-600 para Dr. Sarah
                                : activeAssistant === 3
                                  ? "#ec4899" // rose-600 para Emma
                                  : "#10b981", // emerald-600 para Chef Marco
                          focusRingColor:
                            activeAssistant === 1
                              ? "#3b82f6"
                              : activeAssistant === 2
                                ? "#f59e0b"
                                : activeAssistant === 3
                                  ? "#ec4899"
                                  : "#10b981",
                        }}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleSendMessage(activeAssistant, e.currentTarget.value)
                            e.currentTarget.value = ""
                          }
                        }}
                      />
                      <Button
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement
                          handleSendMessage(activeAssistant, input.value)
                          input.value = ""
                        }}
                        className="px-8 py-4 rounded-2xl font-medium text-white transition-all duration-300 self-center"
                        style={{
                          backgroundColor:
                            activeAssistant === 1
                              ? "#3b82f6" // blue-600 para Alex
                              : activeAssistant === 2
                                ? "#f59e0b" // amber-600 para Dr. Sarah
                                : activeAssistant === 3
                                  ? "#ec4899" // rose-600 para Emma
                                  : "#10b981", // emerald-600 para Chef Marco
                        }}
                      >
                        Enviar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section
          id="servicios"
          className="relative py-8 bg-transparent overflow-hidden z-10"
          aria-labelledby="servicios-heading"
        >
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="text-sm font-medium text-blue-600 tracking-wide uppercase mb-4">Nuestros Servicios</div>
              <h2 id="servicios-heading" className="text-5xl font-bold text-gray-900 mb-6">
                Soluciones{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-teal-500 via-green-500 to-purple-500 font-extrabold">
                  Integrales
                </span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-6 font-light max-w-2xl mx-auto">
                Desde asistentes virtuales hasta desarrollo web completo
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white rounded-3xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Asistentes Virtuales IA</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Asistentes conversacionales especializados que entienden el contexto de tu negocio y brindan
                  respuestas precisas a tus clientes 24/7.
                </p>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Procesamiento de lenguaje natural avanzado
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Integración con sistemas existentes
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Análisis de sentimientos en tiempo real
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Desarrollo Web Completo</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Sitios web modernos y aplicaciones empresariales con tecnologías de vanguardia, optimizados para
                  rendimiento y SEO.
                </p>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    React, Next.js y tecnologías modernas
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Diseño responsive y accesible
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Optimización SEO y rendimiento
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Integración y Automatización</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Conectamos tus sistemas existentes con IA para automatizar procesos y mejorar la eficiencia
                  operacional de tu empresa.
                </p>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    APIs y webhooks personalizados
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Automatización de flujos de trabajo
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Sincronización de datos en tiempo real
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-12 bg-transparent overflow-hidden z-10" aria-labelledby="testimonios-heading">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="text-sm font-medium text-blue-600 tracking-wide uppercase mb-4">Testimonios</div>
              <h2 id="testimonios-heading" className="text-5xl font-bold text-gray-900 mb-6">
                Lo que dicen nuestros{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-teal-500 via-green-500 to-purple-500 font-extrabold">
                  Clientes
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
                Empresas de todos los sectores confían en nuestros asistentes virtuales para transformar su atención al
                cliente
              </p>
            </div>

            <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
          </div>
        </section>

        <section
          id="contacto"
          className="relative py-12 bg-transparent overflow-hidden z-10"
          aria-labelledby="contacto-heading"
        >
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="contacto-heading" className="sr-only">
              Información de contacto
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div className="space-y-10">
                <div className="flex items-start space-x-6">
                  <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Email</h3>
                    <p className="text-gray-600 font-light">contacto@aiassistants.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Teléfono</h3>
                    <p className="text-gray-600 font-light">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-14 h-14 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Oficina</h3>
                    <p className="text-gray-600 font-light">123 Tech Street, Silicon Valley, CA 94000</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-10 border border-gray-200">
                <form className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-gray-900 font-medium mb-3">Nombre</label>
                      <input
                        type="text"
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-900 font-medium mb-3">Email</label>
                      <input
                        type="email"
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-900 font-medium mb-3">Empresa</label>
                    <input
                      type="text"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nombre de tu empresa"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-900 font-medium mb-3">Mensaje</label>
                    <textarea
                      rows={4}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Cuéntanos sobre tu proyecto..."
                    ></textarea>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-2xl text-lg transition-all duration-300">
                    Enviar Mensaje
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative bg-gray-900 border-t border-gray-800 z-10" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl"></div>
                <span className="text-white font-semibold text-xl">AI Assistants</span>
              </div>
              <p className="text-gray-300 leading-relaxed mb-8 max-w-md font-light">
                Tu equipo de asistentes de IA que...
                <br />
                ¡Hablan entre sí!
              </p>
              <p className="text-yellow-400 text-sm font-light">© 2025 AI Assistants. Todos los derechos reservados.</p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-6">Producto</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors font-light">
                    Características
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors font-light">
                    Precios
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors font-light">
                    Lista de Espera
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-6">Conecta</h3>
              <div className="flex space-x-4 mb-6">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v11.452zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24 5.367 18.641.001.012.017 0 0 0 0 0 0" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.072-4.358-.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.013 3.663.07 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.69.073 4.949.073zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.013 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.69.073 4.949.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
              <p className="text-yellow-400 text-sm font-light mb-4">hola@masterchat.es</p>
              <div className="space-y-2">
                <a href="#" className="text-gray-400 hover:text-gray-300 text-sm transition-colors font-light block">
                  Términos de Servicio
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-300 text-sm transition-colors font-light block">
                  Política de Privacidad
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
