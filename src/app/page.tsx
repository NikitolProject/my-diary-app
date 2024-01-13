"use client"

import HomePage from "./diary/page"
import LoadingPage from "./diary/loading/page"

import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri'
import IRecord from "@/types/record";

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (localStorage.getItem("theme") === null) {
      localStorage.setItem("theme", "system");
    }

    if (localStorage.getItem("locale") === null) {
      localStorage.setItem("locale", "en");
    }

    invoke<string>('init_directory', {})
      .then((res) => {
        if (res !== "success") {
          return;
        }

        invoke<string>('get_all_records', {})
          .then((res: any) => {
            localStorage.setItem("records", res);
            setIsLoading(true);
          })
      });
  }, [isLoading, setIsLoading]);

  if (isLoading) {
    return <HomePage />
  };

  return <LoadingPage />
};
