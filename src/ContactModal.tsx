import { useCallback, useEffect, useState } from 'react'

const CONTACT_EMAIL = 'Ndulukomesuli02@gmail.com'
const CONTACT_MODAL_MS = 280

const BUSINESS_TYPES = [
  'Web development / frontend',
  'Backend / APIs',
  'IT support & systems',
  'Full-stack project',
  'Consulting / collaboration',
  'Other',
] as const

type ContactModalProps = {
  open: boolean
  visible: boolean
  onRequestClose: () => void
  onOverlayTransitionEnd: (e: React.TransitionEvent<HTMLDivElement>) => void
}

const inputClass =
  'mt-1.5 w-full rounded-lg border border-primary/35 bg-[rgba(12,14,16,0.55)] px-3 py-2.5 text-[0.95rem] text-portfolio-text placeholder:text-portfolio-muted/70 outline-none ring-primary/0 transition-[border-color,box-shadow] focus:border-primary/60 focus:ring-2 focus:ring-primary/25'

const labelClass = 'block text-[0.82rem] font-medium uppercase tracking-[0.08em] text-portfolio-muted'

export function ContactModal({
  open,
  visible,
  onRequestClose,
  onOverlayTransitionEnd,
}: ContactModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [businessType, setBusinessType] = useState<string>(BUSINESS_TYPES[0])
  const [details, setDetails] = useState('')

  useEffect(() => {
    if (!open) {
      setName('')
      setEmail('')
      setPhone('')
      setBusinessType(BUSINESS_TYPES[0])
      setDetails('')
    }
  }, [open])

  const submit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const body = [
        `Name: ${name.trim()}`,
        `Email: ${email.trim()}`,
        phone.trim() ? `Phone: ${phone.trim()}` : null,
        `Type of business / discussion: ${businessType}`,
        '',
        details.trim() || '(No additional details)',
      ]
        .filter(Boolean)
        .join('\n')
      const subject = `Portfolio inquiry — ${businessType}`
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      onRequestClose()
    },
    [name, email, phone, businessType, details, onRequestClose],
  )

  if (!open) return null

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-end justify-center p-[clamp(0.65rem,2.5vw,1rem)] pb-[clamp(1.75rem,5vw,2.5rem)] sm:items-center sm:p-4 sm:pb-4 transition-opacity ease-out motion-reduce:transition-none ${
        visible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      style={{ transitionDuration: `${CONTACT_MODAL_MS}ms` }}
      onTransitionEnd={onOverlayTransitionEnd}
    >
      <button
        type="button"
        className="absolute inset-0 z-[1] bg-black/45 backdrop-blur-[3px]"
        aria-label="Close contact form"
        onClick={onRequestClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-dialog-title"
        className={`relative z-[2] max-h-[min(90vh,560px)] w-full max-w-[min(26rem,calc(100vw-1rem))] overflow-y-auto rounded-2xl border border-primary/40 bg-[rgba(12,14,18,0.92)] p-[clamp(1rem,3vw,1.35rem)] shadow-[0_0_48px_rgba(0,255,157,0.18),0_24px_48px_rgba(0,0,0,0.55)] backdrop-blur-[18px] transition-[transform] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
          visible ? 'translate-y-0 scale-100' : 'translate-y-5 scale-[0.97]'
        }`}
        style={{ transitionDuration: `${CONTACT_MODAL_MS}ms` }}
      >
        <button
          type="button"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 text-portfolio-muted transition-colors hover:border-primary hover:text-primary"
          aria-label="Close"
          onClick={onRequestClose}
        >
          <i className="fas fa-times" aria-hidden />
        </button>
        <h2
          id="contact-dialog-title"
          className="pr-12 text-xl font-semibold text-primary"
        >
          Get in touch
        </h2>
        <p className="mt-2 text-[0.9rem] leading-relaxed text-portfolio-muted">
          Share your details and what you&apos;d like to discuss. Your email app will open with a
          draft you can send.
        </p>
        <form className="mt-5 flex flex-col gap-4" onSubmit={submit}>
          <div>
            <label className={labelClass} htmlFor="contact-name">
              Name <span className="text-primary">*</span>
            </label>
            <input
              id="contact-name"
              className={inputClass}
              name="name"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="contact-email">
              Email <span className="text-primary">*</span>
            </label>
            <input
              id="contact-email"
              className={inputClass}
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="contact-phone">
              Phone <span className="normal-case text-portfolio-muted/60">(optional)</span>
            </label>
            <input
              id="contact-phone"
              className={inputClass}
              type="tel"
              name="phone"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="If you prefer a call-back"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="contact-business-type">
              Type of business to discuss <span className="text-primary">*</span>
            </label>
            <select
              id="contact-business-type"
              className={`${inputClass} cursor-pointer appearance-none bg-[length:1rem] bg-[right_0.65rem_center] bg-no-repeat pr-10`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2300ff9d'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              }}
              name="businessType"
              required
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
            >
              {BUSINESS_TYPES.map((t) => (
                <option key={t} value={t} className="bg-[#0c0e12] text-portfolio-text">
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="contact-details">
              More details <span className="normal-case text-portfolio-muted/60">(optional)</span>
            </label>
            <textarea
              id="contact-details"
              className={`${inputClass} min-h-[5.5rem] resize-y`}
              name="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Project scope, timeline, or anything else helpful"
              rows={4}
            />
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="submit"
              className="rounded-xl border border-primary/30 bg-primary px-5 py-2.5 text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#111] shadow-[0_10px_28px_rgba(0,255,157,0.22)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(0,255,157,0.28)]"
            >
              Open email draft
            </button>
            <button
              type="button"
              className="rounded-xl border border-primary/45 bg-[rgba(12,14,16,0.45)] px-5 py-2.5 text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-primary backdrop-blur-[6px] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-primary/10"
              onClick={onRequestClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
