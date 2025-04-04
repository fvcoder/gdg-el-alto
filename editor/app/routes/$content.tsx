import { LoaderFunction } from "@remix-run/node"
import { Link, useLoaderData, useParams } from "@remix-run/react";
import { existsSync, lstatSync } from "fs";
import { readdir, readFile } from "fs/promises";
import { join } from "path";

export const loader: LoaderFunction = async (c) => {
    const base = join(process.cwd(), "../src/content");
    const content = c.params.content as string;
    const basePath = join(base, content);
  
    if (!existsSync(basePath)) {
        throw new Response(null, {
            status: 404,
            statusText: "Not Found",
        });
    }
  
    let dirList = await Promise.all(
      (await readdir(basePath))
        .filter((f) => !lstatSync(join(basePath, f)).isDirectory())
        .map(async (x) => {
          const filePath = join(basePath, x);
          const fileContent = JSON.parse(String(await readFile(filePath)));
  
          const data = {
            id: x.replace(".json", ""),
            name: "",
            relation: "",
          };
  
          if (content === "schedule") {
            data.name = fileContent.name;
            data.relation = fileContent.eventId;
          }
          if (content === "event") {
            data.name = fileContent.name;
            data.relation = fileContent.location;
          }
          if (content === "location") {
            data.name = fileContent.direction;
            data.relation = fileContent.name;
          }
          if (content === "people") {
            data.name = fileContent.jobTitle;
            data.relation = fileContent.name;
          }
          if (content === "stage") {
            data.name = fileContent.direction;
            data.relation = fileContent.name;
          }
  
          return data;
        }),
    );
  
    dirList = dirList.sort((a, b) => a.relation.localeCompare(b.relation));
    
    return {
        dirList
    }
}

export default function ListFiles() {
    const { dirList } = useLoaderData<{ dirList: any[] }>()
    const params = useParams()

    return (
      <>
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">{params.content}</h1>
            <Link to="./new" className="px-4 py-2 bg-blue-500 text-white rounded-2xl">Crear</Link>
        </div>
        <div className="flex flex-col gap-1 text-blue-500 underline">
            {dirList.map((x) => (
                <a href={`/${params.content}/${x.id}`} key={x.id}>
                    {x.relation} - {x.name}
                </a>
            ))}
        </div>
      </>

    )
}