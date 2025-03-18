import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage, useForm, Head } from "@inertiajs/react";
import TextInput from "@/Components/TextInput.jsx";
import InputLabel from "@/Components/InputLabel.jsx";
import InputError from "@/Components/InputError.jsx";
import TextAreaInput from "@/Components/TextAreaInput.jsx";
import SelectComponent from "@/Components/Select.jsx";
import { presidenteElectoOptions } from "../../../../resources/utilFunctions/dataStructures";

const RegisterPresident = () => {
    const { codJuntaRiego } = usePage().props;
    console.log("props", usePage().props);
    console.log("Cod Junta", codJuntaRiego);

    const { data, setData, post, processing, errors, reset } = useForm({
        // Presidente electo
        cod_junta_riego: codJuntaRiego,
        presidente_electo: "",
        cedula_presidente_junta_riego_e: "",
        nombres_presidente_junta_riego_e: "",
        email_presidente_junta_riego_e: "",
        telefono_presidente_junta_riego_e: "",
        fecha_caducidad: "",
        observaciones: "",
    });

    const onChangeHandler = (fieldId) => (event) => {
        setData(fieldId, event.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("juntasRiego.registerPresidente"), {
            onSuccess: () => {
                reset();
                alert("Presidente registrado con éxito!");
            },
            onError: (errors) => {
                console.log("Log en la parte del error", data);
                console.error("Error:", errors);
            },
        });
    };
    return (
        <AuthenticatedLayout>
            <Head title="Registro de Presidente Junta Riego" />

            <div className="flex min-h-screen flex-col bg-gray-100 pt-6 sm:pt-0">
                <div className="mb-6 mt-6 w-full max-w-5xl mx-auto overflow-hidden bg-white px-6 py-4 shadow-md sm:rounded-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h3 className="text-xl font-semibold mb-3 text-gray-800">
                            Resgistro de Presidente Junta de Riego
                        </h3>

                        {/* Tipo Presidente */}
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="presidente_electo"
                                value={"Presidente Electo"}
                            />
                            <SelectComponent
                                id="presidente_electo"
                                name="presidente_electo"
                                placeholder="Elegir electo o ratificado"
                                value={data.presidente_electo}
                                onChange={onChangeHandler("presidente_electo")}
                                options={presidenteElectoOptions}
                                required
                            />
                            <InputError
                                message={errors.presidente_electo}
                                className="mt-2"
                            />
                        </div>

                        {/* cedula presidente Electo */}
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="cedula_presidente_junta_riego_e"
                                value={"Cédula"}
                            />
                            <TextInput
                                id="cedula_presidente_junta_riego_e"
                                type="text"
                                name="cedula_presidente_junta_riego_e"
                                value={data.cedula_presidente_junta_riego_e}
                                className="mt-1 block w-full"
                                autoComplete="cedula_presidente_junta_riego_e"
                                onChange={onChangeHandler(
                                    "cedula_presidente_junta_riego_e"
                                )}
                                required
                            />
                            <InputError
                                message={errors.cedula_presidente_junta_riego_e}
                                className="mt-2"
                            />
                        </div>

                        {/* nombres presidente Electo */}
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="nombres_presidente_junta_riego_e"
                                value={"Nombres"}
                            />
                            <TextInput
                                id="nombres_presidente_junta_riego_e"
                                type="text"
                                name="nombres_presidente_junta_riego_e"
                                value={data.nombres_presidente_junta_riego_e}
                                className="mt-1 block w-full"
                                autoComplete="nombres_presidente_junta_riego_e"
                                onChange={onChangeHandler(
                                    "nombres_presidente_junta_riego_e"
                                )}
                                required
                            />
                            <InputError
                                message={
                                    errors.nombres_presidente_junta_riego_e
                                }
                                className="mt-2"
                            />
                        </div>

                        {/* email presidente Electo */}
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="email_presidente_junta_riego_e"
                                value={"Correo Electrónico"}
                            />
                            <TextInput
                                id="email_presidente_junta_riego_e"
                                type="email"
                                name="email_presidente_junta_riego_e"
                                value={data.email_presidente_junta_riego_e}
                                className="mt-1 block w-full"
                                autoComplete="email_presidente_junta_riego_e"
                                onChange={onChangeHandler(
                                    "email_presidente_junta_riego_e"
                                )}
                                required
                            />
                            <InputError
                                message={errors.email_presidente_junta_riego_e}
                                className="mt-2"
                            />
                        </div>

                        {/* telefono de contacto presidente electo */}
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="telefono_presidente_junta_riego_e"
                                value={"Teléfono de Contacto"}
                            />
                            <TextInput
                                id="telefono_presidente_junta_riego_e"
                                type="text"
                                name="telefono_presidente_junta_riego_e"
                                value={data.telefono_presidente_junta_riego_e}
                                className="mt-1 block w-full"
                                autoComplete="telefono_presidente_junta_riego_e"
                                onChange={onChangeHandler(
                                    "telefono_presidente_junta_riego_e"
                                )}
                                required
                            />
                            <InputError
                                message={
                                    errors.telefono_presidente_junta_riego_e
                                }
                                className="mt-2"
                            />
                        </div>

                        {/* fecha de caducidad de las funciones del presidente electo */}
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="fecha_caducidad"
                                value={"Fecha de Caducidad"}
                            />
                            <TextInput
                                id="fecha_caducidad"
                                type="date"
                                name="fecha_caducidad"
                                value={data.fecha_caducidad}
                                className="mt-1 block w-full"
                                autoComplete="fecha_caducidad"
                                onChange={onChangeHandler("fecha_caducidad")}
                            />
                            <InputError
                                message={errors.fecha_caducidad}
                                className="mt-2"
                            />
                        </div>

                        {/* Observaciones */}
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="observaciones"
                                value={"Observaciones"}
                            />
                            <TextAreaInput
                                id="observaciones"
                                name="observaciones"
                                value={data.observaciones}
                                className="mt-1 block w-full"
                                onChange={onChangeHandler("observaciones")}
                                placeholder="Ingrese sus observaciones aquí..."
                                rows={5} // Optional: Adjust the number of visible text lines
                            />
                            <InputError
                                message={errors.observaciones}
                                className="mt-2"
                            />
                        </div>

                        {/* BOTÓN GUARDAR */}
                        <div className="mb-6">
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 border 
                                        border-transparent rounded-md font-semibold text-xs 
                                        text-white uppercase tracking-widest hover:bg-indigo-700 
                                        focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none 
                                        focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
                                        transition ease-in-out duration-150 disabled:bg-gray-400"
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default RegisterPresident;
