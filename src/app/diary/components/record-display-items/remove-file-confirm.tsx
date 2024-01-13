import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRecord } from "@/hooks/use-record";
import IRecord from "@/types/record";
import { Mail } from "@/app/diary/data"
import { useState } from "react"
import { Trash2 } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

interface RemoveFileConfirmAlertProps {
  updateState: any;
  record: IRecord | undefined;
  setRecord: any;
};

export default ({ updateState, record, setRecord }: RemoveFileConfirmAlertProps) => {
  const translation = useTranslation();

  const onDeleteRecord = (isConfirmed: boolean) => {
    if (!isConfirmed) {
      return;
    }

    let new_records = [...updateState[0]];
    
    new_records.forEach((element: Mail) => {
      if (element.id === record!.id) {
        const idx = new_records.indexOf(element);
        new_records.splice(idx, 1);
        return;
      }
    });

    let all_records: IRecord[] = JSON.parse(localStorage.getItem("records")!);

    all_records.forEach((element: Mail) => {
      if (element.id === record!.id) {
        const idx = all_records.indexOf(element);
        all_records.splice(idx, 1);
        return;
      }
    });

    localStorage
      .setItem("records", JSON.stringify(all_records));

    useRecord()
      .remove(record!.id).then((_) => {});
    
    updateState[1](new_records);
    setRecord(undefined);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Trash2 className="h-4 w-4" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{translation.translate("main_page:display:remove_file_confirm:heading")}</AlertDialogTitle>
          <AlertDialogDescription>
            {translation.translate("main_page:display:remove_file_confirm:description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => {onDeleteRecord(false)}}>
            {translation.translate("main_page:display:remove_file_confirm:action:cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => {onDeleteRecord(true)}}>
            {translation.translate("main_page:display:remove_file_confirm:action:confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}