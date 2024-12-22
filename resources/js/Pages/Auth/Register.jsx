import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { oficinaTecnica, roles } from "../../../dataSets/set.js";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        names: "",
        last_names: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
        provincia_oficina_tecnica: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("users.store"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Register" />

            <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
                <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                    <form onSubmit={submit}>
                        <div>
                            <InputLabel htmlFor="names" value="Nombres" />

                            <TextInput
                                id="names"
                                name="names"
                                value={data.names}
                                className="mt-1 block w-full"
                                autoComplete="names"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("names", e.target.value)
                                }
                                required
                            />

                            <InputError
                                message={errors.names}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="last_names"
                                value="Apellidos"
                            />

                            <TextInput
                                id="last_names"
                                name="last_names"
                                value={data.last_names}
                                className="mt-1 block w-full"
                                autoComplete="last_names"
                                isFocused={false}
                                onChange={(e) =>
                                    setData("last_names", e.target.value)
                                }
                                required
                            />

                            <InputError
                                message={errors.last_names}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="role" value="Rol" />

                            <select
                                id="role"
                                name="role"
                                value={data.role}
                                onChange={(e) =>
                                    setData("role", e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                required
                            >
                                <option value="" disabled>
                                    Elegir rol del usuario
                                </option>
                                {roles.map((rol) => (
                                    <option key={rol.id} value={rol.rol}>
                                        {rol.label}
                                    </option>
                                ))}
                            </select>

                            <InputError
                                message={errors.role}
                                className="mt-2"
                            />
                        </div>
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="provincia_oficina_tecnica"
                                value="Oficina Técnica"
                            />

                            <select
                                id="provincia_oficina_tecnica"
                                name="provincia_oficina_tecnica"
                                value={data.provincia_oficina_tecnica}
                                onChange={(e) =>
                                    setData(
                                        "provincia_oficina_tecnica",
                                        e.target.value
                                    )
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                required
                            >
                                <option value="" disabled>
                                    Elegir la oficina técnica
                                </option>
                                {oficinaTecnica.map((oficina) => (
                                    <option
                                        key={oficina.id}
                                        value={oficina.provincia}
                                    >
                                        {oficina.label}
                                    </option>
                                ))}
                            </select>

                            <InputError
                                message={errors.provincia_oficina_tecnica}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="email" value="Email" />

                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                required
                            />

                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="Password" />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                required
                            />

                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4">
                            <InputLabel
                                htmlFor="password_confirmation"
                                value="Confirm Password"
                            />

                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value
                                    )
                                }
                                required
                            />

                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4 flex items-center justify-end">
                            <PrimaryButton
                                className="ms-4"
                                disabled={processing}
                            >
                                Registrar Usuario
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
