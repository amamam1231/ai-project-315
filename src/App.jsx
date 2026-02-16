import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const iconComponents = {}

// Web3Forms Hook
const useFormHandler = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e, accessKey) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsError(false)

    const formData = new FormData(e.target)
    formData.append('access_key', accessKey)

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setIsSuccess(true)
        e.target.reset()
      } else {
        setIsError(true)
        setErrorMessage(data.message || 'Щось пішло не так')
      }
    } catch (error) {
      setIsError(true)
      setErrorMessage('Помилка мережі. Спробуйте ще раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setIsSuccess(false)
    setIsError(false)
    setErrorMessage('')
  }

  return { isSubmitting, isSuccess, isError, errorMessage, handleSubmit, resetForm }
}

// Gallery Lightbox Component
const GalleryLightbox = ({ images, currentIndex, onClose, onNext, onPrev }) => {
  if (currentIndex === null) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/95 backdrop-blur-xl p-4"
        onClick={onClose}
      >
        <button
          className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
          onClick={onClose}
        >
          <SafeIcon name="x" size={32} />
        </button>

        <button
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors p-2"
          onClick={(e) => { e.stopPropagation(); onPrev() }}
        >
          <SafeIcon name="chevron-left" size={40} />
        </button>

        <button
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors p-2"
          onClick={(e) => { e.stopPropagation(); onNext() }}
        >
          <SafeIcon name="chevron-right" size={40} />
        </button>

        <motion.img
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          src={images[currentIndex].url}
          alt={images[currentIndex].alt}
          className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Accordion Component
const Accordion = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-amber-200/50 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left group"
      >
        <span className="font-serif text-lg md:text-xl text-stone-800 group-hover:text-amber-700 transition-colors">
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <SafeIcon
            name="chevron-down"
            size={20}
            className="text-amber-600"
          />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-stone-600 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function App() {
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [activePriceFilter, setActivePriceFilter] = useState('all')
  const [scrolled, setScrolled] = useState(false)
  const { isSubmitting, isSuccess, isError, errorMessage, handleSubmit, resetForm } = useFormHandler()

  const ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY' // Replace with your Web3Forms Access Key from https://web3forms.com

  // Gallery images from user
  const galleryImages = [
    {
      url: "https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_546123314/user-photo-1.jpg",
      alt: "Перманентний макіяж губ - насичений колір",
      category: "lips"
    },
    {
      url: "https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_546123314/user-photo-2.jpg",
      alt: "Пудрове напилення брів - природній вигляд",
      category: "brows"
    },
    {
      url: "https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_546123314/user-photo-3.jpg",
      alt: "Перманент очей - міжвійка з розтушуванням",
      category: "eyes"
    },
    {
      url: "https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_546123314/user-photo-4.jpg",
      alt: "Контурна пластика губ - природній об'єм",
      category: "lips"
    }
  ]

  // Services data
  const services = [
    {
      id: 'brows',
      title: 'Пудрове напилення брів',
      price: '3000 ₴',
      duration: '2-2.5 години',
      description: 'Сучасна техніка перманентного макіяжу, що створює ефект легкого макіяжу пудрою. Ідеально підходить для тих, хто прагне доглянутого вигляду брів без щоденного фарбування.',
      process: [
        'Консультація та підбір форми та кольору',
        'Анестезія для комфортної процедури',
        'Створення ескізу з урахуванням типу обличчя',
        'Нанесення пігменту методом піксельного напилення',
        'Інструктаж по догляду за шкірою'
      ],
      indications: ['Рідкісні або нерівномірні брови', 'Бажання скоригувати форму', 'Алопеція брів', 'Економія часу на макіяж'],
      contraindications: ['Цукровий діабет в стадії декомпенсації', 'Вагітність та лактація', 'Герпес в активній фазі', 'Псоріаз та екзема в зоні процедури', 'Онкологічні захворювання']
    },
    {
      id: 'lips',
      title: 'Перманентний макіяж губ',
      price: '3000 ₴',
      duration: '2-3 години',
      description: 'Створення ідеального контуру та наповнення кольором губ. Техніка дозволяє візуально збільшити об\'єм, скоригувати асиметрію та надати губам свіжий, доглянутий вигляд.',
      process: [
        'Детальна консультація щодо бажаного результату',
        'Підбір відтінку з урахуванням коліротипу',
        'Анестезія для безболісності процедури',
        'Нанесення пігменту за обраною технікою',
        'Надання рекомендацій по загоєнню'
      ],
      indications: ['Блідий колір губ', 'Асиметрія контуру', 'Нерівні губи', 'Бажання уникнути щоденного фарбування'],
      contraindications: ['Герпес в активній фазі', 'Вагітність та лактація', 'Захворювання крові', 'Схильність до келоїдних рубців', 'Ангіна та ГРВІ в гострій фазі']
    },
    {
      id: 'eyes-classic',
      title: 'Перманент очей - Міжвійка',
      price: '2500 ₴',
      duration: '1.5-2 години',
      description: 'Класична техніка підкреслення лінії росту вій. Створює ефект густих, глибоких очей без явного макіяжу. Ідеальне рішення для щоденного доглянутого вигляду.',
      process: [
        'Підбір товщини лінії',
        'Анестезія повіки',
        'Нанесення пігменту між віями',
        'Корекція форми за необхідності'
      ],
      indications: ['Рідкісні або світлі вії', 'Бажання візуально збільшити очі', 'Чутливість до декоративної косметики'],
      contraindications: ['Захворювання очей', 'Вагітність', 'Підвищена сльозотеча', 'Синдром сухого ока']
    },
    {
      id: 'eyes-shadow',
      title: 'Перманент очей - Міжвійка з розтушуванням',
      price: '3000 ₴',
      duration: '2-2.5 години',
      description: 'Техніка поєднує чітку міжвійку з м\'яким тіневим ефектом. Створює глибину та виразність погляду, імітує легкий денний макіяж.',
      process: [
        'Визначення зони розтушування',
        'Підбір насиченості кольору',
        'Анестезія',
        'Нанесення основної лінії та тіневого ефекту'
      ],
      indications: ['Вікові зміни повіки', 'Бажання мати готовий макіяж', 'Асиметрія повік'],
      contraindications: ['Захворювання століття', 'Опущення повіки', 'Склерит та кон\'юнктивіт']
    },
    {
      id: 'eyes-velvet',
      title: 'Перманент очей - Вуальна стрілочка',
      price: '3500 ₴',
      duration: '2.5-3 години',
      description: 'Розкішна техніка створення м\'якої, розмитої стрілки. Ефект нагадує вуаль - легкий, повітряний, граціозний. Підходить для тих, хто любить виразний, але не агресивний макіяж.',
      process: [
        'Ескіз майбутньої стрілки',
        'Погодження форми та насиченості',
        'Анестезія',
        'Багатошарове нанесення пігменту',
        'Створення градієнту та вуального ефекту'
      ],
      indications: ['Бажання мати готову стрілку', 'Нерівні очі', 'Вікові зміни зовнішнього кутика ока'],
      contraindications: ['Вікові зміни шкіри з втратою еластичності', 'Захворювання очей', 'Вагітність та лактація']
    },
    {
      id: 'botox',
      title: 'Ботокс (Ботулінотерапія)',
      price: 'від 2500 ₴',
      duration: '30-45 хвилин',
      description: 'Ін'єкції ботулінотоксину для розгладження мімічних зморшок та корекції форми обличчя. Безпечна процедура з вираженим омолоджуючим ефектом.',
      process: [
        'Консультація та аналіз міміки',
        'Маркіровка зон ін\'єкцій',
        'Обробка шкіри антисептиком',
        'Введення препарату тонкими голками',
        'Рекомендації по догляду'
      ],
      indications: ['Мімічні зморшки на лобі', 'Гусячі лапки', 'Кисетні зморшки', 'Корекція форми обличчя', 'Гіпергідроз'],
      contraindications: ['Вагітність та лактація', 'Неврологічні захворювання', 'Підвищена чутливість до препарату', 'Запальні процеси в зоні ін\'єкцій', 'Прийом антикоагулянтів']
    },
    {
      id: 'contour',
      title: 'Контурна пластика губ',
      price: 'від 3500 ₴',
      duration: '45-60 хвилин',
      description: 'Введення філерів на основі гіалуронової кислоти для збільшення об\'єму, корекції контуру та зволоження губ. Миттєвий результат без хірургічного втручання.',
      process: [
        'Консультація щодо бажаного результату',
        'Анестезія (крем або ін\'єкційна)',
        'Введення філера методом лінійної або точкової техніки',
        'Масаж для розподілу препарату',
        'Оцінка результату'
      ],
      indications: ['Бажання збільшити об\'єм губ', 'Асиметрія', 'Вікове зменшення об\'єму', 'Сухість та лущення', 'Бажання підкреслити контури'],
      contraindications: ['Вагітність та лактація', 'Аутоімунні захворювання', 'Герпес в активній фазі', 'Онкологічні захворювання', 'Схильність до алергічних реакцій']
    },
    {
      id: 'biorev',
      title: 'Біоревіталізація',
      price: 'від 3000 ₴',
      duration: '45-60 хвилин',
      description: 'Ін\'єкції препаратів гіалуронової кислоти для глибокого зволоження, покращення еластичності та тонусу шкіри. Повернення шкірі молодого, здорового сяйва.',
      process: [
        'Діагностика стану шкіри',
        'Підбір препарату',
        'Анестезія',
        'Введення препарату методом мезотерапії або біоревіталізації',
        'Нанесення заспокійливої маски'
      ],
      indications: ['Зневоднення шкіри', 'Втрата еластичності', 'Мімічні зморшки', 'Тьмяний колір обличчя', 'Розширені пори', 'Фотостаріння'],
      contraindications: ['Вагітність та лактація', 'Запальні процеси шкіри', 'Аутоімунні захворювання', 'Онкологічні захворювання', 'Порушення згортання крові']
    }
  ]

  // Price filtering
  const filteredServices = activePriceFilter === 'all'
    ? services
    : services.filter(s => s.id.includes(activePriceFilter) ||
        (activePriceFilter === 'pmu' && ['brows', 'lips', 'eyes-classic', 'eyes-shadow', 'eyes-velvet'].includes(s.id)) ||
        (activePriceFilter === 'cosmetology' && ['botox', 'contour', 'biorev'].includes(s.id)))

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 overflow-x-hidden">
      {/* Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'bg-stone-50/90 backdrop-blur-xl shadow-lg shadow-stone-900/5' : 'bg-transparent'}`}>
        <nav className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between mobile-safe-container">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 gold-gradient rounded-full flex items-center justify-center">
              <SafeIcon name="sparkles" size={20} className="text-white" />
            </div>
            <span className={`font-serif text-2xl font-bold transition-colors ${scrolled ? 'text-stone-900' : 'text-stone-900'}`}>
              Beauty<span className="gold-text">Studio</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Галерея', 'Послуги', 'Ціни', 'Процедури', 'Контакти'].map((item, idx) => {
              const ids = ['gallery', 'services', 'prices', 'details', 'contact']
              return (
                <button
                  key={item}
                  onClick={() => scrollToSection(ids[idx])}
                  className={`text-sm font-medium transition-colors hover:text-amber-600 ${scrolled ? 'text-stone-700' : 'text-stone-700'}`}
                >
                  {item}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => scrollToSection('contact')}
            className="hidden md:flex btn-gold px-6 py-2.5 rounded-full text-sm font-semibold items-center gap-2"
          >
            <SafeIcon name="calendar" size={16} />
            Записатись
          </button>

          <button className="md:hidden p-2 text-stone-800">
            <SafeIcon name="menu" size={24} />
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 pb-16 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50/30" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-100/20 to-transparent" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-rose-100/20 rounded-full blur-3xl" />

        <div className="container mx-auto relative z-10 mobile-safe-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100/50 rounded-full text-amber-800 text-sm font-medium mb-6">
                <SafeIcon name="award" size={16} />
                Професійний майстер з 5-річним досвідом
              </div>

              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-stone-900 leading-tight mb-6">
                Перманентний макіяж <span className="gold-text italic">люкс</span> рівня
              </h1>

              <p className="text-stone-600 text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
                Створюю ідеальні брови, губи та стрілки. Косметологічні послуги для вашої краси та молодості.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => scrollToSection('contact')}
                  className="btn-gold px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2"
                >
                  <SafeIcon name="calendar-check" size={20} />
                  Безкоштовна консультація
                </button>
                <button
                  onClick={() => scrollToSection('gallery')}
                  className="px-8 py-4 rounded-full font-semibold text-lg border-2 border-stone-300 hover:border-amber-400 text-stone-700 hover:text-amber-700 transition-all flex items-center justify-center gap-2"
                >
                  <SafeIcon name="images" size={20} />
                  Переглянути роботи
                </button>
              </div>

              <div className="mt-12 flex items-center gap-8">
                <div>
                  <div className="font-serif text-3xl font-bold gold-text">500+</div>
                  <div className="text-stone-500 text-sm">Задоволених клієнток</div>
                </div>
                <div className="w-px h-12 bg-stone-200" />
                <div>
                  <div className="font-serif text-3xl font-bold gold-text">5</div>
                  <div className="text-stone-500 text-sm">Років досвіду</div>
                </div>
                <div className="w-px h-12 bg-stone-200" />
                <div>
                  <div className="font-serif text-3xl font-bold gold-text">100%</div>
                  <div className="text-stone-500 text-sm">Безпечні матеріали</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden luxury-shadow">
                <img
                  src={galleryImages[0].url}
                  alt="Перманентний макіяж"
                  className="w-full h-[500px] md:h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 to-transparent" />
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 luxury-shadow hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <SafeIcon name="check-circle" size={24} className="text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-stone-900">Сертифікований майстер</div>
                    <div className="text-sm text-stone-500">Міжнародні дипломи</div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 luxury-shadow hidden md:block">
                <div className="flex items-center gap-2 text-amber-500">
                  <SafeIcon name="star" size={20} fill="currentColor" />
                  <SafeIcon name="star" size={20} fill="currentColor" />
                  <SafeIcon name="star" size={20} fill="currentColor" />
                  <SafeIcon name="star" size={20} fill="currentColor" />
                  <SafeIcon name="star" size={20} fill="currentColor" />
                  <span className="text-stone-700 font-semibold ml-1">4.9</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 md:py-32 px-4 md:px-6 bg-stone-100/50">
        <div className="container mx-auto mobile-safe-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 mb-4">
              Галерея <span className="gold-text italic">робіт</span>
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Реальні фото робіт до та після процедур. Кожен клієнт отримує індивідуальний підхід та результат, що відповідає особливостям зовнішності.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {galleryImages.map((image, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative group cursor-pointer overflow-hidden rounded-2xl ${idx === 0 ? 'col-span-2 row-span-2' : ''}`}
                onClick={() => setLightboxIndex(idx)}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-medium text-sm md:text-base">{image.alt}</p>
                  <div className="flex items-center gap-2 mt-2 text-amber-300 text-sm">
                    <SafeIcon name="zoom-in" size={16} />
                    <span>Натисніть для збільшення</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section id="services" className="py-20 md:py-32 px-4 md:px-6">
        <div className="container mx-auto mobile-safe-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 mb-4">
              Послуги <span className="gold-text italic">студії</span>
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Повний спектр послуг з перманентного макіяжу та косметології для вашої природної краси
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.slice(0, 6).map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group glass-card rounded-3xl p-6 md:p-8 hover:shadow-2xl hover:shadow-amber-900/10 transition-all duration-500 border border-amber-100/50 hover:border-amber-300/50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 gold-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-amber-600/20 group-hover:scale-110 transition-transform">
                    <SafeIcon
                      name={service.id.includes('eyes') ? 'eye' : service.id === 'brows' ? 'scan-face' : service.id === 'lips' || service.id === 'contour' ? 'smile' : service.id === 'botox' ? 'activity' : 'droplets'}
                      size={28}
                      className="text-white"
                    />
                  </div>
                  <span className="font-serif text-2xl font-bold gold-text">{service.price}</span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-stone-900 mb-3 group-hover:text-amber-700 transition-colors">
                  {service.title}
                </h3>

                <p className="text-stone-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {service.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-stone-500 mb-4">
                  <span className="flex items-center gap-1">
                    <SafeIcon name="clock" size={14} />
                    {service.duration}
                  </span>
                </div>

                <button
                  onClick={() => scrollToSection('details')}
                  className="w-full py-3 rounded-xl border border-amber-300 text-amber-700 font-medium hover:bg-amber-50 transition-colors flex items-center justify-center gap-2"
                >
                  Детальніше
                  <SafeIcon name="arrow-right" size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Price Table Section */}
      <section id="prices" className="py-20 md:py-32 px-4 md:px-6 bg-stone-900 text-white">
        <div className="container mx-auto mobile-safe-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Прайс <span className="gold-text italic">лист</span>
            </h2>
            <p className="text-stone-400 max-w-2xl mx-auto">
              Прозорі ціни на всі послуги. Без прихованих платежів та сюрпризів.
            </p>
          </motion.div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { id: 'all', label: 'Всі послуги' },
              { id: 'pmu', label: 'Перманентний макіяж' },
              { id: 'cosmetology', label: 'Косметологія' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActivePriceFilter(filter.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activePriceFilter === filter.id
                    ? 'gold-gradient text-white'
                    : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePriceFilter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {filteredServices.map((service, idx) => (
                  <div
                    key={service.id}
                    className="group flex items-center justify-between p-6 rounded-2xl bg-stone-800/50 border border-stone-700 hover:border-amber-600/50 transition-all hover:bg-stone-800"
                  >
                    <div className="flex-1">
                      <h3 className="font-serif text-xl md:text-2xl font-semibold mb-1 group-hover:text-amber-400 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-stone-400 text-sm hidden md:block">{service.duration}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-serif text-2xl md:text-3xl font-bold gold-text">
                        {service.price}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 p-6 rounded-2xl bg-amber-900/20 border border-amber-600/30">
              <div className="flex items-start gap-4">
                <SafeIcon name="info" size={24} className="text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-amber-300 mb-2">Важлива інформація</h4>
                  <p className="text-stone-400 text-sm leading-relaxed">
                    Вартість корекції (виконується через 4-6 тижнів після основної процедури) становить 50% від вартості послуги.
                    При записі на процедуру вноситься передплата в розмірі 500 ₴, яка входить у вартість послуги.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Services & Contraindications */}
      <section id="details" className="py-20 md:py-32 px-4 md:px-6 bg-gradient-to-b from-stone-50 to-amber-50/30">
        <div className="container mx-auto mobile-safe-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Process */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 mb-8">
                Як проходить <span className="gold-text italic">процедура</span>
              </h2>

              <div className="space-y-6">
                {[
                  {
                    step: '01',
                    title: 'Консультація',
                    desc: 'Обговорюємо бажаний результат, підбираємо форму та колір з урахуванням ваших особливостей.'
                  },
                  {
                    step: '02',
                    title: 'Анестезія',
                    desc: 'Наносимо спеціальний крем для комфортного проведення процедури без болю.'
                  },
                  {
                    step: '03',
                    title: 'Ескіз',
                    desc: 'Малюємо ескіз за допомогою спеціальних олівців для погодження форми.'
                  },
                  {
                    step: '04',
                    title: 'Процедура',
                    desc: 'Виконуємо роботу стерильними одноразовими інструментами та преміальними пігментами.'
                  },
                  {
                    step: '05',
                    title: 'Інструктаж',
                    desc: 'Надаємо детальні рекомендації по догляду для ідеального загоєння.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 gold-gradient rounded-xl flex items-center justify-center text-white font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-stone-900 mb-1">{item.title}</h3>
                      <p className="text-stone-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Contraindications */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 mb-8">
                Протипокази та <span className="gold-text italic">покази</span>
              </h2>

              <div className="glass-card rounded-3xl p-6 md:p-8 mb-6">
                <Accordion title="Загальні протипокази" defaultOpen={true}>
                  <ul className="space-y-2">
                    {[
                      'Вагітність та період лактації',
                      'Цукровий діабет (декомпенсована стадія)',
                      'Онкологічні захворювання',
                      'Гострі інфекційні захворювання, висока температура',
                      'Герпес в активній фазі (для губ)',
                      'Псоріаз, екзема, дерматит в зоні процедури',
                      'Схильність до келоїдних рубців',
                      'Прийом антикоагулянтів, розлади згортання крові',
                      'Епілепсія',
                      'Алкогольне сп\'яніння'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <SafeIcon name="x-circle" size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Accordion>

                <Accordion title="Покази до процедур">
                  <ul className="space-y-2">
                    {[
                      'Бажання скорегувати форму брів, губ, очей',
                      'Нерівномірний ріст волосся в бровах',
                      'Блідий колір губ або асиметрія',
                      'Алопеція брів',
                      'Вікові зміни контуру губ',
                      'Рідкісні або світлі вії',
                      'Мімічні зморшки (для косметології)',
                      'Втрата пружності шкіри'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <SafeIcon name="check-circle" size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Accordion>

                <Accordion title="Підготовка до процедури">
                  <ul className="space-y-2 text-sm">
                    <li>• За 2-3 дні до процедури приймайте противірусні препарати (для губ)</li>
                    <li>• Уникайте алкоголю за 24 години</li>
                    <li>• Не вживайте каву та енергетики в день процедури</li>
                    <li>• Повідомте про всі захворювання та прийом ліків</li>
                    <li>• Не фарбуйте волосся/брови за тиждень до процедури</li>
                  </ul>
                </Accordion>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-32 px-4 md:px-6">
        <div className="container mx-auto mobile-safe-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 mb-6">
                Записатись на <span className="gold-text italic">консультацію</span>
              </h2>
              <p className="text-stone-600 text-lg mb-8 leading-relaxed">
                Залиште свої контактні дані, і я зв'яжусь з вами найближчим часом для узгодження зручного часу візиту.
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 gold-gradient rounded-xl flex items-center justify-center">
                    <SafeIcon name="phone" size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-stone-500">Телефон</div>
                    <a href="tel:+380991234567" className="text-stone-900 font-semibold hover:text-amber-600 transition-colors">+38 (099) 123-45-67</a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 gold-gradient rounded-xl flex items-center justify-center">
                    <SafeIcon name="map-pin" size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-stone-500">Адреса</div>
                    <div className="text-stone-900 font-semibold">м. Київ, вул. Красова, 15</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 gold-gradient rounded-xl flex items-center justify-center">
                    <SafeIcon name="clock" size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-stone-500">Графік роботи</div>
                    <div className="text-stone-900 font-semibold">Пн-Сб: 9:00 - 20:00</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  <SafeIcon name="instagram" size={24} />
                </a>
                <a
                  href="https://t.me/username"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  <SafeIcon name="send" size={24} />
                </a>
                <a
                  href="viber://chat?number=+380991234567"
                  className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  <SafeIcon name="message-circle" size={24} />
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="glass-card rounded-3xl p-6 md:p-8 luxury-shadow">
                <AnimatePresence mode="wait">
                  {!isSuccess ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={(e) => handleSubmit(e, ACCESS_KEY)}
                      className="space-y-6"
                    >
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-2">Ваше ім'я</label>
                          <input
                            type="text"
                            name="name"
                            required
                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-400 transition-colors"
                            placeholder="Анна"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-2">Телефон</label>
                          <input
                            type="tel"
                            name="phone"
                            required
                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-400 transition-colors"
                            placeholder="+38 (0XX) XXX-XX-XX"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">Оберіть послугу</label>
                        <select
                          name="service"
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-400 transition-colors"
                        >
                          <option value="">Оберіть послугу...</option>
                          <option value="brows">Пудрове напилення брів</option>
                          <option value="lips">Перманентний макіяж губ</option>
                          <option value="eyes">Перманент очей</option>
                          <option value="botox">Ботокс</option>
                          <option value="contour">Контурна пластика губ</option>
                          <option value="biorev">Біоревіталізація</option>
                          <option value="consult">Консультація</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">Повідомлення</label>
                        <textarea
                          name="message"
                          rows="4"
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-400 transition-colors resize-none"
                          placeholder="Опишіть ваші побажання або питання..."
                        ></textarea>
                      </div>

                      {isError && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                          {errorMessage}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-gold py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Відправлення...
                          </>
                        ) : (
                          <>
                            <SafeIcon name="send" size={20} />
                            Відправити заявку
                          </>
                        )}
                      </button>

                      <p className="text-xs text-stone-500 text-center">
                        Натискаючи кнопку, ви погоджуєтесь з політикою конфіденційності
                      </p>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center py-12"
                    >
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <SafeIcon name="check-circle" size={40} className="text-green-600" />
                      </div>
                      <h3 className="font-serif text-3xl font-bold text-stone-900 mb-4">
                        Заявку відправлено!
                      </h3>
                      <p className="text-stone-600 mb-8">
                        Дякую за звернення! Я зв'яжусь з вами найближчим часом.
                      </p>
                      <button
                        onClick={resetForm}
                        className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
                      >
                        Відправити ще одну заявку
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-12 px-4 md:px-6 telegram-safe-bottom">
        <div className="container mx-auto mobile-safe-container">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 gold-gradient rounded-full flex items-center justify-center">
                  <SafeIcon name="sparkles" size={20} className="text-white" />
                </div>
                <span className="font-serif text-2xl font-bold">
                  Beauty<span className="gold-text">Studio</span>
                </span>
              </div>
              <p className="text-stone-400 text-sm leading-relaxed max-w-sm">
                Професійний перманентний макіяж та косметологічні послуги преміум-класу. Індивідуальний підхід до кожної клієнтки.
              </p>
            </div>

            <div>
              <h4 className="font-serif text-lg font-semibold mb-4">Посилання</h4>
              <ul className="space-y-2 text-sm text-stone-400">
                <li><button onClick={() => scrollToSection('gallery')} className="hover:text-amber-400 transition-colors">Галерея</button></li>
                <li><button onClick={() => scrollToSection('services')} className="hover:text-amber-400 transition-colors">Послуги</button></li>
                <li><button onClick={() => scrollToSection('prices')} className="hover:text-amber-400 transition-colors">Ціни</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-amber-400 transition-colors">Контакти</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-lg font-semibold mb-4">Контакти</h4>
              <ul className="space-y-2 text-sm text-stone-400">
                <li>+38 (099) 123-45-67</li>
                <li>м. Київ, вул. Красова, 15</li>
                <li>Пн-Сб: 9:00 - 20:00</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-stone-500 text-sm">
              © 2024 BeautyStudio. Всі права захищені.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-stone-800 rounded-lg flex items-center justify-center text-stone-400 hover:bg-amber-600 hover:text-white transition-all">
                <SafeIcon name="instagram" size={18} />
              </a>
              <a href="https://t.me/username" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-stone-800 rounded-lg flex items-center justify-center text-stone-400 hover:bg-sky-500 hover:text-white transition-all">
                <SafeIcon name="send" size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <GalleryLightbox
          images={galleryImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex((prev) => (prev + 1) % galleryImages.length)}
          onPrev={() => setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
        />
      )}

      {/* Fixed CTA Button for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden z-30">
        <button
          onClick={() => scrollToSection('contact')}
          className="w-14 h-14 gold-gradient rounded-full flex items-center justify-center text-white shadow-lg shadow-amber-600/30"
        >
          <SafeIcon name="calendar" size={24} />
        </button>
      </div>
    </div>
  )
}

export default App