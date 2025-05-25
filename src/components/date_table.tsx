import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils";
import { Clipboard } from "lucide-react";
import { Kbd } from "./kbd";

type DateTableProps = {
  parsed: {
    raw: Date | null;
    formatted: string;
  };
  dateParts: {
    label: string;
    key: string;
    options: Intl.DateTimeFormatOptions;
  }[];
  showNumbers: boolean;

  copyText: (text: string) => void;
}

export function DateTable({ parsed, dateParts, showNumbers, copyText }: DateTableProps) {
  return (
    <Table>
      <TableBody className="text-lg">
        {parsed.raw &&
          dateParts.map(({ label, options }, i) => {
            const text = parsed.raw?.toLocaleDateString(
              navigator.language,
              options
            );
            return (
              <TableRow
                key={label}
                className="cursor-pointer"
                onClick={() => text && copyText(text)}
              >
                <TableCell>
                  {label}
                </TableCell>
                <TableCell className="flex gap-2 items-center justify-end relative">
                  <span>{text}</span>
                  <Kbd className={cn(
                    showNumbers ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
                  )}>
                    {i + 1}
                  </Kbd>
                  <Clipboard size={20} />
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  )
}
