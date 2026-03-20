import { motion } from 'motion/react';

const steps = [
  {
    number: '01',
    title: 'Haz tu pregunta',
    text: 'Escribe en lenguaje natural cualquier duda sobre vivienda, legislación, hipotecas o alquileres. Nuestra IA entiende el contexto y la intención de tu consulta.',
  },
  {
    number: '02',
    title: 'Procesamos los datos',
    text: 'Analizamos miles de páginas de legislación vigente, datos de mercado de fuentes oficiales y estadísticas actualizadas en tiempo real para construir una respuesta precisa.',
  },
  {
    number: '03',
    title: 'Recibe tu respuesta',
    text: 'Obtienes una respuesta clara, personalizada y fundamentada en datos reales. Además, puedes utilizar nuestros simuladores para explorar diferentes escenarios.',
  },
];

const ComoFunciona = () => {
  return (
    <section id="como-funciona" className="py-32 lg:py-40 bg-black">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-white mb-6 tracking-tight"
        >
          ¿Cómo funciona?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="text-zinc-400 text-lg leading-relaxed mb-16"
        >
          InfoVivienda combina inteligencia artificial con datos oficiales para
          ofrecerte respuestas fiables sobre el mercado inmobiliario y la
          legislación de vivienda en España.
        </motion.p>

        <div className="space-y-14">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-6"
            >
              <span className="text-cyan-500/30 text-5xl font-bold leading-none select-none">
                {step.number}
              </span>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-zinc-500 leading-relaxed">
                  {step.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComoFunciona;
