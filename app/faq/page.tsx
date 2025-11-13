"use client"

import Navbar from "@/components/navbar"
import { useState } from "react"
import { HelpCircle } from "lucide-react"
import FAQItem from "@/components/shared/faq-item"
import FAQContactSection from "@/components/shared/faq-contact-section"

interface FAQ {
  question: string
  answer: string
}

const faqItems: FAQ[] = [
  {
    question: "Что такое Panda VPN?",
    answer:
      "Panda VPN — это сервис виртуальной приватной сети, который шифрует ваше соединение и скрывает ваш IP адрес, обеспечивая анонимность и безопасность в интернете.",
  },
  {
    question: "Совместима ли Panda VPN с моим устройством?",
    answer:
      "Да, Panda VPN поддерживает все основные платформы: Windows, macOS, Linux, iOS и Android. Вы можете использовать один аккаунт на нескольких устройствах одновременно.",
  },
  {
    question: "Безопасно ли использовать Panda VPN?",
    answer:
      "Абсолютно. Мы используем военное шифрование AES-256, не ведем логи активности и регулярно проводим аудиты безопасности. Ваша приватность — наш приоритет.",
  },
  {
    question: "Какой тариф мне выбрать?",
    answer:
      'Выбор зависит от ваших потребностей. "Малыш Панда" отлично подойдет для базового использования. "Панда Pro" рекомендуется для активных пользователей. "Панда Премиум" — для профессионалов требующих максимальной производительности.',
  },
  {
    question: "Есть ли бесплатный пробный период?",
    answer:
      "Да, все новые пользователи получают 7 дней бесплатного доступа. Кроме того, первый месяц по любому тарифу доступен со скидкой 50%.",
  },
  {
    question: "Как отменить подписку?",
    answer:
      'Вы можете отменить подписку в любой момент из раздела "Мой аккаунт". Средства будут возвращены пропорционально оставшемуся времени подписки.',
  },
  {
    question: "Работает ли Panda VPN с видеосервисами?",
    answer:
      "Да, Panda VPN хорошо работает со всеми популярными видеосервисами. Однако некоторые платформы могут блокировать VPN соединения — в таких случаях мы постоянно работаем над обновлением серверов.",
  },
  {
    question: "Какой протокол используется?",
    answer:
      "Мы поддерживаем несколько протоколов: v2ray, WireGuard, OpenVPN и собственный протокол Panda Secure. Вы можете выбрать подходящий для вас.",
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      <Navbar />

      {/* Декоративные элементы */}
      <div className="pointer-events-none fixed -top-32 -left-32 w-[500px] h-[500px] bg-green-700/20 rounded-full blur-3xl opacity-50 z-0" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[400px] h-[400px] bg-green-400/10 rounded-full blur-2xl opacity-30 z-0" />

      <section className="section-spacing container-wide relative z-10">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-green-900/40 to-green-800/40 border border-green-600/50 rounded-full backdrop-blur-sm shadow-lg shadow-green-900/20">
              <HelpCircle size={20} className="text-green-400" />
              <span className="text-xs md:text-sm font-bold text-green-400 uppercase tracking-wider">FAQ</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-white via-green-200 to-green-400 bg-clip-text text-transparent">Часто задаваемые вопросы</h1>
            <p className="text-center text-sm md:text-base text-gray-300 leading-relaxed">Найдите ответы на популярные вопросы о Panda VPN</p>
          </div>

          <div className="space-y-4 md:space-y-5">
            {faqItems.map((item, index) => (
              <FAQItem
                key={index}
                item={item}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>

          {/* Contact Section */}
          <FAQContactSection />
        </div>
      </section>
    </>
  )
}
