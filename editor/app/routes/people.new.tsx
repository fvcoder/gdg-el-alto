import { Button, Input, Textarea } from "@heroui/react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import { useActionData, useLoaderData, useNavigation, useSubmit } from "@remix-run/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { join } from "node:path";
import { lstatSync } from "node:fs";
import { readdir, writeFile } from "node:fs/promises";
import { normalizeUrl } from "~/util/normalizeUrl";

const schema = z.object({
    id: z.string(),
    name: z.string(),
    bio: z.string(),
    image: z.string(),
    jobTitle: z.string(),
    networks: z.array(
      z.object({
        provider: z.string(),
        username: z.string(),
        url: z.string().url(),
      }),
    ),
})

type Schema = z.infer<typeof schema>

const base = join(process.cwd(), "../src/content");
const content = "people";
const basePath = join(base, content);

export const loader: LoaderFunction = async () => {
    let dirList = (await readdir(basePath))
            .filter((f) => !lstatSync(join(basePath, f)).isDirectory())
            .map((x) => x.replace(".json", ""))
      
    return { dirList }
}


export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const { id, ...data }: Schema = JSON.parse(String(formData.get("data")) ?? "{}");

    await writeFile(join(basePath, `${id}.json`), JSON.stringify(data, null, 2));

    return {
        ok: true
    }
}

export default function NewPeople() {
    const { dirList } = useLoaderData<{ dirList: string[] }>()
    const { control, handleSubmit, formState: { errors } } = useForm<Schema>({ resolver: zodResolver(schema) })
    const fields = useFieldArray({ control, name: "networks" })
    const submit = useSubmit();
    const actionData = useActionData();
    const navigation = useNavigation();

    function onSubmit(data: Schema) {
        if (dirList.includes(data.id)) {
            alert("Ya existe un people con el mismo ID")

            return;
        }

        submit({
            data: JSON.stringify(data),
        }, { method: "post" })
    }

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold mb-4">Crear people</h1>
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
                    name="bio"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Textarea
                            label="bio"
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
                    name="jobTitle"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Input
                            label="jobTitle"
                            type="text"
                            {...field}
                        />
                    )}
                />
                <div>
                    <h2 className="mb-2">Redes Sociales</h2>
                    <div className="space-y-4">
                        {fields.fields.map((_, index) => (
                            <div key={`form-network-${index}`} className="flex items-center gap-4">
                                <Controller
                                    name={`networks.${index}.provider`}
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Input
                                            label="provider"
                                            type="text"
                                            {...field}
                                        />
                                    )}
                                />
                                <Controller
                                    name={`networks.${index}.username`}
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Input
                                            label="username"
                                            type="text"
                                            {...field}
                                        />
                                    )}
                                />
                                <Controller
                                    name={`networks.${index}.url`}
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
                                <Button color="danger" onPress={() => fields.remove(index)}>Eliminar</Button>
                            </div>
                        ))}
                        <div>
                            <Button
                                color="primary"
                                onPress={() => fields.append({ provider: "", username: "", url: "" })}
                            >
                                Añadir red social
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