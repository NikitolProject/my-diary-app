"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslation } from "@/hooks/use-translation";
import { Languages } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

export default () => {
  const translation = useTranslation();
  const router = useRouter();
  const [locale, setLocale] = useState<string | undefined>(undefined);

  const onChangeLocale = (value: string) => {
    localStorage.setItem("locale", value);
    setLocale(value);
    router.refresh();
  };

  useEffect(() => {
    if (window !== undefined && locale === undefined) {
      setLocale(localStorage.getItem("locale")!);
    };
  }, [locale, setLocale]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Languages className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          {translation.translate("main_page:display:change-locale:heading")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={locale} onValueChange={onChangeLocale}>
          <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="ru">Русский</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};