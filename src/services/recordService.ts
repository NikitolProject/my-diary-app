import IRecord from '@/types/record';
import { invoke } from '@tauri-apps/api/tauri'

const BreakException = {};

export default class RecordService {
    protected recordList: Array<IRecord>;

    public constructor() {
        if (localStorage.getItem("records") === undefined) {
            this.recordList = [];
        } else {
            this.recordList = JSON.parse(localStorage.getItem("records")!);
        };
    };

    list = async () => {
        return this.recordList;
    };

    get = async (id: string) => {
        const result = await invoke<string>('get_record', {uuid: id});

        if (result === "error" || result === "file_not_found") {
            // console.log(result);
            throw Error;
        } 

        return JSON.parse(result);
    }

    add = async (name: string, text: string, date: string) => {
        const result = await invoke<string>('add_record', {payload: {name, text, date}});
        console.log(result)

        if (result !== "error") {
            this.recordList.push({id: result, name, text, date});
            return result;
        }

        throw Error;
    };

    put = async (id: string, name: string, text: string, date: string) => {
        const result = await invoke<string>('put_record', {payload: {id, name, text, date}});

        if (result !== "success") {
            throw Error;
        } 

        try {
            this.recordList.forEach((el) => {
                if (el.id === id) {
                    el.name = name;
                    el.date = date;
                    el.text = el.text;
                    
                    throw BreakException;
                };
            });

            return;
        } catch (BreakException) {
            return;
        }
    }

    delete = async (id: string) => {
        const result = await invoke<string>('delete_record', {uuid: id});

        if (result === "success") {
            try {
                this.recordList.forEach((el) => {
                    if (el.id !== id) {
                        return;
                    };
    
                    const idx = this.recordList.indexOf(el);
                    
                    if (idx === -1) {
                        throw BreakException;
                    };
    
                    this.recordList.splice(idx, 1);
                    throw BreakException;
                })
                return;
            } catch (BreakException) {
                return;
            };
        };

        throw Error;
    };
};
