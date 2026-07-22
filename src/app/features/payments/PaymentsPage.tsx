import { useEffect, useState, type FormEvent } from "react";
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  LoaderCircle,
  LockKeyhole,
  ReceiptText,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";

interface ReniecPerson {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
}

type SearchStatus = "idle" | "loading" | "success" | "error";

const emptyPerson: ReniecPerson = {
  nombres: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
};

function getText(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return "";
}

function normalizePerson(payload: unknown): ReniecPerson {
  if (!payload || typeof payload !== "object") throw new Error("La respuesta de RENIEC no es válida.");

  const root = payload as Record<string, unknown>;
  const nested = root.data;
  const source = nested && typeof nested === "object" ? nested as Record<string, unknown> : root;
  const person = {
    nombres: getText(source, ["nombres", "nombre", "names", "first_name"]),
    apellidoPaterno: getText(source, ["apellido_paterno", "apellidoPaterno", "paternalSurname", "first_last_name"]),
    apellidoMaterno: getText(source, ["apellido_materno", "apellidoMaterno", "maternalSurname", "second_last_name"]),
  };

  if (!person.nombres || (!person.apellidoPaterno && !person.apellidoMaterno)) {
    throw new Error("No se encontraron datos para el DNI ingresado.");
  }
  return person;
}

function ReadonlyField({ label, value, placeholder }: { label: string; value: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[.12em] text-slate-500">{label}</span>
      <input
        value={value}
        readOnly
        aria-readonly="true"
        placeholder={placeholder ?? "Se completará con RENIEC"}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm font-semibold text-[#19345D] outline-none placeholder:font-normal placeholder:text-slate-300"
      />
    </label>
  );
}

export function PaymentsPage() {
  const [dni, setDni] = useState("");
  const [person, setPerson] = useState<ReniecPerson>(emptyPerson);
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [message, setMessage] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    setPerson(emptyPerson);
    setMessage("");

    if (dni.length !== 8) {
      setStatus("idle");
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setStatus("loading");
      try {
        const response = await fetch(`/api/reniec/${dni}`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        const payload: unknown = await response.json().catch(() => null);
        if (!response.ok) {
          const apiMessage = payload && typeof payload === "object" && "message" in payload
            ? String((payload as { message: unknown }).message)
            : "No pudimos consultar RENIEC en este momento.";
          throw new Error(apiMessage);
        }

        setPerson(normalizePerson(payload));
        setStatus("success");
      } catch (error) {
        if (controller.signal.aborted) return;
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "No pudimos consultar RENIEC en este momento.");
      }
    }, 350);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [dni, retry]);

  const changeDni = (value: string) => {
    setDni(value.replace(/\D/g, "").slice(0, 8));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (status !== "success") return;
    setMessage("Datos verificados. Ya puedes continuar con la pasarela de pago.");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-7 sm:px-7 lg:px-9 lg:py-10">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#287665]">
            <ShieldCheck size={14} /> Identidad protegida
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#19345D] sm:text-3xl">Realiza tu pago</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">Verifica los datos del titular con su DNI antes de continuar.</p>
        </div>
        <div className="flex items-center gap-2 self-start rounded-full border border-[#287665]/15 bg-[#EAF5F1] px-3 py-2 text-[10px] font-bold text-[#287665] sm:self-auto">
          <LockKeyhole size={13} /> Consulta segura
        </div>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <form onSubmit={submit} className="overflow-hidden rounded-[24px] border border-black/5 bg-white shadow-sm">
          <div className="flex items-center gap-4 border-b border-slate-100 px-5 py-5 sm:px-7">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0E8] text-[#E76F3C]"><UserRound size={20} /></span>
            <div>
              <h2 className="text-base font-bold text-[#19345D]">Datos del titular</h2>
              <p className="mt-0.5 text-xs text-slate-400">Los datos se completan automáticamente.</p>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-7">
            <label className="block">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[.12em] text-slate-500">DNI del titular</span>
              <span className="relative block">
                <input
                  value={dni}
                  onChange={(event) => changeDni(event.target.value)}
                  inputMode="numeric"
                  autoComplete="off"
                  pattern="[0-9]{8}"
                  maxLength={8}
                  placeholder="Ingresa los 8 dígitos"
                  aria-describedby="dni-status"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-4 pr-12 text-sm font-semibold tracking-[.12em] text-[#19345D] outline-none transition placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-300 focus:border-[#F07845] focus:ring-4 focus:ring-[#F07845]/10"
                  required
                />
                <span className="absolute right-3 top-2.5 flex h-7 w-7 items-center justify-center text-slate-400">
                  {status === "loading" ? <LoaderCircle className="animate-spin" size={18} /> :
                    status === "success" ? <CheckCircle2 className="text-[#287665]" size={18} /> : <Search size={18} />}
                </span>
              </span>
              <div id="dni-status" aria-live="polite" className="mt-2 min-h-5 text-xs">
                {dni.length > 0 && dni.length < 8 && <span className="text-slate-400">Faltan {8 - dni.length} dígitos.</span>}
                {status === "loading" && <span className="text-slate-500">Consultando datos en RENIEC...</span>}
                {status === "success" && <span className="font-semibold text-[#287665]">Identidad verificada correctamente.</span>}
                {status === "error" && (
                  <span className="inline-flex flex-wrap items-center gap-1.5 text-red-600">
                    <AlertCircle size={13} /> {message}
                    <button type="button" onClick={() => setRetry((value) => value + 1)} className="font-bold underline underline-offset-2">Reintentar</button>
                  </span>
                )}
              </div>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <ReadonlyField label="Nombres" value={person.nombres} />
              <ReadonlyField label="Apellido paterno" value={person.apellidoPaterno} />
              <ReadonlyField label="Apellido materno" value={person.apellidoMaterno} />
            </div>

            {status === "success" && message && (
              <div aria-live="polite" className="rounded-xl border border-[#287665]/20 bg-[#EAF5F1] px-4 py-3 text-xs font-semibold text-[#287665]">{message}</div>
            )}

            <button
              type="submit"
              disabled={status !== "success"}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#19345D] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#19345D]/10 transition hover:bg-[#102641] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
            >
              <CreditCard size={17} /> Continuar al pago
            </button>
            <p className="text-center text-[10px] leading-5 text-slate-400">La consulta se usa únicamente para validar al titular de esta operación.</p>
          </div>
        </form>

        <aside className="overflow-hidden rounded-[24px] bg-[#19345D] text-white shadow-xl shadow-[#19345D]/10">
          <div className="border-b border-white/10 p-6">
            <div className="flex items-center gap-2 text-xs font-bold text-[#FFD59E]"><ReceiptText size={16} /> Resumen</div>
            <p className="mt-5 text-[10px] uppercase tracking-[.14em] text-white/45">Concepto</p>
            <h2 className="mt-1 text-base font-bold">Pensión escolar · Julio 2026</h2>
            <p className="mt-1 text-xs text-white/50">Vencimiento: 31 de julio</p>
          </div>
          <div className="space-y-3 p-6 text-xs">
            <div className="flex justify-between text-white/55"><span>Pensión mensual</span><span>S/ 680.00</span></div>
            <div className="flex justify-between text-white/55"><span>Cargo administrativo</span><span>S/ 0.00</span></div>
            <div className="my-4 h-px bg-white/10" />
            <div className="flex items-end justify-between">
              <span className="font-semibold">Total a pagar</span>
              <strong className="text-2xl tracking-tight text-[#FFD59E]">S/ 680.00</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
