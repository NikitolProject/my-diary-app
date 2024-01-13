"use client"
import * as React from "react"
import {
  PenLine,
  AlertCircle,
  Archive,
  File,
  Inbox,
  MessagesSquare,
  PenBox,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { MailDisplay } from "@/app/diary/components/record-display"
import { MailList } from "@/app/diary/components/record-list"
import { Mail } from "@/app/diary/data"
import { useMail } from "@/hooks/use-mail"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { useRecord } from "@/hooks/use-record"
import formatISO from "date-fns/formatISO"
import endOfSecond from "date-fns/endOfSecond"
import IRecord from "@/types/record"
import { parseISO } from "date-fns"
import { invoke } from "@tauri-apps/api/tauri"
import { useTranslation } from "@/hooks/use-translation"

interface MailProps {
  accounts: {
    label: string
    email: string
    icon: React.ReactNode
  }[]
  mails: Mail[]
  defaultLayout: number[] | undefined
  defaultCollapsed?: boolean
  navCollapsedSize: number
}

export function Mail({
  accounts,
  mails,
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [mail] = useMail();

  const translation = useTranslation();

  const [records, setRecords] = React.useState<IRecord[]>([]);

  React.useEffect(() => {
    if (records.length === 0 || isUpdating) {
      setRecords(JSON.parse(localStorage.getItem("records")!));
      setIsUpdating(false);
    };
  }, [records, isUpdating, setIsUpdating, setRecords]);

  const searchRecord = (e: any) => {
    const lowerCaseQuery = e.target.value.toLowerCase();

    const all_records: IRecord[] = JSON.parse(localStorage.getItem("records")!)

    const new_records = [...all_records
      .filter(record => record.name.toLowerCase().includes(lowerCaseQuery))
      .sort((a, b) => a.name.localeCompare(b.name))];

    setRecords(new_records);
  };

  const addNewRecord = () => {
    const current_date = formatISO(endOfSecond(new Date()));

    useRecord()
      .add("Untitled", "", current_date)
      .then((value) => {
        let new_records = [...records, {
          id: value, 
          name: translation.translate("main_page:action:add_record:title"), 
          text: "", 
          date: current_date
        }];
        setRecords(new_records);

        let all_records: IRecord[] = JSON.parse(localStorage.getItem("records")!)
        all_records.push({
          id: value, 
          name: translation.translate("main_page:action:add_record:title"), 
          text: "", 
          date: current_date
        })
        localStorage.setItem("records", JSON.stringify(all_records));

        mail.selected = value;
      });
  };

  records.sort((a: IRecord, b: IRecord) => {
    return parseISO(b.date).getTime() - parseISO(a.date).getTime()
  })

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`
        }}
        className="h-full max-h-[800px] items-stretch"
      >
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">{translation.translate("main_page:heading")}</h1>
              <div className="ml-auto">
                <Tooltip>
                  <TooltipTrigger>
                    <Button variant="ghost" size="icon" onClick={addNewRecord}>
                      <PenLine className="h-4 w-4"/>
                      <span className="sr-only">{translation.translate("main_page:action:add_record")}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {translation.translate("main_page:action:add_record")}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder={translation.translate("main_page:action:search_records")} className="pl-8" onChange={searchRecord} />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0">
              <MailList items={records} />
            </TabsContent>
  
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]}>
          <MailDisplay
            mail={records.find((item) => item.id === mail.selected) || null}
            updateState={[records, setRecords]}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
