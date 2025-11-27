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
      <div className="pointer-events-none fixed -top-32 -left-32 w-[400px] h-[400px] bg-green-700/20 rounded-full blur-3xl opacity-40 z-0 animate-pulse" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[350px] h-[350px] bg-green-400/10 rounded-full blur-2xl opacity-25 z-0" />

      <section className="relative z-10 py-16 sm:py-20">
        <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4">
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center justify-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-bold text-gray-100 ring-1 ring-green-500/35">
              <HelpCircle size={16} className="text-emerald-300" />
              FAQ
            </div>
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Часто задаваемые вопросы о Panda VPN</h1>
            <p className="mx-auto max-w-2xl text-sm font-medium leading-relaxed text-gray-200 sm:text-base">
              Собрали ответы на самые популярные вопросы, чтобы вы быстрее начали пользоваться сервисом.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqItems.map((item, index) => (
              <FAQItem
                key={index}
                item={item}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>

          <FAQContactSection />
        </div>
      </section>
    </>
  )
}
