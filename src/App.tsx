import * as chrono from 'chrono-node';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Input } from './components/ui/input';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTheme } from './providers/theme';
import { DateTable } from './components/date_table';
import { Calendar } from './components/ui/calendar';
import { Kbd } from './components/kbd';
import { toast } from 'react-toastify';
import { useGlobalSlashFocus } from './hooks/useGlobalSlashFocus';

export function App() {
  const { setTheme } = useTheme();
  const [showNumbers, setShowNumbers] = useState(false)
  const [input, setInput] = useState("Tomorrow");
  const iptRef = useRef<HTMLInputElement>(null);
  const parsed = useMemo(() => {
    const date = chrono.parseDate(input);
    return {
      raw: date,
      formatted: date
        ? date.toLocaleDateString(navigator.language, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
        : "",
    };
  }, [input]);

  const dateParts = [
    { label: "Date", key: "date", options: { day: "2-digit" as const } },
    { label: "Day", key: "weekday", options: { weekday: "long" as const } },
    { label: "Month", key: "month", options: { month: "long" as const } },
    { label: "Year", key: "year", options: { year: "numeric" as const } },
  ];

  useEffect(() => {
    window.parent.postMessage({ type: "clutch-extension-ready" }, "*");
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "theme") setTheme(e.data.theme);
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Copied to clipboard!"))
      .catch((err) => {
        toast.error("Failed to copy text :(")
        console.error("Failed to copy text: ", err);
      })
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      console.log(e.key)
      if(e.altKey && e.key === "ArrowLeft") {
        window.parent.postMessage({ type: "clutch-extension-navigate", path: "/" }, "*");
      }

      if (e.key === "Control") {
        setShowNumbers(true);
      }
      // if ctrl down *and* a digit 1–n, fire that copy:
      if (e.ctrlKey && /^[1-9]$/.test(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        const part = dateParts[idx];
        if (parsed.raw && part) {
          const text = parsed.raw.toLocaleDateString(
            navigator.language,
            part.options
          );
          copyText(text);
        }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Control") {
        setShowNumbers(false);
      }
    };
    window.
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [parsed.raw, dateParts]);


  useGlobalSlashFocus(iptRef);

  return (
    <div className="bg-transparent">
      <Input
        ref={iptRef}
        className="h-[50px] rounded-none border-0 border-b pl-15"
        placeholder={`Type "/" to focus...`}
        value={input}
        onChange={(e) => setInput(e.currentTarget.value)}
      />

      <div className="grid grid-cols-2 h-[199px] relative border-b">
        <div className="grid place-content-center text-2xl font-bold border-r px-5 text-center">
          {input}
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-1/2 py-5 z-10 bg-background">
          <ArrowRight />
        </div>
        <div className="grid place-content-center text-2xl font-bold px-5 text-center">
          {parsed.formatted || ""}
        </div>
      </div>

      <div className='grid grid-cols-2 divide-x-1 divide-solid'>
        <DateTable
          parsed={parsed}
          dateParts={dateParts}
          copyText={copyText}
          showNumbers={showNumbers}
        />
        <div className='mx-auto'>
          <Calendar />
        </div>
      </div>
      <footer className='border-t flex items-center justify-between gap-2 px-2 h-[35px]'>
        <div>Clutch</div>
        <div className='flex gap-1'>
          <div className='flex gap-1 items-center'>
            <span className='text-xs'>Press</span>
            <Kbd className='static'>Ctrl</Kbd>
            <Kbd className='static'>+1~4</Kbd>
            <span className='text-xs'>to copy,</span>
          </div>
          <div className='flex gap-1 items-center'>
            <Kbd className='static'>/</Kbd>
            <span className='text-xs'>to focus input and </span>
          </div>
          <div className='flex gap-1 items-center'>
            <Kbd className='static'>Alt</Kbd>
            <Kbd className='static'><ArrowLeft size={14}/></Kbd>
            <span className='text-xs'>to navigate back</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
