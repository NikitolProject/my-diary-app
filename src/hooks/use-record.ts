import RecordService from "@/services/recordService";

export const useRecord = () => {
    const recordService = new RecordService();

    const list = async () => {
        return await recordService.list();
    };

    const get = async (id: string) => {
        return await recordService.get(id);
    };

    const add = async (name: string, text: string, date: string) => {
        const id = await recordService.add(name, text, date);

        return id;
    };

    const put = async (id: string, name: string, text: string, date: string) => {
        return await recordService.put(id, name, text, date);
    };

    const remove = async (id: string) => {
        return await recordService.delete(id);
    };

    return { list, get, add, put, remove };
};