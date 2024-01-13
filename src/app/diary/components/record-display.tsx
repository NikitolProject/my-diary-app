import format from "date-fns/format"
import {
  Trash2,
  Moon,
  Languages,
  Calendar as CalendarIcon
} from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Mail } from "@/app/diary/data"
import { useRecord } from "@/hooks/use-record"
import { useEffect, useState } from "react"
import { Tiptap } from "./tiptap-editor"
import { Editor } from "@tiptap/react"
import MenuBar from './tiptap-items/menu-bar'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Typography from '@tiptap/extension-typography'
import { SmilieReplacer } from "@/features/tiptap/extensions/SmileReplacer"
import formatISO from "date-fns/formatISO"
import endOfSecond from "date-fns/endOfSecond"
import { parseISO } from "date-fns"
import IRecord from "@/types/record"
import RemoveFileConfirm from "./record-display-items/remove-file-confirm"
import ChangeLocale from "./record-display-items/change-locale"
import { useTranslation } from "@/hooks/use-translation"

interface MailDisplayProps {
  mail: Mail | null,
  updateState: any
}

const createEditor = (text: any, onChange: any) => {
  return new Editor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-desc",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "p-4 my-4 border-s-4 border-gray-300 bg-gray-50 dark:border-gray-500 dark:bg-gray-800",
          },
        },
      }),
      Highlight,
      Typography,
      TaskList.configure({
        HTMLAttributes: {
          class: "list-decimal",
        }
      }),
      TaskItem,
      SmilieReplacer,
    ],
    content: text,
    onUpdate(props) {
      onChange(props.editor.getJSON());
    },
  });
};

export function MailDisplay({ mail, updateState }: MailDisplayProps) {
  const { setTheme } = useTheme()
  const [record, setRecord] = useState<Mail | undefined>(undefined);
  const [editor, setEditor] = useState<Editor | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const translation = useTranslation();

  const onChangeTitle = (e: any) => {
    const currentRecord = JSON.parse(localStorage.getItem("currentRecord")!);
    let new_record = {...currentRecord!};
    new_record.name = e.target.value;
    setRecord(new_record);

    let new_records = [...updateState[0]];
    
    new_records.forEach((element: Mail) => {
      if (element.id === new_record.id) {
        element.name = e.target.value;
        return;
      }
    });

    let all_records: IRecord[] = JSON.parse(localStorage.getItem("records")!)

    all_records.forEach((element: Mail) => {
      if (element.id === new_record.id) {
        element.name = e.target.value;
        return;
      }
    });

    localStorage
      .setItem("records", JSON.stringify(all_records));

    updateState[1](new_records);

    useRecord().put(
      currentRecord!.id,
      e.target.value,
      currentRecord!.text.length !== 0 ? currentRecord!.text : "--undefiend--",
      currentRecord!.date
    ).then((_) => {});
  };

  const onChangeDate = (e: any) => {
    const currentDate = formatISO(endOfSecond(e));
    const currentRecord = JSON.parse(localStorage.getItem("currentRecord")!);
    let new_record = {...currentRecord!};
    new_record.date = currentDate;
    setRecord(new_record);

    let new_records = [...updateState[0]];
    
    new_records.forEach((element: Mail) => {
      if (element.id === new_record.id) {
        element.date = currentDate;
        return;
      }
    });

    let all_records: IRecord[] = JSON.parse(localStorage.getItem("records")!)

    all_records.forEach((element: Mail) => {
      if (element.id === new_record.id) {
        element.date = currentDate;
        return;
      }
    });

    localStorage
      .setItem("records", JSON.stringify(all_records));

    updateState[1](new_records);

    useRecord().put(
      currentRecord!.id,
      currentRecord!.name,
      currentRecord!.text.length !== 0 ? currentRecord!.text : "--undefiend--",
      currentDate
    ).then((_) => {});
  };

  const onChangeText = (e: any) => {
    let new_records = [...updateState[0]];
    let new_record = { ...record! };

    const content = JSON.stringify(e);
    new_record.text = content;
    setRecord(new_record);

    new_records = new_records.map((element) =>
      element.id === record!.id ? { ...element, text: content } : element
    );

    updateState[1](new_records);

    useRecord()
      .put(record!.id, record!.name, content, record!.date)
      .then((_) => {});
  };

  const onChangeTheme = () => {
    const theme = localStorage.getItem("theme");

    if (theme == "dark") {
      setTheme("light");
      return;
    };

    setTheme("dark");
  };

  useEffect(() => {
    if (mail && record === undefined) {
      setRecord(mail);

      useRecord()
        .get(mail.id)
        .then((res) => {
          localStorage.setItem("currentRecord", JSON.stringify(res));
          setIsLoading(true);
        })
        .catch((error) => {
          console.error('There was an error!', error);
        });
    } else if (mail && record?.id !== mail.id) {
      setRecord(mail);

      useRecord()
        .get(mail.id)
        .then((res) => {
          localStorage.setItem("currentRecord", JSON.stringify(res));
          setIsLoading(true);
        })
        .catch((error) => {
          console.error('There was an error!', error);
        });
    }

    if (isLoading) {
      const currentRecord = JSON.parse(localStorage.getItem("currentRecord")!);

      if (currentRecord.text.length !== 0) {
        setEditor(createEditor(JSON.parse(currentRecord.text), onChangeText));
      } else if (currentRecord.text.length === 0) {
        setEditor(createEditor({type: "doc", content: []}, onChangeText));
      }

      setIsLoading(false);
    }
  }, [mail, editor, isLoading, setRecord, setEditor, setIsLoading]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          <Tooltip>
            <Popover>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={!record}>
                    <CalendarIcon className="h-4 w-4" />
                    <span className="sr-only">
                      {translation.translate("main_page:display:action:change_date_in_record")}
                    </span>
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>
              <PopoverContent className="flex p-0">
                <div className="p-0">
                  {record && editor !== undefined ? (
                    <Calendar selected={parseISO(record.date)} onDayClick={onChangeDate} />
                  ) : (
                    <Calendar onDayClick={onChangeDate} />
                  )}
                </div>
              </PopoverContent>
            </Popover>
            <TooltipContent>
              {translation.translate("main_page:display:action:change_date_in_record")}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!record}>
                {record && editor !== undefined ? (
                  <RemoveFileConfirm updateState={updateState} record={record} setRecord={setRecord} />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {translation.translate("main_page:display:action:delete_selected_record")}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {translation.translate("main_page:display:action:delete_selected_record")}
            </TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="mx-1 h-6" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Tooltip>
            <Popover>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <ChangeLocale />
                    <span className="sr-only">
                      {translation.translate("main_page:display:action:change_app_locale")}
                    </span>
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>
            </Popover>
            <TooltipContent>
              {translation.translate("main_page:display:action:change_app_locale")}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <Popover>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onChangeTheme}>
                    <Moon className="h-4 w-4" />
                    <span className="sr-only">
                      {translation.translate("main_page:display:action:change_app_theme")}
                    </span>
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>
            </Popover>
            <TooltipContent>
              {translation.translate("main_page:display:action:change_app_theme")}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <Separator />
      {record && editor !== undefined ? (
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <div className="grid gap-1">
                <div className="font-semibold">
                  <input className="outline-none bg-transparent" onChange={onChangeTitle} value={record.name} />
                </div>
              </div>
            </div>
            {record.date && (
              <div className="ml-auto text-xs text-muted-foreground">
                {format(new Date(record.date), "PP")}
              </div>
            )}
          </div>
          <Separator />
          {editor && <MenuBar editor={editor} />}
          <Separator />
          <div className="flex-1 p-4 h-64 w-full max-h-[75vh] max-w-full overflow-x-auto overflow-y-scroll">
            <Tiptap editor={editor}/>
          </div>
          <Separator className="mt-auto" />
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          {translation.translate("main_page:display:record_not_selected")}
        </div>
      )}
    </div>
  )
}
