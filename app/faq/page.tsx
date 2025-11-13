"use client"

import Navbar from "@/components/navbar"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
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

function FAQItemComponent({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 md:p-6 text-left hover:bg-card-bg transition flex items-center justify-between gap-4"
      >
        <span className="font-semibold text-sm md:text-base">{item.question}</span>
        <ChevronDown
          size={20}
          className={`text-accent flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="px-4 md:px-6 pb-4 md:pb-6 border-t border-border">
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mt-3">{item.answer}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      <Navbar />

      <section className="section-spacing container-wide">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center">Часто задаваемые вопросы</h1>
          <p className="text-center text-sm md:text-base text-muted-foreground mb-8 md:mb-12">Найдите ответы на популярные вопросы о Panda VPN</p>

          <div className="space-y-3 md:space-y-4">
            {faqItems.map((item, index) => (
              <FAQItemComponent
                key={index}
                item={item}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-12 md:mt-16 p-6 md:p-8 bg-card-bg border border-border rounded-lg text-center">
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Не нашли ответ?</h2>
            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
              Наша служба поддержки всегда готова помочь. Свяжитесь с нами через форму обратной связи.
            </p>
            <button className="btn-primary w-full sm:w-auto">Написать в поддержку</button>
          </div>
        </div>
      </section>
    </>
  )
}
