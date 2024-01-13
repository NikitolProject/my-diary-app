import { atom, useAtom } from "jotai";

import IRecord from "@/types/record";
import { Mail, mails } from "@/app/diary/data";

type Config = {
  selected: IRecord["id"] | null
}

const configAtom = atom<Config>({
  selected: mails[0].id,
})

export function useMail() {
  return useAtom(configAtom)
}
