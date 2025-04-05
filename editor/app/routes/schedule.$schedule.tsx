import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseZonedDateTime } from "@internationalized/date";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation, useSubmit } from "@remix-run/react";
import { lstatSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { normalizeUrl } from "~/util/normalizeUrl";

const schema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    image: z.string(),
    stageId: z.string(),
    eventId: z.string(),
    speakers: z.array(z.string()),
    startDate: z.string(),
    endDate: z.string(),
    resource: z.array(
      z.object({
        fileName: z.string(),
        image: z.string(),
        url: z.string().url(),
        size: z.string(),
      }),
    ),
})

type Schema = z.infer<typeof schema>;

const base = join(process.cwd(), "../src/content");
const content = "schedule";
const basePath = join(base, content);
const stagePath = join(base, "stage");
const eventPath = join(base, "event");
const peoplePath = join(base, "people");

export const loader: LoaderFunction = async () => {
    let dirList = (await readdir(basePath))
        .filter((f) => !lstatSync(join(basePath, f)).isDirectory())
        .map((x) => x.replace(".json", ""))

    let stages = await Promise.all((await readdir(stagePath))
        .filter((f) => !lstatSync(join(stagePath, f)).isDirectory())
        .map(async (x) => {
            return {
                id: x.replace(".json", ""),
                data: JSON.parse(String(await readFile(join(stagePath, x))))
            }
        }))
    
    let events = await Promise.all((await readdir(eventPath))
        .filter((f) => !lstatSync(join(eventPath, f)).isDirectory())
        .map(async (x) => {
            return {
                id: x.replace(".json", ""),
                data: JSON.parse(String(await readFile(join(eventPath, x))))
            }
        }))

    let people = await Promise.all((await readdir(peoplePath))
        .filter((f) => !lstatSync(join(peoplePath, f)).isDirectory())
        .map(async (x) => {
            return {
                id: x.replace(".json", ""),
                data: JSON.parse(String(await readFile(join(peoplePath, x))))
            }
        }))
      
    return { dirList, stages, events, people }
}

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const { id, ...data }: Schema = JSON.parse(String(formData.get("data")) ?? "{}");

    await writeFile(join(basePath, `${id}.json`), JSON.stringify(data, null, 2));

    return {
        ok: true
    }
}

export default function ScheduleNew() {
    const { dirList, stages, events, people } = useLoaderData<{ dirList: string[], stages: any[], events: any[], people: any[] }>()
    const { control, formState: { errors }, handleSubmit, watch } = useForm<Schema>({ resolver: zodResolver(schema), defaultValues: {
        resource: []
    } });
    const resources = useFieldArray({ control, name: "resource" });
    const submit = useSubmit();
    const actionData = useActionData();
    const navigation = useNavigation();
    
    function onSubmit(data: Schema) {
        if (dirList.includes(data.id)) {
            alert("Ya existe un people con el mismo ID")

            return;
        }

        submit({
            data: JSON.stringify({
                ...data,
                startDate: parseZonedDateTime(data.startDate + "[America/New_York]").toDate().toISOString(),
                endDate: parseZonedDateTime(data.endDate + "[America/New_York]").toDate().toISOString(),
            }),
        }, { method: "post" })
    }

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold mb-4">Crear schedule</h1>
            <p>{JSON.stringify(errors, null, 2)}</p>
            <p>{JSON.stringify(actionData ?? {}, null, 2)}</p>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="id"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Input
                            label="ID"
                            type="text"
                            {...field}
                            onChange={(e) => field.onChange(normalizeUrl(e.target.value))}
                        />
                    )}
                />
                <Controller
                    name="name"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Input
                            label="name"
                            type="text"
                            {...field}
                        />
                    )}
                />
                <Controller
                    name="description"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Textarea
                            label="description"
                            type="text"
                            {...field}
                        />
                    )}
                />
                <Controller
                    name="image"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Input
                            label="image"
                            type="text"
                            {...field}
                        />
                    )}
                />
                <Controller
                    name="stageId"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Select label="Escenario" items={stages} {...field}>
                            {(s) => <SelectItem key={s.id}>{s.data.name}</SelectItem>}
                        </Select>
                    )}
                />
                <Controller
                    name="eventId"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Select label="Evento" items={events} {...field}>
                            {(s) => <SelectItem key={s.id}>{s.data.name}</SelectItem>}
                        </Select>
                    )}
                />
                <Controller
                    name="speakers"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Select label="Speaker" items={people} selectionMode="multiple" selectedKeys={field.value} onChange={(e) => field.onChange(e.target.value.split(","))}>
                            {(s) => <SelectItem key={s.id}>{s.data.name}</SelectItem>}
                        </Select>
                    )}
                />
                <Controller
                    name="startDate"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Input
                            label="startDate"
                            type="datetime-local"
                            defaultValue={new Date().toISOString().slice(0,16)}
                            {...field}
                        />
                    )}
                />
                <Controller
                    name="endDate"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Input
                            label="endDate"
                            type="datetime-local"
                            defaultValue={new Date().toISOString().slice(0,16)}
                            {...field}
                        />
                    )}
                />
                <div>
                    <h2 className="mb-2">Recursos</h2>
                    <div className="space-y-4">
                        {resources.fields.map((_, index) => (
                            <div key={`form-network-${index}`} className="flex items-center gap-4">
                                <Controller
                                    name={`resource.${index}.fileName`}
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Input
                                            label="fileName"
                                            type="text"
                                            {...field}
                                        />
                                    )}
                                />
                                <Controller
                                    name={`resource.${index}.image`}
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Input
                                            label="image"
                                            type="text"
                                            {...field}
                                        />
                                    )}
                                />
                                <Controller
                                    name={`resource.${index}.url`}
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Input
                                            label="url"
                                            type="text"
                                            {...field}
                                        />
                                    )}
                                />
                                <Controller
                                    name={`resource.${index}.size`}
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Input
                                            label="size"
                                            type="text"
                                            {...field}
                                        />
                                    )}
                                />
                                <Button color="danger" onPress={() => resources.remove(index)}>Eliminar</Button>
                            </div>
                        ))}
                        <div>
                            <Button
                                color="primary"
                                onPress={() => resources.append({ fileName: "", image: "", url: "", size: "" })}
                            >
                                Añadir recurso
                            </Button>
                        </div>
                    </div>
                </div>
                <div>
                    <Button type="submit" fullWidth isLoading={navigation.state === "submitting"}>Guardar</Button>
                </div>
            </form>
        </div>
    )
}