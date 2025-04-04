import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { lstatSync } from "fs";
import { readdir } from "fs/promises";
import { join } from "path";

export const loader: LoaderFunction = async () => {
const base = join(process.cwd(), "../src/content");
  const dirList = (await readdir(base)).filter((f) => lstatSync(join(base, f)).isDirectory());

  return {
    dirList
  }
}

export default function Index() {
  const { dirList } = useLoaderData<{ dirList: string[] }>()

  return (
      <div className="flex flex-col gap-1 text-blue-500 underline">
        {dirList.map((x) => (
          <a href={`/${x}`} key={x}>
            {x}
          </a>
        ))}
      </div>
  );
}
